"use client";

import type { Position } from "@/types";

interface EraserCursorProps {
	position: Position | null;
	isActive: boolean;
	buttonName?: string | null;
}

export function EraserCursor({ position, isActive, buttonName }: EraserCursorProps) {
	if (!isActive || !position) return null;

	return (
		<div
			style={{
				position: "fixed",
				bottom: 80,
				right: 20,
				background: "rgba(255, 100, 100, 0.7)",
				color: "white",
				padding: "8px 16px",
				borderRadius: 6,
				fontSize: 13,
				fontWeight: "normal",
				zIndex: 9999,
				boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
				pointerEvents: "none",
			}}
		>
			消しゴムモード ON
			<br />
			<small style={{ fontSize: 11 }}>左クリックまたはA+Bで消去 | {buttonName || "X"}で解除</small>
		</div>
	);
}
