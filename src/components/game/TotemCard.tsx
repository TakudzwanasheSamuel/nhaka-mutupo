"use client";

import { motion } from 'framer-motion';
import { CardState, TOTEMS } from '@/constants/totems';
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
        {/* Front of Card (Totem revealed) */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-card border-2 border-white/10 rounded-xl flex flex-col items-center justify-center p-3 shadow-2xl",
            card.isMatched && "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
          )}
        >
          {totem && (
            <div className="w-full h-full flex flex-col items-center justify-between">
              <div className="flex-1 w-full flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 opacity-50" />
                  <img 
                    src={totem.image} 
                    alt={totem.name} 
                    className="w-14 h-14 sm:w-20 sm:h-20 object-contain text-primary relative z-10 brightness-110"
                  />
                </div>
              </div>
              <span className="text-[10px] sm:text-xs font-headline text-center text-white/90 leading-tight px-1">
                {totem.name} ({totem.animal})
              </span>
            </div>
          )}
        </div>

        {/* Back of Card (Pattern) */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-card rounded-xl flex items-center justify-center p-2 shadow-lg border-2 border-white/10 overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--primary)_1px,_transparent_1px)] bg-[length:20px_20px]" />
          
          <div className="w-full h-full rounded-lg border border-white/5 flex items-center justify-center relative z-10">
            <div className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center">
               <div className="w-6 h-6 bg-primary/10 rounded-sm rotate-45 border border-primary/20" />
            </div>
          </div>
          
          {/* Subtle hover effect */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
        </div>
      </motion.div>
    </div>
  );
}
