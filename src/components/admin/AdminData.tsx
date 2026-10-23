"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BUNDLED, Content, mergeContent } from '@/lib/content';
import { Profile, fetchAll, repoConfigured } from '@/lib/firebase/repo';

interface AdminDataValue {
  content: Content;
  /** IDs of entries, pictures and sources already saved in the database. */
  inDb: Set<string>;
  loading: boolean;
  /** True once the database has been read at least once. */
  loaded: boolean;
  error: string | null;
  reload: () => Promise<void>;
  me: Profile | null;
  canEdit: boolean;
  isAdmin: boolean;
}

const Ctx = createContext<AdminDataValue | null>(null);

/** The reviewers' view of the content: database first, built-in research data underneath. */
export function AdminDataProvider({ me, children }: { me: Profile | null; children: React.ReactNode }) {
  const [content, setContent] = useState<Content>(BUNDLED);
  const [inDb, setInDb] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canEdit = !!me && (me.role === 'reviewer' || me.role === 'admin') && repoConfigured();

  const reload = useCallback(async () => {
    if (!canEdit) return;
    setLoading(true);
    setError(null);
    try {
      const live = await fetchAll();
      setContent(mergeContent(BUNDLED, live));
      setInDb(new Set([...live.entries.map(e => `t:${e.id}`), ...live.pictures.map(p => `p:${p.id}`), ...live.sources.map(s => `s:${s.id}`)]));
      setLoaded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load the data.');
    } finally {
      setLoading(false);
    }
  }, [canEdit]);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo(
    () => ({ content, inDb, loading, loaded, error, reload, me, canEdit, isAdmin: me?.role === 'admin' }),
    [content, inDb, loading, loaded, error, reload, me, canEdit],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider');
  return ctx;
}
