"use client";

import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function Setup() {
  const { startNewGame, gameStatus, bestScore } = useGame();

  if (gameStatus !== 'idle' && gameStatus !== 'finished') return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full"
      >
        <div className="mb-6 inline-block p-1 px-3 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-widest">
          A Cultural Memory Experience
        </div>
        
        <h2 className="text-5xl sm:text-7xl font-headline text-white mb-6 leading-tight">
          Find Your <br/><span className="text-primary italic">Ancestral Path</span>
        </h2>
        
        <p className="text-lg text-white/60 mb-10 max-w-md mx-auto leading-relaxed">
          Reconnect with the spirit of the savanna. Match the sacred totems to unlock the wisdom of the Nhetembo.
        </p>

        {bestScore > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-10 p-4 bg-card/50 rounded-2xl border border-white/10 inline-flex flex-col items-center gap-1"
          >
            <span className="text-[10px] uppercase tracking-tighter font-bold text-primary">Ancestral Honor</span>
            <span className="text-xl font-headline text-white">Best: {bestScore} moves</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button 
            onClick={() => startNewGame(16)} 
            className="h-20 text-lg bg-primary hover:bg-primary/90 text-background font-headline rounded-2xl shadow-lg shadow-primary/10 transition-all hover:scale-[1.02]"
          >
            <div className="flex flex-col">
              <span>Cub</span>
              <span className="text-xs opacity-60 font-body">4x4 Path</span>
            </div>
          </Button>
          <Button 
            onClick={() => startNewGame(20)} 
            variant="outline"
            className="h-20 text-lg border-white/20 bg-card/30 hover:bg-card text-white font-headline rounded-2xl transition-all hover:scale-[1.02]"
          >
            <div className="flex flex-col">
              <span>Hunter</span>
              <span className="text-xs opacity-60 font-body">4x5 Path</span>
            </div>
          </Button>
          <Button 
            onClick={() => startNewGame(36)} 
            variant="outline"
            className="h-20 text-lg border-white/20 bg-card/30 hover:bg-card text-white font-headline rounded-2xl transition-all hover:scale-[1.02]"
          >
            <div className="flex flex-col">
              <span>Elder</span>
              <span className="text-xs opacity-60 font-body">6x6 Path</span>
            </div>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}