import { getAssetBlob, putAssetBlob } from "@/lib/idbAssets";
import {
	loadFromLocalStorage,
	saveToLocalStorage,
	tryParseFlowJson,
	type ProjectAsset,
	type SerializedFlow,
} from "@/lib/presentation";

function sanitizeFileName(name: string): string {
	return name.replaceAll(/[^a-zA-Z0-9._-]+/g, "_");
}

async function showDirectoryPickerCompat(): Promise<FileSystemDirectoryHandle> {
	const w = window as unknown as {
		showDirectoryPicker?: (options?: {
			id?: string;
			mode?: "read" | "readwrite";
			startIn?: unknown;
		}) => Promise<FileSystemDirectoryHandle>;
	};
	if (!w.showDirectoryPicker) throw new Error("showDirectoryPicker is not supported");
	// できるだけデスクトップから始めて、誤ってサイト領域を選ぶ事故を減らす
	return await w.showDirectoryPicker({ id: "wiislide", mode: "readwrite", startIn: "desktop" });
}

async function ensureWiislideDir(root: FileSystemDirectoryHandle): Promise<FileSystemDirectoryHandle> {
	if (root.name === "wiislide") return root;
	return await root.getDirectoryHandle("wiislide", { create: true });
}

async function ensureAssetsDir(wiislideDir: FileSystemDirectoryHandle): Promise<FileSystemDirectoryHandle> {
	return await wiislideDir.getDirectoryHandle("assets", { create: true });
}

async function writeTextFile(dir: FileSystemDirectoryHandle, name: string, text: string): Promise<void> {
	const fh = await dir.getFileHandle(name, { create: true });
	const writable = await fh.createWritable();
	await writable.write(text);
	await writable.close();
}

async function writeBlobFile(dir: FileSystemDirectoryHandle, name: string, blob: Blob): Promise<void> {
	const fh = await dir.getFileHandle(name, { create: true });
	const writable = await fh.createWritable();
	await writable.write(blob);
	await writable.close();
}

async function readTextFile(dir: FileSystemDirectoryHandle, name: string): Promise<string> {
	const fh = await dir.getFileHandle(name);
	const file = await fh.getFile();
	return await file.text();
}

async function readBlobFile(dir: FileSystemDirectoryHandle, name: string): Promise<Blob> {
	const fh = await dir.getFileHandle(name);
	const file = await fh.getFile();
	return file;
}

export function createAssetMeta(kind: "pdf" | "video", originalFileName: string, assetId: string): ProjectAsset {
	const safe = sanitizeFileName(originalFileName);
	return {
		id: assetId,
		kind,
		fileName: originalFileName,
		storedFileName: `${assetId}_${safe}`,
	};
}

export async function saveProjectToWiislideFolder(): Promise<void> {
	const flow = loadFromLocalStorage();
	if (!flow) throw new Error("プロジェクトがありません");

	const rootDir = await showDirectoryPickerCompat();
	const wiislideDir = await ensureWiislideDir(rootDir);
	const assetsDir = await ensureAssetsDir(wiislideDir);

	const assets = flow.assets ?? [];
	for (const asset of assets) {
		const blob = await getAssetBlob(asset.id);
		if (!blob) {
			throw new Error(`アセットが見つかりません: ${asset.fileName}`);
		}
		await writeBlobFile(assetsDir, asset.storedFileName, blob);
	}

	await writeTextFile(wiislideDir, "project.json", JSON.stringify(flow, null, 2));
}

export async function loadProjectFromWiislideFolder(): Promise<SerializedFlow> {
	const rootDir = await showDirectoryPickerCompat();
	const wiislideDir = rootDir.name === "wiislide" ? rootDir : await rootDir.getDirectoryHandle("wiislide");
	let assetsDir: FileSystemDirectoryHandle;
	try {
		assetsDir = await wiislideDir.getDirectoryHandle("assets");
	} catch {
		assetsDir = await wiislideDir.getDirectoryHandle("assets", { create: false });
	}

	const text = await readTextFile(wiislideDir, "project.json");
	const parsed = tryParseFlowJson(text);
	if (!parsed) throw new Error("project.json の形式が不正です");

	const assets = parsed.assets ?? [];
	for (const asset of assets) {
		const blob = await readBlobFile(assetsDir, asset.storedFileName);
		await putAssetBlob(asset.id, blob);
	}

	saveToLocalStorage(parsed);
	return parsed;
}
