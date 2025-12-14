"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactFlow, {
	Background,
	Controls,
	MiniMap,
	ReactFlowProvider,
	addEdge,
	useEdgesState,
	useNodesState,
	useReactFlow,
	type Connection,
	type Edge,
	type Node,
} from "reactflow";
import { nanoid } from "nanoid";
import { SlideNode } from "@/components/editor/nodes/SlideNode";
import {
	clearEditorStorage,
	getLastSavedHash,
	loadFromLocalStorage,
	saveToLocalStorage,
	setLastSavedHash,
	type ProjectAsset,
	type SerializedFlow,
	type SlideNodeData,
} from "@/lib/presentation";
import { clearAllAssetBlobs, putAssetBlob } from "@/lib/idbAssets";
import { saveProjectAsZip, loadProjectFromZip, loadProjectFromZipFile } from "@/lib/projectArchive";
import { createAssetMeta } from "@/lib/projectFolder";

function hashString(input: string): string {
	// djb2
	let hash = 5381;
	for (let i = 0; i < input.length; i++) {
		hash = (hash * 33) ^ input.charCodeAt(i);
	}
	return (hash >>> 0).toString(16);
}

function computeFlowHash(flow: SerializedFlow): string {
	// viewport は保存対象外なので hash から除外
	const minimal = {
		version: flow.version,
		assets: flow.assets ?? [],
		nodes: flow.nodes,
		edges: flow.edges,
	};
	return hashString(JSON.stringify(minimal));
}

const EMPTY_FLOW_HASH = computeFlowHash({ version: 1, assets: [], nodes: [], edges: [] });

async function pdfToThumbnails(file: File): Promise<Array<{ page: number; dataUrl?: string }>> {
	const arrayBuffer = await file.arrayBuffer();
	// pdfjs-dist は bundler 相性があるため legacy を使用
	const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
	pdfjs.GlobalWorkerOptions.workerSrc = new URL(
		"pdfjs-dist/legacy/build/pdf.worker.min.mjs",
		import.meta.url,
	).toString();

	const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
	const pdf = await loadingTask.promise;
	const results: Array<{ page: number; dataUrl?: string }> = [];

	for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
		const page = await pdf.getPage(pageIndex);
		const viewport = page.getViewport({ scale: 1 });
		const targetWidth = 240;
		const scale = targetWidth / viewport.width;
		const scaledViewport = page.getViewport({ scale });

		const canvas = document.createElement("canvas");
		canvas.width = Math.floor(scaledViewport.width);
		canvas.height = Math.floor(scaledViewport.height);
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			results.push({ page: pageIndex });
			continue;
		}
		await page.render({ canvasContext: ctx, canvas, viewport: scaledViewport }).promise;
		results.push({ page: pageIndex, dataUrl: canvas.toDataURL("image/png") });
	}

	return results;
}

function flowFromState(nodes: Node<SlideNodeData>[], edges: Edge[], assets: ProjectAsset[]): SerializedFlow {
	return {
		version: 1,
		assets,
		nodes: nodes.map((node) => ({
			id: node.id,
			type: node.type,
			position: node.position,
			data: node.data,
		})),
		edges: edges.map((edge) => ({
			id: edge.id,
			source: edge.source,
			target: edge.target,
			label: typeof edge.label === "string" ? edge.label : undefined,
		})),
	};
}

function stateFromFlow(flow: SerializedFlow): { nodes: Node<SlideNodeData>[]; edges: Edge[] } {
	return {
		nodes: flow.nodes.map((node) => ({
			id: node.id,
			type: node.type,
			position: node.position,
			data: node.data,
		})),
		edges: flow.edges.map((edge) => ({
			id: edge.id,
			source: edge.source,
			target: edge.target,
			label: edge.label,
		})),
	};
}

function InnerEditor() {
	const router = useRouter();
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const { setViewport, getViewport } = useReactFlow();
	const [nodes, setNodes, onNodesChange] = useNodesState<SlideNodeData>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [assets, setAssets] = useState<ProjectAsset[]>([]);
	const [isHydrated, setIsHydrated] = useState(false);
	const [isImporting, setIsImporting] = useState(false);
	const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
	const [selectedEdgeIds, setSelectedEdgeIds] = useState<string[]>([]);
	const [showLeaveWarning, setShowLeaveWarning] = useState(false);
	const [lastSavedHash, setLastSavedHashState] = useState<string | null>(null);

	const nodeTypes = useMemo(() => ({ slide: SlideNode }), []);

	useEffect(() => {
		const persistedLastSavedHash = getLastSavedHash();
		setLastSavedHashState(persistedLastSavedHash);

		const saved = loadFromLocalStorage();
		if (!saved) {
			setAssets([]);
			setNodes([]);
			setEdges([]);
			setIsHydrated(true);
			return;
		}

		// 過去バージョンで「Start」スライドが自動生成されていた場合、未保存プロジェクトであれば
		// それを“空キャンバス”として扱って、エディタ突入時に Start が出ないようにする。
		const looksLikeLegacyAutoStart =
			!persistedLastSavedHash &&
			(saved.assets?.length ?? 0) === 0 &&
			saved.nodes.length === 1 &&
			saved.edges.length === 0 &&
			saved.nodes[0]?.type === "slide" &&
			saved.nodes[0]?.data?.label === "Start";
		if (looksLikeLegacyAutoStart) {
			setAssets([]);
			setNodes([]);
			setEdges([]);
			if (saved.viewport) {
				setViewport(saved.viewport);
			}
			setIsHydrated(true);
			return;
		}

		setAssets(saved.assets ?? []);
		const { nodes: restoredNodes, edges: restoredEdges } = stateFromFlow(saved);
		setNodes(restoredNodes);
		setEdges(restoredEdges);

		// ★ここに追加：保存された表示位置があれば復元
		if (saved.viewport) {
			setViewport(saved.viewport);
		}
		setIsHydrated(true);
	}, [setEdges, setNodes, setViewport]); // <--- 依存配列に setViewport を追加

	const currentFlowHash = useMemo(() => {
		const flow = flowFromState(nodes, edges, assets);
		return computeFlowHash(flow);
	}, [assets, edges, nodes]);

	const isDirty = useMemo(() => {
		if (!isHydrated) return false;
		if (lastSavedHash) return currentFlowHash !== lastSavedHash;
		return currentFlowHash !== EMPTY_FLOW_HASH;
	}, [currentFlowHash, isHydrated, lastSavedHash]);

	useEffect(() => {
		if (!isHydrated) return;
		const flow = flowFromState(nodes, edges, assets);
		const currentViewport = getViewport();

		saveToLocalStorage({
			...flow,
			viewport: currentViewport,
		});
	}, [nodes, edges, assets, getViewport, isHydrated]); // <--- 依存配列に getViewport を追加

	const onConnect = useCallback(
		(connection: Connection) => {
			setEdges((eds) => addEdge({ ...connection, label: "" }, eds));
		},
		[setEdges],
	);

	const onSelectionChange = useCallback(
		(params: { nodes: Node<SlideNodeData>[]; edges: Edge[] }) => {
			setSelectedNodeIds(params.nodes.map((n) => n.id));
			setSelectedEdgeIds(params.edges.map((e) => e.id));
		},
		[],
	);

	const addSlideNode = useCallback(() => {
		setNodes((prev) => {
			const maxY = prev.reduce((acc, n) => Math.max(acc, n.position.y), 0);
			return [
				...prev,
				{
					id: nanoid(),
					type: "slide",
					position: { x: 420, y: maxY + 220 },
					data: { label: "Slide" },
				},
			];
		});
	}, [setNodes]);

	const deleteSelected = useCallback(() => {
		if (selectedNodeIds.length === 0 && selectedEdgeIds.length === 0) return;
		setEdges((prevEdges) => {
			const nodeIdSet = new Set(selectedNodeIds);
			const edgeIdSet = new Set(selectedEdgeIds);
			return prevEdges.filter(
				(e) =>
					!edgeIdSet.has(e.id) && !nodeIdSet.has(e.source) && !nodeIdSet.has(e.target),
			);
		});
		setNodes((prevNodes) => prevNodes.filter((n) => !selectedNodeIds.includes(n.id)));
		setSelectedNodeIds([]);
		setSelectedEdgeIds([]);
	}, [selectedEdgeIds, selectedNodeIds, setEdges, setNodes]);

	const selectedNode = useMemo(() => {
		if (selectedNodeIds.length !== 1) return null;
		return nodes.find((n) => n.id === selectedNodeIds[0]) ?? null;
	}, [nodes, selectedNodeIds]);

	const selectedEdge = useMemo(() => {
		if (selectedEdgeIds.length !== 1) return null;
		return edges.find((e) => e.id === selectedEdgeIds[0]) ?? null;
	}, [edges, selectedEdgeIds]);

	const updateSelectedNodeLabel = useCallback(
		(nextLabel: string) => {
			if (!selectedNode) return;
			setNodes((prev) =>
				prev.map((n) => (n.id === selectedNode.id ? { ...n, data: { ...n.data, label: nextLabel } } : n)),
			);
		},
		[selectedNode, setNodes],
	);

	const updateSelectedEdgeLabel = useCallback(
		(nextLabel: string) => {
			if (!selectedEdge) return;
			setEdges((prev) => prev.map((e) => (e.id === selectedEdge.id ? { ...e, label: nextLabel } : e)));
		},
		[selectedEdge, setEdges],
	);

	const importFiles = useCallback(
		async (files: FileList | File[]) => {
			const fileArray = Array.from(files);
			if (fileArray.length === 0) return;
			setIsImporting(true);
			try {
				const baseX = 80;
				let y = 80;
				const newlyAddedAssets: ProjectAsset[] = [];

				for (const file of fileArray) {
					const name = file.name;
					const lower = name.toLowerCase();
					if (lower.endsWith(".pdf")) {
						const assetId = nanoid();
						await putAssetBlob(assetId, file);
						newlyAddedAssets.push(createAssetMeta("pdf", name, assetId));

						const thumbs = await pdfToThumbnails(file);
						setNodes((prev) => {
							const next = [...prev];
							for (const thumb of thumbs) {
								next.push({
									id: nanoid(),
									type: "slide",
									position: { x: baseX, y },
									data: {
										label: `PDF: ${name} / p${thumb.page}`,
										asset: {
											kind: "pdf",
											assetId,
											fileName: name,
											page: thumb.page,
											thumbnailDataUrl: thumb.dataUrl,
										},
									},
								});
								y += 220;
							}
							return next;
						});
						continue;
					}

					if (lower.endsWith(".mp4")) {
						const assetId = nanoid();
						await putAssetBlob(assetId, file);
						newlyAddedAssets.push(createAssetMeta("video", name, assetId));

						setNodes((prev) => [
							...prev,
							{
								id: nanoid(),
								type: "slide",
								position: { x: baseX, y },
								data: {
									label: `VIDEO: ${name}`,
									asset: { kind: "video", assetId, fileName: name },
								},
							},
						]);
						y += 220;
						continue;
					}
				}

				if (newlyAddedAssets.length > 0) {
					setAssets((prev) => [...prev, ...newlyAddedAssets]);
				}
			} finally {
				setIsImporting(false);
			}
		},
		[setNodes],
	);

	const onDrop = useCallback(
		async (event: React.DragEvent) => {
			event.preventDefault();
			const files = event.dataTransfer?.files;
			if (!files?.length) return;

			// wiislide.zip をそのままドロップで読み込み
			if (files.length === 1) {
				const file = files[0];
				if (file && file.name.toLowerCase().endsWith(".zip")) {
					try {
						const loaded = await loadProjectFromZipFile(file);
						const loadedHash = computeFlowHash(loaded);
						setLastSavedHash(loadedHash);
						setLastSavedHashState(loadedHash);
						setAssets(loaded.assets ?? []);
						const { nodes: restoredNodes, edges: restoredEdges } = stateFromFlow(loaded);
						setNodes(restoredNodes);
						setEdges(restoredEdges);
					} catch (e) {
						alert(`読み込みに失敗しました: ${e instanceof Error ? e.message : String(e)}`);
					}
					return;
				}
			}

			await importFiles(files);
		},
		[importFiles, setEdges, setNodes],
	);

	const onDragOver = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "copy";
	}, []);

	const onSaveProject = useCallback(async () => {
		try {
			// 保存直前に現在状態を反映（import直後でもassetsが落ちないように）
			const flow = flowFromState(nodes, edges, assets);
			saveToLocalStorage(flow);
			await saveProjectAsZip(flow);
			const savedHash = computeFlowHash(flow);
			setLastSavedHash(savedHash);
			setLastSavedHashState(savedHash);
			alert("wiislide.zip を保存しました");
		} catch (e) {
			alert(`保存に失敗しました: ${e instanceof Error ? e.message : String(e)}`);
		}
	}, [assets, edges, nodes]);

	const onLoadProject = useCallback(async () => {
		try {
			const loaded = await loadProjectFromZip();
			const loadedHash = computeFlowHash(loaded);
			setLastSavedHash(loadedHash);
			setLastSavedHashState(loadedHash);
			setAssets(loaded.assets ?? []);
			const { nodes: restoredNodes, edges: restoredEdges } = stateFromFlow(loaded);
			setNodes(restoredNodes);
			setEdges(restoredEdges);
		} catch (e) {
			alert(`読み込みに失敗しました: ${e instanceof Error ? e.message : String(e)}`);
		}
	}, [setEdges, setNodes]);

	const onImportClick = useCallback(async () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".pdf,.mp4";
		input.multiple = true;
		input.onchange = async () => {
			if (!input.files?.length) return;
			await importFiles(input.files);
		};
		input.click();
	}, [importFiles]);

	const clearAndGoHome = useCallback(async () => {
		try {
			clearEditorStorage();
			await clearAllAssetBlobs();
		} finally {
			router.push("/");
		}
	}, [router]);

	const onHomeClick = useCallback(() => {
		if (isDirty) {
			setShowLeaveWarning(true);
			return;
		}
		void clearAndGoHome();
	}, [clearAndGoHome, isDirty]);

	const goPresent = useCallback(() => {
		router.push("/present?auto=1&from=editor");
	}, [router]);

	return (
		<div
			ref={wrapperRef}
			onDrop={onDrop}
			onDragOver={onDragOver}
			style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}
		>
			<div
				style={{
					display: "flex",
					gap: 8,
					padding: 8,
					borderBottom: "1px solid #eee",
					alignItems: "center",
				}}
			>
				<button onClick={onHomeClick}>ホームに戻る</button>
				<button onClick={goPresent}>再生</button>
				<button onClick={onImportClick} disabled={isImporting}>
					{isImporting ? "取込中..." : "PDF/MP4 取込 (D&D可)"}
				</button>
				<button onClick={addSlideNode}>ノード追加</button>
				<button onClick={deleteSelected} disabled={selectedNodeIds.length + selectedEdgeIds.length === 0}>
					選択削除
				</button>
				<button onClick={onSaveProject}>プロジェクト保存</button>
				<button onClick={onLoadProject}>プロジェクト読み込み</button>
				{isDirty ? (
					<div style={{ fontSize: 12, color: "#b45309" }}>未保存</div>
				) : (
					<div style={{ fontSize: 12, color: "#16a34a" }}>保存済み</div>
				)}
				<div style={{ marginLeft: "auto", fontSize: 12, color: "#666" }}>
					ローカル自動保存: ON
				</div>
			</div>

			{showLeaveWarning ? (
				<div
					style={{
						padding: 12,
						borderBottom: "1px solid #eee",
						background: "#fff7ed",
						color: "#7c2d12",
						display: "flex",
						alignItems: "center",
						gap: 8,
						flexWrap: "wrap",
					}}
				>
					<div style={{ fontSize: 13, fontWeight: 600 }}>
						未保存の変更があります。このままホームに戻るとエディタはクリーンになります。
					</div>
					<div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
						<button
							onClick={async () => {
								await onSaveProject();
								setShowLeaveWarning(false);
								await clearAndGoHome();
							}}
						>
							保存してホームへ
						</button>
						<button
							onClick={async () => {
								setShowLeaveWarning(false);
								await clearAndGoHome();
							}}
						>
							破棄してホームへ
						</button>
						<button onClick={() => setShowLeaveWarning(false)}>キャンセル</button>
					</div>
				</div>
			) : null}

			<div style={{ flex: 1, display: "flex", minHeight: 0 }}>
				<div style={{ flex: 1 }}>
					<ReactFlow
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						onSelectionChange={onSelectionChange}
						nodeTypes={nodeTypes}
						fitView
					>
						<Background />
						<MiniMap />
						<Controls />
					</ReactFlow>
				</div>

				<div
					style={{
						width: 320,
						borderLeft: "1px solid #eee",
						padding: 12,
						overflow: "auto",
					}}
				>
					<div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Inspector</div>
					<div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
						選択: ノード {selectedNodeIds.length} / エッジ {selectedEdgeIds.length}
					</div>

					{selectedNode ? (
						<div style={{ marginBottom: 16 }}>
							<div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Node</div>
							<label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>ラベル</label>
							<input
								value={selectedNode.data.label}
								onChange={(e) => updateSelectedNodeLabel(e.target.value)}
								style={{ width: "100%" }}
							/>
						</div>
					) : null}

					{selectedEdge ? (
						<div style={{ marginBottom: 16 }}>
							<div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Edge</div>
							<label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>ラベル</label>
							<input
								value={typeof selectedEdge.label === "string" ? selectedEdge.label : ""}
								onChange={(e) => updateSelectedEdgeLabel(e.target.value)}
								style={{ width: "100%" }}
							/>
							<div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
								例: next / a / b / timeout
							</div>
						</div>
					) : null}

					{!selectedNode && !selectedEdge ? (
						<div style={{ fontSize: 12, color: "#666" }}>
							ノードを選択してラベル編集、エッジを選択して分岐名を付けられます。
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

export function EditorCanvas() {
	return (
		<ReactFlowProvider>
			<InnerEditor />
		</ReactFlowProvider>
	);
}
