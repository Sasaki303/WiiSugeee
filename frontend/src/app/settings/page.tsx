"use client";

import Link from "next/link";
import { WiiBindingsEditor } from "@/components/settings/WiiBindingsEditor";

export default function SettingsPage() {
	return (
		<main
			style={{
				minHeight: "100vh",
				padding: 24,
				fontFamily: "var(--font-geist-sans)",
				maxWidth: 1100,
				margin: "0 auto",
			}}
		>
			<header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
				<h1 style={{ fontSize: 20, fontWeight: 700 }}>設定</h1>
				<nav style={{ display: "flex", gap: 12, fontSize: 14 }}>
					<Link href="/">ホーム</Link>
					<Link href="/editor">エディタ</Link>
					<Link href="/present">発表</Link>
				</nav>
			</header>

			<section
				style={{
					border: "1px solid #e5e7eb",
					borderRadius: 12,
					padding: 16,
					background: "#fff",
				}}
			>
				<h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>ボタン割り当て（スライドごと）</h2>
				<p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
					ボタン割り当ては <b>エディタの Inspector</b> から、スライド（ノード）を選択して設定します。
					この画面は入口（ナビ）として用意しています。
				</p>
				<ul style={{ marginTop: 10, paddingLeft: 18, lineHeight: 1.8, fontSize: 13, color: "#374151" }}>
					<li>
						<Link href="/editor">エディタを開く</Link> → 右側の Inspector → <b>Wii ボタン割り当て</b>
					</li>
					<li>割り当てはスライドごとに <code>data.bindings</code> として保存されます</li>
				</ul>
			</section>

			<div style={{ marginTop: 24 }}>
				<div style={{ fontWeight: 700, marginBottom: 8 }}>Wiiリモコン ボタン割り当て</div>
				<div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
					右の機能ブロックをドラッグして、左のスロットへドロップして割り当てます。
				</div>
				<WiiBindingsEditor />
			</div>

			<section style={{ marginTop: 16, fontSize: 12, color: "#6b7280" }}>
				※ 今後ここに「共通設定」や「キーボードエミュレーション設定」などを追加できます。
			</section>
		</main>
	);
}
