"use client";

import Link from "next/link";
import { WiiBindingsEditor } from "@/components/settings/WiiBindingsEditor";

export default function SettingsPage() {
	const buttonStyle: React.CSSProperties = {
		display: "inline-flex",
		alignItems: "center",
		gap: 6,
		height: 32,
		padding: "0 10px",
	};

	const iconStyle: React.CSSProperties = {
		width: 16,
		height: 16,
		display: "inline-block",
		flex: "0 0 auto",
	};

	return (
		<div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "var(--font-geist-sans)" }}>
			<div
				style={{
					display: "flex",
					gap: 8,
					padding: 8,
					borderBottom: "1px solid #eee",
					alignItems: "center",
				}}
			>
				<Link href="/editor" style={{ textDecoration: "none" }}>
					<span style={buttonStyle} aria-label="エディタに戻る">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
							<path d="M15 18l-6-6 6-6" />
						</svg>
						エディタに戻る
					</span>
				</Link>
			</div>

			<main style={{ padding: 16, minHeight: 0, overflow: "auto" }}>
            	<div style={{ fontWeight: 700, fontSize: 26 }}>設定</div>

				<div style={{ fontWeight: 700, marginBottom: 8 }}>Wiiリモコン ボタン割り当て</div>
				<div style={{ fontSize: 12, opacity: 0.75, marginBottom: 12 }}>
					右の機能ブロックをドラッグして、左のスロットへドロップして割り当てます。
				</div>
				<WiiBindingsEditor />
			</main>
		</div>
	);
}
