"use client";

import { useEffect, useState } from "react";
import type { ReactionType } from "@/types";

const SCALE = 3.5;


type Reaction = {
    id: string;
    type: ReactionType;
    createdAt: number;
    x: number; // 0..1 (領域内の横方向)
    size: number; // px (作成時に scale を乗じた値)
    durationMs: number;
    rotateDeg: number;
};

export function ReactionOverlay(props: {
    emitClap?: boolean;
    emitLaugh?: boolean;
    scale?: number; // 追加: 全体のスケール（>1 で大きく）
}) {
    const { emitClap, emitLaugh } = props;
    const scale = props.scale ?? 1;
    const [items, setItems] = useState<Reaction[]>([]);

    const add = (type: ReactionType) => {
        const now = Date.now();
        const baseSize = 26 + Math.floor(Math.random() * 18);
        const r: Reaction = {
            id: `${now}-${Math.random().toString(16).slice(2)}`,
            type,
            createdAt: now,
            // 右下の狭い範囲で少しだけ左右に散る（インスタのハートっぽさ）
            x: 0.65 + Math.random() * 0.3,
            size: Math.round(baseSize * scale),
            durationMs: 1200 + Math.floor(Math.random() * 700),
            rotateDeg: -10 + Math.random() * 20,
        };
        setItems((prev) => [...prev, r]);
    };

    // 「そのフレームだけ true」が来る前提（pressed.* をそのまま渡せばOK）
    useEffect(() => {
        if (emitClap) add("clap");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emitClap]);

    useEffect(() => {
        if (emitLaugh) add("laugh");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emitLaugh]);

    // 掃除
    useEffect(() => {
        const t = setInterval(() => {
            const now = Date.now();
            setItems((prev) => prev.filter((r) => now - r.createdAt < r.durationMs + 250));
        }, 250);
        return () => clearInterval(t);
    }, []);

    return (
        <div
            aria-hidden
            style={{
                position: "absolute",
                right: 24 * scale,
                bottom: 24 * scale,
                width: 240 * scale,
                height: 280 * scale,
                pointerEvents: "none",
                overflow: "hidden",
                zIndex: 10001, // スライドより前、戻るボタンと同等より少し上
            }}
        >
            {items.map((r) => (
                <ReactionItem key={r.id} r={r} scale={scale} />
            ))}
        </div>
    );
}

function ReactionItem({ r, scale }: { r: Reaction; scale: number }) {
    const glyph = r.type === "clap" ? "👏" : "😆";
    const shadowV = 8 * scale;
    const shadowBlur = 12 * scale;
    const startY = 14 * scale;
    const endY = 170 * scale;

    return (
        <div
            style={{
                position: "absolute",
                bottom: 0,
                left: `${Math.round(r.x * 100)}%`,
                fontSize: r.size,
                transform: `translateX(-50%) rotate(${r.rotateDeg}deg)`,
                willChange: "transform, opacity",
                animation: `reaction-float ${r.durationMs}ms ease-out forwards`,
                filter: `drop-shadow(0 ${shadowV}px ${shadowBlur}px rgba(0,0,0,0.35))`,
                userSelect: "none",
            }}
        >
            {glyph}
            <style jsx>{`
                @keyframes reaction-float {
                    0% {
                        opacity: 0;
                        transform: translateX(-50%) translateY(${startY}px) scale(0.9) rotate(${r.rotateDeg}deg);
                    }
                    12% {
                        opacity: 0.95;
                        transform: translateX(-50%) translateY(0px) scale(1) rotate(${r.rotateDeg}deg);
                    }
                    100% {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-${endY}px) scale(1.08) rotate(${r.rotateDeg}deg);
                    }
                }
            `}</style>
        </div>
    );
}