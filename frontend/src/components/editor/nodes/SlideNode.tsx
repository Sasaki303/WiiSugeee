"use client";

import { Handle, Position, type NodeProps } from "reactflow";
import type { SlideNodeData } from "@/lib/presentation";

export function SlideNode(props: NodeProps<SlideNodeData>) {
	const { data, selected } = props;
	const isPdfPage = data.asset?.kind === "pdf";
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
			{isPdfPage ? (
				<>
					<Handle
						type="target"
						position={Position.Left}
						style={{
							width: 14,
							height: 14,
							borderRadius: 999,
							background: "#fff",
							border: "2px solid #666",
							left: -10,
						}}
					/>
					<Handle
						type="source"
						position={Position.Right}
						style={{
							width: 14,
							height: 14,
							borderRadius: 999,
							background: "#fff",
							border: "2px solid #666",
							right: -10,
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
