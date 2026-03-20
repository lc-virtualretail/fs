# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fading Suns (4th Ed / Pax Alexius, 2023) RPG companion web app. **UI in Spanish.** Three core modules:

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

No test framework is configured yet.

## Tech Stack

- **Build**: Vite 7 + TypeScript (strict mode, `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`)
- **Frontend**: React 19 + React Router v7 (HashRouter for GitHub Pages compatibility)
- **Storage**: Dexie.js (IndexedDB wrapper) — local-first, no backend
- **Styling**: CSS variables in `global.css` + inline `<style>` blocks per component (no CSS modules, no CSS-in-JS library)
- **Path alias**: `@/` maps to `src/`

## Architecture

```
src/
├── types/           # TypeScript interfaces (character.ts, rules.ts)
├── data/            # Static game data arrays from rulebooks (species, classes, factions, vocations, skills, competencies, tooltips)
├── engine/          # Game mechanics — derived stats (Vitality, Impulse, Reanimation, VP Bank)
├── db/              # Dexie IndexedDB setup (single `characters` table)
├── hooks/           # React hooks for state management
├── components/ui/   # Shared UI primitives (Tooltip)
├── pages/
│   ├── CharacterCreator/  # 7-step wizard (see below)
│   └── CharacterSheet/    # Interactive digital character sheet
└── styles/          # Global CSS variables and base styles
```

### Character Creator Wizard (key architectural pattern)

The wizard is the most complex part of the app. Understanding it is essential.

**State model**: `CharacterCreator/index.tsx` holds a `CharacterDraft` (defined in `creatorTypes.ts`) via `useState`. This is a mutable accumulation of choices across 7 steps. Each step receives `{ draft, updateDraft, goNext, goBack }` as props.

**`CharacterDraft` vs `Character`**: The draft is the in-progress wizard state (includes tracking arrays for choices like `charChoices`, `skillChoices`, `pendingCompetencies`). At Step 7 (Summary), the draft is finalized into a `Character` and saved to IndexedDB.

**Steps flow** (linear, with backtracking):
1. **Narrative** — name, concept, background text fields
2. **Species** — pick species → set primary/secondary characteristics → initialize base values (primary=5, secondary=4, rest=3)
3. **Class** — apply education: fixed competencies, choice groups, characteristic/skill bonuses with **alternation** choices
4. **Faction** — apply faction learning (filtered by class): competencies, stat bonuses
5. **Vocation** — apply career path (filtered by class): competencies with slots, stats, benefits, equipment
6. **Customization** — optional affliction, free competency, extra benefit if afflicted
7. **Summary** — excess point redistribution (stats exceeding max), review, save

### Alternation System

Many stat bonuses in classes/factions/vocations offer alternation choices (e.g., +1 to Constitution OR Dexterity OR Strength). These are tracked per-step via `charChoices[index]` / `skillChoices[index]` arrays in the draft. The `alternativas` field on bonus definitions drives this UI.

### Competency Sub-Choice System

Competencies like "Saber Médico" or "Hablar (idioma a elegir)" require sub-selections. This is handled by unified utilities in `competencyUtils.ts`:
- `getSubChoice(comp)` — detects if a competency needs sub-selection (buttons or text input)
- `resolveWithSub(comp, sub)` — merges competency + sub-choice into final name
- `filterAvailableCompetencies(list, ...)` — applies restriction rules from `competencies.ts`

Competency restrictions are defined in `data/competencies.ts` as a map of competency name → allowed class/faction/vocation IDs.

### Data Layer

All game data files in `data/` export typed arrays (e.g., `SPECIES: SpeciesDefinition[]`). Type definitions live in `types/rules.ts`. Data is imported directly — no fetching or loading.

## Key Game Rules (for implementation reference)

- **Character creation**: 7-step Life Path method (see `instrucciones_creacion_ficha.md`)
- **Characteristics**: 9 stats (1-10 scale). Primary starts at 5, secondary at 4, rest at 3
- **Skills**: 26 skills, most start at 3. Restricted skills (Alquimia, Interfaz, Pilotar) start at 0
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
