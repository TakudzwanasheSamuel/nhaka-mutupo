/**
 * Memory game levels and deck building. The totems themselves live in the
 * content data (src/content and Firestore), not here.
 */

import type { TotemEntry } from '@/lib/content';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type PlayMode = 'pictures' | 'words';

export interface Level {
  id: Difficulty;
  pairs: number;
  /** Grid on a portrait screen; flipped on landscape screens. */
  cols: number;
  rows: number;
  /** Picture shown on the level card. */
  icon: string;
  /** Picture + name mode needs cards wide enough for the word. */
  allowsWords: boolean;
}

export const LEVELS: Record<Difficulty, Level> = {
  easy: { id: 'easy', pairs: 8, cols: 4, rows: 4, icon: 'lion', allowsWords: true },
  medium: { id: 'medium', pairs: 10, cols: 4, rows: 5, icon: 'elephant', allowsWords: true },
  hard: { id: 'hard', pairs: 18, cols: 6, rows: 6, icon: 'bateleur', allowsWords: false },
};

export const LEVEL_ORDER: Difficulty[] = ['easy', 'medium', 'hard'];

export interface CardState {
  id: string;
  /** The totem entry this card belongs to. */
  totemId: string;
  face: 'picture' | 'word';
  isFlipped: boolean;
  isMatched: boolean;
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Builds a shuffled deck from the playable entries. Totems the child has not
 * found yet are picked first, so every game teaches something new.
 */
export function buildDeck(entries: TotemEntry[], level: Difficulty, mode: PlayMode, discovered: string[]): CardState[] {
  const { pairs, allowsWords } = LEVELS[level];
  const words = mode === 'words' && allowsWords;
  const fresh = shuffle(entries.filter(t => !discovered.includes(t.id)));
  const known = shuffle(entries.filter(t => discovered.includes(t.id)));
  const chosen = [...fresh, ...known].slice(0, pairs);

  const cards: CardState[] = chosen.flatMap(t => [
    { id: `${t.id}-a`, totemId: t.id, face: 'picture' as const, isFlipped: false, isMatched: false },
    { id: `${t.id}-b`, totemId: t.id, face: words ? ('word' as const) : ('picture' as const), isFlipped: false, isMatched: false },
  ]);
  return shuffle(cards);
}

/** One to three stars, based on how many tries the child needed. */
export function starsFor(level: Difficulty, tries: number): 1 | 2 | 3 {
  const { pairs } = LEVELS[level];
  if (tries <= Math.round(pairs * 1.75)) return 3;
  if (tries <= Math.round(pairs * 2.5)) return 2;
  return 1;
}
