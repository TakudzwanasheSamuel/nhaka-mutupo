"use client";

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { GameBoard } from '@/components/game/GameBoard';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GamePageProps {
  params: Promise<{ difficulty: string }>;
}

export default function GamePage({ params }: GamePageProps) {
  const { difficulty } = use(params);
  const router = useRouter();
  const { gameStatus, startNewGame } = useGame();

  useEffect(() => {
    let size: 16 | 20 | 36 = 16;
    if (difficulty === 'medium') size = 20;
    if (difficulty === 'hard') size = 36;

    if (gameStatus === 'idle') {
      startNewGame(size);
    }
  }, [difficulty, gameStatus, startNewGame]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')}
          className="text-white/50 hover:text-white hover:bg-white/5 gap-2 pl-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Selection
        </Button>

        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Session Active</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GameBoard />
      </motion.div>
    </div>
  );
}
