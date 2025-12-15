import type { ButtonBindings } from "@/lib/buttonBindings";

export type ProjectAsset = {
	id: string;
	kind: "pdf" | "video";
	fileName: string;
	storedFileName: string; // assets/ 配下のファイル名
};

export type AssetRef =
	| {
			kind: "pdf";
			assetId: string;
			fileName: string;
			page: number;
			thumbnailDataUrl?: string;
	  }
	| {
			kind: "video";
			assetId: string;
			fileName: string;
			thumbnailDataUrl?: string;
	  };

export type SlideNodeData = {
	label: string;
	asset?: AssetRef;
	/**
	 * スライドごとの Wii ボタン割り当て。
	 * 未設定の場合はデフォルト割り当てを適用する。
	 */
	bindings?: ButtonBindings;
};

export type SerializedFlow = {
	version: 1;
	assets?: ProjectAsset[];
	viewport?: { x: number; y: number; zoom: number };
	/**
	 * プロジェクト全体の Wii ボタン割り当て。
	 * 未設定の場合はデフォルト割り当てを適用する。
	 */
	projectBindings?: ButtonBindings;
	nodes: Array<{
		id: string;
		type?: string;
		position: { x: number; y: number };
		data: SlideNodeData;
	}>;
	edges: Array<{
		id: string;
		source: string;
		target: string;
		label?: string;
	}>;
};

const STORAGE_KEY = "wiisugeee.editor.flow.v1";
const LAST_SAVED_HASH_KEY = "wiisugeee.editor.lastSavedHash.v1";

export function serializeFlow(flow: SerializedFlow): string {
	return JSON.stringify(flow, null, 2);
}

export function tryParseFlowJson(text: string): SerializedFlow | null {
	try {
		const parsed = JSON.parse(text) as unknown;
		if (!parsed || typeof parsed !== "object") return null;
		const maybe = parsed as Partial<SerializedFlow>;
		if (maybe.version !== 1) return null;
		if (!Array.isArray(maybe.nodes) || !Array.isArray(maybe.edges)) return null;
		return maybe as SerializedFlow;
	} catch {
		return null;
	}
}

export function saveToLocalStorage(flow: SerializedFlow): void {
	try {
		localStorage.setItem(STORAGE_KEY, serializeFlow(flow));
	} catch {
		// ignore
	}
}

export function loadFromLocalStorage(): SerializedFlow | null {
	try {
		const text = localStorage.getItem(STORAGE_KEY);
		if (!text) return null;
		return tryParseFlowJson(text);
	} catch {
		return null;
	}
}

export function getLastSavedHash(): string | null {
	try {
		return localStorage.getItem(LAST_SAVED_HASH_KEY);
	} catch {
		return null;
	}
}

export function setLastSavedHash(hash: string): void {
	try {
		localStorage.setItem(LAST_SAVED_HASH_KEY, hash);
	} catch {
		// ignore
	}
}

export function clearEditorStorage(): void {
	try {
		localStorage.removeItem(STORAGE_KEY);
		localStorage.removeItem(LAST_SAVED_HASH_KEY);
	} catch {
		// ignore
	}
}