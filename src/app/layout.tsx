
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GameProvider } from '@/context/GameContext';
import { Header } from '@/components/layout/Header';
import { MatchModal } from '@/components/game/MatchModal';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Nhaka Mutupo | Totem Memory Game',
  description: 'A traditional African totem matching game with generative praise poems.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nhaka Mutupo',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b1b3a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground selection:bg-primary/30 selection:text-primary min-h-screen flex flex-col">
        <GameProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <footer className="py-6 text-center text-[10px] uppercase tracking-widest text-white/20 border-t border-white/5">
            &copy; {new Date().getFullYear()} Nhaka Mutupo &bull; Ancestral Wisdom
          </footer>
          <MatchModal />
          <Toaster />
        </GameProvider>
      </body>
    </html>
  );
}
