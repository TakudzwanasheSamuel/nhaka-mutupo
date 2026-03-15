"use client";

import { motion } from 'framer-motion';
import { CardState } from '@/lib/game-utils';
import { TOTEMS } from '@/lib/totems';
import { useAudio } from '@/hooks/use-audio';
import { cn } from '@/lib/utils';

interface TotemCardProps {
  card: CardState;
  index: number;
  onClick: (index: number) => void;
}

export function TotemCard({ card, index, onClick }: TotemCardProps) {
  const totem = TOTEMS.find(t => t.id === card.totemId);
  const { playClick } = useAudio();

  const handleClick = () => {
    if (!card.isFlipped && !card.isMatched) {
      playClick();
      onClick(index);
    }
  };

  return (
    <div 
      className="relative aspect-[3/4] perspective-1000 cursor-pointer group"
      onClick={handleClick}
    >
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of Card (Totem) */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white border-2 border-primary rounded-lg flex flex-col items-center justify-center p-2 shadow-md",
            card.isMatched && "border-secondary border-4 bg-secondary/5"
          )}
        >
          {totem && (
            <div className="w-full h-full flex flex-col items-center justify-between">
              <div className="flex-1 w-full flex items-center justify-center text-primary">
                <img 
                  src={totem.svg} 
                  alt={totem.name} 
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              </div>
              <span className="text-[10px] sm:text-xs font-headline text-center leading-tight">
                {totem.name}
              </span>
            </div>
          )}
        </div>

        {/* Back of Card (Pattern) */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-primary rounded-lg flex items-center justify-center p-1 shadow-md border-2 border-white/20">
          <div className="w-full h-full rounded-md border border-white/10 flex items-center justify-center overflow-hidden">
             <div className="grid grid-cols-4 gap-1 opacity-20">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-4 h-4 rounded-full border border-white" />
                ))}
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
