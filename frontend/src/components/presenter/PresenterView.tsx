// frontend/src/components/presenter/PresenterView.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadFromLocalStorage, type SerializedFlow } from "@/lib/presentation";
import { useWiiController } from "@/hooks/useWiiController"; // Hookをインポート

type Mode = "idle" | "playing";

// 座標変換ヘルパー (IR座標 0-1023 を画面サイズに変換)
function mapIrToScreen(irX: number, irY: number, screenW: number, screenH: number) {
    // WiiのIRカメラは左右反転して見えることがあるため、適宜調整してください
    // 簡易的に 1024x768 の領域を画面いっぱいにマップ
    const x = (1 - irX / 1024) * screenW; 
    const y = (irY / 768) * screenH;
    return { x, y };
}

export function PresenterView() {
    const router = useRouter();
    const { wiiState, pressed } = useWiiController(); // Wiiデータ取得
    
    // ... (既存のState定義) ...
    const [mode, setMode] = useState<Mode>("idle");
    const [flow, setFlow] = useState<SerializedFlow | null>(null);
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null); // 現在のノードID管理に変更
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [drawingPoints, setDrawingPoints] = useState<{x:number, y:number}[]>([]);

    // 現在のノード取得
    const currentNode = useMemo(() => 
        flow?.nodes.find(n => n.id === currentNodeId), 
    [flow, currentNodeId]);

    // ノード遷移関数
    const navigateTo = useCallback((nodeId: string) => {
        setCurrentNodeId(nodeId);
        setDrawingPoints([]); // スライド移動時に描画リセット
    }, []);

    const nextSlide = useCallback(() => {
        if (!flow || !currentNodeId) return;
        const edge = flow.edges.find(e => e.source === currentNodeId); // 単純に最初の接続先へ
        if (edge) navigateTo(edge.target);
    }, [flow, currentNodeId, navigateTo]);

    const prevSlide = useCallback(() => {
        if (!flow || !currentNodeId) return;
        const edge = flow.edges.find(e => e.target === currentNodeId); // 親に戻る（簡易）
        if (edge) navigateTo(edge.source);
    }, [flow, currentNodeId, navigateTo]);

    // 分岐処理 (+, -, Home)
    const branchToLabel = useCallback((labelKeywords: string[]) => {
        if (!flow || !currentNodeId) return;
        // 現在のノードから出ているエッジを探し、ラベルが一致するものを探す
        const edges = flow.edges.filter(e => e.source === currentNodeId);
        const targetEdge = edges.find(e => labelKeywords.some(kw => e.label?.includes(kw)));
        
        if (targetEdge) {
            navigateTo(targetEdge.target);
        } else {
            console.log("分岐先が見つかりません:", labelKeywords);
        }
    }, [flow, currentNodeId, navigateTo]);

    // エフェクト処理
    const triggerEffect = useCallback((type: "clap" | "cheer") => {
        console.log(`Effect Triggered: ${type}`);
        // ここにパーティクルや音声再生処理を入れる
        const audio = new Audio(type === "clap" ? "/se/clap.mp3" : "/se/cheer.mp3");
        audio.play().catch(() => {}); // エラー無視
        // 簡易表示
        const el = document.createElement("div");
        el.textContent = type === "clap" ? "👏" : "🎉";
        el.style.position = "absolute";
        el.style.left = "50%";
        el.style.top = "50%";
        el.style.fontSize = "100px";
        el.style.animation = "fadeout 1s forwards";
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }, []);

    // 初期ロード
    const onPlay = useCallback(() => {
        const loaded = loadFromLocalStorage();
        if (loaded && loaded.nodes.length > 0) {
            setFlow(loaded);
            // "Start" ラベルか、なければ最初のノード
            const start = loaded.nodes.find(n => n.data.label === "Start") || loaded.nodes[0];
            setCurrentNodeId(start.id);
            setMode("playing");
        }
    }, []);

    // --- Wii操作ロジック ---
    useEffect(() => {
        if (mode !== "playing") return;

        // スライド進行
        if (pressed.Right) nextSlide();
        if (pressed.Left) prevSlide();

        // 分岐
        if (pressed.Plus) branchToLabel(["+", "plus", "Aルート"]);
        if (pressed.Minus) branchToLabel(["-", "minus", "Bルート"]);
        if (pressed.Home) branchToLabel(["home", "top", "戻る"]);

        // エフェクト
        if (pressed.One) triggerEffect("clap");
        if (pressed.Two) triggerEffect("cheer");

    }, [pressed, mode, nextSlide, prevSlide, branchToLabel, triggerEffect]);

    // --- 描画ロジック (RequestAnimationFrameで連続描画) ---
    useEffect(() => {
        if (!wiiState || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // キャンバスサイズ合わせ
        if (canvas.width !== window.innerWidth) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // IR座標の取得
        if (wiiState.ir.length > 0) {
            const point = wiiState.ir[0]; // 1点目を使用
            const screenPos = mapIrToScreen(point.x, point.y, window.innerWidth, window.innerHeight);

            // Aボタンを押している間だけ線を引く
            if (wiiState.buttons.A) {
                setDrawingPoints(prev => [...prev, screenPos]);
            } else {
                // Aを離したらリセット（または一筆書き終了）
                // ここではシンプルに「離したら描かない」だけにするが、
                // 永続化したい場合はステート管理を工夫する
            }

            // カーソル描画 (常に表示)
            // 再描画のためにCanvasをクリアすると線も消えるので、
            // 線はState(drawingPoints)から毎回全描画し、その上にカーソルを描く
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 線の描画
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.lineWidth = 5;
            if (drawingPoints.length > 0) {
                ctx.moveTo(drawingPoints[0].x, drawingPoints[0].y);
                for (let i = 1; i < drawingPoints.length; i++) {
                    ctx.lineTo(drawingPoints[i].x, drawingPoints[i].y);
                }
            }
            ctx.stroke();

            // カーソル
            ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y, 10, 0, Math.PI * 2);
            ctx.fill();
        }

    }, [wiiState, drawingPoints]); // 注意: 頻繁に更新されるため、最適化の余地あり

    // ... (UIレンダリング部分: 既存のコードをベースにCanvasを追加) ...

    if (mode === "idle") {
        // (既存のidle表示)
        return <button onClick={onPlay}>再生</button>;
    }

    return (
        <main style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
            {/* スライドコンテンツ */}
            <div style={{ position: "absolute", inset: 0, padding: 20 }}>
                {currentNode ? (
                    <div>
                        <h1>{currentNode.data.label}</h1>
                        {/* アセット表示ロジックは既存と同様 */}
                        {currentNode.data.asset?.kind === "video" && (
                            <div style={{color: 'red'}}>※ 動画スライド: {currentNode.data.asset.fileName}</div>
                        )}
                         {currentNode.data.asset?.kind === "pdf" && (
                            <img src={currentNode.data.asset.thumbnailDataUrl} style={{maxHeight: '80vh'}} />
                        )}
                    </div>
                ) : <div>End</div>}
            </div>

            {/* 描画レイヤー */}
            <canvas 
                ref={canvasRef}
                style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
            />
            
            {/* デバッグ表示（左下） */}
            <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(0,0,0,0.5)", color: "white", fontSize: 10 }}>
                Acc: {wiiState?.accel.x}, {wiiState?.accel.y}, {wiiState?.accel.z} <br/>
                IR: {wiiState?.ir.length} points
            </div>
        </main>
    );
}