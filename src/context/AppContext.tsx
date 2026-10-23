"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Difficulty, PlayMode } from '@/constants/totems';
import type { Category } from '@/lib/content';
import { Lang, StringKey, Translated, Vars, plain, translate } from '@/lib/i18n';
import { readJSON, writeJSON } from '@/lib/storage';

export type QuizMode = 'beginner' | 'challenge';

const STORAGE_KEY = 'nhaka_mutupo_v4';

interface Saved {
  lang: Lang | null;
  level: Difficulty;
  mode: PlayMode;
  quizCategory: Category;
  quizMode: QuizMode;
  discovered: string[];
  bestStars: Partial<Record<Difficulty, number>>;
}

const DEFAULTS: Saved = {
  lang: null,
  level: 'easy',
  mode: 'pictures',
  quizCategory: 'animal',
  quizMode: 'beginner',
  discovered: [],
  bestStars: {},
};

interface AppContextValue extends Saved {
  /** False until saved settings have been read on the client. */
  ready: boolean;
  setLang: (lang: Lang) => void;
  setLevel: (level: Difficulty) => void;
  setMode: (mode: PlayMode) => void;
  setQuizCategory: (c: Category) => void;
  setQuizMode: (m: QuizMode) => void;
  discover: (totemId: string) => boolean;
  recordStars: (level: Difficulty, stars: number) => void;
  t: (key: StringKey, vars?: Vars) => Translated;
  say: (key: StringKey, vars?: Vars) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<Saved>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSaved({ ...DEFAULTS, ...readJSON<Partial<Saved>>(STORAGE_KEY, {}) });
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) writeJSON(STORAGE_KEY, saved);
  }, [saved, ready]);

  useEffect(() => {
    if (saved.lang) document.documentElement.lang = saved.lang === 'en' ? 'en' : 'sn';
  }, [saved.lang]);

  const setLang = useCallback((lang: Lang) => setSaved(s => ({ ...s, lang })), []);
  const setLevel = useCallback((level: Difficulty) => setSaved(s => ({ ...s, level })), []);
  const setMode = useCallback((mode: PlayMode) => setSaved(s => ({ ...s, mode })), []);
  const setQuizCategory = useCallback((quizCategory: Category) => setSaved(s => ({ ...s, quizCategory })), []);
  const setQuizMode = useCallback((quizMode: QuizMode) => setSaved(s => ({ ...s, quizMode })), []);

  const discover = useCallback(
    (totemId: string) => {
      const isNew = !saved.discovered.includes(totemId);
      if (isNew) setSaved(s => (s.discovered.includes(totemId) ? s : { ...s, discovered: [...s.discovered, totemId] }));
      return isNew;
    },
    [saved.discovered],
  );

  const recordStars = useCallback(
    (level: Difficulty, stars: number) =>
      setSaved(s => ({ ...s, bestStars: { ...s.bestStars, [level]: Math.max(stars, s.bestStars[level] ?? 0) } })),
    [],
  );

  const lang = saved.lang ?? 'both';
  const t = useCallback((key: StringKey, vars?: Vars) => translate(lang, key, vars), [lang]);
  const say = useCallback((key: StringKey, vars?: Vars) => plain(lang, key, vars), [lang]);

  const value = useMemo(
    () => ({ ...saved, ready, setLang, setLevel, setMode, setQuizCategory, setQuizMode, discover, recordStars, t, say }),
    [saved, ready, setLang, setLevel, setMode, setQuizCategory, setQuizMode, discover, recordStars, t, say],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
