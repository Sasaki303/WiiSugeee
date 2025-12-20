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
const KEY_TO_BUTTON = {
    i: "Up",
    j: "Left",
    k: "Down",
    l: "Right",
    ";": "Plus",
    "-": "Minus",
    h: "Home",
    o: "A",
    p: "B",
    n: "One",
    m: "Two"
};
function keyToButton(key) {
    const k = key.length === 1 ? key.toLowerCase() : key;
    return KEY_TO_BUTTON[k] ?? null;
}
function useWiiController() {
    const [wiiState, setWiiState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [wiiConnected, setWiiConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [wiiDisconnectedAt, setWiiDisconnectedAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [irCursorEnabled, setIrCursorEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pressed, setPressed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const wasConnectedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const wsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pressedBufferRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const prevButtonsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const latestWiiDataRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pendingPressedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const kbButtonsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        ...EMPTY_BUTTONS
    });
    const kbPressedBufferRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onKeyDown = (e)=>{
            if (e.repeat) return;
            const btn = keyToButton(e.key);
            if (!btn) return;
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const ws = new WebSocket("ws://localhost:8080");
        wsRef.current = ws;
        ws.onopen = ()=>console.log("Connected to Wii Server");
        ws.onmessage = (event)=>{
            try {
                const msg = JSON.parse(event.data);
                if (msg && typeof msg === "object" && "type" in msg) {
                    const typedMsg = msg;
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
                const data = msg;
                setWiiConnected(true);
                wasConnectedRef.current = true;
                if (prevButtonsRef.current) {
                    Object.keys(data.buttons).forEach((key)=>{
                        if (data.buttons[key] && !prevButtonsRef.current[key]) {
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
        const handleDisconnect = ()=>{
            const wasConnected = wasConnectedRef.current;
            setWiiConnected(false);
            wasConnectedRef.current = false;
            if (wasConnected) {
                setWiiDisconnectedAt(Date.now());
            }
        };
        ws.onerror = handleDisconnect;
        ws.onclose = handleDisconnect;
        return ()=>{
            try {
                ws.close();
            } catch  {}
            wsRef.current = null;
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let raf = 0;
        const flushState = (wiiDataOrNull)=>{
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
            for (const key of Object.keys(pressedBufferRef.current)){
                pendingPressedRef.current[key] = true;
            }
            for (const key of Object.keys(kbPressedBufferRef.current)){
                pendingPressedRef.current[key] = true;
            }
            pressedBufferRef.current = {};
            kbPressedBufferRef.current = {};
            const mergedPressed = {
                ...pendingPressedRef.current
            };
            pendingPressedRef.current = {};
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
        const loop = ()=>{
            flushState(latestWiiDataRef.current);
            raf = window.requestAnimationFrame(loop);
        };
        raf = window.requestAnimationFrame(loop);
        return ()=>window.cancelAnimationFrame(raf);
    }, []);
    const playWiiSound = (soundType)=>{
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        try {
            wsRef.current.send(JSON.stringify({
                type: "playSound",
                soundType
            }));
        } catch (e) {
            console.error("Failed to send playSound message:", e);
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
        playWiiSound
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
const SCALE = 3.5;
function ReactionOverlay(props) {
    const { emitClap, emitLaugh } = props;
    const scale = props.scale ?? 1;
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const add = (type)=>{
        const now = Date.now();
        const baseSize = 26 + Math.floor(Math.random() * 18);
        const r = {
            id: `${now}-${Math.random().toString(16).slice(2)}`,
            type,
            createdAt: now,
            x: 0.65 + Math.random() * 0.3,
            size: Math.round(baseSize * scale),
            durationMs: 1200 + Math.floor(Math.random() * 700),
            rotateDeg: -10 + Math.random() * 20
        };
        setItems((prev)=>[
                ...prev,
                r
            ]);
    };
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
            right: 24 * scale,
            bottom: 24 * scale,
            width: 240 * scale,
            height: 280 * scale,
            pointerEvents: "none",
            overflow: "hidden",
            zIndex: 10001
        },
        children: items.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReactionItem, {
                r: r,
                scale: scale
            }, r.id, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ReactionOverlay.tsx",
                lineNumber: 75,
                columnNumber: 17
            }, this))
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ReactionOverlay.tsx",
        lineNumber: 61,
        columnNumber: 9
    }, this);
}
function ReactionItem({ r, scale }) {
    const glyph = r.type === "clap" ? "👏" : "😆";
    const shadowV = 8 * scale;
    const shadowBlur = 12 * scale;
    const startY = 14 * scale;
    const endY = 170 * scale;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "absolute",
            bottom: 0,
            left: `${Math.round(r.x * 100)}%`,
            fontSize: r.size,
            transform: `translateX(-50%) rotate(${r.rotateDeg}deg)`,
            willChange: "transform, opacity",
            animation: `reaction-float ${r.durationMs}ms ease-out forwards`,
            filter: `drop-shadow(0 ${shadowV}px ${shadowBlur}px rgba(0,0,0,0.35))`,
            userSelect: "none"
        },
        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].dynamic([
            [
                "ccf32660b49c5178",
                [
                    startY,
                    r.rotateDeg,
                    r.rotateDeg,
                    endY,
                    r.rotateDeg
                ]
            ]
        ]),
        children: [
            glyph,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "ccf32660b49c5178",
                dynamic: [
                    startY,
                    r.rotateDeg,
                    r.rotateDeg,
                    endY,
                    r.rotateDeg
                ],
                children: `@keyframes reaction-float{0%{opacity:0;transform:translateX(-50%)translateY(${startY}px)scale(.9)rotate(${r.rotateDeg}deg)}12%{opacity:.95;transform:translateX(-50%)translateY(0px)scale(1)rotate(${r.rotateDeg}deg)}to{opacity:0;transform:translateX(-50%)translateY(-${endY}px)scale(1.08)rotate(${r.rotateDeg}deg)}}`
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ReactionOverlay.tsx",
        lineNumber: 89,
        columnNumber: 9
    }, this);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/lib/buttonBindings.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
const BUTTON_ORDER = [
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
const ACCEL_UPDATE_INTERVAL = 200;
function WiiDebugPanel({ wiiState, pressed, effectiveProjectBindings, irCursorEnabled, onToggleIrCursor }) {
    const [displayAccel, setDisplayAccel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0,
        z: 0
    });
    const displayIrCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const displayButtonsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])("(none)");
    const displayBindingsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const lastAccelUpdateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!wiiState?.accel) return;
        const now = Date.now();
        if (now - lastAccelUpdateRef.current < ACCEL_UPDATE_INTERVAL) return;
        const { x, y, z } = wiiState.accel;
        if (x === 0 && y === 0 && z === 0) return;
        setDisplayAccel((prev)=>{
            if (x !== prev.x || y !== prev.y || z !== prev.z) {
                lastAccelUpdateRef.current = now;
                return {
                    x,
                    y,
                    z
                };
            }
            return prev;
        });
    }, [
        wiiState
    ]);
    if (wiiState?.ir) {
        const currentCount = wiiState.ir.length;
        if (currentCount !== displayIrCountRef.current) {
            displayIrCountRef.current = currentCount;
        }
    }
    const pressedButtons = Object.entries(pressed).filter(([, isDown])=>isDown).map(([btn])=>btn);
    if (pressedButtons.length > 0) {
        displayButtonsRef.current = pressedButtons.join(", ");
    }
    const entries = Object.entries(effectiveProjectBindings);
    entries.sort((a, b)=>{
        const indexA = BUTTON_ORDER.indexOf(a[0]);
        const indexB = BUTTON_ORDER.indexOf(b[0]);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a[0].localeCompare(b[0]);
    });
    const currentBindings = entries.map(([btn, action])=>`${btn.padEnd(8)} → ${action ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatAction"])(action) : "(unassigned)"}`);
    if (currentBindings.length !== displayBindingsRef.current.length || currentBindings.some((line, i)=>line !== displayBindingsRef.current[i])) {
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
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            zIndex: 9999,
            pointerEvents: "auto",
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
                lineNumber: 105,
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
                lineNumber: 106,
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
                lineNumber: 110,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    color: "rgba(209,250,229,0.9)"
                },
                children: `Btn: ${displayButtonsRef.current}`
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 111,
                columnNumber: 4
            }, this),
            onToggleIrCursor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 8
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                    lineNumber: 115,
                    columnNumber: 6
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 114,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    margin: "10px 0",
                    borderTop: "1px solid rgba(255,255,255,0.12)"
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 134,
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
                lineNumber: 135,
                columnNumber: 4
            }, this),
            displayBindingsRef.current.map((line)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: line
                }, line, false, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                    lineNumber: 137,
                    columnNumber: 5
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
        lineNumber: 86,
        columnNumber: 3
    }, this);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isPlaying || !startedWithWii || !wiiDisconnectedAt) return;
        if (wiiDisconnectedAt < playingSince) return;
        setOpen(true);
    }, [
        isPlaying,
        startedWithWii,
        wiiDisconnectedAt,
        playingSince
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (wiiConnected && open) setOpen(false);
    }, [
        wiiConnected,
        open
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleKeyDown = (e)=>{
            if (e.key.toLowerCase() === "d") setOpen((prev)=>!prev);
        };
        window.addEventListener("keydown", handleKeyDown);
        return ()=>window.removeEventListener("keydown", handleKeyDown);
    }, []);
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
                display: "inline-block",
                transformOrigin: "center"
            },
            onClick: (e)=>e.stopPropagation(),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    transform: "scale(1)",
                    transformOrigin: "center",
                    display: "inline-block"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: "min(720px, 92vw)",
                        borderRadius: 14,
                        background: "#FFFFFF",
                        border: "3px solid #FF0000",
                        boxShadow: "0 20px 80px rgba(255, 0, 0, 0.3)",
                        padding: 24,
                        textAlign: "center"
                    },
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 30,
                                fontWeight: 400,
                                marginBottom: 10,
                                color: "#FF0000",
                                fontFamily: "Doto, sans-serif"
                            },
                            children: "Wii-Remote Disconected…"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
                            lineNumber: 77,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 16,
                                opacity: 0.9,
                                lineHeight: 1.6,
                                color: "#000000"
                            },
                            children: [
                                "接続（Bluetooth/電池）を確認してください。",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
                                    lineNumber: 81,
                                    columnNumber: 55
                                }, this),
                                "キーボード操作（←/→）は引き続き利用できます。"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
                            lineNumber: 80,
                            columnNumber: 25
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
                                lineNumber: 86,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
                            lineNumber: 85,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
                    lineNumber: 65,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
                lineNumber: 64,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
            lineNumber: 59,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx",
        lineNumber: 43,
        columnNumber: 9
    }, this);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiReconnectPopup.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WiiReconnectPopup",
    ()=>WiiReconnectPopup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function WiiReconnectPopup({ isPlaying, wiiConnected, startedWithWii }) {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const prevConnectedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(wiiConnected);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isPlaying || !startedWithWii) return;
        const wasDisconnected = !prevConnectedRef.current;
        const isNowConnected = wiiConnected;
        if (wasDisconnected && isNowConnected) {
            setOpen(true);
            const timer = setTimeout(()=>{
                setOpen(false);
            }, 1500);
            return ()=>clearTimeout(timer);
        }
        prevConnectedRef.current = wiiConnected;
    }, [
        wiiConnected,
        isPlaying,
        startedWithWii
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleKeyDown = (e)=>{
            if (e.key.toLowerCase() === 'r') {
                setOpen((prev)=>!prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return ()=>window.removeEventListener('keydown', handleKeyDown);
    }, []);
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "alert",
        "aria-live": "polite",
        "aria-label": "Wiiリモコンが接続されました",
        style: {
            position: "absolute",
            top: 80,
            right: 20,
            zIndex: 30000,
            width: "auto",
            pointerEvents: "none"
        },
        className: "jsx-6983641d836145c8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "inline-block",
                    transformOrigin: "top right",
                    pointerEvents: "auto"
                },
                className: "jsx-6983641d836145c8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "inline-block",
                        animation: "slideInRight 0.3s ease-out",
                        transformOrigin: "top right"
                    },
                    className: "jsx-6983641d836145c8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "inline-block",
                            transform: "scale(1)",
                            transformOrigin: "top right",
                            borderRadius: 14,
                            background: "#FFFFFF",
                            border: "3px solid #87CEEB",
                            boxShadow: "0 10px 40px rgba(135, 206, 235, 0.4)",
                            padding: 20,
                            color: "#87CEEB",
                            textAlign: "center",
                            width: "min(400px, 90vw)"
                        },
                        className: "jsx-6983641d836145c8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 24,
                                    fontWeight: 400,
                                    marginBottom: 8,
                                    fontFamily: "Doto, sans-serif"
                                },
                                className: "jsx-6983641d836145c8",
                                children: "Wii-Remote Conected!"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiReconnectPopup.tsx",
                                lineNumber: 89,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 14,
                                    opacity: 0.8,
                                    lineHeight: 1.5,
                                    color: "#000000"
                                },
                                className: "jsx-6983641d836145c8",
                                children: "操作を再開できます"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiReconnectPopup.tsx",
                                lineNumber: 92,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiReconnectPopup.tsx",
                        lineNumber: 74,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiReconnectPopup.tsx",
                    lineNumber: 67,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiReconnectPopup.tsx",
                lineNumber: 60,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "6983641d836145c8",
                children: "@keyframes slideInRight{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiReconnectPopup.tsx",
        lineNumber: 47,
        columnNumber: 9
    }, this);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PdfSlide.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PdfSlide",
    ()=>PdfSlide
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function PdfSlide({ assetId, page, fallbackDataUrl, alt, getOrLoadPdfDocument }) {
    const wrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [size, setSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [renderError, setRenderError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const renderTaskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
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
        const ro = new ResizeObserver(update);
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
                if (renderTaskRef.current) {
                    try {
                        renderTaskRef.current.cancel();
                    } catch  {
                    // Already cancelled
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
                const error = e;
                const msg = error?.name === "RenderingCancelledException" ? null : error?.message || String(e);
                if (!cancelled && msg) setRenderError(msg);
            }
        })();
        return ()=>{
            cancelled = true;
            if (renderTaskRef.current) {
                try {
                    renderTaskRef.current.cancel();
                    renderTaskRef.current = null;
                } catch  {
                // Already cancelled
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
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PdfSlide.tsx",
            lineNumber: 116,
            columnNumber: 5
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
            ref: canvasRef,
            "aria-label": alt
        }, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PdfSlide.tsx",
            lineNumber: 118,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PdfSlide.tsx",
        lineNumber: 111,
        columnNumber: 3
    }, this);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/VideoSlide.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VideoSlide",
    ()=>VideoSlide
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/idbAssets.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function VideoSlide({ assetId, alt }) {
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
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/VideoSlide.tsx",
            lineNumber: 39,
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
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/VideoSlide.tsx",
            lineNumber: 42,
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
        playsInline: true,
        "aria-label": alt
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/VideoSlide.tsx",
        lineNumber: 46,
        columnNumber: 3
    }, this);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ImageSlide.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ImageSlide",
    ()=>ImageSlide
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/idbAssets.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function ImageSlide({ assetId, alt }) {
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
                if (!blob) throw new Error("画像アセットが見つかりません (IndexedDB)");
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
                "画像の読み込みに失敗しました: ",
                error
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ImageSlide.tsx",
            lineNumber: 39,
            columnNumber: 10
        }, this);
    }
    if (!src) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                color: "white",
                textAlign: "center"
            },
            children: "画像を読み込み中..."
        }, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ImageSlide.tsx",
            lineNumber: 42,
            columnNumber: 10
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
        src: src,
        style: {
            width: "100%",
            height: "100%",
            objectFit: "contain"
        },
        alt: alt
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ImageSlide.tsx",
        lineNumber: 46,
        columnNumber: 3
    }, this);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SlideDisplay",
    ()=>SlideDisplay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$PdfSlide$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PdfSlide.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$VideoSlide$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/VideoSlide.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$ImageSlide$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ImageSlide.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function SlideDisplay({ currentNode, error, getOrLoadPdfDocument }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        children: currentNode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SlideContent, {
            currentNode: currentNode,
            getOrLoadPdfDocument: getOrLoadPdfDocument
        }, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx",
            lineNumber: 19,
            columnNumber: 5
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                color: "white"
            },
            children: error ?? "スライドデータがありません"
        }, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx",
            lineNumber: 21,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx",
        lineNumber: 17,
        columnNumber: 3
    }, this);
}
function SlideContent({ currentNode, getOrLoadPdfDocument }) {
    const asset = currentNode.data.asset;
    if (!asset) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            style: {
                fontSize: 80,
                color: "white",
                textAlign: "center",
                maxWidth: "80%"
            },
            children: currentNode.data.label
        }, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx",
            lineNumber: 38,
            columnNumber: 4
        }, this);
    }
    switch(asset.kind){
        case "pdf":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$PdfSlide$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PdfSlide"], {
                assetId: asset.assetId,
                page: asset.page ?? 1,
                fallbackDataUrl: asset.thumbnailDataUrl,
                alt: currentNode.data.label,
                getOrLoadPdfDocument: getOrLoadPdfDocument
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx",
                lineNumber: 47,
                columnNumber: 5
            }, this);
        case "video":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$VideoSlide$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VideoSlide"], {
                assetId: asset.assetId,
                alt: currentNode.data.label
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx",
                lineNumber: 56,
                columnNumber: 11
            }, this);
        case "image":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$ImageSlide$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ImageSlide"], {
                assetId: asset.assetId,
                alt: currentNode.data.label
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx",
                lineNumber: 58,
                columnNumber: 11
            }, this);
        default:
            return null;
    }
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/DrawingCanvas.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DrawingCanvas",
    ()=>DrawingCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const ERASER_RADIUS = 60;
const ERASER_STEP = 12;
const ERASER_ALPHA = 0.18;
const ERASER_BLUR = 25;
const PEN_WIDTH = 5;
const PEN_COLOR = "red";
function DrawingCanvas({ drawingPoints, eraserMode, eraserPosition }) {
    const drawingCanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cursorCanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastDrawnIndexRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleResize = ()=>{
            const width = window.innerWidth;
            const height = window.innerHeight;
            if (drawingCanvasRef.current) {
                drawingCanvasRef.current.width = width;
                drawingCanvasRef.current.height = height;
                lastDrawnIndexRef.current = 0;
            }
            if (cursorCanvasRef.current) {
                cursorCanvasRef.current.width = width;
                cursorCanvasRef.current.height = height;
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return ()=>window.removeEventListener("resize", handleResize);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = drawingCanvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        if (drawingPoints.length < lastDrawnIndexRef.current) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            lastDrawnIndexRef.current = 0;
        }
        if (drawingPoints.length === lastDrawnIndexRef.current) return;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for(let i = lastDrawnIndexRef.current; i < drawingPoints.length; i++){
            const point = drawingPoints[i];
            if (!point) continue;
            const prev = i > 0 ? drawingPoints[i - 1] : null;
            const mode = point.mode || "draw";
            const isStart = !prev || prev.mode !== point.mode;
            if (isStart && mode === "erase") {
                drawEraserStamp(ctx, point.x, point.y);
            } else if (!isStart && prev) {
                if (mode === "draw") {
                    drawLine(ctx, prev.x, prev.y, point.x, point.y);
                } else {
                    drawEraserPath(ctx, prev.x, prev.y, point.x, point.y);
                }
            }
        }
        lastDrawnIndexRef.current = drawingPoints.length;
    }, [
        drawingPoints
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = cursorCanvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (eraserMode && eraserPosition) {
            ctx.save();
            ctx.strokeStyle = "rgba(255, 100, 100, 0.6)";
            ctx.lineWidth = 2;
            ctx.setLineDash([
                8,
                4
            ]);
            ctx.beginPath();
            ctx.arc(eraserPosition.x, eraserPosition.y, ERASER_RADIUS, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
        }
    }, [
        eraserMode,
        eraserPosition
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: drawingCanvasRef,
                style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none"
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/DrawingCanvas.tsx",
                lineNumber: 112,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: cursorCanvasRef,
                style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none"
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/DrawingCanvas.tsx",
                lineNumber: 116,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true);
}
function drawEraserStamp(ctx, x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = `rgba(0,0,0,${ERASER_ALPHA})`;
    ctx.shadowBlur = ERASER_BLUR;
    ctx.shadowColor = `rgba(0,0,0,${ERASER_ALPHA})`;
    ctx.beginPath();
    ctx.arc(x, y, ERASER_RADIUS, 0, Math.PI * 2);
    ctx.fill();
}
function drawLine(ctx, x1, y1, x2, y2) {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = PEN_COLOR;
    ctx.lineWidth = PEN_WIDTH;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
function drawEraserPath(ctx, x1, y1, x2, y2) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = `rgba(0,0,0,${ERASER_ALPHA})`;
    ctx.shadowBlur = ERASER_BLUR;
    ctx.shadowColor = `rgba(0,0,0,${ERASER_ALPHA})`;
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1);
    for(let d = ERASER_STEP; d <= dist; d += ERASER_STEP){
        const bx = x1 + Math.cos(angle) * d;
        const by = y1 + Math.sin(angle) * d;
        ctx.beginPath();
        ctx.arc(bx, by, ERASER_RADIUS, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x2, y2, ERASER_RADIUS, 0, Math.PI * 2);
    ctx.fill();
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IrPointerOverlay",
    ()=>IrPointerOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function mapIrToScreen(irX, irY, screenW, screenH) {
    return {
        x: (1 - irX / 1024) * screenW,
        y: irY / 768 * screenH
    };
}
function IrPointerOverlay({ wiiState, irCursorEnabled, showIrDebug = false }) {
    if (!showIrDebug || !wiiState) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontWeight: "bold",
                    marginBottom: 8,
                    color: "#0ff"
                },
                children: "📡 IR Sensor Debug"
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                lineNumber: 40,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: "#888"
                        },
                        children: "IRCursor:"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                        lineNumber: 42,
                        columnNumber: 5
                    }, this),
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: irCursorEnabled ? "#0f0" : "#f55"
                        },
                        children: irCursorEnabled ? "ON" : "OFF"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                        lineNumber: 43,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                lineNumber: 41,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: "#888"
                        },
                        children: "Detected:"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                        lineNumber: 46,
                        columnNumber: 5
                    }, this),
                    " ",
                    wiiState.ir?.length || 0,
                    " point(s)"
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                lineNumber: 45,
                columnNumber: 4
            }, this),
            wiiState.ir && wiiState.ir.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                        style: {
                            margin: "8px 0",
                            border: "none",
                            borderTop: "1px solid rgba(0,255,0,0.2)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                        lineNumber: 50,
                        columnNumber: 6
                    }, this),
                    wiiState.ir.map((dot, index)=>{
                        const screen = mapIrToScreen(dot.x, dot.y, window.innerWidth, window.innerHeight);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: 4
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                    lineNumber: 55,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        paddingLeft: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "#888"
                                            },
                                            children: "Raw:"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                                            lineNumber: 57,
                                            columnNumber: 10
                                        }, this),
                                        " (",
                                        dot.x,
                                        ", ",
                                        dot.y,
                                        ")",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                                            lineNumber: 58,
                                            columnNumber: 10
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "#888"
                                            },
                                            children: "Screen:"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                                            lineNumber: 59,
                                            columnNumber: 10
                                        }, this),
                                        " (",
                                        Math.round(screen.x),
                                        ", ",
                                        Math.round(screen.y),
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                                    lineNumber: 56,
                                    columnNumber: 9
                                }, this)
                            ]
                        }, index, true, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                            lineNumber: 54,
                            columnNumber: 8
                        }, this);
                    })
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                style: {
                    margin: "8px 0",
                    border: "none",
                    borderTop: "1px solid rgba(0,255,0,0.2)"
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                lineNumber: 66,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 10,
                    color: "#666"
                },
                children: [
                    "座標範囲: X(0-1023), Y(0-767)",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                        lineNumber: 69,
                        columnNumber: 5
                    }, this),
                    "[C] IRカーソル切替 / [Space] デバッグ表示切替"
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                lineNumber: 67,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
        lineNumber: 23,
        columnNumber: 3
    }, this);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/EraserCursor.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EraserCursor",
    ()=>EraserCursor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function EraserCursor({ position, isActive, buttonName }) {
    if (!isActive || !position) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "fixed",
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/EraserCursor.tsx",
                lineNumber: 32,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                style: {
                    fontSize: 11
                },
                children: [
                    "左クリックまたはA+Bで消去 | ",
                    buttonName || "X",
                    "で解除"
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/EraserCursor.tsx",
                lineNumber: 33,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/EraserCursor.tsx",
        lineNumber: 15,
        columnNumber: 3
    }, this);
}
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
    } catch  {}
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
    } catch  {}
}
function clearEditorStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LAST_SAVED_HASH_KEY);
    } catch  {}
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
    } catch  {}
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/buttonBindings.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectBindingsStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/projectBindingsStorage.ts [app-ssr] (ecmascript)");
;
;
let currentFlow = null;
let currentProjectId = "default";
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
    if (currentFlow?.projectBindings) {
        return currentFlow.projectBindings;
    }
    if ("TURBOPACK compile-time truthy", 1) return undefined;
    //TURBOPACK unreachable
    ;
}
function setProjectBindings(bindings) {
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
const SOUND_SETTINGS_KEY_PREFIX = "wiiSugeee_soundSettings_";
function getSoundSettings() {
    if ("TURBOPACK compile-time truthy", 1) {
        return {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_SOUND_SETTINGS"]
        };
    }
    //TURBOPACK unreachable
    ;
    const key = undefined;
    const stored = undefined;
}
function setSoundSettings(settings) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const key = undefined;
    const l = undefined;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/idbAssets.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$hooks$2f$useWiiController$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/hooks/useWiiController.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$ReactionOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ReactionOverlay.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$WiiDebugPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$WiiDisconnectPopup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$WiiReconnectPopup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiReconnectPopup.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$SlideDisplay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$DrawingCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/DrawingCanvas.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$IrPointerOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$EraserCursor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/presenter/EraserCursor.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/presentation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$currentProjectStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/currentProjectStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/buttonBindings.ts [app-ssr] (ecmascript)");
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
;
;
;
;
;
function PresenterView() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isMouseDrawingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [isPainting, setIsPainting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const wasWiiADownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const lastEraserToggleTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastIrSensToggleTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const { wiiState, pressed, wiiConnected, wiiDisconnectedAt, irCursorEnabled, setIrCursorEnabled, playWiiSound } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$hooks$2f$useWiiController$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWiiController"])();
    const soundboardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const audioUnlockedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const pendingSoundRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const tryUnlockAudio = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
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
                    void next.play().catch((err)=>{
                        console.warn("sound play failed", pending, err);
                    });
                }
            }
        } catch (err) {
            console.warn("audio unlock failed", err);
        }
    }, []);
    // PC側で音声を再生（HTMLAudio）
    const playSoundOnPC = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (key)=>{
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
        void a.play().catch((err)=>{
            console.warn(`[Audio] Sound play failed for ${key}:`, err);
            pendingSoundRef.current = key;
        });
    }, [
        tryUnlockAudio
    ]);
    // Wiiリモコン側で音声を再生
    const playSoundOnWii = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((key)=>{
        if (key === "q") playWiiSound("shot");
        else if (key === "e") playWiiSound("oh");
        else playWiiSound("uxo");
    }, [
        playWiiSound
    ]);
    // 汎用の音声再生関数（outputDeviceで出力先を指定）
    const playSound = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((key, outputDevice = "pc")=>{
        if (outputDevice === "wii") {
            playSoundOnWii(key);
        } else {
            playSoundOnPC(key);
        }
    }, [
        playSoundOnPC,
        playSoundOnWii
    ]);
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
    const [flow, setFlow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentNodeId, setCurrentNodeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [startedWithWii, setStartedWithWii] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [playingSince, setPlayingSince] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showDebugPanel, setShowDebugPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showIrDebug, setShowIrDebug] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true); // IRセンサーデバッグ表示
    const pdfDocCacheRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    // ★修正: 常にplaying状態として扱う（flow/currentNodeIdがあれば再生中）
    const isPlaying = flow != null && currentNodeId != null;
    // PC側音声の初期化
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
        console.log("[Audio] Audio elements initialized");
        // ユーザーインタラクション時にオーディオコンテキストをアンロック
        const unlockOnInteraction = ()=>{
            if (audioUnlockedRef.current) return;
            console.log("[Audio] User interaction detected, unlocking audio");
            void tryUnlockAudio();
        };
        // クリックやタッチでアンロックを試行
        window.addEventListener("click", unlockOnInteraction);
        window.addEventListener("touchstart", unlockOnInteraction);
        window.addEventListener("keydown", unlockOnInteraction);
        return ()=>{
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
        };
    }, [
        tryUnlockAudio
    ]);
    // スペースキーでデバッグパネルとIRセンサーデバッグ表示を切り替え
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleKeyDown = (e)=>{
            if (e.code === "Space" && e.target === document.body) {
                e.preventDefault();
                setShowDebugPanel((prev)=>!prev);
                setShowIrDebug((prev)=>!prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return ()=>window.removeEventListener("keydown", handleKeyDown);
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
    // 消しゴムモード（トグル式）- XキーとWiiボタンで共通
    const [eraserMode, setEraserMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [eraserButtonName, setEraserButtonName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // カーソル位置（消しゴムカーソル表示用）
    const [cursorPos, setCursorPos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
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
            // ペイントと消しゴムを切り替え (X) - Wiiボタンと同じ挙動
            if (e.key === "x" || e.key === "X") {
                // 押しっぱなしでON/OFFが暴れないように、リピートは無視
                if (e.repeat) return;
                setEraserMode((prev)=>{
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
                });
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
            if (e.key === "Escape") goBack();
            if ((e.key === "c" || e.key === "C") && !e.repeat) {
                setIrCursorEnabled(!irCursorEnabled);
                return;
            }
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
        playSound,
        irCursorEnabled,
        setIrCursorEnabled
    ]);
    const effectiveProjectBindings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const combined = {
            ...flow?.projectBindings ?? {},
            ...currentNode?.data.bindings ?? {}
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeBindings"])(combined);
    }, [
        flow,
        currentNode
    ]);
    const runAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((act, btnName)=>{
        if (eraserMode && act.type !== "eraser") {
            return;
        }
        switch(act.type){
            case "next":
                nextSlide();
                return;
            case "prev":
                prevSlide();
                return;
            case "branchIndex":
                branchByNumberKey(String(act.index));
                return;
            case "branch":
                {
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
                return;
            case "paint":
                break;
            case "eraser":
                const nowEraser = Date.now();
                if (nowEraser - lastEraserToggleTimeRef.current < 500) return;
                lastEraserToggleTimeRef.current = nowEraser;
                if (eraserMode) {
                    setEraserMode(false);
                    setEraserButtonName(null);
                    setCursorPos(null);
                } else {
                    setEraserMode(true);
                    setEraserButtonName(btnName || "unknown");
                    setCursorPos({
                        x: window.innerWidth / 2,
                        y: window.innerHeight / 2
                    });
                }
                break;
            case "sound":
                if (act.kind === "shot") playSound("q", act.outputDevice);
                else if (act.kind === "oh") playSound("e", act.outputDevice);
                else if (act.kind === "uxo") playSound("w", act.outputDevice);
                return;
            case "remove":
                setDrawingPoints([]);
                isMouseDrawingRef.current = false;
                wasWiiADownRef.current = false;
                return;
            case "irSens":
                const nowIrSens = Date.now();
                if (nowIrSens - lastIrSensToggleTimeRef.current < 500) return;
                lastIrSensToggleTimeRef.current = nowIrSens;
                setIrCursorEnabled(!irCursorEnabled);
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
        playSound,
        eraserMode,
        irCursorEnabled,
        setIrCursorEnabled
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isPlaying) return;
        for (const btn of Object.keys(pressed)){
            const isDown = pressed[btn];
            if (!isDown) continue;
            const act = effectiveProjectBindings[btn] ?? {
                type: "none"
            };
            if (act.type !== "paint" && act.type !== "eraser") {
                runAction(act, btn);
            } else if (act.type === "eraser") {
                runAction(act, btn);
            }
        }
    }, [
        pressed,
        isPlaying,
        effectiveProjectBindings,
        runAction
    ]);
    const shouldEmitClap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!isPlaying) return false;
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
    const lastPaintInputTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const [shouldPaint, setShouldPaint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (irCursorEnabled) return;
        setShouldPaint(false);
        setIsPainting(false);
        lastPaintInputTimeRef.current = 0;
        // もしWii描画の線が継続中なら区切る
        wasWiiADownRef.current = false;
        setDrawingPoints((prev)=>prev.length > 0 && prev[prev.length - 1] !== null ? [
                ...prev,
                null
            ] : prev);
    }, [
        irCursorEnabled
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isPlaying || !wiiState || eraserMode || !irCursorEnabled) {
            if (shouldPaint) {
                setShouldPaint(false);
                setIsPainting(false);
            }
            return;
        }
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
            if (!isPainting) setIsPainting(true);
        }
    }, [
        wiiState,
        effectiveProjectBindings,
        isPlaying,
        eraserMode,
        irCursorEnabled,
        shouldPaint,
        isPainting
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isPlaying) {
            setShouldPaint(false);
            return;
        }
        const interval = setInterval(()=>{
            const now = Date.now();
            const paintElapsed = now - lastPaintInputTimeRef.current;
            if (paintElapsed > 100 && shouldPaint) {
                setShouldPaint(false);
                setIsPainting(false);
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
    // --- 描画/消しゴムロジック (IRセンサー & PAINTボタン) ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
                setDrawingPoints((prev)=>{
                    const next = prev.slice();
                    if (!wasWiiADownRef.current) {
                        if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                    }
                    next.push({
                        ...pos,
                        mode: "erase"
                    });
                    return next;
                });
                wasWiiADownRef.current = true;
            } else {
                // A+Bを離したら区切る
                if (wasWiiADownRef.current) {
                    wasWiiADownRef.current = false;
                    setDrawingPoints((prev)=>prev.length > 0 && prev[prev.length - 1] !== null ? [
                            ...prev,
                            null
                        ] : prev);
                }
            }
            return;
        }
        // PAINTバインドされたボタンを押している間、軌跡を追加
        if (shouldPaint) {
            setDrawingPoints((prev)=>{
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
    }, [
        wiiState,
        shouldPaint,
        irCursorEnabled
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
            // 消しゴムモード時：カーソル位置を常に更新（赤い円を追従させる）
            if (eraserMode) {
                setCursorPos({
                    x: e.clientX,
                    y: e.clientY
                });
                // マウスドラッグ中のみ消去を実行
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
                                mode: "erase"
                            }
                        ];
                    });
                }
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$WiiDisconnectPopup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WiiDisconnectPopup"], {
                isPlaying: isPlaying,
                startedWithWii: startedWithWii,
                wiiConnected: wiiConnected,
                wiiDisconnectedAt: wiiDisconnectedAt,
                playingSince: playingSince
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 827,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$WiiReconnectPopup$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WiiReconnectPopup"], {
                isPlaying: isPlaying,
                wiiConnected: wiiConnected,
                startedWithWii: startedWithWii
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 835,
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
                    lineNumber: 843,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 842,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$ReactionOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReactionOverlay"], {
                emitClap: shouldEmitClap,
                emitLaugh: shouldEmitLaugh
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 849,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$IrPointerOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IrPointerOverlay"], {
                wiiState: wiiState,
                isPlaying: isPlaying,
                irCursorEnabled: irCursorEnabled,
                showIrDebug: showIrDebug
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 852,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$SlideDisplay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SlideDisplay"], {
                currentNode: currentNode,
                error: error,
                getOrLoadPdfDocument: getOrLoadPdfDocument
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 860,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$DrawingCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DrawingCanvas"], {
                drawingPoints: drawingPoints,
                wiiState: wiiState,
                isPlaying: isPlaying,
                shouldPaint: shouldPaint,
                eraserMode: eraserMode,
                eraserPosition: cursorPos
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 867,
                columnNumber: 13
            }, this),
            showDebugPanel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$WiiDebugPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WiiDebugPanel"], {
                wiiState: wiiState,
                pressed: pressed,
                effectiveProjectBindings: effectiveProjectBindings,
                irCursorEnabled: irCursorEnabled,
                onToggleIrCursor: ()=>setIrCursorEnabled(!irCursorEnabled)
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 878,
                columnNumber: 17
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
                children: "[ESC] 戻る | [SPACE] デバッグ表示切替"
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 888,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$EraserCursor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EraserCursor"], {
                position: cursorPos,
                isActive: eraserMode,
                buttonName: eraserButtonName
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
                lineNumber: 893,
                columnNumber: 13
            }, this),
            eraserMode && cursorPos && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                lineNumber: 901,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx",
        lineNumber: 719,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__95d39f86._.js.map