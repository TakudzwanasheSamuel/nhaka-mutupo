#!/usr/bin/env node
/**
 * Checks the built-in content files before they go live.
 * Run with: npm run check:content
 *
 * It fails (exit code 1) on errors and lists warnings for reviewers.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = f => JSON.parse(readFileSync(join(root, f), 'utf8'));

const { pictures } = read('src/content/pictures.json');
const { totems } = read('src/content/totems.json');
const { sources } = read('src/content/sources.json');
const artFile = readFileSync(join(root, 'src/constants/picture-art.ts'), 'utf8');
const artBlock = artFile.slice(artFile.indexOf('export const PICTURE_ART'));
const artKeys = new Set([...artBlock.matchAll(/^\s+'?([\w-]+)'?(?::|,)/gm)].map(m => m[1]));

const errors = [];
const warnings = [];
const STATUSES = ['pending', 'verified', 'unresolved'];
const CATEGORIES = ['animal', 'symbol'];

function unique(list, label) {
  const seen = new Set();
  for (const item of list) {
    if (!item.id || !/^[a-z0-9-]+$/.test(item.id)) errors.push(`${label} has an invalid ID: "${item.id}"`);
    if (seen.has(item.id)) errors.push(`${label} ID used twice: ${item.id}`);
    seen.add(item.id);
  }
  return seen;
}

const pictureIds = unique(pictures, 'Picture');
const totemIds = unique(totems, 'Totem');
const sourceIds = unique(sources, 'Source');
const pictureById = Object.fromEntries(pictures.map(p => [p.id, p]));

for (const p of pictures) {
  if (!CATEGORIES.includes(p.category)) errors.push(`Picture ${p.id}: unknown category "${p.category}"`);
  if (!STATUSES.includes(p.status)) errors.push(`Picture ${p.id}: unknown status "${p.status}"`);
  if (p.art && !artKeys.has(p.art)) errors.push(`Picture ${p.id}: illustration "${p.art}" does not exist`);
  if (!p.imageAlt?.trim()) errors.push(`Picture ${p.id}: missing image description`);
  if (p.status === 'verified' && !p.art && !p.imageData) errors.push(`Picture ${p.id}: verified but has no picture`);
}

for (const t of totems) {
  const where = `Totem ${t.id}`;
  for (const field of ['name', 'kind', 'category', 'explanation', 'status']) {
    if (!t[field] || !String(t[field]).trim()) errors.push(`${where}: missing ${field}`);
  }
  if (!STATUSES.includes(t.status)) errors.push(`${where}: unknown status "${t.status}"`);
  if (!CATEGORIES.includes(t.category)) errors.push(`${where}: unknown category "${t.category}"`);
  if (!t.answerIds?.length) errors.push(`${where}: has no accepted answer`);
  for (const id of t.answerIds ?? []) {
    if (!pictureIds.has(id)) errors.push(`${where}: answer "${id}" is not a picture`);
    else if (pictureById[id].category !== t.category) errors.push(`${where}: answer "${id}" is a ${pictureById[id].category}, entry is a ${t.category}`);
  }
  for (const id of t.relatedPictureIds ?? []) if (!pictureIds.has(id)) errors.push(`${where}: related picture "${id}" does not exist`);
  for (const id of t.sources ?? []) if (!sourceIds.has(id)) errors.push(`${where}: source "${id}" does not exist`);
  if (t.nhetembo && !sourceIds.has(t.nhetembo.source)) errors.push(`${where}: praise poem source "${t.nhetembo.source}" does not exist`);
  if (t.parentId && !totemIds.has(t.parentId)) errors.push(`${where}: parent "${t.parentId}" does not exist`);
  if (t.answerIds?.some(id => (t.relatedPictureIds ?? []).includes(id))) errors.push(`${where}: a picture is both an answer and a related picture`);

  if (t.status === 'verified') {
    const real = (t.sources ?? []).filter(s => s !== 'app-v1');
    if (!real.length) errors.push(`${where}: verified without a source`);
    const shown = (t.answerIds ?? []).map(id => pictureById[id]).find(p => p && (p.art || p.imageData));
    if (!shown) errors.push(`${where}: verified but no answer has a picture`);
    else if (shown.status !== 'verified') errors.push(`${where}: verified, but its picture "${shown.id}" is not`);
  }
  if (t.status !== 'unresolved' && (t.sources ?? []).every(s => s === 'app-v1')) warnings.push(`${where}: only source is the earlier app`);
  if (t.nhetembo?.source === 'app-v1') warnings.push(`${where}: praise poem has no recorded source`);
}

// Required pairings from the brief.
const must = [
  ['mhofu', 'eland'],
  ['mukanya', 'baboon'],
];
for (const [totem, picture] of must) {
  const t = totems.find(x => x.id === totem);
  if (!t) errors.push(`Brief: "${totem}" is missing`);
  else if (t.answerIds[0] !== picture) errors.push(`Brief: ${totem} must match the ${picture} picture first`);
}

const count = s => totems.filter(t => t.status === s).length;
console.log(`Content: ${totems.length} entries (${count('verified')} verified, ${count('pending')} waiting, ${count('unresolved')} unresolved), ${pictures.length} pictures, ${sources.length} sources.`);
if (warnings.length) console.log(`\n${warnings.length} warnings:\n  ${warnings.join('\n  ')}`);
if (errors.length) {
  console.error(`\n${errors.length} errors:\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log('\nNo errors.');
