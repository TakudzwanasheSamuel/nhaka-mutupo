"use client";

import { useState } from 'react';
import { Category, Picture, STATUS_LABEL, Status, pictureImage } from '@/lib/content';
import { savePicture } from '@/lib/firebase/repo';
import { EntryPicture } from '@/components/content/EntryPicture';
import { useAdminData } from './AdminData';
import a from './admin.module.css';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Shrinks an uploaded picture so it loads quickly on mobile data. */
async function compress(file: File): Promise<string> {
  const img = await createImageBitmap(file);
  const size = 480;
  const scale = Math.min(1, size / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
  const webp = canvas.toDataURL('image/webp', 0.82);
  return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', 0.82);
}

export function PicturesView() {
  const { content, canEdit } = useAdminData();
  const [editing, setEditing] = useState<string | null>(null);
  const list = Object.values(content.pictures).sort((x, y) => x.category.localeCompare(y.category) || x.name.localeCompare(y.name));
  const usedBy = (id: string) => content.entries.filter(e => e.answerIds.includes(id)).map(e => e.name);

  if (editing) return <PictureEditor id={editing === '__new' ? null : editing} onClose={() => setEditing(null)} />;

  return (
    <section>
      <div className={a.sectionHead}>
        <h1 className={a.h1}>Pictures</h1>
        {canEdit && (
          <button type="button" className={a.btn} onClick={() => setEditing('__new')}>
            Add picture
          </button>
        )}
      </div>
      <p className={a.hint}>
        Each animal or symbol picture needs to be checked too: an eland must be recognisable as an eland. A picture is
        only used in scored play once it is verified.
      </p>
      <ul className={a.pictureGrid}>
        {list.map(p => (
          <li key={p.id}>
            <button type="button" className={a.pictureTile} onClick={() => setEditing(p.id)}>
              {pictureImage(p) ? <EntryPicture pictureId={p.id} size={96} decorative /> : <span className={a.noArt}>No picture</span>}
              <strong>{p.name}</strong>
              <span className={a.muted}>{p.category}</span>
              <span className={a.status} data-status={p.status}>
                {STATUS_LABEL[p.status]}
              </span>
              <span className={a.tiny}>{usedBy(p.id).join(', ') || 'Not used yet'}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PictureEditor({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { content, canEdit, me, reload } = useAdminData();
  const original = id ? content.pictures[id] : undefined;
  const [draft, setDraft] = useState<Picture>(
    original ?? { id: '', name: '', nameSn: '', category: 'animal', hue: 40, art: null, imageData: null, imageAlt: '', status: 'pending' },
  );
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Picture>(k: K, v: Picture[K]) => setDraft(d => ({ ...d, [k]: v }));

  const save = async () => {
    if (!me) return;
    const pic = { ...draft, id: draft.id || slug(draft.name) };
    if (!pic.name.trim() || !pic.imageAlt.trim()) return setMsg('Add a name and a description of the picture.');
    if (!original && content.pictures[pic.id]) return setMsg(`A picture with the ID "${pic.id}" already exists.`);
    if (pic.status === 'verified' && !pictureImage(pic)) return setMsg('Add an image before verifying.');
    setBusy(true);
    try {
      await savePicture(pic, me, original ? `${pic.name}: picture saved (${STATUS_LABEL[pic.status]})` : `Added picture ${pic.name}`);
      await reload();
      onClose();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={a.editorNarrow}>
      <button type="button" className={a.btnGhost} onClick={onClose}>
        ← All pictures
      </button>
      <h1 className={a.h1}>{original ? original.name : 'New picture'}</h1>
      <div className={a.picturePreview}>
        {pictureImage(draft) ? <img src={pictureImage(draft)!} alt={draft.imageAlt} width={160} height={160} /> : <span className={a.noArt}>No picture yet</span>}
      </div>
      <fieldset className={a.box} disabled={!canEdit}>
        <legend>Details</legend>
        <div className={a.grid2}>
          <label className={a.field}>
            <span>English name</span>
            <input value={draft.name} onChange={e => set('name', e.target.value)} />
          </label>
          <label className={a.field}>
            <span>ChiShona name</span>
            <input value={draft.nameSn ?? ''} onChange={e => set('nameSn', e.target.value)} lang="sn" />
          </label>
          <label className={a.field}>
            <span>Category</span>
            <select value={draft.category} onChange={e => set('category', e.target.value as Category)}>
              <option value="animal">Animal</option>
              <option value="symbol">Symbol</option>
            </select>
          </label>
          <label className={a.field}>
            <span>Status</span>
            <select value={draft.status} onChange={e => set('status', e.target.value as Status)}>
              {(['pending', 'verified', 'unresolved'] as Status[]).map(s => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className={a.field}>
          <span>Picture description (read aloud by screen readers)</span>
          <textarea rows={2} value={draft.imageAlt} onChange={e => set('imageAlt', e.target.value)} />
        </label>
        <label className={a.field}>
          <span>Upload a photo or drawing (replaces the built-in drawing). Only use pictures you have permission to use.</span>
          <input
            type="file"
            accept="image/*"
            onChange={async e => {
              const f = e.target.files?.[0];
              if (f) set('imageData', await compress(f));
            }}
          />
        </label>
        {draft.imageData && draft.art && (
          <button type="button" className={a.btnSmall} onClick={() => set('imageData', null)}>
            Go back to the built-in drawing
          </button>
        )}
      </fieldset>
      {msg && <p className={a.error}>{msg}</p>}
      {canEdit && (
        <div className={a.saveBar}>
          <button type="button" className={a.btn} onClick={save} disabled={busy}>
            {busy ? 'Saving…' : 'Save picture'}
          </button>
          <button type="button" className={a.btnGhost} onClick={onClose}>
            Cancel
          </button>
        </div>
      )}
    </section>
  );
}
