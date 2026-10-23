"use client";

import { useEffect, useRef, useState } from 'react';
import { StaticContentProvider, PREVIEW_KEY } from '@/context/ContentContext';
import { getPublicSettings, importStarterData, setPublicSettings, signOut } from '@/lib/firebase/repo';
import { DEFAULT_SHOW_PENDING } from '@/lib/firebase/config';
import { readJSON, writeJSON } from '@/lib/storage';
import { useAdminData } from './AdminData';
import { EntriesView } from './EntriesView';
import { EntryEditor } from './EntryEditor';
import { PicturesView } from './PicturesView';
import { SourcesView } from './SourcesView';
import { PeopleView } from './PeopleView';
import { ActivityView } from './ActivityView';
import { ReviewSheet } from './ReviewSheet';
import a from './admin.module.css';

type Tab = 'entries' | 'pictures' | 'sources' | 'people' | 'activity' | 'sheet';

export function AdminShell({ readOnly }: { readOnly?: boolean }) {
  const { content, me, isAdmin, canEdit, inDb, loaded, error, reload } = useAdminData();
  const [tab, setTab] = useState<Tab>('entries');
  const [editing, setEditing] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [showPending, setShowPending] = useState<boolean | null>(null);
  const autoImported = useRef(false);

  useEffect(() => setPreview(readJSON<boolean>(PREVIEW_KEY, false)), []);

  // Opening an entry or switching section starts at the top of the page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tab, editing]);

  const togglePreview = () => {
    const next = !preview;
    setPreview(next);
    writeJSON(PREVIEW_KEY, next);
  };

  const dbEmpty = canEdit && loaded && !content.entries.some(e => inDb.has(`t:${e.id}`));

  useEffect(() => {
    if (!canEdit) return;
    getPublicSettings()
      .then(s => setShowPending(s?.showPending ?? DEFAULT_SHOW_PENDING))
      .catch(() => setShowPending(DEFAULT_SHOW_PENDING));
  }, [canEdit, loaded]);

  const toggleShowPending = async () => {
    if (!me || showPending === null) return;
    const next = !showPending;
    if (!next && !window.confirm('Only verified entries will be playable. If few entries are verified, children will see a "still being checked" message. Continue?')) return;
    await setPublicSettings({ showPending: next }, me);
    setShowPending(next);
  };

  const runImport = async () => {
    if (!me) return;
    setImporting(true);
    setImportMsg(null);
    try {
      const r = await importStarterData(me);
      setImportMsg(`Imported ${r.added} items. ${r.skipped} were already in the database and were left as they are.`);
      await reload();
      setShowPending((await getPublicSettings())?.showPending ?? DEFAULT_SHOW_PENDING);
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : 'Import failed.');
    } finally {
      setImporting(false);
    }
  };

  // Pre-seed: the first time an admin opens an empty database, the researched data is imported automatically.
  useEffect(() => {
    if (dbEmpty && isAdmin && !autoImported.current) {
      autoImported.current = true;
      runImport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbEmpty, isAdmin]);

  const tabs: { id: Tab; label: string; show: boolean }[] = [
    { id: 'entries', label: 'Entries', show: true },
    { id: 'pictures', label: 'Pictures', show: true },
    { id: 'sources', label: 'Sources', show: true },
    { id: 'sheet', label: 'Review sheet', show: true },
    { id: 'activity', label: 'Activity', show: canEdit },
    { id: 'people', label: 'People', show: isAdmin },
  ];

  return (
    <StaticContentProvider content={content}>
      <div className={a.app}>
        <header className={a.header}>
          <div className={a.headerInner}>
            <div className={a.brand}>
              <img src="/brand/elephant-sm.webp" alt="" width={40} height={37} />
              <div>
                <p className={a.brandName}>Nhaka Mutupo</p>
                <p className={a.brandSub}>Content review</p>
              </div>
            </div>
            <div className={a.headerEnd}>
              {me ? (
                <>
                  <span className={a.who}>
                    {me.name}
                    <span className={a.role} data-role={me.role}>
                      {me.role}
                    </span>
                  </span>
                  <button type="button" className={a.btnSmall} onClick={() => signOut()}>
                    Sign out
                  </button>
                </>
              ) : (
                <span className={a.role} data-role="pending">
                  Read only
                </span>
              )}
            </div>
          </div>
          <nav className={a.tabs} aria-label="Sections">
            {tabs
              .filter(t => t.show)
              .map(t => (
                <button
                  key={t.id}
                  type="button"
                  className={a.tab}
                  aria-current={tab === t.id ? 'page' : undefined}
                  onClick={() => {
                    setTab(t.id);
                    setEditing(null);
                  }}
                >
                  {t.label}
                </button>
              ))}
          </nav>
        </header>

        <main className={a.main}>
          {readOnly && (
            <div className={a.banner} data-kind="info">
              <strong>Read-only view.</strong> Firebase is not connected yet, so this shows the built-in research data.
              Editing, accounts and recordings switch on once the Firebase settings are added.
            </div>
          )}
          {error && (
            <div className={a.banner} data-kind="error">
              Could not load the database: {error}{' '}
              <button type="button" className={a.link} onClick={reload}>
                Try again
              </button>
            </div>
          )}
          {importing && <div className={a.banner} data-kind="info">Loading the researched starter data into the database…</div>}
          {dbEmpty && isAdmin && !importing && (
            <div className={a.banner} data-kind="warn">
              <strong>The database is empty.</strong> Import the researched starter data ({content.entries.length} entries,{' '}
              {Object.keys(content.pictures).length} pictures, {Object.keys(content.sources).length} sources) so reviewers can
              start. Nothing already in the database is overwritten.
              <div className={a.row}>
                <button type="button" className={a.btn} onClick={runImport} disabled={importing}>
                  {importing ? 'Importing…' : 'Import starter data'}
                </button>
              </div>
            </div>
          )}
          {importMsg && <div className={a.banner} data-kind="info">{importMsg}</div>}

          {isAdmin && showPending !== null && (
            <label className={a.previewToggle} data-kind="site">
              <input type="checkbox" checked={showPending} onChange={toggleShowPending} />
              <span>
                <strong>Live game: play entries waiting for review.</strong>{' '}
                {showPending
                  ? 'On. Everyone can play entries that are verified or waiting for review, so the game works while review is under way. Unresolved entries are never used.'
                  : 'Off. Only verified entries are playable. Children see a "still being checked" message until enough entries are verified.'}{' '}
                Applies to every device.
              </span>
            </label>
          )}

          <label className={a.previewToggle}>
            <input type="checkbox" checked={preview} onChange={togglePreview} />
            <span>
              <strong>Reviewer view on this device.</strong> The game on this browser also shows unresolved entries and
              review labels, with your latest edits straight away. Children&rsquo;s devices are not affected.{' '}
              <a href="/" target="_blank" rel="noreferrer" className={a.link}>
                Open the game
              </a>
            </span>
          </label>

          {tab === 'entries' &&
            (editing ? (
              <EntryEditor id={editing === '__new' ? null : editing} onClose={() => setEditing(null)} onOpen={setEditing} />
            ) : (
              <EntriesView onOpen={setEditing} />
            ))}
          {tab === 'pictures' && <PicturesView />}
          {tab === 'sources' && <SourcesView />}
          {tab === 'sheet' && <ReviewSheet />}
          {tab === 'activity' && <ActivityView />}
          {tab === 'people' && <PeopleView />}
        </main>
      </div>
    </StaticContentProvider>
  );
}
