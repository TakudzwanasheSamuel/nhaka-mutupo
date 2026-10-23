"use client";

import { useState } from 'react';
import { Source } from '@/lib/content';
import { saveSource } from '@/lib/firebase/repo';
import { useAdminData } from './AdminData';
import a from './admin.module.css';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
const BLANK: Source = { id: '', title: '', author: '', year: null, url: null, kind: 'book', note: '' };

export function SourcesView() {
  const { content, canEdit, me, reload } = useAdminData();
  const [draft, setDraft] = useState<Source | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const list = Object.values(content.sources).sort((x, y) => x.title.localeCompare(y.title));
  const uses = (id: string) => content.entries.filter(e => e.sources.includes(id)).length;

  const save = async () => {
    if (!draft || !me) return;
    const s = { ...draft, id: draft.id || slug(draft.title) };
    if (!s.title.trim()) return setMsg('Add a title.');
    try {
      await saveSource(s, me);
      await reload();
      setDraft(null);
      setMsg(null);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Could not save.');
    }
  };

  return (
    <section>
      <div className={a.sectionHead}>
        <h1 className={a.h1}>Sources</h1>
        {canEdit && !draft && (
          <button type="button" className={a.btn} onClick={() => setDraft(BLANK)}>
            Add source
          </button>
        )}
      </div>

      {draft && (
        <fieldset className={a.box}>
          <legend>{draft.id ? 'Edit source' : 'New source'}</legend>
          <div className={a.grid2}>
            <label className={a.field}>
              <span>Title</span>
              <input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
            </label>
            <label className={a.field}>
              <span>Author or organisation</span>
              <input value={draft.author} onChange={e => setDraft({ ...draft, author: e.target.value })} />
            </label>
            <label className={a.field}>
              <span>Year</span>
              <input
                inputMode="numeric"
                value={draft.year ?? ''}
                onChange={e => setDraft({ ...draft, year: e.target.value ? Number(e.target.value.replace(/\D/g, '')) : null })}
              />
            </label>
            <label className={a.field}>
              <span>Kind</span>
              <select value={draft.kind} onChange={e => setDraft({ ...draft, kind: e.target.value })}>
                {['book', 'journal article', 'newspaper', 'community reference site', 'cultural website', 'interview with an elder', 'encyclopaedia', 'blog', 'other'].map(k => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </label>
          </div>
          <label className={a.field}>
            <span>Link (optional)</span>
            <input type="url" value={draft.url ?? ''} onChange={e => setDraft({ ...draft, url: e.target.value || null })} />
          </label>
          <label className={a.field}>
            <span>Note on what it covers and how reliable it is</span>
            <textarea rows={3} value={draft.note} onChange={e => setDraft({ ...draft, note: e.target.value })} />
          </label>
          {msg && <p className={a.error}>{msg}</p>}
          <div className={a.row}>
            <button type="button" className={a.btn} onClick={save}>
              Save source
            </button>
            <button type="button" className={a.btnGhost} onClick={() => setDraft(null)}>
              Cancel
            </button>
          </div>
        </fieldset>
      )}

      <ul className={a.list}>
        {list.map(s => (
          <li key={s.id} className={a.sourceRow}>
            <div>
              <strong>{s.title}</strong>
              <p className={a.muted}>
                {s.author}
                {s.year ? `, ${s.year}` : ''} · {s.kind} · used by {uses(s.id)} entries
              </p>
              {s.note && <p>{s.note}</p>}
            </div>
            <div className={a.row}>
              {s.url && (
                <a href={s.url} target="_blank" rel="noreferrer" className={a.link}>
                  Open
                </a>
              )}
              {canEdit && (
                <button type="button" className={a.btnSmall} onClick={() => setDraft(s)}>
                  Edit
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
