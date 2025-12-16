import JSZip from "jszip";
import { getAssetBlob, putAssetBlob } from "@/lib/idbAssets";
import { saveToLocalStorage, tryParseFlowJson, type SerializedFlow } from "@/lib/presentation";
import { getProjectBindings, getCurrentProjectId } from "@/lib/currentProjectStore";
import { saveProjectBindings } from "@/lib/projectBindingsStorage";

async function showSaveFilePickerCompat(): Promise<FileSystemFileHandle | null> {
	const w = window as unknown as {
		showSaveFilePicker?: (options?: {
			suggestedName?: string;
			types?: Array<{ description?: string; accept: Record<string, string[]> }>;
			startIn?: unknown;
		}) => Promise<FileSystemFileHandle>;
	};
	if (!w.showSaveFilePicker) return null;
	try {
		return await w.showSaveFilePicker({
			suggestedName: "wiislide.zip",
			types: [{ description: "WiiSlide Project", accept: { "application/zip": [".zip"] } }],
			startIn: "desktop",
		});
	} catch {
		return null;
	}
}

async function showOpenFilePickerCompat(): Promise<File | null> {
	const w = window as unknown as {
		showOpenFilePicker?: (options?: {
			types?: Array<{ description?: string; accept: Record<string, string[]> }>;
			multiple?: boolean;
			startIn?: unknown;
		}) => Promise<FileSystemFileHandle[]>;
	};
	if (w.showOpenFilePicker) {
		try {
			const [handle] = await w.showOpenFilePicker({
				multiple: false,
				types: [{ description: "WiiSlide Project", accept: { "application/zip": [".zip"] } }],
				startIn: "desktop",
			});
			if (!handle) return null;
			return await handle.getFile();
		} catch {
			// fallthrough
		}
	}

	return await new Promise<File | null>((resolve) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".zip,application/zip";
		input.onchange = () => resolve(input.files?.[0] ?? null);
		input.click();
	});
}

function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

export async function saveProjectAsZip(flow: SerializedFlow): Promise<void> {
	// ★追加: localStorageから最新のボタンバインド設定を取得してflowに含める
	const latestBindings = getProjectBindings();
	const flowWithBindings: SerializedFlow = latestBindings
		? { ...flow, projectBindings: latestBindings }
		: flow;

	const zip = new JSZip();
	zip.file("project.json", JSON.stringify(flowWithBindings, null, 2));

	const assets = flowWithBindings.assets ?? [];
	for (const asset of assets) {
		const blob = await getAssetBlob(asset.id);
		if (!blob) throw new Error(`アセットが見つかりません: ${asset.fileName}`);
		zip.file(`assets/${asset.storedFileName}`, blob);
	}

	const zipBlob = await zip.generateAsync({ type: "blob" });
	const handle = await showSaveFilePickerCompat();
	if (!handle) {
		downloadBlob(zipBlob, "wiislide.zip");
		return;
	}
	const writable = await handle.createWritable();
	await writable.write(zipBlob);
	await writable.close();
}

export async function loadProjectFromZipFile(file: File): Promise<SerializedFlow> {
	const zip = await JSZip.loadAsync(file);
	const projectText = await zip.file("project.json")?.async("string");
	if (!projectText) throw new Error("project.json が見つかりません");

	const parsed = tryParseFlowJson(projectText);
	if (!parsed) throw new Error("project.json の形式が不正です");

	const assets = parsed.assets ?? [];
	for (const asset of assets) {
		const entry = zip.file(`assets/${asset.storedFileName}`);
		if (!entry) throw new Error(`assets/${asset.storedFileName} が見つかりません`);
		const blob = await entry.async("blob");
		await putAssetBlob(asset.id, blob);
	}

	// ★追加: ボタンバインド情報をlocalStorageに保存
	if (parsed.projectBindings) {
		const projectId = getCurrentProjectId();
		saveProjectBindings(projectId, parsed.projectBindings);
		console.log("ボタンバインド設定を復元しました:", projectId, parsed.projectBindings);
	}

	saveToLocalStorage(parsed);
	return parsed;
}

export async function loadProjectFromZip(): Promise<SerializedFlow> {
	const file = await showOpenFilePickerCompat();
	if (!file) throw new Error("ファイルが選択されませんでした");
	return await loadProjectFromZipFile(file);
}
