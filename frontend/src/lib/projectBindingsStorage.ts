import type { ButtonBindings } from "@/lib/buttonBindings";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/presentation";

/**
 * プロジェクト全体のボタンバインドを、既存の project.json (SerializedFlow) に保存する。
 */
export function loadProjectBindings(): ButtonBindings | undefined {
	const flow = loadFromLocalStorage();
	return flow?.projectBindings;
}

export function saveProjectBindings(next: ButtonBindings): void {
	const flow = loadFromLocalStorage();
	if (!flow) return;
	saveToLocalStorage({ ...flow, projectBindings: next });
}
