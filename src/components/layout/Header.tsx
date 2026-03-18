"use client";

import { useGame } from '@/context/GameContext';
import { useAudioManager } from '@/context/AudioContext';
import { Difficulty } from '@/constants/totems';
import { useCallback } from 'react';

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'easy',   label: 'Easy 4\u00d74' },
  { value: 'medium', label: 'Medium 4\u00d75' },
  { value: 'hard',   label: 'Hard 6\u00d76' },
];

export function Header() {
  const { difficulty, setDifficulty, startNewGame, gameStatus } = useGame();
  const { toggleMute, isMuted } = useAudioManager();

  const handleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch { /* noop */ }
  }, []);

  const isIdle = gameStatus === 'idle';

  return (
    <header className="shrink-0 w-full max-w-[1200px] mx-auto px-3 py-2 flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <img
          src="/picture.png"
          alt="Nhaka Mutupo logo"
          className="w-9 h-9 rounded-xl object-cover"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
        />
        <div className="leading-tight">
          <h1 className="text-base font-bold m-0 text-white">Nhaka Mutupo</h1>
          <p className="text-[10px] text-white/60 hidden sm:block">
            Totem Match &bull; Heritage Card Game
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Mute toggle — always visible */}
        <button
          onClick={toggleMute}
          className="game-btn w-9 h-9 flex items-center justify-center text-base"
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '\uD83D\uDD07' : '\uD83D\uDD0A'}
        </button>

        {/* Game controls — hidden on landing screen */}
        {!isIdle && (
          <>
            <label className="game-select flex items-center gap-1.5">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="bg-transparent border-none outline-none text-white text-[13px]"
              >
                {DIFFICULTY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-[#0b1b3a] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            <button onClick={startNewGame} className="game-btn game-btn-primary">
              Restart
            </button>

            <button onClick={handleFullscreen} className="game-btn hidden sm:inline-flex">
              &#x26F6;
            </button>
          </>
        )}
      </div>
    </header>
  );
}
