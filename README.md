# Nhaka Mutupo: Totem Match

Nhaka Mutupo (heritage totem) is a memory card game for primary school children in Zimbabwe. Children turn over cards to find matching pairs of clan totems (mitupo), and each new totem they find opens its praise poem (nhetembo) and a short explanation of what it means. Every totem found is kept in a totem book they can come back to.

It is a Progressive Web App built mobile first, for the low-cost Android phones and shared tablets most schools use.

## What children can do

The home screen offers three activities: a totem quiz, a memory match and Learn the totems.

### Totem quiz

The game shows a totem name and asks "Which animal represents this mutupo?" with four large pictures to tap. Before play, a short card explains the scoring. Each question allows two tries. A right answer on the first try counts as a first-try answer, a right answer on the second try counts as learned, and two misses reveal the answer. Every answer shows the full pairing (for example "Mhofu · Eland") and a short explanation. Questions and answer positions are shuffled every round, a progress bar shows how far along the child is, and the results screen lists first-try answers separately from those learned after a retry, with a replay button.

Beginner mode prints the animal or symbol name under each picture. Challenge mode shows pictures only and reveals the names after the child answers. There are two categories, totem to animal and totem to symbol; the symbol category switches on automatically once enough symbol entries are verified.

### Learn the totems

Every verified totem with its picture, English name, praise names, names in other languages, communities, praise poem, explanation, sources and (once recorded) a listen button. It can be searched by any name, so Mukanya finds both the Mukanya entry and Soko.

### Memory match

1. Choose a language the first time the game opens: English, ChiShona or both together.
2. Choose a level: Little Cub (8 pairs), Explorer (10 pairs) or Totem Master (18 pairs).
3. Choose how to play: picture and picture, or picture and name (the name card shows the totem written out, so older children practise reading it). Name cards are offered on the first two levels.
4. Tap two cards. A pair stays face up with a green tick. Two different cards wobble gently and turn back.
5. The first time a totem is found, a sheet shows its picture, name, praise poem and meaning.
6. At the end the child earns one to three stars based on how many tries they needed. There is no countdown and no points taken away.

## Design system

| Role | Colour | Used for |
| --- | --- | --- |
| Paper | `#fff7ea` cream | Background |
| Ink | `#1f3a4d` blue-slate | All text (from the elephant's outline) |
| Action | `#0b7a78` teal | Buttons, selection, focus (from the wordmark) |
| Reward | `#f4b52a` gold | Stars and "new totem" only |
| Card back | `#c2563a` clay | Face-down cards, with a chevron band from the Great Zimbabwe walls |
| Success | `#23864b` leaf | Matched pairs |
| Gentle miss | `#ffe7b5` amber | "Try again" |

Type: Fredoka for headings, numbers and buttons; Andika for everything a child reads (it was designed for beginning readers). Both are self-hosted through `next/font`, so they work offline. Nothing in the game is smaller than 16px and every tap target is at least 52px.

All tokens live at the top of `src/app/globals.css`. Each component has its own CSS module next to it.

## Content and review

All totem content lives in data, not in game code:

- `src/content/totems.json`: every entry with its ID, name, kind (totem, praise name or clan name), associated names, communities, accepted answer pictures, pictures that must never be wrong answers, explanation, praise poem and its source, sources, research notes and verification status.
- `src/content/pictures.json`: every animal or symbol picture with its English and ChiShona name, category, description for screen readers and its own verification status.
- `src/content/sources.json`: every source used, with a note on how reliable it is.

These files are the built-in copy, which also works offline. The live copy is in Firebase and is edited by reviewers on the admin side. The game shows the built-in copy first and then layers verified live content on top.

While review is under way, the admin setting "Live game: play entries waiting for review" lets children play entries that are verified or waiting for review, with a small "still being checked" note on entries not yet verified. When it is switched off, only entries marked verified, whose picture is also verified, are used in scored play. Unresolved entries (for example Dziva, whose animal differs between clans) never enter scored play. Wrong answers are always pictures in the same category that are not accepted for that question, not marked as related, and not accepted for another totem that shares an answer (so a Soko or Mukanya question never shows the monkey and baboon together).

Run `npm run check:content` before publishing changes to the data files. It checks IDs, links between entries, pictures and sources, the brief's required pairings (Mhofu to eland, Mukanya to baboon) and the rules for verified entries.

The research behind the starting data is summarised in `docs/content-research.md`.

## Admin side (content review)

Open `/admin` on the live site. It is not linked from the game and is hidden from search engines.

- Anyone can create an account with email and password or Google. New accounts wait until an admin approves them.
- Reviewers can search and filter entries, see exactly how each one looks in the quiz, edit any field, add entries and pictures, change status, comment, record pronunciations in the browser and see the history of changes.
- Admins can also approve people, change roles, delete entries and import the starter data.
- A printable review sheet and a CSV download are available for reviewers who prefer to work on paper.
- "Preview on this device" lets a reviewer play with entries that are still waiting for review, on their own browser only.

Without Firebase settings the admin side still opens in read-only mode on the built-in data. Setup steps are in `docs/firebase-setup.md`.

## Totem art

All 33 illustrations are drawn in code (`src/constants/picture-art.ts`) to one set of rules: the same outline weight, the same eyes, flat colours and one feature that makes each animal easy to tell apart at small sizes. Each picture has its own background tint. They are stored as SVG data so they need no network. Reviewers can replace any drawing with an uploaded photo from the admin side.

## Languages

All interface text is in `src/lib/i18n.ts`, in English and ChiShona side by side. The ChiShona, the praise poems and the English meanings in `src/constants/totems.ts` should be checked by a fluent speaker before the game is used in schools.

## Project structure

```
src/
├── app/
│   ├── layout.tsx           Fonts, metadata, providers
│   ├── page.tsx             Renders <App />
│   └── globals.css          Design tokens and base styles
├── components/
│   ├── App.tsx              Screen switching and back-button handling
│   ├── kit/                 Shared pieces: bilingual text, buttons, icons, sheets, stars
│   ├── screens/             Language, Home, Quiz, Memory, Learn
│   ├── game/                Memory cards, board sizing, totem sheet, results
│   ├── content/             Entry picture and listen button
│   └── admin/               The private review side
├── content/                 totems.json, pictures.json, sources.json
├── constants/
│   ├── totems.ts            Memory game levels, deck building, stars
│   └── picture-art.ts       The illustrations
├── context/
│   ├── AppContext.tsx       Language, levels, quiz settings, progress (saved on the device)
│   ├── ContentContext.tsx   Built-in and live content, preview switch
│   ├── GameContext.tsx      The memory game in progress
│   └── AudioContext.tsx     Music and sound effects with a mute switch
└── lib/
    ├── content.ts           Content types and the rules for scored play
    ├── firebase/            Settings and every call to Firebase
    ├── i18n.ts              All text, English and ChiShona
    └── storage.ts           Safe local storage
scripts/check-content.mjs    Checks the data files
firestore.rules              Who can read and write what
public/
├── brand/                   Elephant mascot cut from the logo
└── sounds/                  Flip, match, miss and background music
```

## Getting started

```bash
npm install
npm run dev
```

Opens at http://localhost:9002.

```bash
npm run build && npm start   # production build
npm run typecheck            # TypeScript check
npm run check:content        # check the content data
```

## Optional AI praise poems

`src/ai/flows/generate-praise-poem-on-match.ts` (Google Genkit) is kept in the project but the game no longer calls it: the traditional nhetembo are shown instead, so the game works offline and the text children see can be checked. Start it with `npm run genkit:dev` and a `GOOGLE_API_KEY` if you want to bring it back.
