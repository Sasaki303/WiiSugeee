"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type TabKey = "overview" | "editor" | "present" | "wii";

export default function HowToUsePage() {
    const [isDark, setIsDark] = useState(true);
    const [activeTab, setActiveTab] = useState<TabKey>("overview");

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

    // カラースキーム設定
    const colors = {
        bg: isDark ? "#000000" : "#FFFFFF",
        text: isDark ? "#FFFFFF" : "#000000",
        button: isDark ? "#333333" : "#FFFFFF",
        buttonBorder: "#87CEEB",
        buttonHoverBg: "#87CEEB",
        buttonHoverText: "#000000",
        lineBorder: "#87CEEB",
        headerFooterBg: isDark ? "#333333" : "#F5F5F5",
        contentBg: isDark ? "#1a1a1a" : "#FAFAFA",
        activeTabBg: "#87CEEB",
        activeTabText: "#000000",
    };

    // タブボタンスタイル
    const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
        border: `2px solid ${colors.buttonBorder}`,
        backgroundColor: isActive ? colors.activeTabBg : colors.button,
        color: isActive ? colors.activeTabText : colors.text,
        borderRadius: "30px",
        padding: "10px 20px",
        fontSize: "16px",
        fontWeight: isActive ? "bold" : "normal",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "var(--font-geist-sans)",
        boxShadow: isActive 
            ? "0 0 10px rgba(135, 206, 235, 0.5), 0 0 20px rgba(135, 206, 235, 0.3)" 
            : "none",
    });

    // タブ定義
    const tabs: { key: TabKey; label: string; icon: string }[] = [
        { key: "overview", label: "概要", icon: "📖" },
        { key: "editor", label: "エディタ", icon: "✏️" },
        { key: "present", label: "発表モード", icon: "📽️" },
        { key: "wii", label: "Wiiリモコン", icon: "🎮" },
    ];

    // タブコンテンツ
    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <div>
                        <h2 style={{ fontSize: 28, marginBottom: 20, color: colors.buttonBorder }}>
                            WiiCanとは？
                        </h2>
                        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
                            WiiCanは、Wiiリモコンを使ってプレゼンテーションを操作できる革新的なツールです。<br />
                            スライドの作成から発表まで、すべてをWiiリモコンで直感的に操作できます。
                        </p>
                        
                        <h3 style={{ fontSize: 22, marginBottom: 15, marginTop: 30 }}>主な機能</h3>
                        <ul style={{ fontSize: 16, lineHeight: 2, paddingLeft: 20 }}>
                            <li>📝 スライドエディタ - PDFや画像からスライドを作成</li>
                            <li>📽️ 発表モード - フルスクリーンでプレゼンテーション</li>
                            <li>🎮 Wiiリモコン対応 - ボタン操作でスライド切り替え</li>
                            <li>🎨 ペイント機能 - 発表中に画面に書き込み可能</li>
                            <li>🔊 効果音 - プレゼンを盛り上げるサウンドエフェクト</li>
                        </ul>

                        <h3 style={{ fontSize: 22, marginBottom: 15, marginTop: 30 }}>クイックスタート</h3>
                        <ol style={{ fontSize: 16, lineHeight: 2, paddingLeft: 20 }}>
                            <li>ホーム画面から「エディタを開く」を選択</li>
                            <li>PDFまたは画像ファイルをインポート</li>
                            <li>スライドを編集・整理</li>
                            <li>「発表モード」で本番開始！</li>
                        </ol>
                    </div>
                );

            case "editor":
                return (
                    <div>
                        <h2 style={{ fontSize: 28, marginBottom: 20, color: colors.buttonBorder }}>
                            エディタの使い方
                        </h2>
                        
                        {/* 操作方法の画像 */}
                        <div style={{ 
                            display: "flex", 
                            gap: 20, 
                            marginBottom: 30,
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}>
                            <img 
                                src="/Frame 47.png" 
                                alt="エディタ操作方法1" 
                                style={{ 
                                    maxWidth: "280px", 
                                    width: "100%",
                                    borderRadius: 12,
                                    border: `2px solid ${colors.buttonBorder}`,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                                }} 
                            />
                            <img 
                                src="/Frame 48.png" 
                                alt="エディタ操作方法2" 
                                style={{ 
                                    maxWidth: "280px", 
                                    width: "100%",
                                    borderRadius: 12,
                                    border: `2px solid ${colors.buttonBorder}`,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                                }} 
                            />
                            <img 
                                src="/Frame 49.png" 
                                alt="エディタ操作方法3" 
                                style={{ 
                                    maxWidth: "280px", 
                                    width: "100%",
                                    borderRadius: 12,
                                    border: `2px solid ${colors.buttonBorder}`,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                                }} 
                            />
                        </div>

                        <h3 style={{ fontSize: 22, marginBottom: 15 }}>スライドの作成</h3>
                        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
                            エディタでは、PDFファイルや画像・動画ファイルをキャンバスに追加してスライドを作成できます。<br />
                            ファイルをドラッグ＆ドロップするか、クリックしてファイルを選択してください。
                        </p>

                        <h4 style={{ fontSize: 18, marginBottom: 10, marginTop: 25 }}>📄 PDFの追加</h4>
                        <ol style={{ fontSize: 16, lineHeight: 2, paddingLeft: 20, marginBottom: 20 }}>
                            <li>PDFファイル（.pdf）をキャンバスにドラッグ＆ドロップ</li>
                            <li>または、エディタ画面をクリックしてPDFファイルを選択</li>
                            <li>PDFの各ページが自動的にスライドノードとして追加されます</li>
                            <li>ページ間は自動的にエッジで接続されます</li>
                        </ol>

                        <h4 style={{ fontSize: 18, marginBottom: 10, marginTop: 25 }}>🖼️ 画像の追加</h4>
                        <ol style={{ fontSize: 16, lineHeight: 2, paddingLeft: 20, marginBottom: 20 }}>
                            <li>画像ファイル（.png / .jpg / .jpeg）をキャンバスにドラッグ＆ドロップ</li>
                            <li>または、エディタ画面をクリックして画像ファイルを選択</li>
                            <li>各画像がスライドノードとして追加されます</li>
                        </ol>

                        <h4 style={{ fontSize: 18, marginBottom: 10, marginTop: 25 }}>🎬 動画の追加</h4>
                        <ol style={{ fontSize: 16, lineHeight: 2, paddingLeft: 20, marginBottom: 20 }}>
                            <li>動画ファイル（.mp4）をキャンバスにドラッグ＆ドロップ</li>
                            <li>または、エディタ画面をクリックして動画ファイルを選択</li>
                            <li>動画がスライドノードとして追加されます</li>
                            <li>発表モードでは動画が自動再生されます（音声あり）</li>
                        </ol>

                        <h3 style={{ fontSize: 22, marginBottom: 15, marginTop: 30 }}>スライドの整理</h3>
                        <ul style={{ fontSize: 16, lineHeight: 2, paddingLeft: 20 }}>
                            <li>ノードをドラッグ＆ドロップで移動</li>
                            <li>ノードとノードをつなげてスライドの順序を定義</li>
                            <li>複数のファイルを同時にドロップ可能</li>
                            <li>エディタ上部の「発表モード」ボタンでプレゼンテーション開始</li>
                        </ul>
                    </div>
                );

            case "present":
                return (
                    <div>
                        <h2 style={{ fontSize: 28, marginBottom: 20, color: colors.buttonBorder }}>
                            発表モードの使い方
                        </h2>

                        <h3 style={{ fontSize: 22, marginBottom: 15 }}>基本操作</h3>
                        <table style={{ 
                            width: "100%", 
                            borderCollapse: "collapse", 
                            marginBottom: 30,
                            fontSize: 16,
                        }}>
                            <thead>
                                <tr style={{ borderBottom: `2px solid ${colors.buttonBorder}` }}>
                                    <th style={{ padding: 12, textAlign: "left" }}>操作</th>
                                    <th style={{ padding: 12, textAlign: "left" }}>キーボード</th>
                                    <th style={{ padding: 12, textAlign: "left" }}>Wiiリモコン</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: "1px solid #444" }}>
                                    <td style={{ padding: 12 }}>次のスライド</td>
                                    <td style={{ padding: 12 }}>→ / Space / Enter</td>
                                    <td style={{ padding: 12 }}>Aボタン / →ボタン</td>
                                </tr>
                                <tr style={{ borderBottom: "1px solid #444" }}>
                                    <td style={{ padding: 12 }}>前のスライド</td>
                                    <td style={{ padding: 12 }}>← / Backspace</td>
                                    <td style={{ padding: 12 }}>Bボタン / ←ボタン</td>
                                </tr>
                                <tr style={{ borderBottom: "1px solid #444" }}>
                                    <td style={{ padding: 12 }}>ペイントモード</td>
                                    <td style={{ padding: 12 }}>P</td>
                                    <td style={{ padding: 12 }}>設定で割り当て</td>
                                </tr>
                                <tr style={{ borderBottom: "1px solid #444" }}>
                                    <td style={{ padding: 12 }}>発表終了</td>
                                    <td style={{ padding: 12 }}>Escape</td>
                                    <td style={{ padding: 12 }}>HOMEボタン</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3 style={{ fontSize: 22, marginBottom: 15 }}>🎨 ペイント機能</h3>
                        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 15 }}>
                            発表中にスライド上に直接書き込みができます。
                        </p>
                        <ul style={{ fontSize: 16, lineHeight: 2, paddingLeft: 20, marginBottom: 20 }}>
                            <li>マウスクリック（またはWiiリモコンのAボタン）を押しながらドラッグで描画</li>
                            <li>Wiiリモコン使用時はIRポインターの位置に描画されます</li>
                            <li>Eキー（またはWiiリモコンの割り当て）で消しゴムモード切り替え</li>
                            <li>Iキー（またはWiiリモコンの割り当て）でIRカーソル表示/非表示切り替え</li>
                        </ul>

                        <h3 style={{ fontSize: 22, marginBottom: 15, marginTop: 30 }}>🔊 効果音</h3>
                        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 15 }}>
                            キーボードのQ/W/Eキーで効果音を再生できます。<br />
                            Wiiリモコン接続時は、PC側とWiiリモコンのスピーカー両方で再生されます。
                        </p>
                        <ul style={{ fontSize: 16, lineHeight: 2, paddingLeft: 20 }}>
                            <li>Q - ショット音</li>
                            <li>W - UXO音</li>
                            <li>E - OH音</li>
                        </ul>
                    </div>
                );

            case "wii":
                return (
                    <div>
                        <h2 style={{ fontSize: 28, marginBottom: 20, color: colors.buttonBorder }}>
                            Wiiリモコンの接続方法
                        </h2>

                        <h3 style={{ fontSize: 22, marginBottom: 15 }}>事前準備</h3>
                        <ul style={{ fontSize: 16, lineHeight: 2, paddingLeft: 20, marginBottom: 20 }}>
                            <li>Wiiリモコン（電池入り）</li>
                            <li>Bluetooth対応のPC</li>
                            <li>バックエンドサーバーの起動</li>
                        </ul>

                        <h3 style={{ fontSize: 22, marginBottom: 15, marginTop: 30 }}>接続手順</h3>
                        <ol style={{ fontSize: 16, lineHeight: 2.2, paddingLeft: 20, marginBottom: 20 }}>
                            <li>バックエンドサーバーを起動（`cd backend && npm start`）</li>
                            <li>PCのBluetooth設定を開く</li>
                            <li>Wiiリモコンの①②ボタンを同時に長押ししてペアリングモードにする</li>
                            <li>PCのBluetooth設定で「Nintendo RVL-CNT-01」を選択してペアリング</li>
                            <li>バックエンドサーバーが自動的にWiiリモコンを検出</li>
                            <li>WiiCanのホーム画面下部にWiiリモコンのアイコンが表示されれば接続完了！</li>
                        </ol>

                        <h3 style={{ fontSize: 22, marginBottom: 15, marginTop: 30 }}>ボタン割り当て</h3>
                        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 15 }}>
                            エディタ画面でWiiリモコンの各ボタンに機能を割り当てられます。
                        </p>
                        <ul style={{ fontSize: 16, lineHeight: 2, paddingLeft: 20, marginBottom: 20 }}>
                            <li>エディタ画面を開く</li>
                            <li>画面左上の「Wiiリモコン設定」アイコンをクリック</li>
                            <li>Wiiリモコンの画像が表示されます</li>
                            <li>各ボタンをクリックして割り当てる機能を選択</li>
                            <li>設定は自動的に保存されます</li>
                        </ul>

                        <h3 style={{ fontSize: 22, marginBottom: 15, marginTop: 30 }}>トラブルシューティング</h3>
                        <table style={{ 
                            width: "100%", 
                            borderCollapse: "collapse",
                            fontSize: 16,
                        }}>
                            <thead>
                                <tr style={{ borderBottom: `2px solid ${colors.buttonBorder}` }}>
                                    <th style={{ padding: 12, textAlign: "left" }}>問題</th>
                                    <th style={{ padding: 12, textAlign: "left" }}>対処法</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: "1px solid #444" }}>
                                    <td style={{ padding: 12 }}>接続できない</td>
                                    <td style={{ padding: 12 }}>電池を確認、Bluetoothを再起動</td>
                                </tr>
                                <tr style={{ borderBottom: "1px solid #444" }}>
                                    <td style={{ padding: 12 }}>接続が切れる</td>
                                    <td style={{ padding: 12 }}>電池残量を確認、距離を近づける</td>
                                </tr>
                                <tr style={{ borderBottom: "1px solid #444" }}>
                                    <td style={{ padding: 12 }}>ボタンが反応しない</td>
                                    <td style={{ padding: 12 }}>バックエンドサーバーを再起動</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );

            default:
                return null;
        }
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
                flexDirection: "column",
                padding: "20px 40px",
                borderBottom: `2px solid ${colors.lineBorder}`,
                backgroundColor: colors.headerFooterBg,
                gap: 20,
            }}>
                {/* タイトルとホームへ戻るボタン */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h1 style={{
                        fontSize: "36px",
                        fontWeight: "700",
                        margin: "0",
                        color: colors.text,
                    }}>
                        📖 使い方ガイド
                    </h1>

                    <Link href="/"
                        style={{
                            border: `2px solid ${colors.buttonBorder}`,
                            backgroundColor: colors.button,
                            color: colors.text,
                            borderRadius: "30px",
                            padding: "10px 20px",
                            fontSize: "14px",
                            textDecoration: "none",
                            transition: "all 0.2s ease",
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
                        ← ホームへ戻る
                    </Link>
                </div>

                {/* タブボタン */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={tabButtonStyle(activeTab === tab.key)}
                            onMouseEnter={(e) => {
                                if (activeTab !== tab.key) {
                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.buttonHoverBg;
                                    (e.currentTarget as HTMLButtonElement).style.color = colors.buttonHoverText;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== tab.key) {
                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.button;
                                    (e.currentTarget as HTMLButtonElement).style.color = colors.text;
                                }
                            }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* ========== コンテンツエリア ========== */}
            <main style={{
                flex: 1,
                padding: "40px",
                backgroundColor: colors.contentBg,
                overflowY: "auto",
            }}>
                <div style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                }}>
                    {renderContent()}
                </div>
            </main>
        </main>
    );
}
