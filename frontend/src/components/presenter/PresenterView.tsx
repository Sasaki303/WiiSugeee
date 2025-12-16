"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadFromLocalStorage, type SerializedFlow } from "@/lib/presentation";
import { getAssetBlob } from "@/lib/idbAssets";
import { useWiiController, type WiiState } from "@/hooks/useWiiController";
import { ReactionOverlay } from "@/components/presenter/ReactionOverlay";
import { formatAction, mergeBindings, type BindingAction } from "@/lib/buttonBindings";
import { getProjectBindings } from "@/lib/currentProjectStore";
import { WiiDisconnectPopup } from "@/components/presenter/WiiDisconnectPopup";

function PdfSlide(props: {
	assetId: string;
	page: number;
	fallbackDataUrl?: string;
	alt: string;
	getOrLoadPdfDocument: (assetId: string) => Promise<any>;
}) {
	const { assetId, page, fallbackDataUrl, alt, getOrLoadPdfDocument } = props;
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [size, setSize] = useState<{ w: number; h: number } | null>(null);
	const [renderError, setRenderError] = useState<string | null>(null);
	const renderTaskRef = useRef<any>(null); // ★追加: レンダリングタスクの参照を保持

	useEffect(() => {
		const el = wrapperRef.current;
		if (!el) return;
		const update = () => {
			const rect = el.getBoundingClientRect();
			setSize({ w: Math.max(0, rect.width), h: Math.max(0, rect.height) });
		};
		update();
		const ro = new ResizeObserver(() => update());
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				setRenderError(null);

				const el = wrapperRef.current;
				const canvas = canvasRef.current;
				if (!el || !canvas || !size || size.w === 0 || size.h === 0) return;

				// ★追加: 既存のレンダリングをキャンセル
				if (renderTaskRef.current) {
					try {
						renderTaskRef.current.cancel();
					} catch (e) {
						// キャンセル済みの場合は無視
					}
					renderTaskRef.current = null;
				}

				const pdf = await getOrLoadPdfDocument(assetId);
				if (cancelled) return;
				const pdfPage = await pdf.getPage(page);
				if (cancelled) return;

				const viewport1 = pdfPage.getViewport({ scale: 1 });
				const scale = Math.min(size.w / viewport1.width, size.h / viewport1.height);
				const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
				const renderViewport = pdfPage.getViewport({ scale: scale * dpr });

				canvas.width = Math.floor(renderViewport.width);
				canvas.height = Math.floor(renderViewport.height);
				canvas.style.width = `${Math.floor(renderViewport.width / dpr)}px`;
				canvas.style.height = `${Math.floor(renderViewport.height / dpr)}px`;

				const ctx = canvas.getContext("2d");
				if (!ctx) return;

				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				// ★修正: renderタスクを保持し、cleanupでcancelできるようにする
				const task = pdfPage.render({ canvasContext: ctx, canvas, viewport: renderViewport });
				renderTaskRef.current = task;

				await task.promise;

				// 完了したら参照を外す
				if (renderTaskRef.current === task) {
					renderTaskRef.current = null;
				}
			} catch (e: any) {
				// cancelは正常系として無視
				const msg = e?.name === "RenderingCancelledException" ? null : (e instanceof Error ? e.message : String(e));
				if (!cancelled && msg) setRenderError(msg);
			}
		})();

		return () => {
			cancelled = true;
			// ★追加: effect cleanupで進行中renderを必ず止める
			if (renderTaskRef.current) {
				try {
					renderTaskRef.current.cancel();
					renderTaskRef.current = null;
				} catch {
					// 既にキャンセル済みの場合は無視
				}
			}
		};
	}, [assetId, getOrLoadPdfDocument, page, size]);

	return (
		<div
			ref={wrapperRef}
			style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
		>
			{renderError && fallbackDataUrl ? (
				<img src={fallbackDataUrl} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt={alt} />
			) : (
				<canvas ref={canvasRef} aria-label={alt} />
			)}
		</div>
	);
}

function VideoSlide(props: { assetId: string; alt: string }) {
	const { assetId, alt } = props;
	const [src, setSrc] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;
		let url: string | null = null;
		(async () => {
			try {
				setError(null);
				setSrc(null);
				const blob = await getAssetBlob(assetId);
				if (!blob) throw new Error("動画アセットが見つかりません (IndexedDB)");
				url = URL.createObjectURL(blob);
				if (!active) return;
				setSrc(url);
			} catch (e) {
				if (!active) return;
				setError(e instanceof Error ? e.message : String(e));
			}
		})();
		return () => {
			active = false;
			if (url) URL.revokeObjectURL(url);
		};
	}, [assetId]);

	if (error) {
		return <div style={{ color: "white", textAlign: "center" }}>動画の読み込みに失敗しました: {error}</div>;
	}
	if (!src) {
		return <div style={{ color: "white", textAlign: "center" }}>動画を読み込み中...</div>;
	}

	return (
		<video
			src={src}
			style={{ width: "100%", height: "100%", objectFit: "contain" }}
			controls
			autoPlay
			muted
			playsInline
			aria-label={alt}
		/>
	);
}

// IRカメラの座標(0-1023)を画面座標に変換する関数
function mapIrToScreen(irX: number, irY: number, screenW: number, screenH: number) {
	// WiiリモコンのIRは視点が逆になることがあるため、必要に応じて 1 - ... を調整してください
	const x = (1 - irX / 1024) * screenW;
	const y = (irY / 768) * screenH;
	return { x, y };
}

export function PresenterView() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const containerRef = useRef<HTMLDivElement | null>(null);

	const returnTo = useMemo(() => {
		return searchParams.get("from") === "editor" ? "/editor" : "/";
	}, [searchParams]);

	const returnLabel = useMemo(() => {
		return returnTo === "/editor" ? "エディタに戻る" : "ホームに戻る";
	}, [returnTo]);

	const goBack = useCallback(() => {
		router.push(returnTo);
	}, [router, returnTo]);

	// Wiiリモコンの状態を取得
	const { wiiState, pressed, wiiConnected, wiiDisconnectedAt } = useWiiController();

	const [flow, setFlow] = useState<SerializedFlow | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
	const [startedWithWii, setStartedWithWii] = useState(false);
	// ★再生開始時刻（開始後の切断のみポップアップ対象にする）
	const [playingSince, setPlayingSince] = useState<number>(0);
	const [mode, setMode] = useState<"idle" | "playing">("idle");

	const pdfDocCacheRef = useRef<Map<string, Promise<any>>>(new Map());

	// Presenterは常に flow/currentNodeId がある前提で動かしているので、それを playing 判定にする
	const isPlaying = flow != null && currentNodeId != null;

	const getOrLoadPdfDocument = useCallback(async (assetId: string) => {
		const cached = pdfDocCacheRef.current.get(assetId);
		if (cached) return await cached;

		const promise = (async () => {
			const blob = await getAssetBlob(assetId);
			if (!blob) throw new Error("PDFアセットが見つかりません (IndexedDB)");
			const arrayBuffer = await blob.arrayBuffer();
			const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
			pdfjs.GlobalWorkerOptions.workerSrc = new URL(
				"pdfjs-dist/legacy/build/pdf.worker.min.mjs",
				import.meta.url,
			).toString();
			return await pdfjs.getDocument({ data: arrayBuffer }).promise;
		})();

		pdfDocCacheRef.current.set(assetId, promise);
		try {
			return await promise;
		} catch (e) {
			pdfDocCacheRef.current.delete(assetId);
			throw e;
		}
	}, []);

	// お絵描き用の座標リスト
	const [drawingPoints, setDrawingPoints] = useState<{ x: number; y: number }[]>([]);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// 連続遷移を防ぐためのクールタイム管理
	const lastNavTime = useRef<number>(0);

	// 現在のノードデータ
	const currentNode = useMemo(() =>
		flow?.nodes.find((n) => n.id === currentNodeId),
		[flow, currentNodeId]);

	useEffect(() => {
		const loaded = loadFromLocalStorage();
		if (!loaded || loaded.nodes.length === 0) {
			setError("データが見つかりません。Editorで作成してください。");
			setFlow(null);
			setCurrentNodeId(null);
			return;
		}
		setError(null);
		setFlow(loaded);
		const startNode = loaded.nodes.find((n) => n.data.label === "Start") || loaded.nodes[0];
		setCurrentNodeId(startNode.id);
	}, []);

	useEffect(() => {
		if (wiiConnected) setStartedWithWii(true);
	}, [wiiConnected]);

	const outgoingEdges = useMemo(() => {
		if (!flow || !currentNodeId) return [];
		return flow.edges.filter((e) => e.source === currentNodeId);
	}, [flow, currentNodeId]);

	const branchOptions = useMemo(() => {
		// 1-9 の数字で選べる分岐
		const options: Array<{ key: string; target: string }> = [];
		const used = new Set<string>();

		for (const edge of outgoingEdges) {
			const label = (edge.label ?? "").trim();
			const m = label.match(/^([1-9])(?:\b|\s|:|-)/);
			if (m) {
				const k = m[1];
				if (!used.has(k)) {
					options.push({ key: k, target: edge.target });
					used.add(k);
				}
			}
		}

		// ラベルに番号がない場合は、配列順で 1..n を割り当て
		for (const edge of outgoingEdges) {
			if (options.length >= 9) break;
			const nextKey = String(options.length + 1);
			if (used.has(nextKey)) continue;
			options.push({ key: nextKey, target: edge.target });
			used.add(nextKey);
		}

		return options;
	}, [outgoingEdges]);

	const hasMultipleBranches = outgoingEdges.length >= 2;

	// ノード移動処理
	const navigateTo = useCallback((nodeId: string) => {
		// クールタイムチェック (500ms以内の連続遷移は無視)
		const now = Date.now();
		if (now - lastNavTime.current < 500) return;
		lastNavTime.current = now;

		setCurrentNodeId(nodeId);
		setDrawingPoints([]); // スライドが変わったら線を消す
	}, []);

	// 次へ（ロジック改良版）
	const nextSlide = useCallback(() => {
		if (!flow || !currentNodeId) return;
		// 分岐が複数ある場合は、数字選択を優先する
		const edges = flow.edges.filter((e) => e.source === currentNodeId);
		if (edges.length >= 2) return;

		// 現在のノードから出ているエッジをすべて取得
		// (上で取得済み)

		if (edges.length === 0) return;

		// 優先順位付け
		// 1. ラベルがないエッジ (デフォルトルート)
		// 2. ラベルが "next" のエッジ
		// 3. それ以外 (最初に見つかったもの)
		const targetEdge =
			edges.find(e => !e.label || e.label.trim() === "") ||
			edges.find(e => e.label === "next") ||
			edges[0];

		if (targetEdge) navigateTo(targetEdge.target);
	}, [flow, currentNodeId, navigateTo]);

	const branchByNumberKey = useCallback(
		(key: string) => {
			if (!hasMultipleBranches) return;
			const opt = branchOptions.find((o) => o.key === key);
			if (opt) navigateTo(opt.target);
		},
		[branchOptions, hasMultipleBranches, navigateTo],
	);

	// 前へ（逆順検索）
	const prevSlide = useCallback(() => {
		if (!flow || !currentNodeId) return;
		// 自分に向かっているエッジを探して戻る（簡易実装）
		const edge = flow.edges.find(e => e.target === currentNodeId);
		if (edge) navigateTo(edge.source);
	}, [flow, currentNodeId, navigateTo]);

	// 分岐処理（エッジのラベルで検索）
	const branchTo = useCallback((keywords: string[]) => {
		if (!flow || !currentNodeId) return;
		const edges = flow.edges.filter(e => e.source === currentNodeId);
		const target = edges.find(e => keywords.some(k => e.label?.includes(k)));
		if (target) {
			console.log("分岐しました:", target.label);
			navigateTo(target.target);
		}
	}, [flow, currentNodeId, navigateTo]);

	// 再生開始（現在のflowを使い、開始時接続状態だけ記録する）
	const onPlay = useCallback(() => {
		const loaded = loadFromLocalStorage();
		if (!loaded || loaded.nodes.length === 0) {
			setError("データが見つかりません。Editorで作成してください。");
			return;
		}
		
		// ★修正: currentProjectStoreから最新のバインド設定を読み込む
		const storedBindings = getProjectBindings();
		
		// バインド設定を適用
		const flowWithBindings = storedBindings ? 
			{ ...loaded, projectBindings: storedBindings } : loaded;
		
		console.log("PresenterView: Loading bindings", { storedBindings, flowWithBindings });
		
		setFlow(flowWithBindings);
		// Startラベルがあるノード、なければ先頭
		const startNode = loaded.nodes.find(n => n.data.label === "Start") || loaded.nodes[0];
		setCurrentNodeId(startNode.id);
		setStartedWithWii(!!wiiConnected);
		setPlayingSince(Date.now());
		setMode("playing");
	}, [wiiConnected]);

	// ★追加: キーボードでリアクションをデバッグする（N=One, M=Two）
	const [debugEmitClap, setDebugEmitClap] = useState(false);
	const [debugEmitLaugh, setDebugEmitLaugh] = useState(false);

	// キーボード操作 (矢印キー対応 + ESCで戻る)
	useEffect(() => {
		if (!isPlaying) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key >= "1" && e.key <= "9") {
				branchByNumberKey(e.key);
				return;
			}
			if (e.key === "ArrowRight") {
				if (!hasMultipleBranches) nextSlide();
			}
			if (e.key === "ArrowLeft") prevSlide();
			// ESCキーで元の画面へ戻る（エディタ経由ならエディタへ）
			if (e.key === "Escape") goBack();
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isPlaying, nextSlide, prevSlide, goBack, branchByNumberKey, hasMultipleBranches]);

	const effectiveProjectBindings = useMemo(() => {
		const merged = mergeBindings(flow?.projectBindings);
		console.log("PresenterView: effectiveProjectBindings updated", { 
			flowBindings: flow?.projectBindings, 
			merged 
		});
		return merged;
	}, [flow]);

	// --- Wiiリモコン ロジック ---
	// 旧: ここで Right/Left/Plus... を直書きしていたが、projectBindings で解釈する
	
	// --- プロジェクト全体バインドを適用してアクション実行 ---
	const runAction = useCallback(
		(a: BindingAction) => {
			switch (a.type) {
				case "next":
					nextSlide();
					return;
				case "prev":
					prevSlide();
					return;
				case "branchIndex":
					// 1..9 を “分岐選択（数字キー）” と同じ挙動にする
					branchByNumberKey(String(a.index));
					return;
				case "branch": {
					// 既存互換: A/B/HOME は 1..3 にマップ
					if (!hasMultipleBranches) return;
					const map: Record<string, string> = { A: "1", B: "2", HOME: "3" };
					const k = map[a.kind];
					if (k) branchByNumberKey(k);
					return;
				}
				case "reaction":
					// ReactionOverlay が pressed.One/Two を見ているので、ここでは何もしない
					return;
				case "none":
				default:
					return;
			}
		},
		[nextSlide, prevSlide, branchByNumberKey, hasMultipleBranches],
	);

	const prevPressedRef = useRef<Record<string, boolean>>({});
	useEffect(() => {
		if (mode !== "playing") return;

		// そのフレームで「押された瞬間」のボタンだけ処理（押しっぱなしで連打しない）
		const prevPressed = prevPressedRef.current;
		for (const btn of Object.keys(pressed)) {
			const isDown = (pressed as Record<string, boolean>)[btn];
			const wasDown = !!prevPressed[btn];
			if (!isDown || wasDown) continue;

			const act = (effectiveProjectBindings as Record<string, BindingAction | undefined>)[btn] ?? { type: "none" };
			runAction(act);
		}
		prevPressedRef.current = { ...(pressed as Record<string, boolean>) };
	}, [pressed, mode, effectiveProjectBindings, runAction]);

	// ★追加: リアクション検出（バインドベース）
	const shouldEmitClap = useMemo(() => {
		if (mode !== "playing") return false;
		// 押されたボタンの中で、"clap" にバインドされているものがあるか？
		for (const btn of Object.keys(pressed)) {
			const isDown = (pressed as Record<string, boolean>)[btn];
			if (!isDown) continue;
			const act = (effectiveProjectBindings as Record<string, BindingAction | undefined>)[btn];
			if (act?.type === "reaction" && act.kind === "clap") return true;
		}
		return false;
	}, [pressed, effectiveProjectBindings, mode]);

	const shouldEmitLaugh = useMemo(() => {
		if (mode !== "playing") return false;
		for (const btn of Object.keys(pressed)) {
			const isDown = (pressed as Record<string, boolean>)[btn];
			if (!isDown) continue;
			const act = (effectiveProjectBindings as Record<string, BindingAction | undefined>)[btn];
			if (act?.type === "reaction" && act.kind === "laugh") return true;
		}
		return false;
	}, [pressed, effectiveProjectBindings, mode]);

	// ★修正点: 以下の useMemo 3つを if (mode === "idle") の前に移動させます

	const debugPressedButtons = useMemo(() => {
		const on: string[] = [];
		for (const [btn, isDown] of Object.entries(pressed) as Array<[string, unknown]>) {
			if (isDown) on.push(btn);
		}
		return on.length ? on.join(", ") : "(none)";
	}, [pressed]);

	const debugBindingLines = useMemo(() => {
		const entries = Object.entries(effectiveProjectBindings) as Array<[string, BindingAction | undefined]>;
		entries.sort((a, b) => a[0].localeCompare(b[0]));
		return entries.map(([btn, action]) => `${btn.padEnd(8)} → ${action ? formatAction(action) : "(unassigned)"}`);
	}, [effectiveProjectBindings]);


	// UIレンダリング
	if (mode === "idle") {
		return (
			<main style={{ height: "100vh", display: "grid", placeItems: "center" }}>
				<div style={{ textAlign: "center" }}>
					<h1>Wii Presenter</h1>
					<div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 10 }}>
						<button onClick={goBack} style={{ padding: "10px 20px", fontSize: 16 }}>
							{returnLabel}
						</button>
					<button onClick={onPlay} style={{ padding: "10px 20px", fontSize: 20 }}>
						再生開始
					</button>
					</div>
					<p style={{ marginTop: 20, color: '#666' }}>
						Wiiリモコンを接続するか、キーボード(←/→)で操作できます。
					</p>
					{error && <p style={{ color: 'red' }}>{error}</p>}
				</div>
			</main>
		);
	}

    // ★修正前はこのあたりに useMemo がありましたが、上に移動しました

	return (
		<main
			ref={containerRef}
			style={{
				position: "relative",
				width: "100vw",
				height: "100vh",
				overflow: "hidden",
				background: "black",
			}}
		>
			<WiiDisconnectPopup
				isPlaying={isPlaying}
				startedWithWii={startedWithWii}
				wiiConnected={wiiConnected}
				wiiDisconnectedAt={wiiDisconnectedAt}
				playingSince={playingSince}
			/>

			{/* 戻るボタン（左上） */}
			<div style={{ position: "absolute", top: 20, left: 20, zIndex: 10000 }}>
				<button onClick={goBack} style={{ padding: "10px 14px", fontSize: 14 }}>
					{returnLabel}
				</button>
			</div>

			{/* ★修正: リアクション（バインドベース） */}
			<ReactionOverlay emitClap={shouldEmitClap} emitLaugh={shouldEmitLaugh} />

			{/* ★修正: スライド表示エリア (全画面・余白なし・アスペクト比維持) */}
			<div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
				{currentNode ? (
					<>
						{currentNode.data.asset?.kind === "pdf" ? (
							<PdfSlide
								assetId={currentNode.data.asset.assetId}
								page={currentNode.data.asset.page ?? 1}
								fallbackDataUrl={currentNode.data.asset.thumbnailDataUrl}
								alt={currentNode.data.label}
								getOrLoadPdfDocument={getOrLoadPdfDocument}
							/>
						) : currentNode.data.asset?.kind === "video" ? (
							<VideoSlide assetId={currentNode.data.asset.assetId} alt={currentNode.data.label} />
						) : (
							<h1 style={{ fontSize: 80, color: "white", textAlign: "center", maxWidth: "80%" }}>
								{currentNode.data.label}
							</h1>
						)}
					</>
				) : (
					<div style={{ color: "white" }}>{error ?? "スライドデータがありません"}</div>
				)}
			</div>

			{/* 描画レイヤー (最前面) */}
			<canvas
				ref={canvasRef}
				style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
			/>

			{/* デバッグ情報 (右上・揺れ防止 + 割当表示) */}
			<div
				style={{
					position: "absolute",
					top: 20,
					right: 20,
					background: "rgba(0,0,0,0.82)",
					color: "#d1fae5",
					padding: "12px 14px",
					borderRadius: 10,
					fontSize: 14,
					fontFamily:
						"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
					zIndex: 9999,
					pointerEvents: "none",
					minWidth: 360,
					whiteSpace: "pre",
					lineHeight: 1.35,
					border: "1px solid rgba(255,255,255,0.12)",
				}}
			>
				<div style={{ fontWeight: 800, color: "#a7f3d0", marginBottom: 8 }}>Wii Debug</div>
				<div style={{ color: "rgba(209,250,229,0.9)" }}>
					Acc: X={String(wiiState?.accel.x ?? 0).padStart(3)} Y={String(wiiState?.accel.y ?? 0).padStart(3)} Z={String(
						wiiState?.accel.z ?? 0,
					).padStart(3)}
				</div>
				<div style={{ color: "rgba(209,250,229,0.9)" }}>IR : {wiiState?.ir.length ?? 0}</div>
				<div style={{ color: "rgba(209,250,229,0.9)" }}>{`Btn: ${debugPressedButtons}`}</div>
				<div style={{ margin: "10px 0", borderTop: "1px solid rgba(255,255,255,0.12)" }} />
				<div style={{ fontWeight: 800, color: "#a7f3d0", marginBottom: 6 }}>Bindings (project)</div>
				{debugBindingLines.map((line) => (
					<div key={line}>{line}</div>
				))}
			</div>

			{/* 操作ガイド (左下) */}
			<div style={{ position: "absolute", bottom: 20, left: 20, color: "rgba(255,255,255,0.5)", fontSize: 14, pointerEvents: "none" }}>
				[ESC] 戻る
			</div>
		</main>
	);
}