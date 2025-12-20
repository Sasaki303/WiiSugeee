"use client";

import type { Node } from "@xyflow/react";
import type { SlideNodeData } from "@/types";
import { PdfSlide } from "./PdfSlide";
import { VideoSlide } from "./VideoSlide";
import { ImageSlide } from "./ImageSlide";

interface SlideDisplayProps {
	currentNode: Node<SlideNodeData> | undefined;
	error: string | null;
	getOrLoadPdfDocument: (assetId: string) => Promise<unknown>;
}

export function SlideDisplay({ currentNode, error, getOrLoadPdfDocument }: SlideDisplayProps) {
	return (
		<div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
			{currentNode ? (
				<SlideContent currentNode={currentNode} getOrLoadPdfDocument={getOrLoadPdfDocument} />
			) : (
				<div style={{ color: "white" }}>{error ?? "スライドデータがありません"}</div>
			)}
		</div>
	);
}

function SlideContent({
	currentNode,
	getOrLoadPdfDocument,
}: {
	currentNode: Node<SlideNodeData>;
	getOrLoadPdfDocument: (assetId: string) => Promise<unknown>;
}) {
	const asset = currentNode.data.asset;

	if (!asset) {
		return (
			<h1 style={{ fontSize: 80, color: "white", textAlign: "center", maxWidth: "80%" }}>
				{currentNode.data.label}
			</h1>
		);
	}

	switch (asset.kind) {
		case "pdf":
			return (
				<PdfSlide
					assetId={asset.assetId}
					page={asset.page ?? 1}
					fallbackDataUrl={asset.thumbnailDataUrl}
					alt={currentNode.data.label}
					getOrLoadPdfDocument={getOrLoadPdfDocument}
				/>
			);
		case "video":
			return <VideoSlide assetId={asset.assetId} alt={currentNode.data.label} />;
		case "image":
			return <ImageSlide assetId={asset.assetId} alt={currentNode.data.label} />;
		default:
			return null;
	}
}
