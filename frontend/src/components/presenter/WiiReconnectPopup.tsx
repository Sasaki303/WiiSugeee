"use client";

import { useEffect, useState, useRef } from "react";

type Props = {
    isPlaying: boolean;
    wiiConnected: boolean;
    startedWithWii: boolean;
};

export function WiiReconnectPopup({ isPlaying, wiiConnected, startedWithWii }: Props) {
    const [open, setOpen] = useState(false);
    const prevConnectedRef = useRef(wiiConnected);

    useEffect(() => {
        // 発表中でない場合、または開始時にWii接続していなかった場合は表示しない
        if (!isPlaying || !startedWithWii) return;

        const wasDisconnected = !prevConnectedRef.current;
        const isNowConnected = wiiConnected;

        // 切断→接続に遷移したらポップアップを表示
        if (wasDisconnected && isNowConnected) {
            setOpen(true);

            // 1秒後に自動的に閉じる
            const timer = setTimeout(() => {
                setOpen(false);
            }, 1500);

            return () => clearTimeout(timer);
        }

        prevConnectedRef.current = wiiConnected;
    }, [wiiConnected, isPlaying, startedWithWii]);

    // 【デバッグ用】Rキーで再接続ポップアップを表示/非表示
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'r') {
                setOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
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
                width: "min(400px, 90vw)",
                borderRadius: 14,
                background: "#FFFFFF",
                border: "3px solid #87CEEB",
                boxShadow: "0 10px 40px rgba(135, 206, 235, 0.4)",
                padding: 20,
                color: "#87CEEB",
                textAlign: "center",
                animation: "slideInRight 0.3s ease-out",
            }}
        >
            <div style={{ fontSize: 24, fontWeight: 400, marginBottom: 8, fontFamily: "Doto, sans-serif" }}>
                Wii-Remote Conected!
            </div>
            <div style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.5, color: "#000000" }}>
                操作を再開できます
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
