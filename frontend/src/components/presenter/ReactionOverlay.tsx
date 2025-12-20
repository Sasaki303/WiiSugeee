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
    const [scale, setScale] = useState(1);

    const add = (type: ReactionType) => {
        const now = Date.now();
        const r: Reaction = {
            id: `${now}-${Math.random().toString(16).slice(2)}`,
            type,
            createdAt: now,
            // 右下の狭い範囲で少しだけ左右に散る（インスタのハートっぽさ）
            x: 0.65 + Math.random() * 0.3,
            size: 26 + Math.floor(Math.random() * 18),
            durationMs: 1200 + Math.floor(Math.random() * 700),
            rotateDeg: -10 + Math.random() * 20,
        };
        setItems((prev) => [...prev, r]);
    };

    // 画面サイズに合わせてスケールを計算（最小辺基準）
    useEffect(() => {
        const calc = () => {
            const min = Math.min(window.innerWidth, window.innerHeight);
            // 基準サイズ800pxを1.0とし、0.6〜2.0でクランプ
            const s = Math.max(0.6, Math.min(2, min / 800));
            setScale(s);
        };
        calc();
        window.addEventListener("resize", calc);
        return () => window.removeEventListener("resize", calc);
    }, []);

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
                height: 280,
                pointerEvents: "none",
                overflow: "hidden",
                zIndex: 10001, // スライドより前、戻るボタンと同等より少し上
                transform: `scale(${scale})`,
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
                filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.35))",
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
                        transform: translateX(-50%) translateY(-170px) scale(1.08) rotate(${r.rotateDeg}deg);
                    }
                }
            `}</style>
        </div>
    );
}