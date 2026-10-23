"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAudio } from '@/context/AudioContext';
import { useContent } from '@/context/ContentContext';
import { QuizQuestion, buildQuiz, pairingText, pictureName } from '@/lib/content';
import { Button, Icon, IconButton, ProgressBar, Sheet, SoundButton, Stars, Txt } from '@/components/kit';
import { EntryPicture } from '@/components/content/EntryPicture';
import { ListenButton } from '@/components/content/ListenButton';
import { QUIZ_LENGTH } from './QuizSetupScreen';
import s from './QuizScreen.module.css';

type Result = 'first' | 'second' | 'shown';

interface Attempt {
  wrong: string[];
  result: Result | null;
}

interface Props {
  onHome: () => void;
  onChangeQuiz: () => void;
}

function starsForQuiz(first: number, total: number) {
  if (!total) return 0;
  const r = first / total;
  return r >= 0.8 ? 3 : r >= 0.5 ? 2 : 1;
}

export function QuizScreen({ onHome, onChangeQuiz }: Props) {
  const { quizCategory, quizMode, lang, say, discover } = useApp();
  const { content, includePending } = useContent();
  const { play } = useAudio();

  const [round, setRound] = useState(0);
  const questions = useMemo<QuizQuestion[]>(
    () => buildQuiz(content, quizCategory, QUIZ_LENGTH, includePending),
    // A new round reshuffles questions and answer positions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [round, quizCategory],
  );
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [leaving, setLeaving] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIndex(0);
    setAttempts(questions.map(() => ({ wrong: [], result: null })));
  }, [questions]);

  const finished = questions.length > 0 && index >= questions.length;
  const q = questions[Math.min(index, questions.length - 1)];
  const attempt = attempts[index] ?? { wrong: [], result: null };
  const entry = q ? content.entries.find(e => e.id === q.entryId) : undefined;
  const answerPic = q ? content.pictures[q.answerId] : undefined;
  const resolved = attempt.result !== null;
  const showNames = quizMode === 'beginner' || resolved;

  useEffect(() => {
    if (resolved) feedbackRef.current?.focus({ preventScroll: false });
  }, [resolved, index]);

  const choose = (pictureId: string) => {
    if (!q || resolved || attempt.wrong.includes(pictureId)) return;
    const next = [...attempts];
    if (pictureId === q.answerId) {
      next[index] = { ...attempt, result: attempt.wrong.length ? 'second' : 'first' };
      play('match');
      discover(q.entryId);
    } else if (attempt.wrong.length === 0) {
      next[index] = { ...attempt, wrong: [pictureId] };
      play('miss');
    } else {
      next[index] = { wrong: [...attempt.wrong, pictureId], result: 'shown' };
      play('miss');
      discover(q.entryId);
    }
    setAttempts(next);
  };

  const tally = (r: Result) => attempts.filter(a => a.result === r).length;

  /* ── Results ───────────────────── */
  if (finished) {
    const total = questions.length;
    const first = tally('first');
    const stars = starsForQuiz(first, total);
    return (
      <div className={s.screen}>
        <header className={s.topBar}>
          <IconButton icon="home" label={say('home')} onClick={onHome} />
          <span className={s.topTitle}>
            <Txt k="quizTitle" />
          </span>
          <SoundButton />
        </header>
        <main className={s.results}>
          <Stars count={stars} size={60} animate label={say('starsLabel', { n: stars })} />
          <h1 className={s.resultsTitle}>
            <Txt k="quizDone" />
          </h1>

          <dl className={s.tally}>
            <div data-kind="first">
              <dt>
                <Icon name="star" size={22} />
                <Txt k="firstTry" inline />
              </dt>
              <dd>
                <Txt k="scoreOf" vars={{ n: first, total }} inline />
              </dd>
            </div>
            <div data-kind="second">
              <dt>
                <Icon name="check" size={22} />
                <Txt k="learned" inline />
              </dt>
              <dd>{tally('second')}</dd>
            </div>
            <div data-kind="shown">
              <dt>
                <Icon name="info" size={22} />
                <Txt k="shown" inline />
              </dt>
              <dd>{tally('shown')}</dd>
            </div>
          </dl>

          <ul className={s.review}>
            {questions.map((qq, i) => {
              const e = content.entries.find(x => x.id === qq.entryId)!;
              const r = attempts[i]?.result;
              return (
                <li key={qq.entryId} data-result={r ?? ''}>
                  <EntryPicture pictureId={qq.answerId} size={48} decorative />
                  <span className={s.reviewText}>{pairingText(e, content.pictures[qq.answerId], lang ?? 'both')}</span>
                  <span className={s.reviewMark}>
                    <Icon name={r === 'first' ? 'star' : r === 'second' ? 'check' : 'info'} size={20} />
                    <span className="sr-only">{say(r === 'first' ? 'firstTry' : r === 'second' ? 'learned' : 'shown')}</span>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className={s.actions}>
            <Button size="xl" icon="restart" block onClick={() => setRound(r => r + 1)}>
              <Txt k="playAgain" inline />
            </Button>
            <Button variant="secondary" icon="levels" block onClick={onChangeQuiz}>
              <Txt k="changeQuiz" inline />
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!q || !entry) return null;

  /* ── Question ───────────────────── */
  const feedbackKey = attempt.result === 'first' ? 'correctFirst' : attempt.result === 'second' ? 'correctSecond' : attempt.result === 'shown' ? 'answerWas' : attempt.wrong.length ? 'tryOnceMore' : null;

  return (
    <div className={s.screen}>
      <header className={s.topBar}>
        <IconButton icon="close" label={say('home')} onClick={() => setLeaving(true)} />
        <div className={s.progress}>
          <span className={s.progressText}>
            <Txt k="questionOf" vars={{ n: index + 1, total: questions.length }} inline />
          </span>
          <ProgressBar value={index + (resolved ? 1 : 0)} max={questions.length} />
        </div>
        <SoundButton />
      </header>

      <main className={s.main}>
        <section className={s.prompt} aria-labelledby="quiz-name">
          <p className={s.ask}>
            <Txt k={entry.category === 'symbol' ? 'askSymbol' : 'askAnimal'} />
          </p>
          <div className={s.nameRow}>
            <h1 className={s.name} id="quiz-name" lang="sn">
              {entry.name}
            </h1>
            <ListenButton entry={entry} compact />
          </div>
          {entry.tradition && (
            <p className={s.tradition}>
              <Txt k="traditionOf" vars={{ t: entry.tradition }} inline />
            </p>
          )}
        </section>

        <div className={s.options} role="group" aria-labelledby="quiz-name">
          {q.options.map(id => {
            const pic = content.pictures[id];
            const isAnswer = id === q.answerId;
            const wrong = attempt.wrong.includes(id);
            const state = resolved && isAnswer ? 'correct' : wrong ? 'wrong' : resolved ? 'faded' : 'open';
            const label = pictureName(pic, lang ?? 'both');
            return (
              <button
                key={id}
                type="button"
                className={s.option}
                data-state={state}
                disabled={resolved || wrong}
                onClick={() => choose(id)}
                aria-label={showNames ? label : pic.imageAlt}
              >
                <EntryPicture pictureId={id} size={140} decorative className={s.optionArt} />
                {showNames && <span className={s.optionName}>{label}</span>}
                {state === 'correct' && (
                  <span className={s.mark} data-kind="correct">
                    <Icon name="check" size={24} />
                    <span className="sr-only">{say('correctMark')}</span>
                  </span>
                )}
                {state === 'wrong' && (
                  <span className={s.mark} data-kind="wrong">
                    <Icon name="close" size={22} />
                    <span className="sr-only">{say('wrongMark')}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className={s.feedback} data-kind={attempt.result ?? (attempt.wrong.length ? 'retry' : 'none')} ref={feedbackRef} tabIndex={-1} aria-live="polite">
          {feedbackKey && (
            <p className={s.feedbackTitle}>
              <Icon name={attempt.result === 'first' ? 'star' : attempt.result === 'second' ? 'check' : 'info'} size={24} />
              <Txt k={feedbackKey} />
            </p>
          )}
          {resolved && (
            <>
              <p className={s.pairing}>
                <EntryPicture pictureId={q.answerId} size={44} decorative />
                <span>{pairingText(entry, answerPic, lang ?? 'both')}</span>
              </p>
              {lang !== 'sn' && <p className={s.explanation}>{entry.explanation}</p>}
              <Button size="xl" block icon="next" onClick={() => setIndex(i => i + 1)} data-autofocus>
                <Txt k={index + 1 >= questions.length ? 'seeScore' : 'next'} inline />
              </Button>
            </>
          )}
        </div>
      </main>

      <Sheet open={leaving} onClose={() => setLeaving(false)} labelledBy="leave-title" variant="dialog">
        <div className={s.confirm}>
          <h2 id="leave-title">
            <Txt k="confirmLeaveTitle" />
          </h2>
          <div className={s.actions}>
            <Button size="xl" block onClick={() => setLeaving(false)} data-autofocus>
              <Txt k="noKeepPlaying" inline />
            </Button>
            <Button variant="secondary" block onClick={onHome}>
              <Txt k="yesLeave" inline />
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
