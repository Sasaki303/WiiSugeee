"use client";

import { useEffect, useState } from "react";

type Props = {
    isPlaying: boolean;
    /** 「再生開始時にWii接続していた」フラグ */
    startedWithWii: boolean;
    /** 現在の接続状態（表示文言などに使うなら残してOK） */
    wiiConnected: boolean;

    /** backendから来た切断イベント（更新されるたびにポップアップを開く） */
    wiiDisconnectedAt: number | null;

    /** ★追加: 再生開始時刻（これ以降の切断のみポップアップ対象にする） */
    playingSince: number;
};

export function WiiDisconnectPopup({
    isPlaying,
    startedWithWii,
    wiiConnected,
    wiiDisconnectedAt,
    playingSince,
}: Props) {
    const [open, setOpen] = useState(false);

    // ★変更: 「発表中」かつ「開始時に接続していた」場合のみ、切断イベントで開く
    useEffect(() => {
        if (!isPlaying) return;
        if (!startedWithWii) return;
        if (!wiiDisconnectedAt) return;
        // ★追加: 再生開始後に起きた切断だけを対象にする（開始前の切断イベントを無視）
        if (wiiDisconnectedAt < playingSince) return;
        setOpen(true);
    }, [isPlaying, startedWithWii, wiiDisconnectedAt, playingSince]);

    // ★追加: 再接続されたら自動的にポップアップを閉じる
    useEffect(() => {
        if (wiiConnected && open) {
            setOpen(false);
        }
    }, [wiiConnected, open]);

    // 【デバッグ用】Dキーで接続切れポップアップを表示/非表示
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'd') {
                setOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Wiiリモコンの接続が切れました"
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 30000,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#FFFFFF",
                border: "3px solid #FF0000",
                boxShadow: "0 20px 80px rgba(255, 0, 0, 0.3)",
                padding: 40,
                textAlign: "center",
            }}
            onClick={() => setOpen(false)}
        >
            <div style={{ fontSize: 60, fontWeight: 400, marginBottom: 30, color: "#FF0000", fontFamily: "Doto, sans-serif" }}>
                Wii-Remote Disconected…
            </div>
            <div style={{ fontSize: 32, opacity: 0.9, lineHeight: 1.6, color: "#000000", marginBottom: 40 }}>
                接続（Bluetooth/電池）を確認してください。<br />
                キーボード操作（←/→）は引き続き利用できます。
            </div>

            <button 
                onClick={() => setOpen(false)} 
                style={{ 
                    padding: "20px 40px", 
                    fontSize: 24,
                    border: "2px solid #FF0000",
                    background: "#FFFFFF",
                    color: "#FF0000",
                    borderRadius: 30,
                    cursor: "pointer",
                    fontWeight: "bold",
                }}
            >
                閉じる
            </button>
        </div>
    );
}