"use client";

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Bird, Shield, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/GameContext';

const DIFFICULTIES = [
  {
    id: 'easy',
    name: 'The Cub',
    size: 16,
    grid: '4x4 Path',
    icon: Bird,
    description: 'Begin your journey with the messenger spirits.',
    color: 'from-blue-500/20 to-primary/10'
  },
  {
    id: 'medium',
    name: 'The Hunter',
    size: 20,
    grid: '4x5 Path',
    icon: Shield,
    description: 'Test your focus in the deep savanna.',
    color: 'from-primary/20 to-orange-500/10'
  },
  {
    id: 'hard',
    name: 'The Elder',
    size: 36,
    grid: '6x6 Path',
    icon: Zap,
    description: 'Commune with the ancestors in the ultimate trial.',
    color: 'from-purple-500/20 to-primary/10'
  }
];

export default function Home() {
  const router = useRouter();
  const { startNewGame, bestScore } = useGame();

  const handleSelectDifficulty = (size: number) => {
    startNewGame(size as any);
    router.push(`/game?size=${size}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center max-w-3xl mb-16"
      >
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-bold uppercase tracking-[0.3em]">
          <Sparkles className="w-3 h-3" />
          The Ritual of Totems
        </div>
        
        <h2 className="text-6xl sm:text-8xl font-headline text-white mb-8 leading-tight">
          Find Your <br/><span className="text-primary italic">Ancestral Path</span>
        </h2>
        
        <p className="text-xl text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
          The savanna whispers ancient secrets. Match the sacred totems to unlock the wisdom of the Nhetembo and honor your lineage.
        </p>

        {bestScore > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-card/40 backdrop-blur-md rounded-2xl border border-white/10 inline-flex flex-col items-center gap-1"
          >
            <span className="text-[10px] uppercase tracking-widest font-bold text-primary/70">Highest Honor</span>
            <span className="text-2xl font-headline text-white">{bestScore} Moves</span>
          </motion.div>
        )}
      </motion.section>

      {/* Difficulty Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {DIFFICULTIES.map((difficulty, index) => (
          <motion.div
            key={difficulty.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <button
              onClick={() => handleSelectDifficulty(difficulty.size)}
              className={`group relative w-full p-8 bg-card rounded-[2.5rem] border-2 border-white/5 hover:border-primary/40 transition-all duration-500 text-left overflow-hidden flex flex-col h-full`}
            >
              {/* Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${difficulty.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-background/50 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  <difficulty.icon className="w-7 h-7 text-primary" />
                </div>
                
                <h3 className="text-3xl font-headline text-white mb-2">{difficulty.name}</h3>
                <p className="text-primary font-bold text-xs uppercase tracking-widest mb-4">{difficulty.grid}</p>
                <p className="text-white/50 text-sm leading-relaxed mb-8">
                  {difficulty.description}
                </p>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/30 uppercase group-hover:text-primary/70 transition-colors">Start Ritual</span>
                  <div className="w-8 h-[1px] bg-white/10 group-hover:w-12 group-hover:bg-primary/50 transition-all" />
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
