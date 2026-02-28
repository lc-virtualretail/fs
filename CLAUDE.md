# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fading Suns (4th Ed / Pax Alexius, 2023) RPG companion web app. UI in Spanish. Three core modules:

- **Character Creator/Manager** — create, edit, and store Fading Suns player characters (Life Path method)
- **Campaign Management** — tools for GMs to manage campaigns, NPCs, and world state (future)
- **Rules Engine** — implementation of Fading Suns VPS (Victory Point System) mechanics (future)

## Build & Dev Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # TypeScript check + Vite production build
npm run preview   # Preview production build
npx tsc --noEmit  # Type-check only
```

## Tech Stack

- **Build**: Vite 7 + TypeScript (strict mode)
- **Frontend**: React 19 + React Router v7
- **Storage**: Dexie.js (IndexedDB wrapper) — local-first, no backend
- **Styling**: CSS variables + inline styles (dark space-opera theme)
- **Path alias**: `@/` maps to `src/`

## Architecture

```
src/
├── types/           # TypeScript interfaces (character.ts, rules.ts)
├── data/            # Static game data from the rulebooks
│   ├── species.ts         # 4 species: Humano, Ur-obun, Ur-ukar, Vorox
│   ├── classes.ts         # 4 classes: Noble, Sacerdote, Mercader, Independiente
│   ├── factions.ts        # 20 factions (5 houses, 5 sects, 5 guilds, 5 societies)
│   ├── vocations.ts       # All vocations per class + 9 free vocations
│   ├── skills.ts          # 26 skills (3 restricted: Alquimia, Interfaz, Pilotar)
│   ├── characteristics.ts # 9 characteristics in 3 categories (Body/Mind/Spirit)
│   └── levelProgression.ts # Level 1-10 advancement table
├── engine/          # Game mechanics (derived stats, dice, combat)
│   └── derived.ts         # Vitality, Impulse, Reanimation, Bank capacity formulas
├── db/              # Dexie IndexedDB setup
├── hooks/           # React hooks for state management
├── components/ui/   # Shared UI primitives
├── pages/           # Route pages
│   ├── Home.tsx
│   ├── CharacterList.tsx
│   ├── CharacterCreator/  # 5-phase wizard (Narrative → Portrait → Mechanics → Evolution → Summary)
│   └── CharacterSheet/    # Interactive digital character sheet
└── styles/          # Global CSS variables and base styles
```

## Key Game Rules (for implementation reference)

- **Character creation**: 7-step Life Path method (see `instrucciones_creacion_ficha.md`)
- **Characteristics**: 9 stats (1-10 scale). Primary starts at 5, secondary at 4, rest at 3
- **Skills**: 26 skills, most start at 3. Restricted skills start at 0
- **Max at level 1**: No stat > 8. Level 2+: max 9. Level 10+: max 10
- **Vitality** = Size + Constitution + Willpower + Faith + Level
- **Impulse** = max(Strength, Intelligence, Presence) + Level
- **Reanimation** = Size + Level
- **VP Bank** = 5 + (floor(level/2) * 5)
- **Tecgnosis** = Level (always)
- **Excess rule**: If life path gives a stat > max, redistribute excess points

## Reference Material

- `DOC/Fading Suns - Libro PJ - Ebook.pdf` — **Authoritative source** for all rules
- `DOC/Fading Suns - Ficha.pdf` — Official character sheet layout
- `DOC/Fading Suns - Libro del Director - Ebook.pdf` — GM guide
- `DOC/Fading Suns - El Universo - Ebook.pdf` — Setting lore
- `instrucciones_creacion_ficha.md` — Detailed step-by-step character creation process
