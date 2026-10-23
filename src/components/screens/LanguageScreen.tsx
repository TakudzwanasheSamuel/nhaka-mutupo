"use client";

import { useApp } from '@/context/AppContext';
import { Lang } from '@/lib/i18n';
import { ChevronBand, Icon, IconButton } from '@/components/kit';
import s from './LanguageScreen.module.css';

const OPTIONS: { id: Lang; title: string; sample: string; sampleSub?: string }[] = [
  { id: 'en', title: 'English', sample: 'Play' },
  { id: 'sn', title: 'ChiShona', sample: 'Tamba' },
  { id: 'both', title: 'ChiShona + English', sample: 'Tamba', sampleSub: 'Play' },
];

interface Props {
  firstRun?: boolean;
  onDone: () => void;
}

export function LanguageScreen({ firstRun, onDone }: Props) {
  const { lang, setLang, say } = useApp();

  const choose = (id: Lang) => {
    setLang(id);
    onDone();
  };

  return (
    <main className={s.screen}>
      <ChevronBand />
      {!firstRun && (
        <div className={s.top}>
          <IconButton icon="back" label={say('back')} onClick={onDone} />
        </div>
      )}

      <div className={s.body}>
        <img className={s.mascot} src="/brand/elephant.webp" alt="" width={180} height={165} />
        {/* Always shown in both languages: the child has not chosen yet. */}
        <h1 className={s.title} id="lang-title">
          Sarudza mutauro
          <span className={s.titleSub}>Choose your language</span>
        </h1>

        <div className={s.options} role="radiogroup" aria-labelledby="lang-title">
          {OPTIONS.map(o => {
            const selected = !firstRun && lang === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className={s.option}
                data-selected={selected}
                onClick={() => choose(o.id)}
              >
                <span className={s.optionText}>
                  <span className={s.optionTitle}>{o.title}</span>
                  <span className={s.sample}>
                    <span className={s.sampleChip}>
                      {o.sample}
                      {o.sampleSub && <span className={s.sampleSub}>{o.sampleSub}</span>}
                    </span>
                  </span>
                </span>
                <span className={s.optionIcon} aria-hidden="true">
                  <Icon name={selected ? 'check' : 'next'} size={28} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
