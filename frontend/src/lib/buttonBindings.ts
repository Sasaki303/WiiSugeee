import type { WiiState } from "@/hooks/useWiiController";

export type WiiButton = keyof WiiState["buttons"];

export type BindingAction =
	| { type: "none" }
	| { type: "next" }
	| { type: "prev" }
	| { type: "branch"; kind: "A" | "B" | "HOME" }
	| { type: "branchIndex"; index: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 }
	| { type: "reaction"; kind: "clap" | "laugh" };

export type ButtonBindings = Partial<Record<WiiButton, BindingAction>>;

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
