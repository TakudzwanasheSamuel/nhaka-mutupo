"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { GameBoard } from '@/components/game/GameBoard';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { gameStatus, startNewGame, gridSize } = useGame();

  useEffect(() => {
    const size = searchParams.get('size');
    if (size && (gameStatus === 'idle' || gridSize !== parseInt(size))) {
      startNewGame(parseInt(size) as any);
    } else if (!size && gameStatus === 'idle') {
      router.replace('/');
    }
  }, [searchParams, gameStatus, gridSize, startNewGame, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')}
          className="text-white/50 hover:text-white hover:bg-white/5 gap-2 pl-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Selection
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GameBoard />
      </motion.div>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GameContent />
    </Suspense>
  );
}
