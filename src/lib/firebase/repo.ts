"use client";

/**
 * Everything that talks to Firebase lives in this file, so the rest of the app
 * only sees plain data. Firebase is loaded on demand, which keeps the game
 * light for children who never open the admin side.
 */

import type { FirebaseApp } from 'firebase/app';
import type { Auth, User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { BUNDLED, Picture, Source, TotemEntry } from '@/lib/content';
import { BOOTSTRAP_ADMINS, firebaseConfig, isFirebaseConfigured } from './config';

export type Role = 'pending' | 'reviewer' | 'admin';

export interface Profile {
  uid: string;
  email: string;
  name: string;
  role: Role;
  createdAt: number;
}

export interface Note {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: number;
}

export interface HistoryItem {
  id: string;
  entityType: 'totem' | 'picture' | 'source' | 'user' | 'audio' | 'import';
  entityId: string;
  action: string;
  summary: string;
  by: string;
  byName: string;
  at: number;
}

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
}

export const repoConfigured = () => isFirebaseConfigured;

/* ── Lazy Firebase ───────────────────────────── */

let ready: Promise<{ app: FirebaseApp; auth: Auth; db: Firestore }> | null = null;

function fb() {
  if (!isFirebaseConfigured) return Promise.reject(new Error('Firebase is not set up yet.'));
  if (!ready) {
    ready = (async () => {
      const { initializeApp, getApps } = await import('firebase/app');
      const { getAuth } = await import('firebase/auth');
      const { initializeFirestore, getFirestore, persistentLocalCache, persistentMultipleTabManager } = await import(
        'firebase/firestore'
      );
      const app = getApps()[0] ?? initializeApp(firebaseConfig);
      const auth = getAuth(app);
      let db: Firestore;
      try {
        // Keeps the last downloaded content on the device, for schools with patchy internet.
        db = initializeFirestore(app, {
          localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
          // Some school networks, proxies and antivirus tools block Firestore's streaming
          // connection. This falls back to a slower connection that gets through.
          experimentalAutoDetectLongPolling: true,
        });
      } catch {
        db = getFirestore(app);
      }
      return { app, auth, db };
    })();
  }
  return ready;
}

const fs = () => import('firebase/firestore');

/** Firestore rejects undefined values; strip them before writing. */
function clean<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/* ── Content for the game ───────────────────────────── */

export interface PublicSettings {
  /** Entries waiting for review are playable by everyone. */
  showPending: boolean;
}

export async function getPublicSettings(): Promise<PublicSettings | null> {
  const { db } = await fb();
  const { doc, getDoc } = await fs();
  const snap = await getDoc(doc(db, 'settings', 'public'));
  return snap.exists() ? (snap.data() as PublicSettings) : null;
}

export async function setPublicSettings(settings: PublicSettings, me: Profile) {
  const { db } = await fb();
  const { doc, setDoc } = await fs();
  await setDoc(doc(db, 'settings', 'public'), settings);
  await log(
    me,
    'import',
    'settings',
    'settings',
    settings.showPending ? 'Entries waiting for review are now playable by everyone' : 'Only verified entries are now playable',
  );
}

/** What children see: verified content, plus entries waiting for review while that is switched on. */
export async function fetchPublished(includePending = false): Promise<{ entries: TotemEntry[]; pictures: Picture[]; sources: Source[] }> {
  const { db } = await fb();
  const { collection, getDocs, query, where } = await fs();
  const statuses = includePending ? ['verified', 'pending'] : ['verified'];
  const [t, p, s] = await Promise.all([
    getDocs(query(collection(db, 'totems'), where('status', 'in', statuses))),
    getDocs(query(collection(db, 'pictures'), where('status', 'in', statuses))),
    getDocs(collection(db, 'sources')),
  ]);
  return {
    entries: t.docs.map(d => d.data() as TotemEntry),
    pictures: p.docs.map(d => d.data() as Picture),
    sources: s.docs.map(d => d.data() as Source),
  };
}

/** Everything, including entries waiting for review. Reviewers only. */
export async function fetchAll(): Promise<{ entries: TotemEntry[]; pictures: Picture[]; sources: Source[] }> {
  const { db } = await fb();
  const { collection, getDocs } = await fs();
  const [t, p, s] = await Promise.all([
    getDocs(collection(db, 'totems')),
    getDocs(collection(db, 'pictures')),
    getDocs(collection(db, 'sources')),
  ]);
  return {
    entries: t.docs.map(d => d.data() as TotemEntry),
    pictures: p.docs.map(d => d.data() as Picture),
    sources: s.docs.map(d => d.data() as Source),
  };
}

/* ── Accounts ───────────────────────────── */

function toAuthUser(u: User): AuthUser {
  return { uid: u.uid, email: u.email ?? '', name: u.displayName ?? '' };
}

export async function onAuthChange(cb: (user: AuthUser | null) => void): Promise<() => void> {
  const { auth } = await fb();
  const { onAuthStateChanged } = await import('firebase/auth');
  return onAuthStateChanged(auth, u => cb(u ? toAuthUser(u) : null));
}

export async function signIn(email: string, password: string) {
  const { auth } = await fb();
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  await signInWithEmailAndPassword(auth, email.trim(), password);
}

let signingUp: Promise<void> | null = null;

/** Lets the sign-in listener wait until a new account has saved its name. */
export const waitForSignUp = () => signingUp ?? Promise.resolve();

export async function signUp(name: string, email: string, password: string) {
  const { auth } = await fb();
  const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
  signingUp = (async () => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await updateProfile(cred.user, { displayName: name.trim() });
    await ensureProfile({ uid: cred.user.uid, email: cred.user.email ?? email, name: name.trim() });
  })();
  try {
    await signingUp;
  } finally {
    signingUp = null;
  }
}

export async function signInWithGoogle() {
  const { auth } = await fb();
  const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
  await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function resetPassword(email: string) {
  const { auth } = await fb();
  const { sendPasswordResetEmail } = await import('firebase/auth');
  await sendPasswordResetEmail(auth, email.trim());
}

export async function signOut() {
  const { auth } = await fb();
  const { signOut: out } = await import('firebase/auth');
  await out(auth);
}

/** Reads the person's profile, creating it on first sign-in. New accounts wait for approval. */
export async function ensureProfile(user: AuthUser): Promise<Profile> {
  const { db } = await fb();
  const { doc, getDoc, setDoc } = await fs();
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as Profile;
  const profile: Profile = {
    uid: user.uid,
    email: user.email.toLowerCase(),
    name: user.name || user.email.split('@')[0],
    role: BOOTSTRAP_ADMINS.includes(user.email.toLowerCase()) ? 'admin' : 'pending',
    createdAt: Date.now(),
  };
  await setDoc(ref, profile);
  return profile;
}

export async function listUsers(): Promise<Profile[]> {
  const { db } = await fb();
  const { collection, getDocs } = await fs();
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => d.data() as Profile).sort((a, b) => b.createdAt - a.createdAt);
}

export async function setRole(target: Profile, role: Role, me: Profile) {
  const { db } = await fb();
  const { doc, updateDoc } = await fs();
  await updateDoc(doc(db, 'users', target.uid), { role });
  await log(me, 'user', target.uid, 'role', `${target.name} is now ${role}`);
}

export async function removeUser(target: Profile, me: Profile) {
  const { db } = await fb();
  const { doc, deleteDoc } = await fs();
  await deleteDoc(doc(db, 'users', target.uid));
  await log(me, 'user', target.uid, 'remove', `Removed ${target.name}'s access`);
}

/* ── Writing content ───────────────────────────── */

async function log(me: Profile, entityType: HistoryItem['entityType'], entityId: string, action: string, summary: string) {
  const { db } = await fb();
  const { addDoc, collection } = await fs();
  await addDoc(collection(db, 'history'), {
    entityType,
    entityId,
    action,
    summary,
    by: me.uid,
    byName: me.name,
    at: Date.now(),
  });
}

export async function saveEntry(entry: TotemEntry, me: Profile, summary: string) {
  const { db } = await fb();
  const { doc, setDoc } = await fs();
  await setDoc(doc(db, 'totems', entry.id), clean({ ...entry, updatedAt: Date.now(), updatedBy: me.name }));
  await log(me, 'totem', entry.id, 'save', summary);
}

export async function deleteEntry(id: string, me: Profile) {
  const { db } = await fb();
  const { doc, deleteDoc } = await fs();
  await deleteDoc(doc(db, 'totems', id));
  await log(me, 'totem', id, 'delete', `Deleted entry ${id}`);
}

export async function savePicture(picture: Picture, me: Profile, summary: string) {
  const { db } = await fb();
  const { doc, setDoc } = await fs();
  await setDoc(doc(db, 'pictures', picture.id), clean(picture));
  await log(me, 'picture', picture.id, 'save', summary);
}

export async function saveSource(source: Source, me: Profile) {
  const { db } = await fb();
  const { doc, setDoc } = await fs();
  await setDoc(doc(db, 'sources', source.id), clean(source));
  await log(me, 'source', source.id, 'save', `Saved source "${source.title}"`);
}

/* ── Review notes ───────────────────────────── */

export async function listNotes(entryId: string): Promise<Note[]> {
  const { db } = await fb();
  const { collection, getDocs } = await fs();
  const snap = await getDocs(collection(db, 'totems', entryId, 'notes'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Note, 'id'>) })).sort((a, b) => a.createdAt - b.createdAt);
}

export async function addNote(entryId: string, text: string, me: Profile) {
  const { db } = await fb();
  const { addDoc, collection } = await fs();
  await addDoc(collection(db, 'totems', entryId, 'notes'), {
    text: text.trim(),
    authorId: me.uid,
    authorName: me.name,
    createdAt: Date.now(),
  });
}

export async function listHistory(entityId?: string): Promise<HistoryItem[]> {
  const { db } = await fb();
  const { collection, getDocs, limit, orderBy, query, where } = await fs();
  const q = entityId
    ? query(collection(db, 'history'), where('entityId', '==', entityId))
    : query(collection(db, 'history'), orderBy('at', 'desc'), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<HistoryItem, 'id'>) })).sort((a, b) => b.at - a.at);
}

/* ── Pronunciation recordings ───────────────────────────── */

const audioCache = new Map<string, string | null>();

export async function getAudio(entryId: string): Promise<string | null> {
  if (audioCache.has(entryId)) return audioCache.get(entryId)!;
  const { db } = await fb();
  const { doc, getDoc } = await fs();
  const snap = await getDoc(doc(db, 'audio', entryId));
  const data = snap.exists() ? (snap.data().data as string) : null;
  audioCache.set(entryId, data);
  return data;
}

export async function saveAudio(entry: TotemEntry, dataUrl: string, me: Profile) {
  const { db } = await fb();
  const { doc, setDoc } = await fs();
  await setDoc(doc(db, 'audio', entry.id), { data: dataUrl, recordedBy: me.name, at: Date.now() });
  audioCache.set(entry.id, dataUrl);
  await setDoc(doc(db, 'totems', entry.id), clean({ ...entry, audio: true, updatedAt: Date.now(), updatedBy: me.name }));
  await log(me, 'audio', entry.id, 'record', `Recorded pronunciation for ${entry.name}`);
}

export async function deleteAudio(entry: TotemEntry, me: Profile) {
  const { db } = await fb();
  const { doc, deleteDoc, setDoc } = await fs();
  await deleteDoc(doc(db, 'audio', entry.id));
  audioCache.set(entry.id, null);
  await setDoc(doc(db, 'totems', entry.id), clean({ ...entry, audio: false, updatedAt: Date.now(), updatedBy: me.name }));
  await log(me, 'audio', entry.id, 'delete', `Removed pronunciation for ${entry.name}`);
}

/* ── Starter data ───────────────────────────── */

/**
 * Copies the built-in research data into Firestore. Existing documents are
 * left alone, so reviewers' work is never overwritten.
 */
export async function importStarterData(me: Profile): Promise<{ added: number; skipped: number }> {
  const { db } = await fb();
  const { collection, getDocs, writeBatch, doc } = await fs();
  let added = 0;
  let skipped = 0;
  const groups: [string, { id: string }[]][] = [
    ['sources', Object.values(BUNDLED.sources)],
    ['pictures', Object.values(BUNDLED.pictures)],
    ['totems', BUNDLED.entries],
  ];
  for (const [name, items] of groups) {
    const existing = new Set((await getDocs(collection(db, name))).docs.map(d => d.id));
    let batch = writeBatch(db);
    let n = 0;
    for (const item of items) {
      if (existing.has(item.id)) {
        skipped++;
        continue;
      }
      batch.set(doc(db, name, item.id), clean(item));
      added++;
      if (++n === 400) {
        await batch.commit();
        batch = writeBatch(db);
        n = 0;
      }
    }
    await batch.commit();
  }
  // Start with the game playable on entries waiting for review, unless an admin already chose otherwise.
  const settingsRef = doc(db, 'settings', 'public');
  const { getDoc, setDoc } = await fs();
  if (!(await getDoc(settingsRef)).exists()) await setDoc(settingsRef, { showPending: true });
  await log(me, 'import', 'starter', 'import', `Imported starter data: ${added} added, ${skipped} already there`);
  return { added, skipped };
}
