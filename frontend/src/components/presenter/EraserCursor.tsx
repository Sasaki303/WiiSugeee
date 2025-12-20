"use client";

type EraserCursorProps = {
	position: { x: number; y: number } | null;
	isActive: boolean;
	buttonName?: string | null;
};

export function EraserCursor({ position, isActive, buttonName }: EraserCursorProps) {
	if (!isActive || !position) return null;

	return (
		<>
			{/* 消しゴムカーソル（赤い半透明の円） */}
			{/* <div
				style={{
					position: "fixed",
					left: position.x - 40,
					top: position.y - 40,
					width: 80,
					height: 80,
					borderRadius: "50%",
					border: "3px solid rgba(255, 0, 0, 0.8)",
					background: "rgba(255, 100, 100, 0.3)",
					pointerEvents: "none",
					zIndex: 10001,
					transition: "left 0.05s, top 0.05s",
				}}
			/> */}

			{/* 消しゴムモード表示（右下） */}
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
				<small style={{ fontSize: 11 }}>
					左クリックまたはA+Bで消去 | {buttonName || "X"}で解除
				</small>
			</div>
		</>
	);
}
