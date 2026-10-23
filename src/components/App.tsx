"use client";

import { useCallback, useEffect, useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { AudioProvider, useAudio } from '@/context/AudioContext';
import { ContentProvider } from '@/context/ContentContext';
import { GameProvider, useGame } from '@/context/GameContext';
import { Difficulty } from '@/constants/totems';
import { LanguageScreen } from './screens/LanguageScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MemorySetupScreen } from './screens/MemorySetupScreen';
import { GameScreen } from './screens/GameScreen';
import { QuizSetupScreen } from './screens/QuizSetupScreen';
import { QuizScreen } from './screens/QuizScreen';
import { LearnScreen } from './screens/LearnScreen';
import s from './App.module.css';

export type Screen = 'home' | 'memory' | 'game' | 'quiz-setup' | 'quiz' | 'learn' | 'language';

/** The children's game, with everything it needs. */
export function GameApp() {
  return (
    <AppProvider>
      <ContentProvider>
        <AudioProvider>
          <GameProvider>
            <Screens />
          </GameProvider>
        </AudioProvider>
      </ContentProvider>
    </AppProvider>
  );
}

/**
 * Switches between screens. Each step away from home adds a browser history
 * entry, so the Android back button steps back instead of closing the app.
 */
function Screens() {
  const { ready, lang, mode } = useApp();
  const { start, leave } = useGame();
  const { startMusic, stopMusic } = useAudio();
  const [stack, setStack] = useState<Screen[]>(['home']);
  const screen = stack[stack.length - 1];

  useEffect(() => {
    const onPop = () => {
      setStack(st => (st.length > 1 ? st.slice(0, -1) : st));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Leaving the memory game stops it and its music.
  useEffect(() => {
    if (screen !== 'game') {
      leave();
      stopMusic();
    }
  }, [screen, leave, stopMusic]);

  // Every screen starts at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const open = useCallback((next: Screen) => {
    window.history.pushState({ depth: Date.now() }, '');
    setStack(st => [...st, next]);
  }, []);

  const back = useCallback(() => window.history.back(), []);

  const goHome = useCallback(() => {
    const steps = stack.length - 1;
    if (steps > 0) window.history.go(-steps);
  }, [stack.length]);

  const playMemory = useCallback(
    (level: Difficulty) => {
      start(level, mode);
      startMusic();
      open('game');
    },
    [start, mode, startMusic, open],
  );

  if (!ready) return <div className={s.splash} aria-hidden="true" />;

  if (!lang) return <LanguageScreen firstRun onDone={() => undefined} />;

  switch (screen) {
    case 'language':
      return <LanguageScreen onDone={back} />;
    case 'memory':
      return <MemorySetupScreen onBack={back} onPlay={playMemory} />;
    case 'game':
      return <GameScreen onExit={back} />;
    case 'quiz-setup':
      return <QuizSetupScreen onBack={back} onStart={() => open('quiz')} />;
    case 'quiz':
      return <QuizScreen onHome={goHome} onChangeQuiz={back} />;
    case 'learn':
      return <LearnScreen onBack={back} />;
    default:
      return (
        <HomeScreen
          onOpen={a => open(a === 'quiz' ? 'quiz-setup' : a === 'memory' ? 'memory' : 'learn')}
          onOpenLanguage={() => open('language')}
        />
      );
  }
}
