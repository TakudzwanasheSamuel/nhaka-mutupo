"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  COMMUNITIES,
  NAME_TYPES,
  STATUS_LABEL,
  Status,
  TotemEntry,
  answerPicture,
  distractorPool,
  pictureImage,
} from '@/lib/content';
import { HistoryItem, Note, addNote, deleteEntry, listHistory, listNotes, saveEntry } from '@/lib/firebase/repo';
import { EntryPicture } from '@/components/content/EntryPicture';
import { AudioRecorder } from './AudioRecorder';
import { useAdminData } from './AdminData';
import a from './admin.module.css';

const BLANK: TotemEntry = {
  id: '',
  name: '',
  kind: 'totem',
  parentId: null,
  category: 'animal',
  answerIds: [],
  relatedPictureIds: [],
  otherNames: [],
  communities: ['ChiShona'],
  tradition: null,
  explanation: '',
  nhetembo: null,
  sources: [],
  notes: '',
  status: 'pending',
  audio: null,
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function describeChanges(before: TotemEntry | undefined, after: TotemEntry) {
  if (!before) return `Added entry ${after.name}`;
  const changed = (Object.keys(after) as (keyof TotemEntry)[]).filter(
    k => !['updatedAt', 'updatedBy'].includes(k) && JSON.stringify(before[k]) !== JSON.stringify(after[k]),
  );
  if (before.status !== after.status) return `${after.name}: status ${STATUS_LABEL[before.status]} → ${STATUS_LABEL[after.status]}`;
  return changed.length ? `${after.name}: changed ${changed.join(', ')}` : `${after.name}: saved without changes`;
}

interface Props {
  id: string | null;
  onClose: () => void;
  onOpen: (id: string) => void;
}

export function EntryEditor({ id, onClose, onOpen }: Props) {
  const { content, canEdit, isAdmin, me, reload, inDb } = useAdminData();
  const original = id ? content.entries.find(e => e.id === id) : undefined;
  const [draft, setDraft] = useState<TotemEntry>(original ?? BLANK);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [noteText, setNoteText] = useState('');
  const isNew = !original;
  const ro = !canEdit;

  useEffect(() => setDraft(original ?? BLANK), [original]);

  useEffect(() => {
    if (!canEdit || !id) return;
    listNotes(id).then(setNotes).catch(() => setNotes([]));
    listHistory(id).then(setHistory).catch(() => setHistory([]));
  }, [canEdit, id]);

  const set = <K extends keyof TotemEntry>(k: K, v: TotemEntry[K]) => setDraft(d => ({ ...d, [k]: v }));
  const pictures = useMemo(
    () => Object.values(content.pictures).sort((x, y) => x.name.localeCompare(y.name)),
    [content.pictures],
  );
  const shownPic = answerPicture(draft, content);
  const pool = draft.answerIds.length ? distractorPool(draft, content, true) : [];

  /* Checks a reviewer sees before marking an entry verified. */
  const checks = [
    { ok: draft.answerIds.length > 0, text: 'Has at least one accepted answer picture' },
    { ok: !!shownPic, text: 'The answer picture has an image' },
    { ok: shownPic?.status === 'verified', text: `The answer picture (${shownPic?.name ?? 'none'}) is itself verified` },
    { ok: draft.sources.some(s => s !== 'app-v1'), text: 'Has at least one real source' },
    { ok: pool.length >= 3, text: `At least three genuinely wrong pictures exist for the quiz (${pool.length} now)` },
    { ok: !!draft.explanation.trim(), text: 'Has a short explanation' },
  ];
  const canVerify = checks.every(c => c.ok);

  const save = async () => {
    if (!me) return;
    const entry: TotemEntry = { ...draft, id: draft.id || slug(draft.name), name: draft.name.trim() };
    if (!entry.name || !entry.id) return setMsg({ kind: 'error', text: 'Give the entry a name first.' });
    if (isNew && content.entries.some(e => e.id === entry.id))
      return setMsg({ kind: 'error', text: `An entry with the ID "${entry.id}" already exists.` });
    if (!entry.answerIds.length) return setMsg({ kind: 'error', text: 'Choose at least one accepted answer picture.' });
    if (entry.status === 'verified' && !canVerify)
      return setMsg({ kind: 'error', text: 'This entry cannot be verified yet. Fix the items marked in the checklist.' });
    setSaving(true);
    setMsg(null);
    try {
      await saveEntry(entry, me, describeChanges(original, entry));
      await reload();
      setMsg({ kind: 'ok', text: 'Saved.' });
      if (isNew) onOpen(entry.id);
      else listHistory(entry.id).then(setHistory).catch(() => undefined);
    } catch (e) {
      setMsg({ kind: 'error', text: e instanceof Error ? e.message : 'Could not save.' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!me || !original) return;
    if (!window.confirm(`Delete ${original.name}? This cannot be undone.`)) return;
    await deleteEntry(original.id, me);
    await reload();
    onClose();
  };

  const postNote = async () => {
    if (!me || !id || !noteText.trim()) return;
    await addNote(id, noteText, me);
    setNoteText('');
    setNotes(await listNotes(id));
  };

  const togglePicture = (field: 'answerIds' | 'relatedPictureIds', pid: string) => {
    const list = draft[field];
    set(field, list.includes(pid) ? list.filter(x => x !== pid) : [...list, pid]);
  };

  const moveAnswerFirst = (pid: string) => set('answerIds', [pid, ...draft.answerIds.filter(x => x !== pid)]);

  return (
    <section className={a.editor}>
      <div className={a.sectionHead}>
        <button type="button" className={a.btnGhost} onClick={onClose}>
          ← All entries
        </button>
        {original && (
          <span className={a.status} data-status={original.status}>
            {STATUS_LABEL[original.status]}
          </span>
        )}
      </div>

      <div className={a.editorGrid}>
        <div className={a.editorMain}>
          <h1 className={a.h1}>{isNew ? 'New entry' : original!.name}</h1>
          {original?.updatedBy && (
            <p className={a.muted}>
              Last saved by {original.updatedBy}
              {original.updatedAt ? ` on ${new Date(original.updatedAt).toLocaleString()}` : ''}
            </p>
          )}

          {/* ── Review status ── */}
          <fieldset className={a.box} disabled={ro}>
            <legend>Review status</legend>
            <div className={a.segment} role="radiogroup" aria-label="Review status">
              {(['pending', 'verified', 'unresolved'] as Status[]).map(s => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={draft.status === s}
                  data-status={s}
                  disabled={ro || (s === 'verified' && !canVerify)}
                  onClick={() => set('status', s)}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
            <ul className={a.checks}>
              {checks.map(c => (
                <li key={c.text} data-ok={c.ok}>
                  <span aria-hidden="true">{c.ok ? '✓' : '✗'}</span>
                  <span>
                    {c.text}
                    <span className="sr-only">{c.ok ? ' (done)' : ' (not yet)'}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className={a.hint}>
              Only verified entries are used in scored play. Mark an entry unresolved when the pairing differs between
              clans or communities and no single answer is right.
            </p>
          </fieldset>

          {/* ── Names ── */}
          <fieldset className={a.box} disabled={ro}>
            <legend>Name</legend>
            <div className={a.grid2}>
              <label className={a.field}>
                <span>Totem or associated name</span>
                <input value={draft.name} onChange={e => set('name', e.target.value)} lang="sn" />
              </label>
              <label className={a.field}>
                <span>ID {isNew ? '(made from the name)' : '(cannot change)'}</span>
                <input value={draft.id || slug(draft.name)} onChange={e => set('id', slug(e.target.value))} disabled={!isNew} />
              </label>
              <label className={a.field}>
                <span>Kind</span>
                <select value={draft.kind} onChange={e => set('kind', e.target.value)}>
                  <option value="totem">Totem (mutupo)</option>
                  <option value="praise name">Praise name (chidawo)</option>
                  <option value="clan name">Clan name</option>
                </select>
              </label>
              {draft.kind !== 'totem' && (
                <label className={a.field}>
                  <span>Belongs to</span>
                  <select value={draft.parentId ?? ''} onChange={e => set('parentId', e.target.value || null)}>
                    <option value="">None</option>
                    {content.entries
                      .filter(e => e.kind === 'totem' && e.id !== draft.id)
                      .sort((x, y) => x.name.localeCompare(y.name))
                      .map(e => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                  </select>
                </label>
              )}
              <label className={a.field}>
                <span>Category</span>
                <select value={draft.category} onChange={e => set('category', e.target.value as TotemEntry['category'])}>
                  <option value="animal">Animal</option>
                  <option value="symbol">Symbol</option>
                </select>
              </label>
              <label className={a.field}>
                <span>Tradition to name in the question (optional)</span>
                <input
                  value={draft.tradition ?? ''}
                  onChange={e => set('tradition', e.target.value || null)}
                  placeholder="e.g. Hera, Tonga (Binga)"
                />
              </label>
            </div>
          </fieldset>

          {/* ── Pictures ── */}
          <fieldset className={a.box} disabled={ro}>
            <legend>Accepted answers</legend>
            <p className={a.hint}>
              Tick every picture that counts as correct. The first one is shown in the game. All of them are kept out of
              the wrong answers.
            </p>
            <PicturePicker
              pictures={pictures.filter(p => p.category === draft.category)}
              selected={draft.answerIds}
              onToggle={pid => togglePicture('answerIds', pid)}
              first={draft.answerIds[0]}
              onMakeFirst={moveAnswerFirst}
            />
          </fieldset>

          <fieldset className={a.box} disabled={ro}>
            <legend>Never use as a wrong answer</legend>
            <p className={a.hint}>
              Pictures some families could see as right (for example the monkey for a baboon totem). They will never
              appear as a wrong option for this entry.
            </p>
            <PicturePicker
              pictures={pictures.filter(p => p.category === draft.category && !draft.answerIds.includes(p.id))}
              selected={draft.relatedPictureIds}
              onToggle={pid => togglePicture('relatedPictureIds', pid)}
            />
          </fieldset>

          {/* ── Other names ── */}
          <fieldset className={a.box} disabled={ro}>
            <legend>Praise names, equivalents and spellings</legend>
            <table className={a.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Community</th>
                  <th>
                    <span className="sr-only">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {draft.otherNames.map((n, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        aria-label="Name"
                        value={n.name}
                        onChange={e => set('otherNames', draft.otherNames.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                      />
                    </td>
                    <td>
                      <select
                        aria-label="Type"
                        value={n.type}
                        onChange={e => set('otherNames', draft.otherNames.map((x, j) => (j === i ? { ...x, type: e.target.value } : x)))}
                      >
                        {NAME_TYPES.map(t => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        aria-label="Community"
                        list="communities"
                        value={n.community}
                        onChange={e => set('otherNames', draft.otherNames.map((x, j) => (j === i ? { ...x, community: e.target.value } : x)))}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={a.btnSmall}
                        onClick={() => set('otherNames', draft.otherNames.filter((_, j) => j !== i))}
                        aria-label={`Remove ${n.name}`}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <datalist id="communities">
              {COMMUNITIES.map(c => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <button
              type="button"
              className={a.btnGhost}
              onClick={() => set('otherNames', [...draft.otherNames, { name: '', type: 'praise', community: 'ChiShona' }])}
            >
              Add a name
            </button>
          </fieldset>

          {/* ── Communities ── */}
          <fieldset className={a.box} disabled={ro}>
            <legend>Language or community</legend>
            <div className={a.checkRow}>
              {Array.from(new Set([...COMMUNITIES, ...draft.communities])).map(c => (
                <label key={c} className={a.checkChip}>
                  <input
                    type="checkbox"
                    checked={draft.communities.includes(c)}
                    onChange={() =>
                      set('communities', draft.communities.includes(c) ? draft.communities.filter(x => x !== c) : [...draft.communities, c])
                    }
                  />
                  {c}
                </label>
              ))}
            </div>
          </fieldset>

          {/* ── Learning content ── */}
          <fieldset className={a.box} disabled={ro}>
            <legend>What children read</legend>
            <label className={a.field}>
              <span>Short explanation (English, one or two simple sentences)</span>
              <textarea rows={3} value={draft.explanation} onChange={e => set('explanation', e.target.value)} />
            </label>
            <label className={a.field}>
              <span>Praise poem (nhetembo), one line per line</span>
              <textarea
                rows={4}
                lang="sn"
                value={draft.nhetembo?.text ?? ''}
                onChange={e =>
                  set('nhetembo', e.target.value ? { text: e.target.value, source: draft.nhetembo?.source ?? 'app-v1' } : null)
                }
              />
            </label>
            {draft.nhetembo && (
              <label className={a.field}>
                <span>Where the praise poem comes from</span>
                <select
                  value={draft.nhetembo.source}
                  onChange={e => set('nhetembo', { ...draft.nhetembo!, source: e.target.value })}
                >
                  {Object.values(content.sources).map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </fieldset>

          {/* ── Sources ── */}
          <fieldset className={a.box} disabled={ro}>
            <legend>Sources</legend>
            <ul className={a.sourceList}>
              {Object.values(content.sources).map(s => (
                <li key={s.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={draft.sources.includes(s.id)}
                      onChange={() => set('sources', draft.sources.includes(s.id) ? draft.sources.filter(x => x !== s.id) : [...draft.sources, s.id])}
                    />
                    <span>
                      <strong>{s.title}</strong>
                      <span className={a.muted}>
                        {' '}
                        {s.author}
                        {s.year ? `, ${s.year}` : ''} · {s.kind}
                      </span>
                    </span>
                  </label>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noreferrer" className={a.link}>
                      Open
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset className={a.box} disabled={ro}>
            <legend>Research notes</legend>
            <label className={a.field}>
              <span>Where sources agree or disagree. Reviewers only; children never see this.</span>
              <textarea rows={4} value={draft.notes} onChange={e => set('notes', e.target.value)} />
            </label>
          </fieldset>

          {/* ── Pronunciation ── */}
          {original && (
            <fieldset className={a.box}>
              <legend>Pronunciation</legend>
              {canEdit && inDb.has(`t:${original.id}`) ? (
                <AudioRecorder entry={original} />
              ) : (
                <p className={a.hint}>
                  {canEdit ? 'Save this entry first, then record how to say it.' : 'Recording needs a signed-in reviewer.'}
                </p>
              )}
            </fieldset>
          )}

          {msg && (
            <p className={msg.kind === 'ok' ? a.success : a.error} role="status">
              {msg.text}
            </p>
          )}

          {canEdit && (
            <div className={a.saveBar}>
              <button type="button" className={a.btn} onClick={save} disabled={saving}>
                {saving ? 'Saving…' : isNew ? 'Add entry' : 'Save changes'}
              </button>
              <button type="button" className={a.btnGhost} onClick={onClose}>
                Cancel
              </button>
              {isAdmin && original && (
                <button type="button" className={a.btnDanger} onClick={remove}>
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Side: how it looks, discussion, history ── */}
        <aside className={a.editorSide}>
          <div className={a.box}>
            <h2 className={a.h2}>How it looks in the quiz</h2>
            <div className={a.quizPreview}>
              <p className={a.muted}>Which {draft.category} represents this mutupo?</p>
              <p className={a.quizName} lang="sn">
                {draft.name || 'Name'}
              </p>
              {draft.tradition && <p className={a.muted}>In the {draft.tradition} tradition</p>}
              <div className={a.quizOptions}>
                {shownPic && (
                  <figure data-correct="true">
                    <EntryPicture pictureId={shownPic.id} size={72} />
                    <figcaption>{shownPic.name} ✓</figcaption>
                  </figure>
                )}
                {pool.slice(0, 3).map(p => (
                  <figure key={p.id}>
                    <EntryPicture pictureId={p.id} size={72} />
                    <figcaption>{p.name}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
            <p className={a.hint}>Wrong answers are picked at random from these {pool.length} pictures:</p>
            <p className={a.poolList}>{pool.map(p => p.name).join(', ') || 'None yet'}</p>
          </div>

          {canEdit && id && (
            <div className={a.box}>
              <h2 className={a.h2}>Review discussion</h2>
              {notes.length === 0 && <p className={a.muted}>No comments yet.</p>}
              <ul className={a.notes}>
                {notes.map(n => (
                  <li key={n.id}>
                    <p>{n.text}</p>
                    <p className={a.muted}>
                      {n.authorName} · {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
              <label className={a.field}>
                <span>Add a comment</span>
                <textarea rows={3} value={noteText} onChange={e => setNoteText(e.target.value)} />
              </label>
              <button type="button" className={a.btnGhost} onClick={postNote} disabled={!noteText.trim()}>
                Post comment
              </button>
            </div>
          )}

          {canEdit && id && (
            <div className={a.box}>
              <h2 className={a.h2}>History</h2>
              {history.length === 0 && <p className={a.muted}>No changes recorded yet.</p>}
              <ul className={a.history}>
                {history.map(h => (
                  <li key={h.id}>
                    <span>{h.summary}</span>
                    <span className={a.muted}>
                      {h.byName} · {new Date(h.at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function PicturePicker({
  pictures,
  selected,
  onToggle,
  first,
  onMakeFirst,
}: {
  pictures: { id: string; name: string; status: Status }[];
  selected: string[];
  onToggle: (id: string) => void;
  first?: string;
  onMakeFirst?: (id: string) => void;
}) {
  const { content } = useAdminData();
  return (
    <ul className={a.picker}>
      {pictures.map(p => {
        const on = selected.includes(p.id);
        return (
          <li key={p.id}>
            <label className={a.pickerItem} data-on={on}>
              <input type="checkbox" checked={on} onChange={() => onToggle(p.id)} />
              {pictureImage(content.pictures[p.id]) ? (
                <EntryPicture pictureId={p.id} size={48} decorative />
              ) : (
                <span className={a.noArt}>No picture</span>
              )}
              <span className={a.pickerText}>
                <span>{p.name}</span>
                {p.status !== 'verified' && <span className={a.tiny}>Picture {STATUS_LABEL[p.status].toLowerCase()}</span>}
              </span>
            </label>
            {onMakeFirst && on && first !== p.id && (
              <button type="button" className={a.linkSmall} onClick={() => onMakeFirst(p.id)}>
                Show this one
              </button>
            )}
            {onMakeFirst && on && first === p.id && selected.length > 1 && <span className={a.tiny}>Shown in game</span>}
          </li>
        );
      })}
    </ul>
  );
}
