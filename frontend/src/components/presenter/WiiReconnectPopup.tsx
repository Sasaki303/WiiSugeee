"use client";

import { useEffect, useState, useRef } from "react";

interface WiiReconnectPopupProps {
	isPlaying: boolean;
	wiiConnected: boolean;
	startedWithWii: boolean;
}

export function WiiReconnectPopup({ isPlaying, wiiConnected, startedWithWii }: WiiReconnectPopupProps) {
	const [open, setOpen] = useState(false);
	const prevConnectedRef = useRef(wiiConnected);

	useEffect(() => {
		if (!isPlaying || !startedWithWii) return;

		const wasDisconnected = !prevConnectedRef.current;
		if (wasDisconnected && wiiConnected) {
			setOpen(true);
			const timer = setTimeout(() => setOpen(false), 1500);
			return () => clearTimeout(timer);
		}

		prevConnectedRef.current = wiiConnected;
	}, [wiiConnected, isPlaying, startedWithWii]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() === "r") setOpen((prev) => !prev);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	if (!open) return null;

	return (
		<div
			role="alert"
			aria-live="polite"
			aria-label="Wiiリモコンが接続されました"
			style={{
				position: "absolute",
				top: 80,
				right: 20,
				zIndex: 30000,
				width: "auto",
				pointerEvents: "none",
			}}
		>
			<div style={{ display: "inline-block", transformOrigin: "top right", pointerEvents: "auto" }}>
				<div
					style={{
						display: "inline-block",
						animation: "slideInRight 0.3s ease-out",
						transformOrigin: "top right",
					}}
				>
					<div
						style={{
							display: "inline-block",
							transform: "scale(3)",
							transformOrigin: "top right",
							borderRadius: 14,
							background: "#FFFFFF",
							border: "3px solid #87CEEB",
							boxShadow: "0 10px 40px rgba(135, 206, 235, 0.4)",
							padding: 20,
							color: "#87CEEB",
							textAlign: "center",
							width: "min(400px, 90vw)",
						}}
					>
						<div style={{ fontSize: 24, fontWeight: 400, marginBottom: 8, fontFamily: "Doto, sans-serif" }}>
							Wii-Remote Conected!
						</div>
						<div style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.5, color: "#000000" }}>
							操作を再開できます
						</div>
					</div>
				</div>
			</div>
			<style jsx>{`
				@keyframes slideInRight {
					from {
						transform: translateX(100%);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}
			`}</style>
		</div>
	);
}
