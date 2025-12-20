"use client";

import { useCallback, useRef, useState } from "react";
import type { DrawingPoint, Position } from "@/types";

export function useDrawing() {
	const [drawingPoints, setDrawingPoints] = useState<DrawingPoint[]>([]);
	const [eraserMode, setEraserMode] = useState(false);
	const [eraserButtonName, setEraserButtonName] = useState<string | null>(null);
	const [cursorPos, setCursorPos] = useState<Position | null>(null);
	const [isPainting, setIsPainting] = useState(false);
	const isMouseDrawingRef = useRef(false);
	const wasWiiADownRef = useRef(false);

	const clearDrawing = useCallback(() => {
		setDrawingPoints([]);
		isMouseDrawingRef.current = false;
		wasWiiADownRef.current = false;
	}, []);

	const addSeparator = useCallback(() => {
		setDrawingPoints((prev) => (prev.length > 0 && prev[prev.length - 1] !== null ? [...prev, null] : prev));
	}, []);

	const addPoint = useCallback((point: { x: number; y: number; mode?: "draw" | "erase" }) => {
		setDrawingPoints((prev) => [...prev, point]);
	}, []);

	const toggleEraserMode = useCallback((buttonName?: string) => {
		setEraserMode((prev) => {
			const next = !prev;
			if (next) {
				setEraserButtonName(buttonName || "X");
				setCursorPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
			} else {
				setEraserButtonName(null);
				setCursorPos(null);
			}
			return next;
		});
	}, []);

	const startMouseDrawing = useCallback(
		(x: number, y: number) => {
			isMouseDrawingRef.current = true;
			if (eraserMode) {
				setIsPainting(false);
				setDrawingPoints((prev) => {
					const next = prev.slice();
					if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
					next.push({ x, y, mode: "erase" });
					return next;
				});
			} else {
				setIsPainting(true);
				setDrawingPoints((prev) => {
					const next = prev.slice();
					if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
					next.push({ x, y, mode: "draw" });
					return next;
				});
			}
		},
		[eraserMode]
	);

	const continueMouseDrawing = useCallback(
		(x: number, y: number) => {
			if (!isMouseDrawingRef.current) return;
			const mode = eraserMode ? "erase" : "draw";
			setDrawingPoints((prev) => {
				const last = prev[prev.length - 1];
				if (last && Math.abs(last.x - x) + Math.abs(last.y - y) < 2) return prev;
				return [...prev, { x, y, mode }];
			});
		},
		[eraserMode]
	);

	const endMouseDrawing = useCallback(() => {
		if (!isMouseDrawingRef.current) return;
		isMouseDrawingRef.current = false;
		setIsPainting(false);
		addSeparator();
	}, [addSeparator]);

	const startWiiDrawing = useCallback((pos: Position, mode: "draw" | "erase") => {
		setDrawingPoints((prev) => {
			const next = prev.slice();
			if (!wasWiiADownRef.current && next.length > 0 && next[next.length - 1] !== null) {
				next.push(null);
			}
			next.push({ ...pos, mode });
			return next;
		});
		wasWiiADownRef.current = true;
	}, []);

	const endWiiDrawing = useCallback(() => {
		if (wasWiiADownRef.current) {
			wasWiiADownRef.current = false;
			addSeparator();
		}
	}, [addSeparator]);

	return {
		drawingPoints,
		setDrawingPoints,
		eraserMode,
		setEraserMode,
		eraserButtonName,
		cursorPos,
		setCursorPos,
		isPainting,
		setIsPainting,
		isMouseDrawingRef,
		wasWiiADownRef,
		clearDrawing,
		addSeparator,
		addPoint,
		toggleEraserMode,
		startMouseDrawing,
		continueMouseDrawing,
		endMouseDrawing,
		startWiiDrawing,
		endWiiDrawing,
	};
}
