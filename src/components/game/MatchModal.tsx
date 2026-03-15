
"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { generatePraisePoemOnMatch } from '@/ai/flows/generate-praise-poem-on-match';
import { TOTEMS } from '@/constants/totems';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function MatchModal() {
  const { lastMatchedTotemId, clearLastMatch } = useGame();
  const [aiPoem, setAiPoem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lastMatchedTotemId) {
      const totem = TOTEMS.find(t => t.id === lastMatchedTotemId);
      if (totem) {
        setIsLoading(true);
        generatePraisePoemOnMatch({ animalTotemName: totem.name })
          .then(res => setAiPoem(res.nhetemboPoem))
          .catch(err => {
            console.error("AI poem failed", err);
          })
          .finally(() => setIsLoading(false));
      }
    } else {
      setAiPoem(null);
    }
  }, [lastMatchedTotemId]);

  if (!lastMatchedTotemId) return null;

  const totem = TOTEMS.find(t => t.id === lastMatchedTotemId);
  if (!totem) return null;

  return (
    <AnimatePresence>
      {lastMatchedTotemId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            className="relative w-full max-w-xl bg-card rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(255,215,0,0.15)] border-2 border-primary/40"
          >
            {/* Ambient Glow Decor */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />

            <div className="p-10 sm:p-14">
              <div className="flex flex-col items-center text-center">
                {/* Large Glowing Frame */}
                <div className="relative mb-10">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-125" 
                  />
                  <div className="w-40 h-40 rounded-[2.5rem] bg-background/60 flex items-center justify-center p-8 border-2 border-primary/50 relative z-10 shadow-[0_0_40px_rgba(255,215,0,0.2)]">
                    <img src={totem.image} alt={totem.name} className="w-full h-full object-contain brightness-125" />
                  </div>
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 border border-primary/10 rounded-full border-dashed"
                  />
                </div>
                
                <div className="space-y-2 mb-10">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold"
                  >
                    Ancestral Connection
                  </motion.p>
                  <h3 className="text-4xl sm:text-5xl font-headline text-white tracking-tight">
                    {totem.name} <span className="text-primary/60 italic text-2xl sm:text-3xl ml-2">&bull; {totem.animal}</span>
                  </h3>
                </div>

                <div className="w-full py-10 border-y border-white/5 min-h-[250px] flex flex-col items-center justify-center">
                  <div className="font-headline text-xl sm:text-2xl leading-relaxed text-white/90 italic max-w-md">
                    {isLoading ? (
                      <div className="flex flex-col items-center gap-6">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-[10px] not-italic font-body text-white/40 uppercase tracking-[0.3em]">Summoning the Praise Singer...</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <motion.p 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="whitespace-pre-line text-primary"
                        >
                          {aiPoem || "Whispers of the ancestors echo through the savanna..."}
                        </motion.p>
                        
                        <div className="pt-6 flex flex-col items-center gap-4">
                          <div className="w-12 h-[1px] bg-primary/40" />
                          <div className="space-y-2">
                             <p className="text-[10px] text-white/30 not-italic uppercase tracking-[0.4em] font-bold">Traditional Verse</p>
                             <p className="text-sm sm:text-base text-white/60 not-italic font-body tracking-wide">
                               "{totem.nhetembo}"
                             </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={clearLastMatch}
                  className="w-full mt-12 bg-primary hover:bg-primary/90 text-background text-xl h-16 rounded-[1.5rem] shadow-2xl shadow-primary/20 font-bold group"
                >
                  <Sparkles className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                  Continue Ritual
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
