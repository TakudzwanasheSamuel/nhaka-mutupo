"use client";

import { QuizMode, useApp } from '@/context/AppContext';
import { useContent } from '@/context/ContentContext';
import { Category, quizEntries } from '@/lib/content';
import { Button, ChoiceGroup, Icon, TopBar, Txt } from '@/components/kit';
import { EntryPicture } from '@/components/content/EntryPicture';
import s from './Setup.module.css';

export const QUIZ_LENGTH = 10;

interface Props {
  onBack: () => void;
  onStart: () => void;
}

export function QuizSetupScreen({ onBack, onStart }: Props) {
  const { quizCategory, setQuizCategory, quizMode, setQuizMode } = useApp();
  const { content, includePending } = useContent();
  const counts: Record<Category, number> = {
    animal: quizEntries(content, 'animal', includePending).length,
    symbol: quizEntries(content, 'symbol', includePending).length,
  };
  const category: Category = counts[quizCategory] ? quizCategory : counts.animal ? 'animal' : quizCategory;
  const total = Math.min(QUIZ_LENGTH, counts[category]);

  return (
    <div className={s.screen}>
      <TopBar title={<Txt k="quizTitle" />} onBack={onBack} backIcon="home" />

      <main className={s.main}>
        {!counts.animal && !counts.symbol && (
          <p className={s.notice}>
            <Icon name="info" size={24} />
            <Txt k="notEnough" />
          </p>
        )}

        <h2 className={s.sectionTitle} id="cat-title">
          <Txt k="whatToMatch" inline />
        </h2>
        <ChoiceGroup<Category>
          labelledBy="cat-title"
          value={category}
          onChange={setQuizCategory}
          options={[
            {
              id: 'animal',
              label: <Txt k="catAnimal" />,
              icon: <EntryPicture pictureId="eland" size={56} decorative />,
              disabled: !counts.animal,
              hint: !counts.animal ? <Txt k="comingSoon" /> : undefined,
            },
            {
              id: 'symbol',
              label: <Txt k="catSymbol" />,
              icon: <EntryPicture pictureId="heart" size={56} decorative />,
              disabled: !counts.symbol,
              hint: !counts.symbol ? <Txt k="comingSoon" /> : undefined,
            },
          ]}
        />

        <h2 className={s.sectionTitle} id="mode-title">
          <Txt k="howHard" inline />
        </h2>
        <ChoiceGroup<QuizMode>
          labelledBy="mode-title"
          value={quizMode}
          onChange={setQuizMode}
          options={[
            { id: 'beginner', label: <Txt k="modeBeginner" />, hint: <Txt k="modeBeginnerDesc" /> },
            { id: 'challenge', label: <Txt k="modeChallenge" />, hint: <Txt k="modeChallengeDesc" /> },
          ]}
        />

        <section className={s.scoring} aria-labelledby="scoring-title">
          <h2 id="scoring-title">
            <Txt k="scoringTitle" inline />
          </h2>
          <ul className={s.scoringList}>
            <li>
              <span className={s.scoringIcon} data-kind="tries">2</span>
              <Txt k="scoringTries" />
            </li>
            <li>
              <span className={s.scoringIcon} data-kind="first">
                <Icon name="star" size={20} />
              </span>
              <Txt k="scoringFirst" />
            </li>
            <li>
              <span className={s.scoringIcon} data-kind="second">
                <Icon name="check" size={20} />
              </span>
              <Txt k="scoringSecond" />
            </li>
            <li>
              <span className={s.scoringIcon} data-kind="shown">
                <Icon name="info" size={20} />
              </span>
              <Txt k="scoringShown" />
            </li>
          </ul>
        </section>

        <div className={s.dock}>
          <Button
            size="xl"
            icon="play"
            block
            disabled={!total}
            onClick={() => {
              setQuizCategory(category);
              onStart();
            }}
          >
            <span>
              <Txt k="startQuiz" inline />
            </span>
          </Button>
          {total > 0 && (
            <p className={s.note} style={{ marginTop: 10 }}>
              <Txt k="questionsCount" vars={{ n: total }} inline />
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
