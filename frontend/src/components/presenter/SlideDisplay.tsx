"use client";

import type { Node } from "@xyflow/react";
import { PdfSlide } from "./PdfSlide";
import { VideoSlide } from "./VideoSlide";
import { ImageSlide } from "./ImageSlide";

interface SlideDisplayProps {
	currentNode: Node | undefined;
	error: string | null;
	getOrLoadPdfDocument: (assetId: string) => Promise<any>;
}

export function SlideDisplay(props: SlideDisplayProps) {
	const { currentNode, error, getOrLoadPdfDocument } = props;

	return (
		<div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
			{currentNode ? (
				<>
					{currentNode.data.asset?.kind === "pdf" ? (
						<PdfSlide
							assetId={currentNode.data.asset.assetId}
							page={currentNode.data.asset.page ?? 1}
							fallbackDataUrl={currentNode.data.asset.thumbnailDataUrl}
							alt={currentNode.data.label}
							getOrLoadPdfDocument={getOrLoadPdfDocument}
						/>
					) : currentNode.data.asset?.kind === "video" ? (
						<VideoSlide assetId={currentNode.data.asset.assetId} alt={currentNode.data.label} />
					) : currentNode.data.asset?.kind === "image" ? (
						<ImageSlide assetId={currentNode.data.asset.assetId} alt={currentNode.data.label} />
					) : (
						<h1 style={{ fontSize: 80, color: "white", textAlign: "center", maxWidth: "80%" }}>
							{currentNode.data.label}
						</h1>
					)}
				</>
			) : (
				<div style={{ color: "white" }}>{error ?? "スライドデータがありません"}</div>
			)}
		</div>
	);
}
