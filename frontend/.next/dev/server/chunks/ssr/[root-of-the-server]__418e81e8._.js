module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Desktop/WiiSugeee/frontend/src/lib/presentation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/Desktop/WiiSugeee/frontend/src/lib/idbAssets.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/Desktop/WiiSugeee/frontend/src/hooks/useWiiController.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWiiController",
    ()=>useWiiController
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
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
    const [wiiState, setWiiState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [wiiConnected, setWiiConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // ★追加: backendから来た切断イベントのタイムスタンプ（更新されるたびにポップアップを開く）
    const [wiiDisconnectedAt, setWiiDisconnectedAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // ★追加: 「一度でも正常に接続できていたか」を保持（接続失敗の誤爆防止）
    const wasConnectedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // 「このフレームで押された」情報（Wii + キーボード合成）
    const [pressed, setPressed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    // --- Wii から来る押下トリガー用 ---
    const pressedBufferRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const prevButtonsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastUpdateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    // --- キーボードの押下状態（ホールド） ---
    const kbButtonsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        ...EMPTY_BUTTONS
    });
    // キーボードの「このフレームで押された」
    const kbPressedBufferRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    // キーボードイベント購読
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onKeyDown = (e)=>{
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
        };
        const onKeyUp = (e)=>{
            const btn = keyToButton(e.key);
            if (!btn) return;
            kbButtonsRef.current = {
                ...kbButtonsRef.current,
                [btn]: false
            };
        };
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        return ()=>{
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, []);
    // WebSocket (Wii)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const ws = new WebSocket("ws://localhost:8080");
        ws.onopen = ()=>{
            console.log("Connected to Wii Server");
        };
        ws.onmessage = (event)=>{
            try {
                const msg = JSON.parse(event.data);
                if (msg && typeof msg === "object" && "type" in msg) {
                    const t = msg.type;
                    if (t === "status") {
                        const connected = !!msg.connected;
                        setWiiConnected(connected);
                        wasConnectedRef.current = connected; // ★追加
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
                const now = performance.now();
                setWiiConnected(true);
                wasConnectedRef.current = true; // ★追加: データが来ている=接続できている
                // Wii側の「押された瞬間」検知
                if (prevButtonsRef.current) {
                    Object.keys(data.buttons).forEach((key)=>{
                        if (data.buttons[key] && !prevButtonsRef.current[key]) {
                            pressedBufferRef.current[key] = true;
                        }
                    });
                }
                prevButtonsRef.current = data.buttons;
                // 更新頻度制限（ただし常に最新データを反映）
                const shouldUpdate = now - lastUpdateRef.current > 33;
                flushState(data);
                if (shouldUpdate) {
                    lastUpdateRef.current = now;
                }
            } catch (e) {
                console.error("Parse error:", e);
            }
        };
        // ★修正: 「接続中に切れた」場合だけ disconnect 扱いにする（接続失敗の誤爆防止）
        ws.onerror = ()=>{
            const wasConnected = wasConnectedRef.current;
            setWiiConnected(false);
            wasConnectedRef.current = false;
            if (wasConnected) {
                setWiiDisconnectedAt(Date.now());
            }
        };
        ws.onclose = ()=>{
            const wasConnected = wasConnectedRef.current;
            setWiiConnected(false);
            wasConnectedRef.current = false;
            if (wasConnected) {
                setWiiDisconnectedAt(Date.now());
            }
        };
        return ()=>{
            try {
                ws.close();
            } catch  {}
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // Wiiから来ない場合でも、キーボードの変化で state/pressed を更新するための tick
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let raf = 0;
        const loop = ()=>{
            flushState(null);
            raf = window.requestAnimationFrame(loop);
        };
        raf = window.requestAnimationFrame(loop);
        return ()=>window.cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
        // 「このフレームで押された」も合成して吐く
        const mergedPressed = {
            ...pressedBufferRef.current,
            ...kbPressedBufferRef.current
        };
        pressedBufferRef.current = {};
        kbPressedBufferRef.current = {};
        // accel/ir は Wii が無ければダミー
        const mergedState = {
            buttons: mergedButtons,
            accel: wiiDataOrNull?.accel ?? {
                x: 0,
                y: 0,
                z: 0
            },
            ir: wiiDataOrNull?.ir ?? []
        };
        setWiiState(mergedState);
        setPressed(mergedPressed);
    };
    return {
        wiiState,
        pressed,
        wiiConnected,
        wiiDisconnectedAt
    };
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ReactionOverlay.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReactionOverlay",
    ()=>ReactionOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function ReactionOverlay(props) {
    const { emitClap, emitLaugh } = props;
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (emitClap) add("clap");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        emitClap
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (emitLaugh) add("laugh");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        emitLaugh
    ]);
    // 掃除
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const t = setInterval(()=>{
            const now = Date.now();
            setItems((prev)=>prev.filter((r)=>now - r.createdAt < r.durationMs + 250));
        }, 250);
        return ()=>clearInterval(t);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
        children: items.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReactionItem, {
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
function ReactionItem({ r }) {
    const glyph = r.type === "clap" ? "👏" : "😆";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].dynamic([
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
}),
"[project]/Desktop/WiiSugeee/frontend/src/lib/buttonBindings.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_BINDINGS",
    ()=>DEFAULT_BINDINGS,
    "decodeAction",
    ()=>decodeAction,
    "encodeAction",
    ()=>encodeAction,
    "formatAction",
    ()=>formatAction,
    "mergeBindings",
    ()=>mergeBindings
]);
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
        case "sound":
            switch(a.kind){
                case "shot":
                    return "SHOT🔊";
                case "oh":
                    return "Oh...🔊";
                case "uxo":
                    return "Uxo~🔊";
            }
        case "remove":
            return "REMOVE";
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
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WiiDebugPanel",
    ()=>WiiDebugPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/buttonBindings.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function WiiDebugPanel({ wiiState, pressed, effectiveProjectBindings }) {
    // 表示用の値を保持
    const [displayAccel, setDisplayAccel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0,
        z: 0
    });
    const displayIrCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const displayButtonsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])("(none)");
    const displayBindingsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const lastAccelUpdateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    // 加速度センサーの更新（200msごとに更新）
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
            setDisplayAccel((prev)=>{
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
            });
        }
    }, [
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
    entries.sort((a, b)=>a[0].localeCompare(b[0]));
    const currentBindings = entries.map(([btn, action])=>`${btn.padEnd(8)} → ${action ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatAction"])(action) : "(unassigned)"}`);
    const prevBindings = displayBindingsRef.current;
    const hasChanged = currentBindings.length !== prevBindings.length || currentBindings.some((line, i)=>line !== prevBindings[i]);
    if (hasChanged) {
        displayBindingsRef.current = currentBindings;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            pointerEvents: "none",
            minWidth: 360,
            whiteSpace: "pre",
            lineHeight: 1.35,
            border: "1px solid rgba(255,255,255,0.12)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontWeight: 800,
                    color: "#a7f3d0",
                    marginBottom: 8
                },
                children: "Wii Debug"
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 107,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                lineNumber: 108,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    color: "rgba(209,250,229,0.9)"
                },
                children: [
                    "IR : ",
                    displayIrCountRef.current
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 113,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    color: "rgba(209,250,229,0.9)"
                },
                children: `Btn: ${displayButtonsRef.current}`
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 114,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    margin: "10px 0",
                    borderTop: "1px solid rgba(255,255,255,0.12)"
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 115,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontWeight: 800,
                    color: "#a7f3d0",
                    marginBottom: 6
                },
                children: "Bindings (project)"
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 116,
                columnNumber: 4
            }, this),
            displayBindingsRef.current.map((line)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: line
                }, line, false, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                    lineNumber: 118,
                    columnNumber: 5
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
        lineNumber: 87,
        columnNumber: 3
    }, this);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/lib/projectBindingsStorage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/Desktop/WiiSugeee/frontend/src/lib/currentProjectStore.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCurrentFlow",
    ()=>getCurrentFlow,
    "getCurrentProjectId",
    ()=>getCurrentProjectId,
    "getProjectBindings",
    ()=>getProjectBindings,
    "setCurrentFlow",
    ()=>setCurrentFlow,
    "setCurrentProjectId",
    ()=>setCurrentProjectId,
    "setProjectBindings",
    ()=>setProjectBindings,
    "subscribeCurrentFlow",
    ()=>subscribeCurrentFlow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectBindingsStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/projectBindingsStorage.ts [app-ssr] (ecmascript)");
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
        const stored = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined;
        currentFlow = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : flow;
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
    if (currentFlow?.projectBindings) return currentFlow.projectBindings;
    if ("TURBOPACK compile-time truthy", 1) return undefined;
    //TURBOPACK unreachable
    ;
}
function setProjectBindings(bindings) {
    // ★修正: currentFlowが無くても保存はできる
    if (currentFlow) {
        currentFlow = {
            ...currentFlow,
            projectBindings: bindings
        };
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    for (const l of listeners)l();
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WiiDisconnectPopup",
    ()=>WiiDisconnectPopup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function WiiDisconnectPopup({ isPlaying, startedWithWii, wiiConnected, wiiDisconnectedAt, playingSince }) {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // ★変更: 「発表中」かつ「開始時に接続していた」場合のみ、切断イベントで開く
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isPlaying) return;
        if (!startedWithWii) return;
        if (!wiiDisconnectedAt) return;
        // ★追加: 再生開始後に起きた切断だけを対象にする（開始前の切断イベントを無視）
        if (wiiDisconnectedAt < playingSince) return;
        setOpen(true);
    }, [
        isPlaying,
        startedWithWii,
        wiiDisconnectedAt,
        playingSince
    ]);
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 30,
                        fontWeight: 800,
                        marginBottom: 10
                    },
                    children: "Wiiリモコンの接続が切れました"
                }, void 0, false, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
                    lineNumber: 69,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 16,
                        opacity: 0.9,
                        lineHeight: 1.6
                    },
                    children: [
                        "接続（Bluetooth/電池）を確認してください。",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
                            lineNumber: 73,
                            columnNumber: 47
                        }, this),
                        "キーボード操作（←/→）は引き続き利用できます。"
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
                    lineNumber: 72,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginTop: 16,
                        display: "flex",
                        justifyContent: "center",
                        gap: 12
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setOpen(false),
                        style: {
                            padding: "10px 16px",
                            fontSize: 16
                        },
                        children: "閉じる"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
                        lineNumber: 78,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
                    lineNumber: 77,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
            lineNumber: 57,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
        lineNumber: 41,
        columnNumber: 9
    }, this);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PresenterView",
    ()=>PresenterView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/presentation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/idbAssets.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$hooks$2f$useWiiController$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/hooks/useWiiController.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$ReactionOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ReactionOverlay.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$WiiDebugPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/buttonBindings.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$currentProjectStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/currentProjectStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$WiiDisconnectPopup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx [app-ssr] (ecmascript)");
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx")}`;
    }
};
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
function PdfSlide(props) {
    const { assetId, page, fallbackDataUrl, alt, getOrLoadPdfDocument } = props;
    const wrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [size, setSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [renderError, setRenderError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const renderTaskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null); // ★追加: レンダリングタスクの参照を保持
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const el = wrapperRef.current;
        if (!el) return;
        const update = ()=>{
            const rect = el.getBoundingClientRect();
            setSize({
                w: Math.max(0, rect.width),
                h: Math.max(0, rect.height)
            });
        };
        update();
        const ro = new ResizeObserver(()=>update());
        ro.observe(el);
        return ()=>ro.disconnect();
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        (async ()=>{
            try {
                setRenderError(null);
                const el = wrapperRef.current;
                const canvas = canvasRef.current;
                if (!el || !canvas || !size || size.w === 0 || size.h === 0) return;
                // ★追加: 既存のレンダリングをキャンセル
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
                const dpr = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 1;
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
                // ★修正: renderタスクを保持し、cleanupでcancelできるようにする
                const task = pdfPage.render({
                    canvasContext: ctx,
                    canvas,
                    viewport: renderViewport
                });
                renderTaskRef.current = task;
                await task.promise;
                // 完了したら参照を外す
                if (renderTaskRef.current === task) {
                    renderTaskRef.current = null;
                }
            } catch (e) {
                // cancelは正常系として無視
                const msg = e?.name === "RenderingCancelledException" ? null : e instanceof Error ? e.message : String(e);
                if (!cancelled && msg) setRenderError(msg);
            }
        })();
        return ()=>{
            cancelled = true;
            // ★追加: effect cleanupで進行中renderを必ず止める
            if (renderTaskRef.current) {
                try {
                    renderTaskRef.current.cancel();
                    renderTaskRef.current = null;
                } catch  {
                // 既にキャンセル済みの場合は無視
                }
            }
        };
    }, [
        assetId,
        getOrLoadPdfDocument,
        page,
        size
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: wrapperRef,
        style: {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        children: renderError && fallbackDataUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: fallbackDataUrl,
            style: {
                width: "100%",
                height: "100%",
                objectFit: "contain"
            },
            alt: alt
        }, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
            lineNumber: 120,
            columnNumber: 5
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
            ref: canvasRef,
            "aria-label": alt
        }, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
            lineNumber: 122,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
        lineNumber: 115,
        columnNumber: 3
    }, this);
}
function VideoSlide(props) {
    const { assetId, alt } = props;
    const [src, setSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let active = true;
        let url = null;
        (async ()=>{
            try {
                setError(null);
                setSrc(null);
                const blob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAssetBlob"])(assetId);
                if (!blob) throw new Error("動画アセットが見つかりません (IndexedDB)");
                url = URL.createObjectURL(blob);
                if (!active) return;
                setSrc(url);
            } catch (e) {
                if (!active) return;
                setError(e instanceof Error ? e.message : String(e));
            }
        })();
        return ()=>{
            active = false;
            if (url) URL.revokeObjectURL(url);
        };
    }, [
        assetId
    ]);
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                color: "white",
                textAlign: "center"
            },
            children: [
                "動画の読み込みに失敗しました: ",
                error
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
            lineNumber: 157,
            columnNumber: 10
        }, this);
    }
    if (!src) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                color: "white",
                textAlign: "center"
            },
            children: "動画を読み込み中..."
        }, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
            lineNumber: 160,
            columnNumber: 10
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
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
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
        lineNumber: 164,
        columnNumber: 3
    }, this);
}
// IRカメラの座標(0-1023)を画面座標に変換する関数
function mapIrToScreen(irX, irY, screenW, screenH) {
    // WiiリモコンのIRは視点が逆になることがあるため、必要に応じて 1 - ... を調整してください
    const x = (1 - irX / 1024) * screenW;
    const y = irY / 768 * screenH;
    return {
        x,
        y
    };
}
function PresenterView() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isMouseDrawingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const soundboardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const playSound = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((key)=>{
        const a = soundboardRef.current[key];
        if (!a) return;
        try {
            a.currentTime = 0;
            void a.play();
        } catch (err) {
            console.warn("sound play failed", key, err);
        }
    }, []);
    const returnTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return searchParams.get("from") === "editor" ? "/editor" : "/";
    }, [
        searchParams
    ]);
    const returnLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return returnTo === "/editor" ? "エディタに戻る" : "ホームに戻る";
    }, [
        returnTo
    ]);
    const goBack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        router.push(returnTo);
    }, [
        router,
        returnTo
    ]);
    // Wiiリモコンの状態を取得
    const { wiiState, pressed, wiiConnected, wiiDisconnectedAt } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$hooks$2f$useWiiController$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWiiController"])();
    const [flow, setFlow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentNodeId, setCurrentNodeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [startedWithWii, setStartedWithWii] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [playingSince, setPlayingSince] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const pdfDocCacheRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    // ★修正: 常にplaying状態として扱う（flow/currentNodeIdがあれば再生中）
    const isPlaying = flow != null && currentNodeId != null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        return ()=>{
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
        };
    }, []);
    const getOrLoadPdfDocument = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (assetId)=>{
        const cached = pdfDocCacheRef.current.get(assetId);
        if (cached) return await cached;
        const promise = (async ()=>{
            const blob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAssetBlob"])(assetId);
            if (!blob) throw new Error("PDFアセットが見つかりません (IndexedDB)");
            const arrayBuffer = await blob.arrayBuffer();
            const pdfjs = await __turbopack_context__.A("[project]/Desktop/WiiSugeee/frontend/node_modules/pdfjs-dist/legacy/build/pdf.mjs [app-ssr] (ecmascript, async loader)");
            pdfjs.GlobalWorkerOptions.workerSrc = new __turbopack_context__.U(__turbopack_context__.r("[project]/Desktop/WiiSugeee/frontend/node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs (static in ecmascript)")).toString();
            return await pdfjs.getDocument({
                data: arrayBuffer
            }).promise;
        })();
        pdfDocCacheRef.current.set(assetId, promise);
        try {
            return await promise;
        } catch (e) {
            pdfDocCacheRef.current.delete(assetId);
            throw e;
        }
    }, []);
    // お絵描き用の座標リスト
    const [drawingPoints, setDrawingPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const wasWiiADownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // 連続遷移を防ぐためのクールタイム管理
    const lastNavTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    // 現在のノードデータ
    const currentNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>flow?.nodes.find((n)=>n.id === currentNodeId), [
        flow,
        currentNodeId
    ]);
    // ★修正: 初回マウント時に自動的にプレゼンテーションを開始
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loaded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadFromLocalStorage"])();
        if (!loaded || loaded.nodes.length === 0) {
            setError("データが見つかりません。Editorで作成してください。");
            setFlow(null);
            setCurrentNodeId(null);
            return;
        }
        // バインド設定を読み込み
        const storedBindings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$currentProjectStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProjectBindings"])();
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
        const startNode = loaded.nodes.find((n)=>n.data.label === "Start") || loaded.nodes[0];
        setCurrentNodeId(startNode.id);
        // Wii接続状態を記録
        setStartedWithWii(!!wiiConnected);
        setPlayingSince(Date.now());
    }, []); // ★空の依存配列で初回のみ実行
    // ★修正: wiiConnectedが変化したら記録を更新
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (wiiConnected) setStartedWithWii(true);
    }, [
        wiiConnected
    ]);
    const outgoingEdges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!flow || !currentNodeId) return [];
        return flow.edges.filter((e)=>e.source === currentNodeId);
    }, [
        flow,
        currentNodeId
    ]);
    const branchOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
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
    }, [
        outgoingEdges
    ]);
    const hasMultipleBranches = outgoingEdges.length >= 2;
    // ノード移動処理
    const navigateTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((nodeId)=>{
        // クールタイムチェック (500ms以内の連続遷移は無視)
        const now = Date.now();
        if (now - lastNavTime.current < 500) return;
        lastNavTime.current = now;
        setCurrentNodeId(nodeId);
        setDrawingPoints([]); // スライドが変わったら線を消す
    }, []);
    // 次へ（ロジック改良版）
    const nextSlide = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!flow || !currentNodeId) return;
        // 分岐が複数ある場合は、数字選択を優先する
        const edges = flow.edges.filter((e)=>e.source === currentNodeId);
        if (edges.length >= 2) return;
        // 現在のノードから出ているエッジをすべて取得
        // (上で取得済み)
        if (edges.length === 0) return;
        // 優先順位付け
        // 1. ラベルがないエッジ (デフォルトルート)
        // 2. ラベルが "next" のエッジ
        // 3. それ以外 (最初に見つかったもの)
        const targetEdge = edges.find((e)=>!e.label || e.label.trim() === "") || edges.find((e)=>e.label === "next") || edges[0];
        if (targetEdge) navigateTo(targetEdge.target);
    }, [
        flow,
        currentNodeId,
        navigateTo
    ]);
    const branchByNumberKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((key)=>{
        if (!hasMultipleBranches) return;
        const opt = branchOptions.find((o)=>o.key === key);
        if (opt) navigateTo(opt.target);
    }, [
        branchOptions,
        hasMultipleBranches,
        navigateTo
    ]);
    // 前へ（逆順検索）
    const prevSlide = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!flow || !currentNodeId) return;
        // 自分に向かっているエッジを探して戻る（簡易実装）
        const edge = flow.edges.find((e)=>e.target === currentNodeId);
        if (edge) navigateTo(edge.source);
    }, [
        flow,
        currentNodeId,
        navigateTo
    ]);
    // 分岐処理（エッジのラベルで検索）
    const branchTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((keywords)=>{
        if (!flow || !currentNodeId) return;
        const edges = flow.edges.filter((e)=>e.source === currentNodeId);
        const target = edges.find((e)=>keywords.some((k)=>e.label?.includes(k)));
        if (target) {
            console.log("分岐しました:", target.label);
            navigateTo(target.target);
        }
    }, [
        flow,
        currentNodeId,
        navigateTo
    ]);
    // ★追加: リアクションをデバッグする（N=One, M=Two）
    const [debugEmitClap, setDebugEmitClap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [debugEmitLaugh, setDebugEmitLaugh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // キーボード操作 (矢印キー対応 + ESCで戻る)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isPlaying) return;
        const handleKeyDown = (e)=>{
            // 追加: 線をクリア (R)
            if (e.key === "r" || e.key === "R") {
                setDrawingPoints([]);
                isMouseDrawingRef.current = false;
                wasWiiADownRef.current = false;
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
                    queueMicrotask(()=>setDebugEmitClap(false)); // 1回だけ発火
                    return;
                }
                if (e.key === "m" || e.key === "M") {
                    setDebugEmitLaugh(true);
                    queueMicrotask(()=>setDebugEmitLaugh(false)); // 1回だけ発火
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
        };
        window.addEventListener("keydown", handleKeyDown);
        return ()=>window.removeEventListener("keydown", handleKeyDown);
    }, [
        isPlaying,
        nextSlide,
        prevSlide,
        goBack,
        branchByNumberKey,
        hasMultipleBranches,
        playSound
    ]);
    const effectiveProjectBindings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const merged = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeBindings"])(flow?.projectBindings);
        console.log("PresenterView: effectiveProjectBindings updated", {
            flowBindings: flow?.projectBindings,
            merged
        });
        return merged;
    }, [
        flow
    ]);
    // --- プロジェクト全体バインドを適用してアクション実行 ---
    const runAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((a)=>{
        switch(a.type){
            case "next":
                nextSlide();
                return;
            case "prev":
                prevSlide();
                return;
            case "branchIndex":
                // 1..9 を “分岐選択（数字キー）” と同じ挙動にする
                branchByNumberKey(String(a.index));
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
                    const k = map[a.kind];
                    if (k) branchByNumberKey(k);
                    return;
                }
            case "reaction":
                // ReactionOverlay が pressed.One/Two を見ているので、ここでは何もしない
                return;
            case "paint":
                // shouldPaintで別途処理するので、ここでは何もしない
                return;
            case "sound":
                // 音声再生処理
                if (a.kind === "shot") playSound("q");
                else if (a.kind === "oh") playSound("e");
                else if (a.kind === "uxo") playSound("w");
                return;
            case "remove":
                // 描画を消去
                setDrawingPoints([]);
                isMouseDrawingRef.current = false;
                wasWiiADownRef.current = false;
                return;
            case "none":
            default:
                return;
        }
    }, [
        nextSlide,
        prevSlide,
        branchByNumberKey,
        hasMultipleBranches,
        playSound
    ]);
    // ★修正: Wiiリモコンのボタン処理（isPlayingがtrueの時のみ動作）
    const prevPressedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isPlaying) return;
        // そのフレームで「押された瞬間」のボタンだけ処理（押しっぱなしで連打しない）
        const prevPressed = prevPressedRef.current;
        for (const btn of Object.keys(pressed)){
            const isDown = pressed[btn];
            const wasDown = !!prevPressed[btn];
            if (!isDown || wasDown) continue;
            const act = effectiveProjectBindings[btn] ?? {
                type: "none"
            };
            runAction(act);
        }
        prevPressedRef.current = {
            ...pressed
        };
    }, [
        pressed,
        isPlaying,
        effectiveProjectBindings,
        runAction
    ]);
    // ★追加: リアクション検出（バインドベース）
    const shouldEmitClap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!isPlaying) return false;
        // 押されたボタンの中で、"clap" にバインドされているものがあるか？
        for (const btn of Object.keys(pressed)){
            const isDown = pressed[btn];
            if (!isDown) continue;
            const act = effectiveProjectBindings[btn];
            if (act?.type === "reaction" && act.kind === "clap") return true;
        }
        return false;
    }, [
        pressed,
        effectiveProjectBindings,
        isPlaying
    ]);
    const shouldEmitLaugh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!isPlaying) return false;
        for (const btn of Object.keys(pressed)){
            const isDown = pressed[btn];
            if (!isDown) continue;
            const act = effectiveProjectBindings[btn];
            if (act?.type === "reaction" && act.kind === "laugh") return true;
        }
        return false;
    }, [
        pressed,
        effectiveProjectBindings,
        isPlaying
    ]);
    // PAINTボタンの最後の入力時刻を記録
    const lastPaintInputTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const [shouldPaint, setShouldPaint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // wiiState.buttonsをチェックして、現在PAINTボタンが押されているか継続的に監視
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isPlaying || !wiiState) return;
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
            setShouldPaint(true);
        }
    }, [
        wiiState,
        effectiveProjectBindings,
        isPlaying
    ]);
    // 200msタイマーで描画状態をチェック
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isPlaying) {
            setShouldPaint(false);
            return;
        }
        const interval = setInterval(()=>{
            const now = Date.now();
            const elapsed = now - lastPaintInputTimeRef.current;
            if (elapsed > 100 && shouldPaint) {
                setShouldPaint(false);
                // 描画を終了
                if (isMouseDrawingRef.current) {
                    isMouseDrawingRef.current = false;
                    setDrawingPoints((prev)=>prev.length > 0 && prev[prev.length - 1] !== null ? [
                            ...prev,
                            null
                        ] : prev);
                }
            }
        }, 50); // 50msごとにチェック
        return ()=>clearInterval(interval);
    }, [
        isPlaying,
        shouldPaint
    ]);
    // --- 描画ロジック (IRセンサー & PAINTボタン) ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        // キャンバスサイズをウィンドウに合わせる
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        // 画面クリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 既存の線を描画
        ctx.lineWidth = 5;
        ctx.strokeStyle = "red";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        if (drawingPoints.length > 1) {
            let started = false;
            for (const p of drawingPoints){
                if (!p) {
                    if (started) {
                        ctx.stroke();
                        started = false;
                    }
                    continue;
                }
                if (!started) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    started = true;
                } else {
                    ctx.lineTo(p.x, p.y);
                }
            }
            if (started) ctx.stroke();
        }
        // IRポインター処理
        if (wiiState && wiiState.ir.length > 0) {
            // IRの1点目を使用
            const dot = wiiState.ir[0];
            // 座標変換
            const pos = mapIrToScreen(dot.x, dot.y, window.innerWidth, window.innerHeight);
            // カーソル描画
            ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
            ctx.fill();
            // PAINTバインドされたボタンを押している間、軌跡を追加
            if (shouldPaint) {
                setDrawingPoints((prev)=>{
                    const next = prev.slice();
                    if (!wasWiiADownRef.current) {
                        // 前回の線と繋がらないように区切りを入れる
                        if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                    }
                    next.push(pos);
                    return next;
                });
                wasWiiADownRef.current = true;
            } else {
                // 離したタイミングで区切る
                if (wasWiiADownRef.current) {
                    wasWiiADownRef.current = false;
                    setDrawingPoints((prev)=>prev.length > 0 && prev[prev.length - 1] !== null ? [
                            ...prev,
                            null
                        ] : prev);
                }
            }
        }
    }, [
        wiiState,
        drawingPoints,
        shouldPaint
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        ref: containerRef,
        onMouseDown: (e)=>{
            if (!isPlaying) return;
            if (e.button !== 0) return;
            // UI(ボタン等)操作は邪魔しない
            const el = e.target;
            if (el && el.closest("button, a, input, textarea, select")) return;
            e.preventDefault();
            isMouseDrawingRef.current = true;
            setDrawingPoints((prev)=>{
                const next = prev.slice();
                if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                next.push({
                    x: e.clientX,
                    y: e.clientY
                });
                return next;
            });
        },
        onMouseMove: (e)=>{
            if (!isPlaying) return;
            // PAINTボタンが押されている場合も描画
            const shouldDrawWithPaint = shouldPaint;
            if (!isMouseDrawingRef.current && !shouldDrawWithPaint) return;
            // PAINTボタンで描画開始
            if (shouldDrawWithPaint && !isMouseDrawingRef.current) {
                isMouseDrawingRef.current = true;
                setDrawingPoints((prev)=>{
                    const next = prev.slice();
                    if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                    next.push({
                        x: e.clientX,
                        y: e.clientY
                    });
                    return next;
                });
                return;
            }
            e.preventDefault();
            setDrawingPoints((prev)=>{
                const last = prev[prev.length - 1];
                if (last && Math.abs(last.x - e.clientX) + Math.abs(last.y - e.clientY) < 2) return prev;
                return [
                    ...prev,
                    {
                        x: e.clientX,
                        y: e.clientY
                    }
                ];
            });
        },
        onMouseUp: ()=>{
            if (!isMouseDrawingRef.current) return;
            isMouseDrawingRef.current = false;
            setDrawingPoints((prev)=>prev.length > 0 && prev[prev.length - 1] !== null ? [
                    ...prev,
                    null
                ] : prev);
        },
        onMouseLeave: ()=>{
            if (!isMouseDrawingRef.current) return;
            isMouseDrawingRef.current = false;
            setDrawingPoints((prev)=>prev.length > 0 && prev[prev.length - 1] !== null ? [
                    ...prev,
                    null
                ] : prev);
        },
        style: {
            position: "relative",
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            background: "black"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$WiiDisconnectPopup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WiiDisconnectPopup"], {
                isPlaying: isPlaying,
                startedWithWii: startedWithWii,
                wiiConnected: wiiConnected,
                wiiDisconnectedAt: wiiDisconnectedAt,
                playingSince: playingSince
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 769,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    top: 20,
                    left: 20,
                    zIndex: 10000
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: goBack,
                    style: {
                        padding: "10px 14px",
                        fontSize: 14
                    },
                    children: returnLabel
                }, void 0, false, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                    lineNumber: 779,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 778,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$ReactionOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReactionOverlay"], {
                emitClap: shouldEmitClap,
                emitLaugh: shouldEmitLaugh
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 785,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                },
                children: currentNode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: currentNode.data.asset?.kind === "pdf" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PdfSlide, {
                        assetId: currentNode.data.asset.assetId,
                        page: currentNode.data.asset.page ?? 1,
                        fallbackDataUrl: currentNode.data.asset.thumbnailDataUrl,
                        alt: currentNode.data.label,
                        getOrLoadPdfDocument: getOrLoadPdfDocument
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                        lineNumber: 792,
                        columnNumber: 29
                    }, this) : currentNode.data.asset?.kind === "video" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VideoSlide, {
                        assetId: currentNode.data.asset.assetId,
                        alt: currentNode.data.label
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                        lineNumber: 800,
                        columnNumber: 29
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        style: {
                            fontSize: 80,
                            color: "white",
                            textAlign: "center",
                            maxWidth: "80%"
                        },
                        children: currentNode.data.label
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                        lineNumber: 802,
                        columnNumber: 29
                    }, this)
                }, void 0, false) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        color: "white"
                    },
                    children: error ?? "スライドデータがありません"
                }, void 0, false, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                    lineNumber: 808,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 788,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none"
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 813,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$WiiDebugPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WiiDebugPanel"], {
                wiiState: wiiState,
                pressed: pressed,
                effectiveProjectBindings: effectiveProjectBindings
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 819,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 14,
                    pointerEvents: "none"
                },
                children: "[ESC] 戻る"
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 826,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
        lineNumber: 709,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__418e81e8._.js.map