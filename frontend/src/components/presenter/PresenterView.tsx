"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAssetBlob } from "@/lib/idbAssets";
import { useWiiController } from "@/hooks/useWiiController";
import { usePresentation } from "@/hooks/usePresentation";
import { useDrawing } from "@/hooks/useDrawing";
import { useAudio } from "@/hooks/useAudio";
import { useBindings } from "@/hooks/useBindings";
import { ReactionOverlay } from "@/components/presenter/ReactionOverlay";
import { WiiDebugPanel } from "@/components/presenter/WiiDebugPanel";
import { WiiDisconnectPopup } from "@/components/presenter/WiiDisconnectPopup";
import { WiiReconnectPopup } from "@/components/presenter/WiiReconnectPopup";
import { SlideDisplay } from "@/components/presenter/SlideDisplay";
import { DrawingCanvas } from "@/components/presenter/DrawingCanvas";
import { IrPointerOverlay } from "@/components/presenter/IrPointerOverlay";
import { EraserCursor } from "@/components/presenter/EraserCursor";
import type { BindingAction } from "@/lib/buttonBindings";

export function PresenterView() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const containerRef = useRef<HTMLDivElement | null>(null);

	const { wiiState, pressed, wiiConnected, wiiDisconnectedAt, irCursorEnabled, setIrCursorEnabled, playWiiSound } =
		useWiiController();

	const presentation = usePresentation({ wiiConnected });
	const drawing = useDrawing();
	const { playSound } = useAudio(playWiiSound);

	const { effectiveProjectBindings, runAction, checkShouldEmitReaction, checkIsPaintPressed } = useBindings({
		flow: presentation.flow,
		currentNode: presentation.currentNode,
	});

	const pdfDocCacheRef = useRef<Map<string, Promise<unknown>>>(new Map());
	const lastPaintInputTimeRef = useRef<number>(0);
	const [shouldPaint, setShouldPaint] = useState(false);
	const [showDebugPanel, setShowDebugPanel] = useState(true);
	const [showIrDebug, setShowIrDebug] = useState(true);

	const returnTo = useMemo(() => (searchParams.get("from") === "editor" ? "/editor" : "/"), [searchParams]);
	const returnLabel = useMemo(() => (returnTo === "/editor" ? "エディタに戻る" : "ホームに戻る"), [returnTo]);
	const goBack = useCallback(() => router.push(returnTo), [router, returnTo]);

	const getOrLoadPdfDocument = useCallback(async (assetId: string) => {
		const cached = pdfDocCacheRef.current.get(assetId);
		if (cached) return await cached;

		const promise = (async () => {
			const blob = await getAssetBlob(assetId);
			if (!blob) throw new Error("PDFアセットが見つかりません (IndexedDB)");
			const arrayBuffer = await blob.arrayBuffer();
			const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
			pdfjs.GlobalWorkerOptions.workerSrc = new URL(
				"pdfjs-dist/legacy/build/pdf.worker.min.mjs",
				import.meta.url
			).toString();
			return await pdfjs.getDocument({ data: arrayBuffer }).promise;
		})();

		pdfDocCacheRef.current.set(assetId, promise);
		try {
			return await promise;
		} catch (e) {
			pdfDocCacheRef.current.delete(assetId);
			throw e;
		}
	}, []);

	const clearDrawingAndNav = useCallback(() => {
		drawing.clearDrawing();
	}, [drawing]);

	const actionCallbacks = useMemo(
		() => ({
			nextSlide: () => presentation.nextSlide(clearDrawingAndNav),
			prevSlide: () => presentation.prevSlide(clearDrawingAndNav),
			branchByNumberKey: (key: string) => presentation.branchByNumberKey(key, clearDrawingAndNav),
			hasMultipleBranches: presentation.hasMultipleBranches,
			toggleEraser: drawing.toggleEraserMode,
			toggleIrCursor: () => setIrCursorEnabled(!irCursorEnabled),
			clearDrawing: drawing.clearDrawing,
			playSound,
			eraserMode: drawing.eraserMode,
			irCursorEnabled,
		}),
		[presentation, drawing, playSound, irCursorEnabled, setIrCursorEnabled, clearDrawingAndNav]
	);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === "Space" && e.target === document.body) {
				e.preventDefault();
				setShowDebugPanel((prev) => !prev);
				setShowIrDebug((prev) => !prev);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	useEffect(() => {
		if (!presentation.isPlaying) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "r" || e.key === "R") {
				drawing.clearDrawing();
				return;
			}

			if ((e.key === "x" || e.key === "X") && !e.repeat) {
				drawing.toggleEraserMode("X");
				return;
			}

			if (!e.repeat) {
				if (e.key === "q" || e.key === "Q") {
					playSound("q");
					return;
				}
				if (e.key === "w" || e.key === "W") {
					playSound("w");
					return;
				}
				if (e.key === "e" || e.key === "E") {
					playSound("e");
					return;
				}
			}

			if (e.key >= "1" && e.key <= "9") {
				presentation.branchByNumberKey(e.key, clearDrawingAndNav);
				return;
			}

			if (e.key === "ArrowRight" && !presentation.hasMultipleBranches) {
				presentation.nextSlide(clearDrawingAndNav);
			}
			if (e.key === "ArrowLeft") {
				presentation.prevSlide(clearDrawingAndNav);
			}
			if (e.key === "Escape") {
				goBack();
			}
			if ((e.key === "c" || e.key === "C") && !e.repeat) {
				setIrCursorEnabled(!irCursorEnabled);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [presentation, drawing, playSound, goBack, irCursorEnabled, setIrCursorEnabled, clearDrawingAndNav]);

	useEffect(() => {
		if (!presentation.isPlaying) return;

		for (const btn of Object.keys(pressed)) {
			const isDown = (pressed as Record<string, boolean>)[btn];
			if (!isDown) continue;

			const act = (effectiveProjectBindings as Record<string, BindingAction | undefined>)[btn] ?? { type: "none" };

			if (act.type !== "paint") {
				runAction(act, actionCallbacks, btn);
			}
		}
	}, [pressed, presentation.isPlaying, effectiveProjectBindings, runAction, actionCallbacks]);

	const shouldEmitClap = useMemo(
		() => presentation.isPlaying && checkShouldEmitReaction(pressed, "clap"),
		[pressed, presentation.isPlaying, checkShouldEmitReaction]
	);

	const shouldEmitLaugh = useMemo(
		() => presentation.isPlaying && checkShouldEmitReaction(pressed, "laugh"),
		[pressed, presentation.isPlaying, checkShouldEmitReaction]
	);

	useEffect(() => {
		if (!irCursorEnabled) {
			setShouldPaint(false);
			drawing.setIsPainting(false);
			lastPaintInputTimeRef.current = 0;
			drawing.wasWiiADownRef.current = false;
			drawing.addSeparator();
		}
	}, [irCursorEnabled, drawing]);

	useEffect(() => {
		if (!presentation.isPlaying || !wiiState || drawing.eraserMode || !irCursorEnabled) {
			if (shouldPaint) {
				setShouldPaint(false);
				drawing.setIsPainting(false);
			}
			return;
		}

		const isPaintButtonPressed = checkIsPaintPressed(wiiState.buttons);

		if (isPaintButtonPressed) {
			lastPaintInputTimeRef.current = Date.now();
			if (!shouldPaint) setShouldPaint(true);
			if (!drawing.isPainting) drawing.setIsPainting(true);
		}
	}, [wiiState, presentation.isPlaying, drawing, irCursorEnabled, shouldPaint, checkIsPaintPressed]);

	useEffect(() => {
		if (!presentation.isPlaying) {
			setShouldPaint(false);
			return;
		}

		const interval = setInterval(() => {
			const paintElapsed = Date.now() - lastPaintInputTimeRef.current;
			if (paintElapsed > 100 && shouldPaint) {
				setShouldPaint(false);
				drawing.setIsPainting(false);
				drawing.endWiiDrawing();
			}
		}, 50);

		return () => clearInterval(interval);
	}, [presentation.isPlaying, shouldPaint, drawing]);

	useEffect(() => {
		if (!irCursorEnabled || !wiiState?.cursor) return;

		const pos = {
			x: wiiState.cursor.x * window.innerWidth,
			y: wiiState.cursor.y * window.innerHeight,
		};

		if (drawing.eraserMode) {
			drawing.setCursorPos(pos);

			if (wiiState.buttons.A && wiiState.buttons.B) {
				drawing.startWiiDrawing(pos, "erase");
			} else {
				drawing.endWiiDrawing();
			}
			return;
		}

		if (shouldPaint) {
			drawing.startWiiDrawing(pos, "draw");
		} else {
			drawing.endWiiDrawing();
		}
	}, [wiiState, shouldPaint, irCursorEnabled, drawing]);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			if (!presentation.isPlaying || e.button !== 0) return;
			const el = e.target as HTMLElement | null;
			if (el?.closest("button, a, input, textarea, select")) return;
			e.preventDefault();
			drawing.startMouseDrawing(e.clientX, e.clientY);
		},
		[presentation.isPlaying, drawing]
	);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!presentation.isPlaying) return;

			if (drawing.eraserMode) {
				drawing.setCursorPos({ x: e.clientX, y: e.clientY });
				if (drawing.isMouseDrawingRef.current) {
					e.preventDefault();
					drawing.continueMouseDrawing(e.clientX, e.clientY);
				}
				return;
			}

			if (drawing.isMouseDrawingRef.current) {
				e.preventDefault();
				drawing.continueMouseDrawing(e.clientX, e.clientY);
			}
		},
		[presentation.isPlaying, drawing]
	);

	return (
		<main
			ref={containerRef}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={drawing.endMouseDrawing}
			onMouseLeave={drawing.endMouseDrawing}
			className={drawing.isPainting ? "presenter-painting" : "presenter-container"}
			style={{
				position: "relative",
				width: "100vw",
				height: "100vh",
				overflow: "hidden",
				background: "black",
			}}
		>
			<WiiDisconnectPopup
				isPlaying={presentation.isPlaying}
				startedWithWii={presentation.startedWithWii}
				wiiConnected={wiiConnected}
				wiiDisconnectedAt={wiiDisconnectedAt}
				playingSince={presentation.playingSince}
			/>

			<WiiReconnectPopup
				isPlaying={presentation.isPlaying}
				wiiConnected={wiiConnected}
				startedWithWii={presentation.startedWithWii}
			/>

			<div style={{ position: "absolute", top: 20, left: 20, zIndex: 10000 }}>
				<button onClick={goBack} style={{ padding: "10px 14px", fontSize: 14 }}>
					{returnLabel}
				</button>
			</div>

			<ReactionOverlay emitClap={shouldEmitClap} emitLaugh={shouldEmitLaugh} />

			<IrPointerOverlay
				wiiState={wiiState}
				isPlaying={presentation.isPlaying}
				irCursorEnabled={irCursorEnabled}
				showIrDebug={showIrDebug}
			/>

			<SlideDisplay
				currentNode={presentation.currentNode}
				error={presentation.error}
				getOrLoadPdfDocument={getOrLoadPdfDocument}
			/>

			<DrawingCanvas
				drawingPoints={drawing.drawingPoints}
				wiiState={wiiState}
				isPlaying={presentation.isPlaying}
				shouldPaint={shouldPaint}
				eraserMode={drawing.eraserMode}
				eraserPosition={drawing.cursorPos}
			/>

			{showDebugPanel && (
				<WiiDebugPanel
					wiiState={wiiState}
					pressed={pressed}
					effectiveProjectBindings={effectiveProjectBindings}
					irCursorEnabled={irCursorEnabled}
					onToggleIrCursor={() => setIrCursorEnabled(!irCursorEnabled)}
				/>
			)}

			<div
				style={{
					position: "absolute",
					bottom: 20,
					left: 20,
					color: "rgba(255,255,255,0.5)",
					fontSize: 14,
					pointerEvents: "none",
				}}
			>
				[ESC] 戻る | [SPACE] デバッグ表示切替
			</div>

			<EraserCursor position={drawing.cursorPos} isActive={drawing.eraserMode} buttonName={drawing.eraserButtonName} />

			{drawing.eraserMode && drawing.cursorPos && (
				<div
					style={{
						position: "absolute",
						left: drawing.cursorPos.x,
						top: drawing.cursorPos.y,
						width: 120,
						height: 120,
						borderRadius: "50%",
						border: "3px dashed rgba(255, 100, 100, 0.8)",
						background: "rgba(255, 100, 100, 0.2)",
						transform: "translate(-50%, -50%)",
						pointerEvents: "none",
						zIndex: 10000,
					}}
				/>
			)}
		</main>
	);
}
