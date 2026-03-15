"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CardState, getGameDeck } from '@/constants/totems';

type GridSize = 16 | 20 | 36;

interface GameState {
  gridSize: GridSize;
  cards: CardState[];
  flippedIndices: number[];
  matches: number;
  score: number;
  bestScore: number;
  gameStatus: 'idle' | 'playing' | 'paused' | 'finished';
  lastMatchedTotemId: string | null;
}

interface GameContextType extends GameState {
  startNewGame: (size: GridSize) => void;
  flipCard: (index: number) => void;
  resetBestScore: () => void;
  clearLastMatch: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'nhaka_mutupo_state';

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    gridSize: 16,
    cards: [],
    flippedIndices: [],
    matches: 0,
    score: 0,
    bestScore: 0,
    gameStatus: 'idle',
    lastMatchedTotemId: null,
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const { bestScore } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ bestScore }));
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
      gameStatus: 'playing',
      lastMatchedTotemId: null,
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
      let newLastMatchedId = null;
      let updatedStatus = prev.gameStatus;
      let newScore = prev.score + 1;

      // Handle pair matching
      if (newFlippedIndices.length === 2) {
        const [firstIdx, secondIdx] = newFlippedIndices;
        if (newCards[firstIdx].totemId === newCards[secondIdx].totemId) {
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          newMatches += 1;
          newLastMatchedId = newCards[firstIdx].totemId;
          
          if (newMatches === prev.gridSize / 2) {
            updatedStatus = 'finished';
          }

          return {
            ...prev,
            cards: newCards,
            flippedIndices: [],
            matches: newMatches,
            score: newScore,
            lastMatchedTotemId: newLastMatchedId,
            gameStatus: updatedStatus,
            bestScore: (prev.bestScore === 0 || newScore < prev.bestScore) && updatedStatus === 'finished' ? newScore : prev.bestScore
          };
        } else {
          // No match, will reset after timeout in component
          return {
            ...prev,
            cards: newCards,
            flippedIndices: newFlippedIndices,
            score: newScore,
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

  // Effect to handle mismatched cards reset
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
