"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadFromLocalStorage, type SerializedFlow } from "@/lib/presentation";
import { getAssetBlob } from "@/lib/idbAssets";
import { useWiiController } from "@/hooks/useWiiController";
import { ReactionOverlay } from "@/components/presenter/ReactionOverlay";
import { WiiDebugPanel } from "@/components/presenter/WiiDebugPanel";
import { mergeBindings, type BindingAction } from "@/lib/buttonBindings";
import { getProjectBindings } from "@/lib/currentProjectStore";
import { WiiDisconnectPopup } from "@/components/presenter/WiiDisconnectPopup";
import { WiiReconnectPopup } from "@/components/presenter/WiiReconnectPopup";
import { SlideDisplay } from "@/components/presenter/SlideDisplay";
import { DrawingCanvas } from "@/components/presenter/DrawingCanvas";

export function PresenterView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isMouseDrawingRef = useRef(false);
    const wasWiiADownRef = useRef(false);

    // Wiiリモコンの状態を取得
	const { wiiState, pressed, wiiConnected, wiiDisconnectedAt, sendWiiCommand } = useWiiController();

    const soundboardRef = useRef<{ q?: HTMLAudioElement; w?: HTMLAudioElement; e?: HTMLAudioElement }>({});
    const playSound = useCallback((key: "q" | "w" | "e") => {
        const a = soundboardRef.current[key];
        if (!a) return;
        try {
            a.currentTime = 0;
            void a.play();
        } catch (err) {
            console.warn("sound play failed", key, err);
        }
		// Wiiリモコンのスピーカーでも再生
		sendWiiCommand('playSound', { sound: key });
	}, [sendWiiCommand]);

    const returnTo = useMemo(() => {
        return searchParams.get("from") === "editor" ? "/editor" : "/";
    }, [searchParams]);

    const returnLabel = useMemo(() => {
        return returnTo === "/editor" ? "エディタに戻る" : "ホームに戻る";
    }, [returnTo]);

    const goBack = useCallback(() => {
        router.push(returnTo);
    }, [router, returnTo]);
    const [flow, setFlow] = useState<SerializedFlow | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
    const [startedWithWii, setStartedWithWii] = useState(false);
    const [playingSince, setPlayingSince] = useState<number>(0);
    const [showDebugPanel, setShowDebugPanel] = useState(true);

    const pdfDocCacheRef = useRef<Map<string, Promise<any>>>(new Map());

    // ★修正: 常にplaying状態として扱う（flow/currentNodeIdがあれば再生中）
    const isPlaying = flow != null && currentNodeId != null;

    useEffect(() => {
		const q = new Audio("https://www.myinstants.com/media/sounds/nice-shot-wii-sports_DJJ0VOz.mp3");
		const w = new Audio("https://www.myinstants.com/media/sounds/crowdaw.mp3");
		const e = new Audio("https://www.myinstants.com/media/sounds/crowdoh.mp3");
		q.preload = "auto";
		w.preload = "auto";
		e.preload = "auto";
		soundboardRef.current = { q, w, e };
		return () => {
			for (const a of [q, w, e]) {
				try {
					a.pause();
				} catch {
					// ignore
				}
			}
			soundboardRef.current = {};
		};
	}, []);

    // スペースキーでデバッグパネルの表示/非表示を切り替え
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" && e.target === document.body) {
                e.preventDefault();
                setShowDebugPanel(prev => !prev);
            }
        };
        
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

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
				import.meta.url,
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

    // お絵描き用の座標リスト
    const [drawingPoints, setDrawingPoints] = useState<Array<{ x: number; y: number; mode?: "draw" | "erase" } | null>>([]);
    
    // 消しゴムモード（トグル式）- XキーとWiiボタンで共通
    const [eraserMode, setEraserMode] = useState(false);
    const [eraserButtonName, setEraserButtonName] = useState<string | null>(null);
    
    // カーソル位置（消しゴムカーソル表示用）
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

    // 連続遷移を防ぐためのクールタイム管理
    const lastNavTime = useRef<number>(0);

    // 現在のノードデータ
    const currentNode = useMemo(() =>
		flow?.nodes.find((n) => n.id === currentNodeId),
		[flow, currentNodeId]);

    // ★修正: 初回マウント時に自動的にプレゼンテーションを開始
    useEffect(() => {
        const loaded = loadFromLocalStorage();
        if (!loaded || loaded.nodes.length === 0) {
            setError("データが見つかりません。Editorで作成してください。");
            setFlow(null);
            setCurrentNodeId(null);
            return;
        }
        
        // バインド設定を読み込み
        const storedBindings = getProjectBindings();
        const flowWithBindings = storedBindings ? 
            { ...loaded, projectBindings: storedBindings } : loaded;
        
        console.log("PresenterView: Auto-starting presentation with bindings", { storedBindings, flowWithBindings });
        
        setError(null);
        setFlow(flowWithBindings);
        
        // Startノードから開始
        const startNode = loaded.nodes.find((n) => n.data.label === "Start") || loaded.nodes[0];
        setCurrentNodeId(startNode.id);
        
        // Wii接続状態を記録
        setStartedWithWii(!!wiiConnected);
        setPlayingSince(Date.now());
    }, []); // ★空の依存配列で初回のみ実行

    // ★修正: wiiConnectedが変化したら記録を更新
    useEffect(() => {
        if (wiiConnected) setStartedWithWii(true);
    }, [wiiConnected]);

    const outgoingEdges = useMemo(() => {
        if (!flow || !currentNodeId) return [];
        return flow.edges.filter((e) => e.source === currentNodeId);
    }, [flow, currentNodeId]);

    const branchOptions = useMemo(() => {
        // 1-9 の数字で選べる分岐
		const options: Array<{ key: string; target: string }> = [];
		const used = new Set<string>();

		for (const edge of outgoingEdges) {
			const label = (edge.label ?? "").trim();
			const m = label.match(/^([1-9])(?:\b|\s|:|-)/);
			if (m) {
				const k = m[1];
				if (!used.has(k)) {
					options.push({ key: k, target: edge.target });
					used.add(k);
				}
			}
		}

		// ラベルに番号がない場合は、配列順で 1..n を割り当て
		for (const edge of outgoingEdges) {
			if (options.length >= 9) break;
			const nextKey = String(options.length + 1);
			if (used.has(nextKey)) continue;
			options.push({ key: nextKey, target: edge.target });
			used.add(nextKey);
		}

		return options;
    }, [outgoingEdges]);

    const hasMultipleBranches = outgoingEdges.length >= 2;

    // ノード移動処理
    const navigateTo = useCallback((nodeId: string) => {
        // クールタイムチェック (500ms以内の連続遷移は無視)
		const now = Date.now();
		if (now - lastNavTime.current < 500) return;
		lastNavTime.current = now;

		setCurrentNodeId(nodeId);
		setDrawingPoints([]); // スライドが変わったら線を消す
    }, []);

    // 次へ（ロジック改良版）
    const nextSlide = useCallback(() => {
        if (!flow || !currentNodeId) return;
		// 分岐が複数ある場合は、数字選択を優先する
		const edges = flow.edges.filter((e) => e.source === currentNodeId);
		if (edges.length >= 2) return;

		// 現在のノードから出ているエッジをすべて取得
		// (上で取得済み)

		if (edges.length === 0) return;

		// 優先順位付け
		// 1. ラベルがないエッジ (デフォルトルート)
		// 2. ラベルが "next" のエッジ
		// 3. それ以外 (最初に見つかったもの)
		const targetEdge =
			edges.find(e => !e.label || e.label.trim() === "") ||
			edges.find(e => e.label === "next") ||
			edges[0];

		if (targetEdge) navigateTo(targetEdge.target);
    }, [flow, currentNodeId, navigateTo]);

    const branchByNumberKey = useCallback(
		(key: string) => {
			if (!hasMultipleBranches) return;
			const opt = branchOptions.find((o) => o.key === key);
			if (opt) navigateTo(opt.target);
		},
		[branchOptions, hasMultipleBranches, navigateTo],
	);

    // 前へ（逆順検索）
    const prevSlide = useCallback(() => {
        if (!flow || !currentNodeId) return;
		// 自分に向かっているエッジを探して戻る（簡易実装）
		const edge = flow.edges.find(e => e.target === currentNodeId);
		if (edge) navigateTo(edge.source);
    }, [flow, currentNodeId, navigateTo]);

    // 分岐処理（エッジのラベルで検索）
    const branchTo = useCallback((keywords: string[]) => {
        if (!flow || !currentNodeId) return;
		const edges = flow.edges.filter(e => e.source === currentNodeId);
		const target = edges.find(e => keywords.some(k => e.label?.includes(k)));
		if (target) {
			console.log("分岐しました:", target.label);
			navigateTo(target.target);
		}
    }, [flow, currentNodeId, navigateTo]);

    // ★追加: リアクションをデバッグする（N=One, M=Two）
    const [debugEmitClap, setDebugEmitClap] = useState(false);
    const [debugEmitLaugh, setDebugEmitLaugh] = useState(false);

    // キーボード操作 (矢印キー対応 + ESCで戻る)
    useEffect(() => {
        if (!isPlaying) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // 追加: 線をクリア (R)
			if (e.key === "r" || e.key === "R") {
				setDrawingPoints([]);
				isMouseDrawingRef.current = false;
				wasWiiADownRef.current = false;
				return;
			}
			
			// ペイントと消しゴムを切り替え (X) - Wiiボタンと同じ挙動
			if (e.key === "x" || e.key === "X") {
                // 押しっぱなしでON/OFFが暴れないように、リピートは無視
                if (e.repeat) return;
                setEraserMode((prev) => {
                    const next = !prev;
                    if (next) {
                        setEraserButtonName("X");
                        setCursorPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
                    } else {
                        setEraserButtonName(null);
                        setCursorPos(null);
                    }
                    return next;
                });
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

			// ★追加: リアクション（N / M）
			// 押しっぱなしで増殖しないように repeat を無視
			if (!e.repeat) {
				if (e.key === "n" || e.key === "N") {
					setDebugEmitClap(true);
					queueMicrotask(() => setDebugEmitClap(false)); // 1回だけ発火
					return;
				}
				if (e.key === "m" || e.key === "M") {
					setDebugEmitLaugh(true);
					queueMicrotask(() => setDebugEmitLaugh(false)); // 1回だけ発火
					return;
				}
			}

			// 既存: 分岐 1..9
			if (e.key >= "1" && e.key <= "9") {
				branchByNumberKey(e.key);
				return;
			}
			if (e.key === "ArrowRight") {
				if (!hasMultipleBranches) nextSlide();
			}
			if (e.key === "ArrowLeft") prevSlide();
			// ESCキーで元の画面へ戻る（エディタ経由ならエディタへ）
			if (e.key === "Escape") goBack();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPlaying, nextSlide, prevSlide, goBack, branchByNumberKey, hasMultipleBranches, playSound]);

    const effectiveProjectBindings = useMemo(() => {
        const merged = mergeBindings(flow?.projectBindings);
        console.log("PresenterView: effectiveProjectBindings updated", { 
            flowBindings: flow?.projectBindings, 
            merged 
        });
        return merged;
    }, [flow]);

    // --- プロジェクト全体バインドを適用してアクション実行 ---
    const runAction = useCallback(
        (act: BindingAction, btnName?: string) => {
            // 消しゴムモード中は、eraserアクション以外を無効化
            if (eraserMode && act.type !== "eraser") {
                return;
            }
            
            switch (act.type) {
				case "next":
					nextSlide();
					return;
				case "prev":
					prevSlide();
					return;
				case "branchIndex":
					// 1..9 を “分岐選択（数字キー）” と同じ挙動にする
					branchByNumberKey(String(act.index));
					return;
				case "branch": {
					// 既存互換: A/B/HOME は 1..3 にマップ
					if (!hasMultipleBranches) return;
					const map: Record<string, string> = { A: "1", B: "2", HOME: "3" };
				const k = map[act.kind];
					if (k) branchByNumberKey(k);
					return;
				}
				case "reaction":
					// ReactionOverlay が pressed.One/Two を見ているので、ここでは何もしない
					return;
				case "paint":
					// shouldPaintで別途処理するので、ここでは何もしない
					break;
				case "eraser":
					// トグル式に切り替え
					if (eraserMode) {
						// 解除
						setEraserMode(false);
						setEraserButtonName(null);
						setCursorPos(null);
					} else {
						// ON
						setEraserMode(true);
						setEraserButtonName(btnName || "unknown");
						// カーソルを画面中央に
						setCursorPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
					}
					break;
				case "sound":
					// 音声再生処理
				if (act.kind === "shot") playSound("q");
				else if (act.kind === "oh") playSound("e");
				else if (act.kind === "uxo") playSound("w");
					return;
				case "remove":
					// 描画を消去
					setDrawingPoints([]);
					isMouseDrawingRef.current = false;
					wasWiiADownRef.current = false;
					return;
				case "none":
				default:
					return;
            }
        },
        [nextSlide, prevSlide, branchByNumberKey, hasMultipleBranches, playSound, eraserMode],
    );

    // ★修正: Wiiリモコンのボタン処理（isPlayingがtrueの時のみ動作）
    const prevPressedRef = useRef<Record<string, boolean>>({});
    useEffect(() => {
        if (!isPlaying) return;

        // そのフレームで「押された瞬間」のボタンだけ処理（押しっぱなしで連打しない）
        const prevPressed = prevPressedRef.current;
        for (const btn of Object.keys(pressed)) {
            const isDown = (pressed as Record<string, boolean>)[btn];
            const wasDown = !!prevPressed[btn];
            if (!isDown || wasDown) continue;

            const act = (effectiveProjectBindings as Record<string, BindingAction | undefined>)[btn] ?? { type: "none" };
            
            // paint/eraser以外のアクションを実行
            if (act.type !== "paint" && act.type !== "eraser") {
                runAction(act, btn);
            } else if (act.type === "eraser") {
                // eraserボタンは常にトグル可能
                runAction(act, btn);
            }
        }
        prevPressedRef.current = { ...(pressed as Record<string, boolean>) };
    }, [pressed, isPlaying, effectiveProjectBindings, runAction]);

    // ★追加: リアクション検出（バインドベース）
    const shouldEmitClap = useMemo(() => {
        if (!isPlaying) return false;
        // 押されたボタンの中で、"clap" にバインドされているものがあるか？
        for (const btn of Object.keys(pressed)) {
            const isDown = (pressed as Record<string, boolean>)[btn];
            if (!isDown) continue;
            const act = (effectiveProjectBindings as Record<string, BindingAction | undefined>)[btn];
            if (act?.type === "reaction" && act.kind === "clap") return true;
        }
        return false;
    }, [pressed, effectiveProjectBindings, isPlaying]);

    const shouldEmitLaugh = useMemo(() => {
        if (!isPlaying) return false;
        for (const btn of Object.keys(pressed)) {
            const isDown = (pressed as Record<string, boolean>)[btn];
            if (!isDown) continue;
            const act = (effectiveProjectBindings as Record<string, BindingAction | undefined>)[btn];
            if (act?.type === "reaction" && act.kind === "laugh") return true;
        }
        return false;
    }, [pressed, effectiveProjectBindings, isPlaying]);

    // PAINTボタンの最後の入力時刻を記録
    const lastPaintInputTimeRef = useRef<number>(0);
    const [shouldPaint, setShouldPaint] = useState(false);

    // wiiState.buttonsをチェックして、現在PAINTボタンが押されているか継続的に監視
    useEffect(() => {
        if (!isPlaying || !wiiState || eraserMode) return;

        // 現在押されているボタンの中にPAINTがあるかチェック
        let isPaintButtonPressed = false;
        for (const btn of Object.keys(wiiState.buttons)) {
            const isDown = (wiiState.buttons as Record<string, boolean>)[btn];
            if (!isDown) continue;
            const act = (effectiveProjectBindings as Record<string, BindingAction | undefined>)[btn];
            if (act?.type === "paint") {
                isPaintButtonPressed = true;
            }
        }

        if (isPaintButtonPressed) {
            lastPaintInputTimeRef.current = Date.now();
            setShouldPaint(true);
        }
    }, [wiiState, effectiveProjectBindings, isPlaying, eraserMode]);

    // 200msタイマーで描画状態をチェック
    useEffect(() => {
        if (!isPlaying) {
            setShouldPaint(false);
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const paintElapsed = now - lastPaintInputTimeRef.current;
            
            if (paintElapsed > 100 && shouldPaint) {
                setShouldPaint(false);
                // 描画を終了
                if (isMouseDrawingRef.current) {
                    isMouseDrawingRef.current = false;
                    setDrawingPoints((prev) => (prev.length > 0 && prev[prev.length - 1] !== null ? [...prev, null] : prev));
                }
            }
        }, 50); // 50msごとにチェック

        return () => clearInterval(interval);
    }, [isPlaying, shouldPaint]);

    // --- 描画/消しゴムロジック (IRセンサー & PAINTボタン) ---
    useEffect(() => {
        if (!wiiState || wiiState.ir.length === 0) return;

        const dot = wiiState.ir[0];
        // IRカメラの座標(0-1023)を画面座標に変換
        const x = (1 - dot.x / 1024) * window.innerWidth;
        const y = (dot.y / 768) * window.innerHeight;
        const pos = { x, y };

        // 消しゴムモード中: IRでカーソルを移動
        if (eraserMode) {
            setCursorPos(pos);
            
            // AとBを同時押ししているかチェック
            const isAPressed = wiiState.buttons.A;
            const isBPressed = wiiState.buttons.B;
            
            if (isAPressed && isBPressed) {
                // A+B同時押しで消去
                setDrawingPoints((prev) => {
                    const next = prev.slice();
                    if (!wasWiiADownRef.current) {
                        if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                    }
                    next.push({ ...pos, mode: "erase" });
                    return next;
                });
                wasWiiADownRef.current = true;
            } else {
                // A+Bを離したら区切る
                if (wasWiiADownRef.current) {
                    wasWiiADownRef.current = false;
                    setDrawingPoints((prev) => (prev.length > 0 && prev[prev.length - 1] !== null ? [...prev, null] : prev));
                }
            }
            return;
        }

        // PAINTバインドされたボタンを押している間、軌跡を追加
        if (shouldPaint) {
            setDrawingPoints((prev) => {
                const next = prev.slice();
                if (!wasWiiADownRef.current) {
                    // 前回の線と繋がらないように区切りを入れる
                    if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                }
                next.push({ ...pos, mode: "draw" });
                return next;
            });
            wasWiiADownRef.current = true;
        } else {
            // 離したタイミングで区切る
            if (wasWiiADownRef.current) {
                wasWiiADownRef.current = false;
                setDrawingPoints((prev) => (prev.length > 0 && prev[prev.length - 1] !== null ? [...prev, null] : prev));
            }
        }
    }, [wiiState, shouldPaint, eraserMode]);


    return (
        <main
            ref={containerRef}
            onMouseDown={(e) => {
                if (!isPlaying) return;
                if (e.button !== 0) return;
                // UI(ボタン等)操作は邪魔しない
                const el = e.target as HTMLElement | null;
                if (el && el.closest("button, a, input, textarea, select")) return;
                e.preventDefault();
                
                // 消しゴムモード中は左クリックで消去開始
                if (eraserMode) {
                    isMouseDrawingRef.current = true;
                    setDrawingPoints((prev) => {
                        const next = prev.slice();
                        if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                        next.push({ x: e.clientX, y: e.clientY, mode: "erase" });
                        return next;
                    });
                    return;
                }
                
                // 通常モード：左クリックで描画開始
                isMouseDrawingRef.current = true;
                setDrawingPoints((prev) => {
                    const next = prev.slice();
                    if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                    next.push({ x: e.clientX, y: e.clientY, mode: "draw" });
                    return next;
                });
            }}
            onMouseMove={(e) => {
                if (!isPlaying) return;
                
                // 消しゴムモード時：常にカーソル位置を更新
                if (eraserMode) {
                    setCursorPos({ x: e.clientX, y: e.clientY });
                    
                    // 左クリック中またはA+B同時押し中に消去
                    const isAPressed = wiiState?.buttons.A || false;
                    const isBPressed = wiiState?.buttons.B || false;
                    const shouldErase = isMouseDrawingRef.current || (isAPressed && isBPressed);
                    
                    if (shouldErase) {
                        e.preventDefault();
                        setDrawingPoints((prev) => {
                            const last = prev[prev.length - 1];
                            if (last && last.x && Math.abs(last.x - e.clientX) + Math.abs(last.y - e.clientY) < 2) return prev;
                            return [...prev, { x: e.clientX, y: e.clientY, mode: "erase" }];
                        });
                        
                        // A+Bでの描画フラグを立てる
                        if (isAPressed && isBPressed && !wasWiiADownRef.current) {
                            wasWiiADownRef.current = true;
                            setDrawingPoints((prev) => {
                                const next = prev.slice();
                                if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                                return next;
                            });
                        }
                    }
                    return;
                }
                
                // PAINTボタンが押されている、またはマウスドラッグ中
                if (!shouldPaint && !isMouseDrawingRef.current) return;
                
                e.preventDefault();
                
                // PAINTボタンで開始（マウスダウンしていない場合）
                if (shouldPaint && !isMouseDrawingRef.current) {
                    isMouseDrawingRef.current = true;
                    setDrawingPoints((prev) => {
                        const next = prev.slice();
                        if (next.length > 0 && next[next.length - 1] !== null) next.push(null);
                        next.push({ x: e.clientX, y: e.clientY, mode: "draw" });
                        return next;
                    });
                    return;
                }
                
                setDrawingPoints((prev) => {
                    const last = prev[prev.length - 1];
                    if (last && last.x && Math.abs(last.x - e.clientX) + Math.abs(last.y - e.clientY) < 2) return prev;
                    return [...prev, { x: e.clientX, y: e.clientY, mode: "draw" }];
                });
            }}
            onMouseUp={() => {
                if (!isMouseDrawingRef.current) return;
                isMouseDrawingRef.current = false;
                setDrawingPoints((prev) => (prev.length > 0 && prev[prev.length - 1] !== null ? [...prev, null] : prev));
            }}
            onMouseLeave={() => {
                if (!isMouseDrawingRef.current) return;
                isMouseDrawingRef.current = false;
                setDrawingPoints((prev) => (prev.length > 0 && prev[prev.length - 1] !== null ? [...prev, null] : prev));
            }}
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                background: "black",
            }}
        >
            <WiiDisconnectPopup
                isPlaying={isPlaying}
                startedWithWii={startedWithWii}
                wiiConnected={wiiConnected}
                wiiDisconnectedAt={wiiDisconnectedAt}
                playingSince={playingSince}
            />

            <WiiReconnectPopup
                isPlaying={isPlaying}
                wiiConnected={wiiConnected}
                startedWithWii={startedWithWii}
            />

            {/* 戻るボタン（左上） */}
            <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10000 }}>
                <button onClick={goBack} style={{ padding: "10px 14px", fontSize: 14 }}>
                    {returnLabel}
                </button>
            </div>

            {/* リアクション */}
            <ReactionOverlay emitClap={shouldEmitClap} emitLaugh={shouldEmitLaugh} />

            {/* スライド表示エリア (全画面・余白なし・アスペクト比維持) */}
            <SlideDisplay
                currentNode={currentNode}
                error={error}
                getOrLoadPdfDocument={getOrLoadPdfDocument}
            />

            {/* 描画レイヤー (最前面) */}
            <DrawingCanvas
                drawingPoints={drawingPoints}
                wiiState={wiiState}
                isPlaying={isPlaying}
                shouldPaint={shouldPaint}
                eraserMode={false}
                eraserPosition={null}
            />

            {/* デバッグ情報 (右上) */}
            {showDebugPanel && (
                <WiiDebugPanel
                    wiiState={wiiState}
                    pressed={pressed}
                    effectiveProjectBindings={effectiveProjectBindings}
                />
            )}

            {/* 操作ガイド (左下) */}
            <div style={{ position: "absolute", bottom: 20, left: 20, color: "rgba(255,255,255,0.5)", fontSize: 14, pointerEvents: "none" }}>
                [ESC] 戻る | [SPACE] デバッグ表示切替
            </div>

            {/* 消しゴムモード表示 */}
            {eraserMode && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 80,
                        right: 20,
                        background: "rgba(255, 100, 100, 0.7)",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: "normal",
                        zIndex: 9999,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        pointerEvents: "none",
                    }}
                >
                    🧹 消しゴムモード ON<br/>
                    <small style={{ fontSize: 11 }}>左クリックまたはA+Bで消去 | {eraserButtonName}で解除</small>
                </div>
            )}
            
            {/* 消しゴムカーソル */}
            {eraserMode && cursorPos && (
                <div
                    style={{
                        position: "absolute",
                        left: cursorPos.x,
                        top: cursorPos.y,
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