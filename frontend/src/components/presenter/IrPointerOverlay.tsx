"use client";

import type { WiiState } from "@/hooks/useWiiController";

interface IrPointerOverlayProps {
	wiiState: WiiState | null;
	isPlaying: boolean;
	irCursorEnabled: boolean;
	showIrDebug?: boolean;
}

function mapIrToScreen(irX: number, irY: number, screenW: number, screenH: number) {
	return {
		x: (1 - irX / 1024) * screenW,
		y: (irY / 768) * screenH,
	};
}

export function IrPointerOverlay({ wiiState, irCursorEnabled, showIrDebug = false }: IrPointerOverlayProps) {
	if (!showIrDebug || !wiiState) return null;

	return (
		<div
			style={{
				position: "absolute",
				bottom: 60,
				right: 20,
				background: "rgba(0, 0, 0, 0.85)",
				color: "lime",
				padding: "12px 16px",
				borderRadius: 8,
				fontFamily: "monospace",
				fontSize: 12,
				lineHeight: 1.6,
				border: "1px solid rgba(0, 255, 0, 0.3)",
				maxWidth: 320,
				zIndex: 9999,
			}}
		>
			<div style={{ fontWeight: "bold", marginBottom: 8, color: "#0ff" }}>📡 IR Sensor Debug</div>
			<div>
				<span style={{ color: "#888" }}>IRCursor:</span>{" "}
				<span style={{ color: irCursorEnabled ? "#0f0" : "#f55" }}>{irCursorEnabled ? "ON" : "OFF"}</span>
			</div>
			<div>
				<span style={{ color: "#888" }}>Detected:</span> {wiiState.ir?.length || 0} point(s)
			</div>
			{wiiState.ir && wiiState.ir.length > 0 && (
				<>
					<hr style={{ margin: "8px 0", border: "none", borderTop: "1px solid rgba(0,255,0,0.2)" }} />
					{wiiState.ir.map((dot, index) => {
						const screen = mapIrToScreen(dot.x, dot.y, window.innerWidth, window.innerHeight);
						return (
							<div key={index} style={{ marginBottom: 4 }}>
								<div style={{ color: "#0ff" }}>IR {index + 1}:</div>
								<div style={{ paddingLeft: 12 }}>
									<span style={{ color: "#888" }}>Raw:</span> ({dot.x}, {dot.y})
									<br />
									<span style={{ color: "#888" }}>Screen:</span> ({Math.round(screen.x)}, {Math.round(screen.y)})
								</div>
							</div>
						);
					})}
				</>
			)}
			<hr style={{ margin: "8px 0", border: "none", borderTop: "1px solid rgba(0,255,0,0.2)" }} />
			<div style={{ fontSize: 10, color: "#666" }}>
				座標範囲: X(0-1023), Y(0-767)
				<br />
				[C] IRカーソル切替 / [Space] デバッグ表示切替
			</div>
		</div>
	);
}
