"use client";

import { Handle, Position, type NodeProps, useStore, type Edge } from "reactflow";
import type { SlideNodeData } from "@/lib/presentation";

function computeBranchKeys(nodeId: string, rfEdges: Edge[]): string[] {
	const bySource = new Map<string, Edge[]>();
	for (const e of rfEdges) {
		const arr = bySource.get(e.source);
		if (arr) arr.push(e);
		else bySource.set(e.source, [e]);
	}

	const keys = new Set<string>();
	for (const [, outgoingEdges] of bySource.entries()) {
		if (outgoingEdges.length < 2) continue;

		const options: Array<{ key: string; target: string }> = [];
		const used = new Set<string>();

		for (const edge of outgoingEdges) {
			const label = String(edge.label ?? "").trim();
			const m = label.match(/^([1-9])(?:\b|\s|:|-)/);
			if (m) {
				const k = m[1];
				if (!used.has(k)) {
					options.push({ key: k, target: edge.target });
					used.add(k);
				}
			}
		}

		for (const edge of outgoingEdges) {
			if (options.length >= 9) break;
			const nextKey = String(options.length + 1);
			if (used.has(nextKey)) continue;
			options.push({ key: nextKey, target: edge.target });
			used.add(nextKey);
		}

		const found = options.find((o) => o.target === nodeId);
		if (found?.key) {
			const numKey = parseInt(found.key, 10);
			if (numKey >= 1 && numKey <= 9) {
				keys.add(String.fromCharCode(64 + numKey));
			}
		}
	}

	return Array.from(keys).sort();
}

function ThumbnailPreview({ data }: { data: SlideNodeData }) {
	const previewStyle: React.CSSProperties = {
		width: "100%",
		height: 160,
		objectFit: "cover",
		borderRadius: 6,
	};

	const placeholderStyle: React.CSSProperties = {
		width: "100%",
		height: 160,
		borderRadius: 6,
		background: "#f5f5f5",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: 12,
	};

	if (data.asset?.thumbnailDataUrl) {
		return <img alt={data.label} src={data.asset.thumbnailDataUrl} style={previewStyle} />;
	}

	if (data.asset?.kind === "image") {
		return <div style={placeholderStyle}>画像: {data.asset.fileName}</div>;
	}

	if (data.asset?.kind === "video") {
		return <div style={placeholderStyle}>動画: {data.asset.fileName}</div>;
	}

	return <div style={placeholderStyle}>(ここにサムネイル)</div>;
}

export function SlideNode({ id, data, selected }: NodeProps<SlideNodeData>) {
	const rfEdges = useStore((s) => s.edges);
	const branchKeys = computeBranchKeys(id, rfEdges);

	const isConnectableMedia =
		data.asset?.kind === "pdf" || data.asset?.kind === "video" || data.asset?.kind === "image";

	const handleStyle: React.CSSProperties = {
		width: 28,
		height: 28,
		borderRadius: 999,
		background: "#fff",
		border: "2px solid #666",
	};

	return (
		<div
			style={{
				position: "relative",
				width: 260,
				border: "1px solid #ddd",
				borderRadius: 8,
				padding: 8,
				background: selected ? "#fafafa" : "white",
			}}
		>
			{isConnectableMedia && (
				<>
					<Handle
						type="target"
						position={Position.Left}
						style={{
							...handleStyle,
							left: -18,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 12,
							fontWeight: 700,
							color: "#111",
						}}
					>
						{branchKeys.length > 0 ? branchKeys.join("/") : null}
					</Handle>
					<Handle type="source" position={Position.Right} style={{ ...handleStyle, right: -18 }} />
				</>
			)}
			<div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{data.label}</div>
			<ThumbnailPreview data={data} />
		</div>
	);
}
