"use client";

import { useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { TotemCard } from './TotemCard';
import { getGridDimensions } from '@/lib/game-utils';
import { useAudio } from '@/hooks/use-audio';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export function GameBoard() {
  const { cards, flipCard, lastMatchedTotemId, gameStatus, score, matches, gridSize, streak } = useGame();
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
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors: ['#ffd700', '#1b3f7a', '#ffffff'] };

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
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4">
      {/* HUD */}
      <div className="flex justify-around items-center mb-10 bg-card/40 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        
        <div className="text-center px-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary/70 font-bold mb-2">Moves</p>
          <p className="text-4xl font-headline text-white">{score}</p>
        </div>
        
        <div className="h-12 w-[1px] bg-white/10" />
        
        <div className="text-center px-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary/70 font-bold mb-2">Streak</p>
          <p className="text-4xl font-headline text-primary animate-pulse">{streak}x</p>
        </div>

        <div className="h-12 w-[1px] bg-white/10 hidden sm:block" />

        <div className="text-center px-4 hidden sm:block">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary/70 font-bold mb-2">Ancestral Bonds</p>
          <div className="flex items-baseline gap-1">
             <p className="text-4xl font-headline text-white">{matches}</p>
             <p className="text-xs text-white/30">/ {gridSize / 2}</p>
          </div>
        </div>
      </div>

      <motion.div 
        layout
        className={`grid ${gridCols} gap-3 sm:gap-6`}
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 text-center p-12 bg-primary/5 rounded-[3.5rem] border-2 border-primary/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0px,_transparent_150px)] opacity-20" />
          <h2 className="text-6xl font-headline text-primary mb-4">Makorokoto!</h2>
          <p className="text-2xl text-white/90 mb-4 font-headline">The ancestors celebrate your focus.</p>
          <p className="text-white/40 mb-10 italic max-w-md mx-auto">
            You completed the ritual in {score} moves. Your lineage is honored through your remembrance.
          </p>
          <div className="flex justify-center gap-6">
            <button 
              onClick={() => window.location.href = '/'}
              className="px-10 py-4 bg-primary text-background font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
              Begin New Journey
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
