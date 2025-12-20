import type { WiiState } from "@/hooks/useWiiController";

export type WiiButton = keyof WiiState["buttons"];

export type BindingAction =
	| { type: "none"; subtype?: string }
	| { type: "next" }
	| { type: "prev" }
	| { type: "branch"; kind: "A" | "B" | "HOME" }
	| { type: "branchIndex"; index: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 }
	| { type: "reaction"; kind: "clap" | "laugh" }
	| { type: "paint" }
	| { type: "eraser" }
	| { type: "sound"; kind: "shot" | "oh" | "uxo"; outputDevice?: SoundOutputDevice }
	| { type: "remove" }
	| { type: "irSens" };

export type ButtonBindings = Partial<Record<WiiButton, BindingAction>>;

export type SoundOutputDevice = "pc" | "wii";

export interface SoundSettings {
	outputDevice: SoundOutputDevice;
}

export type ReactionType = "clap" | "laugh";

export type Reaction = {
	id: string;
	type: ReactionType;
	createdAt: number;
	x: number;
	size: number;
	durationMs: number;
	rotateDeg: number;
};

export type DrawingPoint = {
	x: number;
	y: number;
	mode?: "draw" | "erase";
} | null;

export type Position = {
	x: number;
	y: number;
};

export type AssetRef =
	| { kind: "pdf"; assetId: string; fileName: string; page: number; thumbnailDataUrl?: string }
	| { kind: "video"; assetId: string; fileName: string; thumbnailDataUrl?: string }
	| { kind: "image"; assetId: string; fileName: string; thumbnailDataUrl?: string };

export type SlideNodeData = {
	label: string;
	asset?: AssetRef;
	bindings?: ButtonBindings;
};

export type ProjectAsset = {
	id: string;
	kind: "pdf" | "video" | "image";
	fileName: string;
	storedFileName: string;
};

export type SerializedFlow = {
	version: 1;
	assets?: ProjectAsset[];
	viewport?: { x: number; y: number; zoom: number };
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
