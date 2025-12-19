"use client";

import { useEffect, useRef } from "react";
import type { WiiState } from "@/hooks/useWiiController";

interface IrPointerOverlayProps {
	wiiState: WiiState | null;
	isPlaying: boolean;
}

// IRカメラの座標(0-1023 x 0-767)を画面座標に変換する関数
function mapIrToScreen(irX: number, irY: number, screenW: number, screenH: number) {
	// Wiiリモコンの座標系: X=0-1023, Y=0-767
	// 左右反転が必要な場合は (1 - irX / 1024) を使用
	const x = (1 - irX / 1024) * screenW;
	const y = (irY / 768) * screenH;
	return { x, y };
}

export function IrPointerOverlay(props: IrPointerOverlayProps) {
	const { wiiState, isPlaying } = props;
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

		if (!wiiState || !wiiState.ir || wiiState.ir.length === 0) return;

		// IRポインター描画（複数の点に対応）
		wiiState.ir.forEach((dot, index) => {
			const pos = mapIrToScreen(dot.x, dot.y, window.innerWidth, window.innerHeight);

			// カーソル描画（グラデーション付き）
			const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 15);
			gradient.addColorStop(0, "rgba(0, 150, 255, 0.9)");
			gradient.addColorStop(0.7, "rgba(0, 100, 255, 0.5)");
			gradient.addColorStop(1, "rgba(0, 50, 255, 0.1)");

			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
			ctx.fill();

			// 中心点
			ctx.fillStyle = "white";
			ctx.beginPath();
			ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
			ctx.fill();

			// 十字線
			ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(pos.x - 20, pos.y);
			ctx.lineTo(pos.x + 20, pos.y);
			ctx.moveTo(pos.x, pos.y - 20);
			ctx.lineTo(pos.x, pos.y + 20);
			ctx.stroke();

			// ラベル表示
			ctx.fillStyle = "white";
			ctx.font = "12px monospace";
			ctx.fillText(`IR${index + 1}`, pos.x + 18, pos.y - 8);
		});
	}, [wiiState, isPlaying]);

	return (
		<>
			{/* IRポインタ表示用キャンバス */}
			<canvas
				ref={canvasRef}
				style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 10 }}
			/>

			{/* デバッグ情報表示 */}
			{wiiState && (
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
					<div style={{ fontWeight: "bold", marginBottom: 8, color: "#0ff" }}>
						📡 IR Sensor Debug
					</div>
					<div>
						<span style={{ color: "#888" }}>Detected:</span> {wiiState.ir?.length || 0} point(s)
					</div>
					{wiiState.ir && wiiState.ir.length > 0 && (
						<>
							<hr style={{ margin: "8px 0", border: "none", borderTop: "1px solid rgba(0,255,0,0.2)" }} />
							{wiiState.ir.map((dot, index) => (
								<div key={index} style={{ marginBottom: 4 }}>
									<div style={{ color: "#0ff" }}>IR {index + 1}:</div>
									<div style={{ paddingLeft: 12 }}>
										<span style={{ color: "#888" }}>Raw:</span> ({dot.x}, {dot.y})
										<br />
										<span style={{ color: "#888" }}>Screen:</span> (
										{Math.round(mapIrToScreen(dot.x, dot.y, window.innerWidth, window.innerHeight).x)},{" "}
										{Math.round(mapIrToScreen(dot.x, dot.y, window.innerWidth, window.innerHeight).y)})
									</div>
								</div>
							))}
						</>
					)}
					<hr style={{ margin: "8px 0", border: "none", borderTop: "1px solid rgba(0,255,0,0.2)" }} />
					<div style={{ fontSize: 10, color: "#666" }}>
						座標範囲: X(0-1023), Y(0-767)
					</div>
				</div>
			)}
		</>
	);
}
