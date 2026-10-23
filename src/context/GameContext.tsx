"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CardState, Difficulty, LEVELS, PlayMode, buildDeck, starsFor } from '@/constants/totems';
import { useApp } from '@/context/AppContext';
import { useContent } from '@/context/ContentContext';
import { memoryEntries } from '@/lib/content';

/** How long two different cards stay face up before turning back. */
const MISS_DELAY_MS = 1100;

export type Feedback =
  | { kind: 'hint' }
  | { kind: 'miss'; tick: number }
  | { kind: 'match'; totemId: string; tick: number };

interface GameState {
  level: Difficulty;
  mode: PlayMode;
  cards: CardState[];
  open: number[];
  tries: number;
  pairsFound: number;
  status: 'idle' | 'playing' | 'won';
  startedAt: number;
  elapsedSec: number;
  stars: number;
  feedback: Feedback;
  /** A totem matched for the first time ever: shown in the "new totem" sheet. */
  newTotem: string | null;
}

interface GameContextValue extends GameState {
  totalPairs: number;
  start: (level: Difficulty, mode: PlayMode) => void;
  restart: () => void;
  flip: (index: number) => void;
  closeNewTotem: () => void;
  leave: () => void;
}

const INITIAL: GameState = {
  level: 'easy',
  mode: 'pictures',
  cards: [],
  open: [],
  tries: 0,
  pairsFound: 0,
  status: 'idle',
  startedAt: 0,
  elapsedSec: 0,
  stars: 0,
  feedback: { kind: 'hint' },
  newTotem: null,
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { discovered, discover, recordStars } = useApp();
  const { content, includePending } = useContent();
  const [state, setState] = useState<GameState>(INITIAL);
  const ref = useRef(state);
  const missTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const commit = useCallback((next: GameState) => {
    ref.current = next;
    setState(next);
  }, []);

  const clearMissTimer = () => {
    if (missTimer.current) clearTimeout(missTimer.current);
    missTimer.current = null;
  };

  useEffect(() => clearMissTimer, []);

  const start = useCallback(
    (level: Difficulty, mode: PlayMode) => {
      clearMissTimer();
      const playMode = LEVELS[level].allowsWords ? mode : 'pictures';
      commit({
        ...INITIAL,
        level,
        mode: playMode,
        cards: buildDeck(memoryEntries(content, includePending), level, playMode, discovered),
        status: 'playing',
        startedAt: Date.now(),
      });
    },
    [commit, discovered, content, includePending],
  );

  const restart = useCallback(() => start(ref.current.level, ref.current.mode), [start]);

  const leave = useCallback(() => {
    clearMissTimer();
    commit(INITIAL);
  }, [commit]);

  const closeNewTotem = useCallback(() => commit({ ...ref.current, newTotem: null }), [commit]);

  const flip = useCallback(
    (index: number) => {
      const s = ref.current;
      if (s.status !== 'playing' || s.newTotem || s.open.length >= 2) return;
      const card = s.cards[index];
      if (!card || card.isFlipped || card.isMatched) return;

      const cards = s.cards.map((c, i) => (i === index ? { ...c, isFlipped: true } : c));
      const open = [...s.open, index];

      if (open.length < 2) {
        commit({ ...s, cards, open });
        return;
      }

      const [a, b] = open;
      const tries = s.tries + 1;
      const tick = Date.now();

      if (cards[a].totemId === cards[b].totemId) {
        const totemId = cards[a].totemId;
        const matched = cards.map((c, i) => (i === a || i === b ? { ...c, isMatched: true } : c));
        const pairsFound = s.pairsFound + 1;
        const isNew = discover(totemId);
        const won = pairsFound === LEVELS[s.level].pairs;
        const stars = won ? starsFor(s.level, tries) : 0;
        if (won) recordStars(s.level, stars);
        commit({
          ...s,
          cards: matched,
          open: [],
          tries,
          pairsFound,
          feedback: { kind: 'match', totemId, tick },
          newTotem: isNew ? totemId : null,
          status: won ? 'won' : 'playing',
          elapsedSec: won ? Math.round((Date.now() - s.startedAt) / 1000) : 0,
          stars,
        });
        return;
      }

      commit({ ...s, cards, open, tries, feedback: { kind: 'miss', tick } });
      clearMissTimer();
      missTimer.current = setTimeout(() => {
        const cur = ref.current;
        commit({
          ...cur,
          open: [],
          cards: cur.cards.map((c, i) => (open.includes(i) && !c.isMatched ? { ...c, isFlipped: false } : c)),
        });
      }, MISS_DELAY_MS);
    },
    [commit, discover, recordStars],
  );

  const value = useMemo(
    () => ({ ...state, totalPairs: LEVELS[state.level].pairs, start, restart, flip, closeNewTotem, leave }),
    [state, start, restart, flip, closeNewTotem, leave],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
