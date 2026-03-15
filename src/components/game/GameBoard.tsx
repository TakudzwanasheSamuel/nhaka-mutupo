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
      const duration = 4 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors: ['#ffd700', '#1b3f7a', '#ffffff'] };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 40 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [gameStatus]);

  if (gameStatus === 'idle') return null;

  const gridCols = getGridDimensions(gridSize);

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-8">
      {/* HUD */}
      <div className="flex justify-around items-center mb-10 bg-card/40 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="text-center px-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-bold mb-1">Rhythm</p>
          <p className="text-3xl font-headline text-white">{score}</p>
        </div>
        
        <div className="h-10 w-[1px] bg-white/10" />
        
        <div className="text-center px-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-bold mb-1">Spirit Bond</p>
          <div className="flex flex-col items-center">
             <p className="text-3xl font-headline text-white">{matches}</p>
             <p className="text-[10px] text-white/40">of {gridSize / 2}</p>
          </div>
        </div>

        <div className="h-10 w-[1px] bg-white/10" />

        <div className="text-center px-6 hidden sm:block">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-bold mb-1">Trial</p>
          <p className="text-lg font-headline text-white/80 capitalize">
            {gridSize === 16 ? 'Cub' : gridSize === 20 ? 'Hunter' : 'Elder'}
          </p>
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
          className="mt-16 text-center p-12 bg-primary/5 rounded-[3rem] border-2 border-primary/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0px,_transparent_120px)] opacity-10" />
          <h2 className="text-5xl font-headline text-primary mb-4">Makorokoto!</h2>
          <p className="text-2xl text-white/80 mb-2 font-headline">The spirits are pleased.</p>
          <p className="text-white/40 mb-8 italic">You completed the ritual in {score} moves.</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-primary text-background font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Play Again
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}