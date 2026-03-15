"use client";

import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Menu, RotateCcw, Settings, Trophy, Info } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const { gameStatus, startNewGame, gridSize, bestScore } = useGame();

  return (
    <header className="w-full border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-background font-headline text-xl font-bold shadow-[0_0_15px_rgba(255,215,0,0.3)]">
            N
          </div>
          <h1 className="text-xl sm:text-2xl font-headline text-white tracking-tight">
            Nhaka <span className="text-primary">Mutupo</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {gameStatus !== 'idle' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startNewGame(gridSize)}
              className="hidden sm:flex items-center gap-2 text-white/70 hover:text-primary hover:bg-white/5"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/5">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-l border-white/10 text-white">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-2xl font-headline text-primary text-left">Settings & Info</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-6">
                <div className="p-4 bg-background/40 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 mb-2 text-primary">
                    <Trophy className="w-5 h-5" />
                    <h3 className="font-headline text-lg">Your Legacy</h3>
                  </div>
                  <p className="text-sm text-white/60 mb-1">Best Score</p>
                  <p className="text-2xl font-headline">{bestScore > 0 ? `${bestScore} moves` : 'No record yet'}</p>
                </div>

                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start gap-3 text-white/80 hover:text-white hover:bg-white/5">
                    <Settings className="w-5 h-5" />
                    Game Options
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3 text-white/80 hover:text-white hover:bg-white/5">
                    <Info className="w-5 h-5" />
                    About the Totems
                  </Button>
                </div>

                {gameStatus !== 'idle' && (
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/50 text-primary hover:bg-primary/10"
                    onClick={() => {
                      startNewGame(gridSize);
                      // Close sheet is handled automatically usually or we can use state
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Current Game
                  </Button>
                )}
              </div>

              <div className="absolute bottom-8 left-6 right-6 text-center">
                <p className="text-xs text-white/30 font-body">
                  Version 1.0.0 &bull; Nhaka Mutupo
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}