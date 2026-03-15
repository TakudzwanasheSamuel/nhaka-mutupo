"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { CardState, getGameDeck } from '@/constants/totems';

type GridSize = 16 | 20 | 36;

interface GameState {
  gridSize: GridSize;
  cards: CardState[];
  flippedIndices: number[];
  matches: number;
  score: number; // Moves
  streak: number;
  bestScore: number;
  gameStatus: 'idle' | 'playing' | 'paused' | 'finished';
  lastMatchedTotemId: string | null;
  startTime: number | null;
  duration: number | null; // final time in seconds
}

interface GameContextType extends GameState {
  startNewGame: (size: GridSize) => void;
  flipCard: (index: number) => void;
  resetBestScore: () => void;
  clearLastMatch: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'nhaka_mutupo_v2';

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    gridSize: 16,
    cards: [],
    flippedIndices: [],
    matches: 0,
    score: 0,
    streak: 0,
    bestScore: 0,
    gameStatus: 'idle',
    lastMatchedTotemId: null,
    startTime: null,
    duration: null,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load persistence
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, bestScore: parsed.bestScore || 0 }));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  // Save persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ bestScore: state.bestScore }));
  }, [state.bestScore]);

  const startNewGame = useCallback((size: GridSize) => {
    const newCards = getGameDeck(size);
    setState(prev => ({
      ...prev,
      gridSize: size,
      cards: newCards,
      flippedIndices: [],
      matches: 0,
      score: 0,
      streak: 0,
      gameStatus: 'playing',
      lastMatchedTotemId: null,
      startTime: Date.now(),
      duration: null,
    }));
  }, []);

  const clearLastMatch = useCallback(() => {
    setState(prev => ({ ...prev, lastMatchedTotemId: null }));
  }, []);

  const flipCard = useCallback((index: number) => {
    setState(prev => {
      if (prev.gameStatus !== 'playing') return prev;
      if (prev.flippedIndices.length === 2) return prev;
      if (prev.cards[index].isFlipped || prev.cards[index].isMatched) return prev;

      const newFlippedIndices = [...prev.flippedIndices, index];
      const newCards = [...prev.cards];
      newCards[index] = { ...newCards[index], isFlipped: true };

      let newMatches = prev.matches;
      let newStreak = prev.streak;
      let newLastMatchedId = null;
      let updatedStatus = prev.gameStatus;
      let newScore = prev.score + 1;
      let finalDuration = prev.duration;

      if (newFlippedIndices.length === 2) {
        const [firstIdx, secondIdx] = newFlippedIndices;
        if (newCards[firstIdx].totemId === newCards[secondIdx].totemId) {
          // MATCH
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          newMatches += 1;
          newStreak += 1;
          newLastMatchedId = newCards[firstIdx].totemId;
          
          if (newMatches === prev.gridSize / 2) {
            updatedStatus = 'finished';
            finalDuration = Math.floor((Date.now() - (prev.startTime || Date.now())) / 1000);
          }

          const currentBest = prev.bestScore;
          const isNewBest = (currentBest === 0 || newScore < currentBest) && updatedStatus === 'finished';

          return {
            ...prev,
            cards: newCards,
            flippedIndices: [],
            matches: newMatches,
            score: newScore,
            streak: newStreak,
            lastMatchedTotemId: newLastMatchedId,
            gameStatus: updatedStatus,
            bestScore: isNewBest ? newScore : currentBest,
            duration: finalDuration,
          };
        } else {
          // MISMATCH
          return {
            ...prev,
            cards: newCards,
            flippedIndices: newFlippedIndices,
            score: newScore,
            streak: 0, // Reset streak on miss
          };
        }
      }

      return {
        ...prev,
        cards: newCards,
        flippedIndices: newFlippedIndices,
        score: newScore,
      };
    });
  }, []);

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
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.flippedIndices]);

  const resetBestScore = () => {
    setState(prev => ({ ...prev, bestScore: 0 }));
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <GameContext.Provider value={{ ...state, startNewGame, flipCard, resetBestScore, clearLastMatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
