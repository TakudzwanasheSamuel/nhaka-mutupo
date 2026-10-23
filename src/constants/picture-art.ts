/**
 * Picture illustrations for totems.
 *
 * Every illustration follows the same rules so the set reads as one family:
 *  - 120 x 120 canvas, clipped to a soft coloured disc (each totem has its own tint)
 *  - one ink colour for outlines, 4px weight, rounded joins
 *  - flat fills, two or three colours per animal
 *  - the same eye style everywhere
 *  - one feature that makes each animal unmistakable at small sizes
 *    (mane, trunk, stripes, white fringe, long muzzle, wool, beard, patches,
 *    boss horns, straight horns, lyre horns, tear marks, white head, red face,
 *    long jaw, coil, comb, spots, water)
 *
 * SVGs are stored as strings and turned into data URIs so the game works offline.
 */

export const INK = '#24323D';

type Part = [tag: string, attrs: string, fill: string];

const o = (w = 4) =>
  `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

/** Draws several shapes as one silhouette with a single shared outline. */
const merge = (parts: Part[], w = 4) =>
  parts
    .map(([t, a]) => `<${t} ${a} fill="${INK}" ${o(w * 2)}/>`)
    .join('') + parts.map(([t, a, f]) => `<${t} ${a} fill="${f}"/>`).join('');

/** A thick line with an ink outline. */
const tube = (d: string, fill: string, w = 6) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 4}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

const line = (d: string, w = 3, colour = INK) =>
  `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

const eye = (x: number, y: number, r = 5) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>` +
  `<circle cx="${x + r * 0.35}" cy="${y - r * 0.38}" r="${r * 0.38}" fill="#fff"/>`;

/** Eye on a dark face: white ring first. */
const ringEye = (x: number, y: number, r = 4.5) =>
  `<circle cx="${x}" cy="${y}" r="${r + 2.5}" fill="#fff" ${o(2.5)}/>` + eye(x, y, r);

const mirrorX = (d: string) =>
  d.replace(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${120 - Number(x)} ${y}`);

const wrap = (tint: string, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">` +
  `<defs><clipPath id="c"><circle cx="60" cy="60" r="58"/></clipPath></defs>` +
  `<circle cx="60" cy="60" r="58" fill="${tint}"/>` +
  `<g clip-path="url(#c)">${body}</g></svg>`;

export const tint = (h: number) => `hsl(${h},78%,88%)`;

/* ───────────────────────── Shumba · Lion ───────────────────────── */
const maneBumps = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  return [60 + Math.cos(a) * 37, 60 + Math.sin(a) * 37] as const;
});
const shumba = (t: string) =>
  wrap(
    t,
    merge([
      ['circle', 'cx="60" cy="60" r="38"', '#C8662B'],
      ...maneBumps.map(
        ([x, y]) => ['circle', `cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13"`, '#C8662B'] as Part,
      ),
    ]) +
      `<circle cx="42" cy="40" r="9" fill="#F2B53F" ${o()}/><circle cx="42" cy="40" r="4" fill="#C8662B"/>` +
      `<circle cx="78" cy="40" r="9" fill="#F2B53F" ${o()}/><circle cx="78" cy="40" r="4" fill="#C8662B"/>` +
      `<circle cx="60" cy="63" r="27" fill="#F2B53F" ${o()}/>` +
      `<ellipse cx="52.5" cy="76" rx="9" ry="7" fill="#FFF1D2"/><ellipse cx="67.5" cy="76" rx="9" ry="7" fill="#FFF1D2"/>` +
      `<path d="M53 66 Q60 63 67 66 L61.5 73 Q60 74.5 58.5 73 Z" fill="#7A3B1C" ${o(3)}/>` +
      line('M60 74 V79 M60 79 Q55 84 51 80 M60 79 Q65 84 69 80') +
      eye(50, 57) +
      eye(70, 57),
  );

/* ───────────────────────── Nzou · Elephant ───────────────────────── */
const earL = 'M42 38 C 22 26 4 40 8 62 C 11 80 30 88 44 74 Z';
const earLin = 'M38 44 C 24 38 14 48 16 62 C 18 74 30 78 38 70 Z';
const nzou = (t: string) =>
  wrap(
    t,
    `<path d="${earL}" fill="#A8B5C6" ${o()}/><path d="${earLin}" fill="#E9B9C0"/>` +
      `<path d="${mirrorX(earL)}" fill="#A8B5C6" ${o()}/><path d="${mirrorX(earLin)}" fill="#E9B9C0"/>` +
      merge([
        ['ellipse', 'cx="60" cy="52" rx="25" ry="26"', '#B9C4D2'],
        ['path', 'd="M50 64 C 48 84 50 98 58 104 C 64 108 72 104 70 98 C 68 94 63 97 62 93 C 61 86 70 80 70 64 Z"', '#B9C4D2'],
      ]) +
      line('M53 80 Q58 82 63 80 M54 88 Q59 90 63.5 87.5', 2.5) +
      `<path d="M51 72 C 47 80 42 85 36 86 C 39 80 42 75 45 69 Z" fill="#FFF7E2" ${o(3)}/>` +
      `<path d="M69 72 C 73 80 78 85 84 86 C 81 80 78 75 75 69 Z" fill="#FFF7E2" ${o(3)}/>` +
      eye(50, 50) +
      eye(70, 50),
  );

/* ───────────────────────── Mbizi · Zebra ───────────────────────── */
const zEar = 'M43 30 L32 5 L55 20 Z';
const zEarIn = 'M42 24 L36.5 12 L49.5 20 Z';
const zSide = 'M37 62 C 43 62 47 64 49 68 M38.5 74 C 43.5 74 46.5 76 48 80';
const mbizi = (t: string) =>
  wrap(
    t,
    `<path d="${zEar}" fill="#fff" ${o()}/><path d="${zEarIn}" fill="#F2C6CF"/>` +
      `<path d="${mirrorX(zEar)}" fill="#fff" ${o()}/><path d="${mirrorX(zEarIn)}" fill="#F2C6CF"/>` +
      line('M52 18 V8 M60 16 V5 M68 18 V8', 5) +
      `<path d="M35 36 C 35 15 85 15 85 36 L 81 82 C 80 101 40 101 39 82 Z" fill="#fff" ${o()}/>` +
      line('M45 26 L60 35 L75 26', 5) +
      line('M53 60 L60 67 L67 60', 4.5) +
      line(zSide, 5) +
      line(mirrorX(zSide), 5) +
      `<ellipse cx="60" cy="87" rx="18" ry="12" fill="#3A3F4A" ${o()}/>` +
      `<ellipse cx="53" cy="87" rx="2.8" ry="3.8" fill="#7A8392"/><ellipse cx="67" cy="87" rx="2.8" ry="3.8" fill="#7A8392"/>` +
      ringEye(49, 49, 4.3) +
      ringEye(71, 49, 4.3),
  );

/* ───────────────────────── Shoko · Vervet monkey ───────────────────────── */
const shoko = (t: string) =>
  wrap(
    t,
    `<circle cx="29" cy="58" r="11" fill="#8F9478" ${o()}/><circle cx="29" cy="58" r="5" fill="#3C3633"/>` +
      `<circle cx="91" cy="58" r="11" fill="#8F9478" ${o()}/><circle cx="91" cy="58" r="5" fill="#3C3633"/>` +
      `<circle cx="60" cy="56" r="32" fill="#A6AB8E" ${o()}/>` +
      `<path d="M32 52 C 36 30 84 30 88 52 C 80 43 40 43 32 52 Z" fill="#F7F4EA"/>` +
      `<ellipse cx="60" cy="68" rx="21" ry="22" fill="#3C3633" ${o(3)}/>` +
      `<circle cx="52" cy="62" r="5.5" fill="#F4B942"/><circle cx="52" cy="62" r="2.7" fill="${INK}"/><circle cx="53.3" cy="60.7" r="1.2" fill="#fff"/>` +
      `<circle cx="68" cy="62" r="5.5" fill="#F4B942"/><circle cx="68" cy="62" r="2.7" fill="${INK}"/><circle cx="69.3" cy="60.7" r="1.2" fill="#fff"/>` +
      `<ellipse cx="60" cy="78" rx="11" ry="7" fill="#5C534D"/>` +
      `<circle cx="57" cy="76.5" r="1.6" fill="#221D1A"/><circle cx="63" cy="76.5" r="1.6" fill="#221D1A"/>` +
      line('M55 82 Q60 85 65 82', 2.2, '#F7F4EA'),
  );

/* ───────────────────────── Gudo · Baboon ───────────────────────── */
const cheek = 'M40 44 C 26 46 16 56 16 66 C 26 68 36 64 42 58 Z';
const gudo = (t: string) =>
  wrap(
    t,
    `<circle cx="30" cy="40" r="8" fill="#8A7752" ${o()}/><circle cx="90" cy="40" r="8" fill="#8A7752" ${o()}/>` +
      `<path d="${cheek}" fill="#B3A06F" ${o()}/><path d="${mirrorX(cheek)}" fill="#B3A06F" ${o()}/>` +
      merge([
        ['ellipse', 'cx="60" cy="47" rx="29" ry="26"', '#9C8659'],
        ['rect', 'x="46" y="52" width="28" height="52" rx="13"', '#5E514A'],
      ]) +
      line('M60 58 V88', 2, '#7A6C63') +
      line('M45 42 Q51 38.5 57 42 M63 42 Q69 38.5 75 42', 3) +
      eye(52, 47, 4.2) +
      eye(68, 47, 4.2) +
      `<ellipse cx="55" cy="96" rx="2.6" ry="2" fill="${INK}"/><ellipse cx="65" cy="96" rx="2.6" ry="2" fill="${INK}"/>`,
  );

/* ───────────────────────── Gwai · Sheep ───────────────────────── */
const woolC: [number, number, number][] = [
  [40, 40, 14], [52, 30, 14], [68, 30, 14], [80, 40, 14], [87, 56, 13],
  [33, 56, 13], [38, 72, 12], [82, 72, 12], [60, 52, 28],
];
const gwai = (t: string) =>
  wrap(
    t,
    `<ellipse cx="26" cy="64" rx="13" ry="6" transform="rotate(-20 26 64)" fill="#EBD7C2" ${o()}/>` +
      `<ellipse cx="94" cy="64" rx="13" ry="6" transform="rotate(20 94 64)" fill="#EBD7C2" ${o()}/>` +
      merge(woolC.map(([x, y, r]) => ['circle', `cx="${x}" cy="${y}" r="${r}"`, '#FFFFFF'] as Part)) +
      `<ellipse cx="60" cy="72" rx="17" ry="22" fill="#EBD7C2" ${o()}/>` +
      merge([
        ['circle', 'cx="51" cy="52" r="8"', '#FFFFFF'],
        ['circle', 'cx="60" cy="49" r="9"', '#FFFFFF'],
        ['circle', 'cx="69" cy="52" r="8"', '#FFFFFF'],
      ]) +
      eye(53, 69, 4.2) +
      eye(67, 69, 4.2) +
      `<path d="M56 82 L64 82 L60 86 Z" fill="#D98C8C"/>` +
      line('M60 86 V89 M60 89 Q56 92 53 90 M60 89 Q64 92 67 90', 2.5),
  );

/* ───────────────────────── Mbudzi · Goat ───────────────────────── */
const goatHorn = 'M50 30 C 44 18 34 12 24 12 C 32 16 38 24 42 34 Z';
const goatEar = 'M43 44 C 31 44 19 52 15 58 C 25 60 37 56 45 52 Z';
const goatEye = (x: number) =>
  `<ellipse cx="${x}" cy="58" rx="6.5" ry="5.5" fill="#F4C542" ${o(2.5)}/>` +
  `<rect x="${x - 3.5}" y="56.8" width="7" height="2.4" rx="1.2" fill="${INK}"/>`;
const mbudzi = (t: string) =>
  wrap(
    t,
    `<path d="${goatHorn}" fill="#9A8F84" ${o()}/><path d="${mirrorX(goatHorn)}" fill="#9A8F84" ${o()}/>` +
      `<path d="${goatEar}" fill="#A86F42" ${o()}/><path d="${mirrorX(goatEar)}" fill="#A86F42" ${o()}/>` +
      `<path d="M51 90 L60 112 L69 90 Z" fill="#F6F0E4" ${o()}/>` +
      `<path d="M40 36 C 40 24 80 24 80 36 L 76 86 C 74 98 46 98 44 86 Z" fill="#C88A55" ${o()}/>` +
      `<path d="M56 29 L64 29 L66 80 L54 80 Z" fill="#F6F0E4"/>` +
      `<ellipse cx="60" cy="88" rx="12" ry="8" fill="#F6F0E4" ${o(3)}/>` +
      `<ellipse cx="56" cy="88" rx="1.8" ry="2.4" fill="${INK}"/><ellipse cx="64" cy="88" rx="1.8" ry="2.4" fill="${INK}"/>` +
      goatEye(49) +
      goatEye(71),
  );

/* ───────────────────────── Mombe · Nguni cattle ───────────────────────── */
const cowHorn = 'M44 36 C 28 36 13 28 12 10 C 21 18 32 22 46 26 Z';
const mombe = (t: string) =>
  wrap(
    t,
    `<path d="${cowHorn}" fill="#F2E3C4" ${o()}/><path d="${mirrorX(cowHorn)}" fill="#F2E3C4" ${o()}/>` +
      `<ellipse cx="29" cy="47" rx="12" ry="6" transform="rotate(-15 29 47)" fill="#fff" ${o()}/>` +
      `<ellipse cx="91" cy="47" rx="12" ry="6" transform="rotate(15 91 47)" fill="#fff" ${o()}/>` +
      `<path d="M38 30 C 38 22 82 22 82 30 L 79 76 L 41 76 Z" fill="#fff" ${o()}/>` +
      `<path d="M40 33 C 46 29 57 33 55 46 C 53 57 43 59 40.5 53 Z" fill="#3A3540"/>` +
      `<path d="M70 27 C 78 25 81 33 80 43 C 74 45 67 38 70 27 Z" fill="#A0522D"/>` +
      ringEye(50, 52, 4) +
      eye(70, 52) +
      `<rect x="38" y="68" width="44" height="30" rx="15" fill="#F4AFA6" ${o()}/>` +
      `<ellipse cx="50" cy="83" rx="3.5" ry="2.6" fill="${INK}"/><ellipse cx="70" cy="83" rx="3.5" ry="2.6" fill="${INK}"/>`,
  );

/* ───────────────────────── Nyati · Buffalo ───────────────────────── */
const bufHorn = 'M60 30 C 42 20 22 22 14 36 C 10 44 14 54 20 52 C 22 42 32 38 60 42 Z';
const bufEar = 'M42 50 C 32 50 22 56 20 62 C 28 65 37 62 44 58 Z';
const nyati = (t: string) =>
  wrap(
    t,
    `<path d="${bufEar}" fill="#3F3A39" ${o()}/><path d="${mirrorX(bufEar)}" fill="#3F3A39" ${o()}/>` +
      `<path d="M42 38 L78 38 L76 82 C 74 96 46 96 44 82 Z" fill="#4A4443" ${o()}/>` +
      merge([
        ['path', `d="${bufHorn}"`, '#7A726B'],
        ['path', `d="${mirrorX(bufHorn)}"`, '#7A726B'],
      ]) +
      line('M48 30 V40 M54 29 V41 M66 29 V41 M72 30 V40', 2, '#5B544F') +
      `<ellipse cx="60" cy="86" rx="14" ry="9" fill="#6E6764" ${o(3)}/>` +
      `<ellipse cx="55" cy="86" rx="2.2" ry="3" fill="${INK}"/><ellipse cx="65" cy="86" rx="2.2" ry="3" fill="${INK}"/>` +
      ringEye(51, 60, 4) +
      ringEye(69, 60, 4),
  );

/* ───────────────────────── Mhofu · Eland ───────────────────────── */
const elandHorn = 'M51 30 L40 2 L46.5 1 L56.5 29 Z';
const elandEar = 'M43 40 C 30 31 16 33 12 39 C 18 47 32 48 44 46 Z';
const elandRidges = 'M42 8 L48 6 M43.5 13 L49.5 11 M45 18 L51 16 M46.5 23 L52.5 21';
const mhofu = (t: string) =>
  wrap(
    t,
    `<path d="M44 78 C 41 96 38 110 34 124 L 86 124 C 82 110 79 96 76 78 Z" fill="#C99A68" ${o()}/>` +
      line('M47 104 L51 123 M73 104 L69 123 M57 108 L58 124', 3, '#F6E8D2') +
      `<path d="M53 90 C 47 103 50 117 60 121 C 68 113 68 101 66 90 Z" fill="#B0814F" ${o()}/>` +
      `<path d="${elandHorn}" fill="#6B5A4A" ${o(3)}/><path d="${mirrorX(elandHorn)}" fill="#6B5A4A" ${o(3)}/>` +
      line(elandRidges, 2, '#3A2F27') +
      line(mirrorX(elandRidges), 2, '#3A2F27') +
      `<path d="${elandEar}" fill="#D7A16F" ${o()}/><path d="${mirrorX(elandEar)}" fill="#D7A16F" ${o()}/>` +
      `<path d="M38 32 C 38 21 82 21 82 32 L 75 82 C 73 95 47 95 45 82 Z" fill="#DDB07F" ${o()}/>` +
      `<path d="M49 27 C 53 35 67 35 71 27 C 68 40 63 46 60 46 C 57 46 52 40 49 27 Z" fill="#6E4325"/>` +
      `<ellipse cx="60" cy="85" rx="13" ry="9" fill="#8C6A4F" ${o(3)}/>` +
      `<ellipse cx="56" cy="85" rx="1.8" ry="2.4" fill="${INK}"/><ellipse cx="64" cy="85" rx="1.8" ry="2.4" fill="${INK}"/>` +
      eye(49, 57, 5.5) +
      eye(71, 57, 5.5),
  );

/* ───────────────────────── Mhara · Impala ───────────────────────── */
const lyre = 'M53 30 C 41 24 37 15 45 10 C 50 6 49 4 46 2';
const impEar = 'M46 40 C 36 30 24 28 18 32 C 24 40 34 46 46 46 Z';
const mhara = (t: string) =>
  wrap(
    t,
    tube(lyre, '#4E3B2E', 5) +
      tube(mirrorX(lyre), '#4E3B2E', 5) +
      `<path d="${impEar}" fill="#C76B35" ${o()}/><path d="M18 32 C 21 36 24 38 27.5 39 C 25.5 34 22.5 31 18 32 Z" fill="${INK}"/>` +
      `<path d="${mirrorX(impEar)}" fill="#C76B35" ${o()}/><path d="${mirrorX('M18 32 C 21 36 24 38 27.5 39 C 25.5 34 22.5 31 18 32 Z')}" fill="${INK}"/>` +
      `<path d="M44 32 C 44 22 76 22 76 32 L 70 86 C 68 96 52 96 50 86 Z" fill="#CB7440" ${o()}/>` +
      `<path d="M56 28 L64 28 L62 72 L58 72 Z" fill="#9C5226"/>` +
      `<ellipse cx="51" cy="55" rx="7.5" ry="6.5" fill="#FFF4E8"/><ellipse cx="69" cy="55" rx="7.5" ry="6.5" fill="#FFF4E8"/>` +
      eye(51, 55, 4) +
      eye(69, 55, 4) +
      `<ellipse cx="60" cy="88" rx="10" ry="7" fill="#FFF4E8" ${o(3)}/>` +
      `<path d="M57 85.5 L63 85.5 L60 89.5 Z" fill="${INK}"/>`,
  );

/* ───────────────────────── Dindingwe · Cheetah ───────────────────────── */
const spots: [number, number][] = [
  [48, 40], [56, 35], [64, 35], [72, 40], [60, 43], [41, 51], [36, 62], [79, 51],
  [84, 62], [40, 74], [80, 74], [52, 46], [68, 46], [46, 34], [74, 34],
];
const dindingwe = (t: string) =>
  wrap(
    t,
    `<circle cx="37" cy="33" r="9" fill="#EDBB4F" ${o()}/><circle cx="37" cy="34" r="4" fill="${INK}"/>` +
      `<circle cx="83" cy="33" r="9" fill="#EDBB4F" ${o()}/><circle cx="83" cy="34" r="4" fill="${INK}"/>` +
      `<ellipse cx="60" cy="62" rx="33" ry="30" fill="#EDBB4F" ${o()}/>` +
      spots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${INK}"/>`).join('') +
      `<ellipse cx="60" cy="79" rx="15" ry="10" fill="#FFF6E0"/>` +
      line('M49 62 C 46 70 47 77 52 83', 4) +
      line('M71 62 C 74 70 73 77 68 83', 4) +
      `<path d="M55 72 L65 72 L60 77 Z" fill="#3A2A22" ${o(2.5)}/>` +
      line('M60 77 V81 M60 81 Q56 85 53 83 M60 81 Q64 85 67 83', 2.5) +
      eye(50, 57, 4.5) +
      eye(70, 57, 4.5),
  );

/* ───────────────────────── Hungwe · Fish eagle ───────────────────────── */
const shoulders = 'M14 124 C 16 90 34 74 60 74 C 86 74 104 90 106 124 Z';
const hungwe = (t: string) =>
  wrap(
    t,
    `<path d="${shoulders}" fill="#7A4A2E" ${o()}/>` +
      `<path d="M40 124 C 42 94 50 82 60 82 C 70 82 78 94 80 124 Z" fill="#fff" ${o()}/>` +
      `<circle cx="60" cy="47" r="28" fill="#fff" ${o()}/>` +
      eye(49, 45, 4.6) +
      eye(71, 45, 4.6) +
      line('M43 37 Q49 34 55 37 M65 37 Q71 34 77 37', 3) +
      `<path d="M51 52 L69 52 L68 60 L52 60 Z" fill="#F4B942" ${o(3)}/>` +
      `<path d="M52.5 60 L67.5 60 C 67.5 71 63.5 78 60 83 C 56.5 78 52.5 71 52.5 60 Z" fill="#F4B942" ${o(3)}/>` +
      `<path d="M56.6 72 L63.4 72 C 62.6 77 61.2 80.5 60 83 C 58.8 80.5 57.4 77 56.6 72 Z" fill="${INK}"/>`,
  );

/* ───────────────────────── Chapungu · Bateleur eagle ───────────────────────── */
const chapungu = (t: string) =>
  wrap(
    t,
    `<path d="${shoulders}" fill="#2E2E36" ${o()}/>` +
      `<path d="M22 112 C 26 96 36 88 44 86 L 40 112 Z" fill="#A0522D"/>` +
      `<path d="${mirrorX('M22 112 C 26 96 36 88 44 86 L 40 112 Z')}" fill="#A0522D"/>` +
      merge([
        ['circle', 'cx="60" cy="48" r="27"', '#2E2E36'],
        ['circle', 'cx="44" cy="26" r="9"', '#2E2E36'],
        ['circle', 'cx="60" cy="20" r="10"', '#2E2E36'],
        ['circle', 'cx="76" cy="26" r="9"', '#2E2E36'],
      ]) +
      `<ellipse cx="60" cy="55" rx="16" ry="13" fill="#E0473B" ${o(3)}/>` +
      eye(53, 51, 4) +
      eye(67, 51, 4) +
      `<path d="M55 59 L65 59 C 65 68 62 74 60 77 C 58 74 55 68 55 59 Z" fill="#F2B33D" ${o(3)}/>` +
      `<path d="M57.8 69 L62.2 69 C 61.6 72.5 60.6 75 60 77 C 59.4 75 58.4 72.5 57.8 69 Z" fill="${INK}"/>`,
  );

/* ───────────────────────── Ngwena · Crocodile ───────────────────────── */
const ngwena = (t: string) =>
  wrap(
    t,
    `<path d="M-6 72 C 8 54 26 44 44 44 L 46 94 C 28 94 8 90 -6 86 Z" fill="#4F8A3E" ${o()}/>` +
      line('M4 62 L9 55 L14 59 L19 51 L24 55 L29 47', 3) +
      `<path d="M34 76 L 104 72 C 110 72 111 80 104 82 C 80 88 56 90 38 88 Z" fill="#A9CF7E" ${o()}/>` +
      `<path d="M28 50 C 40 41 56 43 70 47 L 108 56 C 115 58 115 67 108 68 L 32 72 Z" fill="#6BAA55" ${o()}/>` +
      `<path d="M44 71.5 L48 77 L52 71.2 L56 76.7 L60 70.8 L64 76.2 L68 70.4 L72 75.8 L76 70 L80 75.3 L84 69.6 L88 74.8 L92 69.2 L96 74.2 L100 68.8 Z" fill="#fff" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` +
      `<circle cx="60" cy="53" r="2.4" fill="#4F8A3E"/><circle cx="74" cy="56" r="2.4" fill="#4F8A3E"/><circle cx="87" cy="59" r="2.4" fill="#4F8A3E"/><circle cx="67" cy="61" r="2.4" fill="#4F8A3E"/>` +
      `<circle cx="102" cy="55" r="5.5" fill="#6BAA55" ${o()}/><circle cx="103" cy="54" r="1.6" fill="${INK}"/>` +
      `<circle cx="44" cy="44" r="11" fill="#6BAA55" ${o()}/>` +
      `<circle cx="44" cy="43" r="6.5" fill="#F4D03F" ${o(2)}/><ellipse cx="44" cy="43" rx="1.7" ry="5" fill="${INK}"/>`,
  );

/* ───────────────────────── Nyoka · Snake ───────────────────────── */
const coil =
  'M18 98 C 44 110 94 106 98 84 C 102 62 72 54 55 61 C 40 68 44 86 60 86 C 74 86 77 70 71 58 C 66 47 70 36 80 32';
const nyoka = (t: string) =>
  wrap(
    t,
    `<path d="${coil}" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>` +
      `<path d="${coil}" fill="none" stroke="#4FAF5A" stroke-width="12" stroke-linecap="round"/>` +
      `<path d="${coil}" fill="none" stroke="#2E7D3A" stroke-width="4" stroke-linecap="round" stroke-dasharray="3 9"/>` +
      line('M98 31 L107 32 L111 28 M107 32 L111 36', 2.8, '#E0473B') +
      `<ellipse cx="87" cy="30" rx="13" ry="10" transform="rotate(-10 87 30)" fill="#4FAF5A" ${o()}/>` +
      eye(84, 27, 3.4) +
      eye(94, 26, 3.4),
  );

/* ───────────────────────── Huku · Chicken (rooster) ───────────────────────── */
const huku = (t: string) =>
  wrap(
    t,
    line('M52 98 V112 M68 98 V112 M47 112 H57 M63 112 H73', 4, '#E8902A') +
      merge([
        ['path', 'd="M86 74 C 100 60 104 44 98 34 C 106 46 108 64 96 82 Z"', '#2F7D6E'],
        ['path', 'd="M88 78 C 104 70 110 56 108 46 C 114 60 110 76 98 86 Z"', '#E0473B'],
      ]) +
      merge([
        ['circle', 'cx="51" cy="26" r="6.5"', '#E0473B'],
        ['circle', 'cx="60" cy="21" r="7.5"', '#E0473B'],
        ['circle', 'cx="69" cy="26" r="6.5"', '#E0473B'],
      ]) +
      `<path d="M30 70 C 30 46 44 32 60 32 C 78 32 92 46 92 68 C 92 90 78 100 60 100 C 42 100 30 90 30 70 Z" fill="#fff" ${o()}/>` +
      line('M35 72 C 40 82 47 86 52 85 M85 72 C 80 82 73 86 68 85', 3) +
      `<path d="M57 67 C 55 77 65 77 63 67 Z" fill="#E0473B" ${o(2.5)}/>` +
      `<path d="M53 57 L67 57 L60 68 Z" fill="#F29A2E" ${o(3)}/>` +
      eye(51, 49, 4) +
      eye(69, 49, 4),
  );

/* ───────────────────────── Hanga · Guinea fowl ───────────────────────── */
const dots: [number, number][] = [];
for (let y = 66; y <= 112; y += 8) {
  for (let x = 24; x <= 96; x += 9) {
    const ox = ((y - 66) / 8) % 2 ? 4.5 : 0;
    dots.push([x + ox, y]);
  }
}
const hanga = (t: string) =>
  wrap(
    t,
    `<ellipse cx="60" cy="94" rx="46" ry="30" fill="#3E4A66" ${o()}/>` +
      dots
        .filter(([x, y]) => ((x - 60) / 43) ** 2 + ((y - 94) / 27) ** 2 < 0.92)
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#fff"/>`)
        .join('') +
      `<path d="M51 76 L52 54 L68 54 L69 76 Z" fill="#5C7FB8" ${o()}/>` +
      `<path d="M52 30 L60 8 L68 30 Z" fill="#C98A3E" ${o(3)}/>` +
      `<circle cx="60" cy="43" r="19" fill="#9CCBEB" ${o()}/>` +
      `<ellipse cx="51" cy="63" rx="4.2" ry="6.5" fill="#E0473B" ${o(2.2)}/>` +
      `<ellipse cx="69" cy="63" rx="4.2" ry="6.5" fill="#E0473B" ${o(2.2)}/>` +
      `<path d="M54 49 L66 49 L60 60 Z" fill="#F2D07A" ${o(2.5)}/>` +
      eye(52, 40, 4) +
      eye(68, 40, 4),
  );

/* ───────────────────────── Dziva · Pool (with hippo) ───────────────────────── */
const dziva = (t: string) =>
  wrap(
    t,
    merge([
      ['circle', 'cx="39" cy="33" r="7"', '#9C8AA0'],
      ['circle', 'cx="81" cy="33" r="7"', '#9C8AA0'],
      ['ellipse', 'cx="60" cy="58" rx="30" ry="22"', '#9C8AA0'],
      ['circle', 'cx="47" cy="40" r="9.5"', '#9C8AA0'],
      ['circle', 'cx="73" cy="40" r="9.5"', '#9C8AA0'],
      ['ellipse', 'cx="60" cy="66" rx="33" ry="15"', '#9C8AA0'],
    ]) +
      `<circle cx="39" cy="33" r="3" fill="#E9B9C0"/><circle cx="81" cy="33" r="3" fill="#E9B9C0"/>` +
      eye(47, 40, 4) +
      eye(73, 40, 4) +
      `<ellipse cx="49" cy="60" rx="3" ry="4" fill="${INK}"/><ellipse cx="71" cy="60" rx="3" ry="4" fill="${INK}"/>` +
      `<path d="M-4 72 C 12 66 28 78 44 72 C 60 66 76 78 92 72 C 104 67 114 74 124 72 L124 124 L-4 124 Z" fill="#4C9FD0" ${o()}/>` +
      line('M24 86 C 40 92 80 92 96 86', 3, '#BFE3F7') +
      line('M36 98 C 50 102 70 102 84 98', 3, '#BFE3F7') +
      `<path d="M14 104 C 14 96 34 96 34 104 C 34 110 14 110 14 104 Z M24 104 L34 101 L34 105 Z" fill="#5DAE58" ${o(3)}/>` +
      `<g ${o(2.5)}><ellipse cx="96" cy="102" rx="4" ry="8" fill="#F4A6C0"/><ellipse cx="96" cy="102" rx="4" ry="8" transform="rotate(50 96 106)" fill="#F4A6C0"/><ellipse cx="96" cy="102" rx="4" ry="8" transform="rotate(-50 96 106)" fill="#F4A6C0"/></g>` +
      `<circle cx="96" cy="104" r="3" fill="#F4D03F"/>`,
  );


/* ───────────────────────── Python ───────────────────────── */
const pyCoil = 'M60 100 C 28 100 22 64 48 56 C 72 48 90 62 86 80 C 82 96 58 96 55 84 C 52 74 63 68 71 72 C 79 60 70 50 76 42';
const python = (t: string) =>
  wrap(
    t,
    `<path d="${pyCoil}" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>` +
      `<path d="${pyCoil}" fill="none" stroke="#A47B47" stroke-width="14" stroke-linecap="round"/>` +
      `<path d="${pyCoil}" fill="none" stroke="#5A3F22" stroke-width="8" stroke-linecap="round" stroke-dasharray="7 9"/>` +
      `<ellipse cx="80" cy="34" rx="15" ry="11" transform="rotate(-20 80 34)" fill="#A47B47" ${o()}/>` +
      `<path d="M70 30 L82 26 L92 30" fill="none" stroke="#5A3F22" stroke-width="3" stroke-linecap="round"/>` +
      eye(76, 31, 3.2) +
      eye(87, 28, 3.2),
  );

/* ───────────────────────── Fish ───────────────────────── */
const fish = (t: string) =>
  wrap(
    t,
    `<path d="M92 60 L113 40 L110 80 Z" fill="#3F7FB5" ${o()}/>` +
      `<path d="M44 42 C 54 24 76 24 86 44 Z" fill="#3F7FB5" ${o()}/>` +
      `<path d="M56 78 C 60 92 72 94 78 80 Z" fill="#3F7FB5" ${o()}/>` +
      `<ellipse cx="60" cy="60" rx="38" ry="23" fill="#7DB4DD" ${o()}/>` +
      `<path d="M24 64 C 40 80 80 82 96 64 C 80 74 40 74 24 64 Z" fill="#D3E9F7"/>` +
      line('M58 46 C 62 52 62 58 58 64 M70 46 C 74 52 74 58 70 64 M82 50 C 85 54 85 60 82 64', 2.5, '#4F8FC4') +
      line('M40 46 C 46 54 46 66 40 74', 3) +
      line('M24 62 L30 63', 3) +
      eye(33, 55, 4.6),
  );

/* ───────────────────────── Warthog ───────────────────────── */
const hogEar = 'M36 42 L16 28 L28 56 Z';
const hogTusk = 'M43 86 C 31 82 26 70 29 60 C 33 70 38 76 47 79 Z';
const warthog = (t: string) =>
  wrap(
    t,
    `<path d="${hogEar}" fill="#7A7473" ${o()}/><path d="${mirrorX(hogEar)}" fill="#7A7473" ${o()}/>` +
      `<path d="M48 30 C 50 12 70 12 72 30 Z" fill="#5E4B3C" ${o()}/>` +
      `<path d="M30 50 C 30 28 90 28 90 50 L 85 82 C 81 95 39 95 35 82 Z" fill="#8F8988" ${o()}/>` +
      `<circle cx="37" cy="66" r="5" fill="#8F8988" ${o(3)}/><circle cx="83" cy="66" r="5" fill="#8F8988" ${o(3)}/>` +
      `<path d="${hogTusk}" fill="#FFF7E2" ${o(3)}/><path d="${mirrorX(hogTusk)}" fill="#FFF7E2" ${o(3)}/>` +
      `<ellipse cx="60" cy="86" rx="21" ry="14" fill="#C4B4AE" ${o()}/>` +
      `<ellipse cx="52" cy="86" rx="3.5" ry="4.5" fill="${INK}"/><ellipse cx="68" cy="86" rx="3.5" ry="4.5" fill="${INK}"/>` +
      eye(48, 56, 4.5) +
      eye(72, 56, 4.5),
  );

/* ───────────────────────── Porcupine ───────────────────────── */
const quills = Array.from({ length: 15 }, (_, i) => {
  const a = Math.PI * (1.08 + (i / 14) * 0.84);
  const x1 = 60 + Math.cos(a) * 16, y1 = 80 + Math.sin(a) * 16;
  const x2 = 60 + Math.cos(a) * 56, y2 = 80 + Math.sin(a) * 56;
  const d = `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`;
  return line(d, 8) + line(d, 3.5, i % 2 ? '#FFFFFF' : '#5A5552');
}).join('');
const porcupine = (t: string) =>
  wrap(
    t,
    quills +
      `<circle cx="44" cy="66" r="6" fill="#6B4F3A" ${o()}/><circle cx="76" cy="66" r="6" fill="#6B4F3A" ${o()}/>` +
      `<ellipse cx="60" cy="80" rx="21" ry="18" fill="#7A5B43" ${o()}/>` +
      `<ellipse cx="60" cy="90" rx="10" ry="7" fill="#A3836A"/>` +
      `<ellipse cx="60" cy="87" rx="3.6" ry="2.6" fill="${INK}"/>` +
      eye(51, 76, 3.8) +
      eye(69, 76, 3.8),
  );

/* ───────────────────────── Mouse ───────────────────────── */
const mouse = (t: string) =>
  wrap(
    t,
    line('M80 96 C 98 104 108 90 102 76', 4, '#E3A2A9') +
      `<circle cx="35" cy="42" r="17" fill="#A7B0BA" ${o()}/><circle cx="35" cy="42" r="9.5" fill="#F2C6CF"/>` +
      `<circle cx="85" cy="42" r="17" fill="#A7B0BA" ${o()}/><circle cx="85" cy="42" r="9.5" fill="#F2C6CF"/>` +
      `<path d="M34 62 C 34 44 86 44 86 62 C 86 76 70 92 60 94 C 50 92 34 76 34 62 Z" fill="#BCC4CC" ${o()}/>` +
      line('M50 84 L30 80 M50 87 L32 90 M70 84 L90 80 M70 87 L88 90', 2) +
      `<circle cx="60" cy="88" r="5" fill="#E58A97" ${o(2.5)}/>` +
      eye(51, 66, 4.5) +
      eye(69, 66, 4.5),
  );

/* ───────────────────────── Bird (species not specified) ───────────────────────── */
const bird = (t: string) =>
  wrap(
    t,
    line('M14 94 L106 94', 6, '#7A5A3A') +
      line('M54 86 L52 94 M64 86 L64 94', 3.5, '#E8902A') +
      `<path d="M28 70 L8 80 L22 60 Z" fill="#8C5E36" ${o()}/>` +
      `<ellipse cx="54" cy="68" rx="30" ry="21" fill="#B07A4A" ${o()}/>` +
      `<path d="M30 74 C 44 90 70 90 82 72 C 66 80 44 80 30 74 Z" fill="#F2D7B0"/>` +
      `<path d="M38 60 C 50 52 66 58 68 70 C 56 74 44 70 38 60 Z" fill="#8C5E36" ${o(3)}/>` +
      `<circle cx="80" cy="46" r="16" fill="#B07A4A" ${o()}/>` +
      `<path d="M94 44 L108 48 L94 53 Z" fill="#F2B33D" ${o(3)}/>` +
      eye(84, 43, 3.8),
  );

/* ───────────────────────── Flying termite (ishwa) ───────────────────────── */
const wing = (rot: number, cx: number) =>
  `<ellipse cx="${cx}" cy="56" rx="8" ry="30" transform="rotate(${rot} 60 52)" fill="#EAF4FA" fill-opacity="0.92" ${o(2.5)}/>` +
  line(`M60 52 L${cx} 82`, 1.5, '#9CB7C8');
const termite = (t: string) =>
  wrap(
    t,
    `<g transform="translate(60 62) scale(1.3) translate(-60 -62)">` +
      wing(-58, 60) + wing(-28, 60) + wing(28, 60) + wing(58, 60) +
      line('M56 34 C 50 24 44 20 38 20 M64 34 C 70 24 76 20 82 20', 2.5) +
      `<ellipse cx="60" cy="80" rx="10" ry="22" fill="#9C7140" ${o()}/>` +
      line('M51 74 H69 M51 82 H69 M52 90 H68', 2, '#6B4A2B') +
      `<ellipse cx="60" cy="54" rx="9" ry="8" fill="#7E5A33" ${o()}/>` +
      `<circle cx="60" cy="40" r="9" fill="#6B4A2B" ${o()}/>` +
      eye(56, 39, 2.4) +
      eye(64, 39, 2.4) +
      `</g>`,
  );

/* ───────────────────────── Leopard ───────────────────────── */
const rosettes: [number, number][] = [
  [46, 40], [60, 35], [74, 40], [38, 54], [82, 54], [36, 70], [84, 70], [52, 46], [68, 46], [44, 82], [76, 82],
];
const leopard = (t: string) =>
  wrap(
    t,
    `<circle cx="36" cy="34" r="10" fill="#E2A43A" ${o()}/><circle cx="36" cy="35" r="4.5" fill="${INK}"/>` +
      `<circle cx="84" cy="34" r="10" fill="#E2A43A" ${o()}/><circle cx="84" cy="35" r="4.5" fill="${INK}"/>` +
      `<ellipse cx="60" cy="62" rx="34" ry="31" fill="#E8AE45" ${o()}/>` +
      rosettes.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#B87A22" stroke="${INK}" stroke-width="2.2"/>`).join('') +
      `<ellipse cx="60" cy="80" rx="15" ry="11" fill="#FFF6E0"/>` +
      `<path d="M55 73 L65 73 L60 78 Z" fill="#C9665A" ${o(2.5)}/>` +
      line('M60 78 V82 M60 82 Q56 86 53 84 M60 82 Q64 86 67 84', 2.5) +
      eye(49, 59, 4.6) +
      eye(71, 59, 4.6),
  );

/* ───────────────────────── African wild cat ───────────────────────── */
const catEar = 'M34 50 L30 14 L54 34 Z';
const catEye = (x: number) =>
  `<ellipse cx="${x}" cy="62" rx="6.5" ry="6" fill="#C9D86A" ${o(2.5)}/><ellipse cx="${x}" cy="62" rx="1.8" ry="5" fill="${INK}"/>`;
const wildcat = (t: string) =>
  wrap(
    t,
    `<path d="${catEar}" fill="#BFAE90" ${o()}/><path d="M36 42 L34 22 L48 34 Z" fill="#E7B9B0"/>` +
      `<path d="${mirrorX(catEar)}" fill="#BFAE90" ${o()}/><path d="${mirrorX('M36 42 L34 22 L48 34 Z')}" fill="#E7B9B0"/>` +
      `<ellipse cx="60" cy="66" rx="32" ry="28" fill="#CDBC9E" ${o()}/>` +
      line('M54 40 L55 50 M60 39 V50 M66 40 L65 50', 3, '#7A6A55') +
      line('M30 62 L40 64 M30 72 L40 71 M90 62 L80 64 M90 72 L80 71', 3, '#7A6A55') +
      `<ellipse cx="60" cy="82" rx="13" ry="9" fill="#F3E9D8"/>` +
      `<path d="M56 76 L64 76 L60 80 Z" fill="#C9665A" ${o(2.2)}/>` +
      line('M60 80 V83 M60 83 Q56 87 53 85 M60 83 Q64 87 67 85', 2.4) +
      catEye(49) +
      catEye(71),
  );

/* ───────────────────────── Tortoise ───────────────────────── */
const tortoise = (t: string) =>
  wrap(
    t,
    `<ellipse cx="38" cy="88" rx="8" ry="10" fill="#9AA36B" ${o()}/><ellipse cx="84" cy="88" rx="8" ry="10" fill="#9AA36B" ${o()}/>` +
      `<ellipse cx="22" cy="72" rx="14" ry="10" fill="#9AA36B" ${o()}/>` +
      eye(18, 69, 3.4) +
      `<path d="M28 80 C 28 38 98 38 98 80 Z" fill="#B3843A" ${o()}/>` +
      `<path d="M28 80 L98 80 L96 86 L30 86 Z" fill="#8A6528" ${o(3)}/>` +
      line('M50 46 L46 62 L56 72 L72 72 L80 62 L76 46 M46 62 L32 66 M80 62 L94 66 M56 72 L54 80 M72 72 L74 80 M50 46 L63 42 L76 46', 2.8, '#6B4A1F'),
  );

/* ───────────────────────── Heart (symbol) ───────────────────────── */
const heart = (t: string) =>
  wrap(
    t,
    `<path d="M60 98 C 30 78 18 62 20 46 C 22 30 40 24 52 31 C 56 33 58 37 60 41 C 62 37 64 33 68 31 C 80 24 98 30 100 46 C 102 62 90 78 60 98 Z" fill="#E0473B" ${o()}/>` +
      `<ellipse cx="38" cy="46" rx="6" ry="9" transform="rotate(-30 38 46)" fill="#fff" fill-opacity="0.55"/>`,
  );

/* ───────────────────────── Leg (symbol) ───────────────────────── */
const leg = (t: string) =>
  wrap(
    t,
    `<g transform="rotate(-18 60 60)">` +
      `<path d="M42 22 C 42 8 78 8 78 22 C 78 36 71 46 69 56 C 67 66 69 78 71 88 L 49 88 C 51 78 53 66 51 56 C 49 46 42 36 42 22 Z" fill="#EFE6D8" ${o()}/>` +
      `<path d="M50 14 C 62 10 72 18 70 30 C 62 36 50 28 50 14 Z" fill="#A0522D"/>` +
      `<ellipse cx="60" cy="56" rx="10" ry="4" fill="#E0D2BE"/>` +
      `<path d="M46 88 L74 88 L79 105 L62 105 L60 96 L58 105 L41 105 Z" fill="#4A3F3A" ${o()}/>` +
      `</g>`,
  );

/* ───────────────────────── Fire (symbol) ───────────────────────── */
const fire = (t: string) =>
  wrap(
    t,
    tube('M30 104 L90 90', '#8A5A33', 9) +
      tube('M30 90 L90 104', '#7A4E2D', 9) +
      `<path d="M60 14 C 72 34 92 44 88 70 C 86 86 74 96 60 96 C 46 96 34 86 32 70 C 30 54 42 46 46 34 C 50 44 54 48 58 46 C 56 34 56 24 60 14 Z" fill="#F28C28" ${o()}/>` +
      `<path d="M60 46 C 66 58 76 64 74 76 C 72 86 66 90 60 90 C 54 90 47 86 46 76 C 45 66 52 62 54 54 C 56 60 58 62 60 60 C 59 56 58 52 60 46 Z" fill="#F7C948"/>`,
  );

/* ───────────────────────── Pool of water (symbol) ───────────────────────── */
const water = (t: string) =>
  wrap(
    t,
    `<path d="M-4 46 C 12 40 28 52 44 46 C 60 40 76 52 92 46 C 104 41 114 48 124 46 L124 124 L-4 124 Z" fill="#4C9FD0" ${o()}/>` +
      `<ellipse cx="60" cy="76" rx="30" ry="9" fill="none" stroke="#BFE3F7" stroke-width="3"/>` +
      `<ellipse cx="60" cy="76" rx="16" ry="4.5" fill="none" stroke="#BFE3F7" stroke-width="3"/>` +
      line('M16 98 C 30 104 46 104 58 98 M66 102 C 78 107 92 106 104 100', 3, '#BFE3F7') +
      `<path d="M20 62 C 20 54 40 54 40 62 C 40 68 20 68 20 62 Z M30 62 L40 59 L40 63 Z" fill="#5DAE58" ${o(3)}/>` +
      `<g ${o(2.5)}><ellipse cx="92" cy="58" rx="4" ry="8" fill="#F4A6C0"/><ellipse cx="92" cy="58" rx="4" ry="8" transform="rotate(50 92 62)" fill="#F4A6C0"/><ellipse cx="92" cy="58" rx="4" ry="8" transform="rotate(-50 92 62)" fill="#F4A6C0"/></g>` +
      `<circle cx="92" cy="60" r="3" fill="#F4D03F"/>`,
  );

/** Built-in illustrations, keyed by picture ID (see src/content/pictures.json). */
export const PICTURE_ART: Record<string, (tint: string) => string> = {
  lion: shumba,
  elephant: nzou,
  zebra: mbizi,
  monkey: shoko,
  baboon: gudo,
  sheep: gwai,
  goat: mbudzi,
  cattle: mombe,
  buffalo: nyati,
  eland: mhofu,
  impala: mhara,
  cheetah: dindingwe,
  'fish-eagle': hungwe,
  bateleur: chapungu,
  crocodile: ngwena,
  snake: nyoka,
  python,
  chicken: huku,
  'guinea-fowl': hanga,
  hippo: dziva,
  fish,
  warthog,
  porcupine,
  mouse,
  bird,
  termite,
  leopard,
  wildcat,
  tortoise,
  heart,
  leg,
  fire,
  water,
};

export function svgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
