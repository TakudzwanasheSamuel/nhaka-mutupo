"use client";

import { useApp } from '@/context/AppContext';
import { useContent } from '@/context/ContentContext';
import { Difficulty, LEVELS, LEVEL_ORDER, PlayMode } from '@/constants/totems';
import { memoryEntries } from '@/lib/content';
import { Button, ChoiceGroup, Icon, Stars, TopBar, Txt } from '@/components/kit';
import { EntryPicture } from '@/components/content/EntryPicture';
import s from './Setup.module.css';

interface Props {
  onBack: () => void;
  onPlay: (level: Difficulty) => void;
}

export function MemorySetupScreen({ onBack, onPlay }: Props) {
  const { level, setLevel, mode, setMode, bestStars, say } = useApp();
  const { content, includePending } = useContent();
  const available = memoryEntries(content, includePending).length;
  const levelOk = (id: keyof typeof LEVELS) => available >= LEVELS[id].pairs;
  const anyOk = LEVEL_ORDER.some(levelOk);
  const current = levelOk(level) ? level : LEVEL_ORDER.find(levelOk) ?? level;
  const wordsAllowed = LEVELS[current].allowsWords;

  return (
    <div className={s.screen}>
      <TopBar title={<Txt k="memoryTitle" />} onBack={onBack} backIcon="home" />

      <main className={s.main}>
        {!anyOk && (
          <p className={s.notice}>
            <Icon name="info" size={24} />
            <Txt k="notEnough" />
          </p>
        )}

        <h2 className={s.sectionTitle} id="level-title">
          <Txt k="chooseLevel" inline />
        </h2>
        <div className={s.levels} role="radiogroup" aria-labelledby="level-title">
          {LEVEL_ORDER.map(id => {
            const l = LEVELS[id];
            const ok = levelOk(id);
            const selected = current === id && ok;
            const best = bestStars[id] ?? 0;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={!ok}
                className={s.level}
                data-selected={selected}
                onClick={() => setLevel(id)}
              >
                <EntryPicture pictureId={l.icon} size={64} decorative className={s.levelArt} />
                <span className={s.levelText}>
                  <span className={s.levelName}>
                    <Txt k={`level.${id}`} />
                  </span>
                  <span className={s.levelMeta}>
                    {ok ? <Txt k="pairs" vars={{ n: l.pairs }} inline /> : <Txt k="levelNeedsMore" vars={{ n: l.pairs }} inline />}
                  </span>
                </span>
                <span className={s.levelEnd}>
                  <Stars count={best} size={20} label={say('bestStars', { n: best })} />
                  <span className={s.radio} aria-hidden="true">
                    {selected && <Icon name="check" size={22} />}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <h2 className={s.sectionTitle} id="mode-title">
          <Txt k="howToPlay" inline />
        </h2>
        <ChoiceGroup<PlayMode>
          labelledBy="mode-title"
          value={wordsAllowed ? mode : 'pictures'}
          onChange={setMode}
          options={[
            {
              id: 'pictures',
              label: <Txt k="modePictures" />,
              icon: (
                <span className={s.miniPair}>
                  <span className={s.miniCard}><EntryPicture pictureId="lion" size={40} decorative /></span>
                  <span className={s.miniCard}><EntryPicture pictureId="lion" size={40} decorative /></span>
                </span>
              ),
            },
            {
              id: 'words',
              label: <Txt k="modeWords" />,
              disabled: !wordsAllowed,
              icon: (
                <span className={s.miniPair}>
                  <span className={s.miniCard}><EntryPicture pictureId="lion" size={40} decorative /></span>
                  <span className={s.miniCard} data-kind="word">Shumba</span>
                </span>
              ),
            },
          ]}
        />
        {!wordsAllowed && (
          <p className={s.note}>
            <Txt k="wordsNotHard" />
          </p>
        )}

        <div className={s.dock}>
          <Button size="xl" icon="play" block onClick={() => {
              setLevel(current);
              onPlay(current);
            }} disabled={!anyOk}>
            <Txt k="play" inline />
          </Button>
        </div>
      </main>
    </div>
  );
}
