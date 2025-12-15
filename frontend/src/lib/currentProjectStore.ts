import type { SerializedFlow } from "@/lib/presentation";
import type { ButtonBindings } from "@/lib/buttonBindings";

type Listener = () => void;

let currentFlow: SerializedFlow | null = null;
const listeners = new Set<Listener>();

export function getCurrentFlow(): SerializedFlow | null {
    return currentFlow;
}

export function setCurrentFlow(flow: SerializedFlow | null) {
    currentFlow = flow;
    for (const l of listeners) l();
}

export function subscribeCurrentFlow(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function getProjectBindings(): ButtonBindings | undefined {
    return currentFlow?.projectBindings;
}

export function setProjectBindings(bindings: ButtonBindings) {
    if (!currentFlow) return;
    currentFlow = { ...currentFlow, projectBindings: bindings };
    for (const l of listeners) l();
}