"use client";

import Link from "next/link";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadProjectFromZip } from "@/lib/projectArchive";
import { useWiiController } from "@/hooks/useWiiController";

export default function Home() {
    const router = useRouter();
    const { wiiConnected } = useWiiController();
    const [isDark, setIsDark] = useState(true);

    // ダークモード設定を検出
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDark(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setIsDark(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

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

	const menuItems = [
		{ label: "エディタを開く", href: "/editor", icon: "✏️" },
		{ label: "発表モードを開く", href: "/present", icon: "📽️" },
		{ label: "プロジェクトの読み込み", action: onLoadProject, icon: "📂" },
		{ label: "ムービーを見る", href: "/movie", icon: "🎬" },
	];

    // カラースキーム設定
    const colors = {
        bg: isDark ? "#000000" : "#FFFFFF",
        text: isDark ? "#FFFFFF" : "#000000",
        button: isDark ? "#333333" : "#FFFFFF",
        border: isDark ? "#FFFFFF" : "#000000",
        buttonBorder: "#87CEEB",
        buttonHoverBg: "#87CEEB",
        buttonHoverText: isDark ? "#000000" : "#000000",
        disconnectedText: isDark ? "#cacacaff" : "#454545ff",
        wiiRemoteImage: isDark ? "/phKuro 3.png" : "/phShiro 3.png",
        lineBorder: "#87CEEB",
        headerFooterBg: isDark ? "#333333" : "#F5F5F5",
    };

    // ボタンのベーススタイル（1〜4のボタンは統一サイズ）
    const buttonBaseStyle: React.CSSProperties = {
        border: `3px solid ${colors.buttonBorder}`,
        backgroundColor: colors.button,
        borderRadius: "80px",
        padding: "70px 50px",
        fontSize: "25px",
        fontWeight: "bold",
        cursor: "pointer",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        fontFamily: "var(--font-geist-sans)",
        height: "120px",
        width: "420px",
        boxShadow: "0 0 10px rgba(135, 206, 235, 0.5), 0 0 20px rgba(135, 206, 235, 0.5)",
    };

    const smallButtonStyle: React.CSSProperties = {
        ...buttonBaseStyle,
        padding: "12px 24px",
        fontSize: "18px",
        height: "60px",
        width: "150px",
    };

    return (
        <main style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            fontFamily: "var(--font-geist-sans)",
            backgroundColor: colors.bg,
            color: colors.text,
        }}>
            {/* ========== ヘッダーエリア ========== */}
            <header style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "20px 40px",
                borderBottom: `2px solid ${colors.lineBorder}`,
                backgroundColor: colors.headerFooterBg,
            }}>
                {/* 左側：タイトル */}
                <h1 style={{
                    fontSize: "48px",
                    fontWeight: "700",
                    margin: "0",
                    color: colors.text,
                }}>
                    <span style={{ fontFamily: "ContinuumBold, sans-serif" }}>Wii</span>
                    <span style={{ fontFamily: "ContinuumMedium, sans-serif" }}>Can</span>
                </h1>

                {/* 右側：ボタンとロゴを縦積み */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                }}>
                    {/* ⑤使い方へ遷移するボタン */}
                    <Link href="/how-to-use"
                        style={{
                            ...smallButtonStyle,
                            textDecoration: "none",
                            color: colors.text,
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = colors.buttonHoverBg;
                            (e.currentTarget as HTMLAnchorElement).style.color = colors.buttonHoverText;
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = colors.button;
                            (e.currentTarget as HTMLAnchorElement).style.color = colors.text;
                        }}
                    >
                        📓使い方
                    </Link>

                </div>
            </header>

            {/* ========== メインエリア ========== */}
            <main style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
            }}>
                {/* 2列2行グリッド */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "30px",
                    maxWidth: "800px",
                    width: "100%",
                }}>
                    {menuItems.map((item, index) => (
                        <div key={index} style={{ display: "flex", justifyContent: "center" }}>
                            {item.action ? (
                                <button
                                    onClick={item.action}
                                    style={{
                                        ...buttonBaseStyle,
                                        color: colors.text,
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.buttonHoverBg;
                                        (e.currentTarget as HTMLButtonElement).style.color = colors.buttonHoverText;
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.button;
                                        (e.currentTarget as HTMLButtonElement).style.color = colors.text;
                                    }}
                                >
                                    <span style={{ marginRight: "8px" }}>{item.icon}</span>
                                    {item.label}
                                </button>
                            ) : (
                                <Link href={item.href}
                                    style={{
                                        ...buttonBaseStyle,
                                        color: colors.text,
                                        textDecoration: "none",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = colors.buttonHoverBg;
                                        (e.currentTarget as HTMLAnchorElement).style.color = colors.buttonHoverText;
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = colors.button;
                                        (e.currentTarget as HTMLAnchorElement).style.color = colors.text;
                                    }}
                                >
                                    <span style={{ marginRight: "8px" }}>{item.icon}</span>
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            {/* ========== フッターエリア ========== */}
            <footer style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 40px",
                borderTop: `2px solid ${colors.lineBorder}`,
                backgroundColor: colors.headerFooterBg,
                maxHeight: "80px",
                gap: "10px",
            }}>
                {/* 左側：Wiiリモコン情報 */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Wiiリモコン画像 - 常に表示 */}
                    <img
                        src={colors.wiiRemoteImage}
                        alt="Wii Remote"
                        style={{
                            width: "90px",
                            height: "200px",
                            opacity: wiiConnected ? 1 : 0.5,
                        }}
                    />
                    {/* 接続状態テキスト */}
                    {wiiConnected ? (
                        <span style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: colors.text,
                        }}>
                            1P🔋
                        </span>
                    ) : (
                        <span style={{
                            fontSize: "16px",
                            color: colors.disconnectedText,
                            opacity: 0.7,
                        }}>
                            Wiiリモコン未接続…
                        </span>
                    )}
                </div>

                {/* 右側：ロゴ */}
                <img
                    src={isDark ? "/stevenShiro.png" : "/stevenKuro.png"}
                    alt="Logo"
                    style={{
                        width: "100px",
                        height: "26px",
                    }}
                />
            </footer>
        </main>
    );
}