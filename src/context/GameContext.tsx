"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { CardState, Difficulty, DIFFICULTIES, getGameDeck } from '@/constants/totems';

interface GameState {
  difficulty: Difficulty;
  cards: CardState[];
  flippedIndices: number[];
  moves: number;
  matches: number;
  mismatches: number;
  streak: number;
  score: number;
  gameStatus: 'idle' | 'playing' | 'finished';
  elapsedSec: number;
  sessionId: string;
  lastMatchedTotemId: string | null;
  bestScore: number;
  statusMessage: string;
}

interface BadgeResult {
  name: string;
  icon: string;
}

interface GameContextType extends GameState {
  startNewGame: () => void;
  flipCard: (index: number) => void;
  setDifficulty: (d: Difficulty) => void;
  clearLastMatch: () => void;
  computeAccuracy: () => number;
  computeBadge: () => BadgeResult;
  gridSize: number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'nhaka_mutupo_v3';

function generateSessionId(): string {
  const raw = `${Date.now()}-${Math.random()}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) {
    h = ((h << 5) - h) + raw.charCodeAt(i);
    h |= 0;
  }
  return 'NM-' + ((h >>> 0).toString(16).padStart(8, '0')).toUpperCase().slice(0, 8);
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    difficulty: 'medium',
    cards: [],
    flippedIndices: [],
    moves: 0,
    matches: 0,
    mismatches: 0,
    streak: 0,
    score: 0,
    gameStatus: 'idle',
    elapsedSec: 0,
    sessionId: '',
    lastMatchedTotemId: null,
    bestScore: 0,
    statusMessage: 'Press <b>Start</b> to begin.',
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, bestScore: parsed.bestScore || 0 }));
      } catch { /* noop */ }
    }
    setState(prev => ({ ...prev, sessionId: generateSessionId() }));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ bestScore: state.bestScore }));
  }, [state.bestScore]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setState(prev => {
        if (prev.gameStatus !== 'playing') return prev;
        return {
          ...prev,
          elapsedSec: elapsed,
          score: prev.score - 0.25,
        };
      });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const computeAccuracy = useCallback((): number => {
    if (state.moves === 0) return 0;
    return Math.round((state.matches / state.moves) * 100);
  }, [state.matches, state.moves]);

  const computeBadge = useCallback((): BadgeResult => {
    const d = DIFFICULTIES[state.difficulty];
    const acc = state.moves === 0 ? 0 : Math.round((state.matches / state.moves) * 100);
    const t = state.elapsedSec;
    const moves = state.moves;
    const basePairs = d.pairs;

    const goldTime = basePairs * 6;
    const silverTime = basePairs * 9;
    const bronzeTime = basePairs * 12;

    const goldMoves = Math.ceil(basePairs * 1.15);
    const silverMoves = Math.ceil(basePairs * 1.45);
    const bronzeMoves = Math.ceil(basePairs * 1.80);

    if (acc >= 90 && t <= goldTime && moves <= goldMoves)
      return { name: 'Gold \u2013 Totem Master', icon: '\uD83E\uDD47' };
    if (acc >= 80 && t <= silverTime && moves <= silverMoves)
      return { name: 'Silver \u2013 Skilled Matcher', icon: '\uD83E\uDD48' };
    if (acc >= 65 && t <= bronzeTime && moves <= bronzeMoves)
      return { name: 'Bronze \u2013 Strong Effort', icon: '\uD83E\uDD49' };
    return { name: 'Participant \u2013 Keep Practising', icon: '\uD83C\uDF96\uFE0F' };
  }, [state.difficulty, state.matches, state.moves, state.elapsedSec]);

  const setDifficulty = useCallback((d: Difficulty) => {
    setState(prev => ({
      ...prev,
      difficulty: d,
      statusMessage: 'Difficulty changed. Press <b>Start / Restart</b> to apply.',
    }));
  }, []);

  const startNewGame = useCallback(() => {
    const newCards = getGameDeck(state.difficulty);
    const sid = generateSessionId();
    setState(prev => ({
      ...prev,
      cards: newCards,
      flippedIndices: [],
      moves: 0,
      matches: 0,
      mismatches: 0,
      streak: 0,
      score: 500,
      gameStatus: 'playing',
      elapsedSec: 0,
      sessionId: sid,
      lastMatchedTotemId: null,
      statusMessage: 'Find matching totem pairs. Good luck!',
    }));
    startTimer();
  }, [state.difficulty, startTimer]);

  const clearLastMatch = useCallback(() => {
    setState(prev => ({ ...prev, lastMatchedTotemId: null }));
  }, []);

  const finishGame = useCallback((prev: GameState): GameState => {
    stopTimer();
    const acc = prev.moves === 0 ? 0 : Math.round((prev.matches / prev.moves) * 100);
    let finalScore = prev.score;
    finalScore += Math.max(0, (acc - 50) * 2);
    finalScore += Math.max(0, 120 - prev.elapsedSec);
    const roundedScore = Math.max(0, Math.round(finalScore));
    const newBest = roundedScore > prev.bestScore ? roundedScore : prev.bestScore;

    return {
      ...prev,
      score: roundedScore,
      gameStatus: 'finished',
      bestScore: newBest,
      statusMessage: 'Game complete!',
    };
  }, [stopTimer]);

  const flipCard = useCallback((index: number) => {
    setState(prev => {
      if (prev.gameStatus !== 'playing') return prev;
      if (prev.flippedIndices.length === 2) return prev;
      if (prev.cards[index].isFlipped || prev.cards[index].isMatched) return prev;

      const newFlipped = [...prev.flippedIndices, index];
      const newCards = [...prev.cards];
      newCards[index] = { ...newCards[index], isFlipped: true };

      if (newFlipped.length === 2) {
        const [i1, i2] = newFlipped;
        const isMatch = newCards[i1].totemId === newCards[i2].totemId;
        const newMoves = prev.moves + 1;

        if (isMatch) {
          newCards[i1] = { ...newCards[i1], isMatched: true };
          newCards[i2] = { ...newCards[i2], isMatched: true };
          const newMatches = prev.matches + 1;
          const newStreak = prev.streak + 1;
          const scoreGain = 40 + (newStreak * 6);
          const totalPairs = DIFFICULTIES[prev.difficulty].pairs;

          let next: GameState = {
            ...prev,
            cards: newCards,
            flippedIndices: [],
            moves: newMoves,
            matches: newMatches,
            streak: newStreak,
            score: prev.score + scoreGain,
            lastMatchedTotemId: newCards[i1].totemId,
            statusMessage: `\u2705 Match! Streak: <b>${newStreak}</b>`,
          };

          if (newMatches === totalPairs) {
            next = finishGame(next);
          }
          return next;
        } else {
          return {
            ...prev,
            cards: newCards,
            flippedIndices: newFlipped,
            moves: newMoves,
            mismatches: prev.mismatches + 1,
            streak: 0,
            score: prev.score - 18,
            statusMessage: '\u274C Not a match. Try again.',
          };
        }
      }

      return {
        ...prev,
        cards: newCards,
        flippedIndices: newFlipped,
      };
    });
  }, [finishGame]);

  useEffect(() => {
    if (state.flippedIndices.length === 2) {
      const timer = setTimeout(() => {
        setState(prev => {
          const newCards = [...prev.cards];
          prev.flippedIndices.forEach(idx => {
            if (!newCards[idx].isMatched) {
              newCards[idx] = { ...newCards[idx], isFlipped: false };
            }
          });
          return { ...prev, cards: newCards, flippedIndices: [] };
        });
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [state.flippedIndices]);

  const gridSize = DIFFICULTIES[state.difficulty].pairs * 2;

  return (
    <GameContext.Provider value={{
      ...state,
      gridSize,
      startNewGame,
      flipCard,
      setDifficulty,
      clearLastMatch,
      computeAccuracy,
      computeBadge,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
