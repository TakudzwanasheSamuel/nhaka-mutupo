"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { generatePraisePoemOnMatch } from '@/ai/flows/generate-praise-poem-on-match';
import { TOTEMS } from '@/lib/totems';
import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            className="relative w-full max-w-lg bg-card rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(255,215,0,0.1)] border-2 border-primary/30"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 p-8 text-primary/5">
              <Sparkles className="w-32 h-32" />
            </div>

            <button 
              onClick={() => { setPoem(null); clearLastMatch(); }}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors text-white/40 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-10 pt-16">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
                  <div className="w-24 h-24 rounded-3xl bg-background/50 flex items-center justify-center p-5 border border-primary/20 relative z-10">
                    {totem && <img src={totem.svg} alt={totem.name} className="w-full h-full object-contain brightness-125" />}
                  </div>
                </div>
                
                <div className="space-y-1 mb-10">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Matched Totem</p>
                  <h3 className="text-3xl font-headline text-white">{totem?.name}</h3>
                </div>

                <div className="w-full py-8 border-y border-white/5 min-h-[220px] flex items-center justify-center italic text-xl leading-relaxed font-headline text-white/90">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs not-italic font-body text-white/40 uppercase tracking-widest">Whispering to the ancestors...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p className="whitespace-pre-line px-4">{poem}</p>
                      {totem?.snippet && (
                        <div className="pt-4 flex flex-col items-center gap-2">
                          <div className="w-8 h-[1px] bg-primary/30" />
                          <p className="text-[10px] text-white/30 not-italic uppercase tracking-widest">
                            Traditional Wisdom
                          </p>
                          <p className="text-xs text-white/50 not-italic font-body">
                            {totem.snippet}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Button 
                  onClick={() => { setPoem(null); clearLastMatch(); }}
                  className="w-full mt-10 bg-primary hover:bg-primary/90 text-background text-lg h-14 rounded-2xl shadow-lg shadow-primary/20 font-bold"
                >
                  Continue Journey
                </Button>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}