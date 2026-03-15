"use client";

import { GameProvider } from '@/context/GameContext';
import { Header } from '@/components/layout/Header';
import { Setup } from '@/components/game/Setup';
import { GameBoard } from '@/components/game/GameBoard';
import { NhetemboModal } from '@/components/game/NhetemboModal';
import { Toaster } from '@/components/ui/toaster';

function GameContent() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Setup />
        <GameBoard />
      </main>

      <footer className="py-6 text-center text-xs text-white/20 border-t border-white/5 mt-auto">
        &copy; {new Date().getFullYear()} Nhaka Mutupo &bull; Reconnecting to Ancestral Spirits
      </footer>

      <NhetemboModal />
      <Toaster />
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