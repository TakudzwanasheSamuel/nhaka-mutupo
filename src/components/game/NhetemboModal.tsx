
"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { generatePraisePoemOnMatch } from '@/ai/flows/generate-praise-poem-on-match';
import { TOTEMS } from '@/lib/totems';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function NhetemboModal() {
  const { lastMatchedTotemId, clearLastMatch } = useGame();
  const [poem, setPoem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lastMatchedTotemId) {
      const totem = TOTEMS.find(t => t.id === lastMatchedTotemId);
      if (totem) {
        setIsLoading(true);
        generatePraisePoemOnMatch({ animalTotemName: totem.name })
          .then(res => setPoem(res.nhetemboPoem))
          .catch(err => {
            console.error("Poem failed", err);
            setPoem(totem.snippet); // Fallback to cultural snippet if AI fails
          })
          .finally(() => setIsLoading(false));
      }
    }
  }, [lastMatchedTotemId]);

  if (!lastMatchedTotemId && !poem) return null;

  const totem = TOTEMS.find(t => t.id === lastMatchedTotemId);

  return (
    <AnimatePresence>
      {(lastMatchedTotemId || poem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-background rounded-2xl overflow-hidden shadow-2xl border-4 border-secondary"
          >
            <button 
              onClick={() => { setPoem(null); clearLastMatch(); }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center p-4 border-2 border-secondary/20">
                  {totem && <img src={totem.svg} alt={totem.name} className="w-full h-full object-contain text-primary" />}
                </div>
                
                <h2 className="text-3xl font-headline text-primary">Matched!</h2>
                <h3 className="text-xl font-headline text-secondary-foreground">{totem?.name}</h3>

                <div className="w-full py-4 border-y border-border min-h-[160px] flex items-center justify-center italic text-lg leading-relaxed font-headline">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm not-italic font-body opacity-60">Summoning the spirits...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="whitespace-pre-line">{poem}</p>
                      {totem?.snippet && (
                        <p className="text-xs text-muted-foreground not-italic border-t pt-2">
                          Traditional: {totem.snippet}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <Button 
                  onClick={() => { setPoem(null); clearLastMatch(); }}
                  className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg h-12"
                >
                  Continue Journey
                </Button>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary animate-pulse" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
