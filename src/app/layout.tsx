import type { Metadata, Viewport } from 'next';
import { Andika, Fredoka } from 'next/font/google';
import './globals.css';

/* Fonts are downloaded at build time and served with the app, so they work offline. */
const display = Fredoka({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

/* Andika was designed for children learning to read: its "a" and "g" match handwriting. */
const read = Andika({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-read',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nhaka Mutupo | Totem Match',
  description: 'A Zimbabwean totem matching game for primary school children. Match the mitupo and learn their nhetembo.',
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
  themeColor: '#fff7ea',
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${read.variable}`}>
      <body>{children}</body>
    </html>
  );
}
