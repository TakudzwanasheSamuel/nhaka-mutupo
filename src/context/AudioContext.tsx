"use client";

import React, {
  createContext, useContext, useCallback, useRef, useState, useEffect,
} from 'react';

const MUTE_KEY = 'nhaka_audio_muted';
const LOOP_VOL = 0.3;
const SFX_VOL = 0.55;

const SFX_SRCS = [
  '/sounds/option-select.wav',
  '/sounds/success-bell.wav',
  '/sounds/wrong-answer-fail-notification.wav',
] as const;

interface AudioManagerAPI {
  playClick: () => void;
  playMatch: () => void;
  playMismatch: () => void;
  startGameLoop: () => void;
  stopGameLoop: () => void;
  stopAll: () => void;
  toggleMute: () => void;
  isMuted: boolean;
}

const AudioCtx = createContext<AudioManagerAPI | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);

  const mutedRef = useRef(false);
  const gameRef = useRef<HTMLAudioElement | null>(null);
  const activeLoop = useRef<'game' | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(MUTE_KEY);
    if (saved === 'true') {
      setIsMuted(true);
      mutedRef.current = true;
    }
  }, []);

  const playSfx = useCallback((src: string) => {
    if (mutedRef.current) return;
    try {
      const a = new Audio(src);
      a.volume = SFX_VOL;
      a.play().catch(() => {});
    } catch { /* noop */ }
  }, []);

  const playClick = useCallback(() => playSfx(SFX_SRCS[0]), [playSfx]);
  const playMatch = useCallback(() => playSfx(SFX_SRCS[1]), [playSfx]);
  const playMismatch = useCallback(() => playSfx(SFX_SRCS[2]), [playSfx]);

  const startGameLoop = useCallback(() => {
    const game = gameRef.current;
    if (!game) return;
    activeLoop.current = 'game';
    game.currentTime = 0;
    game.volume = LOOP_VOL;
    if (!mutedRef.current) game.play().catch(() => {});
  }, []);

  const stopGameLoop = useCallback(() => {
    if (gameRef.current) {
      gameRef.current.pause();
      gameRef.current.currentTime = 0;
    }
    activeLoop.current = null;
  }, []);

  const stopAll = useCallback(() => {
    gameRef.current?.pause();
    activeLoop.current = null;
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      mutedRef.current = next;
      localStorage.setItem(MUTE_KEY, String(next));

      if (next) {
        gameRef.current?.pause();
      } else if (activeLoop.current === 'game' && gameRef.current) {
        gameRef.current.volume = LOOP_VOL;
        gameRef.current.play().catch(() => {});
      }

      return next;
    });
  }, []);

  return (
    <AudioCtx.Provider value={{
      playClick, playMatch, playMismatch,
      startGameLoop, stopGameLoop, stopAll,
      toggleMute, isMuted,
    }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={gameRef} src="/sounds/game-sound-loop.mp3" loop preload="auto" />
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudioManager() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudioManager must be used within AudioProvider');
  return ctx;
}
