"use client";

import { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useContent } from '@/context/ContentContext';
import { Category, answerPicture, isLearnable, matchesSearch, pictureName } from '@/lib/content';
import { ChevronBand, Icon, ProgressBar, TopBar, Txt } from '@/components/kit';
import { EntryPicture } from '@/components/content/EntryPicture';
import { TotemSheet } from '@/components/game/TotemSheet';
import s from './LearnScreen.module.css';

type Filter = 'all' | Category;

export function LearnScreen({ onBack }: { onBack: () => void }) {
  const { discovered, say, lang } = useApp();
  const { content, preview, includePending } = useContent();
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const learnable = useMemo(
    () =>
      content.entries
        .filter(e => isLearnable(e, includePending, preview) && answerPicture(e, content))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [content, includePending, preview],
  );
  const shown = learnable.filter(e => (filter === 'all' || e.category === filter) && matchesSearch(e, content, query));
  const foundCount = learnable.filter(e => discovered.includes(e.id)).length;

  return (
    <div className={s.screen}>
      <ChevronBand />
      <TopBar title={<Txt k="learnTitle" />} onBack={onBack} backIcon="home" />

      <main className={s.main}>
        {learnable.length === 0 ? (
          <p className={s.notice}>
            <Icon name="info" size={24} />
            <Txt k="notEnough" />
          </p>
        ) : (
          <div className={s.summary}>
            <p className={s.count}>
              <Txt k="foundCount" vars={{ n: foundCount, total: learnable.length }} inline />
            </p>
            <ProgressBar value={foundCount} max={learnable.length} />
            <p className={s.intro}>
              <Txt k="learnIntro" />
            </p>
          </div>
        )}

        {learnable.length > 0 && (
        <div className={s.tools}>
          <label className={s.search}>
            <Icon name="search" size={24} />
            <span className="sr-only">{say('search')}</span>
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={say('search')}
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <div className={s.filters} role="radiogroup" aria-label={say('search')}>
            {(['all', 'animal', 'symbol'] as Filter[]).map(f => (
              <button
                key={f}
                type="button"
                role="radio"
                aria-checked={filter === f}
                className={s.filter}
                data-selected={filter === f}
                onClick={() => setFilter(f)}
              >
                <Txt k={f === 'all' ? 'filterAll' : f === 'animal' ? 'filterAnimals' : 'filterSymbols'} inline />
              </button>
            ))}
          </div>
        </div>
        )}

        {shown.length === 0 && learnable.length > 0 ? (
          <p className={s.empty}>
            <Txt k="noResults" />
          </p>
        ) : (
          <ul className={s.grid}>
            {shown.map(e => {
              const pic = answerPicture(e, content);
              const found = discovered.includes(e.id);
              return (
                <li key={e.id}>
                  <button type="button" className={s.tile} onClick={() => setOpenId(e.id)} data-status={preview ? e.status : undefined}>
                    {found && (
                      <span className={s.found}>
                        <Icon name="check" size={16} />
                        <span className="sr-only">{say('foundBadge')}</span>
                      </span>
                    )}
                    <EntryPicture entryId={e.id} size={96} decorative />
                    <span className={s.tileName} lang="sn">
                      {e.name}
                    </span>
                    <span className={s.tileSub}>{pictureName(pic, lang ?? 'both')}</span>
                    {preview && e.status !== 'verified' && (
                      <span className={s.status}>
                        <Txt k="notChecked" inline />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {learnable.length > 0 && (
          <aside className={s.tip}>
            <Txt k="maitaTip" />
          </aside>
        )}
      </main>

      <TotemSheet totemId={openId} context="learn" onClose={() => setOpenId(null)} />
    </div>
  );
}
