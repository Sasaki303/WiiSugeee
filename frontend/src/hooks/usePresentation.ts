"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { loadFromLocalStorage, type SerializedFlow } from "@/lib/presentation";
import { getProjectBindings } from "@/lib/currentProjectStore";

interface UsePresentationOptions {
	wiiConnected: boolean;
}

export function usePresentation({ wiiConnected }: UsePresentationOptions) {
	const [flow, setFlow] = useState<SerializedFlow | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
	const [startedWithWii, setStartedWithWii] = useState(false);
	const [playingSince, setPlayingSince] = useState<number>(0);
	const lastNavTime = useRef<number>(0);

	const isPlaying = flow != null && currentNodeId != null;

	const currentNode = useMemo(
		() => flow?.nodes.find((n) => n.id === currentNodeId),
		[flow, currentNodeId]
	);

	const outgoingEdges = useMemo(() => {
		if (!flow || !currentNodeId) return [];
		return flow.edges.filter((e) => e.source === currentNodeId);
	}, [flow, currentNodeId]);

	const hasMultipleBranches = outgoingEdges.length >= 2;

	const branchOptions = useMemo(() => {
		const options: Array<{ key: string; target: string }> = [];
		const used = new Set<string>();

		for (const edge of outgoingEdges) {
			const label = (edge.label ?? "").trim();
			const m = label.match(/^([1-9])(?:\b|\s|:|-)/);
			if (m && !used.has(m[1])) {
				options.push({ key: m[1], target: edge.target });
				used.add(m[1]);
			}
		}

		for (const edge of outgoingEdges) {
			if (options.length >= 9) break;
			const nextKey = String(options.length + 1);
			if (used.has(nextKey)) continue;
			options.push({ key: nextKey, target: edge.target });
			used.add(nextKey);
		}

		return options;
	}, [outgoingEdges]);

	const navigateTo = useCallback(
		(nodeId: string, onNavigate?: () => void) => {
			const now = Date.now();
			if (now - lastNavTime.current < 500) return;
			lastNavTime.current = now;
			setCurrentNodeId(nodeId);
			onNavigate?.();
		},
		[]
	);

	const nextSlide = useCallback(
		(onNavigate?: () => void) => {
			if (!flow || !currentNodeId) return;
			const edges = flow.edges.filter((e) => e.source === currentNodeId);
			if (edges.length >= 2 || edges.length === 0) return;

			const targetEdge =
				edges.find((e) => !e.label || e.label.trim() === "") ||
				edges.find((e) => e.label === "next") ||
				edges[0];

			if (targetEdge) navigateTo(targetEdge.target, onNavigate);
		},
		[flow, currentNodeId, navigateTo]
	);

	const prevSlide = useCallback(
		(onNavigate?: () => void) => {
			if (!flow || !currentNodeId) return;
			const edge = flow.edges.find((e) => e.target === currentNodeId);
			if (edge) navigateTo(edge.source, onNavigate);
		},
		[flow, currentNodeId, navigateTo]
	);

	const branchByNumberKey = useCallback(
		(key: string, onNavigate?: () => void) => {
			if (!hasMultipleBranches) return;
			const opt = branchOptions.find((o) => o.key === key);
			if (opt) navigateTo(opt.target, onNavigate);
		},
		[branchOptions, hasMultipleBranches, navigateTo]
	);

	useEffect(() => {
		const loaded = loadFromLocalStorage();
		if (!loaded || loaded.nodes.length === 0) {
			setError("データが見つかりません。Editorで作成してください。");
			setFlow(null);
			setCurrentNodeId(null);
			return;
		}

		const storedBindings = getProjectBindings();
		const flowWithBindings = storedBindings ? { ...loaded, projectBindings: storedBindings } : loaded;

		setError(null);
		setFlow(flowWithBindings);

		const startNode = loaded.nodes.find((n) => n.data.label === "Start") || loaded.nodes[0];
		setCurrentNodeId(startNode.id);
		setStartedWithWii(!!wiiConnected);
		setPlayingSince(Date.now());
	}, []);

	useEffect(() => {
		if (wiiConnected) setStartedWithWii(true);
	}, [wiiConnected]);

	return {
		flow,
		error,
		isPlaying,
		currentNode,
		currentNodeId,
		startedWithWii,
		playingSince,
		outgoingEdges,
		hasMultipleBranches,
		branchOptions,
		nextSlide,
		prevSlide,
		branchByNumberKey,
		navigateTo,
	};
}
