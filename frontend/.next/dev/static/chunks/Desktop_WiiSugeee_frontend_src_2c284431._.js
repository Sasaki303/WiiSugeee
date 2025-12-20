(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
    _s();
    const [wiiState, setWiiState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [wiiConnected, setWiiConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [wiiDisconnectedAt, setWiiDisconnectedAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [irCursorEnabled, setIrCursorEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pressed, setPressed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const wasConnectedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const wsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pressedBufferRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const prevButtonsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const latestWiiDataRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pendingPressedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const kbButtonsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        ...EMPTY_BUTTONS
    });
    const kbPressedBufferRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useWiiController.useEffect": ()=>{
            const onKeyDown = {
                "useWiiController.useEffect.onKeyDown": (e)=>{
                    if (e.repeat) return;
                    const btn = keyToButton(e.key);
                    if (!btn) return;
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useWiiController.useEffect": ()=>{
            const ws = new WebSocket("ws://localhost:8080");
            wsRef.current = ws;
            ws.onopen = ({
                "useWiiController.useEffect": ()=>console.log("Connected to Wii Server")
            })["useWiiController.useEffect"];
            ws.onmessage = ({
                "useWiiController.useEffect": (event)=>{
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
                            Object.keys(data.buttons).forEach({
                                "useWiiController.useEffect": (key)=>{
                                    if (data.buttons[key] && !prevButtonsRef.current[key]) {
                                        pressedBufferRef.current[key] = true;
                                    }
                                }
                            }["useWiiController.useEffect"]);
                        }
                        prevButtonsRef.current = data.buttons;
                        latestWiiDataRef.current = data;
                    } catch (e) {
                        console.error("Parse error:", e);
                    }
                }
            })["useWiiController.useEffect"];
            const handleDisconnect = {
                "useWiiController.useEffect.handleDisconnect": ()=>{
                    const wasConnected = wasConnectedRef.current;
                    setWiiConnected(false);
                    wasConnectedRef.current = false;
                    if (wasConnected) {
                        setWiiDisconnectedAt(Date.now());
                    }
                }
            }["useWiiController.useEffect.handleDisconnect"];
            ws.onerror = handleDisconnect;
            ws.onclose = handleDisconnect;
            return ({
                "useWiiController.useEffect": ()=>{
                    try {
                        ws.close();
                    } catch  {}
                    wsRef.current = null;
                }
            })["useWiiController.useEffect"];
        }
    }["useWiiController.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useWiiController.useEffect": ()=>{
            let raf = 0;
            const flushState = {
                "useWiiController.useEffect.flushState": (wiiDataOrNull)=>{
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
                }
            }["useWiiController.useEffect.flushState"];
            const loop = {
                "useWiiController.useEffect.loop": ()=>{
                    flushState(latestWiiDataRef.current);
                    raf = window.requestAnimationFrame(loop);
                }
            }["useWiiController.useEffect.loop"];
            raf = window.requestAnimationFrame(loop);
            return ({
                "useWiiController.useEffect": ()=>window.cancelAnimationFrame(raf)
            })["useWiiController.useEffect"];
        }
    }["useWiiController.useEffect"], []);
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
_s(useWiiController, "pTM4aXYIAXmRvy3PMz5eRyJsphI=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
    if (currentFlow?.projectBindings) {
        return currentFlow.projectBindings;
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectBindingsStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadProjectBindings"])(currentProjectId);
}
function setProjectBindings(bindings) {
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
"[project]/Desktop/WiiSugeee/frontend/src/hooks/usePresentation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePresentation",
    ()=>usePresentation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/presentation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$currentProjectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/currentProjectStore.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function usePresentation({ wiiConnected }) {
    _s();
    const [flow, setFlow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentNodeId, setCurrentNodeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [startedWithWii, setStartedWithWii] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [playingSince, setPlayingSince] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const lastNavTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const isPlaying = flow != null && currentNodeId != null;
    const currentNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePresentation.useMemo[currentNode]": ()=>flow?.nodes.find({
                "usePresentation.useMemo[currentNode]": (n)=>n.id === currentNodeId
            }["usePresentation.useMemo[currentNode]"])
    }["usePresentation.useMemo[currentNode]"], [
        flow,
        currentNodeId
    ]);
    const outgoingEdges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePresentation.useMemo[outgoingEdges]": ()=>{
            if (!flow || !currentNodeId) return [];
            return flow.edges.filter({
                "usePresentation.useMemo[outgoingEdges]": (e)=>e.source === currentNodeId
            }["usePresentation.useMemo[outgoingEdges]"]);
        }
    }["usePresentation.useMemo[outgoingEdges]"], [
        flow,
        currentNodeId
    ]);
    const hasMultipleBranches = outgoingEdges.length >= 2;
    const branchOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePresentation.useMemo[branchOptions]": ()=>{
            const options = [];
            const used = new Set();
            for (const edge of outgoingEdges){
                const label = (edge.label ?? "").trim();
                const m = label.match(/^([1-9])(?:\b|\s|:|-)/);
                if (m && !used.has(m[1])) {
                    options.push({
                        key: m[1],
                        target: edge.target
                    });
                    used.add(m[1]);
                }
            }
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
    }["usePresentation.useMemo[branchOptions]"], [
        outgoingEdges
    ]);
    const navigateTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePresentation.useCallback[navigateTo]": (nodeId, onNavigate)=>{
            const now = Date.now();
            if (now - lastNavTime.current < 500) return;
            lastNavTime.current = now;
            setCurrentNodeId(nodeId);
            onNavigate?.();
        }
    }["usePresentation.useCallback[navigateTo]"], []);
    const nextSlide = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePresentation.useCallback[nextSlide]": (onNavigate)=>{
            if (!flow || !currentNodeId) return;
            const edges = flow.edges.filter({
                "usePresentation.useCallback[nextSlide].edges": (e)=>e.source === currentNodeId
            }["usePresentation.useCallback[nextSlide].edges"]);
            if (edges.length >= 2 || edges.length === 0) return;
            const targetEdge = edges.find({
                "usePresentation.useCallback[nextSlide]": (e)=>!e.label || e.label.trim() === ""
            }["usePresentation.useCallback[nextSlide]"]) || edges.find({
                "usePresentation.useCallback[nextSlide]": (e)=>e.label === "next"
            }["usePresentation.useCallback[nextSlide]"]) || edges[0];
            if (targetEdge) navigateTo(targetEdge.target, onNavigate);
        }
    }["usePresentation.useCallback[nextSlide]"], [
        flow,
        currentNodeId,
        navigateTo
    ]);
    const prevSlide = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePresentation.useCallback[prevSlide]": (onNavigate)=>{
            if (!flow || !currentNodeId) return;
            const edge = flow.edges.find({
                "usePresentation.useCallback[prevSlide].edge": (e)=>e.target === currentNodeId
            }["usePresentation.useCallback[prevSlide].edge"]);
            if (edge) navigateTo(edge.source, onNavigate);
        }
    }["usePresentation.useCallback[prevSlide]"], [
        flow,
        currentNodeId,
        navigateTo
    ]);
    const branchByNumberKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePresentation.useCallback[branchByNumberKey]": (key, onNavigate)=>{
            if (!hasMultipleBranches) return;
            const opt = branchOptions.find({
                "usePresentation.useCallback[branchByNumberKey].opt": (o)=>o.key === key
            }["usePresentation.useCallback[branchByNumberKey].opt"]);
            if (opt) navigateTo(opt.target, onNavigate);
        }
    }["usePresentation.useCallback[branchByNumberKey]"], [
        branchOptions,
        hasMultipleBranches,
        navigateTo
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePresentation.useEffect": ()=>{
            const loaded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadFromLocalStorage"])();
            if (!loaded || loaded.nodes.length === 0) {
                setError("データが見つかりません。Editorで作成してください。");
                setFlow(null);
                setCurrentNodeId(null);
                return;
            }
            const storedBindings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$currentProjectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProjectBindings"])();
            const flowWithBindings = storedBindings ? {
                ...loaded,
                projectBindings: storedBindings
            } : loaded;
            setError(null);
            setFlow(flowWithBindings);
            const startNode = loaded.nodes.find({
                "usePresentation.useEffect": (n)=>n.data.label === "Start"
            }["usePresentation.useEffect"]) || loaded.nodes[0];
            setCurrentNodeId(startNode.id);
            setStartedWithWii(!!wiiConnected);
            setPlayingSince(Date.now());
        }
    }["usePresentation.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePresentation.useEffect": ()=>{
            if (wiiConnected) setStartedWithWii(true);
        }
    }["usePresentation.useEffect"], [
        wiiConnected
    ]);
    return {
        flow,
        error,
        isPlaying,
        currentNode,
        currentNodeId,
        startedWithWii,
        playingSince,
        outgoingEdges,
        hasMultipleBranches,
        branchOptions,
        nextSlide,
        prevSlide,
        branchByNumberKey,
        navigateTo
    };
}
_s(usePresentation, "L7H/omhcelJvqPJAyX3OA5mVDHQ=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/hooks/useDrawing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDrawing",
    ()=>useDrawing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function useDrawing() {
    _s();
    const [drawingPoints, setDrawingPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [eraserMode, setEraserMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [eraserButtonName, setEraserButtonName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [cursorPos, setCursorPos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isPainting, setIsPainting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isMouseDrawingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const wasWiiADownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const clearDrawing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDrawing.useCallback[clearDrawing]": ()=>{
            setDrawingPoints([]);
            isMouseDrawingRef.current = false;
            wasWiiADownRef.current = false;
        }
    }["useDrawing.useCallback[clearDrawing]"], []);
    const addSeparator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDrawing.useCallback[addSeparator]": ()=>{
            setDrawingPoints({
                "useDrawing.useCallback[addSeparator]": (prev)=>prev.length > 0 && prev[prev.length - 1] !== null ? [
                        ...prev,
                        null
                    ] : prev
            }["useDrawing.useCallback[addSeparator]"]);
        }
    }["useDrawing.useCallback[addSeparator]"], []);
    const addPoint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDrawing.useCallback[addPoint]": (point)=>{
            setDrawingPoints({
                "useDrawing.useCallback[addPoint]": (prev)=>[
                        ...prev,
                        point
                    ]
            }["useDrawing.useCallback[addPoint]"]);
        }
    }["useDrawing.useCallback[addPoint]"], []);
    const toggleEraserMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDrawing.useCallback[toggleEraserMode]": (buttonName)=>{
            setEraserMode({
                "useDrawing.useCallback[toggleEraserMode]": (prev)=>{
                    const next = !prev;
                    if (next) {
                        setEraserButtonName(buttonName || "X");
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
            }["useDrawing.useCallback[toggleEraserMode]"]);
        }
    }["useDrawing.useCallback[toggleEraserMode]"], []);
    const startMouseDrawing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDrawing.useCallback[startMouseDrawing]": (x, y)=>{
            isMouseDrawingRef.current = true;
            if (eraserMode) {
                setIsPainting(false);
                setDrawingPoints({
                    "useDrawing.useCallback[startMouseDrawing]": (prev)=>{
                        const next = prev.slice();
                        if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                        next.push({
                            x,
                            y,
                            mode: "erase"
                        });
                        return next;
                    }
                }["useDrawing.useCallback[startMouseDrawing]"]);
            } else {
                setIsPainting(true);
                setDrawingPoints({
                    "useDrawing.useCallback[startMouseDrawing]": (prev)=>{
                        const next = prev.slice();
                        if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                        next.push({
                            x,
                            y,
                            mode: "draw"
                        });
                        return next;
                    }
                }["useDrawing.useCallback[startMouseDrawing]"]);
            }
        }
    }["useDrawing.useCallback[startMouseDrawing]"], [
        eraserMode
    ]);
    const continueMouseDrawing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDrawing.useCallback[continueMouseDrawing]": (x, y)=>{
            if (!isMouseDrawingRef.current) return;
            const mode = eraserMode ? "erase" : "draw";
            setDrawingPoints({
                "useDrawing.useCallback[continueMouseDrawing]": (prev)=>{
                    const last = prev[prev.length - 1];
                    if (last && Math.abs(last.x - x) + Math.abs(last.y - y) < 2) return prev;
                    return [
                        ...prev,
                        {
                            x,
                            y,
                            mode
                        }
                    ];
                }
            }["useDrawing.useCallback[continueMouseDrawing]"]);
        }
    }["useDrawing.useCallback[continueMouseDrawing]"], [
        eraserMode
    ]);
    const endMouseDrawing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDrawing.useCallback[endMouseDrawing]": ()=>{
            if (!isMouseDrawingRef.current) return;
            isMouseDrawingRef.current = false;
            setIsPainting(false);
            addSeparator();
        }
    }["useDrawing.useCallback[endMouseDrawing]"], [
        addSeparator
    ]);
    const startWiiDrawing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDrawing.useCallback[startWiiDrawing]": (pos, mode)=>{
            setDrawingPoints({
                "useDrawing.useCallback[startWiiDrawing]": (prev)=>{
                    const next = prev.slice();
                    if (!wasWiiADownRef.current && next.length > 0 && next[next.length - 1] !== null) {
                        next.push(null);
                    }
                    next.push({
                        ...pos,
                        mode
                    });
                    return next;
                }
            }["useDrawing.useCallback[startWiiDrawing]"]);
            wasWiiADownRef.current = true;
        }
    }["useDrawing.useCallback[startWiiDrawing]"], []);
    const endWiiDrawing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDrawing.useCallback[endWiiDrawing]": ()=>{
            if (wasWiiADownRef.current) {
                wasWiiADownRef.current = false;
                addSeparator();
            }
        }
    }["useDrawing.useCallback[endWiiDrawing]"], [
        addSeparator
    ]);
    return {
        drawingPoints,
        setDrawingPoints,
        eraserMode,
        setEraserMode,
        eraserButtonName,
        cursorPos,
        setCursorPos,
        isPainting,
        setIsPainting,
        isMouseDrawingRef,
        wasWiiADownRef,
        clearDrawing,
        addSeparator,
        addPoint,
        toggleEraserMode,
        startMouseDrawing,
        continueMouseDrawing,
        endMouseDrawing,
        startWiiDrawing,
        endWiiDrawing
    };
}
_s(useDrawing, "hvrEBoTu6h4GVjTwXpZ+NhZ4wfc=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/hooks/useAudio.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAudio",
    ()=>useAudio
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const SOUND_URLS = {
    q: "https://www.myinstants.com/media/sounds/nice-shot-wii-sports_DJJ0VOz.mp3",
    w: "https://www.myinstants.com/media/sounds/crowdaw.mp3",
    e: "https://www.myinstants.com/media/sounds/crowdoh.mp3"
};
function useAudio(playWiiSound) {
    _s();
    const soundboardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        q: undefined,
        w: undefined,
        e: undefined
    });
    const audioUnlockedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const pendingSoundRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const tryUnlockAudio = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudio.useCallback[tryUnlockAudio]": async ()=>{
            if (audioUnlockedRef.current) return;
            const audios = Object.values(soundboardRef.current).filter(Boolean);
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
                const pending = pendingSoundRef.current;
                pendingSoundRef.current = null;
                if (pending && soundboardRef.current[pending]) {
                    soundboardRef.current[pending].currentTime = 0;
                    void soundboardRef.current[pending].play().catch({
                        "useAudio.useCallback[tryUnlockAudio]": ()=>{}
                    }["useAudio.useCallback[tryUnlockAudio]"]);
                }
            } catch  {
            // Ignore unlock failure
            }
        }
    }["useAudio.useCallback[tryUnlockAudio]"], []);
    const playSoundOnPC = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudio.useCallback[playSoundOnPC]": async (key)=>{
            const a = soundboardRef.current[key];
            if (!a) return;
            if (!audioUnlockedRef.current) {
                pendingSoundRef.current = key;
                await tryUnlockAudio();
                if (!audioUnlockedRef.current) return;
            }
            a.currentTime = 0;
            void a.play().catch({
                "useAudio.useCallback[playSoundOnPC]": ()=>{
                    pendingSoundRef.current = key;
                }
            }["useAudio.useCallback[playSoundOnPC]"]);
        }
    }["useAudio.useCallback[playSoundOnPC]"], [
        tryUnlockAudio
    ]);
    const playSoundOnWii = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudio.useCallback[playSoundOnWii]": (key)=>{
            const mapping = {
                q: "shot",
                e: "oh",
                w: "uxo"
            };
            playWiiSound(mapping[key]);
        }
    }["useAudio.useCallback[playSoundOnWii]"], [
        playWiiSound
    ]);
    const playSound = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudio.useCallback[playSound]": (key, outputDevice = "pc")=>{
            if (outputDevice === "wii") {
                playSoundOnWii(key);
            } else {
                playSoundOnPC(key);
            }
        }
    }["useAudio.useCallback[playSound]"], [
        playSoundOnPC,
        playSoundOnWii
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAudio.useEffect": ()=>{
            const q = new Audio(SOUND_URLS.q);
            const w = new Audio(SOUND_URLS.w);
            const e = new Audio(SOUND_URLS.e);
            q.preload = "auto";
            w.preload = "auto";
            e.preload = "auto";
            soundboardRef.current = {
                q,
                w,
                e
            };
            const unlockOnInteraction = {
                "useAudio.useEffect.unlockOnInteraction": ()=>{
                    if (audioUnlockedRef.current) return;
                    void tryUnlockAudio();
                }
            }["useAudio.useEffect.unlockOnInteraction"];
            window.addEventListener("click", unlockOnInteraction);
            window.addEventListener("touchstart", unlockOnInteraction);
            window.addEventListener("keydown", unlockOnInteraction);
            return ({
                "useAudio.useEffect": ()=>{
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
                        // Ignore
                        }
                    }
                    soundboardRef.current = {
                        q: undefined,
                        w: undefined,
                        e: undefined
                    };
                }
            })["useAudio.useEffect"];
        }
    }["useAudio.useEffect"], [
        tryUnlockAudio
    ]);
    return {
        playSound
    };
}
_s(useAudio, "3Qt+L6vDZASlIAeBC1QaL7vWHU8=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/hooks/useBindings.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBindings",
    ()=>useBindings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/buttonBindings.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useBindings({ flow, currentNode }) {
    _s();
    const lastEraserToggleTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastIrSensToggleTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const effectiveProjectBindings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useBindings.useMemo[effectiveProjectBindings]": ()=>{
            const combined = {
                ...flow?.projectBindings ?? {},
                ...currentNode?.data.bindings ?? {}
            };
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeBindings"])(combined);
        }
    }["useBindings.useMemo[effectiveProjectBindings]"], [
        flow,
        currentNode
    ]);
    const runAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBindings.useCallback[runAction]": (act, callbacks, btnName)=>{
            const { nextSlide, prevSlide, branchByNumberKey, hasMultipleBranches, toggleEraser, toggleIrCursor, clearDrawing, playSound, eraserMode, irCursorEnabled } = callbacks;
            if (eraserMode && act.type !== "eraser") return;
            switch(act.type){
                case "next":
                    nextSlide();
                    break;
                case "prev":
                    prevSlide();
                    break;
                case "branchIndex":
                    branchByNumberKey(String(act.index));
                    break;
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
                        break;
                    }
                case "reaction":
                    break;
                case "paint":
                    break;
                case "eraser":
                    {
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
                case "irSens":
                    {
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
        }
    }["useBindings.useCallback[runAction]"], []);
    const checkShouldEmitReaction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBindings.useCallback[checkShouldEmitReaction]": (pressed, kind)=>{
            for (const btn of Object.keys(pressed)){
                const isDown = pressed[btn];
                if (!isDown) continue;
                const act = effectiveProjectBindings[btn];
                if (act?.type === "reaction" && act.kind === kind) return true;
            }
            return false;
        }
    }["useBindings.useCallback[checkShouldEmitReaction]"], [
        effectiveProjectBindings
    ]);
    const checkIsPaintPressed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBindings.useCallback[checkIsPaintPressed]": (buttons)=>{
            for (const btn of Object.keys(buttons)){
                const isDown = buttons[btn];
                if (!isDown) continue;
                const act = effectiveProjectBindings[btn];
                if (act?.type === "paint") return true;
            }
            return false;
        }
    }["useBindings.useCallback[checkIsPaintPressed]"], [
        effectiveProjectBindings
    ]);
    return {
        effectiveProjectBindings,
        runAction,
        checkShouldEmitReaction,
        checkIsPaintPressed
    };
}
_s(useBindings, "lMhVjPgTjDERqzooW50NlQW8+nQ=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ReactionOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/Desktop/WiiSugeee/frontend/src/components/presenter/ReactionOverlay.tsx'\n\nMerge conflict marker encountered.");
e.code = 'MODULE_UNPARSABLE';
throw e;
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
    _s();
    const [displayAccel, setDisplayAccel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0,
        z: 0
    });
    const displayIrCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const displayButtonsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("(none)");
    const displayBindingsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const lastAccelUpdateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WiiDebugPanel.useEffect": ()=>{
            if (!wiiState?.accel) return;
            const now = Date.now();
            if (now - lastAccelUpdateRef.current < ACCEL_UPDATE_INTERVAL) return;
            const { x, y, z } = wiiState.accel;
            if (x === 0 && y === 0 && z === 0) return;
            setDisplayAccel({
                "WiiDebugPanel.useEffect": (prev)=>{
                    if (x !== prev.x || y !== prev.y || z !== prev.z) {
                        lastAccelUpdateRef.current = now;
                        return {
                            x,
                            y,
                            z
                        };
                    }
                    return prev;
                }
            }["WiiDebugPanel.useEffect"]);
        }
    }["WiiDebugPanel.useEffect"], [
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
    const currentBindings = entries.map(([btn, action])=>`${btn.padEnd(8)} → ${action ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$buttonBindings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAction"])(action) : "(unassigned)"}`);
    if (currentBindings.length !== displayBindingsRef.current.length || currentBindings.some((line, i)=>line !== displayBindingsRef.current[i])) {
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
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
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
                lineNumber: 105,
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
                lineNumber: 106,
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
                lineNumber: 110,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    color: "rgba(209,250,229,0.9)"
                },
                children: `Btn: ${displayButtonsRef.current}`
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 111,
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
                    lineNumber: 115,
                    columnNumber: 6
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 114,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    margin: "10px 0",
                    borderTop: "1px solid rgba(255,255,255,0.12)"
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDebugPanel.tsx",
                lineNumber: 134,
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
                lineNumber: 135,
                columnNumber: 4
            }, this),
            displayBindingsRef.current.map((line)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
_s(WiiDebugPanel, "UQ1zGWzPiWBibC5D1JGNd0RMnJI=");
_c = WiiDebugPanel;
var _c;
__turbopack_context__.k.register(_c, "WiiDebugPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiDisconnectPopup.tsx'\n\nMerge conflict marker encountered.");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiReconnectPopup.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/Desktop/WiiSugeee/frontend/src/components/presenter/WiiReconnectPopup.tsx'\n\nMerge conflict marker encountered.");
e.code = 'MODULE_UNPARSABLE';
throw e;
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
function PdfSlide({ assetId, page, fallbackDataUrl, alt, getOrLoadPdfDocument }) {
    _s();
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
            const ro = new ResizeObserver(update);
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
                        const error = e;
                        const msg = error?.name === "RenderingCancelledException" ? null : error?.message || String(e);
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
                        // Already cancelled
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
            lineNumber: 116,
            columnNumber: 5
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
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
function VideoSlide({ assetId, alt }) {
    _s();
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
            lineNumber: 39,
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
            lineNumber: 42,
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
        playsInline: true,
        "aria-label": alt
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/VideoSlide.tsx",
        lineNumber: 46,
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
function ImageSlide({ assetId, alt }) {
    _s();
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
            lineNumber: 39,
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
            lineNumber: 42,
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
        lineNumber: 46,
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
function SlideDisplay({ currentNode, error, getOrLoadPdfDocument }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        children: currentNode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SlideContent, {
            currentNode: currentNode,
            getOrLoadPdfDocument: getOrLoadPdfDocument
        }, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx",
            lineNumber: 19,
            columnNumber: 5
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
_c = SlideDisplay;
function SlideContent({ currentNode, getOrLoadPdfDocument }) {
    const asset = currentNode.data.asset;
    if (!asset) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
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
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$PdfSlide$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PdfSlide"], {
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
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$VideoSlide$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VideoSlide"], {
                assetId: asset.assetId,
                alt: currentNode.data.label
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/SlideDisplay.tsx",
                lineNumber: 56,
                columnNumber: 11
            }, this);
        case "image":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$presenter$2f$ImageSlide$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ImageSlide"], {
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
_c1 = SlideContent;
var _c, _c1;
__turbopack_context__.k.register(_c, "SlideDisplay");
__turbopack_context__.k.register(_c1, "SlideContent");
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
const ERASER_RADIUS = 60;
const ERASER_STEP = 12;
const ERASER_ALPHA = 0.18;
const ERASER_BLUR = 25;
const PEN_WIDTH = 5;
const PEN_COLOR = "red";
function DrawingCanvas({ drawingPoints, eraserMode, eraserPosition }) {
    _s();
    const drawingCanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cursorCanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastDrawnIndexRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DrawingCanvas.useEffect": ()=>{
            const handleResize = {
                "DrawingCanvas.useEffect.handleResize": ()=>{
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
                }
            }["DrawingCanvas.useEffect.handleResize"];
            handleResize();
            window.addEventListener("resize", handleResize);
            return ({
                "DrawingCanvas.useEffect": ()=>window.removeEventListener("resize", handleResize)
            })["DrawingCanvas.useEffect"];
        }
    }["DrawingCanvas.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DrawingCanvas.useEffect": ()=>{
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
        }
    }["DrawingCanvas.useEffect"], [
        drawingPoints
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DrawingCanvas.useEffect": ()=>{
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
                lineNumber: 112,
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
                lineNumber: 116,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true);
}
_s(DrawingCanvas, "yz3hGgguPy6VqYfu8EeWmE/eWVk=");
_c = DrawingCanvas;
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
function mapIrToScreen(irX, irY, screenW, screenH) {
    return {
        x: (1 - irX / 1024) * screenW,
        y: irY / 768 * screenH
    };
}
function IrPointerOverlay({ wiiState, irCursorEnabled, showIrDebug = false }) {
    if (!showIrDebug || !wiiState) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                lineNumber: 40,
                columnNumber: 4
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
                        lineNumber: 42,
                        columnNumber: 5
                    }, this),
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                        lineNumber: 50,
                        columnNumber: 6
                    }, this),
                    wiiState.ir.map((dot, index)=>{
                        const screen = mapIrToScreen(dot.x, dot.y, window.innerWidth, window.innerHeight);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                    lineNumber: 55,
                                    columnNumber: 9
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
                                            lineNumber: 57,
                                            columnNumber: 10
                                        }, this),
                                        " (",
                                        dot.x,
                                        ", ",
                                        dot.y,
                                        ")",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/IrPointerOverlay.tsx",
                                            lineNumber: 58,
                                            columnNumber: 10
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 10,
                    color: "#666"
                },
                children: [
                    "座標範囲: X(0-1023), Y(0-767)",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
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
_c = IrPointerOverlay;
var _c;
__turbopack_context__.k.register(_c, "IrPointerOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/EraserCursor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EraserCursor",
    ()=>EraserCursor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function EraserCursor({ position, isActive, buttonName }) {
    if (!isActive || !position) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/presenter/EraserCursor.tsx",
                lineNumber: 32,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
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
_c = EraserCursor;
var _c;
__turbopack_context__.k.register(_c, "EraserCursor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/Desktop/WiiSugeee/frontend/src/components/presenter/PresenterView.tsx'\n\nMerge conflict marker encountered.");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
]);

//# sourceMappingURL=Desktop_WiiSugeee_frontend_src_2c284431._.js.map