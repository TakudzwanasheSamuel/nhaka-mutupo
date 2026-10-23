"use client";

import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useGame } from '@/context/GameContext';
import { EntryPicture } from '@/components/content/EntryPicture';
import { useContent } from '@/context/ContentContext';
import { Button, Sheet, Stars, Txt } from '@/components/kit';
import s from './ResultsDialog.module.css';

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const r = String(sec % 60).padStart(2, '0');
  return `${m}:${r}`;
}

async function celebrate() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const { default: confetti } = await import('canvas-confetti');
  const colours = ['#f4b52a', '#0b7a78', '#c2563a', '#23864b', '#ffffff'];
  confetti({ particleCount: 90, spread: 80, origin: { y: 0.35 }, colors: colours, disableForReducedMotion: true });
  setTimeout(() => confetti({ particleCount: 60, spread: 110, origin: { y: 0.3 }, colors: colours, disableForReducedMotion: true }), 350);
}

interface Props {
  open: boolean;
  onPlayAgain: () => void;
  onChangeLevel: () => void;
}

export function ResultsDialog({ open, onPlayAgain, onChangeLevel }: Props) {
  const { say } = useApp();
  const { stars, tries, elapsedSec, totalPairs, cards } = useGame();
  const { content } = useContent();

  useEffect(() => {
    if (open) celebrate();
  }, [open]);

  const totemIds = Array.from(new Set(cards.map(c => c.totemId)));

  return (
    <Sheet open={open} labelledBy="results-title" variant="dialog">
      <div className={s.wrap}>
        <div className={s.stars}>
          <Stars count={stars} size={64} animate label={say('starsLabel', { n: stars })} />
        </div>
        <h2 className={s.title} id="results-title">
          <Txt k="wellDone" />
        </h2>
        <p className={s.sub}>
          <Txt k="foundAllPairs" vars={{ n: totalPairs }} />
        </p>

        <dl className={s.stats}>
          <div className={s.stat}>
            <dt>
              <Txt k="tries" inline />
            </dt>
            <dd>{tries}</dd>
          </div>
          <div className={s.stat}>
            <dt>
              <Txt k="time" inline />
            </dt>
            <dd>{formatTime(elapsedSec)}</dd>
          </div>
        </dl>

        <section className={s.found}>
          <h3 className={s.foundTitle}>
            <Txt k="totemsThisGame" inline />
          </h3>
          <ul className={s.foundList}>
            {totemIds.map(id => (
              <li key={id}>
                <EntryPicture entryId={id} size={48} decorative />
                <span className="sr-only">{content.entries.find(e => e.id === id)?.name}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className={s.actions}>
          <Button block size="xl" icon="restart" onClick={onPlayAgain} data-autofocus>
            <Txt k="playAgain" inline />
          </Button>
          <Button block variant="secondary" icon="levels" onClick={onChangeLevel}>
            <Txt k="changeLevel" inline />
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
