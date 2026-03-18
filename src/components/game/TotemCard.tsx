"use client";

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CardState, TOTEMS } from '@/constants/totems';
import { useAudioManager } from '@/context/AudioContext';

interface TotemCardProps {
  card: CardState;
  index: number;
  onClick: (index: number) => void;
  compact?: boolean;
}

export function TotemCard({ card, index, onClick, compact }: TotemCardProps) {
  const totem = TOTEMS.find(t => t.id === card.totemId);
  const { playClick } = useAudioManager();
  const cardRef = useRef<HTMLDivElement>(null);
  const wasMatched = useRef(false);

  useEffect(() => {
    if (card.isMatched && !wasMatched.current) {
      wasMatched.current = true;
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
          particleCount: 28,
          spread: 55,
          origin: { x, y },
          colors: ['#ffd700', '#22c55e', '#ffffff', '#f59e0b'],
          startVelocity: 18,
          ticks: 35,
          gravity: 1.2,
          scalar: 0.8,
          disableForReducedMotion: true,
        });
      }
    }
  }, [card.isMatched]);

  const handleClick = () => {
    if (!card.isFlipped && !card.isMatched) {
      playClick();
      onClick(index);
    }
  };

  const flipped = card.isFlipped || card.isMatched;
  const interactive = !card.isFlipped && !card.isMatched;

  return (
    <motion.div
      ref={cardRef}
      whileHover={interactive ? { scale: 1.06, zIndex: 2 } : undefined}
      whileTap={interactive ? { scale: 0.94 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="w-full aspect-[11/13]"
      style={{ perspective: '600px' }}
    >
      <div
        className={`game-card w-full h-full ${flipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      >
        {/* Back — Zimbabwe chevron + basket-weave pattern */}
        <div className="card-face card-back">
          <span className="card-back-initials">NM</span>
        </div>

        {/* Front — totem image + name */}
        <div className="card-face card-front">
          {totem && (
            <div className="flex flex-col items-center justify-center gap-0.5 w-full h-full p-0.5">
              <img
                src={totem.image}
                alt={`${totem.animal} (${totem.name})`}
                className={compact ? 'w-7 h-7 object-contain' : 'w-10 h-10 md:w-14 md:h-14 object-contain'}
              />
              <div className="text-center leading-none">
                <div className={compact ? 'font-black text-slate-900 text-[8px]' : 'font-black text-slate-900 text-[10px] md:text-xs'}>
                  {totem.name}
                </div>
                {!compact && (
                  <div className="font-bold text-slate-500 text-[8px] md:text-[10px]">
                    {totem.animal}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
