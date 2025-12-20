"use client";

import { useEffect, useState } from "react";
import { getAssetBlob } from "@/lib/idbAssets";

interface ImageSlideProps {
	assetId: string;
	alt: string;
}

export function ImageSlide({ assetId, alt }: ImageSlideProps) {
	const [src, setSrc] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;
		let url: string | null = null;
		(async () => {
			try {
				setError(null);
				setSrc(null);
				const blob = await getAssetBlob(assetId);
				if (!blob) throw new Error("画像アセットが見つかりません (IndexedDB)");
				url = URL.createObjectURL(blob);
				if (!active) return;
				setSrc(url);
			} catch (e) {
				if (!active) return;
				setError(e instanceof Error ? e.message : String(e));
			}
		})();
		return () => {
			active = false;
			if (url) URL.revokeObjectURL(url);
		};
	}, [assetId]);

	if (error) {
		return <div style={{ color: "white", textAlign: "center" }}>画像の読み込みに失敗しました: {error}</div>;
	}
	if (!src) {
		return <div style={{ color: "white", textAlign: "center" }}>画像を読み込み中...</div>;
	}

	return (
		<img
			src={src}
			style={{ width: "100%", height: "100%", objectFit: "contain" }}
			alt={alt}
		/>
	);
}
