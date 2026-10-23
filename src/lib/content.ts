/**
 * Content model and the rules for what the game is allowed to use.
 *
 * The data lives in src/content/*.json (the built-in copy, which also works
 * offline) and in Firestore (the live copy that reviewers edit). Game logic
 * never hard-codes a totem: add an entry to the data and it appears.
 */

import picturesFile from '@/content/pictures.json';
import totemsFile from '@/content/totems.json';
import sourcesFile from '@/content/sources.json';
import { PICTURE_ART, svgDataUri, tint } from '@/constants/picture-art';

export type Status = 'pending' | 'verified' | 'unresolved';
export type Category = 'animal' | 'symbol';

export interface Picture {
  id: string;
  name: string;
  /** ChiShona name, drafted for review. */
  nameSn?: string;
  category: Category;
  hue: number;
  /** Key of a built-in illustration, or null. */
  art: string | null;
  /** An uploaded picture (data URL), used instead of the built-in art. */
  imageData?: string | null;
  imageAlt: string;
  status: Status;
}

export interface OtherName {
  name: string;
  /** praise, women, equivalent, spelling, related totem, other name, clan, totem, earlier totem */
  type: string;
  community: string;
}

export interface TotemEntry {
  id: string;
  name: string;
  /** totem, praise name or clan name */
  kind: string;
  parentId: string | null;
  category: Category;
  /** Pictures that count as a correct answer. The first one with a picture is shown. */
  answerIds: string[];
  /** Pictures that must never be offered as a wrong answer for this entry. */
  relatedPictureIds: string[];
  otherNames: OtherName[];
  communities: string[];
  /** Shown in the question when the pairing belongs to one tradition. */
  tradition: string | null;
  explanation: string;
  nhetembo: { text: string; source: string } | null;
  sources: string[];
  notes: string;
  status: Status;
  /** True when a pronunciation recording exists. */
  audio: boolean | null;
  updatedAt?: number;
  updatedBy?: string;
}

export interface Source {
  id: string;
  title: string;
  author: string;
  year: number | null;
  url: string | null;
  kind: string;
  note: string;
}

export interface Content {
  pictures: Record<string, Picture>;
  entries: TotemEntry[];
  sources: Record<string, Source>;
}

export const BUNDLED: Content = {
  pictures: Object.fromEntries((picturesFile.pictures as Picture[]).map(p => [p.id, p])),
  entries: totemsFile.totems as TotemEntry[],
  sources: Object.fromEntries((sourcesFile.sources as Source[]).map(s => [s.id, s])),
};

/** Merge live documents over the built-in copy, matched by ID. */
export function mergeContent(base: Content, live: Partial<{ pictures: Picture[]; entries: TotemEntry[]; sources: Source[] }>): Content {
  const pictures = { ...base.pictures };
  live.pictures?.forEach(p => (pictures[p.id] = { ...pictures[p.id], ...p }));
  const sources = { ...base.sources };
  live.sources?.forEach(s => (sources[s.id] = { ...sources[s.id], ...s }));
  const byId = new Map(base.entries.map(e => [e.id, e]));
  live.entries?.forEach(e => byId.set(e.id, { ...byId.get(e.id), ...e } as TotemEntry));
  return { pictures, sources, entries: Array.from(byId.values()) };
}

/* ── Pictures ───────────────────────────── */

const imageCache = new Map<string, string>();

export function pictureImage(p: Picture | undefined): string | null {
  if (!p) return null;
  if (p.imageData) return p.imageData;
  if (!p.art || !PICTURE_ART[p.art]) return null;
  const key = `${p.art}:${p.hue}`;
  let uri = imageCache.get(key);
  if (!uri) {
    uri = svgDataUri(PICTURE_ART[p.art](tint(p.hue)));
    imageCache.set(key, uri);
  }
  return uri;
}

export const pictureTint = (p: Picture | undefined) => tint(p?.hue ?? 40);

/** The picture shown for an entry: the first accepted answer that has an image. */
export function answerPicture(entry: TotemEntry, content: Content): Picture | undefined {
  return entry.answerIds.map(id => content.pictures[id]).find(p => p && pictureImage(p));
}

/* ── What the game may use ───────────────────────────── */

/**
 * Scored play uses verified entries only. "Preview" (switched on from the admin
 * side, on one device) also lets pending entries through so they can be tested.
 * Unresolved entries never enter scored play.
 */
export function isPlayable(entry: TotemEntry, content: Content, preview: boolean): boolean {
  const ok = entry.status === 'verified' || (preview && entry.status === 'pending');
  if (!ok) return false;
  const pic = answerPicture(entry, content);
  if (!pic) return false;
  return pic.status === 'verified' || preview;
}

export function isPictureUsable(p: Picture, preview: boolean) {
  return !!pictureImage(p) && (p.status === 'verified' || (preview && p.status === 'pending'));
}

/** Entries shown in "Learn the totems". Unresolved ones only on a reviewer's preview device. */
export function isLearnable(entry: TotemEntry, includePending: boolean, includeUnresolved = false) {
  if (entry.status === 'verified') return true;
  if (entry.status === 'pending') return includePending;
  return includeUnresolved;
}

/* ── Search ───────────────────────────── */

export function matchesSearch(entry: TotemEntry, content: Content, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const hay = [
    entry.name,
    ...entry.otherNames.map(n => n.name),
    ...entry.answerIds.map(id => content.pictures[id]?.name ?? ''),
    ...entry.communities,
  ]
    .join(' ')
    .toLowerCase();
  return hay.includes(needle);
}

/* ── Quiz ───────────────────────────── */

export interface QuizQuestion {
  entryId: string;
  answerId: string;
  options: string[];
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Wrong answers must be genuinely wrong: never an accepted answer, never a
 * picture the reviewers marked as related, and never a picture that is the
 * answer to another totem sharing this one's accepted pictures.
 */
export function distractorPool(entry: TotemEntry, content: Content, preview: boolean): Picture[] {
  const blocked = new Set([...entry.answerIds, ...entry.relatedPictureIds]);
  // Entries that share an accepted picture are the same family (e.g. Soko and Mukanya).
  content.entries
    .filter(e => e.id !== entry.id && e.answerIds.some(id => entry.answerIds.includes(id)))
    .forEach(e => e.answerIds.forEach(id => blocked.add(id)));
  return Object.values(content.pictures).filter(
    p => p.category === entry.category && !blocked.has(p.id) && isPictureUsable(p, preview),
  );
}

export function quizEntries(content: Content, category: Category, preview: boolean) {
  return content.entries.filter(
    e => e.category === category && isPlayable(e, content, preview) && distractorPool(e, content, preview).length >= 3,
  );
}

export function buildQuiz(content: Content, category: Category, count: number, preview: boolean): QuizQuestion[] {
  return shuffle(quizEntries(content, category, preview))
    .slice(0, count)
    .map(entry => {
      const answer = answerPicture(entry, content)!;
      const wrong = shuffle(distractorPool(entry, content, preview)).slice(0, 3);
      return { entryId: entry.id, answerId: answer.id, options: shuffle([answer.id, ...wrong.map(p => p.id)]) };
    });
}

/* ── Memory game ───────────────────────────── */

/** One entry per picture, so two different totems never look like a pair. */
export function memoryEntries(content: Content, preview: boolean): TotemEntry[] {
  const seen = new Set<string>();
  return content.entries.filter(e => {
    if (!isPlayable(e, content, preview)) return false;
    const pic = answerPicture(e, content)!.id;
    if (seen.has(pic)) return false;
    seen.add(pic);
    return true;
  });
}

/* ── Labels ───────────────────────────── */

export const STATUS_LABEL: Record<Status, string> = {
  pending: 'Waiting for review',
  verified: 'Verified',
  unresolved: 'Unresolved',
};

export const NAME_TYPES = [
  'praise',
  'women',
  'equivalent',
  'spelling',
  'related totem',
  'other name',
  'clan',
  'totem',
  'earlier totem',
] as const;

export const COMMUNITIES = ['ChiShona', 'isiNdebele', 'Kalanga', 'Nambya', 'Tonga', 'Venda'] as const;

/* ── Names in the chosen language ───────────────────────────── */

export function pictureName(p: Picture | undefined, lang: 'en' | 'sn' | 'both'): string {
  if (!p) return '';
  return lang === 'sn' ? p.nameSn || p.name : p.name;
}

/** "Mhofu · Eland": the full pairing shown after an answer. */
export function pairingText(entry: TotemEntry, p: Picture | undefined, lang: 'en' | 'sn' | 'both'): string {
  const name = pictureName(p, lang);
  if (!name || name.toLowerCase() === entry.name.toLowerCase()) return entry.name;
  return `${entry.name} · ${name}`;
}
