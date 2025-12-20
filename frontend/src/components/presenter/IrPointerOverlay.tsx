"use client";

import { useEffect, useRef, useState } from "react";
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
	const cursorImgRef = useRef<HTMLImageElement | null>(null);
	const [cursorLoaded, setCursorLoaded] = useState(false);

	// カーソル画像をロード
	useEffect(() => {
		const img = new Image();
		img.src = "/cursor-original.png";
		img.onload = () => {
			cursorImgRef.current = img;
			setCursorLoaded(true);
		};
		img.onerror = () => {
			console.error("Failed to load cursor-original.png");
		};
	}, []);

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

		// カーソル画像が読み込まれていない場合はフォールバック表示
		if (!cursorLoaded || !cursorImgRef.current) {
			// フォールバック: シンプルな円で表示
			wiiState.ir.forEach((dot) => {
				const pos = mapIrToScreen(dot.x, dot.y, window.innerWidth, window.innerHeight);
				
				ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
				ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
				ctx.fill();
				ctx.stroke();
			});
			return;
		}

		// カーソル画像で表示（最初のIRポイントのみ使用）
		const dot = wiiState.ir[0];
		const pos = mapIrToScreen(dot.x, dot.y, window.innerWidth, window.innerHeight);
		
		const cursorImg = cursorImgRef.current;
		const cursorWidth = 50; // 画像の表示サイズ
		const cursorHeight = 50;
		
		// 指先位置（左上）が座標位置に来るように描画
		// cursor-original.pngは指が左上を向いているため、オフセットを調整
		ctx.drawImage(
			cursorImg,
			pos.x - 2, // 指先のX位置（画像左端から少し右）
			pos.y - 2, // 指先のY位置（画像上端から少し下）
			cursorWidth,
			cursorHeight
		);
	}, [wiiState, isPlaying, cursorLoaded]);

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
