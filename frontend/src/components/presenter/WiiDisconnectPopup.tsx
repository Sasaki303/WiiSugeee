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
                display: "grid",
                placeItems: "center",
                background: "rgba(0,0,0,0.75)",
                color: "white",
                padding: 24,
            }}
            onClick={() => setOpen(false)}
        >
            <div
                style={{
                    width: "min(720px, 92vw)",
                    borderRadius: 14,
                    background: "rgba(15,15,15,0.95)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    boxShadow: "0 20px 80px rgba(0,0,0,0.6)",
                    padding: 24,
                    textAlign: "center",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 10 }}>
                    Wiiリモコンの接続が切れました
                </div>
                <div style={{ fontSize: 16, opacity: 0.9, lineHeight: 1.6 }}>
                    接続（Bluetooth/電池）を確認してください。<br />
                    キーボード操作（←/→）は引き続き利用できます。
                </div>

                <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 12 }}>
                    <button onClick={() => setOpen(false)} style={{ padding: "10px 16px", fontSize: 16 }}>
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
}