/**
 * Definitive collection of 20 African Totems (Mitupo) with high-contrast SVG
 * illustrations and cultural praise snippets (Nhetembo).
 *
 * SVGs are encoded as data-URIs so the app works fully offline.
 */

function svgDataUri(svgString: string): string {
  const encoded = encodeURIComponent(svgString.replace(/\s+/g, ' ').trim())
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

export interface Totem {
  id: string;
  name: string;
  animal: string;
  image: string;
  nhetembo: string;
}

export const TOTEMS: Totem[] = [
  {
    id: 'shoko',
    name: 'Shoko',
    animal: 'Monkey',
    nhetembo: 'Maita Mukanya, Soko yeMaringa.\nZvaonekwa Chirongo, mudyi wematunduru.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#8b5a2b"/><stop offset="1" stop-color="#c0843a"/></linearGradient></defs>
      <circle cx="64" cy="68" r="38" fill="url(#g)"/><circle cx="36" cy="70" r="18" fill="#d4a373"/><circle cx="92" cy="70" r="18" fill="#d4a373"/>
      <ellipse cx="64" cy="84" rx="28" ry="22" fill="#f7d9b4"/>
      <circle cx="52" cy="66" r="4.5" fill="#111827"/><circle cx="76" cy="66" r="4.5" fill="#111827"/>
      <path d="M54 90c6 8 14 8 20 0" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round"/>
      <path d="M64 74l6 6-6 6-6-6z" fill="#111827"/>
    </svg>`),
  },
  {
    id: 'shumba',
    name: 'Shumba',
    animal: 'Lion',
    nhetembo: 'Maita wekwaMhazi, Shumba yeChiroro.\nZvaonekwa vari munyika yeChidziwa.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <defs><radialGradient id="m" cx="40%" cy="35%"><stop offset="0" stop-color="#ffd166"/><stop offset="1" stop-color="#b45309"/></radialGradient></defs>
      <circle cx="64" cy="66" r="44" fill="url(#m)"/>
      <circle cx="64" cy="72" r="26" fill="#fde68a" stroke="#92400e" stroke-width="4"/>
      <circle cx="54" cy="70" r="4" fill="#111827"/><circle cx="74" cy="70" r="4" fill="#111827"/>
      <path d="M58 86c6 6 12 6 18 0" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round"/>
      <path d="M64 78l7 7-7 7-7-7z" fill="#111827"/>
      <path d="M30 48c10-20 22-30 34-30s24 10 34 30" fill="none" stroke="#7c2d12" stroke-width="10" stroke-linecap="round" opacity=".75"/>
    </svg>`),
  },
  {
    id: 'nzou',
    name: 'Nzou',
    animal: 'Elephant',
    nhetembo: 'Maita Samanyanga, Nzou inobva kumakore.\nZvaonekwa Mukonoweshuro, muzinda wehondo.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <defs><linearGradient id="e" x1="0" x2="1"><stop offset="0" stop-color="#94a3b8"/><stop offset="1" stop-color="#cbd5e1"/></linearGradient></defs>
      <rect x="26" y="38" width="76" height="54" rx="26" fill="url(#e)" stroke="#64748b" stroke-width="4"/>
      <ellipse cx="40" cy="68" rx="18" ry="16" fill="#94a3b8"/><ellipse cx="88" cy="68" rx="18" ry="16" fill="#94a3b8"/>
      <circle cx="52" cy="62" r="4" fill="#111827"/><circle cx="76" cy="62" r="4" fill="#111827"/>
      <path d="M78 76c0 22-12 30-20 30s-16-6-16-14 8-12 16-12c8 0 12-2 20-4z" fill="#64748b"/>
      <path d="M22 64c-12 0-18-8-18-18s8-22 24-22" fill="none" stroke="#94a3b8" stroke-width="10" stroke-linecap="round"/>
    </svg>`),
  },
  {
    id: 'mbizi',
    name: 'Mbizi',
    animal: 'Zebra',
    nhetembo: 'Maita Mazvimbakupa, Mbizi yapinda mumba.\nZvaonekwa vari kwaChihota, vane mavara anenge denga.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <rect x="28" y="28" width="72" height="72" rx="36" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4"/>
      <path d="M44 28l14 72M58 28l10 72M72 28l10 72M86 28l-14 72" stroke="#111827" stroke-width="6" stroke-linecap="round"/>
      <circle cx="54" cy="66" r="4" fill="#111827"/><circle cx="74" cy="66" r="4" fill="#111827"/>
      <path d="M58 84c6 6 12 6 18 0" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round"/>
    </svg>`),
  },
  {
    id: 'gwai',
    name: 'Gwai',
    animal: 'Sheep',
    nhetembo: 'Maita Gwai, wekwaMurambwi.\nZvaonekwa vari kumafuro, ane mvere inotonhorera mwoyo.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <circle cx="64" cy="68" r="40" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="4"/>
      <circle cx="64" cy="78" r="26" fill="#cbd5e1"/>
      <circle cx="54" cy="68" r="4" fill="#111827"/><circle cx="74" cy="68" r="4" fill="#111827"/>
      <path d="M58 86c6 6 12 6 18 0" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round"/>
      <circle cx="30" cy="68" r="14" fill="#f1f5f9"/><circle cx="98" cy="68" r="14" fill="#f1f5f9"/>
    </svg>`),
  },
  {
    id: 'hungwe',
    name: 'Hungwe',
    animal: 'Fish Eagle',
    nhetembo: 'Maita Hungwe, shiri yeZimbabwe.\nZvaonekwa vari mudenga, muoni wezvakavanzika.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <path d="M20 80c18-24 70-24 88 0" fill="#94a3b8"/><path d="M34 66c14-28 46-32 60 0" fill="#e2e8f0"/>
      <circle cx="58" cy="66" r="4" fill="#111827"/><circle cx="70" cy="66" r="4" fill="#111827"/>
      <path d="M64 72l10 6-10 6-10-6z" fill="#f59e0b"/>
      <path d="M18 84c14 14 30 22 46 22s32-8 46-22" fill="none" stroke="#64748b" stroke-width="8" stroke-linecap="round"/>
    </svg>`),
  },
  {
    id: 'ngwena',
    name: 'Ngwena',
    animal: 'Crocodile',
    nhetembo: 'Maita Ngwena, ishe weziva guru.\nZvaonekwa vari muZambezi, vane ganda risingabvumi mapfumo.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <path d="M20 74c18-22 72-26 92-6l-18 20c-26 16-50 12-74-14z" fill="#16a34a" stroke="#14532d" stroke-width="4"/>
      <circle cx="86" cy="68" r="4" fill="#0f172a"/><path d="M52 66l12 8 12-8" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
      <path d="M30 86l10-6 10 6 10-6 10 6" fill="none" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    </svg>`),
  },
  {
    id: 'nyati',
    name: 'Nyati',
    animal: 'Buffalo',
    nhetembo: 'Maita Nyati, wekwaChimbangu.\nZvaonekwa mhuka inotyisa, ine simba rinozura miti.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <circle cx="64" cy="74" r="40" fill="#1f2937"/>
      <path d="M40 52c-18-14-26-22-26-22" fill="none" stroke="#111827" stroke-width="10" stroke-linecap="round"/>
      <path d="M88 52c18-14 26-22 26-22" fill="none" stroke="#111827" stroke-width="10" stroke-linecap="round"/>
      <circle cx="54" cy="72" r="4" fill="#f9fafb"/><circle cx="74" cy="72" r="4" fill="#f9fafb"/>
      <path d="M58 90c6 6 12 6 18 0" fill="none" stroke="#f9fafb" stroke-width="5" stroke-linecap="round"/>
    </svg>`),
  },
  {
    id: 'mhofu',
    name: 'Mhofu',
    animal: 'Eland',
    nhetembo: 'Maita Mhofu yeDube, wekwaSeke.\nZvaonekwa mhuka huru isingadyiwi mumba.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <defs><linearGradient id="a" x1="0" x2="1"><stop offset="0" stop-color="#fb923c"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs>
      <circle cx="64" cy="74" r="40" fill="url(#a)"/>
      <path d="M52 44c-6-18-18-28-30-32" fill="none" stroke="#7c2d12" stroke-width="6" stroke-linecap="round"/>
      <path d="M76 44c6-18 18-28 30-32" fill="none" stroke="#7c2d12" stroke-width="6" stroke-linecap="round"/>
      <circle cx="54" cy="72" r="4" fill="#111827"/><circle cx="74" cy="72" r="4" fill="#111827"/>
      <path d="M58 90c6 6 12 6 18 0" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round"/>
    </svg>`),
  },
  {
    id: 'mhara',
    name: 'Mhara',
    animal: 'Impala',
    nhetembo: 'Maita Mhara, musvinuri wemakomo.\nZvaonekwa vari musango, vanosvetuka sechiedza.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <circle cx="64" cy="74" r="40" fill="#fb923c" stroke="#7c2d12" stroke-width="4" opacity=".95"/>
      <path d="M54 44c-10-22-20-34-34-40" fill="none" stroke="#7c2d12" stroke-width="6" stroke-linecap="round"/>
      <path d="M74 44c10-22 20-34 34-40" fill="none" stroke="#7c2d12" stroke-width="6" stroke-linecap="round"/>
      <circle cx="54" cy="72" r="4" fill="#111827"/><circle cx="74" cy="72" r="4" fill="#111827"/>
      <path d="M58 90c6 6 12 6 18 0" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round"/>
    </svg>`),
  },
  {
    id: 'mbudzi',
    name: 'Mbudzi',
    animal: 'Goat',
    nhetembo: 'Maita Mbudzi, wekwaGumbo.\nZvaonekwa vari pamakomo, vasingakanganwi nzira yekumusha.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <circle cx="64" cy="72" r="40" fill="#d6d3d1" stroke="#78716c" stroke-width="4"/>
      <path d="M46 50c-14-18-26-24-26-24" fill="none" stroke="#44403c" stroke-width="6" stroke-linecap="round"/>
      <path d="M82 50c14-18 26-24 26-24" fill="none" stroke="#44403c" stroke-width="6" stroke-linecap="round"/>
      <circle cx="54" cy="70" r="4" fill="#111827"/><circle cx="74" cy="70" r="4" fill="#111827"/>
      <path d="M58 88c6 6 12 6 18 0" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round"/>
      <path d="M50 96c10 10 18 10 28 0" fill="none" stroke="#44403c" stroke-width="6" stroke-linecap="round"/>
    </svg>`),
  },
  {
    id: 'dziva',
    name: 'Dziva',
    animal: 'Hippopotamus',
    nhetembo: 'Maita Dziva, chipanda chemvura.\nZvaonekwa muRwizi, mutumbi mukuru unofuridza mvura.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <rect x="26" y="46" width="76" height="52" rx="26" fill="#a3a3a3" stroke="#525252" stroke-width="4"/>
      <circle cx="54" cy="70" r="4" fill="#111827"/><circle cx="74" cy="70" r="4" fill="#111827"/>
      <path d="M46 92h36" stroke="#111827" stroke-width="8" stroke-linecap="round"/>
      <circle cx="46" cy="92" r="8" fill="#737373"/><circle cx="82" cy="92" r="8" fill="#737373"/>
      <path d="M26 74c-10 0-18-6-18-16s8-20 22-20" fill="none" stroke="#a3a3a3" stroke-width="10" stroke-linecap="round"/>
    </svg>`),
  },
  {
    id: 'dindingwe',
    name: 'Dindingwe',
    animal: 'Cheetah',
    nhetembo: 'Maita Dindingwe, mumhanyi wegomba.\nZvaonekwa mheni yepasi, inobata nemvura.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <circle cx="64" cy="72" r="40" fill="#fbbf24" stroke="#92400e" stroke-width="4"/>
      <circle cx="54" cy="70" r="4" fill="#111827"/><circle cx="74" cy="70" r="4" fill="#111827"/>
      <path d="M58 88c6 6 12 6 18 0" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round"/>
      <g fill="#111827">
        <circle cx="46" cy="58" r="2.2"/><circle cx="52" cy="54" r="2.2"/><circle cx="60" cy="52" r="2.2"/>
        <circle cx="82" cy="58" r="2.2"/><circle cx="76" cy="54" r="2.2"/><circle cx="68" cy="52" r="2.2"/>
        <circle cx="58" cy="66" r="2.2"/><circle cx="70" cy="66" r="2.2"/><circle cx="64" cy="60" r="2.2"/>
      </g>
    </svg>`),
  },
  {
    id: 'mhuka',
    name: 'Mhuka',
    animal: 'Wild Animal',
    nhetembo: 'Maita Mhuka, wekwaNhire.\nZvaonekwa vari musango guru, vasingatongwi nomunhu.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <rect x="26" y="34" width="76" height="76" rx="28" fill="#60a5fa" stroke="#1d4ed8" stroke-width="4"/>
      <path d="M44 86c10-18 30-18 40 0" fill="none" stroke="#0f172a" stroke-width="8" stroke-linecap="round"/>
      <circle cx="54" cy="66" r="4" fill="#0f172a"/><circle cx="74" cy="66" r="4" fill="#0f172a"/>
      <path d="M64 72l6 6-6 6-6-6z" fill="#0f172a"/>
    </svg>`),
  },
  {
    id: 'gudo',
    name: 'Gudo',
    animal: 'Baboon',
    nhetembo: 'Maita Gudo, wekwaBero.\nZvaonekwa vari mumatombo, vari kudya nzungu.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <circle cx="64" cy="70" r="40" fill="#a16207" stroke="#78350f" stroke-width="4"/>
      <ellipse cx="64" cy="82" rx="28" ry="22" fill="#fde68a" opacity=".95"/>
      <circle cx="54" cy="68" r="4" fill="#111827"/><circle cx="74" cy="68" r="4" fill="#111827"/>
      <path d="M56 92c6 6 10 6 16 0" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round"/>
      <path d="M40 62c-8 0-14 6-14 14" fill="none" stroke="#a16207" stroke-width="10" stroke-linecap="round" opacity=".7"/>
      <path d="M88 62c8 0 14 6 14 14" fill="none" stroke="#a16207" stroke-width="10" stroke-linecap="round" opacity=".7"/>
    </svg>`),
  },
  {
    id: 'mombe',
    name: 'Mombe',
    animal: 'Cattle',
    nhetembo: 'Maita Mombe, pfuma yemadzibaba.\nZvaonekwa vari kumafuro, chiremerera chemusha.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <rect x="30" y="44" width="68" height="60" rx="26" fill="#f5f5f4" stroke="#292524" stroke-width="4"/>
      <path d="M44 50c-12-10-18-16-18-16" fill="none" stroke="#292524" stroke-width="8" stroke-linecap="round"/>
      <path d="M84 50c12-10 18-16 18-16" fill="none" stroke="#292524" stroke-width="8" stroke-linecap="round"/>
      <circle cx="54" cy="72" r="4" fill="#111827"/><circle cx="74" cy="72" r="4" fill="#111827"/>
      <path d="M56 92c6 6 12 6 18 0" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round"/>
      <path d="M48 62h32" stroke="#ef4444" stroke-width="6" stroke-linecap="round" opacity=".5"/>
    </svg>`),
  },
  {
    id: 'huku',
    name: 'Huku',
    animal: 'Chicken',
    nhetembo: 'Maita Huku, wekwaMuseyamwa.\nZvaonekwa vari padare, vanozivisa kuti kwaedza.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <circle cx="64" cy="76" r="38" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4"/>
      <path d="M50 46c-6-10 0-18 10-18" fill="none" stroke="#ef4444" stroke-width="8" stroke-linecap="round"/>
      <circle cx="56" cy="70" r="4" fill="#111827"/><path d="M66 72l12 6-12 6z" fill="#f59e0b"/>
      <path d="M54 92c10 10 24 10 34 0" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round"/>
    </svg>`),
  },
  {
    id: 'nyoka',
    name: 'Nyoka',
    animal: 'Snake',
    nhetembo: 'Maita Nyoka, soko yeBero.\nZvaonekwa vari muuswa, ishe ane uturu unouraya.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <path d="M30 92c20-24 10-52 34-56 22-4 34 10 34 26 0 18-18 24-28 14" fill="none" stroke="#16a34a" stroke-width="12" stroke-linecap="round"/>
      <circle cx="96" cy="60" r="4" fill="#111827"/><path d="M94 64l10 4-10 4z" fill="#ef4444"/>
    </svg>`),
  },
  {
    id: 'gwayana',
    name: 'Gwayana',
    animal: 'Guinea Fowl',
    nhetembo: 'Maita Gwayana, shiri yemakwati.\nZvaonekwa vari musango, vane runako rusingaperi.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <circle cx="64" cy="74" r="40" fill="#111827"/>
      <g fill="#f8fafc" opacity=".9">
        <circle cx="50" cy="62" r="3"/><circle cx="60" cy="58" r="3"/><circle cx="70" cy="58" r="3"/><circle cx="78" cy="62" r="3"/>
        <circle cx="52" cy="74" r="3"/><circle cx="62" cy="70" r="3"/><circle cx="72" cy="70" r="3"/><circle cx="80" cy="74" r="3"/>
        <circle cx="58" cy="84" r="3"/><circle cx="70" cy="84" r="3"/>
      </g>
      <circle cx="54" cy="70" r="4" fill="#f8fafc"/><path d="M64 72l12 6-12 6z" fill="#f59e0b"/>
    </svg>`),
  },
  {
    id: 'chapungu',
    name: 'Chapungu',
    animal: 'Eagle',
    nhetembo: 'Maita Chapungu, chizuva chegore.\nZvaonekwa vari mudenga, muoni wezvakavanzika.',
    image: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <path d="M20 78c16-28 72-28 88 0" fill="#78350f"/>
      <path d="M32 66c12-24 52-24 64 0" fill="#fbbf24"/>
      <circle cx="56" cy="66" r="4" fill="#111827"/><circle cx="72" cy="66" r="4" fill="#111827"/>
      <path d="M64 72l8 5-8 5-8-5z" fill="#f59e0b"/>
      <path d="M16 82c16 16 32 22 48 22s32-6 48-22" fill="none" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
    </svg>`),
  },
];

export interface CardState {
  id: string;
  totemId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTIES: Record<Difficulty, { rows: number; cols: number; pairs: number }> = {
  easy:   { rows: 4, cols: 4, pairs: 8 },
  medium: { rows: 4, cols: 5, pairs: 10 },
  hard:   { rows: 6, cols: 6, pairs: 18 },
};

export function getGameDeck(difficulty: Difficulty): CardState[] {
  const { pairs } = DIFFICULTIES[difficulty];
  const selected = TOTEMS.slice(0, pairs);
  
  const cards: CardState[] = [];
  selected.forEach((totem) => {
    cards.push({ id: `${totem.id}-a`, totemId: totem.id, isFlipped: false, isMatched: false });
    cards.push({ id: `${totem.id}-b`, totemId: totem.id, isFlipped: false, isMatched: false });
  });

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}
