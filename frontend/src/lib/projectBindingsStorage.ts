import type { ButtonBindings } from "@/lib/buttonBindings";
import type { SerializedFlow } from "@/lib/presentation";

// /editor・/present が使う保存キー（presentation.ts と統一）
const FLOW_KEY = "wiisugeee.editor.flow.v1";

function readFlow(): SerializedFlow | null {
    try {
        const raw = localStorage.getItem(FLOW_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as SerializedFlow;
    } catch {
        return null;
    }
}

function writeFlow(flow: SerializedFlow) {
    localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
}

export function getProjectBindings(): ButtonBindings | undefined {
    return readFlow()?.projectBindings;
}

export function setProjectBindings(bindings: ButtonBindings) {
    const flow = readFlow();

    if (!flow) {
        // 最小構成のflowを作って保存（Settings単体で先に触っても保存できるように）
        const next: SerializedFlow = {
            version: 1,
            assets: [],
            viewport: { x: 0, y: 0, zoom: 1 },
            projectBindings: bindings,
            nodes: [],
            edges: [],
        };
        writeFlow(next);
        return;
    }

    writeFlow({ ...flow, projectBindings: bindings });
}
