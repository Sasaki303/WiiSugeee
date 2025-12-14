"use client";
import { useEffect, useState, useRef } from "react";

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
	// 押された瞬間を検知するためのバッファ
	const pressedBufferRef = useRef<Partial<WiiState["buttons"]>>({});
	const prevButtonsRef = useRef<WiiState["buttons"] | null>(null);
	const lastUpdateRef = useRef<number>(0);

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:8080");

		ws.onopen = () => {
			console.log("Connected to Wii Server");
		};

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data) as WiiState;
				const now = performance.now();

				// 1. ボタンのトリガー判定（押された瞬間を累積する）
				// Reactのレンダリング間隔より通信が速いため、ここで取りこぼさないように溜めておく
				if (prevButtonsRef.current) {
					(Object.keys(data.buttons) as Array<keyof WiiState["buttons"]>).forEach((key) => {
						if (data.buttons[key] && !prevButtonsRef.current![key]) {
							pressedBufferRef.current[key] = true;
						}
					});
				}
				prevButtonsRef.current = data.buttons;

				// 2. 描画更新頻度の制限 (約30fpsに制限して負荷を下げる)
				if (now - lastUpdateRef.current > 33) {
					// バッファに溜まった押下情報をstateに渡して、バッファをクリア
					const currentPressed = { ...pressedBufferRef.current };
					pressedBufferRef.current = {}; // リセット

					setWiiState({
						...data,
						// stateの中に「このフレームで押されたボタン」の情報を含めるハック
						// @ts-expect-error pressed情報を拡張
						pressed: currentPressed, 
					});
					lastUpdateRef.current = now;
				}
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
		// at @ts-expect-error 上記で拡張したpressedを取得
		pressed: (wiiState as any)?.pressed || {} as Partial<WiiState["buttons"]>,
	};
}