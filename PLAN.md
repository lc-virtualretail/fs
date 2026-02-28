# Fading Suns RPG Companion — Implementation Plan

## Overview

Build a Fading Suns (4th Ed / Pax Alexius, 2023) RPG companion web app with three modules: **Character Creator**, **Campaign Manager**, and **Rules Engine**. The MVP is the Character Creator using the Life Path method. UI in Spanish. Local-first storage. iPad/touch-friendly.

### Key reference files
- `DOC/Fading Suns - Libro PJ - Ebook.pdf` — Authoritative source for all rules
- `instrucciones_creacion_ficha.md` — Detailed step-by-step creation process (Level 1 starting characters)
- `DOC/Fading Suns - Ficha.pdf` — Official character sheet layout

### Current Status
- **M0 (Scaffolding)**: COMPLETE — Vite + React + Router + Dexie + base UI
- **M1 (Data Model)**: COMPLETE — All types and game data files
- **M2-M4**: PENDING (next milestones)

### Tech Stack
| Choice | Tool |
|--------|------|
| Build tool | Vite 7 |
| UI framework | React 19 + TypeScript (strict) |
| Routing | React Router v7 |
| Local storage | Dexie.js (IndexedDB) |
| Styling | CSS variables + inline styles (dark space-opera theme) |
| State (wizard) | React Context + useReducer |
| Path alias | `@/` → `src/` |

---

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
├── pages/
│   ├── Home.tsx
│   ├── CharacterList.tsx
│   ├── CharacterCreator/  # 5-phase wizard
│   └── CharacterSheet/    # Interactive digital character sheet
└── styles/          # Global CSS variables and base styles
```

---

## M2 — Character Creator Wizard (NEXT)

**Goal:** Step-by-step guided character creation following the Life Path method from the book.

### Wizard Structure (5 phases)

```
src/pages/CharacterCreator/
├── index.tsx                      # Wizard container with stepper & phase indicator
│
├── Phase1Narrative/               # FASE 1: Narrative
│   ├── ConceptStep.tsx            # Name, concept phrase, planet, birth date
│   ├── DescriptionStep.tsx        # Physical description (1 paragraph)
│   ├── PersonalityStep.tsx        # Personality (1 paragraph)
│   └── BackstoryStep.tsx          # Backstory (1 paragraph)
│
├── Phase2Portrait/                # FASE 2: Portrait (optional)
│   └── PortraitStep.tsx           # Image upload / AI prompt generator
│
├── Phase3Mechanics/               # FASE 3: Mechanical creation — Level 1
│   ├── SpeciesStep.tsx            # Species + primary/secondary characteristic
│   ├── ClassStep.tsx              # Class (Education) → competencies, chars, skills, benefits
│   ├── FactionStep.tsx            # Faction (Apprenticeship) → blessing/curse/material prize
│   ├── VocationStep.tsx           # Vocation (Career) → skills, benefit, equipment
│   └── CustomizationStep.tsx      # Free benefit, optional affliction, equipment & money
│
├── Phase4Evolution/               # FASE 4: Level-up (reusable for any level)
│   ├── LevelUpStep.tsx            # Distribute points, pick benefits per level
│   └── LevelUpSummary.tsx         # Running total after each level
│
├── Phase5Summary/                 # FASE 5: Final character sheet
│   └── SummaryStep.tsx            # Full sheet preview, save to IndexedDB
│
└── components/
    ├── CharAccumulatedTable.tsx    # Cumulative characteristics after each step
    ├── PointDistributor.tsx        # +/- counters for distributing points
    ├── BenefitPicker.tsx           # Filterable benefit selection
    ├── CompetencyPicker.tsx        # Competency selection with restrictions
    └── ExcessHandler.tsx           # Handles overflow >8 at level 1
```

### Phase 3 — Step-by-step Logic

#### Species Step
- Show 4 species cards with birthrights and restrictions
- User picks primary (→5) & secondary (→4) characteristic; rest at 3
- Some species force specific primary/secondary (e.g., Vorox: Str or Con)
- Auto-set: size, speed
- Show cumulative characteristics table

#### Class Step (Education)
- Show 4 class cards (Noble, Sacerdote, Mercader, Independiente)
- Auto-apply fixed education attributes per class:
  - Competencies (some fixed, some user-choice)
  - Characteristics bonuses (some fixed, some user-choice from alternatives)
  - Skills bonuses (some fixed, some user-choice)
  - Benefits: archetype benefit (auto) + 1 from class or free list
- **Excess rule**: flag if any stat > 8 → redistribute

#### Faction Step (Apprenticeship)
- Filter factions by class (5 houses / 5 sects / 5 guilds / 5 societies)
- Show: blessing, curse, material prize, favored vocation
- Apply: Saber de Facción + 2 competencies (user chooses), +5 chars, +5 skills, first rank benefit
- **Excess rule**: apply again

#### Vocation Step (Early Career)
- Filter vocations by class; highlight favored vocation
- Apply: 2 competencies (user chooses), +5 chars, +10 skills (with choices), 1 vocation benefit, equipment
- **Excess rule**: apply again

#### Customization Step
- 1 free competency (unrestricted)
- 1 free benefit (unrestricted)
- Optional affliction → grants 1 extra benefit if chosen
- Starting money: 300 fénix base
- Weapons: 1 per weapon competency
- Armor: per armor competencies acquired

### Derived Stats at Level 1
- **Vitality** = Size + CON + VOL + FE + Level
- **Reanimation** = Size + Level (1 use at level 1)
- **Impulse** = max(FUE, INT, PRE) + Level (1 use at level 1)
- **VP Bank** = 5 PV
- **Tecgnosis** = Level (always)
- **Resistances**: Corporal (from armor), Mental & Spiritual (from benefits)

### Validation Rules
- Level 1: no characteristic or skill > 8
- Level 2-9: max 9
- Level 10+: max 10
- Restricted skills (Alquimia, Interfaz, Pilotar) stay at 0 unless unlocked
- Excess points must be redistributed

---

## M3 — Character Sheet View & Editor

**Goal:** Interactive digital character sheet faithful to the PDF layout, with live editing.

### Components
```
src/pages/CharacterSheet/
├── index.tsx                  # Layout matching PDF structure
├── HeaderSection.tsx          # Name, rank, species, class, faction, vocation
├── CharacteristicsPanel.tsx   # 9 stats in Body/Mind/Spirit groups
├── SkillsPanel.tsx            # 26 skills with values
├── OccultSection.tsx          # Psi/Ansia & Theurgy/Hubris trackers
├── ResistancesPanel.tsx       # Body/Mind/Spirit resistances
├── ArmorPanel.tsx             # Armor + Energy Shield
├── VitalityTracker.tsx        # Vitality bar with current/max + reanimation
├── VPTracker.tsx              # VP Bank, PV/PW, Impulse tracker
├── ActionsTable.tsx           # Action rows with goal/impact
├── BenefitsSection.tsx        # Benefits, competencies, birthrights (page 2)
├── EquipmentSection.tsx       # Gear, weapons, belongings (page 2)
├── MoneySection.tsx           # Cash and resources (page 2)
└── NotesSection.tsx           # Free-form notes
```

### Features
- Tap any value to edit inline
- Derived stats auto-recalculate on change
- Vitality: tap to mark damage, long-press for reanimation
- VP/PW/Impulse: quick increment/decrement buttons
- Two-page layout option (matching PDF sheet)
- Auto-save to IndexedDB on every change

---

## M4 — Character Management

**Goal:** Full CRUD operations for characters.

### Features
- Character list with search/filter
- Edit existing characters (reopen wizard or inline)
- Duplicate characters
- Delete with confirmation
- Sort by name, class, faction, updated date

---

## M5 — Level-up System (Post-MVP)

**Goal:** Reusable level advancement from level 2 to 10.

### Level Progression Table

| Level | Competencies | Characteristics | Class Benefit | Vocation Benefit | Skills | Vitality | Reanimate Uses | Impulse Uses | Bank |
|-------|-------------|----------------|---------------|-----------------|--------|----------|---------------|-------------|------|
| 1 | — | — | — | — | — | base | 1 | 1 | 5 |
| 2 | +1 | +2 | — | +1 | +3 | +1 | 1 | 1 | 10 |
| 3 | +1 | +1 | +1 | +1 | +2 | +1 | 1 | 1 | 10 |
| 4 | +1 | +2 | — | +1 | +3 | +1 | 2 | 2 | 15 |
| 5 | +1 | +1 | +1 | +1 | +2 | +1 | 2 | 2 | 15 |
| 6 | +1 | +2 | — | +1 | +3 | +1 | 2 | 2 | 20 |
| 7 | +1 | +1 | +1 | +1 | +2 | +1 | 3 | 3 | 20 |
| 8 | +1 | +2 | — | +1 | +3 | +1 | 3 | 3 | 25 |
| 9 | +1 | +1 | +1 | +1 | +2 | +1 | 3 | 3 | 25 |
| 10 | +1 | +2 | — | +1 | +3 | +1 | 4 | 4 | 30 |

---

## M6 — Rules Engine (Post-MVP)

**Goal:** Implement VPS core mechanics as reusable functions + UI tools.

### Key Formulas
- **Goal Number (Meta):** Skill + Characteristic (+ modifiers)
- **Success:** d20 roll ≤ Goal → earn VP equal to roll value
- **Critical Success:** natural 20 if ≤ Goal → bonus PW
- **Critical Failure:** natural 1 → DJ gains 1 PW
- **Resistance:** spend VP (1:1) to overcome target's Resistance
- **Damage Impact:** weapon base + (VP spent at 2:1 ratio)
- **Favorable roll:** 2d20 keep higher (must be ≤ Goal)
- **Unfavorable roll:** 2d20 keep lower

### Engine Files
```
src/engine/
├── dice.ts          # d20 roller with success/fail/critical logic
├── action.ts        # Goal number calculation
├── resistance.ts    # Resistance checks
├── combat.ts        # Damage calculation, armor reduction
├── influence.ts     # Social combat
└── advancement.ts   # Level-up logic
```

---

## M7 — Campaign Manager (Post-MVP)

- Campaign CRUD (name, description, players, sessions)
- NPC management (simplified stat blocks)
- Session notes with timestamps
- Encounter tracker (initiative, HP tracking)
- Planet/location database
- Faction relationship tracker

---

## M8 — PWA + Polish (Post-MVP)

- Full offline support (service worker)
- Export/import characters (JSON)
- Responsive polish for all screen sizes
- Performance optimization

---

## Implementation Order

| # | Milestone | Status | Complexity |
|---|-----------|--------|------------|
| **M0** | Project scaffolding | COMPLETE | Small |
| **M1** | Data model + game data | COMPLETE | Medium-Large |
| **M2** | Character Creator wizard | **NEXT** | Large |
| **M3** | Character Sheet viewer | PENDING | Medium |
| **M4** | Character management | PENDING | Small |
| **M5** | Level-up system | POST-MVP | Medium |
| **M6** | Rules engine core | POST-MVP | Medium |
| **M7** | Campaign manager | POST-MVP | Medium |
| **M8** | PWA + polish | POST-MVP | Small |

**MVP = M0 + M1 + M2 + M3 + M4**

---

## Verification Plan

- **M0:** `npm run dev` loads, routes work, IndexedDB initializes
- **M1:** Game data imports without TS errors; derived stats correct for test cases
- **M2:** Full Level 1 character through all wizard phases; max 8 validated; excess handler works; saves to IndexedDB
- **M3:** Character loads and displays on all sheet sections; inline editing works; derived stats recalculate live
- **M4:** Character list from DB; edit, duplicate, delete work; destructive action confirmation
- **M5:** Level up 1→2→3; correct gains per level; max 9 enforced at level 2+
- **M6:** Dice produces correct distributions; goal = skill + char; VPS rules match
- **Cross-browser:** Chrome + Safari (iPad)
- **Responsive:** 768px (iPad portrait) and 1024px (iPad landscape)

---

## Build & Dev Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # TypeScript check + Vite production build
npm run preview   # Preview production build
npx tsc --noEmit  # Type-check only
```
