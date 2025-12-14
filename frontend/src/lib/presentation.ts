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
	  };

export type SlideNodeData = {
	label: string;
	asset?: AssetRef;
};

export type SerializedFlow = {
	version: 1;
	assets?: ProjectAsset[];
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
