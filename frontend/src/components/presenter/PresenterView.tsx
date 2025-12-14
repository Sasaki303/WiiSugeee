"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadFromLocalStorage, type SerializedFlow } from "@/lib/presentation";
import { useWiiController, type WiiState } from "@/hooks/useWiiController";

type Mode = "idle" | "playing";

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

	// Wiiリモコンの状態を取得
	const { wiiState, pressed } = useWiiController();

	const [mode, setMode] = useState<Mode>("idle");
	const [flow, setFlow] = useState<SerializedFlow | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);

	// お絵描き用の座標リスト
	const [drawingPoints, setDrawingPoints] = useState<{ x: number; y: number }[]>([]);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// 連続遷移を防ぐためのクールタイム管理
	const lastNavTime = useRef<number>(0);

	// 現在のノードデータ
	const currentNode = useMemo(() =>
		flow?.nodes.find((n) => n.id === currentNodeId),
		[flow, currentNodeId]);

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

		// 現在のノードから出ているエッジをすべて取得
		const edges = flow.edges.filter(e => e.source === currentNodeId);

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

	// キーボード操作 (矢印キー対応 + ESCで戻る)
	useEffect(() => {
		if (mode !== "playing") return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight") nextSlide();
			if (e.key === "ArrowLeft") prevSlide();
			// ★修正: ESCキーで再生終了
			if (e.key === "Escape") setMode("idle");
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [mode, nextSlide, prevSlide]);

	// --- Wiiリモコン ロジック ---
	useEffect(() => {
		if (mode !== "playing") return;

		// 1. スライド進行 (十字キー)
		if (pressed.Right) nextSlide();
		if (pressed.Left) prevSlide();

		// 2. 分岐 (Plus / Minus / Home)
		if (pressed.Plus) branchTo(["+", "plus", "Aルート"]);
		if (pressed.Minus) branchTo(["-", "minus", "Bルート"]);
		if (pressed.Home) branchTo(["home", "top", "戻る"]);

		// 3. エフェクト (1 / 2)
		if (pressed.One) {
			console.log("👏 拍手！");
			alert("👏 拍手エフェクト！");
		}
		if (pressed.Two) {
			console.log("🎉 クラッカー！");
			alert("🎉 クラッカーエフェクト！");
		}

	}, [pressed, mode, nextSlide, prevSlide, branchTo]);

	// --- 描画ロジック (IRセンサー & Aボタン) ---
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx || !wiiState) return;

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
			ctx.beginPath();
			ctx.moveTo(drawingPoints[0].x, drawingPoints[0].y);
			for (let i = 1; i < drawingPoints.length; i++) {
				ctx.lineTo(drawingPoints[i].x, drawingPoints[i].y);
			}
			ctx.stroke();
		}

		// IRポインター処理
		if (wiiState.ir.length > 0) {
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
				setDrawingPoints(prev => [...prev, pos]);
			}
		}

	}, [wiiState, drawingPoints]);


	// UIレンダリング
	if (mode === "idle") {
		return (
			<main style={{ height: "100vh", display: "grid", placeItems: "center" }}>
				<div style={{ textAlign: "center" }}>
					<h1>Wii Presenter</h1>
					<button onClick={onPlay} style={{ padding: "10px 20px", fontSize: 20 }}>
						再生開始
					</button>
					<p style={{ marginTop: 20, color: '#666' }}>
						Wiiリモコンを接続するか、キーボード(←/→)で操作できます。
					</p>
					{error && <p style={{ color: 'red' }}>{error}</p>}
				</div>
			</main>
		);
	}

	return (
		// ★修正: 背景黒 & 全画面設定
		<main ref={containerRef} style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "black" }}>

			{/* ★修正: スライド表示エリア (全画面・余白なし・アスペクト比維持) */}
			<div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
				{currentNode ? (
					<>
						{currentNode.data.asset?.kind === "pdf" && currentNode.data.asset.thumbnailDataUrl ? (
							<img
								src={currentNode.data.asset.thumbnailDataUrl}
								style={{ width: "100%", height: "100%", objectFit: "contain" }}
								alt={currentNode.data.label}
							/>
						) : currentNode.data.asset?.kind === "video" ? (
							<div style={{ color: "white", textAlign: "center" }}>
								<div style={{ fontSize: 32, marginBottom: 16 }}>🎥 {currentNode.data.asset.fileName}</div>
								<div style={{ fontSize: 16, opacity: 0.7 }}>動画ノード (再生機能未実装)</div>
							</div>
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
			<div style={{
				position: "absolute",
				top: 20,
				right: 20,
				background: "rgba(0,0,0,0.8)",
				color: "#0f0", // 緑色で見やすく
				padding: "15px 20px",
				borderRadius: 8,
				fontSize: "18px", // フォント大きく
				fontFamily: "monospace",
				zIndex: 9999, // 最前面
				pointerEvents: "none"
			}}>
				<div style={{ fontWeight: "bold", borderBottom: "1px solid #555", marginBottom: 5 }}>Wii Debug</div>
				<div>Acc: X={wiiState?.accel.x.toString().padStart(3)} Y={wiiState?.accel.y.toString().padStart(3)} Z={wiiState?.accel.z.toString().padStart(3)}</div>
				<div>IR Pts: {wiiState?.ir.length}</div>
				<div>Btn: {Object.keys(wiiState?.buttons || {}).filter(k => wiiState?.buttons[k as keyof WiiState['buttons']]).join(', ')}</div>
			</div>

			{/* 操作ガイド (左下) */}
			<div style={{ position: "absolute", bottom: 20, left: 20, color: "rgba(255,255,255,0.5)", fontSize: 14, pointerEvents: "none" }}>
				[ESC] 戻る
			</div>
		</main>
	);
}