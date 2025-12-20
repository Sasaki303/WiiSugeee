"use client";

import { useEffect, useState } from "react";

interface WiiDisconnectPopupProps {
	isPlaying: boolean;
	startedWithWii: boolean;
	wiiConnected: boolean;
	wiiDisconnectedAt: number | null;
	playingSince: number;
}

export function WiiDisconnectPopup({
	isPlaying,
	startedWithWii,
	wiiConnected,
	wiiDisconnectedAt,
	playingSince,
}: WiiDisconnectPopupProps) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!isPlaying || !startedWithWii || !wiiDisconnectedAt) return;
		if (wiiDisconnectedAt < playingSince) return;
		setOpen(true);
	}, [isPlaying, startedWithWii, wiiDisconnectedAt, playingSince]);

	useEffect(() => {
		if (wiiConnected && open) setOpen(false);
	}, [wiiConnected, open]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() === "d") setOpen((prev) => !prev);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	if (!open) return null;

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-label="Wiiリモコンの接続が切れました"
			onClick={() => setOpen(false)}
			style={{
				position: "absolute",
				inset: 0,
				zIndex: 30000,
				display: "grid",
				placeItems: "center",
				background: "rgba(0,0,0,0.75)",
				color: "white",
				padding: 24,
			}}
		>
			<div style={{ display: "inline-block", transformOrigin: "center" }} onClick={(e) => e.stopPropagation()}>
				<div style={{ transform: "scale(2.5)", transformOrigin: "center", display: "inline-block" }}>
					<div
						style={{
							width: "min(720px, 92vw)",
							borderRadius: 14,
							background: "#FFFFFF",
							border: "3px solid #FF0000",
							boxShadow: "0 20px 80px rgba(255, 0, 0, 0.3)",
							padding: 24,
							textAlign: "center",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<div
							style={{
								fontSize: 30,
								fontWeight: 400,
								marginBottom: 10,
								color: "#FF0000",
								fontFamily: "Doto, sans-serif",
							}}
						>
							Wii-Remote Disconected…
						</div>
						<div style={{ fontSize: 16, opacity: 0.9, lineHeight: 1.6, color: "#000000" }}>
							接続（Bluetooth/電池）を確認してください。
							<br />
							キーボード操作（←/→）は引き続き利用できます。
						</div>
						<div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 12 }}>
							<button onClick={() => setOpen(false)} style={{ padding: "10px 16px", fontSize: 16 }}>
								閉じる
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
