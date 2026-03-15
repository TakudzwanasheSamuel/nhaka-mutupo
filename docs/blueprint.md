# **App Name**: Nhaka Mutupo

## Core Features:

- Card Game Board & Interaction: Displays the chosen grid size (4x4, 4x5, 6x6) with face-down cards, allowing players to flip cards.
- Match Logic & Scoring: Implements the core matching game mechanics, checks for card pairs, and updates the game score/progress.
- Local-First Game State: Manages and persists game state (e.g., current grid, flipped cards, score, matched pairs) using browser localStorage and React Context, following a 'Local-First' approach.
- Dynamic Card Configuration: Utilizes Fisher-Yates shuffle for randomized card placement and dynamically adjusts card layouts for specified grid sizes.
- Generative Nhetembo Modal: A generative AI tool provides dynamic 'Nhetembo' (Praise Poems) in a modal when a successful card pair is matched, enhancing cultural immersion.
- Responsive UI & Theming: Ensures a fully responsive interface adapting to mobile and larger screens, featuring scalable SVG animal totems and a deep Savanna/Earth-tone visual theme.
- Amapiano Audio Feedback: Incorporates Web Audio API to play Amapiano-style feedback sounds, like log drums for matched pairs, providing an engaging auditory experience.

## Style Guidelines:

- The overall theme is a light color scheme, reflecting natural light and an earthy aesthetic. The primary color is a deep, warm reddish-brown (#8C4E3A), chosen to evoke the richness of savanna soil and traditional crafts. The background is a very light, creamy off-white (#F7F3F0), which creates a clean, natural canvas without being stark white. A vibrant, sun-drenched golden yellow (#D4B61C) is used as an accent to highlight key interactions and add warmth, reminiscent of sunlight on the savanna.
- Headlines will use 'Alegreya', a humanist serif font, offering an elegant, intellectual feel fitting for the 'Mutupo' and 'Nhetembo' concepts. Body text will utilize 'PT Sans', a humanist sans-serif, ensuring modern readability and warmth for all in-game text and instructions.
- All animal totems will be represented by scalable SVG data URIs, utilizing simplified yet expressive designs that resonate with traditional African motifs, ensuring crisp display across all device sizes.
- The game implements responsive grid layouts, seamlessly adjusting for 4x4, 4x5, and 6x6 card configurations, ensuring an optimal and immersive playing experience across both mobile and desktop screens.
- Framer Motion will be used to create fluid and subtle animations, including graceful card flip effects, engaging transitions when pairs are matched, and smooth presentation of the Nhetembo modal.