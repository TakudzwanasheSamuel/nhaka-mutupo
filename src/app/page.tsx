"use client";

import { GameProvider } from '@/context/GameContext';
import { Setup } from '@/components/game/Setup';
import { GameBoard } from '@/components/game/GameBoard';
import { NhetemboModal } from '@/components/game/NhetemboModal';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useGame } from '@/context/GameContext';

function GameContent() {
  const { gameStatus, startNewGame, gridSize } = useGame();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-6 flex justify-between items-center border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-headline text-xl">N</div>
          <h2 className="text-2xl font-headline text-primary hidden sm:block">Nhaka Mutupo</h2>
        </div>
        
        {gameStatus !== 'idle' && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => startNewGame(gridSize)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Game</span>
          </Button>
        )}
      </header>

      <main className="container mx-auto">
        <Setup />
        <GameBoard />
      </main>

      <NhetemboModal />
      <Toaster />
      
      <footer className="fixed bottom-0 left-0 w-full p-4 text-center text-xs text-muted-foreground bg-background/80 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} Nhaka Mutupo &bull; Preserving Cultural Identity Through Play
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
