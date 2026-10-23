"use client";

import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TotemEntry } from '@/lib/content';
import { getAudio, repoConfigured } from '@/lib/firebase/repo';
import { Icon, Txt } from '@/components/kit';
import s from './ListenButton.module.css';

/** Plays the recorded pronunciation. Hidden when no recording exists. */
export function ListenButton({ entry, compact }: { entry: TotemEntry; compact?: boolean }) {
  const { say } = useApp();
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => audio.current?.pause(), []);

  if (!entry.audio || !repoConfigured()) return null;

  const play = async () => {
    try {
      const data = await getAudio(entry.id);
      if (!data) return;
      audio.current?.pause();
      audio.current = new Audio(data);
      audio.current.onended = () => setPlaying(false);
      setPlaying(true);
      await audio.current.play();
    } catch {
      setPlaying(false);
    }
  };

  return (
    <button
      type="button"
      className={s.listen}
      data-compact={compact}
      data-playing={playing}
      onClick={play}
      aria-label={`${say('listen')}: ${entry.name}`}
    >
      <Icon name="soundOn" size={compact ? 24 : 26} />
      {!compact && <Txt k="listen" inline />}
    </button>
  );
}
