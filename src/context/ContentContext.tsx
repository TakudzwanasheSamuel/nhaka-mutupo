"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { BUNDLED, Content, mergeContent } from '@/lib/content';
import { fetchAll, fetchPublished, getPublicSettings, repoConfigured } from '@/lib/firebase/repo';
import { DEFAULT_SHOW_PENDING } from '@/lib/firebase/config';
import { readJSON } from '@/lib/storage';

export const PREVIEW_KEY = 'nhaka_preview_unverified';

interface ContentValue {
  content: Content;
  /** A reviewer's device: also shows unresolved entries and review labels. */
  preview: boolean;
  /** Entries waiting for review are playable (site-wide setting, or a reviewer's preview). */
  includePending: boolean;
  /** True once live content has been fetched (or there is nothing to fetch). */
  live: boolean;
}

const Ctx = createContext<ContentValue | null>(null);

/**
 * Starts with the built-in copy (so the game works offline straight away),
 * then layers the live, reviewed content from Firestore on top.
 */
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Content>(BUNDLED);
  const [preview, setPreview] = useState(false);
  const [showPending, setShowPending] = useState(DEFAULT_SHOW_PENDING);
  const [live, setLive] = useState(!repoConfigured());

  useEffect(() => {
    const wantsPreview = readJSON<boolean>(PREVIEW_KEY, false);
    setPreview(wantsPreview);
    if (!repoConfigured()) return;
    let cancelled = false;
    (async () => {
      try {
        const settings = await getPublicSettings().catch(() => null);
        const pending = settings?.showPending ?? DEFAULT_SHOW_PENDING;
        if (!cancelled) setShowPending(pending);
        // Reviewers previewing on this device see their latest edits; everyone else sees published content.
        const data = wantsPreview
          ? await fetchAll().catch(() => fetchPublished(pending))
          : await fetchPublished(pending).catch(() => fetchPublished(false));
        if (!cancelled) setContent(mergeContent(BUNDLED, data));
      } catch {
        /* offline or not set up: keep the built-in copy */
      } finally {
        if (!cancelled) setLive(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ content, preview, includePending: preview || showPending, live }),
    [content, preview, showPending, live],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContent() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

/** Supplies fixed content, e.g. the admin side's live view, to shared components. */
export function StaticContentProvider({ content, children }: { content: Content; children: React.ReactNode }) {
  const value = useMemo(() => ({ content, preview: true, includePending: true, live: true }), [content]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
