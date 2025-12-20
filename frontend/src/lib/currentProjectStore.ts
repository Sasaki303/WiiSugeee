import type { SerializedFlow } from "@/lib/presentation";
import type { ButtonBindings, SoundSettings } from "@/lib/buttonBindings";
import { DEFAULT_SOUND_SETTINGS } from "@/lib/buttonBindings";
import { loadProjectBindings, saveProjectBindings } from "@/lib/projectBindingsStorage";

type Listener = () => void;

let currentFlow: SerializedFlow | null = null;
let currentProjectId = "default";
const listeners = new Set<Listener>();

export function setCurrentProjectId(projectId: string) {
	currentProjectId = projectId || "default";
	for (const l of listeners) l();
}

export function getCurrentProjectId() {
	return currentProjectId;
}

export function getCurrentFlow(): SerializedFlow | null {
	return currentFlow;
}

export function setCurrentFlow(flow: SerializedFlow | null) {
	if (flow) {
		const stored = typeof window !== "undefined" ? loadProjectBindings(currentProjectId) : undefined;
		currentFlow = stored ? { ...flow, projectBindings: stored } : flow;
	} else {
		currentFlow = null;
	}
	for (const l of listeners) l();
}

export function subscribeCurrentFlow(listener: Listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export function getProjectBindings(): ButtonBindings | undefined {
	if (currentFlow?.projectBindings) {
		return currentFlow.projectBindings;
	}
	if (typeof window === "undefined") return undefined;
	return loadProjectBindings(currentProjectId);
}

export function setProjectBindings(bindings: ButtonBindings) {
	if (currentFlow) {
		currentFlow = { ...currentFlow, projectBindings: bindings };
	}

	if (typeof window !== "undefined") {
		saveProjectBindings(currentProjectId, bindings);
	}

	for (const l of listeners) l();
}

const SOUND_SETTINGS_KEY_PREFIX = "wiiSugeee_soundSettings_";

export function getSoundSettings(): SoundSettings {
	if (typeof window === "undefined") {
		return { ...DEFAULT_SOUND_SETTINGS };
	}

	const key = SOUND_SETTINGS_KEY_PREFIX + currentProjectId;
	const stored = localStorage.getItem(key);

	if (!stored) {
		return { ...DEFAULT_SOUND_SETTINGS };
	}

	try {
		return JSON.parse(stored) as SoundSettings;
	} catch {
		return { ...DEFAULT_SOUND_SETTINGS };
	}
}

export function setSoundSettings(settings: SoundSettings) {
	if (typeof window === "undefined") return;

	const key = SOUND_SETTINGS_KEY_PREFIX + currentProjectId;
	localStorage.setItem(key, JSON.stringify(settings));

	for (const l of listeners) l();
}