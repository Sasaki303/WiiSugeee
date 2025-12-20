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
    } catch  {}
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
"[project]/Desktop/WiiSugeee/frontend/src/lib/projectArchive.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "loadProjectFromZip",
    ()=>loadProjectFromZip,
    "loadProjectFromZipFile",
    ()=>loadProjectFromZipFile,
    "saveProjectAsZip",
    ()=>saveProjectAsZip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$jszip$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/jszip/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/idbAssets.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/presentation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$currentProjectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/currentProjectStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectBindingsStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/projectBindingsStorage.ts [app-client] (ecmascript)");
;
;
;
;
;
async function showSaveFilePickerCompat() {
    const w = window;
    if (!w.showSaveFilePicker) return null;
    try {
        return await w.showSaveFilePicker({
            suggestedName: "wiislide.zip",
            types: [
                {
                    description: "WiiSlide Project",
                    accept: {
                        "application/zip": [
                            ".zip"
                        ]
                    }
                }
            ],
            startIn: "desktop"
        });
    } catch  {
        return null;
    }
}
async function showOpenFilePickerCompat() {
    const w = window;
    if (w.showOpenFilePicker) {
        try {
            const [handle] = await w.showOpenFilePicker({
                multiple: false,
                types: [
                    {
                        description: "WiiSlide Project",
                        accept: {
                            "application/zip": [
                                ".zip"
                            ]
                        }
                    }
                ],
                startIn: "desktop"
            });
            if (!handle) return null;
            return await handle.getFile();
        } catch  {}
    }
    return await new Promise((resolve)=>{
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".zip,application/zip";
        input.onchange = ()=>resolve(input.files?.[0] ?? null);
        input.click();
    });
}
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
async function saveProjectAsZip(flow) {
    const latestBindings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$currentProjectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProjectBindings"])();
    const flowWithBindings = latestBindings ? {
        ...flow,
        projectBindings: latestBindings
    } : flow;
    const zip = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$jszip$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
    zip.file("project.json", JSON.stringify(flowWithBindings, null, 2));
    const assets = flowWithBindings.assets ?? [];
    for (const asset of assets){
        const blob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAssetBlob"])(asset.id);
        if (!blob) throw new Error(`アセットが見つかりません: ${asset.fileName}`);
        zip.file(`assets/${asset.storedFileName}`, blob);
    }
    const zipBlob = await zip.generateAsync({
        type: "blob"
    });
    const handle = await showSaveFilePickerCompat();
    if (!handle) {
        downloadBlob(zipBlob, "wiislide.zip");
        return;
    }
    const writable = await handle.createWritable();
    await writable.write(zipBlob);
    await writable.close();
}
async function loadProjectFromZipFile(file) {
    const zip = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$jszip$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].loadAsync(file);
    const projectText = await zip.file("project.json")?.async("string");
    if (!projectText) throw new Error("project.json が見つかりません");
    const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tryParseFlowJson"])(projectText);
    if (!parsed) throw new Error("project.json の形式が不正です");
    const assets = parsed.assets ?? [];
    for (const asset of assets){
        const entry = zip.file(`assets/${asset.storedFileName}`);
        if (!entry) throw new Error(`assets/${asset.storedFileName} が見つかりません`);
        const blob = await entry.async("blob");
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["putAssetBlob"])(asset.id, blob);
    }
    if (parsed.projectBindings) {
        const projectId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$currentProjectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentProjectId"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectBindingsStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveProjectBindings"])(projectId, parsed.projectBindings);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveToLocalStorage"])(parsed);
    return parsed;
}
async function loadProjectFromZip() {
    const file = await showOpenFilePickerCompat();
    if (!file) throw new Error("ファイルが選択されませんでした");
    return await loadProjectFromZipFile(file);
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
"[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectArchive$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/projectArchive.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$hooks$2f$useWiiController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/hooks/useWiiController.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function Home() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { wiiConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$hooks$2f$useWiiController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWiiController"])();
    const [isDark, setIsDark] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            setIsDark(mediaQuery.matches);
            const handleChange = {
                "Home.useEffect.handleChange": (e)=>{
                    setIsDark(e.matches);
                }
            }["Home.useEffect.handleChange"];
            mediaQuery.addEventListener("change", handleChange);
            return ({
                "Home.useEffect": ()=>mediaQuery.removeEventListener("change", handleChange)
            })["Home.useEffect"];
        }
    }["Home.useEffect"], []);
    const onLoadProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Home.useCallback[onLoadProject]": async ()=>{
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectArchive$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadProjectFromZip"])();
                router.push("/editor");
            } catch (e) {
                alert(`読み込みに失敗しました: ${e instanceof Error ? e.message : String(e)}`);
            }
        }
    }["Home.useCallback[onLoadProject]"], [
        router
    ]);
    const menuItems = [
        {
            label: "エディタを開く",
            href: "/editor",
            icon: "✏️"
        },
        {
            label: "発表モードを開く",
            href: "/present",
            icon: "📽️"
        },
        {
            label: "プロジェクトの読み込み",
            action: onLoadProject,
            icon: "📂"
        },
        {
            label: "ムービーを見る",
            href: "/movie",
            icon: "🎬"
        }
    ];
    const colors = {
        bg: isDark ? "#000000" : "#FFFFFF",
        text: isDark ? "#FFFFFF" : "#000000",
        button: isDark ? "#333333" : "#FFFFFF",
        border: isDark ? "#FFFFFF" : "#000000",
        buttonBorder: "#87CEEB",
        buttonHoverBg: "#87CEEB",
        buttonHoverText: isDark ? "#000000" : "#000000",
        disconnectedText: isDark ? "#cacacaff" : "#454545ff",
        wiiRemoteImage: isDark ? "/phKuro 3.png" : "/phShiro 3.png",
        lineBorder: "#87CEEB",
        headerFooterBg: isDark ? "#333333" : "#F5F5F5"
    };
    const buttonBaseStyle = {
        border: `3px solid ${colors.buttonBorder}`,
        backgroundColor: colors.button,
        borderRadius: "80px",
        padding: "70px 50px",
        fontSize: "25px",
        fontWeight: "bold",
        cursor: "pointer",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        fontFamily: "var(--font-geist-sans)",
        height: "120px",
        width: "420px",
        boxShadow: "0 0 10px rgba(135, 206, 235, 0.5), 0 0 20px rgba(135, 206, 235, 0.5)"
    };
    const smallButtonStyle = {
        ...buttonBaseStyle,
        padding: "12px 24px",
        fontSize: "18px",
        height: "60px",
        width: "150px"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        style: {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            fontFamily: "var(--font-geist-sans)",
            backgroundColor: colors.bg,
            color: colors.text
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "20px 40px",
                    borderBottom: `2px solid ${colors.lineBorder}`,
                    backgroundColor: colors.headerFooterBg
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        style: {
                            fontSize: "48px",
                            fontWeight: "700",
                            margin: "0",
                            color: colors.text
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: "ContinuumBold, sans-serif"
                                },
                                children: "Wii"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                                lineNumber: 106,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: "ContinuumMedium, sans-serif"
                                },
                                children: "Can"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                                lineNumber: 107,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                        lineNumber: 100,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "10px"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/how-to-use",
                            style: {
                                ...smallButtonStyle,
                                textDecoration: "none",
                                color: colors.text
                            },
                            onMouseEnter: (e)=>{
                                e.currentTarget.style.backgroundColor = colors.buttonHoverBg;
                                e.currentTarget.style.color = colors.buttonHoverText;
                            },
                            onMouseLeave: (e)=>{
                                e.currentTarget.style.backgroundColor = colors.button;
                                e.currentTarget.style.color = colors.text;
                            },
                            children: "📓使い方"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                            lineNumber: 116,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                        lineNumber: 110,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                lineNumber: 92,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                style: {
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "30px",
                        maxWidth: "800px",
                        width: "100%"
                    },
                    children: menuItems.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                justifyContent: "center"
                            },
                            children: item.action ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: item.action,
                                style: {
                                    ...buttonBaseStyle,
                                    color: colors.text
                                },
                                onMouseEnter: (e)=>{
                                    e.currentTarget.style.backgroundColor = colors.buttonHoverBg;
                                    e.currentTarget.style.color = colors.buttonHoverText;
                                },
                                onMouseLeave: (e)=>{
                                    e.currentTarget.style.backgroundColor = colors.button;
                                    e.currentTarget.style.color = colors.text;
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            marginRight: "8px"
                                        },
                                        children: item.icon
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                                        lineNumber: 169,
                                        columnNumber: 37
                                    }, this),
                                    item.label
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                                lineNumber: 154,
                                columnNumber: 33
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                style: {
                                    ...buttonBaseStyle,
                                    color: colors.text,
                                    textDecoration: "none"
                                },
                                onMouseEnter: (e)=>{
                                    e.currentTarget.style.backgroundColor = colors.buttonHoverBg;
                                    e.currentTarget.style.color = colors.buttonHoverText;
                                },
                                onMouseLeave: (e)=>{
                                    e.currentTarget.style.backgroundColor = colors.button;
                                    e.currentTarget.style.color = colors.text;
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            marginRight: "8px"
                                        },
                                        children: item.icon
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                                        lineNumber: 188,
                                        columnNumber: 37
                                    }, this),
                                    item.label
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                                lineNumber: 173,
                                columnNumber: 33
                            }, this)
                        }, index, false, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                            lineNumber: 152,
                            columnNumber: 25
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                    lineNumber: 144,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                lineNumber: 137,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 40px",
                    borderTop: `2px solid ${colors.lineBorder}`,
                    backgroundColor: colors.headerFooterBg,
                    maxHeight: "80px",
                    gap: "10px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: colors.wiiRemoteImage,
                                alt: "Wii Remote",
                                style: {
                                    width: "90px",
                                    height: "200px",
                                    opacity: wiiConnected ? 1 : 0.5
                                }
                            }, void 0, false, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                                lineNumber: 208,
                                columnNumber: 6
                            }, this),
                            wiiConnected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    color: colors.text
                                },
                                children: "1P🔋"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                                lineNumber: 218,
                                columnNumber: 25
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: "16px",
                                    color: colors.disconnectedText,
                                    opacity: 0.7
                                },
                                children: "Wiiリモコン未接続…"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                                lineNumber: 226,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                        lineNumber: 207,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: isDark ? "/stevenShiro.png" : "/stevenKuro.png",
                        alt: "Logo",
                        style: {
                            width: "100px",
                            height: "26px"
                        }
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                        lineNumber: 236,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                lineNumber: 197,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
        lineNumber: 84,
        columnNumber: 9
    }, this);
}
_s(Home, "Fo7Uxqfm2nPI9sElAIsrBXv9V7o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$hooks$2f$useWiiController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWiiController"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_WiiSugeee_frontend_src_6fc7832b._.js.map