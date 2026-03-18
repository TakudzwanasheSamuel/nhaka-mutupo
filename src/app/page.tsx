"use client";

import { useGame } from '@/context/GameContext';
import { Difficulty, DIFFICULTIES } from '@/constants/totems';
import { TotemCard } from '@/components/game/TotemCard';
import { useAudioManager } from '@/context/AudioContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

function fmtTime(sec: number): string {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

/* ═══════════════════════════════════════════════════════
   LANDING SCREEN — shown when gameStatus === 'idle'
   ═══════════════════════════════════════════════════════ */

const DIFFICULTY_CARDS: {
  id: Difficulty;
  name: string;
  grid: string;
  emoji: string;
  description: string;
}[] = [
  {
    id: 'easy',
    name: 'The Cub',
    grid: '4\u00d74 \u2022 8 pairs',
    emoji: '\uD83D\uDC3E',
    description: 'Start your adventure and meet the friendly animals of the savanna.',
  },
  {
    id: 'medium',
    name: 'The Explorer',
    grid: '4\u00d75 \u2022 10 pairs',
    emoji: '\uD83E\uDDED',
    description: 'Put your memory to the test in the deep savanna.',
  },
  {
    id: 'hard',
    name: 'The Totem Master',
    grid: '6\u00d76 \u2022 18 pairs',
    emoji: '\uD83C\uDFC6',
    description: 'The ultimate memory challenge for true culture explorers.',
  },
];

function LandingScreen() {
  const { difficulty, setDifficulty, startNewGame, bestScore } = useGame();
  const { startLandingLoop, startGameLoop, playClick } = useAudioManager();
  const landingStarted = useRef(false);

  const ensureLandingAudio = () => {
    if (!landingStarted.current) {
      landingStarted.current = true;
      startLandingLoop();
    }
  };

  const handleDifficultySelect = (id: Difficulty) => {
    ensureLandingAudio();
    playClick();
    setDifficulty(id);
  };

  const handleStart = () => {
    startGameLoop();
    startNewGame();
  };

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-4 py-6 overflow-y-auto"
      onClick={ensureLandingAudio}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center max-w-3xl w-full"
      >
        {/* Badge pill */}
        <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.25em]"
          style={{
            background: 'rgba(255,215,0,0.10)',
            border: '1px solid rgba(255,215,0,0.25)',
            color: 'rgb(255,215,0)',
          }}
        >
          <span className="text-sm">&#x2728;</span>
          The Totem Challenge
        </div>

        {/* Headline + Logo side-by-side */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 mb-4">
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-headline text-white leading-[1.05] text-center sm:text-right">
            Discover Your{' '}
            <br />
            <span className="italic" style={{ color: 'rgb(255,215,0)' }}>Heritage</span>
          </h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 16 }}
            className="relative shrink-0"
          >
            <div
              className="absolute inset-0 scale-[1.7] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.22), transparent 60%)' }}
            />
            <motion.div
              animate={{ boxShadow: ['0 0 20px rgba(255,215,0,0.3), 0 0 60px rgba(255,215,0,0.12)', '0 0 30px rgba(255,215,0,0.5), 0 0 80px rgba(255,215,0,0.2)', '0 0 20px rgba(255,215,0,0.3), 0 0 60px rgba(255,215,0,0.12)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 w-28 h-28 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden"
              style={{ border: '4px solid rgba(255,215,0,0.6)' }}
            >
              <img
                src="/picture.png"
                alt="Nhaka Mutupo"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white/50 mb-8 max-w-lg mx-auto leading-relaxed">
          Explore the beauty of Zimbabwean culture. Match the totems to
          learn their stories and celebrate our heritage.
        </p>

        {/* Best score */}
        {bestScore > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 inline-flex flex-col items-center gap-0.5 px-5 py-3 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: 'rgba(255,215,0,0.6)' }}>
              Personal Best
            </span>
            <span className="text-2xl font-headline text-white">{bestScore} pts</span>
          </motion.div>
        )}
      </motion.div>

      {/* ── Difficulty cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mb-8">
        {DIFFICULTY_CARDS.map((card, i) => {
          const selected = difficulty === card.id;
          return (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              onClick={() => handleDifficultySelect(card.id)}
              className="relative text-left rounded-2xl p-5 transition-all duration-300 group overflow-hidden"
              style={{
                background: selected
                  ? 'rgba(255,215,0,0.12)'
                  : 'rgba(255,255,255,0.06)',
                border: selected
                  ? '2px solid rgba(255,215,0,0.5)'
                  : '2px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Hover / select glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,215,0,0.08), transparent 70%)' }}
              />

              <div className="relative z-10">
                <div className="text-2xl mb-2">{card.emoji}</div>
                <h3 className="text-xl font-headline text-white mb-0.5">{card.name}</h3>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgb(255,215,0)' }}>
                  {card.grid}
                </p>
                <p className="text-xs text-white/45 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Selected check */}
              {selected && (
                <div
                  className="absolute top-3 right-3 w-5 h-5 rounded-full grid place-items-center text-[10px] font-black"
                  style={{ background: 'rgb(255,215,0)', color: '#111' }}
                >
                  &#x2713;
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ── BIG START BUTTON ── */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={handleStart}
        className="group relative w-full max-w-md py-5 rounded-2xl text-xl sm:text-2xl font-black tracking-wide transition-all duration-200 active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,215,0,0.95), rgba(255,180,0,0.90))',
          color: '#111',
          boxShadow: '0 8px 32px rgba(255,215,0,0.30), 0 2px 8px rgba(0,0,0,0.20)',
          border: '2px solid rgba(255,215,0,0.6)',
        }}
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          <span className="text-2xl sm:text-3xl">&#x1F981;</span>
          Start the Adventure
        </span>

        {/* Hover shimmer */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.25), transparent 60%)' }}
        />
      </motion.button>

      {/* Subtle hint */}
      <p className="mt-4 text-[10px] text-white/25 uppercase tracking-widest">
        Select difficulty above, then start
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GAME LAYOUT — shown when playing / finished
   ═══════════════════════════════════════════════════════ */

function MobileStats() {
  const { elapsedSec, score, moves, matches, difficulty, computeAccuracy, computeBadge, gameStatus } = useGame();
  const d = DIFFICULTIES[difficulty];
  const acc = computeAccuracy();
  const badge = gameStatus !== 'idle' ? computeBadge() : null;

  return (
    <div className="shrink-0 flex items-stretch gap-1 px-3 py-1.5">
      <div className="mobile-stat">
        <span className="label">Time</span>
        <span className="value">{fmtTime(elapsedSec)}</span>
      </div>
      <div className="w-px bg-white/10" />
      <div className="mobile-stat">
        <span className="label">Score</span>
        <span className="value">{Math.max(0, Math.round(score))}</span>
      </div>
      <div className="w-px bg-white/10" />
      <div className="mobile-stat">
        <span className="label">Moves</span>
        <span className="value">{moves}</span>
      </div>
      <div className="w-px bg-white/10" />
      <div className="mobile-stat">
        <span className="label">Matches</span>
        <span className="value">{matches}/{d.pairs}</span>
      </div>
      <div className="w-px bg-white/10" />
      <div className="mobile-stat">
        <span className="label">Acc</span>
        <span className="value text-amber-400">{gameStatus !== 'idle' ? `${acc}%` : '\u2014'}</span>
      </div>
      {badge && (
        <>
          <div className="w-px bg-white/10" />
          <div className="mobile-stat">
            <span className="label">Badge</span>
            <span className="value text-sm">{badge.icon}</span>
          </div>
        </>
      )}
    </div>
  );
}

function DesktopStats() {
  const {
    gameStatus, elapsedSec, score, moves, matches, difficulty,
    computeAccuracy, computeBadge, statusMessage,
  } = useGame();
  const d = DIFFICULTIES[difficulty];
  const acc = computeAccuracy();
  const badge = gameStatus !== 'idle' ? computeBadge() : { name: '\u2014', icon: '\uD83C\uDFC5' };
  const speed = elapsedSec === 0
    ? '\u2014'
    : `${Math.round((d.pairs / elapsedSec) * 60)} p/m`;

  return (
    <aside className="flex flex-col gap-2 overflow-y-auto min-h-0">
      <div className="glass-panel">
        <div className="grid grid-cols-2 gap-1.5">
          <div className="stat-box">
            <div className="text-[10px] text-white/60 uppercase tracking-wide">Time</div>
            <div className="text-base font-black leading-tight">{fmtTime(elapsedSec)}</div>
          </div>
          <div className="stat-box">
            <div className="text-[10px] text-white/60 uppercase tracking-wide">Score</div>
            <div className="text-base font-black leading-tight">{Math.max(0, Math.round(score))}</div>
          </div>
          <div className="stat-box">
            <div className="text-[10px] text-white/60 uppercase tracking-wide">Moves</div>
            <div className="text-base font-black leading-tight">{moves}</div>
          </div>
          <div className="stat-box">
            <div className="text-[10px] text-white/60 uppercase tracking-wide">Matches</div>
            <div className="text-base font-black leading-tight">{matches}<span className="text-xs text-white/40">/{d.pairs}</span></div>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5">
        <div className="badge-box">
          <div className="badge-icon">{'\u23F1\uFE0F'}</div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-white truncate">Speed</div>
            <div className="text-[10px] text-white/70 truncate">{speed}</div>
          </div>
        </div>
        <div className="badge-box">
          <div className="badge-icon">{'\uD83C\uDFAF'}</div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-white truncate">Accuracy</div>
            <div className="text-[10px] text-white/70 truncate">{gameStatus !== 'idle' ? `${acc}%` : '\u2014'}</div>
          </div>
        </div>
      </div>

      <div className="badge-box">
        <div className="badge-icon">{badge.icon}</div>
        <div className="min-w-0">
          <div className="text-[10px] font-bold text-white">Badge</div>
          <div className="text-[10px] text-white/70 truncate">{badge.name}</div>
        </div>
      </div>

      <div className="glass-panel text-[11px] text-white/70 leading-snug">
        <b className="text-white/90">How it works:</b> Flip cards to reveal totems.
        Match pairs to score. Streaks earn bonus points!
      </div>

      <div className="flex-1 min-h-0" />

      <div
        className="game-toast"
        dangerouslySetInnerHTML={{ __html: statusMessage }}
      />
    </aside>
  );
}

function CompletionModal() {
  const {
    gameStatus, score, elapsedSec, moves, difficulty, computeAccuracy, computeBadge, startNewGame,
  } = useGame();
  const { startGameLoop } = useAudioManager();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (gameStatus === 'finished') setVisible(true);
  }, [gameStatus]);

  if (!visible || gameStatus !== 'finished') return null;

  const acc = computeAccuracy();
  const badge = computeBadge();
  const diffLabel = difficulty === 'easy' ? 'Easy (4\u00d74)' : difficulty === 'medium' ? 'Medium (4\u00d75)' : 'Hard (6\u00d76)';

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-box">
        <h2 className="text-2xl font-bold mb-2">{'\uD83C\uDF89'} Congratulations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="modal-stat-box">
            <div className="opacity-80 text-xs">Final Score</div>
            <div className="text-[28px] font-black">{Math.max(0, Math.round(score))}</div>
            <div className="opacity-90 text-[13px] mt-1">{badge.icon} {badge.name}</div>
          </div>
          <div className="modal-stat-box">
            <div className="grid gap-1 text-sm">
              <div><b>Time:</b> {fmtTime(elapsedSec)}</div>
              <div><b>Moves:</b> {moves}</div>
              <div><b>Accuracy:</b> {acc}%</div>
              <div><b>Difficulty:</b> {diffLabel}</div>
            </div>
            <div className="mt-2 text-[11px] opacity-75">
              SCORM-ready: score + completion can be sent to LMS.
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-end mt-3">
          <button onClick={() => setVisible(false)} className="game-btn">Close</button>
          <button onClick={() => { setVisible(false); startGameLoop(); startNewGame(); }} className="game-btn game-btn-primary">
            Play again
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT PAGE — switches between landing & game
   ═══════════════════════════════════════════════════════ */

export default function Home() {
  const {
    gameStatus, cards, flipCard, lastMatchedTotemId,
    difficulty, sessionId, statusMessage, mismatches,
  } = useGame();
  const { playMatch, playMismatch, startGameLoop, stopGameLoop } = useAudioManager();
  const isMobile = useIsMobile();
  const d = DIFFICULTIES[difficulty];
  const prevMismatches = useRef(0);

  useEffect(() => {
    if (lastMatchedTotemId) playMatch();
  }, [lastMatchedTotemId, playMatch]);

  useEffect(() => {
    if (mismatches > prevMismatches.current) {
      playMismatch();
    }
    prevMismatches.current = mismatches;
  }, [mismatches, playMismatch]);

  useEffect(() => {
    if (gameStatus === 'finished') {
      stopGameLoop();

      const duration = 4000;
      const end = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100, colors: ['#ffd700', '#1b3f7a', '#fff'] };
      const r = (a: number, b: number) => Math.random() * (b - a) + a;
      const iv = setInterval(() => {
        const left = end - Date.now();
        if (left <= 0) return clearInterval(iv);
        const n = 50 * (left / duration);
        confetti({ ...defaults, particleCount: n, origin: { x: r(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount: n, origin: { x: r(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
      return () => clearInterval(iv);
    }
  }, [gameStatus, stopGameLoop]);

  /* ── IDLE → show landing ── */
  if (gameStatus === 'idle') {
    return <LandingScreen />;
  }

  /* ── PLAYING / FINISHED → show game ── */
  const boardActive = cards.length > 0;
  const compact = isMobile && difficulty === 'hard';
  const colCount = d.cols;
  const gridMaxW = isMobile
    ? '100%'
    : colCount >= 6 ? '560px' : colCount === 5 ? '530px' : '420px';

  return (
    <>
      {/* ── MOBILE ── */}
      <div className="flex flex-col flex-1 min-h-0 md:hidden">
        <MobileStats />

        <div className="flex-1 min-h-0 flex flex-col px-2 pb-2 overflow-hidden">
          <div className="glass-panel flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex justify-between items-center gap-2 mb-1.5 shrink-0">
              <div className="text-xs font-bold">Game Board</div>
              <div className="text-[10px] text-white/50 truncate">{sessionId}</div>
            </div>

            {boardActive ? (
              <div className="flex-1 min-h-0 flex items-center justify-center overflow-auto">
                <div
                  className="grid gap-1.5 justify-center"
                  style={{
                    gridTemplateColumns: `repeat(${colCount}, 1fr)`,
                    maxWidth: gridMaxW,
                    width: '100%',
                  }}
                >
                  {cards.map((card, idx) => (
                    <TotemCard key={card.id} card={card} index={idx} onClick={flipCard} compact={compact} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="game-toast text-center">Press <b>Start</b> to begin.</div>
              </div>
            )}

            <div
              className="game-toast mt-1.5 shrink-0"
              dangerouslySetInnerHTML={{ __html: statusMessage }}
            />
          </div>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:grid flex-1 min-h-0 max-w-[1200px] w-full mx-auto px-3 py-2 gap-3"
        style={{ gridTemplateColumns: '280px 1fr' }}
      >
        <DesktopStats />

        <section className="glass-panel flex flex-col min-h-0 overflow-hidden">
          <div className="flex justify-between items-center gap-2 mb-2 shrink-0">
            <div>
              <div className="text-sm font-black">Game Board</div>
              <div className="text-[10px] text-white/60">Match totems to earn points and unlock badges.</div>
            </div>
            <div className="text-[10px] text-white/50">{sessionId && `Session: ${sessionId}`}</div>
          </div>

          {boardActive ? (
            <div className="flex-1 min-h-0 flex items-center justify-center overflow-auto">
              <div
                className="grid gap-2 justify-center"
                style={{
                  gridTemplateColumns: `repeat(${colCount}, 1fr)`,
                  maxWidth: gridMaxW,
                  width: '100%',
                }}
              >
                {cards.map((card, idx) => (
                  <TotemCard key={card.id} card={card} index={idx} onClick={flipCard} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="game-toast text-center px-8 py-6">
                Press <b>Start</b> to begin.
              </div>
            </div>
          )}
        </section>
      </div>

      <CompletionModal />
    </>
  );
}
