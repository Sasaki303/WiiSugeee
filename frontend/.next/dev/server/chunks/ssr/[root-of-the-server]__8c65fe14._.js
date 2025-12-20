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
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

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
"[project]/Desktop/WiiSugeee/frontend/src/lib/projectArchive.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "loadProjectFromZip",
    ()=>loadProjectFromZip,
    "loadProjectFromZipFile",
    ()=>loadProjectFromZipFile,
    "saveProjectAsZip",
    ()=>saveProjectAsZip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$jszip$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/jszip/lib/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/idbAssets.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/presentation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$currentProjectStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/currentProjectStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectBindingsStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/projectBindingsStorage.ts [app-ssr] (ecmascript)");
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
    // ★追加: localStorageから最新のボタンバインド設定を取得してflowに含める
    const latestBindings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$currentProjectStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProjectBindings"])();
    const flowWithBindings = latestBindings ? {
        ...flow,
        projectBindings: latestBindings
    } : flow;
    const zip = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$jszip$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
    zip.file("project.json", JSON.stringify(flowWithBindings, null, 2));
    const assets = flowWithBindings.assets ?? [];
    for (const asset of assets){
        const blob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAssetBlob"])(asset.id);
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
    const zip = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$jszip$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].loadAsync(file);
    const projectText = await zip.file("project.json")?.async("string");
    if (!projectText) throw new Error("project.json が見つかりません");
    const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tryParseFlowJson"])(projectText);
    if (!parsed) throw new Error("project.json の形式が不正です");
    const assets = parsed.assets ?? [];
    for (const asset of assets){
        const entry = zip.file(`assets/${asset.storedFileName}`);
        if (!entry) throw new Error(`assets/${asset.storedFileName} が見つかりません`);
        const blob = await entry.async("blob");
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$idbAssets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["putAssetBlob"])(asset.id, blob);
    }
    // ★追加: ボタンバインド情報をlocalStorageに保存
    if (parsed.projectBindings) {
        const projectId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$currentProjectStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentProjectId"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectBindingsStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveProjectBindings"])(projectId, parsed.projectBindings);
        console.log("ボタンバインド設定を復元しました:", projectId, parsed.projectBindings);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$presentation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveToLocalStorage"])(parsed);
    return parsed;
}
async function loadProjectFromZip() {
    const file = await showOpenFilePickerCompat();
    if (!file) throw new Error("ファイルが選択されませんでした");
    return await loadProjectFromZipFile(file);
}
}),
"[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectArchive$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/WiiSugeee/frontend/src/lib/projectArchive.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function Home() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const onLoadProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$src$2f$lib$2f$projectArchive$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadProjectFromZip"])();
            router.push("/editor");
        } catch (e) {
            alert(`読み込みに失敗しました: ${e instanceof Error ? e.message : String(e)}`);
        }
    }, [
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        style: {
            padding: 16,
            fontFamily: "var(--font-geist-sans)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                style: {
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 12
                },
                children: "Wii Presenter"
            }, void 0, false, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                lineNumber: 24,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                style: {
                    lineHeight: 1.8
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/editor",
                            children: "エディタを開く"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                            lineNumber: 27,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                        lineNumber: 26,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/present",
                            children: "発表モードを開く"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                            lineNumber: 30,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                        lineNumber: 29,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/settings",
                            children: "設定を開く"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                            lineNumber: 33,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                        lineNumber: 32,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onLoadProject,
                            children: "wiislide.zip を読み込み"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                            lineNumber: 36,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                        lineNumber: 35,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                lineNumber: 25,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    marginTop: 12,
                    opacity: 0.75,
                    fontSize: 12
                },
                children: [
                    "保存した ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$WiiSugeee$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                        children: "wiislide.zip"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                        lineNumber: 40,
                        columnNumber: 10
                    }, this),
                    " をそのまま選択して読み込みます（展開不要）。"
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
                lineNumber: 39,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/WiiSugeee/frontend/src/app/page.tsx",
        lineNumber: 23,
        columnNumber: 3
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8c65fe14._.js.map