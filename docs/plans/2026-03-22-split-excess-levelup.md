# Split Excess Redistribution & Level-Up Into Separate Steps

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move excess redistribution from Summary to end of Customization, extract level-up into its own step, creating an 8-step wizard.

**Architecture:** The wizard goes from 7 to 8 steps. StepCustomization handles excess redistribution after personalización choices. A new StepLevelUp component owns the level-up system. StepSummary becomes a pure read-only review + save screen.

**Tech Stack:** React 19, TypeScript strict mode, Vite 7

---

### Task 1: Update wizard step definitions in creatorTypes.ts

**Files:**
- Modify: `src/pages/CharacterCreator/creatorTypes.ts:53-73`

**Step 1: Add 'levelup' step to STEPS array and labels**

Change the STEPS array and STEP_LABELS from 7 to 8 entries:

```typescript
export const STEPS = [
  'narrative',
  'species',
  'class',
  'faction',
  'vocation',
  'customization',
  'levelup',
  'summary',
] as const

export type StepId = (typeof STEPS)[number]

export const STEP_LABELS: Record<StepId, string> = {
  narrative: 'Narrativa',
  species: 'Especie',
  class: 'Clase',
  faction: 'Facción',
  vocation: 'Vocación',
  customization: 'Personalización',
  levelup: 'Niveles',
  summary: 'Resumen',
}
```

**Step 2: Add snapshot for pre-levelup state**

Add to `CharacterDraft` interface (after `_snapshotPreCustomization`):

```typescript
_snapshotPreLevelUp?: StepSnapshot
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```
git add src/pages/CharacterCreator/creatorTypes.ts
git commit -m "feat: add levelup step to wizard step definitions"
```

---

### Task 2: Move excess redistribution from StepSummary to StepCustomization

**Files:**
- Modify: `src/pages/CharacterCreator/StepCustomization.tsx`
- Modify: `src/pages/CharacterCreator/StepSummary.tsx`

**Step 1: Add excess redistribution UI to end of StepCustomization**

In StepCustomization, after the "Equipo y Dinero" section and before the step nav buttons:

1. Import `getMaxStatValue` from `@/engine/derived` and `CHARACTERISTICS` from `@/data/characteristics`
2. Add state for `charRedist` and `skillRedist` (same pattern as currently in StepSummary lines 64-65)
3. Compute excess from `draft.caracteristicas` and `draft.habilidades` vs `maxVal = getMaxStatValue(1)` (always level 1 at this point, level-up hasn't happened yet)
4. Show the excess redistribution UI only when `hasExcess` is true
5. Block "Siguiente" until excess is fully distributed
6. In `handleNext()`, apply the capped+redistributed values to `draft.caracteristicas` and `draft.habilidades` before saving

The excess UI should follow the same pattern as StepSummary lines 196-350 (the redistribution section with +/- buttons per stat).

**Key difference from current Summary:** At this point the max is always 8 (level 1), since level-up hasn't happened. The excess only covers stats from especie+clase+facción+vocación+personalización.

**Step 2: Update handleNext to save snapshot and apply redistribution**

In `handleNext()`, after applying excess redistribution:
- Save `_snapshotPreLevelUp` with the final redistributed stats
- Pass the redistributed stats forward in the draft

**Step 3: Remove excess redistribution from StepSummary**

In StepSummary:
- Remove all excess-related state (`charRedist`, `skillRedist`, `charExcess`, `skillExcess`, etc.)
- Remove the excess redistribution UI section
- Use `draft.caracteristicas` and `draft.habilidades` directly (they're already clean)
- Remove the `excessFullyDistributed` check from the save button
- Keep the `finalChars`/`finalSkills` variables but set them directly from draft (no redistribution needed)

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 5: Commit**

```
git add src/pages/CharacterCreator/StepCustomization.tsx src/pages/CharacterCreator/StepSummary.tsx
git commit -m "feat: move excess redistribution from Summary to Customization step"
```

---

### Task 3: Create StepLevelUp component

**Files:**
- Create: `src/pages/CharacterCreator/StepLevelUp.tsx`
- Modify: `src/pages/CharacterCreator/StepCustomization.tsx` (remove level-up section)

**Step 1: Create StepLevelUp.tsx**

Extract the entire level-up system from StepCustomization into a new component. This includes:
- Target level selector (input number)
- Level choice state management (`levelChoices` array)
- Cumulative state computation (`cumulativeStates` useMemo)
- All LevelUpPanel instances with proper props
- The `handleNext()` that applies level-up bonuses to draft

The component receives `StepProps` ({ draft, updateDraft, goNext, goBack }).

It uses `draft._snapshotPreLevelUp` as its base snapshot (the clean state after customization + excess redistribution).

If level stays at 1, clicking "Siguiente" just forwards to Summary without changes.

**Step 2: Remove level-up section from StepCustomization**

Remove from StepCustomization:
- The `targetLevel` state and `levelChoices` state
- The `handleTargetLevelChange` and `updateLevelChoice` functions
- The `cumulativeStates` useMemo
- The `allLevelsComplete` check
- The "Nivel objetivo" section in the JSX
- The level-up merge logic from `handleNext()`
- The LevelUpPanel import and occult power imports (if no longer needed)

StepCustomization's `canProceed` simplifies to: `freeCompComplete && freeBenefitComplete && excessFullyDistributed` (when excess exists) or `freeCompComplete && freeBenefitComplete` (when no excess).

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```
git add src/pages/CharacterCreator/StepLevelUp.tsx src/pages/CharacterCreator/StepCustomization.tsx
git commit -m "feat: extract level-up system into dedicated StepLevelUp component"
```

---

### Task 4: Wire up the new step in CharacterCreator/index.tsx

**Files:**
- Modify: `src/pages/CharacterCreator/index.tsx`

**Step 1: Import and add StepLevelUp to the switch**

```typescript
import { StepLevelUp } from './StepLevelUp'

// In renderStep():
case 'levelup': return <StepLevelUp {...props} />
```

**Step 2: Verify the app works end-to-end**

Run: `npm run dev` and test creating a character through all 8 steps.

**Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```
git add src/pages/CharacterCreator/index.tsx
git commit -m "feat: wire StepLevelUp into 8-step wizard"
```

---

### Task 5: Final verification and cleanup

**Step 1: Test these scenarios manually:**
- Human Noble level 1: customization should show excess if any stat > 8, level-up step should show "level 1" with no panels
- Ur-obun Sacerdote level 3: excess in customization, then level-up with Psi powers accessible
- Vorox level 1: no Psíquico/Teúrgo vocations, excess redistribution if stats > 8

**Step 2: Clean up unused imports in all modified files**

**Step 3: Final commit**

```
git add -A
git commit -m "chore: cleanup after wizard restructure"
```
