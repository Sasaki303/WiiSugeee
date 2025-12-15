"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadFromLocalStorage, type SerializedFlow } from "@/lib/presentation";
import { getAssetBlob } from "@/lib/idbAssets";
import { useWiiController, type WiiState } from "@/hooks/useWiiController";
import { ReactionOverlay } from "@/components/presenter/ReactionOverlay"; // 追加

type Mode = "idle" | "playing";

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
			setRenderError(null);
			const el = wrapperRef.current;
			const canvas = canvasRef.current;
			if (!el || !canvas || !size || size.w === 0 || size.h === 0) return;

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

			await pdfPage.render({ canvasContext: ctx, canvas, viewport: renderViewport }).promise;
		})();
		return () => {
			cancelled = true;
		};
	}, [assetId, getOrLoadPdfDocument, page, size]);

	return (
		<div ref={wrapperRef} style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
			{renderError && fallbackDataUrl ? (
				<img
					src={fallbackDataUrl}
					style={{ width: "100%", height: "100%", objectFit: "contain" }}
					alt={alt}
				/>
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

function ImageSlide(props: { assetId: string; alt: string }) {
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
				if (!blob) throw new Error("画像アセットが見つかりません (IndexedDB)");
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
		return <div style={{ color: "white", textAlign: "center" }}>画像の読み込みに失敗しました: {error}</div>;
	}
	if (!src) {
		return <div style={{ color: "white", textAlign: "center" }}>画像を読み込み中...</div>;
	}

	return <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "contain" }} />;
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
	const isMouseDrawingRef = useRef(false);

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
	const { wiiState, pressed } = useWiiController();

	const [mode, setMode] = useState<Mode>("idle");
	const [flow, setFlow] = useState<SerializedFlow | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
	const pdfDocCacheRef = useRef<Map<string, Promise<any>>>(new Map());

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
	const [drawingPoints, setDrawingPoints] = useState<Array<{ x: number; y: number } | null>>([]);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const wasWiiADownRef = useRef(false);

	// 連続遷移を防ぐためのクールタイム管理
	const lastNavTime = useRef<number>(0);

	// 現在のノードデータ
	const currentNode = useMemo(() =>
		flow?.nodes.find((n) => n.id === currentNodeId),
		[flow, currentNodeId]);

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

	// 再生開始
	const onPlay = useCallback(() => {
		const loaded = loadFromLocalStorage();
		if (!loaded || loaded.nodes.length === 0) {
			setError("データが見つかりません。Editorで作成してください。");
			return;
		}
		setFlow(loaded);
		// Startラベルがあるノード、なければ先頭
		const startNode = loaded.nodes.find(n => n.data.label === "Start") || loaded.nodes[0];
		setCurrentNodeId(startNode.id);
		setMode("playing");
	}, []);

	// ★追加: キーボードでリアクションをデバッグする（N=One, M=Two）
	const [debugEmitClap, setDebugEmitClap] = useState(false);
	const [debugEmitLaugh, setDebugEmitLaugh] = useState(false);

	// キーボード操作 (矢印キー対応 + ESCで戻る)
	useEffect(() => {
		if (mode !== "playing") return;

		const handleKeyDown = (e: KeyboardEvent) => {
			// 追加: 線をクリア (R)
			if (e.key === "r" || e.key === "R") {
				setDrawingPoints([]);
				isMouseDrawingRef.current = false;
				wasWiiADownRef.current = false;
				return;
			}

			// ★追加: リアクション（N / M）
			// 押しっぱなしで増殖しないように repeat を無視
			if (!e.repeat) {
				if (e.key === "n" || e.key === "N") {
					setDebugEmitClap(true);
					queueMicrotask(() => setDebugEmitClap(false)); // 1回だけ発火
					return;
				}
				if (e.key === "m" || e.key === "M") {
					setDebugEmitLaugh(true);
					queueMicrotask(() => setDebugEmitLaugh(false)); // 1回だけ発火
					return;
				}
			}

			// 既存: 分岐 1..9
			if (e.key >= "1" && e.key <= "9") {
				branchByNumberKey(e.key);
				return;
			}
			// 既存: スライド移動
			if (e.key === "ArrowRight") {
				if (!hasMultipleBranches) nextSlide();
			}
			if (e.key === "ArrowLeft") prevSlide();

			// 既存: ESC
			if (e.key === "Escape") goBack();
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [mode, nextSlide, prevSlide, goBack, branchByNumberKey, hasMultipleBranches]);

	// --- Wiiリモコン ロジック ---
	useEffect(() => {
		if (mode !== "playing") return;

		// 1. スライド進行 (十字キー)
		if (pressed.Right && !hasMultipleBranches) nextSlide();
		if (pressed.Left) prevSlide();

		// 2. 分岐 (Plus / Minus / Home)
		if (pressed.Plus) branchTo(["+", "plus", "Aルート"]);
		if (pressed.Minus) branchTo(["-", "minus", "Bルート"]);
		if (pressed.Home) branchTo(["home", "top", "戻る"]);

		// 3. エフェクト (1 / 2)
		// alert は UI をブロックしてプレゼンの邪魔になるので削除。
		// 表示は <ReactionOverlay> 側に任せる。
		if (pressed.One) {
			console.log("👏 clap");
		}
		if (pressed.Two) {
			console.log("😆 laugh");
		}
	}, [pressed, mode, nextSlide, prevSlide, branchTo, hasMultipleBranches]);

	// --- 描画ロジック (IRセンサー & Aボタン) ---
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;

		// キャンバスサイズをウィンドウに合わせる
		if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		// 画面クリア
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// 既存の線を描画
		ctx.lineWidth = 5;
		ctx.strokeStyle = "red";
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		if (drawingPoints.length > 1) {
			let started = false;
			for (const p of drawingPoints) {
				if (!p) {
					if (started) {
						ctx.stroke();
						started = false;
					}
					continue;
				}
				if (!started) {
					ctx.beginPath();
					ctx.moveTo(p.x, p.y);
					started = true;
				} else {
					ctx.lineTo(p.x, p.y);
				}
			}
			if (started) ctx.stroke();
		}

		// IRポインター処理
		if (wiiState && wiiState.ir.length > 0) {
			// IRの1点目を使用
			const dot = wiiState.ir[0];
			// 座標変換
			const pos = mapIrToScreen(dot.x, dot.y, window.innerWidth, window.innerHeight);

			// カーソル描画
			ctx.fillStyle = "blue";
			ctx.beginPath();
			ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
			ctx.fill();

			// Aボタンを押している間、軌跡を追加
			if (wiiState.buttons.A) {
				setDrawingPoints((prev) => {
					const next = prev.slice();
					if (!wasWiiADownRef.current) {
						// 前回の線と繋がらないように区切りを入れる
						if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
					}
					next.push(pos);
					return next;
				});
				wasWiiADownRef.current = true;
			} else {
				// 離したタイミングで区切る
				if (wasWiiADownRef.current) {
					wasWiiADownRef.current = false;
					setDrawingPoints((prev) => (prev.length > 0 && prev[prev.length - 1] !== null ? [...prev, null] : prev));
				}
			}
		}

	}, [wiiState, drawingPoints]);


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

	return (
		<main
			ref={containerRef}
			onMouseDown={(e) => {
				if (mode !== "playing") return;
				if (e.button !== 0) return;
				// UI(ボタン等)操作は邪魔しない
				const el = e.target as HTMLElement | null;
				if (el && el.closest("button, a, input, textarea, select")) return;
				e.preventDefault();
				isMouseDrawingRef.current = true;
				setDrawingPoints((prev) => {
					const next = prev.slice();
					if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
					next.push({ x: e.clientX, y: e.clientY });
					return next;
				});
			}}
			onMouseMove={(e) => {
				if (mode !== "playing") return;
				if (!isMouseDrawingRef.current) return;
				e.preventDefault();
				setDrawingPoints((prev) => {
					const last = prev[prev.length - 1];
					if (last && Math.abs(last.x - e.clientX) + Math.abs(last.y - e.clientY) < 2) return prev;
					return [...prev, { x: e.clientX, y: e.clientY }];
				});
			}}
			onMouseUp={() => {
				if (!isMouseDrawingRef.current) return;
				isMouseDrawingRef.current = false;
				setDrawingPoints((prev) => (prev.length > 0 && prev[prev.length - 1] !== null ? [...prev, null] : prev));
			}}
			onMouseLeave={() => {
				if (!isMouseDrawingRef.current) return;
				isMouseDrawingRef.current = false;
				setDrawingPoints((prev) => (prev.length > 0 && prev[prev.length - 1] !== null ? [...prev, null] : prev));
			}}
			style={{
				position: "relative",
				width: "100vw",
				height: "100vh",
				overflow: "hidden",
				background: "black",
			}}
		>
			{/* 戻るボタン（左上） */}
			<div style={{ position: "absolute", top: 20, left: 20, zIndex: 10000 }}>
				<button onClick={goBack} style={{ padding: "10px 14px", fontSize: 14 }}>
					{returnLabel}
				</button>
			</div>

			{/* ★追加: リアクション（右下に重ねる） */}
			<ReactionOverlay emitClap={!!pressed.One} emitLaugh={!!pressed.Two} />

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
						) : currentNode.data.asset?.kind === "image" ? (
							<ImageSlide assetId={currentNode.data.asset.assetId} alt={currentNode.data.label} />
						) : (
							<h1 style={{ fontSize: 80, color: "white", textAlign: "center", maxWidth: "80%" }}>
								{currentNode.data.label}
							</h1>
						)}
					</>
				) : (
					<div style={{ color: "white" }}>スライドデータがありません</div>
				)}
			</div>

			{/* 描画レイヤー (最前面) */}
			<canvas
				ref={canvasRef}
				style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
			/>

			{/* デバッグ情報 (右上・大きく表示) */}
			<div
				style={{
					position: "absolute",
					top: 20,
					right: 20,
					background: "rgba(0,0,0,0.8)",
					color: "#0f0",
					padding: "15px 20px",
					borderRadius: 8,
					fontSize: "18px",
					fontFamily: "monospace",
					zIndex: 9999,
					pointerEvents: "none",
				}}
			>
				<div style={{ fontWeight: "bold", borderBottom: "1px solid #555", marginBottom: 5 }}>Wii Debug</div>
				<div>Acc: X={wiiState?.accel.x.toString().padStart(3)} Y={wiiState?.accel.y.toString().padStart(3)} Z={wiiState?.accel.z.toString().padStart(3)}</div>
				<div>IR Pts: {wiiState?.ir.length}</div>
				<div>Btn: {Object.keys(wiiState?.buttons || {}).filter(k => wiiState?.buttons[k as keyof WiiState["buttons"]]).join(", ")}</div>
			</div>

			{/* 操作ガイド (左下) */}
			<div style={{ position: "absolute", bottom: 20, left: 20, color: "rgba(255,255,255,0.5)", fontSize: 14, pointerEvents: "none" }}>
				[ESC] 戻る
			</div>
		</main>
	);
}