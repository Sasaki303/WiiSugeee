(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/WiiSugeee/frontend/src/lib/presentation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearEditorStorage",
    ()=>clearEditorStorage,
    "getLastSavedHash",
    ()=>getLastSavedHash,
    "loadFromLocalStorage",
    ()=>loadFromLocalStorage,
    "saveToLocalStorage",
    ()=>saveToLocalStorage,
    "serializeFlow",
    ()=>serializeFlow,
    "setLastSavedHash",
    ()=>setLastSavedHash,
    "tryParseFlowJson",
    ()=>tryParseFlowJson
]);
const STORAGE_KEY = "wiisugeee.editor.flow.v1";
const LAST_SAVED_HASH_KEY = "wiisugeee.editor.lastSavedHash.v1";
function serializeFlow(flow) {
    return JSON.stringify(flow, null, 2);
}
function tryParseFlowJson(text) {
    try {
        const parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== "object") return null;
        const maybe = parsed;
        if (maybe.version !== 1) return null;
        if (!Array.isArray(maybe.nodes) || !Array.isArray(maybe.edges)) return null;
        return maybe;
    } catch  {
        return null;
    }
}
function saveToLocalStorage(flow) {
    try {
        localStorage.setItem(STORAGE_KEY, serializeFlow(flow));
    } catch  {
    // ignore
    }
}
function loadFromLocalStorage() {
    try {
        const text = localStorage.getItem(STORAGE_KEY);
        if (!text) return null;
        return tryParseFlowJson(text);
    } catch  {
        return null;
    }
}
function getLastSavedHash() {
    try {
        return localStorage.getItem(LAST_SAVED_HASH_KEY);
    } catch  {
        return null;
    }
}
function setLastSavedHash(hash) {
    try {
        localStorage.setItem(LAST_SAVED_HASH_KEY, hash);
    } catch  {
    // ignore
    }
}
function clearEditorStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LAST_SAVED_HASH_KEY);
    } catch  {
    // ignore
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/lib/idbAssets.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAllAssetBlobs",
    ()=>clearAllAssetBlobs,
    "getAssetBlob",
    ()=>getAssetBlob,
    "putAssetBlob",
    ()=>putAssetBlob
]);
const DB_NAME = "wiislide";
const DB_VERSION = 1;
const STORE_NAME = "assets";
function openDb() {
    return new Promise((resolve, reject)=>{
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = ()=>{
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        req.onsuccess = ()=>resolve(req.result);
        req.onerror = ()=>reject(req.error);
    });
}
async function putAssetBlob(assetId, blob) {
    const db = await openDb();
    await new Promise((resolve, reject)=>{
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.oncomplete = ()=>{
            db.close();
            resolve();
        };
        tx.onerror = ()=>{
            db.close();
            reject(tx.error);
        };
        tx.objectStore(STORE_NAME).put(blob, assetId);
    });
}
async function getAssetBlob(assetId) {
    const db = await openDb();
    return await new Promise((resolve, reject)=>{
        const tx = db.transaction(STORE_NAME, "readonly");
        tx.oncomplete = ()=>{
            db.close();
        };
        tx.onerror = ()=>{
            db.close();
            reject(tx.error);
        };
        const req = tx.objectStore(STORE_NAME).get(assetId);
        req.onsuccess = ()=>resolve(req.result ?? null);
        req.onerror = ()=>reject(req.error);
    });
}
async function clearAllAssetBlobs() {
    const db = await openDb();
    await new Promise((resolve, reject)=>{
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.oncomplete = ()=>{
            db.close();
            resolve();
        };
        tx.onerror = ()=>{
            db.close();
            reject(tx.error);
        };
        tx.objectStore(STORE_NAME).clear();
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/hooks/useWiiController.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWiiController",
    ()=>useWiiController
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const EMPTY_BUTTONS = {
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
    Left: false
};
function keyToButton(key) {
    // e.key は環境差が出るので、文字は小文字化して判定
    const k = key.length === 1 ? key.toLowerCase() : key;
    switch(k){
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
function useWiiController() {
    _s();
    const [wiiState, setWiiState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [wiiConnected, setWiiConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ★追加: backendから来た切断イベントのタイムスタンプ（更新されるたびにポップアップを開く）
    const [wiiDisconnectedAt, setWiiDisconnectedAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ★追加: 「一度でも正常に接続できていたか」を保持（接続失敗の誤爆防止）
    const wasConnectedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // ★追加: IRカーソル制御の有効/無効
    const [irCursorEnabled, setIrCursorEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const wsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // (wsRef は上で定義済み)
    // 「このフレームで押された」情報（Wii + キーボード合成）
    const [pressed, setPressed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // --- Wii から来る押下トリガー用 ---
    const pressedBufferRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const prevButtonsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastUpdateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // ★追加: 最新のWiiデータを保持（rAFで参照）
    const latestWiiDataRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ★追加: pressed状態を累積して保持し、次のflushで消費する
    const pendingPressedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    // --- キーボードの押下状態（ホールド） ---
    const kbButtonsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        ...EMPTY_BUTTONS
    });
    // キーボードの「このフレームで押された」
    const kbPressedBufferRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    // キーボードイベント購読
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useWiiController.useEffect": ()=>{
            const onKeyDown = {
                "useWiiController.useEffect.onKeyDown": (e)=>{
                    if (e.repeat) return;
                    const btn = keyToButton(e.key);
                    if (!btn) return;
                    // 入力を奪いたい場合だけ preventDefault（必要なら外してください）
                    // e.preventDefault();
                    kbButtonsRef.current = {
                        ...kbButtonsRef.current,
                        [btn]: true
                    };
                    kbPressedBufferRef.current[btn] = true;
                }
            }["useWiiController.useEffect.onKeyDown"];
            const onKeyUp = {
                "useWiiController.useEffect.onKeyUp": (e)=>{
                    const btn = keyToButton(e.key);
                    if (!btn) return;
                    kbButtonsRef.current = {
                        ...kbButtonsRef.current,
                        [btn]: false
                    };
                }
            }["useWiiController.useEffect.onKeyUp"];
            window.addEventListener("keydown", onKeyDown);
            window.addEventListener("keyup", onKeyUp);
            return ({
                "useWiiController.useEffect": ()=>{
                    window.removeEventListener("keydown", onKeyDown);
                    window.removeEventListener("keyup", onKeyUp);
                }
            })["useWiiController.useEffect"];
        }
    }["useWiiController.useEffect"], []);
    // WebSocket (Wii)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useWiiController.useEffect": ()=>{
            const ws = new WebSocket("ws://localhost:8080");
            wsRef.current = ws; // WebSocketを保持
            ws.onopen = ({
                "useWiiController.useEffect": ()=>{
                    console.log("Connected to Wii Server");
                }
            })["useWiiController.useEffect"];
            ws.onmessage = ({
                "useWiiController.useEffect": (event)=>{
                    try {
                        const msg = JSON.parse(event.data);
                        if (msg && typeof msg === "object" && "type" in msg) {
                            const t = msg.type;
                            if (t === "status") {
                                const connected = !!msg.connected;
                                setWiiConnected(connected);
                                wasConnectedRef.current = connected; // ★追加
                                // IRカーソル状態も受信
                                if (typeof msg.irCursorEnabled === "boolean") {
                                    setIrCursorEnabled(msg.irCursorEnabled);
                                }
                                return;
                            }
                            if (t === "irCursorStatus") {
                                setIrCursorEnabled(!!msg.enabled);
                                return;
                            }
                            if (t === "wiiDisconnected") {
                                setWiiConnected(false);
                                wasConnectedRef.current = false; // ★追加
                                setWiiDisconnectedAt(typeof msg.at === "number" ? msg.at : Date.now());
                                return;
                            }
                        }
                        const data = msg;
                        setWiiConnected(true);
                        wasConnectedRef.current = true; // ★追加: データが来ている=接続できている
                        // Wii側の「押された瞬間」検知 - pressedBufferに追加（rAFで消費）
                        if (prevButtonsRef.current) {
                            Object.keys(data.buttons).forEach({
                                "useWiiController.useEffect": (key)=>{
                                    if (data.buttons[key] && !prevButtonsRef.current[key]) {
                                        pressedBufferRef.current[key] = true;
                                        console.log(`[WS] Button pressed detected: ${key}`); // デバッグ
                                    }
                                }
                            }["useWiiController.useEffect"]);
                        }
                        prevButtonsRef.current = data.buttons;
                        // ★修正: flushStateは呼ばず、最新データをRefに保存するだけ
                        // rAFループで統一的にstate更新する
                        latestWiiDataRef.current = data;
                    } catch (e) {
                        console.error("Parse error:", e);
                    }
                }
            })["useWiiController.useEffect"];
            // ★修正: 「接続中に切れた」場合だけ disconnect 扱いにする（接続失敗の誤爆防止）
            ws.onerror = ({
                "useWiiController.useEffect": ()=>{
                    const wasConnected = wasConnectedRef.current;
                    setWiiConnected(false);
                    wasConnectedRef.current = false;
                    if (wasConnected) {
                        setWiiDisconnectedAt(Date.now());
                    }
                }
            })["useWiiController.useEffect"];
            ws.onclose = ({
                "useWiiController.useEffect": ()=>{
                    const wasConnected = wasConnectedRef.current;
                    setWiiConnected(false);
                    wasConnectedRef.current = false;
                    if (wasConnected) {
                        setWiiDisconnectedAt(Date.now());
                    }
                }
            })["useWiiController.useEffect"];
            return ({
                "useWiiController.useEffect": ()=>{
                    try {
                        ws.close();
                    } catch  {}
                    wsRef.current = null; // WebSocketをクリア
                }
            })["useWiiController.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["useWiiController.useEffect"], []);
    // ★修正: rAFループでstate更新（WebSocket受信とは分離）
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useWiiController.useEffect": ()=>{
            let raf = 0;
            const loop = {
                "useWiiController.useEffect.loop": ()=>{
                    // 最新のWiiデータを取得（あれば）
                    const wiiData = latestWiiDataRef.current;
                    flushState(wiiData);
                    raf = window.requestAnimationFrame(loop);
                }
            }["useWiiController.useEffect.loop"];
            raf = window.requestAnimationFrame(loop);
            return ({
                "useWiiController.useEffect": ()=>window.cancelAnimationFrame(raf)
            })["useWiiController.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["useWiiController.useEffect"], []);
    const flushState = (wiiDataOrNull)=>{
        // ソースの buttons を合成（Wiiがあれば OR、なければキーボードのみ）
        const wiiButtons = wiiDataOrNull?.buttons ?? null;
        const kbButtons = kbButtonsRef.current;
        const mergedButtons = {
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
            Left: (wiiButtons?.Left ?? false) || kbButtons.Left
        };
        // ★修正: 新しく押されたボタンを累積バッファに追加
        for (const key of Object.keys(pressedBufferRef.current)){
            pendingPressedRef.current[key] = true;
        }
        for (const key of Object.keys(kbPressedBufferRef.current)){
            pendingPressedRef.current[key] = true;
        }
        pressedBufferRef.current = {};
        kbPressedBufferRef.current = {};
        // ★修正: 累積バッファから現在のpressedを取得し、バッファをクリア
        const mergedPressed = {
            ...pendingPressedRef.current
        };
        pendingPressedRef.current = {};
        // ★デバッグ: 押されたボタンがあればログ出力
        const pressedKeys = Object.keys(mergedPressed).filter((k)=>mergedPressed[k]);
        if (pressedKeys.length > 0) {
            console.log(`[flushState] Pressed buttons: ${pressedKeys.join(', ')}`);
        }
        // accel/ir は Wii が無ければダミー
        const mergedState = {
            buttons: mergedButtons,
            accel: wiiDataOrNull?.accel ?? {
                x: 0,
                y: 0,
                z: 0
            },
            ir: wiiDataOrNull?.ir ?? [],
            cursor: wiiDataOrNull?.cursor ?? null
        };
        setWiiState(mergedState);
        setPressed(mergedPressed);
    };
    // Wii側で音を鳴らす（WebSocket経由）
    const playWiiSound = (soundType)=>{
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.warn('Cannot play sound: WebSocket not connected');
            return;
        }
        try {
            wsRef.current.send(JSON.stringify({
                type: 'playSound',
                soundType
            }));
        } catch (e) {
            console.error('Failed to send playSound message:', e);
        }
    };
    const setIrCursorEnabledFn = (enabled)=>{
        setIrCursorEnabled(enabled);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            try {
                wsRef.current.send(JSON.stringify({
                    type: "setIrCursor",
                    enabled
                }));
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
        playWiiSound
    };
}
_s(useWiiController, "MG90mmE7WdADj9NU82A7jdraRYc=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ReactionOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReactionOverlay",
    ()=>ReactionOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ReactionOverlay(props) {
    _s();
    const { emitClap, emitLaugh } = props;
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const add = (type)=>{
        const now = Date.now();
        const r = {
            id: `${now}-${Math.random().toString(16).slice(2)}`,
            type,
            createdAt: now,
            // 右下の狭い範囲で少しだけ左右に散る（インスタのハートっぽさ）
            x: 0.65 + Math.random() * 0.3,
            size: 26 + Math.floor(Math.random() * 18),
            durationMs: 1200 + Math.floor(Math.random() * 700),
            rotateDeg: -10 + Math.random() * 20
        };
        setItems((prev)=>[
                ...prev,
                r
            ]);
    };
    // 「そのフレームだけ true」が来る前提（pressed.* をそのまま渡せばOK）
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReactionOverlay.useEffect": ()=>{
            if (emitClap) add("clap");
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["ReactionOverlay.useEffect"], [
        emitClap
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReactionOverlay.useEffect": ()=>{
            if (emitLaugh) add("laugh");
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["ReactionOverlay.useEffect"], [
        emitLaugh
    ]);
    // 掃除
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReactionOverlay.useEffect": ()=>{
            const t = setInterval({
                "ReactionOverlay.useEffect.t": ()=>{
                    const now = Date.now();
                    setItems({
                        "ReactionOverlay.useEffect.t": (prev)=>prev.filter({
                                "ReactionOverlay.useEffect.t": (r)=>now - r.createdAt < r.durationMs + 250
                            }["ReactionOverlay.useEffect.t"])
                    }["ReactionOverlay.useEffect.t"]);
                }
            }["ReactionOverlay.useEffect.t"], 250);
            return ({
                "ReactionOverlay.useEffect": ()=>clearInterval(t)
            })["ReactionOverlay.useEffect"];
        }
    }["ReactionOverlay.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "aria-hidden": true,
        style: {
            position: "absolute",
            right: 24,
            bottom: 24,
            width: 240,
            height: 280,
            pointerEvents: "none",
            overflow: "hidden",
            zIndex: 10001
        },
        children: items.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReactionItem, {
                r: r
            }, r.id, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ReactionOverlay.tsx",
                lineNumber: 74,
                columnNumber: 17
            }, this))
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ReactionOverlay.tsx",
        lineNumber: 60,
        columnNumber: 9
    }, this);
}
_s(ReactionOverlay, "/y0Al6yM6EFbdZdyJfFaFDo7+SA=");
_c = ReactionOverlay;
function ReactionItem({ r }) {
    const glyph = r.type === "clap" ? "👏" : "😆";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "absolute",
            bottom: 0,
            left: `${Math.round(r.x * 100)}%`,
            fontSize: r.size,
            transform: `translateX(-50%) rotate(${r.rotateDeg}deg)`,
            willChange: "transform, opacity",
            animation: `reaction-float ${r.durationMs}ms ease-out forwards`,
            filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.35))",
            userSelect: "none"
        },
        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].dynamic([
            [
                "4ccefd33158db8f7",
                [
                    r.rotateDeg,
                    r.rotateDeg,
                    r.rotateDeg
                ]
            ]
        ]),
        children: [
            glyph,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "4ccefd33158db8f7",
                dynamic: [
                    r.rotateDeg,
                    r.rotateDeg,
                    r.rotateDeg
                ],
                children: `@keyframes reaction-float{0%{opacity:0;transform:translateX(-50%)translateY(14px)scale(.9)rotate(${r.rotateDeg}deg)}12%{opacity:.95;transform:translateX(-50%)translateY(0px)scale(1)rotate(${r.rotateDeg}deg)}to{opacity:0;transform:translateX(-50%)translateY(-170px)scale(1.08)rotate(${r.rotateDeg}deg)}}`
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ReactionOverlay.tsx",
        lineNumber: 84,
        columnNumber: 9
    }, this);
}
_c1 = ReactionItem;
var _c, _c1;
__turbopack_context__.k.register(_c, "ReactionOverlay");
__turbopack_context__.k.register(_c1, "ReactionItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/lib/buttonBindings.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_BINDINGS",
    ()=>DEFAULT_BINDINGS,
    "DEFAULT_SOUND_SETTINGS",
    ()=>DEFAULT_SOUND_SETTINGS,
    "decodeAction",
    ()=>decodeAction,
    "encodeAction",
    ()=>encodeAction,
    "formatAction",
    ()=>formatAction,
    "mergeBindings",
    ()=>mergeBindings
]);
const DEFAULT_SOUND_SETTINGS = {
    outputDevice: "pc"
};
const DEFAULT_BINDINGS = {
    Right: {
        type: "next"
    },
    Left: {
        type: "prev"
    },
    Plus: {
        type: "branch",
        kind: "A"
    },
    Minus: {
        type: "branch",
        kind: "B"
    },
    Home: {
        type: "branch",
        kind: "HOME"
    },
    One: {
        type: "reaction",
        kind: "clap"
    },
    Two: {
        type: "reaction",
        kind: "laugh"
    }
};
function formatAction(a) {
    switch(a.type){
        case "none":
            return "未割当";
        case "next":
            return "次へ";
        case "prev":
            return "戻る";
        case "branch":
            switch(a.kind){
                case "A":
                    return "Aルートへ分岐";
                case "B":
                    return "Bルートへ分岐";
                case "HOME":
                    return "HOMEへ戻る";
            }
        case "branchIndex":
            return `分岐 ${a.index}`;
        case "reaction":
            return a.kind === "clap" ? "拍手" : "笑い";
        case "paint":
            return "PAINT🎨";
        case "eraser":
            return "ERASER";
        case "sound":
            {
                const device = a.outputDevice === "wii" ? "[Wii]" : "[PC]";
                switch(a.kind){
                    case "shot":
                        return `SHOT🔊${device}`;
                    case "oh":
                        return `Oh...🔊${device}`;
                    case "uxo":
                        return `Uxo~🔊${device}`;
                }
            }
        case "remove":
            return "REMOVE";
        case "irSens":
            return "IRSens切替";
    }
}
function mergeBindings(bindings) {
    return {
        ...DEFAULT_BINDINGS,
        ...bindings ?? {}
    };
}
function encodeAction(a) {
    return JSON.stringify(a);
}
function decodeAction(s) {
    return JSON.parse(s);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WiiDebugPanel",
    ()=>WiiDebugPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/buttonBindings.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function WiiDebugPanel({ wiiState, pressed, effectiveProjectBindings, irCursorEnabled, onToggleIrCursor }) {
    _s();
    // 表示用の値を保持
    const [displayAccel, setDisplayAccel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0,
        z: 0
    });
    const displayIrCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const displayButtonsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("(none)");
    const displayBindingsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const lastAccelUpdateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // 加速度センサーの更新（200msごとに更新）
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WiiDebugPanel.useEffect": ()=>{
            if (!wiiState || !wiiState.accel) return;
            const now = Date.now();
            const timeSinceLastUpdate = now - lastAccelUpdateRef.current;
            // 200ms経過している場合のみ更新
            if (timeSinceLastUpdate >= 200) {
                const current = wiiState.accel;
                // 全て0の場合は無視（無効なデータ）
                if (current.x === 0 && current.y === 0 && current.z === 0) {
                    return;
                }
                setDisplayAccel({
                    "WiiDebugPanel.useEffect": (prev)=>{
                        // 値が変わっている場合のみ更新
                        if (current.x !== prev.x || current.y !== prev.y || current.z !== prev.z) {
                            lastAccelUpdateRef.current = now;
                            return {
                                x: current.x,
                                y: current.y,
                                z: current.z
                            };
                        }
                        return prev;
                    }
                }["WiiDebugPanel.useEffect"]);
            }
        }
    }["WiiDebugPanel.useEffect"], [
        wiiState
    ]);
    // IRカメラの更新（レンダリング中に直接更新）
    if (wiiState && wiiState.ir) {
        const currentCount = wiiState.ir.length;
        const prevCount = displayIrCountRef.current;
        if (currentCount !== prevCount) {
            displayIrCountRef.current = currentCount;
        }
    }
    // ボタンの更新（押されているボタンがある場合のみ更新）
    const on = [];
    for (const [btn, isDown] of Object.entries(pressed)){
        if (isDown) on.push(btn);
    }
    // ボタンが押されている場合のみ更新（何も押されていない場合は前回の値を保持）
    if (on.length > 0) {
        const currentButtons = on.join(", ");
        displayButtonsRef.current = currentButtons;
    }
    // バインディング情報の更新（レンダリング中に直接更新）
    const entries = Object.entries(effectiveProjectBindings);
    // 指定された順序でソート（ボタン名の大文字小文字に注意）
    const buttonOrder = [
        "Up",
        "Down",
        "Right",
        "Left",
        "A",
        "B",
        "Minus",
        "Home",
        "Plus",
        "One",
        "Two"
    ];
    entries.sort((a, b)=>{
        const indexA = buttonOrder.indexOf(a[0]);
        const indexB = buttonOrder.indexOf(b[0]);
        // 両方とも順序リストにある場合は順序に従う
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        // aのみ順序リストにある場合はaを前に
        if (indexA !== -1) return -1;
        // bのみ順序リストにある場合はbを前に
        if (indexB !== -1) return 1;
        // 両方とも順序リストにない場合はアルファベット順
        return a[0].localeCompare(b[0]);
    });
    const currentBindings = entries.map(([btn, action])=>`${btn.padEnd(8)} → ${action ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAction"])(action) : "(unassigned)"}`);
    const prevBindings = displayBindingsRef.current;
    const hasChanged = currentBindings.length !== prevBindings.length || currentBindings.some((line, i)=>line !== prevBindings[i]);
    if (hasChanged) {
        displayBindingsRef.current = currentBindings;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "absolute",
            top: 20,
            right: 20,
            background: "rgba(0,0,0,0.82)",
            color: "#d1fae5",
            padding: "12px 14px",
            borderRadius: 10,
            fontSize: 14,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
            zIndex: 9999,
            pointerEvents: "auto",
            minWidth: 360,
            whiteSpace: "pre",
            lineHeight: 1.35,
            border: "1px solid rgba(255,255,255,0.12)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontWeight: 800,
                    color: "#a7f3d0",
                    marginBottom: 8
                },
                children: "Wii Debug"
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 124,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    color: "rgba(209,250,229,0.9)"
                },
                children: [
                    "Acc: X=",
                    String(displayAccel.x).padStart(3),
                    " Y=",
                    String(displayAccel.y).padStart(3),
                    " Z=",
                    String(displayAccel.z).padStart(3)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 125,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    color: "rgba(209,250,229,0.9)"
                },
                children: [
                    "IR : ",
                    displayIrCountRef.current
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 130,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    color: "rgba(209,250,229,0.9)"
                },
                children: `Btn: ${displayButtonsRef.current}`
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 131,
                columnNumber: 4
            }, this),
            onToggleIrCursor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 8
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onToggleIrCursor,
                    style: {
                        background: irCursorEnabled ? "#10b981" : "#374151",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 12px",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: 12,
                        width: "100%"
                    },
                    children: irCursorEnabled ? "IR Cursor: ON" : "IR Cursor: OFF"
                }, void 0, false, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                    lineNumber: 136,
                    columnNumber: 6
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 135,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    margin: "10px 0",
                    borderTop: "1px solid rgba(255,255,255,0.12)"
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 155,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontWeight: 800,
                    color: "#a7f3d0",
                    marginBottom: 6
                },
                children: "Bindings (project)"
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 156,
                columnNumber: 4
            }, this),
            displayBindingsRef.current.map((line)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: line
                }, line, false, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                    lineNumber: 158,
                    columnNumber: 5
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
        lineNumber: 104,
        columnNumber: 3
    }, this);
}
_s(WiiDebugPanel, "UQ1zGWzPiWBibC5D1JGNd0RMnJI=");
_c = WiiDebugPanel;
var _c;
__turbopack_context__.k.register(_c, "WiiDebugPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/lib/projectBindingsStorage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "loadProjectBindings",
    ()=>loadProjectBindings,
    "saveProjectBindings",
    ()=>saveProjectBindings
]);
function key(projectId) {
    return `wiiSugeee:projectBindings:${projectId}`;
}
function loadProjectBindings(projectId) {
    try {
        const raw = localStorage.getItem(key(projectId));
        if (!raw) return undefined;
        return JSON.parse(raw);
    } catch  {
        return undefined;
    }
}
function saveProjectBindings(projectId, bindings) {
    try {
        localStorage.setItem(key(projectId), JSON.stringify(bindings));
    } catch  {
    // ignore
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/lib/currentProjectStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCurrentFlow",
    ()=>getCurrentFlow,
    "getCurrentProjectId",
    ()=>getCurrentProjectId,
    "getProjectBindings",
    ()=>getProjectBindings,
    "getSoundSettings",
    ()=>getSoundSettings,
    "setCurrentFlow",
    ()=>setCurrentFlow,
    "setCurrentProjectId",
    ()=>setCurrentProjectId,
    "setProjectBindings",
    ()=>setProjectBindings,
    "setSoundSettings",
    ()=>setSoundSettings,
    "subscribeCurrentFlow",
    ()=>subscribeCurrentFlow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/buttonBindings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectBindingsStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/projectBindingsStorage.ts [app-client] (ecmascript)");
;
;
let currentFlow = null;
let currentProjectId = "default"; // ★追加
const listeners = new Set();
function setCurrentProjectId(projectId) {
    currentProjectId = projectId || "default";
    for (const l of listeners)l();
}
function getCurrentProjectId() {
    return currentProjectId;
}
function getCurrentFlow() {
    return currentFlow;
}
function setCurrentFlow(flow) {
    if (flow) {
        const stored = ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectBindingsStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadProjectBindings"])(currentProjectId) : "TURBOPACK unreachable";
        currentFlow = stored ? {
            ...flow,
            projectBindings: stored
        } : flow;
    } else {
        currentFlow = null;
    }
    for (const l of listeners)l();
}
function subscribeCurrentFlow(listener) {
    listeners.add(listener);
    return ()=>listeners.delete(listener);
}
function getProjectBindings() {
    // ★修正: currentFlowに無くても localStorage から読めるようにする
    if (currentFlow?.projectBindings) {
        console.log("[Bindings] Loaded from currentFlow:", currentFlow.projectBindings);
        return currentFlow.projectBindings;
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const stored = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectBindingsStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadProjectBindings"])(currentProjectId);
    console.log(`[Bindings] Loaded from localStorage (projectId: ${currentProjectId}):`, stored);
    return stored;
}
function setProjectBindings(bindings) {
    // ★修正: currentFlowが無くても保存はできる
    if (currentFlow) {
        currentFlow = {
            ...currentFlow,
            projectBindings: bindings
        };
    }
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectBindingsStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveProjectBindings"])(currentProjectId, bindings);
    }
    for (const l of listeners)l();
}
// 音声設定の保存・読み込み
const SOUND_SETTINGS_KEY_PREFIX = "wiiSugeee_soundSettings_";
function getSoundSettings() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const key = SOUND_SETTINGS_KEY_PREFIX + currentProjectId;
    const stored = localStorage.getItem(key);
    if (!stored) {
        return {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SOUND_SETTINGS"]
        };
    }
    try {
        return JSON.parse(stored);
    } catch  {
        return {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SOUND_SETTINGS"]
        };
    }
}
function setSoundSettings(settings) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const key = SOUND_SETTINGS_KEY_PREFIX + currentProjectId;
    localStorage.setItem(key, JSON.stringify(settings));
    for (const l of listeners)l();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WiiDisconnectPopup",
    ()=>WiiDisconnectPopup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function WiiDisconnectPopup({ isPlaying, startedWithWii, wiiConnected, wiiDisconnectedAt, playingSince }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ★変更: 「発表中」かつ「開始時に接続していた」場合のみ、切断イベントで開く
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WiiDisconnectPopup.useEffect": ()=>{
            if (!isPlaying) return;
            if (!startedWithWii) return;
            if (!wiiDisconnectedAt) return;
            // ★追加: 再生開始後に起きた切断だけを対象にする（開始前の切断イベントを無視）
            if (wiiDisconnectedAt < playingSince) return;
            setOpen(true);
        }
    }["WiiDisconnectPopup.useEffect"], [
        isPlaying,
        startedWithWii,
        wiiDisconnectedAt,
        playingSince
    ]);
    // ★追加: 再接続されたら自動的にポップアップを閉じる
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WiiDisconnectPopup.useEffect": ()=>{
            if (wiiConnected && open) {
                setOpen(false);
            }
        }
    }["WiiDisconnectPopup.useEffect"], [
        wiiConnected,
        open
    ]);
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Wiiリモコンの接続が切れました",
        style: {
            position: "absolute",
            inset: 0,
            zIndex: 30000,
            display: "grid",
            placeItems: "center",
            background: "rgba(0,0,0,0.75)",
            color: "white",
            padding: 24
        },
        onClick: ()=>setOpen(false),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: "min(720px, 92vw)",
                borderRadius: 14,
                background: "rgba(15,15,15,0.95)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 20px 80px rgba(0,0,0,0.6)",
                padding: 24,
                textAlign: "center"
            },
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 30,
                        fontWeight: 800,
                        marginBottom: 10
                    },
                    children: "Wiiリモコンの接続が切れました"
                }, void 0, false, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
                    lineNumber: 76,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 16,
                        opacity: 0.9,
                        lineHeight: 1.6
                    },
                    children: [
                        "接続（Bluetooth/電池）を確認してください。",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
                            lineNumber: 80,
                            columnNumber: 47
                        }, this),
                        "キーボード操作（←/→）は引き続き利用できます。"
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
                    lineNumber: 79,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginTop: 16,
                        display: "flex",
                        justifyContent: "center",
                        gap: 12
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setOpen(false),
                        style: {
                            padding: "10px 16px",
                            fontSize: 16
                        },
                        children: "閉じる"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
                        lineNumber: 85,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
                    lineNumber: 84,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
            lineNumber: 64,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
        lineNumber: 48,
        columnNumber: 9
    }, this);
}
_s(WiiDisconnectPopup, "7oOnPki23IUg2Imd4pIkXZ2/dxg=");
_c = WiiDisconnectPopup;
var _c;
__turbopack_context__.k.register(_c, "WiiDisconnectPopup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiReconnectPopup.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WiiReconnectPopup",
    ()=>WiiReconnectPopup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function WiiReconnectPopup({ isPlaying, wiiConnected, startedWithWii }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const prevConnectedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(wiiConnected);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WiiReconnectPopup.useEffect": ()=>{
            // 発表中でない場合、または開始時にWii接続していなかった場合は表示しない
            if (!isPlaying || !startedWithWii) return;
            const wasDisconnected = !prevConnectedRef.current;
            const isNowConnected = wiiConnected;
            // 切断→接続に遷移したらポップアップを表示
            if (wasDisconnected && isNowConnected) {
                setOpen(true);
                // 1秒後に自動的に閉じる
                const timer = setTimeout({
                    "WiiReconnectPopup.useEffect.timer": ()=>{
                        setOpen(false);
                    }
                }["WiiReconnectPopup.useEffect.timer"], 1500);
                return ({
                    "WiiReconnectPopup.useEffect": ()=>clearTimeout(timer)
                })["WiiReconnectPopup.useEffect"];
            }
            prevConnectedRef.current = wiiConnected;
        }
    }["WiiReconnectPopup.useEffect"], [
        wiiConnected,
        isPlaying,
        startedWithWii
    ]);
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "alert",
        "aria-live": "polite",
        "aria-label": "Wiiリモコンが接続されました",
        style: {
            position: "absolute",
            top: 80,
            right: 20,
            zIndex: 30000,
            width: "min(400px, 90vw)",
            borderRadius: 14,
            background: "rgba(0, 200, 100, 0.95)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 10px 40px rgba(0,200,100,0.4)",
            padding: 20,
            color: "white",
            textAlign: "center",
            animation: "slideInRight 0.3s ease-out"
        },
        className: "jsx-6983641d836145c8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 24,
                    fontWeight: 800,
                    marginBottom: 8
                },
                className: "jsx-6983641d836145c8",
                children: "✓ Wiiリモコンが接続されました！"
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiReconnectPopup.tsx",
                lineNumber: 60,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 14,
                    opacity: 0.95,
                    lineHeight: 1.5
                },
                className: "jsx-6983641d836145c8",
                children: "操作を再開できます"
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiReconnectPopup.tsx",
                lineNumber: 63,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "6983641d836145c8",
                children: "@keyframes slideInRight{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiReconnectPopup.tsx",
        lineNumber: 40,
        columnNumber: 9
    }, this);
}
_s(WiiReconnectPopup, "Ni3cHAZYekkYPQ8q1cpDWyjJZzs=");
_c = WiiReconnectPopup;
var _c;
__turbopack_context__.k.register(_c, "WiiReconnectPopup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PdfSlide.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PdfSlide",
    ()=>PdfSlide
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function PdfSlide(props) {
    _s();
    const { assetId, page, fallbackDataUrl, alt, getOrLoadPdfDocument } = props;
    const wrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [size, setSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [renderError, setRenderError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const renderTaskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PdfSlide.useEffect": ()=>{
            const el = wrapperRef.current;
            if (!el) return;
            const update = {
                "PdfSlide.useEffect.update": ()=>{
                    const rect = el.getBoundingClientRect();
                    setSize({
                        w: Math.max(0, rect.width),
                        h: Math.max(0, rect.height)
                    });
                }
            }["PdfSlide.useEffect.update"];
            update();
            const ro = new ResizeObserver({
                "PdfSlide.useEffect": ()=>update()
            }["PdfSlide.useEffect"]);
            ro.observe(el);
            return ({
                "PdfSlide.useEffect": ()=>ro.disconnect()
            })["PdfSlide.useEffect"];
        }
    }["PdfSlide.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PdfSlide.useEffect": ()=>{
            let cancelled = false;
            ({
                "PdfSlide.useEffect": async ()=>{
                    try {
                        setRenderError(null);
                        const el = wrapperRef.current;
                        const canvas = canvasRef.current;
                        if (!el || !canvas || !size || size.w === 0 || size.h === 0) return;
                        // 既存のレンダリングをキャンセル
                        if (renderTaskRef.current) {
                            try {
                                renderTaskRef.current.cancel();
                            } catch (e) {
                            // キャンセル済みの場合は無視
                            }
                            renderTaskRef.current = null;
                        }
                        const pdf = await getOrLoadPdfDocument(assetId);
                        if (cancelled) return;
                        const pdfPage = await pdf.getPage(page);
                        if (cancelled) return;
                        const viewport1 = pdfPage.getViewport({
                            scale: 1
                        });
                        const scale = Math.min(size.w / viewport1.width, size.h / viewport1.height);
                        const dpr = ("TURBOPACK compile-time truthy", 1) ? window.devicePixelRatio || 1 : "TURBOPACK unreachable";
                        const renderViewport = pdfPage.getViewport({
                            scale: scale * dpr
                        });
                        canvas.width = Math.floor(renderViewport.width);
                        canvas.height = Math.floor(renderViewport.height);
                        canvas.style.width = `${Math.floor(renderViewport.width / dpr)}px`;
                        canvas.style.height = `${Math.floor(renderViewport.height / dpr)}px`;
                        const ctx = canvas.getContext("2d");
                        if (!ctx) return;
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        const task = pdfPage.render({
                            canvasContext: ctx,
                            canvas,
                            viewport: renderViewport
                        });
                        renderTaskRef.current = task;
                        await task.promise;
                        if (renderTaskRef.current === task) {
                            renderTaskRef.current = null;
                        }
                    } catch (e) {
                        const msg = e?.name === "RenderingCancelledException" ? null : e instanceof Error ? e.message : String(e);
                        if (!cancelled && msg) setRenderError(msg);
                    }
                }
            })["PdfSlide.useEffect"]();
            return ({
                "PdfSlide.useEffect": ()=>{
                    cancelled = true;
                    if (renderTaskRef.current) {
                        try {
                            renderTaskRef.current.cancel();
                            renderTaskRef.current = null;
                        } catch  {
                        // 既にキャンセル済みの場合は無視
                        }
                    }
                }
            })["PdfSlide.useEffect"];
        }
    }["PdfSlide.useEffect"], [
        assetId,
        getOrLoadPdfDocument,
        page,
        size
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: wrapperRef,
        style: {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        children: renderError && fallbackDataUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: fallbackDataUrl,
            style: {
                width: "100%",
                height: "100%",
                objectFit: "contain"
            },
            alt: alt
        }, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PdfSlide.tsx",
            lineNumber: 109,
            columnNumber: 5
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
            ref: canvasRef,
            "aria-label": alt
        }, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PdfSlide.tsx",
            lineNumber: 111,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PdfSlide.tsx",
        lineNumber: 104,
        columnNumber: 3
    }, this);
}
_s(PdfSlide, "nOFSijRFx0NbX4nouZ9J4/dt6mM=");
_c = PdfSlide;
var _c;
__turbopack_context__.k.register(_c, "PdfSlide");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/VideoSlide.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VideoSlide",
    ()=>VideoSlide
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/idbAssets.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function VideoSlide(props) {
    _s();
    const { assetId, alt } = props;
    const [src, setSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VideoSlide.useEffect": ()=>{
            let active = true;
            let url = null;
            ({
                "VideoSlide.useEffect": async ()=>{
                    try {
                        setError(null);
                        setSrc(null);
                        const blob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAssetBlob"])(assetId);
                        if (!blob) throw new Error("動画アセットが見つかりません (IndexedDB)");
                        url = URL.createObjectURL(blob);
                        if (!active) return;
                        setSrc(url);
                    } catch (e) {
                        if (!active) return;
                        setError(e instanceof Error ? e.message : String(e));
                    }
                }
            })["VideoSlide.useEffect"]();
            return ({
                "VideoSlide.useEffect": ()=>{
                    active = false;
                    if (url) URL.revokeObjectURL(url);
                }
            })["VideoSlide.useEffect"];
        }
    }["VideoSlide.useEffect"], [
        assetId
    ]);
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                color: "white",
                textAlign: "center"
            },
            children: [
                "動画の読み込みに失敗しました: ",
                error
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/VideoSlide.tsx",
            lineNumber: 40,
            columnNumber: 10
        }, this);
    }
    if (!src) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                color: "white",
                textAlign: "center"
            },
            children: "動画を読み込み中..."
        }, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/VideoSlide.tsx",
            lineNumber: 43,
            columnNumber: 10
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
        src: src,
        style: {
            width: "100%",
            height: "100%",
            objectFit: "contain"
        },
        controls: true,
        autoPlay: true,
        muted: true,
        playsInline: true,
        "aria-label": alt
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/VideoSlide.tsx",
        lineNumber: 47,
        columnNumber: 3
    }, this);
}
_s(VideoSlide, "ZJfjdRt2Y3vbOuUEnkxuooBuAtE=");
_c = VideoSlide;
var _c;
__turbopack_context__.k.register(_c, "VideoSlide");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ImageSlide.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ImageSlide",
    ()=>ImageSlide
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/idbAssets.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ImageSlide(props) {
    _s();
    const { assetId, alt } = props;
    const [src, setSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ImageSlide.useEffect": ()=>{
            let active = true;
            let url = null;
            ({
                "ImageSlide.useEffect": async ()=>{
                    try {
                        setError(null);
                        setSrc(null);
                        const blob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAssetBlob"])(assetId);
                        if (!blob) throw new Error("画像アセットが見つかりません (IndexedDB)");
                        url = URL.createObjectURL(blob);
                        if (!active) return;
                        setSrc(url);
                    } catch (e) {
                        if (!active) return;
                        setError(e instanceof Error ? e.message : String(e));
                    }
                }
            })["ImageSlide.useEffect"]();
            return ({
                "ImageSlide.useEffect": ()=>{
                    active = false;
                    if (url) URL.revokeObjectURL(url);
                }
            })["ImageSlide.useEffect"];
        }
    }["ImageSlide.useEffect"], [
        assetId
    ]);
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                color: "white",
                textAlign: "center"
            },
            children: [
                "画像の読み込みに失敗しました: ",
                error
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ImageSlide.tsx",
            lineNumber: 40,
            columnNumber: 10
        }, this);
    }
    if (!src) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                color: "white",
                textAlign: "center"
            },
            children: "画像を読み込み中..."
        }, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ImageSlide.tsx",
            lineNumber: 43,
            columnNumber: 10
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
        src: src,
        style: {
            width: "100%",
            height: "100%",
            objectFit: "contain"
        },
        alt: alt
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ImageSlide.tsx",
        lineNumber: 47,
        columnNumber: 3
    }, this);
}
_s(ImageSlide, "ZJfjdRt2Y3vbOuUEnkxuooBuAtE=");
_c = ImageSlide;
var _c;
__turbopack_context__.k.register(_c, "ImageSlide");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SlideDisplay",
    ()=>SlideDisplay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$PdfSlide$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PdfSlide.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$VideoSlide$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/VideoSlide.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$ImageSlide$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ImageSlide.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
function SlideDisplay(props) {
    const { currentNode, error, getOrLoadPdfDocument } = props;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        children: currentNode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: currentNode.data.asset?.kind === "pdf" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$PdfSlide$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PdfSlide"], {
                assetId: currentNode.data.asset.assetId,
                page: currentNode.data.asset.page ?? 1,
                fallbackDataUrl: currentNode.data.asset.thumbnailDataUrl,
                alt: currentNode.data.label,
                getOrLoadPdfDocument: getOrLoadPdfDocument
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this) : currentNode.data.asset?.kind === "video" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$VideoSlide$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VideoSlide"], {
                assetId: currentNode.data.asset.assetId,
                alt: currentNode.data.label
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this) : currentNode.data.asset?.kind === "image" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$ImageSlide$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ImageSlide"], {
                assetId: currentNode.data.asset.assetId,
                alt: currentNode.data.label
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                style: {
                    fontSize: 80,
                    color: "white",
                    textAlign: "center",
                    maxWidth: "80%"
                },
                children: currentNode.data.label
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this)
        }, void 0, false) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                color: "white"
            },
            children: error ?? "スライドデータがありません"
        }, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx",
            lineNumber: 40,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx",
        lineNumber: 18,
        columnNumber: 3
    }, this);
}
_c = SlideDisplay;
var _c;
__turbopack_context__.k.register(_c, "SlideDisplay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/DrawingCanvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DrawingCanvas",
    ()=>DrawingCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
// IRカメラの座標(0-1023)を画面座標に変換する関数
function mapIrToScreen(irX, irY, screenW, screenH) {
    const x = (1 - irX / 1024) * screenW;
    const y = irY / 768 * screenH;
    return {
        x,
        y
    };
}
function DrawingCanvas(props) {
    _s();
    const { drawingPoints, wiiState, isPlaying, shouldPaint, eraserMode, eraserPosition } = props;
    const drawingCanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cursorCanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastDrawnIndexRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // キャンバスサイズ管理とリサイズ時の全再描画
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DrawingCanvas.useEffect": ()=>{
            const handleResize = {
                "DrawingCanvas.useEffect.handleResize": ()=>{
                    const width = window.innerWidth;
                    const height = window.innerHeight;
                    if (drawingCanvasRef.current) {
                        drawingCanvasRef.current.width = width;
                        drawingCanvasRef.current.height = height;
                        // リサイズされたらクリアされるので、全再描画が必要
                        lastDrawnIndexRef.current = 0;
                    }
                    if (cursorCanvasRef.current) {
                        cursorCanvasRef.current.width = width;
                        cursorCanvasRef.current.height = height;
                    }
                }
            }["DrawingCanvas.useEffect.handleResize"];
            // 初期サイズ設定
            handleResize();
            window.addEventListener("resize", handleResize);
            return ({
                "DrawingCanvas.useEffect": ()=>window.removeEventListener("resize", handleResize)
            })["DrawingCanvas.useEffect"];
        }
    }["DrawingCanvas.useEffect"], []);
    // 描画レイヤー更新 (Drawing Layer) - 追記型
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DrawingCanvas.useEffect": ()=>{
            const canvas = drawingCanvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!canvas || !ctx) return;
            // リセット検知（配列が短くなった場合など）
            if (drawingPoints.length < lastDrawnIndexRef.current) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                lastDrawnIndexRef.current = 0;
            }
            // 描画不要なら終了
            if (drawingPoints.length === lastDrawnIndexRef.current) return;
            // 共通設定
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            // 追記ループ
            for(let i = lastDrawnIndexRef.current; i < drawingPoints.length; i++){
                const p = drawingPoints[i];
                if (!p) continue; // 区切り
                const prev = i > 0 ? drawingPoints[i - 1] : null;
                const mode = p.mode || "draw";
                // 始点かどうか（配列の先頭、または直前がnull、またはモードが変わった場合）
                const isStart = !prev || prev.mode !== p.mode;
                if (isStart) {
                    // 始点処理
                    if (mode === "erase") {
                        // 消しゴム始点スタンプ（黒板消しのように徐々に薄くなる）
                        ctx.globalCompositeOperation = "destination-out";
                        ctx.fillStyle = "rgba(0,0,0,0.18)"; // 5-6回で完全に消える
                        ctx.shadowBlur = 25; // ぼかしを入れて境界を柔らかく
                        ctx.shadowColor = "rgba(0,0,0,0.18)";
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, 60, 0, Math.PI * 2);
                        ctx.fill();
                    }
                // drawモードの始点はmoveToだけなので、ここでは何もしない（次の点で線を引く）
                } else {
                    // 接続処理 (prev -> p)
                    if (mode === "draw") {
                        ctx.globalCompositeOperation = "source-over";
                        ctx.strokeStyle = "red";
                        ctx.lineWidth = 5;
                        ctx.shadowBlur = 0;
                        ctx.shadowColor = "transparent";
                        ctx.beginPath();
                        ctx.moveTo(prev.x, prev.y);
                        ctx.lineTo(p.x, p.y);
                        ctx.stroke();
                    } else {
                        // erase 補間（黒板消しのように徐々に薄くなる）
                        ctx.globalCompositeOperation = "destination-out";
                        ctx.fillStyle = "rgba(0,0,0,0.18)"; // 5-6回で完全に消える
                        ctx.shadowBlur = 25; // ぼかしを入れて境界を柔らかく
                        ctx.shadowColor = "rgba(0,0,0,0.18)";
                        const dist = Math.hypot(p.x - prev.x, p.y - prev.y);
                        const angle = Math.atan2(p.y - prev.y, p.x - prev.x);
                        const step = 12; // 補間間隔を狭めて滑らかに
                        for(let d = step; d <= dist; d += step){
                            const bx = prev.x + Math.cos(angle) * d;
                            const by = prev.y + Math.sin(angle) * d;
                            ctx.beginPath();
                            ctx.arc(bx, by, 60, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        // 終点
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, 60, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            // インデックス更新
            lastDrawnIndexRef.current = drawingPoints.length;
        }
    }["DrawingCanvas.useEffect"], [
        drawingPoints
    ]);
    // カーソルレイヤー更新 (Cursor Layer) - 毎フレーム更新
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DrawingCanvas.useEffect": ()=>{
            const canvas = cursorCanvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!canvas || !ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // 消しゴムモード時：消しゴム範囲を表示
            if (eraserMode && eraserPosition) {
                ctx.save();
                ctx.strokeStyle = "rgba(255, 100, 100, 0.6)";
                ctx.lineWidth = 2;
                ctx.setLineDash([
                    8,
                    4
                ]);
                ctx.beginPath();
                ctx.arc(eraserPosition.x, eraserPosition.y, 60, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.restore();
            }
        }
    }["DrawingCanvas.useEffect"], [
        eraserMode,
        eraserPosition
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: drawingCanvasRef,
                style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none"
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/DrawingCanvas.tsx",
                lineNumber: 163,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: cursorCanvasRef,
                style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none"
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/DrawingCanvas.tsx",
                lineNumber: 167,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true);
}
_s(DrawingCanvas, "yz3hGgguPy6VqYfu8EeWmE/eWVk=");
_c = DrawingCanvas;
var _c;
__turbopack_context__.k.register(_c, "DrawingCanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IrPointerOverlay",
    ()=>IrPointerOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
// IRカメラの座標(0-1023 x 0-767)を画面座標に変換する関数
function mapIrToScreen(irX, irY, screenW, screenH) {
    const x = (1 - irX / 1024) * screenW;
    const y = irY / 768 * screenH;
    return {
        x,
        y
    };
}
function IrPointerOverlay(props) {
    const { wiiState, irCursorEnabled, showIrDebug = false } = props;
    // ★IRカーソルONのときはバックエンドのSetCursorPosでPCカーソルを制御するため、
    // フロントエンドでの追加カーソル描画は不要（2重カーソル問題の解消）
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: showIrDebug && wiiState && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                position: "absolute",
                bottom: 60,
                right: 20,
                background: "rgba(0, 0, 0, 0.85)",
                color: "lime",
                padding: "12px 16px",
                borderRadius: 8,
                fontFamily: "monospace",
                fontSize: 12,
                lineHeight: 1.6,
                border: "1px solid rgba(0, 255, 0, 0.3)",
                maxWidth: 320,
                zIndex: 9999
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontWeight: "bold",
                        marginBottom: 8,
                        color: "#0ff"
                    },
                    children: "📡 IR Sensor Debug"
                }, void 0, false, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                    lineNumber: 46,
                    columnNumber: 6
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                color: "#888"
                            },
                            children: "IRCursor:"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                            lineNumber: 50,
                            columnNumber: 7
                        }, this),
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                color: irCursorEnabled ? "#0f0" : "#f55"
                            },
                            children: irCursorEnabled ? "ON" : "OFF"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                            lineNumber: 51,
                            columnNumber: 7
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                    lineNumber: 49,
                    columnNumber: 6
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                color: "#888"
                            },
                            children: "Detected:"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                            lineNumber: 56,
                            columnNumber: 7
                        }, this),
                        " ",
                        wiiState.ir?.length || 0,
                        " point(s)"
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                    lineNumber: 55,
                    columnNumber: 6
                }, this),
                wiiState.ir && wiiState.ir.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                            style: {
                                margin: "8px 0",
                                border: "none",
                                borderTop: "1px solid rgba(0,255,0,0.2)"
                            }
                        }, void 0, false, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                            lineNumber: 60,
                            columnNumber: 8
                        }, this),
                        wiiState.ir.map((dot, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: "#0ff"
                                        },
                                        children: [
                                            "IR ",
                                            index + 1,
                                            ":"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                                        lineNumber: 63,
                                        columnNumber: 10
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            paddingLeft: 12
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: "#888"
                                                },
                                                children: "Raw:"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                                                lineNumber: 65,
                                                columnNumber: 11
                                            }, this),
                                            " (",
                                            dot.x,
                                            ", ",
                                            dot.y,
                                            ")",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                                                lineNumber: 66,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: "#888"
                                                },
                                                children: "Screen:"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                                                lineNumber: 67,
                                                columnNumber: 11
                                            }, this),
                                            " (",
                                            Math.round(mapIrToScreen(dot.x, dot.y, window.innerWidth, window.innerHeight).x),
                                            ",",
                                            " ",
                                            Math.round(mapIrToScreen(dot.x, dot.y, window.innerWidth, window.innerHeight).y),
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                                        lineNumber: 64,
                                        columnNumber: 10
                                    }, this)
                                ]
                            }, index, true, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                                lineNumber: 62,
                                columnNumber: 9
                            }, this))
                    ]
                }, void 0, true),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                    style: {
                        margin: "8px 0",
                        border: "none",
                        borderTop: "1px solid rgba(0,255,0,0.2)"
                    }
                }, void 0, false, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                    lineNumber: 75,
                    columnNumber: 6
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 10,
                        color: "#666"
                    },
                    children: [
                        "座標範囲: X(0-1023), Y(0-767)",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                            lineNumber: 78,
                            columnNumber: 7
                        }, this),
                        "[C] IRカーソル切替 / [Space] デバッグ表示切替"
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                    lineNumber: 76,
                    columnNumber: 6
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
            lineNumber: 29,
            columnNumber: 5
        }, this)
    }, void 0, false);
}
_c = IrPointerOverlay;
var _c;
__turbopack_context__.k.register(_c, "IrPointerOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PresenterView",
    ()=>PresenterView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/presentation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/idbAssets.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$hooks$2f$useWiiController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/hooks/useWiiController.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$ReactionOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ReactionOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$WiiDebugPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/buttonBindings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$currentProjectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/currentProjectStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$WiiDisconnectPopup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$WiiReconnectPopup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiReconnectPopup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$SlideDisplay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$DrawingCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/DrawingCanvas.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$IrPointerOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx [app-client] (ecmascript)");
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx")}`;
    }
};
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function PresenterView() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isMouseDrawingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [isPainting, setIsPainting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const wasWiiADownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const lastEraserToggleTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0); // 消しゴムトグルの多重入力防止
    const lastIrSensToggleTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0); // IRセンサートグルの多重入力防止
    // Wiiリモコンの状態を取得
    const { wiiState, pressed, wiiConnected, wiiDisconnectedAt, irCursorEnabled, setIrCursorEnabled, playWiiSound } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$hooks$2f$useWiiController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWiiController"])();
    // PC側の音声再生用（HTMLAudioElement）
    const soundboardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const audioUnlockedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const pendingSoundRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const tryUnlockAudio = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PresenterView.useCallback[tryUnlockAudio]": async ()=>{
            if (audioUnlockedRef.current) return;
            const { q, w, e } = soundboardRef.current;
            const audios = [
                q,
                w,
                e
            ].filter(Boolean);
            if (audios.length === 0) return;
            try {
                const a = audios[0];
                const prevMuted = a.muted;
                const prevVolume = a.volume;
                a.muted = true;
                a.volume = 0;
                await a.play();
                a.pause();
                a.currentTime = 0;
                a.muted = prevMuted;
                a.volume = prevVolume;
                audioUnlockedRef.current = true;
                console.log("[Audio] Successfully unlocked audio context");
                const pending = pendingSoundRef.current;
                pendingSoundRef.current = null;
                if (pending) {
                    const next = soundboardRef.current[pending];
                    if (next) {
                        next.currentTime = 0;
                        void next.play().catch({
                            "PresenterView.useCallback[tryUnlockAudio]": (err)=>{
                                console.warn("sound play failed", pending, err);
                            }
                        }["PresenterView.useCallback[tryUnlockAudio]"]);
                    }
                }
            } catch (err) {
                console.warn("audio unlock failed", err);
            }
        }
    }["PresenterView.useCallback[tryUnlockAudio]"], []);
    // PC側で音声を再生（HTMLAudio）
    const playSoundOnPC = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PresenterView.useCallback[playSoundOnPC]": async (key)=>{
            const a = soundboardRef.current[key];
            if (!a) {
                console.warn(`[Audio] No audio element for key: ${key}`);
                return;
            }
            // オーディオがアンロックされていない場合、アンロックを試行
            if (!audioUnlockedRef.current) {
                console.log(`[Audio] Attempting to unlock audio context for ${key}`);
                pendingSoundRef.current = key;
                await tryUnlockAudio();
                // アンロックに失敗した場合はペンディングに保存済み
                if (!audioUnlockedRef.current) {
                    console.warn("[Audio] Audio context not unlocked yet, sound will play after user interaction");
                    return;
                }
            }
            console.log(`[Audio] Playing sound on PC: ${key}`);
            a.currentTime = 0;
            void a.play().catch({
                "PresenterView.useCallback[playSoundOnPC]": (err)=>{
                    console.warn(`[Audio] Sound play failed for ${key}:`, err);
                    pendingSoundRef.current = key;
                }
            }["PresenterView.useCallback[playSoundOnPC]"]);
        }
    }["PresenterView.useCallback[playSoundOnPC]"], [
        tryUnlockAudio
    ]);
    // Wiiリモコン側で音声を再生
    const playSoundOnWii = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PresenterView.useCallback[playSoundOnWii]": (key)=>{
            if (key === "q") playWiiSound("shot");
            else if (key === "e") playWiiSound("oh");
            else playWiiSound("uxo");
        }
    }["PresenterView.useCallback[playSoundOnWii]"], [
        playWiiSound
    ]);
    // 汎用の音声再生関数（outputDeviceで出力先を指定）
    const playSound = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PresenterView.useCallback[playSound]": (key, outputDevice = "pc")=>{
            if (outputDevice === "wii") {
                playSoundOnWii(key);
            } else {
                playSoundOnPC(key);
            }
        }
    }["PresenterView.useCallback[playSound]"], [
        playSoundOnPC,
        playSoundOnWii
    ]);
    const returnTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PresenterView.useMemo[returnTo]": ()=>{
            return searchParams.get("from") === "editor" ? "/editor" : "/";
        }
    }["PresenterView.useMemo[returnTo]"], [
        searchParams
    ]);
    const returnLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PresenterView.useMemo[returnLabel]": ()=>{
            return returnTo === "/editor" ? "エディタに戻る" : "ホームに戻る";
        }
    }["PresenterView.useMemo[returnLabel]"], [
        returnTo
    ]);
    const goBack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PresenterView.useCallback[goBack]": ()=>{
            router.push(returnTo);
        }
    }["PresenterView.useCallback[goBack]"], [
        router,
        returnTo
    ]);
    const [flow, setFlow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentNodeId, setCurrentNodeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [startedWithWii, setStartedWithWii] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [playingSince, setPlayingSince] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showDebugPanel, setShowDebugPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showIrDebug, setShowIrDebug] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true); // IRセンサーデバッグ表示
    const pdfDocCacheRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    // ★修正: 常にplaying状態として扱う（flow/currentNodeIdがあれば再生中）
    const isPlaying = flow != null && currentNodeId != null;
    // PC側音声の初期化
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresenterView.useEffect": ()=>{
            const q = new Audio("https://www.myinstants.com/media/sounds/nice-shot-wii-sports_DJJ0VOz.mp3");
            const w = new Audio("https://www.myinstants.com/media/sounds/crowdaw.mp3");
            const e = new Audio("https://www.myinstants.com/media/sounds/crowdoh.mp3");
            q.preload = "auto";
            w.preload = "auto";
            e.preload = "auto";
            soundboardRef.current = {
                q,
                w,
                e
            };
            console.log("[Audio] Audio elements initialized");
            // ユーザーインタラクション時にオーディオコンテキストをアンロック
            const unlockOnInteraction = {
                "PresenterView.useEffect.unlockOnInteraction": ()=>{
                    if (audioUnlockedRef.current) return;
                    console.log("[Audio] User interaction detected, unlocking audio");
                    void tryUnlockAudio();
                }
            }["PresenterView.useEffect.unlockOnInteraction"];
            // クリックやタッチでアンロックを試行
            window.addEventListener("click", unlockOnInteraction);
            window.addEventListener("touchstart", unlockOnInteraction);
            window.addEventListener("keydown", unlockOnInteraction);
            return ({
                "PresenterView.useEffect": ()=>{
                    window.removeEventListener("click", unlockOnInteraction);
                    window.removeEventListener("touchstart", unlockOnInteraction);
                    window.removeEventListener("keydown", unlockOnInteraction);
                    for (const a of [
                        q,
                        w,
                        e
                    ]){
                        try {
                            a.pause();
                        } catch  {
                        // ignore
                        }
                    }
                    soundboardRef.current = {};
                }
            })["PresenterView.useEffect"];
        }
    }["PresenterView.useEffect"], [
        tryUnlockAudio
    ]);
    // スペースキーでデバッグパネルとIRセンサーデバッグ表示を切り替え
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresenterView.useEffect": ()=>{
            const handleKeyDown = {
                "PresenterView.useEffect.handleKeyDown": (e)=>{
                    if (e.code === "Space" && e.target === document.body) {
                        e.preventDefault();
                        setShowDebugPanel({
                            "PresenterView.useEffect.handleKeyDown": (prev)=>!prev
                        }["PresenterView.useEffect.handleKeyDown"]);
                        setShowIrDebug({
                            "PresenterView.useEffect.handleKeyDown": (prev)=>!prev
                        }["PresenterView.useEffect.handleKeyDown"]);
                    }
                }
            }["PresenterView.useEffect.handleKeyDown"];
            window.addEventListener("keydown", handleKeyDown);
            return ({
                "PresenterView.useEffect": ()=>window.removeEventListener("keydown", handleKeyDown)
            })["PresenterView.useEffect"];
        }
    }["PresenterView.useEffect"], []);
    const getOrLoadPdfDocument = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PresenterView.useCallback[getOrLoadPdfDocument]": async (assetId)=>{
            const cached = pdfDocCacheRef.current.get(assetId);
            if (cached) return await cached;
            const promise = ({
                "PresenterView.useCallback[getOrLoadPdfDocument].promise": async ()=>{
                    const blob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAssetBlob"])(assetId);
                    if (!blob) throw new Error("PDFアセットが見つかりません (IndexedDB)");
                    const arrayBuffer = await blob.arrayBuffer();
                    const pdfjs = await __turbopack_context__.A("[project]/Desktop/WiiSugeee/frontend/node_modules/pdfjs-dist/legacy/build/pdf.mjs [app-client] (ecmascript, async loader)");
                    pdfjs.GlobalWorkerOptions.workerSrc = new __turbopack_context__.U(__turbopack_context__.r("[project]/Desktop/WiiSugeee/frontend/node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs (static in ecmascript)")).toString();
                    return await pdfjs.getDocument({
                        data: arrayBuffer
                    }).promise;
                }
            })["PresenterView.useCallback[getOrLoadPdfDocument].promise"]();
            pdfDocCacheRef.current.set(assetId, promise);
            try {
                return await promise;
            } catch (e) {
                pdfDocCacheRef.current.delete(assetId);
                throw e;
            }
        }
    }["PresenterView.useCallback[getOrLoadPdfDocument]"], []);
    // お絵描き用の座標リスト
    const [drawingPoints, setDrawingPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // 消しゴムモード（トグル式）- XキーとWiiボタンで共通
    const [eraserMode, setEraserMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [eraserButtonName, setEraserButtonName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // カーソル位置（消しゴムカーソル表示用）
    const [cursorPos, setCursorPos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // 連続遷移を防ぐためのクールタイム管理
    const lastNavTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // 現在のノードデータ
    const currentNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PresenterView.useMemo[currentNode]": ()=>flow?.nodes.find({
                "PresenterView.useMemo[currentNode]": (n)=>n.id === currentNodeId
            }["PresenterView.useMemo[currentNode]"])
    }["PresenterView.useMemo[currentNode]"], [
        flow,
        currentNodeId
    ]);
    // ★修正: 初回マウント時に自動的にプレゼンテーションを開始
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresenterView.useEffect": ()=>{
            const loaded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadFromLocalStorage"])();
            if (!loaded || loaded.nodes.length === 0) {
                setError("データが見つかりません。Editorで作成してください。");
                setFlow(null);
                setCurrentNodeId(null);
                return;
            }
            // バインド設定を読み込み
            const storedBindings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$currentProjectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProjectBindings"])();
            const flowWithBindings = storedBindings ? {
                ...loaded,
                projectBindings: storedBindings
            } : loaded;
            console.log("PresenterView: Auto-starting presentation with bindings", {
                storedBindings,
                flowWithBindings
            });
            setError(null);
            setFlow(flowWithBindings);
            // Startノードから開始
            const startNode = loaded.nodes.find({
                "PresenterView.useEffect": (n)=>n.data.label === "Start"
            }["PresenterView.useEffect"]) || loaded.nodes[0];
            setCurrentNodeId(startNode.id);
            // Wii接続状態を記録
            setStartedWithWii(!!wiiConnected);
            setPlayingSince(Date.now());
        }
    }["PresenterView.useEffect"], []); // ★空の依存配列で初回のみ実行
    // ★修正: wiiConnectedが変化したら記録を更新
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresenterView.useEffect": ()=>{
            if (wiiConnected) setStartedWithWii(true);
        }
    }["PresenterView.useEffect"], [
        wiiConnected
    ]);
    const outgoingEdges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PresenterView.useMemo[outgoingEdges]": ()=>{
            if (!flow || !currentNodeId) return [];
            return flow.edges.filter({
                "PresenterView.useMemo[outgoingEdges]": (e)=>e.source === currentNodeId
            }["PresenterView.useMemo[outgoingEdges]"]);
        }
    }["PresenterView.useMemo[outgoingEdges]"], [
        flow,
        currentNodeId
    ]);
    const branchOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PresenterView.useMemo[branchOptions]": ()=>{
            // 1-9 の数字で選べる分岐
            const options = [];
            const used = new Set();
            for (const edge of outgoingEdges){
                const label = (edge.label ?? "").trim();
                const m = label.match(/^([1-9])(?:\b|\s|:|-)/);
                if (m) {
                    const k = m[1];
                    if (!used.has(k)) {
                        options.push({
                            key: k,
                            target: edge.target
                        });
                        used.add(k);
                    }
                }
            }
            // ラベルに番号がない場合は、配列順で 1..n を割り当て
            for (const edge of outgoingEdges){
                if (options.length >= 9) break;
                const nextKey = String(options.length + 1);
                if (used.has(nextKey)) continue;
                options.push({
                    key: nextKey,
                    target: edge.target
                });
                used.add(nextKey);
            }
            return options;
        }
    }["PresenterView.useMemo[branchOptions]"], [
        outgoingEdges
    ]);
    const hasMultipleBranches = outgoingEdges.length >= 2;
    // ノード移動処理
    const navigateTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PresenterView.useCallback[navigateTo]": (nodeId)=>{
            // クールタイムチェック (500ms以内の連続遷移は無視)
            const now = Date.now();
            if (now - lastNavTime.current < 500) return;
            lastNavTime.current = now;
            setCurrentNodeId(nodeId);
            setDrawingPoints([]); // スライドが変わったら線を消す
        }
    }["PresenterView.useCallback[navigateTo]"], []);
    // 次へ（ロジック改良版）
    const nextSlide = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PresenterView.useCallback[nextSlide]": ()=>{
            if (!flow || !currentNodeId) return;
            // 分岐が複数ある場合は、数字選択を優先する
            const edges = flow.edges.filter({
                "PresenterView.useCallback[nextSlide].edges": (e)=>e.source === currentNodeId
            }["PresenterView.useCallback[nextSlide].edges"]);
            if (edges.length >= 2) return;
            // 現在のノードから出ているエッジをすべて取得
            // (上で取得済み)
            if (edges.length === 0) return;
            // 優先順位付け
            // 1. ラベルがないエッジ (デフォルトルート)
            // 2. ラベルが "next" のエッジ
            // 3. それ以外 (最初に見つかったもの)
            const targetEdge = edges.find({
                "PresenterView.useCallback[nextSlide]": (e)=>!e.label || e.label.trim() === ""
            }["PresenterView.useCallback[nextSlide]"]) || edges.find({
                "PresenterView.useCallback[nextSlide]": (e)=>e.label === "next"
            }["PresenterView.useCallback[nextSlide]"]) || edges[0];
            if (targetEdge) navigateTo(targetEdge.target);
        }
    }["PresenterView.useCallback[nextSlide]"], [
        flow,
        currentNodeId,
        navigateTo
    ]);
    const branchByNumberKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PresenterView.useCallback[branchByNumberKey]": (key)=>{
            if (!hasMultipleBranches) return;
            const opt = branchOptions.find({
                "PresenterView.useCallback[branchByNumberKey].opt": (o)=>o.key === key
            }["PresenterView.useCallback[branchByNumberKey].opt"]);
            if (opt) navigateTo(opt.target);
        }
    }["PresenterView.useCallback[branchByNumberKey]"], [
        branchOptions,
        hasMultipleBranches,
        navigateTo
    ]);
    // 前へ（逆順検索）
    const prevSlide = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PresenterView.useCallback[prevSlide]": ()=>{
            if (!flow || !currentNodeId) return;
            // 自分に向かっているエッジを探して戻る（簡易実装）
            const edge = flow.edges.find({
                "PresenterView.useCallback[prevSlide].edge": (e)=>e.target === currentNodeId
            }["PresenterView.useCallback[prevSlide].edge"]);
            if (edge) navigateTo(edge.source);
        }
    }["PresenterView.useCallback[prevSlide]"], [
        flow,
        currentNodeId,
        navigateTo
    ]);
    // 分岐処理（エッジのラベルで検索）
    const branchTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PresenterView.useCallback[branchTo]": (keywords)=>{
            if (!flow || !currentNodeId) return;
            const edges = flow.edges.filter({
                "PresenterView.useCallback[branchTo].edges": (e)=>e.source === currentNodeId
            }["PresenterView.useCallback[branchTo].edges"]);
            const target = edges.find({
                "PresenterView.useCallback[branchTo].target": (e)=>keywords.some({
                        "PresenterView.useCallback[branchTo].target": (k)=>e.label?.includes(k)
                    }["PresenterView.useCallback[branchTo].target"])
            }["PresenterView.useCallback[branchTo].target"]);
            if (target) {
                console.log("分岐しました:", target.label);
                navigateTo(target.target);
            }
        }
    }["PresenterView.useCallback[branchTo]"], [
        flow,
        currentNodeId,
        navigateTo
    ]);
    // ★追加: リアクションをデバッグする（N=One, M=Two）
    const [debugEmitClap, setDebugEmitClap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [debugEmitLaugh, setDebugEmitLaugh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // キーボード操作 (矢印キー対応 + ESCで戻る)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresenterView.useEffect": ()=>{
            if (!isPlaying) return;
            const handleKeyDown = {
                "PresenterView.useEffect.handleKeyDown": (e)=>{
                    // 追加: 線をクリア (R)
                    if (e.key === "r" || e.key === "R") {
                        setDrawingPoints([]);
                        isMouseDrawingRef.current = false;
                        wasWiiADownRef.current = false;
                        return;
                    }
                    // ペイントと消しゴムを切り替え (X) - Wiiボタンと同じ挙動
                    if (e.key === "x" || e.key === "X") {
                        // 押しっぱなしでON/OFFが暴れないように、リピートは無視
                        if (e.repeat) return;
                        setEraserMode({
                            "PresenterView.useEffect.handleKeyDown": (prev)=>{
                                const next = !prev;
                                if (next) {
                                    setEraserButtonName("X");
                                    setCursorPos({
                                        x: window.innerWidth / 2,
                                        y: window.innerHeight / 2
                                    });
                                } else {
                                    setEraserButtonName(null);
                                    setCursorPos(null);
                                }
                                return next;
                            }
                        }["PresenterView.useEffect.handleKeyDown"]);
                        return;
                    }
                    if (!e.repeat) {
                        if (e.key === "q" || e.key === "Q") {
                            playSound("q");
                            return;
                        }
                        if (e.key === "w" || e.key === "W") {
                            playSound("w");
                            return;
                        }
                        if (e.key === "e" || e.key === "E") {
                            playSound("e");
                            return;
                        }
                    }
                    // ★追加: リアクション（N / M）
                    // 押しっぱなしで増殖しないように repeat を無視
                    if (!e.repeat) {
                        if (e.key === "n" || e.key === "N") {
                            setDebugEmitClap(true);
                            queueMicrotask({
                                "PresenterView.useEffect.handleKeyDown": ()=>setDebugEmitClap(false)
                            }["PresenterView.useEffect.handleKeyDown"]); // 1回だけ発火
                            return;
                        }
                        if (e.key === "m" || e.key === "M") {
                            setDebugEmitLaugh(true);
                            queueMicrotask({
                                "PresenterView.useEffect.handleKeyDown": ()=>setDebugEmitLaugh(false)
                            }["PresenterView.useEffect.handleKeyDown"]); // 1回だけ発火
                            return;
                        }
                    }
                    // 既存: 分岐 1..9
                    if (e.key >= "1" && e.key <= "9") {
                        branchByNumberKey(e.key);
                        return;
                    }
                    if (e.key === "ArrowRight") {
                        if (!hasMultipleBranches) nextSlide();
                    }
                    if (e.key === "ArrowLeft") prevSlide();
                    // ESCキーで元の画面へ戻る（エディタ経由ならエディタへ）
                    if (e.key === "Escape") goBack();
                    // ★追加: CキーでIRカーソル切替
                    if ((e.key === "c" || e.key === "C") && !e.repeat) {
                        setIrCursorEnabled(!irCursorEnabled);
                        return;
                    }
                }
            }["PresenterView.useEffect.handleKeyDown"];
            window.addEventListener("keydown", handleKeyDown);
            return ({
                "PresenterView.useEffect": ()=>window.removeEventListener("keydown", handleKeyDown)
            })["PresenterView.useEffect"];
        }
    }["PresenterView.useEffect"], [
        isPlaying,
        nextSlide,
        prevSlide,
        goBack,
        branchByNumberKey,
        hasMultipleBranches,
        playSound,
        irCursorEnabled,
        setIrCursorEnabled
    ]);
    const effectiveProjectBindings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PresenterView.useMemo[effectiveProjectBindings]": ()=>{
            // プロジェクト全体の割当 + スライド別の割当（あれば上書き）を合成
            const combined = {
                ...flow?.projectBindings ?? {},
                ...currentNode?.data.bindings ?? {}
            };
            const merged = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeBindings"])(combined);
            console.log("PresenterView: effectiveProjectBindings updated", {
                flowBindings: flow?.projectBindings,
                slideBindings: currentNode?.data.bindings,
                merged
            });
            return merged;
        }
    }["PresenterView.useMemo[effectiveProjectBindings]"], [
        flow,
        currentNode
    ]);
    // --- プロジェクト全体バインドを適用してアクション実行 ---
    const runAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PresenterView.useCallback[runAction]": (act, btnName)=>{
            // 消しゴムモード中は、eraserアクション以外を無効化
            if (eraserMode && act.type !== "eraser") {
                return;
            }
            // ★デバッグ: アクション実行をログ出力
            console.log(`[WiiAction] Button: ${btnName || "unknown"}, Action:`, act);
            switch(act.type){
                case "next":
                    nextSlide();
                    return;
                case "prev":
                    prevSlide();
                    return;
                case "branchIndex":
                    // 1..9 を “分岐選択（数字キー）” と同じ挙動にする
                    branchByNumberKey(String(act.index));
                    return;
                case "branch":
                    {
                        // 既存互換: A/B/HOME は 1..3 にマップ
                        if (!hasMultipleBranches) return;
                        const map = {
                            A: "1",
                            B: "2",
                            HOME: "3"
                        };
                        const k = map[act.kind];
                        if (k) branchByNumberKey(k);
                        return;
                    }
                case "reaction":
                    // ReactionOverlay が pressed.One/Two を見ているので、ここでは何もしない
                    return;
                case "paint":
                    break;
                case "eraser":
                    // トグル式に切り替え（500msクールタイムで多重入力防止）
                    const nowEraser = Date.now();
                    if (nowEraser - lastEraserToggleTimeRef.current < 500) {
                        console.log("[Eraser] Ignoring rapid toggle");
                        return;
                    }
                    lastEraserToggleTimeRef.current = nowEraser;
                    if (eraserMode) {
                        // 解除
                        setEraserMode(false);
                        setEraserButtonName(null);
                        setCursorPos(null);
                    } else {
                        // ON
                        setEraserMode(true);
                        setEraserButtonName(btnName || "unknown");
                        // カーソルを画面中央に
                        setCursorPos({
                            x: window.innerWidth / 2,
                            y: window.innerHeight / 2
                        });
                    }
                    break;
                case "sound":
                    // 音声再生処理（outputDeviceに応じてPCまたはWiiで再生）
                    if (act.kind === "shot") playSound("q", act.outputDevice);
                    else if (act.kind === "oh") playSound("e", act.outputDevice);
                    else if (act.kind === "uxo") playSound("w", act.outputDevice);
                    return;
                case "remove":
                    // 描画を消去
                    setDrawingPoints([]);
                    isMouseDrawingRef.current = false;
                    wasWiiADownRef.current = false;
                    return;
                case "irSens":
                    // IRセンサーカーソルの切替（500msクールタイムで多重入力防止）
                    const nowIrSens = Date.now();
                    if (nowIrSens - lastIrSensToggleTimeRef.current < 500) {
                        console.log("[IRSens] Ignoring rapid toggle");
                        return;
                    }
                    lastIrSensToggleTimeRef.current = nowIrSens;
                    setIrCursorEnabled(!irCursorEnabled);
                    return;
                case "none":
                default:
                    return;
            }
        }
    }["PresenterView.useCallback[runAction]"], [
        nextSlide,
        prevSlide,
        branchByNumberKey,
        hasMultipleBranches,
        playSound,
        eraserMode,
        irCursorEnabled,
        setIrCursorEnabled
    ]);
    // ★修正: Wiiリモコンのボタン処理（isPlayingがtrueの時のみ動作）
    // pressed は「このフレームで押された瞬間」のボタンのみ含む（useWiiController側で処理済み）
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresenterView.useEffect": ()=>{
            if (!isPlaying) return;
            // pressedに含まれるボタンを全て処理（既に「押された瞬間」のみ抽出済み）
            for (const btn of Object.keys(pressed)){
                const isDown = pressed[btn];
                if (!isDown) continue;
                // ★デバッグ: ボタン押下検出をログ出力
                console.log(`[WiiPress] Button pressed: ${btn}`);
                const act = effectiveProjectBindings[btn] ?? {
                    type: "none"
                };
                // paint/eraser以外のアクションを実行
                if (act.type !== "paint" && act.type !== "eraser") {
                    runAction(act, btn);
                } else if (act.type === "eraser") {
                    // eraserボタンは常にトグル可能
                    runAction(act, btn);
                }
            }
        }
    }["PresenterView.useEffect"], [
        pressed,
        isPlaying,
        effectiveProjectBindings,
        runAction
    ]);
    // ★追加: リアクション検出（バインドベース）
    const shouldEmitClap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PresenterView.useMemo[shouldEmitClap]": ()=>{
            if (!isPlaying) return false;
            // 押されたボタンの中で、"clap" にバインドされているものがあるか？
            for (const btn of Object.keys(pressed)){
                const isDown = pressed[btn];
                if (!isDown) continue;
                const act = effectiveProjectBindings[btn];
                if (act?.type === "reaction" && act.kind === "clap") return true;
            }
            return false;
        }
    }["PresenterView.useMemo[shouldEmitClap]"], [
        pressed,
        effectiveProjectBindings,
        isPlaying
    ]);
    const shouldEmitLaugh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PresenterView.useMemo[shouldEmitLaugh]": ()=>{
            if (!isPlaying) return false;
            for (const btn of Object.keys(pressed)){
                const isDown = pressed[btn];
                if (!isDown) continue;
                const act = effectiveProjectBindings[btn];
                if (act?.type === "reaction" && act.kind === "laugh") return true;
            }
            return false;
        }
    }["PresenterView.useMemo[shouldEmitLaugh]"], [
        pressed,
        effectiveProjectBindings,
        isPlaying
    ]);
    // PAINTボタンの最後の入力時刻を記録
    const lastPaintInputTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const [shouldPaint, setShouldPaint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ★追加: IR Cursor をOFFにした瞬間に「Wii PAINT描画」を完全停止（残留 shouldPaint を潰す）
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresenterView.useEffect": ()=>{
            if (irCursorEnabled) return;
            // Wiiペイント系の状態を強制リセット
            setShouldPaint(false);
            setIsPainting(false);
            lastPaintInputTimeRef.current = 0;
            // もしWii描画の線が継続中なら区切る
            wasWiiADownRef.current = false;
            setDrawingPoints({
                "PresenterView.useEffect": (prev)=>prev.length > 0 && prev[prev.length - 1] !== null ? [
                        ...prev,
                        null
                    ] : prev
            }["PresenterView.useEffect"]);
        }
    }["PresenterView.useEffect"], [
        irCursorEnabled
    ]);
    // wiiState.buttonsをチェックして、現在PAINTボタンが押されているか継続的に監視
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresenterView.useEffect": ()=>{
            // ★重要: IR Cursor がOFFなら Wiiペイントは絶対に動かさない
            if (!isPlaying || !wiiState || eraserMode || !irCursorEnabled) {
                if (shouldPaint) {
                    setShouldPaint(false);
                    setIsPainting(false);
                }
                return;
            }
            // 現在押されているボタンの中にPAINTがあるかチェック
            let isPaintButtonPressed = false;
            for (const btn of Object.keys(wiiState.buttons)){
                const isDown = wiiState.buttons[btn];
                if (!isDown) continue;
                const act = effectiveProjectBindings[btn];
                if (act?.type === "paint") {
                    isPaintButtonPressed = true;
                    break;
                }
            }
            if (isPaintButtonPressed) {
                lastPaintInputTimeRef.current = Date.now();
                if (!shouldPaint) setShouldPaint(true);
                if (!isPainting) setIsPainting(true); // ★IR描画中もペンカーソル表示
            }
        }
    }["PresenterView.useEffect"], [
        wiiState,
        effectiveProjectBindings,
        isPlaying,
        eraserMode,
        irCursorEnabled,
        shouldPaint,
        isPainting
    ]);
    // 200msタイマーで描画状態をチェック
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresenterView.useEffect": ()=>{
            if (!isPlaying) {
                setShouldPaint(false);
                return;
            }
            const interval = setInterval({
                "PresenterView.useEffect.interval": ()=>{
                    const now = Date.now();
                    const paintElapsed = now - lastPaintInputTimeRef.current;
                    if (paintElapsed > 100 && shouldPaint) {
                        setShouldPaint(false);
                        setIsPainting(false); // ★追加: Wiiボタン描画終了時もペンカーソル解除
                        // 描画を終了
                        if (isMouseDrawingRef.current) {
                            isMouseDrawingRef.current = false;
                            setDrawingPoints({
                                "PresenterView.useEffect.interval": (prev)=>prev.length > 0 && prev[prev.length - 1] !== null ? [
                                        ...prev,
                                        null
                                    ] : prev
                            }["PresenterView.useEffect.interval"]);
                        }
                    }
                }
            }["PresenterView.useEffect.interval"], 50); // 50msごとにチェック
            return ({
                "PresenterView.useEffect": ()=>clearInterval(interval)
            })["PresenterView.useEffect"];
        }
    }["PresenterView.useEffect"], [
        isPlaying,
        shouldPaint
    ]);
    // --- 描画/消しゴムロジック (IRセンサー & PAINTボタン) ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresenterView.useEffect": ()=>{
            // IRカーソルOFFの場合はIR描画を無効化
            if (!irCursorEnabled) return;
            if (!wiiState || !wiiState.cursor) return;
            // ★IRカーソルON時：バックエンドから受信した正規化済みcursor座標のみを使用
            // ★重要：CSSでcursor: url("/pen.png") 0 0を使用しているため、
            // SetCursorPosはペン画像の左上（0,0）を動かす。
            // しかし描画はペン先の位置（例: 6, 28）で行う必要があるため、オフセットを加算。
            const PEN_TIP_OFFSET_X = 0; // pen.pngのペン先X座標（実際の画像に合わせて調整）
            const PEN_TIP_OFFSET_Y = 0; // pen.pngのペン先Y座標（実際の画像に合わせて調整）
            const pos = {
                x: wiiState.cursor.x * window.innerWidth + PEN_TIP_OFFSET_X,
                y: wiiState.cursor.y * window.innerHeight + PEN_TIP_OFFSET_Y
            };
            // 消しゴムモード中: IRでカーソルを移動
            if (eraserMode) {
                setCursorPos(pos);
                // AとBを同時押ししているかチェック
                const isAPressed = wiiState.buttons.A;
                const isBPressed = wiiState.buttons.B;
                if (isAPressed && isBPressed) {
                    // A+B同時押しで消去
                    setDrawingPoints({
                        "PresenterView.useEffect": (prev)=>{
                            const next = prev.slice();
                            if (!wasWiiADownRef.current) {
                                if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                            }
                            next.push({
                                ...pos,
                                mode: "erase"
                            });
                            return next;
                        }
                    }["PresenterView.useEffect"]);
                    wasWiiADownRef.current = true;
                } else {
                    // A+Bを離したら区切る
                    if (wasWiiADownRef.current) {
                        wasWiiADownRef.current = false;
                        setDrawingPoints({
                            "PresenterView.useEffect": (prev)=>prev.length > 0 && prev[prev.length - 1] !== null ? [
                                    ...prev,
                                    null
                                ] : prev
                        }["PresenterView.useEffect"]);
                    }
                }
                return;
            }
            // PAINTバインドされたボタンを押している間、軌跡を追加
            if (shouldPaint) {
                setDrawingPoints({
                    "PresenterView.useEffect": (prev)=>{
                        const next = prev.slice();
                        if (!wasWiiADownRef.current) {
                            // 前回の線と繋がらないように区切りを入れる
                            if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                        }
                        next.push({
                            ...pos,
                            mode: "draw"
                        });
                        return next;
                    }
                }["PresenterView.useEffect"]);
                wasWiiADownRef.current = true;
            } else {
                // 離したタイミングで区切る
                if (wasWiiADownRef.current) {
                    wasWiiADownRef.current = false;
                    setDrawingPoints({
                        "PresenterView.useEffect": (prev)=>prev.length > 0 && prev[prev.length - 1] !== null ? [
                                ...prev,
                                null
                            ] : prev
                    }["PresenterView.useEffect"]);
                }
            }
        }
    }["PresenterView.useEffect"], [
        wiiState,
        shouldPaint,
        irCursorEnabled
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        ref: containerRef,
        onMouseDown: (e)=>{
            if (!isPlaying) return;
            if (e.button !== 0) return;
            // UI(ボタン等)操作は邪魔しない
            const el = e.target;
            if (el && el.closest("button, a, input, textarea, select")) return;
            e.preventDefault();
            // 消しゴムモード中は左クリックで消去開始
            if (eraserMode) {
                isMouseDrawingRef.current = true;
                setIsPainting(false); // 消しゴムモード中はペンカーソルにしない
                setDrawingPoints((prev)=>{
                    const next = prev.slice();
                    if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                    next.push({
                        x: e.clientX,
                        y: e.clientY,
                        mode: "erase"
                    });
                    return next;
                });
                return;
            }
            // 通常モード：左クリックで描画開始
            isMouseDrawingRef.current = true;
            setIsPainting(true); // ペンカーソルに変更
            setDrawingPoints((prev)=>{
                const next = prev.slice();
                if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                next.push({
                    x: e.clientX,
                    y: e.clientY,
                    mode: "draw"
                });
                return next;
            });
        },
        onMouseMove: (e)=>{
            if (!isPlaying) return;
            // 消しゴムモード時：マウスでの消去（IRセンサーがない場合のフォールバック）
            if (eraserMode && isMouseDrawingRef.current) {
                e.preventDefault();
                setDrawingPoints((prev)=>{
                    const last = prev[prev.length - 1];
                    if (last && last.x && Math.abs(last.x - e.clientX) + Math.abs(last.y - e.clientY) < 2) return prev;
                    return [
                        ...prev,
                        {
                            x: e.clientX,
                            y: e.clientY,
                            mode: "erase"
                        }
                    ];
                });
                return;
            }
            // --- 通常モード：描画（マウス or Wii PAINT） ---
            // 1) マウスドラッグ中は常にマウス描画を優先
            if (isMouseDrawingRef.current) {
                e.preventDefault();
                setDrawingPoints((prev)=>{
                    const last = prev[prev.length - 1];
                    if (last && last.x && Math.abs(last.x - e.clientX) + Math.abs(last.y - e.clientY) < 2) return prev;
                    return [
                        ...prev,
                        {
                            x: e.clientX,
                            y: e.clientY,
                            mode: "draw"
                        }
                    ];
                });
                return;
            }
            // 2) WiiのPAINT（shouldPaint=true）の場合
            if (shouldPaint) {
                // ★重要：IR Cursor ON のときは「IR側useEffect」が点を追加する。
                // ここでマウス座標(e.clientX/Y)を混ぜると、別座標が混ざって線が伸びるので何もしない。
                if (irCursorEnabled) return;
                // ★IR Cursor OFF のときだけ「マウス座標で1点だけ描く」挙動を許可（仕様通りの挙動）
                e.preventDefault();
                setDrawingPoints((prev)=>{
                    const next = prev.slice();
                    if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                    next.push({
                        x: e.clientX,
                        y: e.clientY,
                        mode: "draw"
                    });
                    next.push(null); // ┅1本だけで必ず区切る
                    return next;
                });
                return;
            }
            // 3) 何もしてないなら何もしない
            return;
        },
        onMouseUp: ()=>{
            if (!isMouseDrawingRef.current) return;
            isMouseDrawingRef.current = false;
            setIsPainting(false); // ペンカーソル解除
            setDrawingPoints((prev)=>prev.length > 0 && prev[prev.length - 1] !== null ? [
                    ...prev,
                    null
                ] : prev);
        },
        onMouseLeave: ()=>{
            if (!isMouseDrawingRef.current) return;
            isMouseDrawingRef.current = false;
            setIsPainting(false); // ペンカーソル解除
            setDrawingPoints((prev)=>prev.length > 0 && prev[prev.length - 1] !== null ? [
                    ...prev,
                    null
                ] : prev);
        },
        className: isPainting ? 'presenter-painting' : 'presenter-container',
        style: {
            position: "relative",
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            background: "black"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$WiiDisconnectPopup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WiiDisconnectPopup"], {
                isPlaying: isPlaying,
                startedWithWii: startedWithWii,
                wiiConnected: wiiConnected,
                wiiDisconnectedAt: wiiDisconnectedAt,
                playingSince: playingSince
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 865,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$WiiReconnectPopup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WiiReconnectPopup"], {
                isPlaying: isPlaying,
                wiiConnected: wiiConnected,
                startedWithWii: startedWithWii
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 873,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    top: 20,
                    left: 20,
                    zIndex: 10000
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: goBack,
                    style: {
                        padding: "10px 14px",
                        fontSize: 14
                    },
                    children: returnLabel
                }, void 0, false, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                    lineNumber: 881,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 880,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$ReactionOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReactionOverlay"], {
                emitClap: shouldEmitClap,
                emitLaugh: shouldEmitLaugh
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 887,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$IrPointerOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IrPointerOverlay"], {
                wiiState: wiiState,
                isPlaying: isPlaying,
                irCursorEnabled: irCursorEnabled,
                showIrDebug: showIrDebug
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 890,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$SlideDisplay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SlideDisplay"], {
                currentNode: currentNode,
                error: error,
                getOrLoadPdfDocument: getOrLoadPdfDocument
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 898,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$DrawingCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DrawingCanvas"], {
                drawingPoints: drawingPoints,
                wiiState: wiiState,
                isPlaying: isPlaying,
                shouldPaint: shouldPaint,
                eraserMode: eraserMode,
                eraserPosition: cursorPos
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 905,
                columnNumber: 13
            }, this),
            showDebugPanel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$WiiDebugPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WiiDebugPanel"], {
                wiiState: wiiState,
                pressed: pressed,
                effectiveProjectBindings: effectiveProjectBindings,
                irCursorEnabled: irCursorEnabled,
                onToggleIrCursor: ()=>setIrCursorEnabled(!irCursorEnabled)
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 916,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 14,
                    pointerEvents: "none"
                },
                children: "[ESC] 戻る | [SPACE] デバッグ表示切替"
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 926,
                columnNumber: 13
            }, this),
            eraserMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    bottom: 80,
                    right: 20,
                    background: "rgba(255, 100, 100, 0.7)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: "normal",
                    zIndex: 9999,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    pointerEvents: "none"
                },
                children: [
                    "消しゴムモード ON",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                        lineNumber: 948,
                        columnNumber: 31
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                        style: {
                            fontSize: 11
                        },
                        children: [
                            "左クリックまたはA+Bで消去 | ",
                            eraserButtonName,
                            "で解除"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                        lineNumber: 949,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 932,
                columnNumber: 17
            }, this),
            eraserMode && cursorPos && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    left: cursorPos.x,
                    top: cursorPos.y,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    border: "3px dashed rgba(255, 100, 100, 0.8)",
                    background: "rgba(255, 100, 100, 0.2)",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                    zIndex: 10000
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 955,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
        lineNumber: 763,
        columnNumber: 9
    }, this);
}
_s(PresenterView, "MDtEPDKwx1Rs3qPl3PR7FESCJ7o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$hooks$2f$useWiiController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWiiController"]
    ];
});
_c = PresenterView;
var _c;
__turbopack_context__.k.register(_c, "PresenterView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_WiiSugeee_frontend_src_a009c505._.js.map