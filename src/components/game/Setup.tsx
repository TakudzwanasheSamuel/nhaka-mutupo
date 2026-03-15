"use client";

import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function Setup() {
  const { startNewGame, gameStatus, bestScore } = useGame();

  if (gameStatus !== 'idle' && gameStatus !== 'finished') return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <h1 className="text-5xl font-headline text-primary mb-4">Nhaka Mutupo</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Reconnect with your ancestors through the sacred totems. Match the pairs to hear their praise.
        </p>

        {bestScore > 0 && (
          <div className="mb-8 p-4 bg-secondary/10 rounded-xl border border-secondary/20">
            <p className="text-xs uppercase tracking-tighter font-bold text-secondary">Ancestral Legacy</p>
            <p className="text-xl font-headline">Best Score: {bestScore} moves</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Choose Your Path</p>
          <div className="grid grid-cols-1 gap-4">
            <Button 
              onClick={() => startNewGame(16)} 
              className="h-16 text-xl bg-primary hover:bg-primary/90 text-white font-headline"
            >
              The Path of the Cub (4x4)
            </Button>
            <Button 
              onClick={() => startNewGame(20)} 
              variant="outline"
              className="h-16 text-xl border-primary text-primary hover:bg-primary/5 font-headline"
            >
              The Hunter's Trial (4x5)
            </Button>
            <Button 
              onClick={() => startNewGame(36)} 
              variant="outline"
              className="h-16 text-xl border-secondary text-secondary hover:bg-secondary/5 font-headline"
            >
              The Elder's Wisdom (6x6)
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
