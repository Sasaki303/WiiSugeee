"use client";
import { useEffect, useRef, useState } from "react";

export type WiiButtons = {
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

export type WiiState = {
	buttons: WiiButtons;
	accel: { x: number; y: number; z: number };
	ir: { x: number; y: number }[];
	cursor?: { x: number; y: number } | null;
};

type WiiServerMessage =
	| { type: "status"; connected: boolean; irCursorEnabled?: boolean }
	| { type: "irCursorStatus"; enabled: boolean }
	| { type: "wiiDisconnected"; at?: number }
	| WiiState;

const EMPTY_BUTTONS: WiiButtons = {
	A: false, B: false, One: false, Two: false,
	Plus: false, Minus: false, Home: false,
	Up: false, Down: false, Right: false, Left: false,
};

const KEY_TO_BUTTON: Record<string, keyof WiiButtons> = {
	i: "Up", j: "Left", k: "Down", l: "Right",
	";": "Plus", "-": "Minus",
	h: "Home", o: "A", p: "B",
	n: "One", m: "Two",
};

function keyToButton(key: string): keyof WiiButtons | null {
	const k = key.length === 1 ? key.toLowerCase() : key;
	return KEY_TO_BUTTON[k] ?? null;
}

export function useWiiController() {
	const [wiiState, setWiiState] = useState<WiiState | null>(null);
	const [wiiConnected, setWiiConnected] = useState(false);
	const [wiiDisconnectedAt, setWiiDisconnectedAt] = useState<number | null>(null);
	const [irCursorEnabled, setIrCursorEnabled] = useState(false);
	const [pressed, setPressed] = useState<Partial<WiiButtons>>({});

	const wasConnectedRef = useRef(false);
	const wsRef = useRef<WebSocket | null>(null);
	const pressedBufferRef = useRef<Partial<WiiButtons>>({});
	const prevButtonsRef = useRef<WiiButtons | null>(null);
	const latestWiiDataRef = useRef<WiiState | null>(null);
	const pendingPressedRef = useRef<Partial<WiiButtons>>({});
	const kbButtonsRef = useRef<WiiButtons>({ ...EMPTY_BUTTONS });
	const kbPressedBufferRef = useRef<Partial<WiiButtons>>({});

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.repeat) return;
			const btn = keyToButton(e.key);
			if (!btn) return;
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

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:8080");
		wsRef.current = ws;

		ws.onopen = () => console.log("Connected to Wii Server");

		ws.onmessage = (event) => {
			try {
				const msg = JSON.parse(event.data) as WiiServerMessage;

				if (msg && typeof msg === "object" && "type" in msg) {
					const typedMsg = msg as { type: string; connected?: boolean; enabled?: boolean; irCursorEnabled?: boolean; at?: number };

					if (typedMsg.type === "status") {
						const connected = !!typedMsg.connected;
						setWiiConnected(connected);
						wasConnectedRef.current = connected;
						if (typeof typedMsg.irCursorEnabled === "boolean") {
							setIrCursorEnabled(typedMsg.irCursorEnabled);
						}
						return;
					}

					if (typedMsg.type === "irCursorStatus") {
						setIrCursorEnabled(!!typedMsg.enabled);
						return;
					}

					if (typedMsg.type === "wiiDisconnected") {
						setWiiConnected(false);
						wasConnectedRef.current = false;
						setWiiDisconnectedAt(typeof typedMsg.at === "number" ? typedMsg.at : Date.now());
						return;
					}
				}

				const data = msg as WiiState;
				setWiiConnected(true);
				wasConnectedRef.current = true;

				if (prevButtonsRef.current) {
					(Object.keys(data.buttons) as Array<keyof WiiButtons>).forEach((key) => {
						if (data.buttons[key] && !prevButtonsRef.current![key]) {
							pressedBufferRef.current[key] = true;
						}
					});
				}
				prevButtonsRef.current = data.buttons;
				latestWiiDataRef.current = data;
			} catch (e) {
				console.error("Parse error:", e);
			}
		};

		const handleDisconnect = () => {
			const wasConnected = wasConnectedRef.current;
			setWiiConnected(false);
			wasConnectedRef.current = false;
			if (wasConnected) {
				setWiiDisconnectedAt(Date.now());
			}
		};

		ws.onerror = handleDisconnect;
		ws.onclose = handleDisconnect;

		return () => {
			try { ws.close(); } catch { /* ignore */ }
			wsRef.current = null;
		};
	}, []);

	useEffect(() => {
		let raf = 0;

		const flushState = (wiiDataOrNull: WiiState | null) => {
			const wiiButtons = wiiDataOrNull?.buttons ?? null;
			const kbButtons = kbButtonsRef.current;

			const mergedButtons: WiiButtons = {
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

			for (const key of Object.keys(pressedBufferRef.current)) {
				pendingPressedRef.current[key as keyof WiiButtons] = true;
			}
			for (const key of Object.keys(kbPressedBufferRef.current)) {
				pendingPressedRef.current[key as keyof WiiButtons] = true;
			}
			pressedBufferRef.current = {};
			kbPressedBufferRef.current = {};

			const mergedPressed: Partial<WiiButtons> = { ...pendingPressedRef.current };
			pendingPressedRef.current = {};

			const mergedState: WiiState = {
				buttons: mergedButtons,
				accel: wiiDataOrNull?.accel ?? { x: 0, y: 0, z: 0 },
				ir: wiiDataOrNull?.ir ?? [],
				cursor: wiiDataOrNull?.cursor ?? null,
			};

			setWiiState(mergedState);
			setPressed(mergedPressed);
		};

		const loop = () => {
			flushState(latestWiiDataRef.current);
			raf = window.requestAnimationFrame(loop);
		};

		raf = window.requestAnimationFrame(loop);
		return () => window.cancelAnimationFrame(raf);
	}, []);

	const playWiiSound = (soundType: "shot" | "oh" | "uxo") => {
		if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
		try {
			wsRef.current.send(JSON.stringify({ type: "playSound", soundType }));
		} catch (e) {
			console.error("Failed to send playSound message:", e);
		}
	};

	const setIrCursorEnabledFn = (enabled: boolean) => {
		setIrCursorEnabled(enabled);
		if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
			try {
				wsRef.current.send(JSON.stringify({ type: "setIrCursor", enabled }));
			} catch (e) {
				console.error("Failed to send setIrCursor message:", e);
			}
		}
	};

	return {
		wiiState,
		pressed,
		wiiConnected,
		wiiDisconnectedAt,
		irCursorEnabled,
		setIrCursorEnabled: setIrCursorEnabledFn,
		playWiiSound,
	};
}