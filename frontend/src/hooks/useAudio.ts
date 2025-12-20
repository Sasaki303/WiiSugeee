"use client";

import { useCallback, useRef, useEffect, useState } from "react";

const SOUND_URLS = {
	q: "https://www.myinstants.com/media/sounds/nice-shot-wii-sports_DJJ0VOz.mp3",
	w: "https://www.myinstants.com/media/sounds/crowdaw.mp3",
	e: "https://www.myinstants.com/media/sounds/crowdoh.mp3",
} as const;

type SoundKey = keyof typeof SOUND_URLS;

export function useAudio(playWiiSound: (soundType: "shot" | "oh" | "uxo") => void) {
	const soundboardRef = useRef<Record<SoundKey, HTMLAudioElement | undefined>>({
		q: undefined,
		w: undefined,
		e: undefined,
	});
	const audioUnlockedRef = useRef(false);
	const pendingSoundRef = useRef<SoundKey | null>(null);

	const tryUnlockAudio = useCallback(async () => {
		if (audioUnlockedRef.current) return;

		const audios = Object.values(soundboardRef.current).filter(Boolean) as HTMLAudioElement[];
		if (audios.length === 0) return;

		try {
			const a = audios[0];
			const prevMuted = a.muted;
			const prevVolume = a.volume;
			a.muted = true;
			a.volume = 0;
			await a.play();
			a.pause();
			a.currentTime = 0;
			a.muted = prevMuted;
			a.volume = prevVolume;
			audioUnlockedRef.current = true;

			const pending = pendingSoundRef.current;
			pendingSoundRef.current = null;
			if (pending && soundboardRef.current[pending]) {
				soundboardRef.current[pending]!.currentTime = 0;
				void soundboardRef.current[pending]!.play().catch(() => {});
			}
		} catch {
			// Ignore unlock failure
		}
	}, []);

	const playSoundOnPC = useCallback(
		async (key: SoundKey) => {
			const a = soundboardRef.current[key];
			if (!a) return;

			if (!audioUnlockedRef.current) {
				pendingSoundRef.current = key;
				await tryUnlockAudio();
				if (!audioUnlockedRef.current) return;
			}

			a.currentTime = 0;
			void a.play().catch(() => {
				pendingSoundRef.current = key;
			});
		},
		[tryUnlockAudio]
	);

	const playSoundOnWii = useCallback(
		(key: SoundKey) => {
			const mapping: Record<SoundKey, "shot" | "oh" | "uxo"> = { q: "shot", e: "oh", w: "uxo" };
			playWiiSound(mapping[key]);
		},
		[playWiiSound]
	);

	const playSound = useCallback(
		(key: SoundKey, outputDevice: "pc" | "wii" = "pc") => {
			if (outputDevice === "wii") {
				playSoundOnWii(key);
			} else {
				playSoundOnPC(key);
			}
		},
		[playSoundOnPC, playSoundOnWii]
	);

	useEffect(() => {
		const q = new Audio(SOUND_URLS.q);
		const w = new Audio(SOUND_URLS.w);
		const e = new Audio(SOUND_URLS.e);
		q.preload = "auto";
		w.preload = "auto";
		e.preload = "auto";
		soundboardRef.current = { q, w, e };

		const unlockOnInteraction = () => {
			if (audioUnlockedRef.current) return;
			void tryUnlockAudio();
		};

		window.addEventListener("click", unlockOnInteraction);
		window.addEventListener("touchstart", unlockOnInteraction);
		window.addEventListener("keydown", unlockOnInteraction);

		return () => {
			window.removeEventListener("click", unlockOnInteraction);
			window.removeEventListener("touchstart", unlockOnInteraction);
			window.removeEventListener("keydown", unlockOnInteraction);
			for (const a of [q, w, e]) {
				try {
					a.pause();
				} catch {
					// Ignore
				}
			}
			soundboardRef.current = { q: undefined, w: undefined, e: undefined };
		};
	}, [tryUnlockAudio]);

	return { playSound };
}
