import { Totem, TOTEMS } from './totems';

export interface CardState {
  id: string;
  totemId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function shuffleCards(gridSize: number): CardState[] {
  const totalPairs = gridSize / 2;
  const selectedTotems = TOTEMS.slice(0, totalPairs);
  
  let cards: CardState[] = [];
  
  selectedTotems.forEach((totem) => {
    // Add two of each totem
    cards.push({ id: `${totem.id}-1`, totemId: totem.id, isFlipped: false, isMatched: false });
    cards.push({ id: `${totem.id}-2`, totemId: totem.id, isFlipped: false, isMatched: false });
  });

  // Fisher-Yates Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

export function getGridDimensions(size: number) {
  switch (size) {
    case 16: return 'grid-cols-4';
    case 20: return 'grid-cols-4 sm:grid-cols-5';
    case 36: return 'grid-cols-6';
    default: return 'grid-cols-4';
  }
}
