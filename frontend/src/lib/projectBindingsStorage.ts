import type { ButtonBindings } from "@/lib/buttonBindings";

function key(projectId: string) {
    return `wiiSugeee:projectBindings:${projectId}`;
}

export function loadProjectBindings(projectId: string): ButtonBindings | undefined {
    try {
        const raw = localStorage.getItem(key(projectId));
        if (!raw) return undefined;
        return JSON.parse(raw) as ButtonBindings;
    } catch {
        return undefined;
    }
}

export function saveProjectBindings(projectId: string, bindings: ButtonBindings) {
    try {
        localStorage.setItem(key(projectId), JSON.stringify(bindings));
    } catch {}
}
