"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactFlow, {
	Background,
	Controls,
	MiniMap,
	ReactFlowProvider,
	PanOnScrollMode,
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

async function videoToThumbnailDataUrl(file: File): Promise<string | undefined> {
	const url = URL.createObjectURL(file);
	try {
		const video = document.createElement("video");
		video.src = url;
		video.muted = true;
		video.playsInline = true;
		video.preload = "metadata";

		await new Promise<void>((resolve, reject) => {
			video.onloadedmetadata = () => resolve();
			video.onerror = () => reject(new Error("動画の読み込みに失敗しました"));
		});

		const duration = Number.isFinite(video.duration) ? video.duration : 0;
		const targetTime = duration > 0 ? Math.min(0.1, Math.max(0, duration - 0.01)) : 0;
		if (targetTime > 0) {
			video.currentTime = targetTime;
			await new Promise<void>((resolve, reject) => {
				video.onseeked = () => resolve();
				video.onerror = () => reject(new Error("動画のシークに失敗しました"));
			});
		}

		const vw = video.videoWidth;
		const vh = video.videoHeight;
		if (!vw || !vh) return undefined;

		const targetWidth = 240;
		const scale = targetWidth / vw;
		const canvas = document.createElement("canvas");
		canvas.width = targetWidth;
		canvas.height = Math.max(1, Math.floor(vh * scale));
		const ctx = canvas.getContext("2d");
		if (!ctx) return undefined;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

		// エディタ表示用なので低画質でOK
		return canvas.toDataURL("image/jpeg", 0.5);
	} finally {
		URL.revokeObjectURL(url);
	}
}

async function imageToThumbnailDataUrl(file: File): Promise<string | undefined> {
	const url = URL.createObjectURL(file);
	try {
		const img = document.createElement("img");
		img.decoding = "async";
		img.src = url;
		await new Promise<void>((resolve, reject) => {
			img.onload = () => resolve();
			img.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
		});

		const iw = img.naturalWidth;
		const ih = img.naturalHeight;
		if (!iw || !ih) return undefined;

		const targetWidth = 240;
		const scale = targetWidth / iw;
		const canvas = document.createElement("canvas");
		canvas.width = targetWidth;
		canvas.height = Math.max(1, Math.floor(ih * scale));
		const ctx = canvas.getContext("2d");
		if (!ctx) return undefined;
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

		// エディタ表示用なので低画質でOK
		return canvas.toDataURL("image/jpeg", 0.6);
	} finally {
		URL.revokeObjectURL(url);
	}
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
	const { setViewport, getViewport, setCenter } = useReactFlow();
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
				const xStep = 320;
				const maxExistingY = nodes.reduce((acc, n) => Math.max(acc, n.position.y), 0);
				let rowY = nodes.length > 0 ? maxExistingY + 220 : 80;
				const newlyAddedAssets: ProjectAsset[] = [];
				const newlyAddedNodes: Node<SlideNodeData>[] = [];
				const newlyAddedEdges: Edge[] = [];

				for (const file of fileArray) {
					const name = file.name;
					const lower = name.toLowerCase();
					if (lower.endsWith(".pdf")) {
						const assetId = nanoid();
						await putAssetBlob(assetId, file);
						newlyAddedAssets.push(createAssetMeta("pdf", name, assetId));

						const thumbs = await pdfToThumbnails(file);
						const pdfNodes: Node<SlideNodeData>[] = thumbs.map((thumb, index) => {
							const nodeId = nanoid();
							return {
								id: nodeId,
								type: "slide",
								position: { x: baseX + index * xStep, y: rowY },
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
							};
						});

						for (let i = 0; i < pdfNodes.length - 1; i++) {
							newlyAddedEdges.push({
								id: nanoid(),
								source: pdfNodes[i].id,
								target: pdfNodes[i + 1].id,
								label: "",
							});
						}

						newlyAddedNodes.push(...pdfNodes);
						rowY += 220;
						continue;
					}

					if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
						const assetId = nanoid();
						await putAssetBlob(assetId, file);
						newlyAddedAssets.push(createAssetMeta("image", name, assetId));

						let thumbnailDataUrl: string | undefined;
						try {
							thumbnailDataUrl = await imageToThumbnailDataUrl(file);
						} catch {
							thumbnailDataUrl = undefined;
						}

						newlyAddedNodes.push({
							id: nanoid(),
							type: "slide",
							position: { x: baseX, y: rowY },
							data: {
								label: `IMG: ${name}`,
								asset: { kind: "image", assetId, fileName: name, thumbnailDataUrl },
							},
						});
						rowY += 220;
						continue;
					}

					if (lower.endsWith(".mp4")) {
						const assetId = nanoid();
						await putAssetBlob(assetId, file);
						newlyAddedAssets.push(createAssetMeta("video", name, assetId));

						let thumbnailDataUrl: string | undefined;
						try {
							thumbnailDataUrl = await videoToThumbnailDataUrl(file);
						} catch {
							thumbnailDataUrl = undefined;
						}
						newlyAddedNodes.push({
							id: nanoid(),
							type: "slide",
							position: { x: baseX, y: rowY },
							data: {
								label: `VIDEO: ${name}`,
								asset: { kind: "video", assetId, fileName: name, thumbnailDataUrl },
							},
						});
						rowY += 220;
						continue;
					}
				}

				if (newlyAddedNodes.length > 0) {
					setNodes((prev) => [...prev, ...newlyAddedNodes]);
				}
				if (newlyAddedEdges.length > 0) {
					setEdges((prev) => [...prev, ...newlyAddedEdges]);
				}

				if (newlyAddedAssets.length > 0) {
					setAssets((prev) => [...prev, ...newlyAddedAssets]);
				}
			} finally {
				setIsImporting(false);
			}
		},
		[nodes, setEdges, setNodes],
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
		input.accept = ".pdf,.mp4,.png,.jpg,.jpeg";
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

	const iconStyle: React.CSSProperties = {
		width: 16,
		height: 16,
		display: "inline-block",
		flex: "0 0 auto",
	};

	const buttonStyle: React.CSSProperties = {
		display: "inline-flex",
		alignItems: "center",
		gap: 6,
		height: 32,
		padding: "0 10px",
	};

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
				<button onClick={onHomeClick} style={buttonStyle} aria-label="ホームに戻る">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
						<path d="M3 10.5L12 3l9 7.5" />
						<path d="M5 10v10h14V10" />
					</svg>
					ホーム
				</button>
				<button onClick={goPresent} style={buttonStyle} aria-label="再生">
					<svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle}>
						<path d="M8 5v14l11-7z" />
					</svg>
					再生
				</button>
				<button onClick={onImportClick} disabled={isImporting} style={buttonStyle} aria-label="素材取り込み">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
						<path d="M12 21V9" />
						<path d="M7 14l5-5 5 5" />
						<path d="M5 3h14v6H5z" />
					</svg>
					{isImporting ? "取込中..." : "素材取り込み (D&D可)"}
				</button>
				<button
					onClick={deleteSelected}
					disabled={selectedNodeIds.length + selectedEdgeIds.length === 0}
					style={buttonStyle}
					aria-label="選択削除"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
						<path d="M3 6h18" />
						<path d="M8 6V4h8v2" />
						<path d="M6 6l1 16h10l1-16" />
					</svg>
					選択削除
				</button>
				<button onClick={onSaveProject} style={buttonStyle} aria-label="プロジェクト保存">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
						<path d="M12 3v12" />
						<path d="M7 10l5 5 5-5" />
						<path d="M5 21h14" />
					</svg>
					保存
				</button>
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
						minZoom={0.05}
						panOnScroll
						panOnScrollMode={PanOnScrollMode.Free}
						zoomOnScroll={false}
						selectionOnDrag
						panOnDrag={[1, 2]}
						fitView
					>
						<Background />
						<MiniMap
							position="bottom-right"
							onClick={(_, pos) => {
								const vp = getViewport();
								setCenter(pos.x, pos.y, { zoom: vp.zoom });
							}}
						/>
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
