"use client";

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { generatePraisePoemOnMatch } from '@/ai/flows/generate-praise-poem-on-match';
import { TOTEMS } from '@/constants/totems';

function TypewriterText({ text, speed = 28 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && <span className="typewriter-cursor" />}
    </span>
  );
}

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
          .catch(() => setAiPoem(null))
          .finally(() => setIsLoading(false));
      }
    } else {
      setAiPoem(null);
    }
  }, [lastMatchedTotemId]);

  const handleClose = useCallback(() => {
    clearLastMatch();
    setAiPoem(null);
  }, [clearLastMatch]);

  if (!lastMatchedTotemId) return null;

  const totem = TOTEMS.find(t => t.id === lastMatchedTotemId);
  if (!totem) return null;

  const poemText = aiPoem || totem.nhetembo;

  return (
    <AnimatePresence>
      {lastMatchedTotemId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(6,12,28,0.70)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden"
            style={{
              background: 'rgba(12,22,52,0.80)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '24px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 0 80px rgba(255,215,0,0.08)',
            }}
          >
            {/* Ambient glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.12), transparent 70%)' }} />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.08), transparent 70%)' }} />

            <div className="relative z-10 p-8 sm:p-10 flex flex-col items-center text-center">
              {/* Large totem SVG */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="relative mb-6"
              >
                <div className="absolute inset-0 scale-150 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.2), transparent 60%)' }} />
                <div
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-[1.5rem] flex items-center justify-center p-5 relative z-10"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,215,0,0.3)',
                    boxShadow: '0 0 30px rgba(255,215,0,0.12)',
                  }}
                >
                  <img src={totem.image} alt={totem.name} className="w-full h-full object-contain" />
                </div>
              </motion.div>

              {/* Label */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[9px] uppercase tracking-[0.4em] font-bold mb-2"
                style={{ color: 'rgba(255,215,0,0.65)' }}
              >
                Cultural Discovery
              </motion.p>

              {/* Totem name — bold serif */}
              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="font-headline text-3xl sm:text-4xl text-white tracking-tight mb-1"
              >
                {totem.name}
              </motion.h3>
              <p className="text-sm text-white/40 mb-6 italic">{totem.animal}</p>

              {/* Nhetembo / poem section */}
              <div
                className="w-full rounded-xl p-5 mb-6 min-h-[120px] flex flex-col items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-[3px] rounded-full animate-spin"
                      style={{ borderColor: 'rgba(255,215,0,0.3)', borderTopColor: 'rgb(255,215,0)' }} />
                    <p className="text-[10px] text-white/35 uppercase tracking-[0.2em]">
                      Loading the Praise Poem...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="font-headline text-lg sm:text-xl leading-relaxed italic whitespace-pre-line"
                      style={{ color: 'rgb(255,215,0)' }}>
                      <TypewriterText text={poemText} speed={aiPoem ? 22 : 35} />
                    </p>

                    {aiPoem && totem.nhetembo && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="pt-3 flex flex-col items-center gap-2"
                      >
                        <div className="w-8 h-px" style={{ background: 'rgba(255,215,0,0.3)' }} />
                        <p className="text-[9px] text-white/25 uppercase tracking-[0.3em] font-bold">
                          Traditional Verse
                        </p>
                        <p className="text-xs text-white/45 not-italic font-body leading-relaxed">
                          &ldquo;{totem.nhetembo}&rdquo;
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Continue button */}
              <button
                onClick={handleClose}
                className="w-full py-3.5 rounded-xl font-black text-base transition-all duration-150 active:scale-[0.97]"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.92), rgba(255,180,0,0.85))',
                  color: '#111',
                  border: '1px solid rgba(255,215,0,0.5)',
                  boxShadow: '0 4px 20px rgba(255,215,0,0.2)',
                }}
              >
                Continue Playing
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
