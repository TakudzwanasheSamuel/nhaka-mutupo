# Nhaka Mutupo — Totem Match

**Nhaka Mutupo** (meaning *Heritage Totem*) is a Progressive Web Application that digitizes and preserves Zimbabwean cultural heritage through a gamified totem matching experience. Players flip cards to discover and match clan totems (*mitupo*), learning their praise poems (*nhetembo*) along the way.

## Features

- **Three Difficulty Levels** — The Cub (4×4), The Explorer (4×5), The Totem Master (6×6)
- **Weighted Scoring** — Starts at 500 points with bonuses for streaks, accuracy, and speed
- **Badge System** — Gold, Silver, Bronze tiers based on combined performance metrics
- **AI Praise Poems** — Matches trigger AI-generated *nhetembo* via Google Genkit
- **Glassmorphic UI** — Frosted-glass panels with backdrop blur throughout
- **Cultural Card Backs** — Great Zimbabwe chevron and basket-weave SVG patterns
- **Framer Motion Animations** — Spring hover/tap effects on cards with match confetti bursts
- **Typewriter Effect** — Praise poems revealed character-by-character in the match overlay
- **Full Audio System** — Landing loop, game loop with crossfade transition, SFX for clicks/matches/mismatches, global mute toggle persisted in localStorage
- **Full-Viewport Layout** — h-screen flex layout with zero wasted space, responsive mobile stats header
- **PWA Ready** — Installable with manifest, offline-capable asset strategy (inline SVG totems)
- **SCORM Compatible** — Score and completion data structured for LMS integration

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS, Framer Motion |
| AI | Google Genkit + Google Generative AI |
| State | React Context (GameContext, AudioContext) |
| Audio | Web Audio API + HTML5 Audio elements |
| Effects | canvas-confetti |
| Components | Radix UI primitives, shadcn/ui |
| Language | TypeScript 5 |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:9002](http://localhost:9002).

### AI Praise Poems (optional)

To enable AI-generated praise poems on match, start the Genkit dev server:

```bash
npm run genkit:dev
```

Requires a `GOOGLE_API_KEY` environment variable.

### Build

```bash
npm run build
npm start
```

### Type Check

```bash
npm run typecheck
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, providers, fonts, favicon
│   ├── page.tsx            # Landing screen + game board (single-page)
│   ├── globals.css         # Glassmorphism, card patterns, animations
│   └── icon.png            # Favicon (auto-detected by Next.js)
├── context/
│   ├── GameContext.tsx      # Game state, scoring, badge computation
│   └── AudioContext.tsx     # Centralized audio manager with loops + SFX
├── components/
│   ├── game/
│   │   ├── TotemCard.tsx    # Flip card with Framer Motion + confetti burst
│   │   └── MatchModal.tsx   # Glassmorphic overlay with typewriter nhetembo
│   └── layout/
│       └── Header.tsx       # Logo, difficulty select, mute toggle
├── constants/
│   └── totems.ts           # 19 totems with inline SVG data URIs + nhetembo
├── hooks/
│   ├── use-audio.ts        # Re-exports AudioContext hook
│   └── use-mobile.tsx      # Mobile breakpoint detection
└── ai/
    └── flows/
        └── generate-praise-poem-on-match.ts  # Genkit AI flow
public/
├── sounds/
│   ├── landing-sound.mp3
│   ├── game-sound-loop.mp3
│   ├── option-select.wav
│   ├── success-bell.wav
│   └── wrong-answer-fail-notification.wav
├── picture.png             # Hero logo on landing screen
├── app-logo.png            # Source logo (708×727)
├── favicon-32.png          # Browser tab icon
├── favicon-48.png          # High-DPI tab icon
├── icon-192.png            # PWA icon
├── icon-512.png            # PWA splash icon
└── manifest.json           # PWA manifest
```

## How the Game Works

1. Choose a difficulty on the landing screen and press **Start the Adventure**
2. Flip cards to reveal totems — match two of the same totem to score
3. **Match bonus:** +40 points + streak × 6 for consecutive matches
4. **Mismatch penalty:** −18 points, streak resets
5. **Time pressure:** −0.25 points per second
6. On completion, a final bonus is awarded for accuracy and speed
7. Badges are calculated from accuracy %, time, and move count vs difficulty thresholds

## Audio Map

| Event | Sound |
|---|---|
| Landing screen (after first click) | `landing-sound.mp3` (loop) |
| Game starts | Crossfade to `game-sound-loop.mp3` (loop) |
| Card flip | `option-select.wav` |
| Match found | `success-bell.wav` + confetti |
| Mismatch | `wrong-answer-fail-notification.wav` |
| Game complete | Loop stops + celebratory confetti |

## License

This project was developed  to showcase indigenous knowledge integration through modern technology.
