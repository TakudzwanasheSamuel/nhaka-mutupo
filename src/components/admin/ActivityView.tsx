"use client";

import { useEffect, useState } from 'react';
import { HistoryItem, listHistory } from '@/lib/firebase/repo';
import a from './admin.module.css';

export function ActivityView() {
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listHistory()
      .then(setItems)
      .catch(e => setError(e instanceof Error ? e.message : 'Could not load activity.'));
  }, []);

  return (
    <section>
      <h1 className={a.h1}>Recent activity</h1>
      <p className={a.hint}>The last 100 changes by everyone, newest first.</p>
      {error && <p className={a.error}>{error}</p>}
      {!items && !error && <p className={a.muted}>Loading…</p>}
      {items?.length === 0 && <p className={a.muted}>Nothing has been changed yet.</p>}
      <ul className={a.history}>
        {items?.map(h => (
          <li key={h.id}>
            <span>{h.summary}</span>
            <span className={a.muted}>
              {h.byName} · {new Date(h.at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
