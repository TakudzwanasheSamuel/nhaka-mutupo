"use client";

import React, {
  createContext, useContext, useCallback, useRef, useState, useEffect,
} from 'react';

const MUTE_KEY = 'nhaka_audio_muted';
const LOOP_VOL = 0.3;
const SFX_VOL = 0.55;
const FADE_MS = 1400;

const SFX_SRCS = [
  '/sounds/option-select.wav',
  '/sounds/success-bell.wav',
  '/sounds/wrong-answer-fail-notification.wav',
] as const;

interface AudioManagerAPI {
  playClick: () => void;
  playMatch: () => void;
  playMismatch: () => void;
  startLandingLoop: () => void;
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
  const landingRef = useRef<HTMLAudioElement | null>(null);
  const gameRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeLoop = useRef<'landing' | 'game' | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(MUTE_KEY);
    if (saved === 'true') {
      setIsMuted(true);
      mutedRef.current = true;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (fadeTimer.current) clearInterval(fadeTimer.current);
    };
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

  const startLandingLoop = useCallback(() => {
    const el = landingRef.current;
    if (!el || mutedRef.current) return;
    if (!el.paused) return;
    el.currentTime = 0;
    el.volume = LOOP_VOL;
    activeLoop.current = 'landing';
    el.play().then(() => {
      console.log('[Audio] Landing loop playing');
    }).catch((err) => {
      console.warn('[Audio] Landing loop blocked:', err?.message);
      activeLoop.current = null;
    });
  }, []);

  const crossfade = useCallback((from: HTMLAudioElement, to: HTMLAudioElement) => {
    if (fadeTimer.current) {
      clearInterval(fadeTimer.current);
      fadeTimer.current = null;
    }

    to.currentTime = 0;
    to.volume = 0;
    to.play().catch(() => {});

    const steps = 28;
    const interval = FADE_MS / steps;
    let step = 0;

    fadeTimer.current = setInterval(() => {
      step++;
      const p = step / steps;
      from.volume = Math.max(0, (1 - p) * LOOP_VOL);
      to.volume = Math.min(LOOP_VOL, p * LOOP_VOL);

      if (step >= steps) {
        if (fadeTimer.current) clearInterval(fadeTimer.current);
        fadeTimer.current = null;
        from.pause();
        from.currentTime = 0;
      }
    }, interval);
  }, []);

  const startGameLoop = useCallback(() => {
    const game = gameRef.current;
    if (!game) return;

    const landing = landingRef.current;

    if (landing && !landing.paused) {
      activeLoop.current = 'game';
      crossfade(landing, game);
    } else {
      if (landing) {
        landing.pause();
        landing.currentTime = 0;
      }
      activeLoop.current = 'game';
      game.currentTime = 0;
      game.volume = LOOP_VOL;
      if (!mutedRef.current) game.play().catch(() => {});
    }
  }, [crossfade]);

  const stopGameLoop = useCallback(() => {
    if (gameRef.current) {
      gameRef.current.pause();
      gameRef.current.currentTime = 0;
    }
    activeLoop.current = null;
  }, []);

  const stopAll = useCallback(() => {
    if (fadeTimer.current) {
      clearInterval(fadeTimer.current);
      fadeTimer.current = null;
    }
    landingRef.current?.pause();
    gameRef.current?.pause();
    activeLoop.current = null;
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      mutedRef.current = next;
      localStorage.setItem(MUTE_KEY, String(next));

      if (next) {
        landingRef.current?.pause();
        gameRef.current?.pause();
      } else {
        const loop = activeLoop.current;
        if (loop === 'landing' && landingRef.current) {
          landingRef.current.volume = LOOP_VOL;
          landingRef.current.play().catch(() => {});
        } else if (loop === 'game' && gameRef.current) {
          gameRef.current.volume = LOOP_VOL;
          gameRef.current.play().catch(() => {});
        }
      }

      return next;
    });
  }, []);

  return (
    <AudioCtx.Provider value={{
      playClick, playMatch, playMismatch,
      startLandingLoop, startGameLoop, stopGameLoop, stopAll,
      toggleMute, isMuted,
    }}>
      {/* Real DOM audio elements — far more reliable than new Audio() */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={landingRef} src="/sounds/landing-sound.mp3" loop preload="auto" />
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
