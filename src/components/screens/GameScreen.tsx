"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useGame } from '@/context/GameContext';
import { useAudio } from '@/context/AudioContext';
import { LEVELS } from '@/constants/totems';
import { useContent } from '@/context/ContentContext';
import { answerPicture, pictureImage, pictureName } from '@/lib/content';
import { Button, Icon, IconButton, ProgressBar, Sheet, SoundButton, Txt } from '@/components/kit';
import { TotemCard } from '@/components/game/TotemCard';
import { TotemSheet } from '@/components/game/TotemSheet';
import { ResultsDialog } from '@/components/game/ResultsDialog';
import { useBoardSize } from '@/components/game/useBoardSize';
import s from './GameScreen.module.css';

type Panel = null | 'menu' | 'confirmRestart' | 'confirmLeave';

export function GameScreen({ onExit }: { onExit: () => void }) {
  const { say, lang } = useApp();
  const game = useGame();
  const { cards, open, flip, feedback, pairsFound, totalPairs, level, status, newTotem, closeNewTotem, restart, leave } = game;
  const { play, startMusic, stopMusic } = useAudio();
  const { content } = useContent();
  const entryOf = (id: string) => content.entries.find(e => e.id === id)!;
  const [panel, setPanel] = useState<Panel>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const { cols, cardW, gap } = useBoardSize(boardRef, LEVELS[level].cols, LEVELS[level].rows);

  // Sounds follow what happened in the game.
  const lastTick = useRef(0);
  useEffect(() => {
    if (feedback.kind === 'hint' || feedback.tick === lastTick.current) return;
    lastTick.current = feedback.tick;
    play(feedback.kind === 'match' ? 'match' : 'miss');
  }, [feedback, play]);

  useEffect(() => {
    if (status === 'won') stopMusic();
  }, [status, stopMusic]);

  const onFlip = useCallback(
    (i: number) => {
      const c = cards[i];
      if (c && !c.isFlipped && !c.isMatched && open.length < 2) play('flip');
      flip(i);
    },
    [cards, open.length, flip, play],
  );

  const doRestart = () => {
    setPanel(null);
    restart();
    startMusic();
  };

  const doLeave = () => {
    setPanel(null);
    stopMusic();
    leave();
    onExit();
  };

  const wobbling = feedback.kind === 'miss' && open.length === 2 ? open : [];
  const showResults = status === 'won' && !newTotem;

  return (
    <div className={s.screen}>
      <header className={s.topBar}>
        <IconButton icon="menu" label={say('menu')} onClick={() => setPanel('menu')} />

        <div className={s.progress}>
          <div className={s.progressLabel}>
            <span className={s.progressText}>
              <Txt k="pairsFound" inline />
            </span>
            <span className={s.count} aria-live="polite">
              <span className="sr-only">{say('pairsFound')}: </span>
              {pairsFound} / {totalPairs}
            </span>
          </div>
          <ProgressBar value={pairsFound} max={totalPairs} />
        </div>

        <SoundButton />
      </header>

      <main className={s.boardArea} ref={boardRef}>
        {cardW > 0 && (
          <div
            className={s.board}
            style={{ gridTemplateColumns: `repeat(${cols}, ${cardW}px)`, gap }}
          >
            {cards.map((card, i) => {
              const totem = entryOf(card.totemId);
              const pic = answerPicture(totem, content);
              const faceUp = card.isFlipped || card.isMatched;
              const label = card.isMatched
                ? say('cardMatched', { n: i + 1, name: totem.name })
                : faceUp
                  ? say('cardShows', { n: i + 1, name: totem.name })
                  : say('cardFaceDown', { n: i + 1 });
              return (
                <TotemCard
                  key={card.id}
                  card={card}
                  index={i}
                  width={cardW}
                  wobble={wobbling.includes(i)}
                  label={label}
                  name={totem.name}
                  image={pictureImage(pic)}
                  subName={lang !== 'sn' ? pictureName(pic, lang ?? 'both') : null}
                  onFlip={onFlip}
                />
              );
            })}
          </div>
        )}
      </main>

      <footer className={s.feedback} data-kind={feedback.kind} aria-live="polite">
        {feedback.kind === 'hint' && (
          <>
            <span className={s.feedbackIcon}>
              <Icon name="picture" size={26} />
            </span>
            <Txt className={s.feedbackText} k="tapTwo" />
          </>
        )}
        {feedback.kind === 'miss' && (
          <>
            <span className={s.feedbackIcon}>
              <Icon name="restart" size={26} />
            </span>
            <Txt className={s.feedbackText} k="tryAgain" />
          </>
        )}
        {feedback.kind === 'match' && (
          <>
            <img className={s.feedbackArt} src={pictureImage(answerPicture(entryOf(feedback.totemId), content)) ?? ''} alt="" width={44} height={44} />
            <Txt className={s.feedbackText} k="goodMatch" vars={{ name: entryOf(feedback.totemId).name }} />
          </>
        )}
      </footer>

      <TotemSheet totemId={newTotem} context="new" onClose={closeNewTotem} />

      <ResultsDialog open={showResults} onPlayAgain={doRestart} onChangeLevel={doLeave} />

      <Sheet open={panel === 'menu'} onClose={() => setPanel(null)} labelledBy="menu-title">
        <h2 className={s.sheetTitle} id="menu-title">
          <Txt k="menu" inline />
        </h2>
        <div className={s.menuActions}>
          <Button block size="xl" icon="play" onClick={() => setPanel(null)} data-autofocus>
            <Txt k="keepPlaying" inline />
          </Button>
          <Button block variant="secondary" icon="restart" onClick={() => setPanel('confirmRestart')}>
            <Txt k="startAgain" inline />
          </Button>
          <Button block variant="secondary" icon="levels" onClick={() => setPanel('confirmLeave')}>
            <Txt k="changeLevel" inline />
          </Button>
        </div>
      </Sheet>

      <Sheet
        open={panel === 'confirmRestart' || panel === 'confirmLeave'}
        onClose={() => setPanel(null)}
        labelledBy="confirm-title"
        variant="dialog"
      >
        <div className={s.confirm}>
          <h2 className={s.sheetTitle} id="confirm-title">
            <Txt k={panel === 'confirmRestart' ? 'confirmRestartTitle' : 'confirmLeaveTitle'} />
          </h2>
          <p className={s.confirmBody}>
            <Txt k="confirmBody" />
          </p>
          <div className={s.menuActions}>
            <Button block size="xl" onClick={() => setPanel(null)} data-autofocus>
              <Txt k="noKeepPlaying" inline />
            </Button>
            <Button block variant="secondary" onClick={panel === 'confirmRestart' ? doRestart : doLeave}>
              <Txt k={panel === 'confirmRestart' ? 'yesRestart' : 'yesLeave'} inline />
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
