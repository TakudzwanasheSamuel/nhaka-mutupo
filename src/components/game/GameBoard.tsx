"use client";

import { useEffect, useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import { TotemCard } from './TotemCard';
import { getGridDimensions } from '@/lib/game-utils';
import { useAudio } from '@/hooks/use-audio';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Share2, RotateCcw, Home, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function GameBoard() {
  const { cards, flipCard, lastMatchedTotemId, gameStatus, score, matches, gridSize, streak, duration, startNewGame } = useGame();
  const { playLogDrum } = useAudio();

  // Score Calculation: (Matches / Moves) * Time Bonus
  const finalScoreData = useMemo(() => {
    if (gameStatus !== 'finished' || !duration) return null;
    
    const efficiency = matches / score;
    const timeBonus = Math.max(10, 600 - duration); // Base bonus decreases over time
    const totalPoints = Math.floor(efficiency * timeBonus * 10);
    
    let badge = { name: 'Participant', color: 'text-white/40', icon: Medal };
    if (totalPoints > 2000) badge = { name: 'Totem Master', color: 'text-primary', icon: Trophy };
    else if (totalPoints > 1500) badge = { name: 'Skilled Matcher', color: 'text-slate-300', icon: Medal };
    else if (totalPoints > 1000) badge = { name: 'Honorable Seeker', color: 'text-orange-400', icon: Medal };

    return { totalPoints, badge, efficiency: Math.round(efficiency * 100) };
  }, [gameStatus, duration, matches, score]);

  const handleShare = () => {
    if (!finalScoreData) return;
    const text = `I just completed the Nhaka Mutupo ritual! 🦁\n\nScore: ${finalScoreData.totalPoints} Points\nBadge: ${finalScoreData.badge.name}\nEfficiency: ${finalScoreData.efficiency}%\n\nHonor your lineage: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

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
      {gameStatus !== 'finished' && (
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
      )}

      {gameStatus !== 'finished' ? (
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
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto mt-8"
        >
          <div className="bg-card/60 backdrop-blur-xl rounded-[3rem] p-10 sm:p-16 border-2 border-primary/30 relative overflow-hidden text-center shadow-[0_0_100px_rgba(255,215,0,0.1)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            
            {/* Badge Section */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 relative">
                <finalScoreData.badge.icon className={`w-12 h-12 ${finalScoreData.badge.color}`} />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 border border-primary/10 rounded-full border-dashed" 
                />
              </div>
              <h2 className="text-5xl font-headline text-white mb-2">{finalScoreData.badge.name}</h2>
              <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">Rank Achieved</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-12 py-8 border-y border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Total Moves</p>
                <p className="text-3xl font-headline text-white">{score}</p>
              </div>
              <div className="space-y-1 border-x border-white/5">
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Duration</p>
                <p className="text-3xl font-headline text-white">{duration}s</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Efficiency</p>
                <p className="text-3xl font-headline text-primary">{finalScoreData.efficiency}%</p>
              </div>
            </div>

            <div className="mb-12">
               <p className="text-6xl font-headline text-primary mb-2">{finalScoreData.totalPoints}</p>
               <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-bold">Sacred Points Earned</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleShare}
                className="bg-green-600 hover:bg-green-500 text-white h-14 rounded-2xl px-8 font-bold gap-3 text-lg"
              >
                <Share2 className="w-5 h-5" />
                Share Honor
              </Button>
              <Button 
                variant="outline"
                onClick={() => startNewGame(gridSize)}
                className="border-white/10 hover:bg-white/5 text-white h-14 rounded-2xl px-8 font-bold gap-3 text-lg"
              >
                <RotateCcw className="w-5 h-5" />
                Retry Ritual
              </Button>
              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/'}
                className="text-white/40 hover:text-white h-14 rounded-2xl px-8 font-bold gap-3 text-lg"
              >
                <Home className="w-5 h-5" />
                Return Home
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
