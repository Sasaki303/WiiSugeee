"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { mergeBindings, type ButtonBindings } from "@/lib/buttonBindings";
import { getProjectBindings, setProjectBindings } from "@/lib/currentProjectStore";

type SlotId = "A" | "B" | "PLUS" | "MINUS" | "HOME" | "ONE" | "TWO" | "UP" | "DOWN" | "LEFT" | "RIGHT";
type FuncId =
	| "NEXT"
	| "PREV"
	| "HOME"
	| "CLAP"
	| "SMILE"
	| "PLUS"
	| "MINUS"
	| "UP"
	| "DOWN"
	| "A"
	| "B"
	| "CASE_A"
	| "CASE_B"
	| "CASE_C"
	| "CASE_D"
	| "CASE_E"
	| "CASE_F"
	| "CASE_G"
	| "CASE_H"
	| "CASE_I";

type Bindings = Record<SlotId, FuncId>;

type Rect = { x: number; y: number; w: number; h: number };

// 3500x3500 のSVG前提（viewBox座標）
const SLOT_SIZE = { w: 350, h: 136 };

const SLOTS_RECT: Record<SlotId, Rect> = {
	A: { x: 847, y: 1110, w: SLOT_SIZE.w, h: SLOT_SIZE.h },
	B: { x: 2311, y: 1352, w: SLOT_SIZE.w, h: SLOT_SIZE.h },
	PLUS: { x: 1649, y: 1314, w: SLOT_SIZE.w, h: SLOT_SIZE.h },
	MINUS: { x: 843, y: 1312, w: SLOT_SIZE.w, h: SLOT_SIZE.h },
	HOME: { x: 1652, y: 1584, w: SLOT_SIZE.w, h: SLOT_SIZE.h },
	ONE: { x: 1654, y: 2028, w: SLOT_SIZE.w, h: SLOT_SIZE.h },
	TWO: { x: 1652, y: 2242, w: SLOT_SIZE.w, h: SLOT_SIZE.h },
	DOWN: { x: 1650, y: 975, w: SLOT_SIZE.w, h: SLOT_SIZE.h },
	UP: { x: 1371, y: 562, w: SLOT_SIZE.w, h: SLOT_SIZE.h },
	LEFT: { x: 847, y: 811, w: SLOT_SIZE.w, h: SLOT_SIZE.h },
	RIGHT: { x: 1649, y: 805, w: SLOT_SIZE.w, h: SLOT_SIZE.h },
};

// デフォルトのバインディング（指定どおり）
const DEFAULT_BINDINGS: Bindings = {
    RIGHT: "NEXT",
    LEFT: "PREV",
    UP: "UP",
    DOWN: "DOWN",
    ONE: "CLAP",
    TWO: "SMILE",
    HOME: "HOME",
    MINUS: "MINUS",
    PLUS: "PLUS",
    A: "A",
    B: "B",
};

function clampRect(r: Rect): Rect {
    const x = Math.min(r.x, r.x + r.w);
    const y = Math.min(r.y, r.y + r.h);
    const w = Math.abs(r.w);
    const h = Math.abs(r.h);
    return { x, y, w, h };
}

function toSvgPoint(svg: SVGSVGElement, clientX: number, clientY: number) {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
}

function funcLabel(f: FuncId): string {
    if (f.startsWith("CASE_")) return `CASE ${f.replace("CASE_", "")}`;
    switch (f) {
        case "NEXT":
            return "NEXT";
        case "PREV":
            return "PREV";
        case "HOME":
            return "HOME";
        case "CLAP":
            return "CLAP";
        case "SMILE":
            return "SMILE";
        case "PLUS":
            return "＋";
        case "MINUS":
            return "－";
        case "UP":
            return "UP";
        case "DOWN":
            return "DOWN";
        case "A":
            return "A";
        case "B":
            return "B";
        default:
            return f;
    }
}

function slotLabel(s: SlotId) {
    switch (s) {
        case "PLUS":
            return "+";
        case "MINUS":
            return "-";
        case "ONE":
            return "1";
        case "TWO":
            return "2";
        default:
            return s;
    }
}

type DragPayload =
    | { kind: "func"; funcId: FuncId } // パレットから
    | { kind: "slot"; slotId: SlotId }; // スロットから（swap用）

function setTransfer(e: React.DragEvent, payload: DragPayload) {
    const json = JSON.stringify(payload);
    e.dataTransfer.setData("application/json", json);
    // 一部ブラウザで application/json が落ちる場合に備えて text/plain も入れる
    e.dataTransfer.setData("text/plain", json);
    e.dataTransfer.effectAllowed = "move";
}

function getTransfer(e: React.DragEvent): DragPayload | null {
    try {
        const raw = e.dataTransfer.getData("application/json") || e.dataTransfer.getData("text/plain");
        if (!raw) return null;
        return JSON.parse(raw) as DragPayload;
    } catch {
        return null;
    }
}

function allFuncs(maxCase: number): FuncId[] {
    const base: FuncId[] = ["NEXT", "PREV", "HOME", "CLAP", "SMILE", "PLUS", "MINUS", "UP", "DOWN", "A", "B"];
    const cases: FuncId[] = ["CASE_A", "CASE_B", "CASE_C", "CASE_D", "CASE_E", "CASE_F", "CASE_G", "CASE_H", "CASE_I"].slice(
        0,
        Math.max(0, Math.min(9, maxCase)),
    ) as FuncId[];
    return [...base, ...cases];
}

function toAction(funcId: FuncId): ButtonBindings[keyof ButtonBindings] {
	switch (funcId) {
		case "NEXT":
			return { type: "next" };
		case "PREV":
			return { type: "prev" };
		case "CLAP":
			return { type: "reaction", kind: "clap" };
		case "SMILE":
			return { type: "reaction", kind: "laugh" };
		case "PLUS":
			return { type: "branch", kind: "A" };
		case "MINUS":
			return { type: "branch", kind: "B" };
		case "HOME":
			return { type: "branch", kind: "HOME" };
		case "CASE_A":
			return { type: "branchIndex", index: 1 };
		case "CASE_B":
			return { type: "branchIndex", index: 2 };
		case "CASE_C":
			return { type: "branchIndex", index: 3 };
		case "CASE_D":
			return { type: "branchIndex", index: 4 };
		case "CASE_E":
			return { type: "branchIndex", index: 5 };
		case "CASE_F":
			return { type: "branchIndex", index: 6 };
		case "CASE_G":
			return { type: "branchIndex", index: 7 };
		case "CASE_H":
			return { type: "branchIndex", index: 8 };
		case "CASE_I":
			return { type: "branchIndex", index: 9 };
		case "UP":
		case "DOWN":
		case "A":
		case "B":
			// まだ具体アクションが無いので none 扱い（将来拡張）
			return { type: "none" };
		default:
			return { type: "none" };
	}
}

function toButtonBindings(b: Bindings): ButtonBindings {
	return {
		Right: toAction(b.RIGHT),
		Left: toAction(b.LEFT),
		Up: toAction(b.UP),
		Down: toAction(b.DOWN),
		A: toAction(b.A),
		B: toAction(b.B),
		One: toAction(b.ONE),
		Two: toAction(b.TWO),
		Plus: toAction(b.PLUS),
		Minus: toAction(b.MINUS),
		Home: toAction(b.HOME),
	};
}

function fromAction(a: ButtonBindings[keyof ButtonBindings] | undefined, fallback: FuncId): FuncId {
	if (!a) return fallback;
	if (a.type === "next") return "NEXT";
	if (a.type === "prev") return "PREV";
	if (a.type === "reaction") return a.kind === "clap" ? "CLAP" : "SMILE";
	if (a.type === "branchIndex") {
		const map: Record<number, FuncId> = {
			1: "CASE_A",
			2: "CASE_B",
			3: "CASE_C",
			4: "CASE_D",
			5: "CASE_E",
			6: "CASE_F",
			7: "CASE_G",
			8: "CASE_H",
			9: "CASE_I",
		};
		return map[a.index] ?? fallback;
	}
	if (a.type === "branch") {
		if (a.kind === "A") return "PLUS";
		if (a.kind === "B") return "MINUS";
		return "HOME";
	}
	return fallback;
}

function fromButtonBindings(bindings: ButtonBindings | undefined): Bindings {
	const eff = mergeBindings(bindings);
	return {
		RIGHT: fromAction(eff.Right, DEFAULT_BINDINGS.RIGHT),
		LEFT: fromAction(eff.Left, DEFAULT_BINDINGS.LEFT),
		UP: fromAction(eff.Up, DEFAULT_BINDINGS.UP),
		DOWN: fromAction(eff.Down, DEFAULT_BINDINGS.DOWN),
		ONE: fromAction(eff.One, DEFAULT_BINDINGS.ONE),
		TWO: fromAction(eff.Two, DEFAULT_BINDINGS.TWO),
		HOME: fromAction(eff.Home, DEFAULT_BINDINGS.HOME),
		PLUS: fromAction(eff.Plus, DEFAULT_BINDINGS.PLUS),
		MINUS: fromAction(eff.Minus, DEFAULT_BINDINGS.MINUS),
		A: fromAction(eff.A, DEFAULT_BINDINGS.A),
		B: fromAction(eff.B, DEFAULT_BINDINGS.B),
	};
}

export function WiiBindingsEditor(props: { onBack?: () => void }) {
    const [maxCase] = useState<number>(9);
    const funcs = useMemo(() => allFuncs(maxCase), [maxCase]);

    const readStored = (): Bindings => {
        const stored = getProjectBindings();
        if (!stored) return DEFAULT_BINDINGS;
        return fromButtonBindings(stored);
    };

    const [bindings, setBindings] = useState<Bindings>(() => readStored());
    const [savedBindings, setSavedBindings] = useState<Bindings>(() => readStored());

    const isDirty = useMemo(() => JSON.stringify(bindings) !== JSON.stringify(savedBindings), [bindings, savedBindings]);

    const onSave = useCallback(() => {
        setProjectBindings(toButtonBindings(bindings)); // localStorageへ保存
        setSavedBindings(bindings);
    }, [bindings]);

    const onResetToDefault = () => setBindings(DEFAULT_BINDINGS);

    const reloadFromStorage = () => {
        const next = readStored(); // localStorageから再読込
        setBindings(next);
        setSavedBindings(next);
    };

    // --- ★追加: 戻る確認モーダル（3択） ---
    const [showBackModal, setShowBackModal] = useState(false);

    const requestBack = useCallback(() => {
        if (!isDirty) {
            props.onBack?.();
            return;
        }
        setShowBackModal(true);
    }, [isDirty, props.onBack]);

    // settings/page.tsx から window イベントで呼び出す
    useEffect(() => {
        const handler = () => requestBack();
        window.addEventListener("wiibindings:requestBack", handler);
        return () => window.removeEventListener("wiibindings:requestBack", handler);
    }, [requestBack]);

    const doSaveAndBack = useCallback(() => {
        onSave();
        setShowBackModal(false);
        props.onBack?.();
    }, [onSave, props.onBack]);

    const doDiscardAndBack = useCallback(() => {
        // 破棄＝保存済みに戻す
        const next = readStored();
        setBindings(next);
        setSavedBindings(next);
        setShowBackModal(false);
        props.onBack?.();
    }, [props.onBack]);

    const doCancelBack = useCallback(() => {
        setShowBackModal(false);
    }, []);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // 検索UIは不要
    const filteredFuncs = funcs;

    const assign = (slot: SlotId, funcId: FuncId) => {
        setBindings((prev) => ({ ...prev, [slot]: funcId }));
    };

    const swap = (a: SlotId, b: SlotId) => {
        setBindings((prev) => {
            const next = { ...prev };
            const tmp = next[a];
            next[a] = next[b];
            next[b] = tmp;
            return next;
        });
    };

    const onDropSlot = (slot: SlotId) => (e: React.DragEvent) => {
        e.preventDefault();
        const payload = getTransfer(e);
        if (!payload) return;

        if (payload.kind === "func") {
            setBindings((prev) => ({ ...prev, [slot]: payload.funcId }));
            return;
        }
        if (payload.kind === "slot") {
            if (payload.slotId === slot) return;
            setBindings((prev) => {
                const next = { ...prev };
                const tmp = next[payload.slotId];
                next[payload.slotId] = next[slot];
                next[slot] = tmp;
                return next;
            });
        }
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 420px",
                gap: 10,
                alignItems: "start",
                position: "relative",
            }}
        >
            {/* ★追加: 戻る確認モーダル */}
            {showBackModal ? (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="未保存の変更があります"
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 40000,
                        display: "grid",
                        placeItems: "center",
                        background: "rgba(0,0,0,0.55)",
                        padding: 16,
                    }}
                    onClick={doCancelBack}
                >
                    <div
                        style={{
                            width: "min(520px, 92vw)",
                            borderRadius: 14,
                            background: "#fff",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 24px 90px rgba(0,0,0,0.25)",
                            padding: 16,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>変更が未保存です</div>
                        <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 14 }}>
                            エディタに戻る前に、変更を保存しますか？
                        </div>

                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <button
                                onClick={doCancelBack}
                                style={{
                                    height: 34,
                                    padding: "0 12px",
                                    borderRadius: 10,
                                    border: "1px solid #e5e7eb",
                                    background: "#fff",
                                    color: "#111827",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                }}
                            >
                                キャンセル
                            </button>

                            <button
                                onClick={doDiscardAndBack}
                                style={{
                                    height: 34,
                                    padding: "0 12px",
                                    borderRadius: 10,
                                    border: "1px solid #e5e7eb",
                                    background: "#fff",
                                    color: "#b91c1c",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                }}
                                title="保存せずに戻ります"
                            >
                                破棄して戻る
                            </button>

                            <button
                                onClick={doSaveAndBack}
                                style={{
                                    height: 34,
                                    padding: "0 12px",
                                    borderRadius: 10,
                                    border: "1px solid #111827",
                                    background: "#111827",
                                    color: "#fff",
                                    fontWeight: 900,
                                    cursor: "pointer",
                                }}
                                title="保存して戻ります"
                            >
                                保存して戻る
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* 左：SVG + 11スロット */}
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", background: "transparent" }}>
				<svg
					viewBox="800 500 2000 2400"
					style={{ width: "100%", height: "82vh", display: "block", background: "#fff" }}
				>
					<image href="/WiiRemoteButtonBindDefault.svg" x={0} y={0} width={3500} height={3500} preserveAspectRatio="xMidYMid meet" />

					{(Object.keys(SLOTS_RECT) as SlotId[]).map((slot) => {
						const r = SLOTS_RECT[slot];
						const f = bindings[slot];
						const pad = 10;
						const blockX = r.x + pad;
						const blockY = r.y + pad;
						const blockW = r.w - pad * 2;
						const blockH = r.h - pad * 2;

						return (
							<g
								key={slot}
								onDragOver={(e) => {
									e.preventDefault();
									e.dataTransfer.dropEffect = "move";
								}}
								onDrop={onDropSlot(slot)}
								style={{ cursor: "pointer" }}
							>
								<rect
									x={r.x}
									y={r.y}
									width={r.w}
									height={r.h}
									rx={26}
									ry={26}
									fill="rgba(255,255,255,0.92)"
									stroke="#111827"
								/>

								<g
									// @ts-ignore
									draggable={true}
									onDragStart={(e) => setTransfer(e, { kind: "slot", slotId: slot })}
									style={{ pointerEvents: "all" }}
								>
									<rect
										x={blockX}
										y={blockY}
									width={blockW}
									height={blockH}
									rx={18}
									fill="#111827"
									opacity={0.92}
									// @ts-ignore
									draggable={true}
									onDragStart={(e) => setTransfer(e, { kind: "slot", slotId: slot })}
							/>
									{mounted ? (
										<text
											x={blockX + 18}
											y={blockY + blockH / 2}
										fontSize={44}
										fill="#ffffff"
										dominantBaseline="middle"
										pointerEvents="none"
										style={{ userSelect: "none" }}
							>
								{funcLabel(f)}
							</text>
									) : null}
							</g>
						</g>
					);
				})}
			</svg>
		</div>

		{/* 右：機能ブロック一覧 */}
		<div
			style={{
				border: "1px solid #e5e7eb",
				borderRadius: 12,
				padding: 12,
				background: "#fff",
				height: "82vh",
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
				<div style={{ fontWeight: 700, fontSize: 13 }}>機能ブロック</div>
				<div style={{ fontSize: 12, color: "#6b7280" }}>{filteredFuncs.length} 件</div>
			</div>

			<div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
				<button
					onClick={onSave}
					disabled={!isDirty}
					style={{
						height: 32,
						padding: "0 12px",
						borderRadius: 10,
						border: "1px solid #111827",
						background: isDirty ? "#111827" : "#e5e7eb",
						color: isDirty ? "#fff" : "#6b7280",
						fontWeight: 800,
						cursor: isDirty ? "pointer" : "not-allowed",
					}}
				>
					保存
				</button>
				<button
					onClick={onResetToDefault}
					style={{
						height: 32,
						padding: "0 12px",
						borderRadius: 10,
						border: "1px solid #e5e7eb",
						background: "#fff",
						color: "#111827",
						fontWeight: 700,
						cursor: "pointer",
					}}
				>
					デフォルト
				</button>
				<button
					onClick={reloadFromStorage}
					style={{
						height: 32,
						padding: "0 12px",
						borderRadius: 10,
						border: "1px solid #e5e7eb",
						background: "#fff",
						color: "#111827",
						fontWeight: 700,
						cursor: "pointer",
					}}
					title="保存済みの設定を再読み込み"
				>
					再読込
				</button>
				<div style={{ marginLeft: "auto", fontSize: 12, color: isDirty ? "#b45309" : "#16a34a" }}>
					{isDirty ? "未保存" : "保存済み"}
				</div>
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(6, 1fr)",
					gap: 6,
					flex: 1,
					minHeight: 0,
					overflow: "auto",
				}}
			>
				{filteredFuncs.map((f) => (
					<div
						key={f}
						draggable
						onDragStart={(e) => setTransfer(e, { kind: "func", funcId: f })}
						style={{
							border: "1px solid #111827",
							borderRadius: 12,
							padding: "0 6px",
							background: "#111827",
							color: "#fff",
							userSelect: "none",
							cursor: "grab",
							fontSize: 12,
							fontWeight: 800,
							height: 36,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							letterSpacing: 0.2,
							overflow: "hidden",
							whiteSpace: "nowrap",
							textOverflow: "ellipsis",
						}}
						title="ドラッグして割り当て"
					>
						{funcLabel(f)}
					</div>
				))}
			</div>
		</div>
	</div>
	);
}