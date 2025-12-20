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
	| { type: "sound"; kind: "shot" | "oh" | "uxo"; outputDevice?: "pc" | "wii" }
	| { type: "remove" }
	| { type: "irSens" };

export type ButtonBindings = Partial<Record<WiiButton, BindingAction>>;

export type SoundOutputDevice = "pc" | "wii";

export interface SoundSettings {
	outputDevice: SoundOutputDevice;
}

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
	outputDevice: "pc",
};

export const DEFAULT_BINDINGS: ButtonBindings = {
	Right: { type: "next" },
	Left: { type: "prev" },
	Plus: { type: "branch", kind: "A" },
	Minus: { type: "branch", kind: "B" },
	Home: { type: "branch", kind: "HOME" },
	One: { type: "reaction", kind: "clap" },
	Two: { type: "reaction", kind: "laugh" },
};

export function formatAction(a: BindingAction): string {
	switch (a.type) {
		case "none":
			return "未割当";
		case "next":
			return "次へ";
		case "prev":
			return "戻る";
		case "branch":
			switch (a.kind) {
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
		case "sound": {
			const device = a.outputDevice === "wii" ? "[Wii]" : "[PC]";
			switch (a.kind) {
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

export function mergeBindings(bindings?: ButtonBindings): ButtonBindings {
	return {
		...DEFAULT_BINDINGS,
		...(bindings ?? {}),
	};
}

export function encodeAction(a: BindingAction): string {
	return JSON.stringify(a);
}

export function decodeAction(s: string): BindingAction {
	return JSON.parse(s) as BindingAction;
}
