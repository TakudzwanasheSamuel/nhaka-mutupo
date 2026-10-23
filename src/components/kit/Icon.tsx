const PATHS = {
  home: 'M3.5 11 12 3.5l8.5 7.5M6 9.5V20h4.5v-5.5h3V20H18V9.5',
  menu: 'M4.5 7h15M4.5 12h15M4.5 17h15',
  soundOn: 'M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.8 9a4.5 4.5 0 0 1 0 6M18.6 6.4a8.3 8.3 0 0 1 0 11.2',
  soundOff: 'M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9.5l5 5M21 9.5l-5 5',
  book: 'M3 5h5.5A3.5 3.5 0 0 1 12 8.5V20a2.6 2.6 0 0 0-2.6-2.6H3zM21 5h-5.5A3.5 3.5 0 0 0 12 8.5V20a2.6 2.6 0 0 1 2.6-2.6H21z',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.6 2.6 3.7 5.6 3.7 9s-1.1 6.4-3.7 9M12 3c-2.6 2.6-3.7 5.6-3.7 9s1.1 6.4 3.7 9',
  close: 'M6.5 6.5l11 11M17.5 6.5l-11 11',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  back: 'M14.5 5.5 8 12l6.5 6.5',
  next: 'M9.5 5.5 16 12l-6.5 6.5',
  restart: 'M4 12a8 8 0 1 0 2.4-5.7M4 4.5v4.5h4.5',
  levels: 'M4 20V14h4v6M10 20V9h4v11M16 20V4h4v16',
  picture: 'M4 5.5h16v13H4zM4 15.5l4.5-4.5 4 4 2.5-2.5 5 5M15.5 9.5h.01',
  search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5 20 20',
  question: 'M9 9.2a3 3 0 1 1 4.2 2.8c-.8.4-1.2 1-1.2 1.8v.7M12 18h.01M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4z',
  cards: 'M3.5 6.5h9v13h-9zM11.5 4.5h9v13h-1.5',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v6M12 7.5h.01',
} as const;

const FILLED = {
  play: 'M8 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8A1 1 0 0 0 8 5.2z',
  star: 'M12 2.6l2.85 5.95 6.5.82-4.8 4.5 1.24 6.45L12 17.2l-5.79 3.12 1.24-6.45-4.8-4.5 6.5-.82z',
} as const;

export type IconName = keyof typeof PATHS | keyof typeof FILLED;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

/** One icon set for the whole game: rounded strokes to match Fredoka. */
export function Icon({ name, size = 24, className }: IconProps) {
  const filled = name in FILLED;
  const d = filled ? FILLED[name as keyof typeof FILLED] : PATHS[name as keyof typeof PATHS];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}
