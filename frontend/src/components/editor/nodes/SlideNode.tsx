"use client";

import { Handle, Position, type NodeProps, useStore } from "reactflow";
import type { SlideNodeData } from "@/lib/presentation";

export function SlideNode(props: NodeProps<SlideNodeData>) {
	const { id, data, selected } = props;
	const rfEdges = useStore((s) => s.edges);

	// 常時表示: 「出力が2本以上あるノード」からこのノードへ入ってくるエッジがあれば、
	// その分岐番号(A-I)を左ハンドルに表示する。
	// 複数の分岐元から入ってくる場合は "A/C" のように併記する。
	const branchKeysForThisNode = (() => {
		const bySource = new Map<string, typeof rfEdges>();
		for (const e of rfEdges) {
			const arr = bySource.get(e.source);
			if (arr) arr.push(e);
			else bySource.set(e.source, [e]);
		}

		const keys = new Set<string>();
		for (const [sourceId, outgoingEdges] of bySource.entries()) {
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

			const found = options.find((o) => o.target === id);
			if (found?.key) {
				// 数字(1-9)をアルファベット(A-I)に変換
				const numKey = parseInt(found.key, 10);
				if (numKey >= 1 && numKey <= 9) {
					const alphaKey = String.fromCharCode(64 + numKey); // A=65, B=66, ...
					keys.add(alphaKey);
				}
			}
		}

		return Array.from(keys).sort();
	})();

	const isConnectableMedia =
		data.asset?.kind === "pdf" || data.asset?.kind === "video" || data.asset?.kind === "image";
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
			{isConnectableMedia ? (
				<>
					<Handle
						type="target"
						position={Position.Left}
						style={{
							width: 28,
							height: 28,
							borderRadius: 999,
							background: "#fff",
							border: "2px solid #666",
							left: -18,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 12,
							fontWeight: 700,
							color: "#111",
						}}
					>
						{branchKeysForThisNode.length > 0 ? branchKeysForThisNode.join("/") : null}
					</Handle>
					<Handle
						type="source"
						position={Position.Right}
						style={{
							width: 28,
							height: 28,
							borderRadius: 999,
							background: "#fff",
							border: "2px solid #666",
							right: -18,
						}}
					/>
				</>
			) : null}
			<div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{data.label}</div>
			{data.asset?.kind === "pdf" && data.asset.thumbnailDataUrl ? (
				<img
					alt={data.label}
					src={data.asset.thumbnailDataUrl}
					style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 6 }}
				/>
			) : data.asset?.kind === "video" && data.asset.thumbnailDataUrl ? (
				<img
					alt={data.label}
					src={data.asset.thumbnailDataUrl}
					style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 6 }}
				/>
			) : data.asset?.kind === "image" && data.asset.thumbnailDataUrl ? (
				<img
					alt={data.label}
					src={data.asset.thumbnailDataUrl}
					style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 6 }}
				/>
			) : data.asset?.kind === "image" ? (
				<div
					style={{
						width: "100%",
						height: 160,
						borderRadius: 6,
						background: "#f5f5f5",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 12,
					}}
				>
					画像: {data.asset.fileName}
				</div>
			) : data.asset?.kind === "video" ? (
				<div
					style={{
						width: "100%",
						height: 160,
						borderRadius: 6,
						background: "#f5f5f5",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 12,
					}}
				>
					動画: {data.asset.fileName}
				</div>
			) : (
				<div
					style={{
						width: "100%",
						height: 160,
						borderRadius: 6,
						background: "#f5f5f5",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 12,
					}}
				>
					(ここにサムネイル)
				</div>
			)}
		</div>
	);
}
