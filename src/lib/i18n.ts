/**
 * Every piece of text in the game lives here, in English and ChiShona.
 *
 * The ChiShona was drafted for the redesign and must be checked by a fluent
 * speaker before the game goes to schools. Keep sentences short: the youngest
 * players are still learning to read.
 *
 * Placeholders such as {n} are filled in by the `t` helper.
 */

export type Lang = 'en' | 'sn' | 'both';

export const STRINGS = {
  tagline: {
    en: 'Match the totems. Learn their praise poems.',
    sn: 'Batanidza mitupo. Dzidza nhetembo dzayo.',
  },
  chooseLanguage: { en: 'Choose your language', sn: 'Sarudza mutauro' },
  languageBoth: { en: 'Both', sn: 'Ese ari maviri' },
  language: { en: 'Language', sn: 'Mutauro' },

  chooseLevel: { en: 'Choose your level', sn: 'Sarudza danho' },
  'level.easy': { en: 'Little Cub', sn: 'Mwana weShumba' },
  'level.medium': { en: 'Explorer', sn: 'Muongorori' },
  'level.hard': { en: 'Totem Master', sn: 'Nyanzvi yeMitupo' },
  pairs: { en: '{n} pairs', sn: 'Mapeya {n}' },
  bestStars: { en: 'Best: {n} of 3 stars', sn: 'Zvakanyanya: nyeredzi {n} pa3' },

  howToPlay: { en: 'How to play', sn: 'Matambiro' },
  modePictures: { en: 'Picture and picture', sn: 'Mufananidzo nemufananidzo' },
  modeWords: { en: 'Picture and name', sn: 'Mufananidzo nezita' },
  wordsNotHard: {
    en: 'Name cards are for the first two levels.',
    sn: 'Makadhi emazita ndeemadanho maviri ekutanga.',
  },

  play: { en: 'Play', sn: 'Tamba' },
  totemBook: { en: 'Totem book', sn: 'Bhuku reMitupo' },
  foundCount: { en: '{n} of {total} found', sn: 'Wawana {n} pa{total}' },

  pairsFound: { en: 'Pairs found', sn: 'Mapeya awawana' },
  tapTwo: { en: 'Tap two cards to find a pair', sn: 'Dzvanya makadhi maviri uwane akafanana' },
  tryAgain: { en: 'Not a pair. Try again!', sn: 'Hazvina kufanana. Edza zvakare!' },
  goodMatch: { en: '{name}! Well done', sn: '{name}! Wakwanisa' },

  newTotem: { en: 'New totem!', sn: 'Mutupo mutsva!' },
  addedToBook: { en: 'Added to your totem book', sn: 'Wawedzerwa mubhuku rako' },
  keepPlaying: { en: 'Keep playing', sn: 'Ramba uchitamba' },
  praisePoem: { en: 'Praise poem', sn: 'Nhetembo' },
  whatItMeans: { en: 'What it means', sn: 'Zvazvinoreva' },

  menu: { en: 'Menu', sn: 'Menyu' },
  startAgain: { en: 'Start again', sn: 'Tanga patsva' },
  changeLevel: { en: 'Change level', sn: 'Chinja danho' },
  confirmRestartTitle: { en: 'Start again?', sn: 'Tanga patsva?' },
  confirmLeaveTitle: { en: 'Leave this game?', sn: 'Siya mutambo uyu?' },
  confirmBody: {
    en: 'The pairs you found in this game will be lost.',
    sn: 'Mapeya awawana mumutambo uyu acharasika.',
  },
  yesRestart: { en: 'Yes, start again', sn: 'Hongu, tanga patsva' },
  yesLeave: { en: 'Yes, leave', sn: 'Hongu, siya' },
  noKeepPlaying: { en: 'No, keep playing', sn: 'Kwete, ramba uchitamba' },

  soundOff: { en: 'Turn sound off', sn: 'Dzima inzwi' },
  soundOn: { en: 'Turn sound on', sn: 'Batidza inzwi' },

  wellDone: { en: 'Well done!', sn: 'Makorokoto!' },
  foundAllPairs: { en: 'You found all {n} pairs', sn: 'Wawana mapeya ose {n}' },
  starsLabel: { en: '{n} of 3 stars', sn: 'Nyeredzi {n} pa3' },
  tries: { en: 'Tries', sn: 'Kuedza' },
  time: { en: 'Time', sn: 'Nguva' },
  totemsThisGame: { en: 'Totems in this game', sn: 'Mitupo yemutambo uno' },
  playAgain: { en: 'Play again', sn: 'Tambazve' },

  back: { en: 'Back', sn: 'Dzokera' },
  close: { en: 'Close', sn: 'Vhara' },
  notFoundYet: { en: 'Not found yet', sn: 'Hausati wauwana' },
  bookIntro: {
    en: 'Every totem you match is kept here. Tap one to read its praise poem.',
    sn: 'Mutupo wose waunobatanidza unochengetwa pano. Dzvanya mumwe kuti uverenge nhetembo yawo.',
  },
  maitaTip: {
    en: '“Maita” means thank you. A praise poem thanks a family and remembers where it comes from. Families do not eat their totem animal.',
    sn: '“Maita” zvinoreva kuti ndatenda. Nhetembo inotenda mhuri uye inorangarira kwayakabva. Mhuri hadzidyi mhuka yemutupo wadzo.',
  },

  // Home
  quizTitle: { en: 'Totem quiz', sn: 'Mubvunzo wemitupo' },
  quizDesc: { en: 'Which animal is this totem?', sn: 'Imhuka ipi iri mutupo uyu?' },
  memoryTitle: { en: 'Memory match', sn: 'Tsvaga mapeya' },
  memoryDesc: { en: 'Turn cards and find the pairs', sn: 'Pidigura makadhi uwane mapeya' },
  learnTitle: { en: 'Learn the totems', sn: 'Dzidza mitupo' },
  learnDesc: { en: 'Pictures, names and praise poems', sn: 'Mifananidzo, mazita nenhetembo' },
  previewOn: {
    en: 'Preview: entries still waiting for review are showing on this device.',
    sn: 'Kuedza: mitupo isati yaongororwa iri kuratidzwa pamudziyo uyu.',
  },
  notEnough: {
    en: 'Our cultural reviewers are still checking the totems. Come back soon!',
    sn: 'Vaongorori vetsika vachiri kuongorora mitupo. Dzoka munguva pfupi!',
  },
  levelNeedsMore: { en: 'Needs {n} checked totems', sn: 'Inoda mitupo {n} yakaongororwa' },
  home: { en: 'Home', sn: 'Kumba' },

  // Quiz set-up
  whatToMatch: { en: 'What to match', sn: 'Zvekubatanidza' },
  catAnimal: { en: 'Totem and animal', sn: 'Mutupo nemhuka' },
  catSymbol: { en: 'Totem and symbol', sn: 'Mutupo nechiratidzo' },
  comingSoon: { en: 'Coming soon', sn: 'Zvichauya' },
  howHard: { en: 'How hard', sn: 'Kuoma kwazvo' },
  modeBeginner: { en: 'Beginner', sn: 'Mutangi' },
  modeBeginnerDesc: { en: 'Names under the pictures', sn: 'Mazita pasi pemifananidzo' },
  modeChallenge: { en: 'Challenge', sn: 'Dambudziko' },
  modeChallengeDesc: { en: 'Pictures only', sn: 'Mifananidzo chete' },
  scoringTitle: { en: 'How scoring works', sn: 'Mapihwiro emaraki' },
  scoringTries: { en: 'You have two tries for each question.', sn: 'Une mikana miviri pamubvunzo wega wega.' },
  scoringFirst: { en: 'Right on the first try: a first-try point.', sn: 'Kurira pakutanga: maraki ekutanga.' },
  scoringSecond: { en: 'Right on the second try: you learned it.', sn: 'Kurira pakechipiri: wazvidzidza.' },
  scoringShown: { en: 'Two misses: we show you the answer.', sn: 'Kukanganisa kaviri: tinokuratidza mhinduro.' },
  questionsCount: { en: '{n} questions', sn: 'Mibvunzo {n}' },
  startQuiz: { en: 'Start the quiz', sn: 'Tanga mubvunzo' },

  // Quiz play
  questionOf: { en: 'Question {n} of {total}', sn: 'Mubvunzo {n} pa{total}' },
  askAnimal: { en: 'Which animal represents this mutupo?', sn: 'Imhuka ipi inomiririra mutupo uyu?' },
  askSymbol: { en: 'Which symbol represents this mutupo?', sn: 'Ndechipi chiratidzo chinomiririra mutupo uyu?' },
  traditionOf: { en: 'In the {t} tradition', sn: 'Mutsika ye{t}' },
  correctFirst: { en: 'Correct! Well done.', sn: 'Ndizvo! Wakwanisa.' },
  correctSecond: { en: 'Correct on your second try!', sn: 'Ndizvo pakechipiri!' },
  tryOnceMore: { en: 'Not quite. Try once more.', sn: 'Kwete. Edza zvakare kamwe chete.' },
  answerWas: { en: 'Here is the answer.', sn: 'Hechino mhinduro.' },
  next: { en: 'Next', sn: 'Zvinotevera' },
  seeScore: { en: 'See my score', sn: 'Ona maraki angu' },
  listen: { en: 'Listen', sn: 'Teerera' },
  correctMark: { en: 'Correct answer', sn: 'Mhinduro yakarurama' },
  wrongMark: { en: 'Not this one', sn: 'Kwete ichi' },

  // Quiz results
  quizDone: { en: 'Quiz finished!', sn: 'Mubvunzo wapera!' },
  firstTry: { en: 'Right first time', sn: 'Zvakarurama pakutanga' },
  learned: { en: 'Learned on a retry', sn: 'Zvadzidzwa pakechipiri' },
  shown: { en: 'Answer shown', sn: 'Mhinduro yakaratidzwa' },
  scoreOf: { en: '{n} of {total}', sn: '{n} pa{total}' },
  changeQuiz: { en: 'Change quiz', sn: 'Chinja mubvunzo' },

  // Learn
  learnIntro: {
    en: 'Every checked totem is here. Tap one to read about it.',
    sn: 'Mitupo yose yakaongororwa iri pano. Dzvanya mumwe kuti uverenge nezvawo.',
  },
  search: { en: 'Search names', sn: 'Tsvaga mazita' },
  filterAll: { en: 'All', sn: 'Zvose' },
  filterAnimals: { en: 'Animals', sn: 'Mhuka' },
  filterSymbols: { en: 'Symbols', sn: 'Zviratidzo' },
  noResults: { en: 'No totems match that search.', sn: 'Hapana mutupo wakadaro.' },
  foundBadge: { en: 'Found', sn: 'Wawana' },
  praiseNames: { en: 'Praise names', sn: 'Zvidawo' },
  womenNames: { en: 'Women are greeted as', sn: 'Vakadzi vanokwaziswa se' },
  otherLanguages: { en: 'In other languages', sn: 'Mune mimwe mitauro' },
  otherNames: { en: 'Other names and spellings', sn: 'Mamwe mazita' },
  relatedTotems: { en: 'Related totems', sn: 'Mitupo yakabatana' },
  communitiesLabel: { en: 'Communities', sn: 'Nharaunda' },
  sourcesLabel: { en: 'Sources', sn: 'Zvinyorwa' },
  notChecked: { en: 'Not yet checked', sn: 'Hazvisati zvaongororwa' },
  beingChecked: { en: 'Still being checked by our reviewers', sn: 'Vaongorori vachiri kuzviongorora' },
  praiseNameOf: { en: 'A praise name of the {name} clan', sn: 'Chidawo chemutupo we{name}' },

  cardFaceDown: { en: 'Card {n}, face down', sn: 'Kadhi {n}, rakafukidzwa' },
  cardShows: { en: 'Card {n}, {name}', sn: 'Kadhi {n}, {name}' },
  cardMatched: { en: 'Card {n}, {name}, matched', sn: 'Kadhi {n}, {name}, rabatana' },
} as const;

export type StringKey = keyof typeof STRINGS;
export type Vars = Record<string, string | number>;

function fill(text: string, vars?: Vars) {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

export interface Translated {
  /** Shown large. */
  primary: string;
  /** Shown smaller underneath, only in the bilingual mode. */
  secondary?: string;
}

export function translate(lang: Lang, key: StringKey, vars?: Vars): Translated {
  const s = STRINGS[key];
  const en = fill(s.en, vars);
  const sn = fill(s.sn, vars);
  if (lang === 'en') return { primary: en };
  if (lang === 'sn') return { primary: sn };
  return { primary: sn, secondary: en };
}

/** Plain string for labels read by screen readers and for the page title. */
export function plain(lang: Lang, key: StringKey, vars?: Vars): string {
  const { primary, secondary } = translate(lang, key, vars);
  return secondary ? `${primary} (${secondary})` : primary;
}
