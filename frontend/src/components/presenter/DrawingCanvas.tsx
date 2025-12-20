"use client";

import { useEffect, useRef } from "react";
import type { WiiState } from "@/hooks/useWiiController";
import type { DrawingPoint, Position } from "@/types";

interface DrawingCanvasProps {
	drawingPoints: DrawingPoint[];
	wiiState: WiiState | null;
	isPlaying: boolean;
	shouldPaint: boolean;
	eraserMode: boolean;
	eraserPosition: Position | null;
}

const ERASER_RADIUS = 60;
const ERASER_STEP = 12;
const ERASER_ALPHA = 0.18;
const ERASER_BLUR = 25;
const PEN_WIDTH = 5;
const PEN_COLOR = "red";

export function DrawingCanvas({
	drawingPoints,
	eraserMode,
	eraserPosition,
}: DrawingCanvasProps) {
	const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
	const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
	const lastDrawnIndexRef = useRef(0);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;

			if (drawingCanvasRef.current) {
				drawingCanvasRef.current.width = width;
				drawingCanvasRef.current.height = height;
				lastDrawnIndexRef.current = 0;
			}
			if (cursorCanvasRef.current) {
				cursorCanvasRef.current.width = width;
				cursorCanvasRef.current.height = height;
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const canvas = drawingCanvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;

		if (drawingPoints.length < lastDrawnIndexRef.current) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			lastDrawnIndexRef.current = 0;
		}

		if (drawingPoints.length === lastDrawnIndexRef.current) return;

		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		for (let i = lastDrawnIndexRef.current; i < drawingPoints.length; i++) {
			const point = drawingPoints[i];
			if (!point) continue;

			const prev = i > 0 ? drawingPoints[i - 1] : null;
			const mode = point.mode || "draw";
			const isStart = !prev || prev.mode !== point.mode;

			if (isStart && mode === "erase") {
				drawEraserStamp(ctx, point.x, point.y);
			} else if (!isStart && prev) {
				if (mode === "draw") {
					drawLine(ctx, prev.x, prev.y, point.x, point.y);
				} else {
					drawEraserPath(ctx, prev.x, prev.y, point.x, point.y);
				}
			}
		}

		lastDrawnIndexRef.current = drawingPoints.length;
	}, [drawingPoints]);

	useEffect(() => {
		const canvas = cursorCanvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (eraserMode && eraserPosition) {
			ctx.save();
			ctx.strokeStyle = "rgba(255, 100, 100, 0.6)";
			ctx.lineWidth = 2;
			ctx.setLineDash([8, 4]);
			ctx.beginPath();
			ctx.arc(eraserPosition.x, eraserPosition.y, ERASER_RADIUS, 0, Math.PI * 2);
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.restore();
		}
	}, [eraserMode, eraserPosition]);

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

function drawEraserStamp(ctx: CanvasRenderingContext2D, x: number, y: number) {
	ctx.globalCompositeOperation = "destination-out";
	ctx.fillStyle = `rgba(0,0,0,${ERASER_ALPHA})`;
	ctx.shadowBlur = ERASER_BLUR;
	ctx.shadowColor = `rgba(0,0,0,${ERASER_ALPHA})`;
	ctx.beginPath();
	ctx.arc(x, y, ERASER_RADIUS, 0, Math.PI * 2);
	ctx.fill();
}

function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
	ctx.globalCompositeOperation = "source-over";
	ctx.strokeStyle = PEN_COLOR;
	ctx.lineWidth = PEN_WIDTH;
	ctx.shadowBlur = 0;
	ctx.shadowColor = "transparent";
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function drawEraserPath(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
	ctx.globalCompositeOperation = "destination-out";
	ctx.fillStyle = `rgba(0,0,0,${ERASER_ALPHA})`;
	ctx.shadowBlur = ERASER_BLUR;
	ctx.shadowColor = `rgba(0,0,0,${ERASER_ALPHA})`;

	const dist = Math.hypot(x2 - x1, y2 - y1);
	const angle = Math.atan2(y2 - y1, x2 - x1);

	for (let d = ERASER_STEP; d <= dist; d += ERASER_STEP) {
		const bx = x1 + Math.cos(angle) * d;
		const by = y1 + Math.sin(angle) * d;
		ctx.beginPath();
		ctx.arc(bx, by, ERASER_RADIUS, 0, Math.PI * 2);
		ctx.fill();
	}

	ctx.beginPath();
	ctx.arc(x2, y2, ERASER_RADIUS, 0, Math.PI * 2);
	ctx.fill();
}
