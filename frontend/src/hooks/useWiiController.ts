"use client";
import { useEffect, useState, useRef } from "react";

// サーバーから送られてくるデータの型定義
export type WiiState = {
    buttons: {
        A: boolean;
        B: boolean;
        One: boolean;
        Two: boolean;
        Plus: boolean;
        Minus: boolean;
        Home: boolean;
        Up: boolean;
        Down: boolean;
        Right: boolean;
        Left: boolean;
    };
    accel: { x: number; y: number; z: number };
    ir: { x: number; y: number }[];
};

export function useWiiController() {
    const [wiiState, setWiiState] = useState<WiiState | null>(null);
    const prevButtonsRef = useRef<WiiState['buttons'] | null>(null);
    const triggersRef = useRef<Partial<WiiState['buttons']>>({});

    useEffect(() => {
        // Backendのポート8080に接続
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () => {
            console.log("Connected to Wii Server");
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data) as WiiState;
                
                // 「押した瞬間」だけ true になるトリガーを検出
                const triggers: Partial<WiiState['buttons']> = {};
                if (prevButtonsRef.current) {
                    (Object.keys(data.buttons) as Array<keyof WiiState['buttons']>).forEach((key) => {
                        // 前回 false かつ 今回 true なら「押された」とみなす
                        if (data.buttons[key] && !prevButtonsRef.current![key]) {
                            triggers[key] = true;
                        }
                    });
                }
                
                triggersRef.current = triggers;
                prevButtonsRef.current = data.buttons;
                setWiiState(data);
            } catch (e) {
                console.error("Parse error:", e);
            }
        };

        return () => {
            ws.close();
        };
    }, []);

    return { 
        wiiState, 
        pressed: triggersRef.current // 押した瞬間を検知したいときはこれを使う
    };
}