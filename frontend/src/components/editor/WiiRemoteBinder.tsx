"use client";

import { useMemo, useState } from "react";
import type { WiiState } from "@/hooks/useWiiController";
import type { ButtonBindings, BindingAction, WiiButton } from "@/lib/buttonBindings";
import { decodeAction, encodeAction, formatAction, mergeBindings } from "@/lib/buttonBindings";

type Hotspot = {
	button: WiiButton;
	label: string;
	// 画像上の相対座標（0..1）。後で実写画像に合わせて微調整する前提。
	x: number;
	y: number;
	w: number;
	h: number;
};

// NOTE: 実写画像が決まったら座標を調整してください。
const HOTSPOTS: Hotspot[] = [
	{ button: "Up", label: "↑", x: 0.28, y: 0.33, w: 0.12, h: 0.08 },
	{ button: "Left", label: "←", x: 0.18, y: 0.41, w: 0.12, h: 0.08 },
	{ button: "Down", label: "↓", x: 0.28, y: 0.49, w: 0.12, h: 0.08 },
	{ button: "Right", label: "→", x: 0.38, y: 0.41, w: 0.12, h: 0.08 },

	{ button: "A", label: "A", x: 0.72, y: 0.42, w: 0.14, h: 0.1 },
	{ button: "B", label: "B", x: 0.63, y: 0.52, w: 0.16, h: 0.12 },

	{ button: "Plus", label: "+", x: 0.48, y: 0.2, w: 0.12, h: 0.08 },
	{ button: "Minus", label: "-", x: 0.48, y: 0.62, w: 0.12, h: 0.08 },
	{ button: "Home", label: "HOME", x: 0.48, y: 0.4, w: 0.14, h: 0.1 },

	{ button: "One", label: "1", x: 0.34, y: 0.72, w: 0.12, h: 0.08 },
	{ button: "Two", label: "2", x: 0.62, y: 0.72, w: 0.12, h: 0.08 },
];

function actionOptions(): Array<{ value: BindingAction; label: string }> {
	return [
		{ value: { type: "none" }, label: "未割当" },
		{ value: { type: "next" }, label: "次へ" },
		{ value: { type: "prev" }, label: "戻る" },
		{ value: { type: "branch", kind: "A" }, label: "Aルートへ分岐" },
		{ value: { type: "branch", kind: "B" }, label: "Bルートへ分岐" },
		{ value: { type: "branch", kind: "HOME" }, label: "HOMEへ戻る" },
		{ value: { type: "reaction", kind: "clap" }, label: "拍手（👏）" },
		{ value: { type: "reaction", kind: "laugh" }, label: "笑い（😆）" },
	];
}

export function WiiRemoteBinder(props: {
	imageSrc?: string;
	bindings: ButtonBindings | undefined;
	onChange: (next: ButtonBindings) => void;
}) {
	const { imageSrc, bindings, onChange } = props;

	const effective = useMemo<ButtonBindings>(() => mergeBindings(bindings), [bindings]);
	const [selected, setSelected] = useState<WiiButton | null>(null);

	const selectedAction = selected ? (effective[selected] ?? { type: "none" }) : null;

	return (
		<div style={{ display: "grid", gridTemplateColumns: "520px 1fr", gap: 16, alignItems: "start" }}>
			<div style={{ position: "relative", width: 520, maxWidth: "100%" }}>
				<div
					style={{
						width: "100%",
						aspectRatio: "520 / 960",
						borderRadius: 12,
						border: "1px solid #e5e7eb",
						background: "#f3f4f6",
						overflow: "hidden",
						position: "relative",
					}}
				>
					{imageSrc ? (
						<img
							src={imageSrc}
							alt="Wii Remote"
							style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
						/>
					) : (
						<div style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>
							実写画像未設定です。<br />
							WiiRemoteBinder の imageSrc を指定してください。
						</div>
					)}

					{/* ホットスポット */}
					{HOTSPOTS.map((h) => {
						const isSel = selected === h.button;
						return (
							<button
								key={h.button}
								type="button"
								onClick={() => setSelected(h.button)}
								title={`${h.button}: ${formatAction(effective[h.button] ?? { type: "none" })}`}
								style={{
									position: "absolute",
									left: `${h.x * 100}%`,
									top: `${h.y * 100}%`,
									width: `${h.w * 100}%`,
									height: `${h.h * 100}%`,
									transform: "translate(-50%, -50%)",
									border: isSel ? "2px solid #00e5ff" : "1px solid rgba(255,255,255,0.35)",
									background: isSel ? "rgba(0,229,255,0.18)" : "rgba(0,0,0,0.08)",
									borderRadius: 10,
									cursor: "pointer",
								}}
							/>
						);
					})}
				</div>
			</div>

			{/* 注釈/編集パネル */}
			<div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "white" }}>
				<div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>ボタン割り当て（スライド別）</div>

				{selected ? (
					<>
						<div style={{ marginBottom: 8, opacity: 0.8 }}>
							選択中: <code>{selected}</code>
						</div>

						<div style={{ marginBottom: 8 }}>
							現在: <b>{formatAction(selectedAction!)}</b>
						</div>

						<label style={{ display: "block", fontSize: 12, opacity: 0.75, marginBottom: 6 }}>
							このボタンに割り当てる機能を選択してください
						</label>

						<select
							value={encodeAction(selectedAction!)}
							onChange={(e) => {
								const nextAction = decodeAction(e.target.value);
								onChange({ ...effective, [selected]: nextAction });
							}}
							style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #d1d5db" }}
						>
							{actionOptions().map((opt) => (
								<option key={encodeAction(opt.value)} value={encodeAction(opt.value)}>
									{opt.label}
								</option>
							))}
						</select>

						<hr style={{ margin: "14px 0", borderColor: "#e5e7eb" }} />

						<div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>このスライドの割当（抜粋）</div>
						<ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, fontSize: 12 }}>
							{(Object.keys(effective) as Array<keyof WiiState["buttons"]>)
								.filter((k) => effective[k] && effective[k]?.type !== "none")
								.map((k) => (
									<li key={k}>
										<code>{k}</code>: {formatAction(effective[k] ?? { type: "none" })}
									</li>
								))}
						</ul>
					</>
				) : (
					<div style={{ opacity: 0.8, fontSize: 12, color: "#374151" }}>
						リモコン画像上のボタンをクリックすると、割り当てを編集できます。
					</div>
				)}
			</div>
		</div>
	);
}
