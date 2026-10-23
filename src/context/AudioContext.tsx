"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { readJSON, writeJSON } from '@/lib/storage';

const MUTE_KEY = 'nhaka_audio_muted';
const MUSIC_VOLUME = 0.22;

const SFX = {
  flip: { src: '/sounds/option-select.wav', volume: 0.45 },
  match: { src: '/sounds/success-bell.wav', volume: 0.55 },
  // The miss sound is kept quiet on purpose: a wrong guess is part of learning.
  miss: { src: '/sounds/wrong-answer-fail-notification.wav', volume: 0.25 },
} as const;

type SfxName = keyof typeof SFX;

interface AudioApi {
  play: (name: SfxName) => void;
  startMusic: () => void;
  stopMusic: () => void;
  toggleMute: () => void;
  isMuted: boolean;
}

const AudioCtx = createContext<AudioApi | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const muted = useRef(false);
  const music = useRef<HTMLAudioElement | null>(null);
  const musicWanted = useRef(false);
  const pool = useRef<Partial<Record<SfxName, HTMLAudioElement>>>({});

  useEffect(() => {
    const saved = readJSON<boolean>(MUTE_KEY, false);
    muted.current = saved;
    setIsMuted(saved);
  }, []);

  const play = useCallback((name: SfxName) => {
    if (muted.current) return;
    try {
      const base = pool.current[name] ?? (pool.current[name] = new Audio(SFX[name].src));
      const a = base.cloneNode(true) as HTMLAudioElement;
      a.volume = SFX[name].volume;
      a.play().catch(() => {});
    } catch {
      /* audio not available */
    }
  }, []);

  const startMusic = useCallback(() => {
    musicWanted.current = true;
    const m = music.current;
    if (!m || muted.current) return;
    m.volume = MUSIC_VOLUME;
    m.currentTime = 0;
    m.play().catch(() => {});
  }, []);

  const stopMusic = useCallback(() => {
    musicWanted.current = false;
    music.current?.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const next = !muted.current;
    muted.current = next;
    setIsMuted(next);
    writeJSON(MUTE_KEY, next);
    const m = music.current;
    if (!m) return;
    if (next) m.pause();
    else if (musicWanted.current) {
      m.volume = MUSIC_VOLUME;
      m.play().catch(() => {});
    }
  }, []);

  const value = useMemo(
    () => ({ play, startMusic, stopMusic, toggleMute, isMuted }),
    [play, startMusic, stopMusic, toggleMute, isMuted],
  );

  return (
    <AudioCtx.Provider value={value}>
      <audio ref={music} src="/sounds/game-sound-loop.mp3" loop preload="none" />
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
