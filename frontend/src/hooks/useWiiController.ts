"use client";
import { useEffect, useMemo, useRef, useState } from "react";

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

const EMPTY_BUTTONS: WiiState["buttons"] = {
	A: false,
	B: false,
	One: false,
	Two: false,
	Plus: false,
	Minus: false,
	Home: false,
	Up: false,
	Down: false,
	Right: false,
	Left: false,
};

function keyToButton(key: string): keyof WiiState["buttons"] | null {
	// e.key は環境差が出るので、文字は小文字化して判定
	const k = key.length === 1 ? key.toLowerCase() : key;

	switch (k) {
		// D-Pad (I J K L)
		case "i":
			return "Up";
		case "j":
			return "Left";
		case "k":
			return "Down";
		case "l":
			return "Right";

		// + ;  / - -
		case ";":
			return "Plus";
		case "-":
			return "Minus";

		// Home / A / B
		case "h":
			return "Home";
		case "o":
			return "A";
		case "p":
			return "B";

		// 1 / 2（リアクションにも使う）
		case "n":
			return "One";
		case "m":
			return "Two";

		default:
			return null;
	}
}

export function useWiiController() {
	const [wiiState, setWiiState] = useState<WiiState | null>(null);

	// 「このフレームで押された」情報（Wii + キーボード合成）
	const [pressed, setPressed] = useState<Partial<WiiState["buttons"]>>({});

	// --- Wii から来る押下トリガー用 ---
	const pressedBufferRef = useRef<Partial<WiiState["buttons"]>>({});
	const prevButtonsRef = useRef<WiiState["buttons"] | null>(null);
	const lastUpdateRef = useRef<number>(0);

	// --- キーボードの押下状態（ホールド） ---
	const kbButtonsRef = useRef<WiiState["buttons"]>({ ...EMPTY_BUTTONS });
	// キーボードの「このフレームで押された」
	const kbPressedBufferRef = useRef<Partial<WiiState["buttons"]>>({});

	// キーボードイベント購読
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.repeat) return;
			const btn = keyToButton(e.key);
			if (!btn) return;

			// 入力を奪いたい場合だけ preventDefault（必要なら外してください）
			// e.preventDefault();

			kbButtonsRef.current = { ...kbButtonsRef.current, [btn]: true };
			kbPressedBufferRef.current[btn] = true;
		};

		const onKeyUp = (e: KeyboardEvent) => {
			const btn = keyToButton(e.key);
			if (!btn) return;
			kbButtonsRef.current = { ...kbButtonsRef.current, [btn]: false };
		};

		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
		};
	}, []);

	// WebSocket (Wii)
	useEffect(() => {
		const ws = new WebSocket("ws://localhost:8080");

		ws.onopen = () => {
			console.log("Connected to Wii Server");
		};

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data) as WiiState;
				const now = performance.now();

				// Wii側の「押された瞬間」検知
				if (prevButtonsRef.current) {
					(Object.keys(data.buttons) as Array<keyof WiiState["buttons"]>).forEach((key) => {
						if (data.buttons[key] && !prevButtonsRef.current![key]) {
							pressedBufferRef.current[key] = true;
						}
					});
				}
				prevButtonsRef.current = data.buttons;

				// 更新頻度制限
				if (now - lastUpdateRef.current > 33) {
					flushState(data);
					lastUpdateRef.current = now;
				}
			} catch (e) {
				console.error("Parse error:", e);
			}
		};

		ws.onerror = () => {
			// Wii未接続でもキーボードで動かすため、ここでは落とさない
		};

		return () => {
			try {
				ws.close();
			} catch {}
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Wiiから来ない場合でも、キーボードの変化で state/pressed を更新するための tick
	useEffect(() => {
		let raf = 0;

		const loop = () => {
			flushState(null);
			raf = window.requestAnimationFrame(loop);
		};

		raf = window.requestAnimationFrame(loop);
		return () => window.cancelAnimationFrame(raf);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const flushState = (wiiDataOrNull: WiiState | null) => {
		// ソースの buttons を合成（Wiiがあれば OR、なければキーボードのみ）
		const wiiButtons = wiiDataOrNull?.buttons ?? null;
		const kbButtons = kbButtonsRef.current;

		const mergedButtons: WiiState["buttons"] = {
			A: (wiiButtons?.A ?? false) || kbButtons.A,
			B: (wiiButtons?.B ?? false) || kbButtons.B,
			One: (wiiButtons?.One ?? false) || kbButtons.One,
			Two: (wiiButtons?.Two ?? false) || kbButtons.Two,
			Plus: (wiiButtons?.Plus ?? false) || kbButtons.Plus,
			Minus: (wiiButtons?.Minus ?? false) || kbButtons.Minus,
			Home: (wiiButtons?.Home ?? false) || kbButtons.Home,
			Up: (wiiButtons?.Up ?? false) || kbButtons.Up,
			Down: (wiiButtons?.Down ?? false) || kbButtons.Down,
			Right: (wiiButtons?.Right ?? false) || kbButtons.Right,
			Left: (wiiButtons?.Left ?? false) || kbButtons.Left,
		};

		// 「このフレームで押された」も合成して吐く
		const mergedPressed: Partial<WiiState["buttons"]> = {
			...pressedBufferRef.current,
			...kbPressedBufferRef.current,
		};
		pressedBufferRef.current = {};
		kbPressedBufferRef.current = {};

		// accel/ir は Wii が無ければダミー
		const mergedState: WiiState = {
			buttons: mergedButtons,
			accel: wiiDataOrNull?.accel ?? { x: 0, y: 0, z: 0 },
			ir: wiiDataOrNull?.ir ?? [],
		};

		setWiiState(mergedState);
		setPressed(mergedPressed);
	};

	return {
		wiiState,
		pressed,
	};
}