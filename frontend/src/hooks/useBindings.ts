"use client";

import { useCallback, useRef, useMemo } from "react";
import { mergeBindings, type BindingAction, type ButtonBindings } from "@/lib/buttonBindings";
import type { WiiState } from "@/hooks/useWiiController";
import type { SerializedFlow } from "@/types";

interface UseBindingsOptions {
	flow: SerializedFlow | null;
	currentNode: SerializedFlow["nodes"][number] | undefined;
}

interface ActionCallbacks {
	nextSlide: () => void;
	prevSlide: () => void;
	branchByNumberKey: (key: string) => void;
	hasMultipleBranches: boolean;
	toggleEraser: (buttonName?: string) => void;
	toggleIrCursor: () => void;
	clearDrawing: () => void;
	playSound: (key: "q" | "w" | "e", outputDevice?: "pc" | "wii") => void;
	eraserMode: boolean;
	irCursorEnabled: boolean;
}

export function useBindings({ flow, currentNode }: UseBindingsOptions) {
	const lastEraserToggleTimeRef = useRef<number>(0);
	const lastIrSensToggleTimeRef = useRef<number>(0);

	const effectiveProjectBindings = useMemo(() => {
		const combined = {
			...(flow?.projectBindings ?? {}),
			...(currentNode?.data.bindings ?? {}),
		};
		return mergeBindings(combined);
	}, [flow, currentNode]);

	const runAction = useCallback(
		(act: BindingAction, callbacks: ActionCallbacks, btnName?: string) => {
			const {
				nextSlide,
				prevSlide,
				branchByNumberKey,
				hasMultipleBranches,
				toggleEraser,
				toggleIrCursor,
				clearDrawing,
				playSound,
				eraserMode,
				irCursorEnabled,
			} = callbacks;

			if (eraserMode && act.type !== "eraser") return;

			switch (act.type) {
				case "next":
					nextSlide();
					break;
				case "prev":
					prevSlide();
					break;
				case "branchIndex":
					branchByNumberKey(String(act.index));
					break;
				case "branch": {
					if (!hasMultipleBranches) return;
					const map: Record<string, string> = { A: "1", B: "2", HOME: "3" };
					const k = map[act.kind];
					if (k) branchByNumberKey(k);
					break;
				}
				case "reaction":
					break;
				case "paint":
					break;
				case "eraser": {
					const now = Date.now();
					if (now - lastEraserToggleTimeRef.current < 500) return;
					lastEraserToggleTimeRef.current = now;
					toggleEraser(btnName);
					break;
				}
				case "sound":
					if (act.kind === "shot") playSound("q", act.outputDevice);
					else if (act.kind === "oh") playSound("e", act.outputDevice);
					else if (act.kind === "uxo") playSound("w", act.outputDevice);
					break;
				case "remove":
					clearDrawing();
					break;
				case "irSens": {
					const now = Date.now();
					if (now - lastIrSensToggleTimeRef.current < 500) return;
					lastIrSensToggleTimeRef.current = now;
					toggleIrCursor();
					break;
				}
				case "none":
				default:
					break;
			}
		},
		[]
	);

	const checkShouldEmitReaction = useCallback(
		(
			pressed: Partial<WiiState["buttons"]>,
			kind: "clap" | "laugh"
		): boolean => {
			for (const btn of Object.keys(pressed)) {
				const isDown = (pressed as Record<string, boolean>)[btn];
				if (!isDown) continue;
				const act = (effectiveProjectBindings as Record<string, BindingAction | undefined>)[btn];
				if (act?.type === "reaction" && act.kind === kind) return true;
			}
			return false;
		},
		[effectiveProjectBindings]
	);

	const checkIsPaintPressed = useCallback(
		(buttons: WiiState["buttons"]): boolean => {
			for (const btn of Object.keys(buttons)) {
				const isDown = (buttons as Record<string, boolean>)[btn];
				if (!isDown) continue;
				const act = (effectiveProjectBindings as Record<string, BindingAction | undefined>)[btn];
				if (act?.type === "paint") return true;
			}
			return false;
		},
		[effectiveProjectBindings]
	);

	return {
		effectiveProjectBindings,
		runAction,
		checkShouldEmitReaction,
		checkIsPaintPressed,
	};
}
