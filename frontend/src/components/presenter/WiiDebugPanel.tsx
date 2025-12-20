"use client";

import { useEffect, useRef, useState } from "react";
import type { WiiState } from "@/hooks/useWiiController";
import type { BindingAction, ButtonBindings } from "@/lib/buttonBindings";
import { formatAction } from "@/lib/buttonBindings";

type WiiDebugPanelProps = {
	wiiState: WiiState | null;
	pressed: Record<string, boolean>;
	effectiveProjectBindings: ButtonBindings;
	irCursorEnabled?: boolean;
	onToggleIrCursor?: () => void;
};

export function WiiDebugPanel({ wiiState, pressed, effectiveProjectBindings, irCursorEnabled, onToggleIrCursor }: WiiDebugPanelProps) {
	// 表示用の値を保持
	const [displayAccel, setDisplayAccel] = useState({ x: 0, y: 0, z: 0 });
	const displayIrCountRef = useRef(0);
	const displayButtonsRef = useRef("(none)");
	const displayBindingsRef = useRef<string[]>([]);
	const lastAccelUpdateRef = useRef(0);

	// 加速度センサーの更新（200msごとに更新）
	useEffect(() => {
		if (!wiiState || !wiiState.accel) return;

		const now = Date.now();
		const timeSinceLastUpdate = now - lastAccelUpdateRef.current;

		// 200ms経過している場合のみ更新
		if (timeSinceLastUpdate >= 200) {
			const current = wiiState.accel;
			
			// 全て0の場合は無視（無効なデータ）
			if (current.x === 0 && current.y === 0 && current.z === 0) {
				return;
			}
			
			setDisplayAccel(prev => {
				// 値が変わっている場合のみ更新
				if (current.x !== prev.x || current.y !== prev.y || current.z !== prev.z) {
					lastAccelUpdateRef.current = now;
					return { x: current.x, y: current.y, z: current.z };
				}
				return prev;
			});
		}
	}, [wiiState]);

	// IRカメラの更新（レンダリング中に直接更新）
	if (wiiState && wiiState.ir) {
		const currentCount = wiiState.ir.length;
		const prevCount = displayIrCountRef.current;
		
		if (currentCount !== prevCount) {
			displayIrCountRef.current = currentCount;
		}
	}

	// ボタンの更新（押されているボタンがある場合のみ更新）
	const on: string[] = [];
	for (const [btn, isDown] of Object.entries(pressed) as Array<[string, unknown]>) {
		if (isDown) on.push(btn);
	}
	// ボタンが押されている場合のみ更新（何も押されていない場合は前回の値を保持）
	if (on.length > 0) {
		const currentButtons = on.join(", ");
		displayButtonsRef.current = currentButtons;
	}

	// バインディング情報の更新（レンダリング中に直接更新）
	const entries = Object.entries(effectiveProjectBindings) as Array<[string, BindingAction | undefined]>;
	
	// 指定された順序でソート（ボタン名の大文字小文字に注意）
	const buttonOrder = ["Up", "Down", "Right", "Left", "A", "B", "Minus", "Home", "Plus", "One", "Two"];
	entries.sort((a, b) => {
		const indexA = buttonOrder.indexOf(a[0]);
		const indexB = buttonOrder.indexOf(b[0]);
		// 両方とも順序リストにある場合は順序に従う
		if (indexA !== -1 && indexB !== -1) return indexA - indexB;
		// aのみ順序リストにある場合はaを前に
		if (indexA !== -1) return -1;
		// bのみ順序リストにある場合はbを前に
		if (indexB !== -1) return 1;
		// 両方とも順序リストにない場合はアルファベット順
		return a[0].localeCompare(b[0]);
	});
	
	const currentBindings = entries.map(
		([btn, action]) => `${btn.padEnd(8)} → ${action ? formatAction(action) : "(unassigned)"}`
	);
	
	const prevBindings = displayBindingsRef.current;
	const hasChanged = 
		currentBindings.length !== prevBindings.length ||
		currentBindings.some((line, i) => line !== prevBindings[i]);
	
	if (hasChanged) {
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
				fontFamily:
					"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
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
				Acc: X={String(displayAccel.x).padStart(3)} Y={String(displayAccel.y).padStart(3)} Z={String(
					displayAccel.z,
				).padStart(3)}
			</div>
			<div style={{ color: "rgba(209,250,229,0.9)" }}>IR : {displayIrCountRef.current}</div>
			<div style={{ color: "rgba(209,250,229,0.9)" }}>{`Btn: ${displayButtonsRef.current}`}</div>
			
			{/* IRカーソル制御トグル */}
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
						{irCursorEnabled ? "🎯 IR Cursor: ON" : "IR Cursor: OFF"}
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
