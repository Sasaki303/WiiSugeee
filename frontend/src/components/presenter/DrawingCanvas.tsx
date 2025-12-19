"use client";

import { useEffect, useRef } from "react";
import type { WiiState } from "@/hooks/useWiiController";

interface DrawingCanvasProps {
	drawingPoints: Array<{ x: number; y: number; mode?: "draw" | "erase" } | null>;
	wiiState: WiiState | null;
	isPlaying: boolean;
	shouldPaint: boolean;
	eraserMode: boolean;
	eraserPosition: { x: number; y: number } | null;
}

// IRカメラの座標(0-1023)を画面座標に変換する関数
function mapIrToScreen(irX: number, irY: number, screenW: number, screenH: number) {
	const x = (1 - irX / 1024) * screenW;
	const y = (irY / 768) * screenH;
	return { x, y };
}

export function DrawingCanvas(props: DrawingCanvasProps) {
	const { drawingPoints, wiiState, isPlaying, shouldPaint, eraserMode, eraserPosition } = props;
	const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
	const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
	const lastDrawnIndexRef = useRef(0);

	// キャンバスサイズ管理とリサイズ時の全再描画
	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;

			if (drawingCanvasRef.current) {
				drawingCanvasRef.current.width = width;
				drawingCanvasRef.current.height = height;
				// リサイズされたらクリアされるので、全再描画が必要
				lastDrawnIndexRef.current = 0;
			}
			if (cursorCanvasRef.current) {
				cursorCanvasRef.current.width = width;
				cursorCanvasRef.current.height = height;
			}
		};

		// 初期サイズ設定
		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// 描画レイヤー更新 (Drawing Layer) - 追記型
	useEffect(() => {
		const canvas = drawingCanvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;

		// リセット検知（配列が短くなった場合など）
		if (drawingPoints.length < lastDrawnIndexRef.current) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			lastDrawnIndexRef.current = 0;
		}

		// 描画不要なら終了
		if (drawingPoints.length === lastDrawnIndexRef.current) return;

		// 共通設定
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		// 追記ループ
		for (let i = lastDrawnIndexRef.current; i < drawingPoints.length; i++) {
			const p = drawingPoints[i];
			if (!p) continue; // 区切り

			const prev = i > 0 ? drawingPoints[i - 1] : null;
			const mode = p.mode || "draw";

			// 始点かどうか（配列の先頭、または直前がnull、またはモードが変わった場合）
			const isStart = !prev || prev.mode !== p.mode;

			if (isStart) {
				// 始点処理
				if (mode === "erase") {
					// 消しゴム始点スタンプ（黒板消しのように徐々に薄くなる）
					ctx.globalCompositeOperation = "destination-out";
					ctx.fillStyle = "rgba(0,0,0,0.18)"; // 5-6回で完全に消える
					ctx.shadowBlur = 25; // ぼかしを入れて境界を柔らかく
					ctx.shadowColor = "rgba(0,0,0,0.18)";
					ctx.beginPath();
					ctx.arc(p.x, p.y, 60, 0, Math.PI * 2);
					ctx.fill();
				}
				// drawモードの始点はmoveToだけなので、ここでは何もしない（次の点で線を引く）
			} else {
				// 接続処理 (prev -> p)
				if (mode === "draw") {
					ctx.globalCompositeOperation = "source-over";
					ctx.strokeStyle = "red";
					ctx.lineWidth = 5;
					ctx.shadowBlur = 0;
					ctx.shadowColor = "transparent";

					ctx.beginPath();
					ctx.moveTo(prev!.x, prev!.y);
					ctx.lineTo(p.x, p.y);
					ctx.stroke();
				} else {
					// erase 補間（黒板消しのように徐々に薄くなる）
					ctx.globalCompositeOperation = "destination-out";
					ctx.fillStyle = "rgba(0,0,0,0.18)"; // 5-6回で完全に消える
					ctx.shadowBlur = 25; // ぼかしを入れて境界を柔らかく
					ctx.shadowColor = "rgba(0,0,0,0.18)";

					const dist = Math.hypot(p.x - prev!.x, p.y - prev!.y);
					const angle = Math.atan2(p.y - prev!.y, p.x - prev!.x);
					const step = 12; // 補間間隔を狭めて滑らかに

					for (let d = step; d <= dist; d += step) {
						const bx = prev!.x + Math.cos(angle) * d;
						const by = prev!.y + Math.sin(angle) * d;
						ctx.beginPath();
						ctx.arc(bx, by, 60, 0, Math.PI * 2);
						ctx.fill();
					}
					// 終点
					ctx.beginPath();
					ctx.arc(p.x, p.y, 60, 0, Math.PI * 2);
					ctx.fill();
				}
			}
		}

		// インデックス更新
		lastDrawnIndexRef.current = drawingPoints.length;
	}, [drawingPoints]);

	// カーソルレイヤー更新 (Cursor Layer) - 毎フレーム更新
	useEffect(() => {
		const canvas = cursorCanvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// 消しゴムカーソル表示（eraserModeがtrueの時）
		if (eraserMode && eraserPosition) {
			ctx.save();
			ctx.strokeStyle = "rgba(255, 100, 100, 0.8)";
			ctx.lineWidth = 2;
			ctx.setLineDash([5, 5]);
			ctx.beginPath();
			ctx.arc(eraserPosition.x, eraserPosition.y, 60, 0, Math.PI * 2);
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.restore();
		}

		// IRポインター処理
		if (wiiState && wiiState.ir.length > 0) {
			const dot = wiiState.ir[0];
			const pos = mapIrToScreen(dot.x, dot.y, window.innerWidth, window.innerHeight);

			// カーソル描画
			ctx.fillStyle = "blue";
			ctx.beginPath();
			ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
			ctx.fill();
		}
	}, [wiiState, eraserMode, eraserPosition]);

	return (
		<>
			<canvas
				ref={drawingCanvasRef}
				style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
			/>
			<canvas
				ref={cursorCanvasRef}
				style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
			/>
		</>
	);
}
