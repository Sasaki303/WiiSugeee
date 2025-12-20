"use client";

import { useEffect, useState } from "react";

type ReactionType = "clap" | "laugh";

type Reaction = {
    id: string;
    type: ReactionType;
    createdAt: number;
    x: number; // 0..1 (領域内の横方向)
    size: number; // px
    durationMs: number;
    rotateDeg: number;
};

export function ReactionOverlay(props: {
    emitClap?: boolean;
    emitLaugh?: boolean;
}) {
    const { emitClap, emitLaugh } = props;
    const [items, setItems] = useState<Reaction[]>([]);

    // ここを変更すると全体の大きさを固定で変えられます（例: 2.5 => 約2.5倍）
    const SCALE = 2.0;

    const add = (type: ReactionType) => {
        const now = Date.now();
        const r: Reaction = {
            id: `${now}-${Math.random().toString(16).slice(2)}`,
            type,
            createdAt: now,
            // 右下の狭い範囲で少しだけ左右に散る（インスタのハートっぽさ）
            x: 0.65 + Math.random() * 0.3,
            // 必要ならここのベース値(現在40)を変えると更に大きくできます
            size: 26 + Math.floor(Math.random() * 18),
            durationMs: 1200 + Math.floor(Math.random() * 700),
            rotateDeg: -10 + Math.random() * 20,
        };
        setItems((prev) => [...prev, r]);
    };

    // （画面サイズ依存のスケール計算は除去して固定スケールを使う）
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
                right: 24,
                bottom: 24,
                width: 240,
                // 高さを増やしてより上まで表示できるようにする
                height: 420,
                pointerEvents: "none",
                overflow: "hidden",
                zIndex: 10001, // スライドより前、戻るボタンと同等より少し上
                transform: `scale(${SCALE})`,
                transformOrigin: "right bottom",
            }}
        >
            {items.map((r) => (
                <ReactionItem key={r.id} r={r} />
            ))}
        </div>
    );
}

function ReactionItem({ r }: { r: Reaction }) {
    const glyph = r.type === "clap" ? "👏" : "😆";

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
                filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.35))"  ,
                userSelect: "none",
            }}
        >
            {glyph}
            <style jsx>{`
                @keyframes reaction-float {
                    0% {
                        opacity: 0;
                        transform: translateX(-50%) translateY(14px) scale(0.9) rotate(${r.rotateDeg}deg);
                    }
                    12% {
                        opacity: 0.95;
                        transform: translateX(-50%) translateY(0px) scale(1) rotate(${r.rotateDeg}deg);
                    }
                    100% {
                        opacity: 0;
                        /* ここを大きくするとより上まで浮かせられます（現在 -420px） */
                        transform: translateX(-50%) translateY(-420px) scale(1.08) rotate(${r.rotateDeg}deg);
                    }
                }
            `}</style>
        </div>
    );
}