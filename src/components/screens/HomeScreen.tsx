"use client";

import { useApp } from '@/context/AppContext';
import { useContent } from '@/context/ContentContext';
import { StringKey } from '@/lib/i18n';
import { ChevronBand, Icon, IconName, PillButton, SoundButton, Txt } from '@/components/kit';
import { EntryPicture } from '@/components/content/EntryPicture';
import s from './HomeScreen.module.css';

const LANG_SHORT = { en: 'English', sn: 'ChiShona', both: 'ChiShona + English' } as const;

interface Activity {
  id: 'quiz' | 'memory' | 'learn';
  title: StringKey;
  desc: StringKey;
  icon: IconName;
  pictures: string[];
}

const ACTIVITIES: Activity[] = [
  { id: 'quiz', title: 'quizTitle', desc: 'quizDesc', icon: 'question', pictures: ['eland', 'baboon'] },
  { id: 'memory', title: 'memoryTitle', desc: 'memoryDesc', icon: 'cards', pictures: ['lion', 'lion'] },
  { id: 'learn', title: 'learnTitle', desc: 'learnDesc', icon: 'book', pictures: ['elephant', 'zebra'] },
];

interface Props {
  onOpen: (activity: Activity['id']) => void;
  onOpenLanguage: () => void;
}

export function HomeScreen({ onOpen, onOpenLanguage }: Props) {
  const { lang, say } = useApp();
  const { preview } = useContent();

  return (
    <div className={s.screen}>
      <ChevronBand />

      <header className={s.topBar}>
        <PillButton icon="globe" onClick={onOpenLanguage} aria-label={`${say('language')}: ${LANG_SHORT[lang ?? 'both']}`}>
          {LANG_SHORT[lang ?? 'both']}
        </PillButton>
        <SoundButton />
      </header>

      <main className={s.layout}>
        <section className={s.hero}>
          <img className={s.mascot} src="/brand/elephant.webp" alt="" width={360} height={330} />
          <h1 className={s.wordmark}>Nhaka Mutupo</h1>
          <p className={s.tagline}>
            <Txt k="tagline" />
          </p>
        </section>

        <nav className={s.activities} aria-label="Activities">
          {preview && (
            <p className={s.preview}>
              <Icon name="info" size={22} />
              <Txt k="previewOn" />
            </p>
          )}
          {ACTIVITIES.map((a, i) => (
            <button key={a.id} type="button" className={s.activity} data-kind={a.id} onClick={() => onOpen(a.id)}>
              <span className={s.activityArt} aria-hidden="true">
                <EntryPicture pictureId={a.pictures[0]} size={64} decorative className={s.artBack} />
                <EntryPicture pictureId={a.pictures[1]} size={64} decorative className={s.artFront} />
              </span>
              <span className={s.activityText}>
                <span className={s.activityTitle}>
                  <Txt k={a.title} />
                </span>
                <span className={s.activityDesc}>
                  <Txt k={a.desc} />
                </span>
              </span>
              <span className={s.go} aria-hidden="true">
                <Icon name={i === 0 ? 'play' : 'next'} size={i === 0 ? 24 : 26} />
              </span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
