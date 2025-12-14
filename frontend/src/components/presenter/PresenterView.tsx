"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadFromLocalStorage, type SerializedFlow } from "@/lib/presentation";

type Mode = "idle" | "playing";

function pickStartNode(flow: SerializedFlow) {
	return flow.nodes.find((n) => n.data?.label === "Start") ?? flow.nodes[0] ?? null;
}

export function PresenterView() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [mode, setMode] = useState<Mode>("idle");
	const [flow, setFlow] = useState<SerializedFlow | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isFullscreen, setIsFullscreen] = useState(false);

	const currentNode = useMemo(() => (flow ? pickStartNode(flow) : null), [flow]);

	const onPlay = useCallback(() => {
		const loaded = loadFromLocalStorage();
		if (!loaded) {
			setError("エディタで作成したデータが見つかりません（/editor で作ってから再生してください）");
			return;
		}
		setError(null);
		setFlow(loaded);
		setMode("playing");
	}, []);

	useEffect(() => {
		const auto = searchParams.get("auto");
		if (auto === "1" && mode === "idle") onPlay();
	}, [mode, onPlay, searchParams]);

	useEffect(() => {
		const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
		document.addEventListener("fullscreenchange", onFsChange);
		return () => document.removeEventListener("fullscreenchange", onFsChange);
	}, []);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && document.fullscreenElement) {
				document.exitFullscreen().catch(() => undefined);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	const goHome = useCallback(() => {
		router.push("/");
	}, [router]);

	const toggleFullscreen = useCallback(async () => {
		try {
			if (document.fullscreenElement) {
				await document.exitFullscreen();
				return;
			}
			const el = containerRef.current ?? document.documentElement;
			await el.requestFullscreen();
		} catch {
			// ignore
		}
	}, []);

	if (mode === "idle") {
		return (
			<main style={{ height: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
				<div style={{ textAlign: "center", maxWidth: 520 }}>
					<h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>発表モード</h1>
					<div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
						<button onClick={goHome}>ホームに戻る</button>
					</div>
					<button
						onClick={onPlay}
						style={{
							fontSize: 16,
							padding: "12px 18px",
							borderRadius: 10,
							border: "1px solid #ddd",
							background: "white",
							cursor: "pointer",
						}}
					>
						再生
					</button>
					{error ? <div style={{ marginTop: 12, fontSize: 12, color: "#b91c1c" }}>{error}</div> : null}
				</div>
			</main>
		);
	}

	return (
		<main ref={containerRef} style={{ height: "100vh", padding: 16 }}>
			<div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
				<button onClick={goHome}>ホームに戻る</button>
				<button onClick={toggleFullscreen}>{isFullscreen ? "フルサイズ解除" : "フルサイズ"}</button>
				<div style={{ marginLeft: "auto", fontSize: 12, color: "#666" }}>再生中（先頭スライド表示）</div>
			</div>
			{currentNode ? (
				<div>
					<h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{currentNode.data.label}</h2>
					{currentNode.data.asset?.kind === "pdf" && currentNode.data.asset.thumbnailDataUrl ? (
						<img
							alt={currentNode.data.label}
							src={currentNode.data.asset.thumbnailDataUrl}
							style={{ maxWidth: "100%", borderRadius: 10, border: "1px solid #eee" }}
						/>
					) : currentNode.data.asset?.kind === "video" ? (
						<div style={{ padding: 12, border: "1px solid #eee", borderRadius: 10 }}>
							動画: {currentNode.data.asset.fileName}
						</div>
					) : (
						<div style={{ padding: 12, border: "1px solid #eee", borderRadius: 10 }}>
							(スライド)
						</div>
					)}
				</div>
			) : (
				<div style={{ fontSize: 14 }}>ノードがありません</div>
			)}
		</main>
	);
}
