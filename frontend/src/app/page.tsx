"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { loadProjectFromZip } from "@/lib/projectArchive";

export default function Home() {
	const router = useRouter();

	const onLoadProject = useCallback(async () => {
		try {
			await loadProjectFromZip();
			router.push("/editor");
		} catch (e) {
			alert(
				`読み込みに失敗しました: ${e instanceof Error ? e.message : String(e)}`,
			);
		}
	}, [router]);

	return (
		<main style={{ padding: 16, fontFamily: "var(--font-geist-sans)" }}>
			<h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Wii Presenter</h1>
			<ul style={{ lineHeight: 1.8 }}>
				<li>
					<Link href="/editor">エディタを開く</Link>
				</li>
				<li>
					<Link href="/present">発表モードを開く</Link>
				</li>
				<li>
					<Link href="/settings">設定を開く</Link>
				</li>
				<li>
					<button onClick={onLoadProject}>wiislide.zip を読み込み</button>
				</li>
			</ul>
			<p style={{ marginTop: 12, opacity: 0.75, fontSize: 12 }}>
				保存した <code>wiislide.zip</code> をそのまま選択して読み込みます（展開不要）。
			</p>
		</main>
	);
}
