(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/WiiSugeee/frontend/src/components/editor/nodes/SlideNode.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SlideNode",
    ()=>SlideNode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/@reactflow/core/dist/esm/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function computeBranchKeys(nodeId, rfEdges) {
    const bySource = new Map();
    for (const e of rfEdges){
        const arr = bySource.get(e.source);
        if (arr) arr.push(e);
        else bySource.set(e.source, [
            e
        ]);
    }
    const keys = new Set();
    for (const [, outgoingEdges] of bySource.entries()){
        if (outgoingEdges.length < 2) continue;
        const options = [];
        const used = new Set();
        for (const edge of outgoingEdges){
            const label = String(edge.label ?? "").trim();
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
        const found = options.find((o)=>o.target === nodeId);
        if (found?.key) {
            const numKey = parseInt(found.key, 10);
            if (numKey >= 1 && numKey <= 9) {
                keys.add(String.fromCharCode(64 + numKey));
            }
        }
    }
    return Array.from(keys).sort();
}
function ThumbnailPreview({ data }) {
    const previewStyle = {
        width: "100%",
        height: 160,
        objectFit: "cover",
        borderRadius: 6
    };
    const placeholderStyle = {
        width: "100%",
        height: 160,
        borderRadius: 6,
        background: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12
    };
    if (data.asset?.thumbnailDataUrl) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            alt: data.label,
            src: data.asset.thumbnailDataUrl,
            style: previewStyle
        }, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/nodes/SlideNode.tsx",
            lineNumber: 73,
            columnNumber: 10
        }, this);
    }
    if (data.asset?.kind === "image") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: placeholderStyle,
            children: [
                "画像: ",
                data.asset.fileName
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/nodes/SlideNode.tsx",
            lineNumber: 77,
            columnNumber: 10
        }, this);
    }
    if (data.asset?.kind === "video") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: placeholderStyle,
            children: [
                "動画: ",
                data.asset.fileName
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/nodes/SlideNode.tsx",
            lineNumber: 81,
            columnNumber: 10
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: placeholderStyle,
        children: "(ここにサムネイル)"
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/nodes/SlideNode.tsx",
        lineNumber: 84,
        columnNumber: 9
    }, this);
}
_c = ThumbnailPreview;
function SlideNode({ id, data, selected }) {
    _s();
    const rfEdges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "SlideNode.useStore[rfEdges]": (s)=>s.edges
    }["SlideNode.useStore[rfEdges]"]);
    const branchKeys = computeBranchKeys(id, rfEdges);
    const isConnectableMedia = data.asset?.kind === "pdf" || data.asset?.kind === "video" || data.asset?.kind === "image";
    const handleStyle = {
        width: 28,
        height: 28,
        borderRadius: 999,
        background: "#fff",
        border: "2px solid #666"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "relative",
            width: 260,
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 8,
            background: selected ? "#fafafa" : "white"
        },
        children: [
            isConnectableMedia && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Handle"], {
                        type: "target",
                        position: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Position"].Left,
                        style: {
                            ...handleStyle,
                            left: -18,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#111"
                        },
                        children: branchKeys.length > 0 ? branchKeys.join("/") : null
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/nodes/SlideNode.tsx",
                        lineNumber: 115,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Handle"], {
                        type: "source",
                        position: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Position"].Right,
                        style: {
                            ...handleStyle,
                            right: -18
                        }
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/nodes/SlideNode.tsx",
                        lineNumber: 131,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 6
                },
                children: data.label
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/nodes/SlideNode.tsx",
                lineNumber: 134,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThumbnailPreview, {
                data: data
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/nodes/SlideNode.tsx",
                lineNumber: 135,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/nodes/SlideNode.tsx",
        lineNumber: 103,
        columnNumber: 3
    }, this);
}
_s(SlideNode, "zF+9cgf0QqOPb3a621RKkOn1/zQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"]
    ];
});
_c1 = SlideNode;
var _c, _c1;
__turbopack_context__.k.register(_c, "ThumbnailPreview");
__turbopack_context__.k.register(_c1, "SlideNode");
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
        } catch  {
        // fallthrough
        }
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
"[project]/Desktop/WiiSugeee/frontend/src/lib/projectFolder.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAssetMeta",
    ()=>createAssetMeta,
    "loadProjectFromWiislideFolder",
    ()=>loadProjectFromWiislideFolder,
    "saveProjectToWiislideFolder",
    ()=>saveProjectToWiislideFolder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/idbAssets.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/presentation.ts [app-client] (ecmascript)");
;
;
function sanitizeFileName(name) {
    return name.replaceAll(/[^a-zA-Z0-9._-]+/g, "_");
}
async function showDirectoryPickerCompat() {
    const w = window;
    if (!w.showDirectoryPicker) throw new Error("showDirectoryPicker is not supported");
    return await w.showDirectoryPicker({
        id: "wiislide",
        mode: "readwrite",
        startIn: "desktop"
    });
}
async function ensureWiislideDir(root) {
    if (root.name === "wiislide") return root;
    return await root.getDirectoryHandle("wiislide", {
        create: true
    });
}
async function ensureAssetsDir(wiislideDir) {
    return await wiislideDir.getDirectoryHandle("assets", {
        create: true
    });
}
async function writeTextFile(dir, name, text) {
    const fh = await dir.getFileHandle(name, {
        create: true
    });
    const writable = await fh.createWritable();
    await writable.write(text);
    await writable.close();
}
async function writeBlobFile(dir, name, blob) {
    const fh = await dir.getFileHandle(name, {
        create: true
    });
    const writable = await fh.createWritable();
    await writable.write(blob);
    await writable.close();
}
async function readTextFile(dir, name) {
    const fh = await dir.getFileHandle(name);
    const file = await fh.getFile();
    return await file.text();
}
async function readBlobFile(dir, name) {
    const fh = await dir.getFileHandle(name);
    const file = await fh.getFile();
    return file;
}
function createAssetMeta(kind, originalFileName, assetId) {
    const safe = sanitizeFileName(originalFileName);
    return {
        id: assetId,
        kind,
        fileName: originalFileName,
        storedFileName: `${assetId}_${safe}`
    };
}
async function saveProjectToWiislideFolder() {
    const flow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadFromLocalStorage"])();
    if (!flow) throw new Error("プロジェクトがありません");
    const rootDir = await showDirectoryPickerCompat();
    const wiislideDir = await ensureWiislideDir(rootDir);
    const assetsDir = await ensureAssetsDir(wiislideDir);
    const assets = flow.assets ?? [];
    for (const asset of assets){
        const blob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAssetBlob"])(asset.id);
        if (!blob) {
            throw new Error(`アセットが見つかりません: ${asset.fileName}`);
        }
        await writeBlobFile(assetsDir, asset.storedFileName, blob);
    }
    await writeTextFile(wiislideDir, "project.json", JSON.stringify(flow, null, 2));
}
async function loadProjectFromWiislideFolder() {
    const rootDir = await showDirectoryPickerCompat();
    const wiislideDir = rootDir.name === "wiislide" ? rootDir : await rootDir.getDirectoryHandle("wiislide");
    let assetsDir;
    try {
        assetsDir = await wiislideDir.getDirectoryHandle("assets");
    } catch  {
        assetsDir = await wiislideDir.getDirectoryHandle("assets", {
            create: false
        });
    }
    const text = await readTextFile(wiislideDir, "project.json");
    const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tryParseFlowJson"])(text);
    if (!parsed) throw new Error("project.json の形式が不正です");
    const assets = parsed.assets ?? [];
    for (const asset of assets){
        const blob = await readBlobFile(assetsDir, asset.storedFileName);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["putAssetBlob"])(asset.id, blob);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveToLocalStorage"])(parsed);
    return parsed;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EditorCanvas",
    ()=>EditorCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ReactFlow__as__default$3e$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/@reactflow/core/dist/esm/index.mjs [app-client] (ecmascript) <export ReactFlow as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$controls$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/@reactflow/controls/dist/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$minimap$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/@reactflow/minimap/dist/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/@reactflow/core/dist/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/nanoid/index.browser.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$editor$2f$nodes$2f$SlideNode$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/components/editor/nodes/SlideNode.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/presentation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/idbAssets.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectArchive$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/projectArchive.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectFolder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/projectFolder.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$currentProjectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/currentProjectStore.ts [app-client] (ecmascript)");
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx")}`;
    }
};
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
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
function hashString(input) {
    // djb2
    let hash = 5381;
    for(let i = 0; i < input.length; i++){
        hash = hash * 33 ^ input.charCodeAt(i);
    }
    return (hash >>> 0).toString(16);
}
function computeFlowHash(flow) {
    // viewport は保存対象外なので hash から除外
    const minimal = {
        version: flow.version,
        assets: flow.assets ?? [],
        nodes: flow.nodes,
        edges: flow.edges
    };
    return hashString(JSON.stringify(minimal));
}
const EMPTY_FLOW_HASH = computeFlowHash({
    version: 1,
    assets: [],
    nodes: [],
    edges: []
});
function StarBackground() {
    _s();
    // ReactFlowのパン/ズームに追従
    const [tx, ty, zoom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "StarBackground.useStore": (s)=>s.transform
    }["StarBackground.useStore"]);
    // もともとの <Background /> のデフォルト感に合わせる
    const gap = 25;
    const outer = 1.2;
    const inner = 0.6;
    const cx = gap / 2;
    const cy = gap / 2;
    // 4つの尖りはouter、辺は内側(inner)へ湾曲
    const starPath = `M ${cx} ${cy - outer} Q ${cx + inner} ${cy - inner} ${cx + outer} ${cy} Q ${cx + inner} ${cy + inner} ${cx} ${cy + outer} Q ${cx - inner} ${cy + inner} ${cx - outer} ${cy} Q ${cx - inner} ${cy - inner} ${cx} ${cy - outer} Z`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "react-flow__background",
        "aria-hidden": "true",
        style: {
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            pointerEvents: "none"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pattern", {
                    id: "rf-star-bg",
                    patternUnits: "userSpaceOnUse",
                    width: gap,
                    height: gap,
                    patternTransform: `translate(${tx} ${ty}) scale(${zoom})`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: starPath,
                        fill: "#aaa"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                        lineNumber: 85,
                        columnNumber: 6
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                    lineNumber: 78,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                lineNumber: 77,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                width: "100%",
                height: "100%",
                fill: "url(#rf-star-bg)"
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                lineNumber: 88,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
        lineNumber: 72,
        columnNumber: 3
    }, this);
}
_s(StarBackground, "2dTrhopom08YAQuBHczMhbnFzO4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"]
    ];
});
_c = StarBackground;
async function pdfToThumbnails(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjs = await __turbopack_context__.A("[project]/Desktop/WiiSugeee/frontend/node_modules/pdfjs-dist/legacy/build/pdf.mjs [app-client] (ecmascript, async loader)");
    pdfjs.GlobalWorkerOptions.workerSrc = new __turbopack_context__.U(__turbopack_context__.r("[project]/Desktop/WiiSugeee/frontend/node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs (static in ecmascript)")).toString();
    const loadingTask = pdfjs.getDocument({
        data: arrayBuffer
    });
    const pdf = await loadingTask.promise;
    const results = [];
    for(let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++){
        const page = await pdf.getPage(pageIndex);
        const viewport = page.getViewport({
            scale: 1
        });
        const targetWidth = 240;
        const scale = targetWidth / viewport.width;
        const scaledViewport = page.getViewport({
            scale
        });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(scaledViewport.width);
        canvas.height = Math.floor(scaledViewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            results.push({
                page: pageIndex
            });
            continue;
        }
        await page.render({
            canvasContext: ctx,
            canvas,
            viewport: scaledViewport
        }).promise;
        results.push({
            page: pageIndex,
            dataUrl: canvas.toDataURL("image/png")
        });
    }
    return results;
}
async function videoToThumbnailDataUrl(file) {
    const url = URL.createObjectURL(file);
    try {
        const video = document.createElement("video");
        video.src = url;
        video.muted = true;
        video.playsInline = true;
        video.preload = "metadata";
        await new Promise((resolve, reject)=>{
            video.onloadedmetadata = ()=>resolve();
            video.onerror = ()=>reject(new Error("動画の読み込みに失敗しました"));
        });
        const duration = Number.isFinite(video.duration) ? video.duration : 0;
        const targetTime = duration > 0 ? Math.min(0.1, Math.max(0, duration - 0.01)) : 0;
        if (targetTime > 0) {
            video.currentTime = targetTime;
            await new Promise((resolve, reject)=>{
                video.onseeked = ()=>resolve();
                video.onerror = ()=>reject(new Error("動画のシークに失敗しました"));
            });
        }
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        if (!vw || !vh) return undefined;
        const targetWidth = 240;
        const scale = targetWidth / vw;
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = Math.max(1, Math.floor(vh * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) return undefined;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg", 0.5);
    } finally{
        URL.revokeObjectURL(url);
    }
}
async function imageToThumbnailDataUrl(file) {
    const url = URL.createObjectURL(file);
    try {
        const img = document.createElement("img");
        img.decoding = "async";
        img.src = url;
        await new Promise((resolve, reject)=>{
            img.onload = ()=>resolve();
            img.onerror = ()=>reject(new Error("画像の読み込みに失敗しました"));
        });
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        if (!iw || !ih) return undefined;
        const targetWidth = 240;
        const scale = targetWidth / iw;
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = Math.max(1, Math.floor(ih * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) return undefined;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg", 0.6);
    } finally{
        URL.revokeObjectURL(url);
    }
}
function flowFromState(nodes, edges, assets) {
    const flow = {
        version: 1,
        assets,
        nodes: nodes.map((node)=>({
                id: node.id,
                type: node.type,
                position: node.position,
                data: node.data
            })),
        edges: edges.map((edge)=>({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                label: typeof edge.label === "string" ? edge.label : undefined
            }))
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$currentProjectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCurrentFlow"])(flow);
    return flow;
}
function stateFromFlow(flow) {
    return {
        nodes: flow.nodes.map((node)=>({
                id: node.id,
                type: node.type,
                position: node.position,
                data: node.data
            })),
        edges: flow.edges.map((edge)=>({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                label: edge.label
            }))
    };
}
function InnerEditor() {
    _s1();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const wrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { setViewport, getViewport, setCenter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReactFlow"])();
    const [nodes, setNodes, onNodesChange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNodesState"])([]);
    const [edges, setEdges, onEdgesChange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEdgesState"])([]);
    const [assets, setAssets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isHydrated, setIsHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isImporting, setIsImporting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedNodeIds, setSelectedNodeIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedEdgeIds, setSelectedEdgeIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showLeaveWarning, setShowLeaveWarning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastSavedHash, setLastSavedHashState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const nodeTypes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "InnerEditor.useMemo[nodeTypes]": ()=>({
                slide: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$components$2f$editor$2f$nodes$2f$SlideNode$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SlideNode"]
            })
    }["InnerEditor.useMemo[nodeTypes]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InnerEditor.useEffect": ()=>{
            const persistedLastSavedHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLastSavedHash"])();
            setLastSavedHashState(persistedLastSavedHash);
            const saved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadFromLocalStorage"])();
            if (!saved) {
                setAssets([]);
                setNodes([]);
                setEdges([]);
                setIsHydrated(true);
                return;
            }
            // 過去バージョンで「Start」スライドが自動生成されていた場合、未保存プロジェクトであれば
            // それを“空キャンバス”として扱って、エディタ突入時に Start が出ないようにする。
            const looksLikeLegacyAutoStart = !persistedLastSavedHash && (saved.assets?.length ?? 0) === 0 && saved.nodes.length === 1 && saved.edges.length === 0 && saved.nodes[0]?.type === "slide" && saved.nodes[0]?.data?.label === "Start";
            if (looksLikeLegacyAutoStart) {
                setAssets([]);
                setNodes([]);
                setEdges([]);
                if (saved.viewport) {
                    setViewport(saved.viewport);
                }
                setIsHydrated(true);
                return;
            }
            setAssets(saved.assets ?? []);
            const { nodes: restoredNodes, edges: restoredEdges } = stateFromFlow(saved);
            setNodes(restoredNodes);
            setEdges(restoredEdges);
            if (saved.viewport) {
                setViewport(saved.viewport);
            }
            setIsHydrated(true);
        }
    }["InnerEditor.useEffect"], [
        setEdges,
        setNodes,
        setViewport
    ]);
    const currentFlowHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "InnerEditor.useMemo[currentFlowHash]": ()=>{
            const flow = flowFromState(nodes, edges, assets);
            return computeFlowHash(flow);
        }
    }["InnerEditor.useMemo[currentFlowHash]"], [
        assets,
        edges,
        nodes
    ]);
    const isDirty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "InnerEditor.useMemo[isDirty]": ()=>{
            if (!isHydrated) return false;
            if (lastSavedHash) return currentFlowHash !== lastSavedHash;
            return currentFlowHash !== EMPTY_FLOW_HASH;
        }
    }["InnerEditor.useMemo[isDirty]"], [
        currentFlowHash,
        isHydrated,
        lastSavedHash
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InnerEditor.useEffect": ()=>{
            if (!isHydrated) return;
            const flow = flowFromState(nodes, edges, assets);
            const currentViewport = getViewport();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveToLocalStorage"])({
                ...flow,
                viewport: currentViewport
            });
        }
    }["InnerEditor.useEffect"], [
        nodes,
        edges,
        assets,
        getViewport,
        isHydrated
    ]);
    const onConnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InnerEditor.useCallback[onConnect]": (connection)=>{
            setEdges({
                "InnerEditor.useCallback[onConnect]": (eds)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addEdge"])({
                        ...connection,
                        label: ""
                    }, eds)
            }["InnerEditor.useCallback[onConnect]"]);
        }
    }["InnerEditor.useCallback[onConnect]"], [
        setEdges
    ]);
    const onSelectionChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InnerEditor.useCallback[onSelectionChange]": (params)=>{
            setSelectedNodeIds(params.nodes.map({
                "InnerEditor.useCallback[onSelectionChange]": (n)=>n.id
            }["InnerEditor.useCallback[onSelectionChange]"]));
            setSelectedEdgeIds(params.edges.map({
                "InnerEditor.useCallback[onSelectionChange]": (e)=>e.id
            }["InnerEditor.useCallback[onSelectionChange]"]));
        }
    }["InnerEditor.useCallback[onSelectionChange]"], []);
    const addSlideNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InnerEditor.useCallback[addSlideNode]": ()=>{
            setNodes({
                "InnerEditor.useCallback[addSlideNode]": (prev)=>{
                    const maxY = prev.reduce({
                        "InnerEditor.useCallback[addSlideNode].maxY": (acc, n)=>Math.max(acc, n.position.y)
                    }["InnerEditor.useCallback[addSlideNode].maxY"], 0);
                    return [
                        ...prev,
                        {
                            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                            type: "slide",
                            position: {
                                x: 420,
                                y: maxY + 220
                            },
                            data: {
                                label: "Slide"
                            }
                        }
                    ];
                }
            }["InnerEditor.useCallback[addSlideNode]"]);
        }
    }["InnerEditor.useCallback[addSlideNode]"], [
        setNodes
    ]);
    const deleteSelected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InnerEditor.useCallback[deleteSelected]": ()=>{
            if (selectedNodeIds.length === 0 && selectedEdgeIds.length === 0) return;
            setEdges({
                "InnerEditor.useCallback[deleteSelected]": (prevEdges)=>{
                    const nodeIdSet = new Set(selectedNodeIds);
                    const edgeIdSet = new Set(selectedEdgeIds);
                    return prevEdges.filter({
                        "InnerEditor.useCallback[deleteSelected]": (e)=>!edgeIdSet.has(e.id) && !nodeIdSet.has(e.source) && !nodeIdSet.has(e.target)
                    }["InnerEditor.useCallback[deleteSelected]"]);
                }
            }["InnerEditor.useCallback[deleteSelected]"]);
            setNodes({
                "InnerEditor.useCallback[deleteSelected]": (prevNodes)=>prevNodes.filter({
                        "InnerEditor.useCallback[deleteSelected]": (n)=>!selectedNodeIds.includes(n.id)
                    }["InnerEditor.useCallback[deleteSelected]"])
            }["InnerEditor.useCallback[deleteSelected]"]);
            setSelectedNodeIds([]);
            setSelectedEdgeIds([]);
        }
    }["InnerEditor.useCallback[deleteSelected]"], [
        selectedEdgeIds,
        selectedNodeIds,
        setEdges,
        setNodes
    ]);
    const selectedNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "InnerEditor.useMemo[selectedNode]": ()=>{
            if (selectedNodeIds.length !== 1) return null;
            return nodes.find({
                "InnerEditor.useMemo[selectedNode]": (n)=>n.id === selectedNodeIds[0]
            }["InnerEditor.useMemo[selectedNode]"]) ?? null;
        }
    }["InnerEditor.useMemo[selectedNode]"], [
        nodes,
        selectedNodeIds
    ]);
    const selectedEdge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "InnerEditor.useMemo[selectedEdge]": ()=>{
            if (selectedEdgeIds.length !== 1) return null;
            return edges.find({
                "InnerEditor.useMemo[selectedEdge]": (e)=>e.id === selectedEdgeIds[0]
            }["InnerEditor.useMemo[selectedEdge]"]) ?? null;
        }
    }["InnerEditor.useMemo[selectedEdge]"], [
        edges,
        selectedEdgeIds
    ]);
    const updateSelectedNodeLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InnerEditor.useCallback[updateSelectedNodeLabel]": (nextLabel)=>{
            if (!selectedNode) return;
            setNodes({
                "InnerEditor.useCallback[updateSelectedNodeLabel]": (prev)=>prev.map({
                        "InnerEditor.useCallback[updateSelectedNodeLabel]": (n)=>n.id === selectedNode.id ? {
                                ...n,
                                data: {
                                    ...n.data,
                                    label: nextLabel
                                }
                            } : n
                    }["InnerEditor.useCallback[updateSelectedNodeLabel]"])
            }["InnerEditor.useCallback[updateSelectedNodeLabel]"]);
        }
    }["InnerEditor.useCallback[updateSelectedNodeLabel]"], [
        selectedNode,
        setNodes
    ]);
    const updateSelectedEdgeLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InnerEditor.useCallback[updateSelectedEdgeLabel]": (nextLabel)=>{
            if (!selectedEdge) return;
            setEdges({
                "InnerEditor.useCallback[updateSelectedEdgeLabel]": (prev)=>prev.map({
                        "InnerEditor.useCallback[updateSelectedEdgeLabel]": (e)=>e.id === selectedEdge.id ? {
                                ...e,
                                label: nextLabel
                            } : e
                    }["InnerEditor.useCallback[updateSelectedEdgeLabel]"])
            }["InnerEditor.useCallback[updateSelectedEdgeLabel]"]);
        }
    }["InnerEditor.useCallback[updateSelectedEdgeLabel]"], [
        selectedEdge,
        setEdges
    ]);
    const importFiles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InnerEditor.useCallback[importFiles]": async (files)=>{
            const fileArray = Array.from(files);
            if (fileArray.length === 0) return;
            setIsImporting(true);
            try {
                const baseX = 80;
                const xStep = 320;
                const maxExistingY = nodes.reduce({
                    "InnerEditor.useCallback[importFiles].maxExistingY": (acc, n)=>Math.max(acc, n.position.y)
                }["InnerEditor.useCallback[importFiles].maxExistingY"], 0);
                let rowY = nodes.length > 0 ? maxExistingY + 220 : 80;
                const newlyAddedAssets = [];
                const newlyAddedNodes = [];
                const newlyAddedEdges = [];
                for (const file of fileArray){
                    const name = file.name;
                    const lower = name.toLowerCase();
                    if (lower.endsWith(".pdf")) {
                        const assetId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["putAssetBlob"])(assetId, file);
                        newlyAddedAssets.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectFolder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAssetMeta"])("pdf", name, assetId));
                        const thumbs = await pdfToThumbnails(file);
                        const pdfNodes = thumbs.map({
                            "InnerEditor.useCallback[importFiles].pdfNodes": (thumb, index)=>{
                                const nodeId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
                                return {
                                    id: nodeId,
                                    type: "slide",
                                    position: {
                                        x: baseX + index * xStep,
                                        y: rowY
                                    },
                                    data: {
                                        label: `PDF: ${name} / p${thumb.page}`,
                                        asset: {
                                            kind: "pdf",
                                            assetId,
                                            fileName: name,
                                            page: thumb.page,
                                            thumbnailDataUrl: thumb.dataUrl
                                        }
                                    }
                                };
                            }
                        }["InnerEditor.useCallback[importFiles].pdfNodes"]);
                        for(let i = 0; i < pdfNodes.length - 1; i++){
                            newlyAddedEdges.push({
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                                source: pdfNodes[i].id,
                                target: pdfNodes[i + 1].id,
                                label: ""
                            });
                        }
                        newlyAddedNodes.push(...pdfNodes);
                        rowY += 220;
                        continue;
                    }
                    if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
                        const assetId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["putAssetBlob"])(assetId, file);
                        newlyAddedAssets.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectFolder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAssetMeta"])("image", name, assetId));
                        let thumbnailDataUrl;
                        try {
                            thumbnailDataUrl = await imageToThumbnailDataUrl(file);
                        } catch  {
                            thumbnailDataUrl = undefined;
                        }
                        newlyAddedNodes.push({
                            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                            type: "slide",
                            position: {
                                x: baseX,
                                y: rowY
                            },
                            data: {
                                label: `IMG: ${name}`,
                                asset: {
                                    kind: "image",
                                    assetId,
                                    fileName: name,
                                    thumbnailDataUrl
                                }
                            }
                        });
                        rowY += 220;
                        continue;
                    }
                    if (lower.endsWith(".mp4")) {
                        const assetId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["putAssetBlob"])(assetId, file);
                        newlyAddedAssets.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectFolder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAssetMeta"])("video", name, assetId));
                        let thumbnailDataUrl;
                        try {
                            thumbnailDataUrl = await videoToThumbnailDataUrl(file);
                        } catch  {
                            thumbnailDataUrl = undefined;
                        }
                        newlyAddedNodes.push({
                            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                            type: "slide",
                            position: {
                                x: baseX,
                                y: rowY
                            },
                            data: {
                                label: `VIDEO: ${name}`,
                                asset: {
                                    kind: "video",
                                    assetId,
                                    fileName: name,
                                    thumbnailDataUrl
                                }
                            }
                        });
                        rowY += 220;
                        continue;
                    }
                }
                if (newlyAddedNodes.length > 0) {
                    setNodes({
                        "InnerEditor.useCallback[importFiles]": (prev)=>[
                                ...prev,
                                ...newlyAddedNodes
                            ]
                    }["InnerEditor.useCallback[importFiles]"]);
                }
                if (newlyAddedEdges.length > 0) {
                    setEdges({
                        "InnerEditor.useCallback[importFiles]": (prev)=>[
                                ...prev,
                                ...newlyAddedEdges
                            ]
                    }["InnerEditor.useCallback[importFiles]"]);
                }
                if (newlyAddedAssets.length > 0) {
                    setAssets({
                        "InnerEditor.useCallback[importFiles]": (prev)=>[
                                ...prev,
                                ...newlyAddedAssets
                            ]
                    }["InnerEditor.useCallback[importFiles]"]);
                }
            } finally{
                setIsImporting(false);
            }
        }
    }["InnerEditor.useCallback[importFiles]"], [
        nodes,
        setEdges,
        setNodes
    ]);
    const onDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InnerEditor.useCallback[onDrop]": async (event)=>{
            event.preventDefault();
            const files = event.dataTransfer?.files;
            if (!files?.length) return;
            if (files.length === 1) {
                const file = files[0];
                if (file && file.name.toLowerCase().endsWith(".zip")) {
                    try {
                        const loaded = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectArchive$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadProjectFromZipFile"])(file);
                        const loadedHash = computeFlowHash(loaded);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLastSavedHash"])(loadedHash);
                        setLastSavedHashState(loadedHash);
                        setAssets(loaded.assets ?? []);
                        const { nodes: restoredNodes, edges: restoredEdges } = stateFromFlow(loaded);
                        setNodes(restoredNodes);
                        setEdges(restoredEdges);
                    } catch (e) {
                        alert(`読み込みに失敗しました: ${e instanceof Error ? e.message : String(e)}`);
                    }
                    return;
                }
            }
            await importFiles(files);
        }
    }["InnerEditor.useCallback[onDrop]"], [
        importFiles,
        setEdges,
        setNodes
    ]);
    const onDragOver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InnerEditor.useCallback[onDragOver]": (event)=>{
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
        }
    }["InnerEditor.useCallback[onDragOver]"], []);
    const onSaveProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InnerEditor.useCallback[onSaveProject]": async ()=>{
            try {
                const flow = flowFromState(nodes, edges, assets);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveToLocalStorage"])(flow);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectArchive$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveProjectAsZip"])(flow);
                const savedHash = computeFlowHash(flow);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLastSavedHash"])(savedHash);
                setLastSavedHashState(savedHash);
                alert("wiislide.zip を保存しました");
            } catch (e) {
                alert(`保存に失敗しました: ${e instanceof Error ? e.message : String(e)}`);
            }
        }
    }["InnerEditor.useCallback[onSaveProject]"], [
        assets,
        edges,
        nodes
    ]);
    const onLoadProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InnerEditor.useCallback[onLoadProject]": async ()=>{
            try {
                const loaded = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectArchive$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadProjectFromZip"])();
                const loadedHash = computeFlowHash(loaded);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLastSavedHash"])(loadedHash);
                setLastSavedHashState(loadedHash);
                setAssets(loaded.assets ?? []);
                const { nodes: restoredNodes, edges: restoredEdges } = stateFromFlow(loaded);
                setNodes(restoredNodes);
                setEdges(restoredEdges);
            } catch (e) {
                alert(`読み込みに失敗しました: ${e instanceof Error ? e.message : String(e)}`);
            }
        }
    }["InnerEditor.useCallback[onLoadProject]"], [
        setEdges,
        setNodes
    ]);
    const onImportClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InnerEditor.useCallback[onImportClick]": async ()=>{
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".pdf,.mp4,.png,.jpg,.jpeg";
            input.multiple = true;
            input.onchange = ({
                "InnerEditor.useCallback[onImportClick]": async ()=>{
                    if (!input.files?.length) return;
                    await importFiles(input.files);
                }
            })["InnerEditor.useCallback[onImportClick]"];
            input.click();
        }
    }["InnerEditor.useCallback[onImportClick]"], [
        importFiles
    ]);
    const clearAndGoHome = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InnerEditor.useCallback[clearAndGoHome]": async ()=>{
            try {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearEditorStorage"])();
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAllAssetBlobs"])();
            } finally{
                router.push("/");
            }
        }
    }["InnerEditor.useCallback[clearAndGoHome]"], [
        router
    ]);
    const onHomeClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InnerEditor.useCallback[onHomeClick]": ()=>{
            if (isDirty) {
                setShowLeaveWarning(true);
                return;
            }
            void clearAndGoHome();
        }
    }["InnerEditor.useCallback[onHomeClick]"], [
        clearAndGoHome,
        isDirty
    ]);
    const goPresent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InnerEditor.useCallback[goPresent]": ()=>{
            router.push("/present?from=editor");
        }
    }["InnerEditor.useCallback[goPresent]"], [
        router
    ]);
    const goSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InnerEditor.useCallback[goSettings]": ()=>{
            router.push("/settings");
        }
    }["InnerEditor.useCallback[goSettings]"], [
        router
    ]);
    const iconStyle = {
        width: 16,
        height: 16,
        display: "inline-block",
        flex: "0 0 auto"
    };
    const buttonStyle = {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 32,
        padding: "0 10px"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: wrapperRef,
        onDrop: onDrop,
        onDragOver: onDragOver,
        style: {
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 8,
                    padding: 8,
                    borderBottom: "1px solid #eee",
                    alignItems: "center"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onHomeClick,
                        style: buttonStyle,
                        "aria-label": "ホームに戻る",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                style: iconStyle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M3 10.5L12 3l9 7.5"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 652,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M5 10v10h14V10"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 653,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                lineNumber: 651,
                                columnNumber: 6
                            }, this),
                            "ホーム"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                        lineNumber: 650,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: goPresent,
                        style: buttonStyle,
                        "aria-label": "再生",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                fill: "currentColor",
                                style: iconStyle,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M8 5v14l11-7z"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                    lineNumber: 659,
                                    columnNumber: 7
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                lineNumber: 658,
                                columnNumber: 6
                            }, this),
                            "再生"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                        lineNumber: 657,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: goSettings,
                        style: buttonStyle,
                        "aria-label": "設定",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                style: iconStyle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 665,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-1.41 3.41h-.2a2 2 0 0 1-1.41-.59l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 0 1 3 18.07v-.2a2 2 0 0 1 .59-1.41l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2.4a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 0 1 5.02 3h.2a2 2 0 0 1 1.41.59l.06.06a1.65 1.65 0 0 0 1.82.33h0A1.65 1.65 0 0 0 10 2.49V2.4a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06A2 2 0 0 1 20.41 5.02v.2a2 2 0 0 1-.59 1.41l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1h.09a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 666,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                lineNumber: 664,
                                columnNumber: 6
                            }, this),
                            "設定"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                        lineNumber: 663,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onImportClick,
                        disabled: isImporting,
                        style: buttonStyle,
                        "aria-label": "素材取り込み",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                style: iconStyle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M12 21V9"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 672,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M7 14l5-5 5 5"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 673,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M5 3h14v6H5z"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 674,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                lineNumber: 671,
                                columnNumber: 6
                            }, this),
                            isImporting ? "取込中..." : "素材取り込み (D&D可)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                        lineNumber: 670,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: deleteSelected,
                        disabled: selectedNodeIds.length + selectedEdgeIds.length === 0,
                        style: buttonStyle,
                        "aria-label": "選択削除",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                style: iconStyle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M3 6h18"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 685,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M8 6V4h8v2"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 686,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M6 6l1 16h10l1-16"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 687,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                lineNumber: 684,
                                columnNumber: 6
                            }, this),
                            "選択削除"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                        lineNumber: 678,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onSaveProject,
                        style: buttonStyle,
                        "aria-label": "プロジェクト保存",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                style: iconStyle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M12 3v12"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 693,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M7 10l5 5 5-5"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 694,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M5 21h14"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 695,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                lineNumber: 692,
                                columnNumber: 6
                            }, this),
                            "保存"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                        lineNumber: 691,
                        columnNumber: 5
                    }, this),
                    isDirty ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            color: "#b45309"
                        },
                        children: "未保存"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                        lineNumber: 700,
                        columnNumber: 6
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            color: "#16a34a"
                        },
                        children: "保存済み"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                        lineNumber: 702,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginLeft: "auto",
                            fontSize: 12,
                            color: "#666"
                        },
                        children: "ローカル自動保存: ON"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                        lineNumber: 704,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                lineNumber: 641,
                columnNumber: 4
            }, this),
            showLeaveWarning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: 12,
                    borderBottom: "1px solid #eee",
                    background: "#fff7ed",
                    color: "#7c2d12",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 13,
                            fontWeight: 600
                        },
                        children: "未保存の変更があります。このままホームに戻るとエディタはクリーンになります。"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                        lineNumber: 722,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: 8,
                            marginLeft: "auto"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: async ()=>{
                                    await onSaveProject();
                                    setShowLeaveWarning(false);
                                    await clearAndGoHome();
                                },
                                children: "保存してホームへ"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                lineNumber: 726,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: async ()=>{
                                    setShowLeaveWarning(false);
                                    await clearAndGoHome();
                                },
                                children: "破棄してホームへ"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                lineNumber: 735,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowLeaveWarning(false),
                                children: "キャンセル"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                lineNumber: 743,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                        lineNumber: 725,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                lineNumber: 710,
                columnNumber: 5
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    display: "flex",
                    minHeight: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ReactFlow__as__default$3e$__["default"], {
                            nodes: nodes,
                            edges: edges,
                            onNodesChange: onNodesChange,
                            onEdgesChange: onEdgesChange,
                            onConnect: onConnect,
                            onSelectionChange: onSelectionChange,
                            nodeTypes: nodeTypes,
                            minZoom: 0.05,
                            panOnScroll: true,
                            panOnScrollMode: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PanOnScrollMode"].Free,
                            zoomOnScroll: false,
                            selectionOnDrag: true,
                            panOnDrag: [
                                1,
                                2
                            ],
                            fitView: true,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StarBackground, {}, void 0, false, {
                                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                    lineNumber: 766,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$minimap$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MiniMap"], {
                                    position: "bottom-right",
                                    onClick: (_, pos)=>{
                                        const vp = getViewport();
                                        setCenter(pos.x, pos.y, {
                                            zoom: vp.zoom
                                        });
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                    lineNumber: 767,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$controls$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Controls"], {}, void 0, false, {
                                    fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                    lineNumber: 774,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                            lineNumber: 750,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                        lineNumber: 749,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 320,
                            borderLeft: "1px solid #eee",
                            padding: 12,
                            overflow: "auto"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 12,
                                    fontWeight: 700,
                                    marginBottom: 8
                                },
                                children: "Inspector"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                lineNumber: 786,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 12,
                                    color: "#666",
                                    marginBottom: 12
                                },
                                children: [
                                    "選択: ノード ",
                                    selectedNodeIds.length,
                                    " / エッジ ",
                                    selectedEdgeIds.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                lineNumber: 787,
                                columnNumber: 6
                            }, this),
                            selectedNode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 16
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 12,
                                            fontWeight: 600,
                                            marginBottom: 6
                                        },
                                        children: "Node"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 793,
                                        columnNumber: 8
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "block",
                                            fontSize: 12,
                                            marginBottom: 4
                                        },
                                        children: "ラベル"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 794,
                                        columnNumber: 8
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: selectedNode.data.label,
                                        onChange: (e)=>updateSelectedNodeLabel(e.target.value),
                                        style: {
                                            width: "100%"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 795,
                                        columnNumber: 8
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                lineNumber: 792,
                                columnNumber: 7
                            }, this) : null,
                            selectedEdge ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 16
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 12,
                                            fontWeight: 600,
                                            marginBottom: 6
                                        },
                                        children: "Edge"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 805,
                                        columnNumber: 8
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "block",
                                            fontSize: 12,
                                            marginBottom: 4
                                        },
                                        children: "ラベル"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 806,
                                        columnNumber: 8
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: typeof selectedEdge.label === "string" ? selectedEdge.label : "",
                                        onChange: (e)=>updateSelectedEdgeLabel(e.target.value),
                                        style: {
                                            width: "100%"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 807,
                                        columnNumber: 8
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 12,
                                            color: "#666",
                                            marginTop: 6
                                        },
                                        children: "例: next / a / b / timeout"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                        lineNumber: 812,
                                        columnNumber: 8
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                lineNumber: 804,
                                columnNumber: 7
                            }, this) : null,
                            !selectedNode && !selectedEdge ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 12,
                                    color: "#666"
                                },
                                children: "ノードを選択してラベル編集、エッジを選択して分岐名を付けられます。"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                                lineNumber: 819,
                                columnNumber: 7
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                        lineNumber: 778,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
                lineNumber: 748,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
        lineNumber: 635,
        columnNumber: 3
    }, this);
}
_s1(InnerEditor, "I4fArfv3lnbDvoqNxjSP2A3J3/Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReactFlow"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNodesState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEdgesState"]
    ];
});
_c1 = InnerEditor;
function EditorCanvas() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReactFlowProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InnerEditor, {}, void 0, false, {
            fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
            lineNumber: 832,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/components/editor/EditorCanvas.tsx",
        lineNumber: 831,
        columnNumber: 3
    }, this);
}
_c2 = EditorCanvas;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "StarBackground");
__turbopack_context__.k.register(_c1, "InnerEditor");
__turbopack_context__.k.register(_c2, "EditorCanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_WiiSugeee_frontend_src_24ce22a0._.js.map