"use client";

import { useEffect, useRef, useState } from "react";

interface PdfSlideProps {
	assetId: string;
	page: number;
	fallbackDataUrl?: string;
	alt: string;
	getOrLoadPdfDocument: (assetId: string) => Promise<any>;
}

export function PdfSlide(props: PdfSlideProps) {
	const { assetId, page, fallbackDataUrl, alt, getOrLoadPdfDocument } = props;
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [size, setSize] = useState<{ w: number; h: number } | null>(null);
	const [renderError, setRenderError] = useState<string | null>(null);
	const renderTaskRef = useRef<any>(null);

	useEffect(() => {
		const el = wrapperRef.current;
		if (!el) return;
		const update = () => {
			const rect = el.getBoundingClientRect();
			setSize({ w: Math.max(0, rect.width), h: Math.max(0, rect.height) });
		};
		update();
		const ro = new ResizeObserver(() => update());
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				setRenderError(null);

				const el = wrapperRef.current;
				const canvas = canvasRef.current;
				if (!el || !canvas || !size || size.w === 0 || size.h === 0) return;

				// 既存のレンダリングをキャンセル
				if (renderTaskRef.current) {
					try {
						renderTaskRef.current.cancel();
					} catch (e) {
						// キャンセル済みの場合は無視
					}
					renderTaskRef.current = null;
				}

				const pdf = await getOrLoadPdfDocument(assetId);
				if (cancelled) return;
				const pdfPage = await pdf.getPage(page);
				if (cancelled) return;

				const viewport1 = pdfPage.getViewport({ scale: 1 });
				const scale = Math.min(size.w / viewport1.width, size.h / viewport1.height);
				const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
				const renderViewport = pdfPage.getViewport({ scale: scale * dpr });

				canvas.width = Math.floor(renderViewport.width);
				canvas.height = Math.floor(renderViewport.height);
				canvas.style.width = `${Math.floor(renderViewport.width / dpr)}px`;
				canvas.style.height = `${Math.floor(renderViewport.height / dpr)}px`;

				const ctx = canvas.getContext("2d");
				if (!ctx) return;

				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				const task = pdfPage.render({ canvasContext: ctx, canvas, viewport: renderViewport });
				renderTaskRef.current = task;

				await task.promise;

				if (renderTaskRef.current === task) {
					renderTaskRef.current = null;
				}
			} catch (e: any) {
				const msg = e?.name === "RenderingCancelledException" ? null : (e instanceof Error ? e.message : String(e));
				if (!cancelled && msg) setRenderError(msg);
			}
		})();

		return () => {
			cancelled = true;
			if (renderTaskRef.current) {
				try {
					renderTaskRef.current.cancel();
					renderTaskRef.current = null;
				} catch {
					// 既にキャンセル済みの場合は無視
				}
			}
		};
	}, [assetId, getOrLoadPdfDocument, page, size]);

	return (
		<div
			ref={wrapperRef}
			style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
		>
			{renderError && fallbackDataUrl ? (
				<img src={fallbackDataUrl} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt={alt} />
			) : (
				<canvas ref={canvasRef} aria-label={alt} />
			)}
		</div>
	);
}
