"use client";

import { useApp } from '@/context/AppContext';
import { useContent } from '@/context/ContentContext';
import { OtherName, answerPicture, pictureName } from '@/lib/content';
import { StringKey } from '@/lib/i18n';
import { Button, Icon, Sheet, Txt } from '@/components/kit';
import { EntryPicture } from '@/components/content/EntryPicture';
import { ListenButton } from '@/components/content/ListenButton';
import s from './TotemSheet.module.css';

interface Props {
  totemId: string | null;
  /** "new" when just found in a game, "learn" when opened from Learn the totems. */
  context: 'new' | 'learn';
  onClose: () => void;
}

const GROUPS: { key: StringKey; types: string[]; withCommunity?: boolean }[] = [
  { key: 'praiseNames', types: ['praise'] },
  { key: 'womenNames', types: ['women'] },
  { key: 'otherLanguages', types: ['equivalent', 'clan', 'totem', 'earlier totem'], withCommunity: true },
  { key: 'relatedTotems', types: ['related totem'] },
  { key: 'otherNames', types: ['spelling', 'other name'] },
];

/** The learning moment: picture, name, praise poem, meaning and related names. */
export function TotemSheet({ totemId, context, onClose }: Props) {
  const { lang } = useApp();
  const { content, preview, includePending } = useContent();
  const entry = totemId ? content.entries.find(e => e.id === totemId) : undefined;
  const showEnglish = lang !== 'sn';
  const pic = entry ? answerPicture(entry, content) : undefined;
  const parent = entry?.parentId ? content.entries.find(e => e.id === entry.parentId) : undefined;

  const grouped = (types: string[]) => (entry?.otherNames ?? []).filter(n => types.includes(n.type));
  const label = (n: OtherName, withCommunity?: boolean) => (withCommunity && n.community ? `${n.name} (${n.community})` : n.name);

  return (
    <Sheet open={!!entry} onClose={onClose} labelledBy="totem-title">
      {entry && (
        <div className={s.wrap}>
          {context === 'new' && (
            <p className={s.badge}>
              <Icon name="star" size={22} />
              <Txt k="newTotem" inline />
            </p>
          )}
          {(preview || includePending) && entry.status !== 'verified' && (
            <p className={s.unchecked}>
              <Icon name="info" size={20} />
              <Txt k="beingChecked" inline />
            </p>
          )}

          <EntryPicture entryId={entry.id} size={168} className={s.art} />

          <div className={s.titleRow}>
            <h2 className={s.name} id="totem-title" lang="sn">
              {entry.name}
            </h2>
            <ListenButton entry={entry} compact />
          </div>
          {pic && <p className={s.animal}>{pictureName(pic, lang ?? 'both')}</p>}
          {parent && (
            <p className={s.parent}>
              <Txt k="praiseNameOf" vars={{ name: parent.name }} inline />
            </p>
          )}

          {entry.nhetembo && (
            <section className={s.poem}>
              <h3 className={s.label}>
                <Txt k="praisePoem" inline />
              </h3>
              <p className={s.poemText} lang="sn">
                {entry.nhetembo.text}
              </p>
            </section>
          )}

          {showEnglish && (
            <section className={s.meaning}>
              <h3 className={s.label}>
                <Txt k="whatItMeans" inline />
              </h3>
              <p lang="en">{entry.explanation}</p>
            </section>
          )}

          {GROUPS.map(g => {
            const names = grouped(g.types);
            if (!names.length) return null;
            return (
              <section key={g.key} className={s.names}>
                <h3 className={s.label}>
                  <Txt k={g.key} inline />
                </h3>
                <ul className={s.chips}>
                  {names.map((n, i) => (
                    <li key={`${n.name}-${i}`} lang={n.community === 'ChiShona' ? 'sn' : undefined}>
                      {label(n, g.withCommunity)}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          {entry.communities.length > 0 && (
            <section className={s.names}>
              <h3 className={s.label}>
                <Txt k="communitiesLabel" inline />
              </h3>
              <ul className={s.chips} data-kind="community">
                {entry.communities.map(c => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>
          )}

          {context === 'new' && (
            <p className={s.added}>
              <Icon name="book" size={22} />
              <Txt k="addedToBook" inline />
            </p>
          )}

          {context === 'learn' && entry.sources.length > 0 && (
            <details className={s.sources}>
              <summary>
                <Txt k="sourcesLabel" inline />
              </summary>
              <ul>
                {entry.sources.map(id => {
                  const src = content.sources[id];
                  if (!src) return null;
                  return (
                    <li key={id}>
                      {src.url ? (
                        <a href={src.url} target="_blank" rel="noreferrer">
                          {src.title}
                        </a>
                      ) : (
                        src.title
                      )}
                      {src.author ? `, ${src.author}` : ''}
                    </li>
                  );
                })}
              </ul>
            </details>
          )}

          <Button block size="xl" onClick={onClose} data-autofocus>
            <Txt k={context === 'new' ? 'keepPlaying' : 'close'} inline />
          </Button>
        </div>
      )}
    </Sheet>
  );
}
