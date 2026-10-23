"use client";

import { useEffect, useRef, useState } from 'react';
import { TotemEntry } from '@/lib/content';
import { deleteAudio, getAudio, saveAudio } from '@/lib/firebase/repo';
import { useAdminData } from './AdminData';
import a from './admin.module.css';

const MAX_SECONDS = 6;
// Recordings are stored inside the database, which allows about 1 MB per item.
const MAX_BYTES = 700_000;

function pickMime() {
  if (typeof MediaRecorder === 'undefined') return '';
  for (const m of ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/webm']) {
    if (MediaRecorder.isTypeSupported(m)) return m;
  }
  return '';
}

const toDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });

/** Lets a fluent speaker record (or upload) how to say a totem name. */
export function AudioRecorder({ entry }: { entry: TotemEntry }) {
  const { me, reload } = useAdminData();
  const [current, setCurrent] = useState<string | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const rec = useRef<MediaRecorder | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (entry.audio) getAudio(entry.id).then(setCurrent).catch(() => setCurrent(null));
  }, [entry.id, entry.audio]);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
      rec.current?.stream.getTracks().forEach(t => t.stop());
    },
    [],
  );

  const start = async () => {
    setMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const mime = pickMime();
      const r = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 48_000 } : undefined);
      const chunks: Blob[] = [];
      r.ondataavailable = e => e.data.size && chunks.push(e.data);
      r.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        if (timer.current) clearInterval(timer.current);
        setRecording(false);
        const blob = new Blob(chunks, { type: r.mimeType || 'audio/webm' });
        setDraft(await toDataUrl(blob));
      };
      rec.current = r;
      r.start();
      setRecording(true);
      setSeconds(0);
      timer.current = setInterval(() => {
        setSeconds(s => {
          if (s + 1 >= MAX_SECONDS) r.state === 'recording' && r.stop();
          return s + 1;
        });
      }, 1000);
    } catch {
      setMsg('The microphone could not be opened. Allow microphone access in the browser and try again.');
    }
  };

  const stop = () => rec.current?.state === 'recording' && rec.current.stop();

  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_BYTES) return setMsg('That file is too large. Keep recordings under about 6 seconds.');
    setDraft(await toDataUrl(file));
  };

  const save = async () => {
    if (!draft || !me) return;
    if (draft.length * 0.75 > MAX_BYTES) return setMsg('The recording is too long. Try a shorter one.');
    setBusy(true);
    try {
      await saveAudio(entry, draft, me);
      setCurrent(draft);
      setDraft(null);
      setMsg('Recording saved. Children will now see a listen button for this totem.');
      await reload();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Could not save the recording.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!me || !window.confirm('Remove this recording?')) return;
    setBusy(true);
    await deleteAudio(entry, me);
    setCurrent(null);
    setBusy(false);
    await reload();
  };

  return (
    <div className={a.recorder}>
      <p className={a.hint}>
        Say the name <strong lang="sn">{entry.name}</strong> clearly, once, in a quiet room. Recordings stop after{' '}
        {MAX_SECONDS} seconds.
      </p>
      {current && (
        <div className={a.row}>
          <span className={a.muted}>Current recording:</span>
          <audio controls src={current} />
          <button type="button" className={a.btnSmall} onClick={remove} disabled={busy}>
            Remove
          </button>
        </div>
      )}
      <div className={a.row}>
        {recording ? (
          <button type="button" className={a.btnDanger} onClick={stop}>
            Stop ({MAX_SECONDS - seconds}s)
          </button>
        ) : (
          <button type="button" className={a.btn} onClick={start} disabled={busy}>
            {current ? 'Record again' : 'Record'}
          </button>
        )}
        <label className={a.btnGhost}>
          Upload a file
          <input type="file" accept="audio/*" hidden onChange={e => upload(e.target.files?.[0])} />
        </label>
      </div>
      {draft && (
        <div className={a.row}>
          <span className={a.muted}>New recording:</span>
          <audio controls src={draft} />
          <button type="button" className={a.btn} onClick={save} disabled={busy}>
            Save recording
          </button>
          <button type="button" className={a.btnSmall} onClick={() => setDraft(null)}>
            Discard
          </button>
        </div>
      )}
      {msg && <p className={a.muted}>{msg}</p>}
    </div>
  );
}
