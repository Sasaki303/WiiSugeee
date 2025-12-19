"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { loadProjectFromZip } from "@/lib/projectArchive";

export default function Home() {
    const router = useRouter();

    /**
     * Zipファイルからプロジェクトを読み込み、エディタ画面へ遷移するハンドラー
     */
    const onLoadProject = useCallback(async () => {
        try {
            // Zipの解析とデータの展開処理を実行
            await loadProjectFromZip();
            // 成功したらエディタページへ移動
            router.push("/editor");
        } catch (e) {
            // エラーが発生した場合は、メッセージをアラートで表示
            alert(
                `読み込みに失敗しました: ${e instanceof Error ? e.message : String(e)}`,
            );
        }
    }, [router]);

    return (
        <main style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: 16, 
            fontFamily: "var(--font-geist-sans)" 
        }}>
            {/* サービスロゴ・タイトルエリア */}
            <h1 style={{ fontSize: 64, fontWeight: 700, marginBottom: 30, textAlign: 'center' }}>
                <span style={{ fontFamily: 'ContinuumBold, sans-serif' }}>Wii</span>
                <span style={{ fontFamily: 'ContinuumMedium, sans-serif' }}>Can</span>
            </h1>

            {/* ナビゲーションメニュー */}
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
                    {/* Zip読み込みトリガー。通常のリンクではなくボタンとして実装 */}
                    <button onClick={onLoadProject}>wiislide.zip を読み込み</button>
                </li>
            </ul>

            {/* ユーザー向けの補足説明 */}
            <p style={{ marginTop: 12, opacity: 0.75, fontSize: 12 }}>
                保存した <code>wiislide.zip</code> をそのまま選択して読み込みます（展開不要）。
            </p>
        </main>
    );
}