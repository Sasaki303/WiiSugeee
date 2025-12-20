"use client";

import { useEffect, useState } from "react";
import type { ReactionType, Reaction } from "@/types";

const SCALE = 3.5;

interface ReactionOverlayProps {
	emitClap?: boolean;
	emitLaugh?: boolean;
}

export function ReactionOverlay({ emitClap, emitLaugh }: ReactionOverlayProps) {
	const [items, setItems] = useState<Reaction[]>([]);

	const addReaction = (type: ReactionType) => {
		const now = Date.now();
		const reaction: Reaction = {
			id: `${now}-${Math.random().toString(16).slice(2)}`,
			type,
			createdAt: now,
			x: 0.65 + Math.random() * 0.3,
			size: 26 + Math.floor(Math.random() * 18),
			durationMs: 1200 + Math.floor(Math.random() * 700),
			rotateDeg: -10 + Math.random() * 20,
		};
		setItems((prev) => [...prev, reaction]);
	};

	useEffect(() => {
		if (emitClap) addReaction("clap");
	}, [emitClap]);

	useEffect(() => {
		if (emitLaugh) addReaction("laugh");
	}, [emitLaugh]);

	useEffect(() => {
		const timer = setInterval(() => {
			const now = Date.now();
			setItems((prev) => prev.filter((r) => now - r.createdAt < r.durationMs + 250));
		}, 250);
		return () => clearInterval(timer);
	}, []);

	return (
		<div
			aria-hidden
			style={{
				position: "absolute",
				right: 24,
				bottom: 24,
				width: 240,
				height: 420,
				pointerEvents: "none",
				overflow: "hidden",
				zIndex: 10001,
				transform: `scale(${SCALE})`,
				transformOrigin: "right bottom",
			}}
		>
			{items.map((r) => (
				<ReactionItem key={r.id} reaction={r} />
			))}
		</div>
	);
}

function ReactionItem({ reaction }: { reaction: Reaction }) {
	const glyph = reaction.type === "clap" ? "👏" : "😆";

	return (
		<div
			style={{
				position: "absolute",
				bottom: 0,
				left: `${Math.round(reaction.x * 100)}%`,
				fontSize: reaction.size,
				transform: `translateX(-50%) rotate(${reaction.rotateDeg}deg)`,
				willChange: "transform, opacity",
				animation: `reaction-float ${reaction.durationMs}ms ease-out forwards`,
				filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.35))",
				userSelect: "none",
			}}
		>
			{glyph}
			<style jsx>{`
				@keyframes reaction-float {
					0% {
						opacity: 0;
						transform: translateX(-50%) translateY(14px) scale(0.9) rotate(${reaction.rotateDeg}deg);
					}
					12% {
						opacity: 0.95;
						transform: translateX(-50%) translateY(0px) scale(1) rotate(${reaction.rotateDeg}deg);
					}
					100% {
						opacity: 0;
						transform: translateX(-50%) translateY(-420px) scale(1.08) rotate(${reaction.rotateDeg}deg);
					}
				}
			`}</style>
		</div>
	);
}