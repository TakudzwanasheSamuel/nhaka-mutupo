"use client";

import { useMemo, useState } from 'react';
import { COMMUNITIES, STATUS_LABEL, Status, TotemEntry, answerPicture, matchesSearch } from '@/lib/content';
import { EntryPicture } from '@/components/content/EntryPicture';
import { useAdminData } from './AdminData';
import a from './admin.module.css';

function csvCell(v: unknown) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function downloadCsv(entries: TotemEntry[], pictureName: (id: string) => string) {
  const head = ['ID', 'Name', 'Kind', 'Category', 'Answer pictures', 'Other names', 'Communities', 'Tradition', 'Explanation', 'Praise poem', 'Sources', 'Status', 'Research notes'];
  const rows = entries.map(e => [
    e.id,
    e.name,
    e.kind,
    e.category,
    e.answerIds.map(pictureName).join('; '),
    e.otherNames.map(n => `${n.name} (${n.type}, ${n.community})`).join('; '),
    e.communities.join('; '),
    e.tradition ?? '',
    e.explanation,
    e.nhetembo?.text.replace(/\n/g, ' / ') ?? '',
    e.sources.join('; '),
    STATUS_LABEL[e.status],
    e.notes,
  ]);
  const csv = [head, ...rows].map(r => r.map(csvCell).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `nhaka-mutupo-entries-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function EntriesView({ onOpen }: { onOpen: (id: string) => void }) {
  const { content, canEdit, inDb, loading } = useAdminData();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | Status>('all');
  const [community, setCommunity] = useState('all');
  const [category, setCategory] = useState('all');

  const counts = useMemo(() => {
    const c = { verified: 0, pending: 0, unresolved: 0 } as Record<Status, number>;
    content.entries.forEach(e => c[e.status]++);
    return c;
  }, [content.entries]);

  const list = content.entries
    .filter(e => status === 'all' || e.status === status)
    .filter(e => community === 'all' || e.communities.includes(community))
    .filter(e => category === 'all' || e.category === category)
    .filter(e => matchesSearch(e, content, q))
    .sort((x, y) => x.name.localeCompare(y.name));

  return (
    <section>
      <div className={a.sectionHead}>
        <h1 className={a.h1}>Totem entries</h1>
        <div className={a.row}>
          <button type="button" className={a.btnGhost} onClick={() => downloadCsv(list, id => content.pictures[id]?.name ?? id)}>
            Download CSV
          </button>
          {canEdit && (
            <button type="button" className={a.btn} onClick={() => onOpen('__new')}>
              Add entry
            </button>
          )}
        </div>
      </div>

      <div className={a.stats}>
        {(['verified', 'pending', 'unresolved'] as Status[]).map(s => (
          <button key={s} type="button" className={a.stat} data-status={s} aria-pressed={status === s} onClick={() => setStatus(status === s ? 'all' : s)}>
            <span className={a.statNum}>{counts[s]}</span>
            <span>{STATUS_LABEL[s]}</span>
          </button>
        ))}
      </div>

      <div className={a.filters}>
        <label className={a.field} data-inline>
          <span>Search</span>
          <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Name, praise name, animal…" />
        </label>
        <label className={a.field} data-inline>
          <span>Status</span>
          <select value={status} onChange={e => setStatus(e.target.value as 'all' | Status)}>
            <option value="all">All</option>
            {(['pending', 'verified', 'unresolved'] as Status[]).map(s => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
        <label className={a.field} data-inline>
          <span>Community</span>
          <select value={community} onChange={e => setCommunity(e.target.value)}>
            <option value="all">All</option>
            {COMMUNITIES.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className={a.field} data-inline>
          <span>Category</span>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="all">All</option>
            <option value="animal">Animal</option>
            <option value="symbol">Symbol</option>
          </select>
        </label>
      </div>

      {loading && <p className={a.muted}>Loading the latest data…</p>}
      <p className={a.muted}>
        Showing {list.length} of {content.entries.length}
      </p>

      <ul className={a.list}>
        {list.map(e => {
          const pic = answerPicture(e, content);
          return (
            <li key={e.id}>
              <button type="button" className={a.listRow} onClick={() => onOpen(e.id)}>
                <EntryPicture entryId={e.id} size={56} decorative />
                <span className={a.listMain}>
                  <span className={a.listTitle}>
                    {e.name}
                    {e.kind !== 'totem' && <span className={a.kind}>{e.kind}</span>}
                  </span>
                  <span className={a.listSub}>
                    {pic ? pic.name : 'No picture yet'} · {e.communities.join(', ')}
                  </span>
                </span>
                <span className={a.listEnd}>
                  <span className={a.status} data-status={e.status}>
                    {STATUS_LABEL[e.status]}
                  </span>
                  {canEdit && !inDb.has(`t:${e.id}`) && <span className={a.muted}>Not in database</span>}
                  {e.audio && <span className={a.muted}>Has recording</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
