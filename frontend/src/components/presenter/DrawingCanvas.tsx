"use client";

import { useEffect, useRef } from "react";

interface DrawingCanvasProps {
	drawingPoints: Array<{ x: number; y: number } | null>;
}

export function DrawingCanvas(props: DrawingCanvasProps) {
	const { drawingPoints } = props;
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
	}, [drawingPoints]);

	return (
		<canvas
			ref={canvasRef}
			style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
		/>
	);
}
