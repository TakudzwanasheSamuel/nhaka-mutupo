import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GameProvider } from '@/context/GameContext';
import { AudioProvider } from '@/context/AudioContext';
import { Header } from '@/components/layout/Header';
import { MatchModal } from '@/components/game/MatchModal';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Nhaka Mutupo | Totem Match',
  description: 'A traditional African totem matching game — digitize and preserve Zimbabwean cultural heritage through gamified learning.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: '/icon-192.png',
  },
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
    <html lang="en" className="dark h-full">
      <head>
        <link rel="icon" href="/favicon-48.png" sizes="48x48" type="image/png" />
        <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased text-foreground selection:bg-primary/30 selection:text-primary h-screen flex flex-col overflow-hidden">
        <GameProvider>
          <AudioProvider>
            <Header />
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {children}
            </div>
            <MatchModal />
            <Toaster />
          </AudioProvider>
        </GameProvider>
      </body>
    </html>
  );
}
