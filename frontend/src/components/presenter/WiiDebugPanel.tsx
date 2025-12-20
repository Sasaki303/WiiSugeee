"use client";

import { useEffect, useRef, useState } from "react";
import type { WiiState } from "@/hooks/useWiiController";
import type { BindingAction, ButtonBindings } from "@/lib/buttonBindings";
import { formatAction } from "@/lib/buttonBindings";

interface WiiDebugPanelProps {
	wiiState: WiiState | null;
	pressed: Record<string, boolean>;
	effectiveProjectBindings: ButtonBindings;
	irCursorEnabled?: boolean;
	onToggleIrCursor?: () => void;
}

const BUTTON_ORDER = ["Up", "Down", "Right", "Left", "A", "B", "Minus", "Home", "Plus", "One", "Two"];
const ACCEL_UPDATE_INTERVAL = 200;

export function WiiDebugPanel({
	wiiState,
	pressed,
	effectiveProjectBindings,
	irCursorEnabled,
	onToggleIrCursor,
}: WiiDebugPanelProps) {
	const [displayAccel, setDisplayAccel] = useState({ x: 0, y: 0, z: 0 });
	const displayIrCountRef = useRef(0);
	const displayButtonsRef = useRef("(none)");
	const displayBindingsRef = useRef<string[]>([]);
	const lastAccelUpdateRef = useRef(0);

	useEffect(() => {
		if (!wiiState?.accel) return;

		const now = Date.now();
		if (now - lastAccelUpdateRef.current < ACCEL_UPDATE_INTERVAL) return;

		const { x, y, z } = wiiState.accel;
		if (x === 0 && y === 0 && z === 0) return;

		setDisplayAccel((prev) => {
			if (x !== prev.x || y !== prev.y || z !== prev.z) {
				lastAccelUpdateRef.current = now;
				return { x, y, z };
			}
			return prev;
		});
	}, [wiiState]);

	if (wiiState?.ir) {
		const currentCount = wiiState.ir.length;
		if (currentCount !== displayIrCountRef.current) {
			displayIrCountRef.current = currentCount;
		}
	}

	const pressedButtons = Object.entries(pressed)
		.filter(([, isDown]) => isDown)
		.map(([btn]) => btn);
	if (pressedButtons.length > 0) {
		displayButtonsRef.current = pressedButtons.join(", ");
	}

	const entries = Object.entries(effectiveProjectBindings) as Array<[string, BindingAction | undefined]>;
	entries.sort((a, b) => {
		const indexA = BUTTON_ORDER.indexOf(a[0]);
		const indexB = BUTTON_ORDER.indexOf(b[0]);
		if (indexA !== -1 && indexB !== -1) return indexA - indexB;
		if (indexA !== -1) return -1;
		if (indexB !== -1) return 1;
		return a[0].localeCompare(b[0]);
	});

	const currentBindings = entries.map(
		([btn, action]) => `${btn.padEnd(8)} → ${action ? formatAction(action) : "(unassigned)"}`
	);

	if (
		currentBindings.length !== displayBindingsRef.current.length ||
		currentBindings.some((line, i) => line !== displayBindingsRef.current[i])
	) {
		displayBindingsRef.current = currentBindings;
	}

	return (
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
				fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
				zIndex: 9999,
				pointerEvents: "auto",
				minWidth: 360,
				whiteSpace: "pre",
				lineHeight: 1.35,
				border: "1px solid rgba(255,255,255,0.12)",
			}}
		>
			<div style={{ fontWeight: 800, color: "#a7f3d0", marginBottom: 8 }}>Wii Debug</div>
			<div style={{ color: "rgba(209,250,229,0.9)" }}>
				Acc: X={String(displayAccel.x).padStart(3)} Y={String(displayAccel.y).padStart(3)} Z=
				{String(displayAccel.z).padStart(3)}
			</div>
			<div style={{ color: "rgba(209,250,229,0.9)" }}>IR : {displayIrCountRef.current}</div>
			<div style={{ color: "rgba(209,250,229,0.9)" }}>{`Btn: ${displayButtonsRef.current}`}</div>

			{onToggleIrCursor && (
				<div style={{ marginTop: 8 }}>
					<button
						onClick={onToggleIrCursor}
						style={{
							background: irCursorEnabled ? "#10b981" : "#374151",
							color: "#fff",
							border: "none",
							borderRadius: 6,
							padding: "6px 12px",
							cursor: "pointer",
							fontWeight: 700,
							fontSize: 12,
							width: "100%",
						}}
					>
						{irCursorEnabled ? "IR Cursor: ON" : "IR Cursor: OFF"}
					</button>
				</div>
			)}

			<div style={{ margin: "10px 0", borderTop: "1px solid rgba(255,255,255,0.12)" }} />
			<div style={{ fontWeight: 800, color: "#a7f3d0", marginBottom: 6 }}>Bindings (project)</div>
			{displayBindingsRef.current.map((line) => (
				<div key={line}>{line}</div>
			))}
		</div>
	);
}
