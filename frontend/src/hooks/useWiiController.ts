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
	cursor?: {
		x: number; // 0–1
		y: number; // 0–1
	} | null;
};

type WiiServerMessage =
	| { type: "status"; connected: boolean }
	| { type: "wiiDisconnected"; at?: number }
	| WiiState;

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
	const [wiiConnected, setWiiConnected] = useState(false);
	// ★追加: backendから来た切断イベントのタイムスタンプ（更新されるたびにポップアップを開く）
	const [wiiDisconnectedAt, setWiiDisconnectedAt] = useState<number | null>(null);

	// ★追加: 「一度でも正常に接続できていたか」を保持（接続失敗の誤爆防止）
	const wasConnectedRef = useRef(false);
		
	// ★追加: IRカーソル制御の有効/無効
	const [irCursorEnabled, setIrCursorEnabled] = useState(false);
	const wsRef = useRef<WebSocket | null>(null);

	// (wsRef は上で定義済み)

	// 「このフレームで押された」情報（Wii + キーボード合成）
	const [pressed, setPressed] = useState<Partial<WiiState["buttons"]>>({});

	// --- Wii から来る押下トリガー用 ---
	const pressedBufferRef = useRef<Partial<WiiState["buttons"]>>({});
	const prevButtonsRef = useRef<WiiState["buttons"] | null>(null);
	const lastUpdateRef = useRef<number>(0);
	// ★追加: 最新のWiiデータを保持（rAFで参照）
	const latestWiiDataRef = useRef<WiiState | null>(null);
	// ★追加: pressed状態を累積して保持し、次のflushで消費する
	const pendingPressedRef = useRef<Partial<WiiState["buttons"]>>({});

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
		wsRef.current = ws; // WebSocketを保持

		ws.onopen = () => {
			console.log("Connected to Wii Server");
		};

		ws.onmessage = (event) => {
			try {
				const msg = JSON.parse(event.data) as WiiServerMessage;

				if (msg && typeof msg === "object" && "type" in msg) {
					const t = (msg as any).type;

					if (t === "status") {
						const connected = !!(msg as any).connected;
						setWiiConnected(connected);
						wasConnectedRef.current = connected; // ★追加
						// IRカーソル状態も受信
						if (typeof (msg as any).irCursorEnabled === "boolean") {
							setIrCursorEnabled((msg as any).irCursorEnabled);
						}
						return;
					}

					if (t === "irCursorStatus") {
						setIrCursorEnabled(!!(msg as any).enabled);
						return;
					}

					if (t === "wiiDisconnected") {
						setWiiConnected(false);
						wasConnectedRef.current = false; // ★追加
						setWiiDisconnectedAt(typeof (msg as any).at === "number" ? (msg as any).at : Date.now());
						return;
					}
				}

				const data = msg as WiiState;

				setWiiConnected(true);
				wasConnectedRef.current = true; // ★追加: データが来ている=接続できている

				// Wii側の「押された瞬間」検知 - pressedBufferに追加（rAFで消費）
				if (prevButtonsRef.current) {
					(Object.keys(data.buttons) as Array<keyof WiiState["buttons"]>).forEach((key) => {
						if (data.buttons[key] && !prevButtonsRef.current![key]) {
							pressedBufferRef.current[key] = true;
							console.log(`[WS] Button pressed detected: ${key}`); // デバッグ
						}
					});
				}
				prevButtonsRef.current = data.buttons;

				// ★修正: flushStateは呼ばず、最新データをRefに保存するだけ
				// rAFループで統一的にstate更新する
				latestWiiDataRef.current = data;
			} catch (e) {
				console.error("Parse error:", e);
			}
		};

		// ★修正: 「接続中に切れた」場合だけ disconnect 扱いにする（接続失敗の誤爆防止）
		ws.onerror = () => {
			const wasConnected = wasConnectedRef.current;
			setWiiConnected(false);
			wasConnectedRef.current = false;

			if (wasConnected) {
				setWiiDisconnectedAt(Date.now());
			}
		};

		ws.onclose = () => {
			const wasConnected = wasConnectedRef.current;
			setWiiConnected(false);
			wasConnectedRef.current = false;

			if (wasConnected) {
				setWiiDisconnectedAt(Date.now());
			}
		};

		return () => {
			try {
				ws.close();
			} catch {}
			wsRef.current = null; // WebSocketをクリア
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// ★修正: rAFループでstate更新（WebSocket受信とは分離）
	useEffect(() => {
		let raf = 0;

		const loop = () => {
			// 最新のWiiデータを取得（あれば）
			const wiiData = latestWiiDataRef.current;
			flushState(wiiData);
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

		// ★修正: 新しく押されたボタンを累積バッファに追加
		for (const key of Object.keys(pressedBufferRef.current)) {
			pendingPressedRef.current[key as keyof WiiState["buttons"]] = true;
		}
		for (const key of Object.keys(kbPressedBufferRef.current)) {
			pendingPressedRef.current[key as keyof WiiState["buttons"]] = true;
		}
		pressedBufferRef.current = {};
		kbPressedBufferRef.current = {};

		// ★修正: 累積バッファから現在のpressedを取得し、バッファをクリア
		const mergedPressed: Partial<WiiState["buttons"]> = { ...pendingPressedRef.current };
		pendingPressedRef.current = {};

		// ★デバッグ: 押されたボタンがあればログ出力
		const pressedKeys = Object.keys(mergedPressed).filter(k => (mergedPressed as Record<string, boolean>)[k]);
		if (pressedKeys.length > 0) {
			console.log(`[flushState] Pressed buttons: ${pressedKeys.join(', ')}`);
		}

		// accel/ir は Wii が無ければダミー
		const mergedState: WiiState = {
			buttons: mergedButtons,
			accel: wiiDataOrNull?.accel ?? { x: 0, y: 0, z: 0 },
			ir: wiiDataOrNull?.ir ?? [],
			cursor: wiiDataOrNull?.cursor ?? null, // ★追加
		};

		setWiiState(mergedState);
		setPressed(mergedPressed);
	};

	// Wii側で音を鳴らす（WebSocket経由）
	const playWiiSound = (soundType: 'shot' | 'oh' | 'uxo') => {
		if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
			console.warn('Cannot play sound: WebSocket not connected');
			return;
		}
		try {
			wsRef.current.send(JSON.stringify({ type: 'playSound', soundType }));
		} catch (e) {
			console.error('Failed to send playSound message:', e);
		}
	};

	const setIrCursorEnabledFn = (enabled: boolean) => {
		setIrCursorEnabled(enabled);
		if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
			try {
				wsRef.current.send(JSON.stringify({ type: "setIrCursor", enabled }));
			} catch (e) {
				console.error('Failed to send setIrCursor message:', e);
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