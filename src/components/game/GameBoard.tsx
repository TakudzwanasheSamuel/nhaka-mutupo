
"use client";

import { useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { TotemCard } from './TotemCard';
import { getGridDimensions } from '@/lib/game-utils';
import { useAudio } from '@/hooks/use-audio';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export function GameBoard() {
  const { cards, flipCard, lastMatchedTotemId, gameStatus, score, matches, gridSize } = useGame();
  const { playLogDrum } = useAudio();

  useEffect(() => {
    if (lastMatchedTotemId) {
      playLogDrum();
    }
  }, [lastMatchedTotemId, playLogDrum]);

  useEffect(() => {
    if (gameStatus === 'finished') {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [gameStatus]);

  if (gameStatus === 'idle') return null;

  const gridCols = getGridDimensions(gridSize);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 bg-card p-4 rounded-xl shadow-sm border border-border">
        <div className="text-center px-4 border-r border-border">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Moves</p>
          <p className="text-2xl font-headline text-primary">{score}</p>
        </div>
        <div className="flex-1 text-center px-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Matches</p>
          <p className="text-2xl font-headline text-primary">{matches} / {gridSize / 2}</p>
        </div>
        <div className="text-center px-4 border-l border-border">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Status</p>
          <p className="text-lg font-headline text-secondary capitalize">{gameStatus}</p>
        </div>
      </div>

      <motion.div 
        layout
        className={`grid ${gridCols} gap-2 sm:gap-4`}
      >
        {cards.map((card, index) => (
          <TotemCard 
            key={card.id} 
            card={card} 
            index={index} 
            onClick={flipCard} 
          />
        ))}
      </motion.div>
      
      {gameStatus === 'finished' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center p-8 bg-secondary/10 rounded-2xl border-2 border-secondary"
        >
          <h2 className="text-4xl font-headline text-primary mb-2">Makorokoto!</h2>
          <p className="text-xl opacity-80 mb-6">You've completed the ritual in {score} moves.</p>
        </motion.div>
      )}
    </div>
  );
}
