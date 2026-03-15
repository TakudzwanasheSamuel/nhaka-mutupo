"use client";

import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function Setup() {
  const router = useRouter();
  const { startNewGame, gameStatus, bestScore } = useGame();

  if (gameStatus !== 'idle' && gameStatus !== 'finished') return null;

  return null; // Logic handled in the new home page
}
