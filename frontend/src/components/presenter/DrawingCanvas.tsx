"use client";

import { useEffect, useRef } from "react";
import type { WiiState } from "@/hooks/useWiiController";

interface DrawingCanvasProps {
	drawingPoints: Array<{ x: number; y: number } | null>;
	wiiState: WiiState | null;
	isPlaying: boolean;
	shouldPaint: boolean;
}

// IRカメラの座標(0-1023)を画面座標に変換する関数
function mapIrToScreen(irX: number, irY: number, screenW: number, screenH: number) {
	const x = (1 - irX / 1024) * screenW;
	const y = (irY / 768) * screenH;
	return { x, y };
}

export function DrawingCanvas(props: DrawingCanvasProps) {
	const { drawingPoints, wiiState, isPlaying, shouldPaint } = props;
	const canvasRef = useRef<HTMLCanvasElement>(null);

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
			const dot = wiiState.ir[0];
			const pos = mapIrToScreen(dot.x, dot.y, window.innerWidth, window.innerHeight);

			// カーソル描画
			ctx.fillStyle = "blue";
			ctx.beginPath();
			ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
			ctx.fill();
		}
	}, [wiiState, drawingPoints, shouldPaint]);

	return (
		<canvas
			ref={canvasRef}
			style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
		/>
	);
}
