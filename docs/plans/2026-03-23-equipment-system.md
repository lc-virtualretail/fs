# Equipment System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a full equipment management tab to the character sheet with inventory, ammo tracking, tecgnosis calculation, size/weight restrictions, resources, and custom items.

**Architecture:** New `inventario: InventoryItem[]` field on Character, tab-based CharacterSheet UI split (Ficha | Equipo), equipment catalog from `src/data/equipment.ts` already created. Inventory actions (equip, unequip, fire, reload, add, remove) persist via Dexie. Character creation finalizer converts vocation/faction equipment strings to InventoryItem[].

**Tech Stack:** React 19, TypeScript strict, Dexie.js (IndexedDB), CSS variables + inline styles (project convention)

**Design doc:** `docs/plans/2026-03-23-equipment-system-design.md`

---

## Task 1: Update Character Types

**Files:**
- Modify: `src/types/character.ts`

**Step 1: Add InventoryItem and Recurso types, add inventario field to Character**

Add after the existing `EnergyShield` interface (line ~110):

```typescript
export type ItemCalidad = 'excelente' | 'maestra' | 'buena' | 'estandar' | 'mediocre' | 'deficiente' | 'deteriorada'

export interface InventoryItem {
  id: string
  sourceId?: string
  category: string
  nombre: string
  detalles: Record<string, unknown>
  equipado: boolean
  calidad: ItemCalidad
  cargaActual?: number
  cargaMaxima?: number
  cargasExtra?: number
  custom?: boolean
  notas?: string
}

export interface Recurso {
  nombre: string
  ubicacion: string
  ganancias: number
  periodo: 'diario' | 'semanal' | 'mensual' | 'anual'
  notas?: string
}
```

Update `Money` interface:

```typescript
export interface Money {
  efectivo: number
  recursos: Recurso[]
}
```

Add to `Character` interface after `dinero` field:

```typescript
  inventario: InventoryItem[]
```

**Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: Errors about missing `inventario` in places that construct Character objects — this is expected and will be fixed in subsequent tasks.

**Step 3: Commit**

```bash
git add src/types/character.ts
git commit -m "feat: add InventoryItem, Recurso types and inventario field to Character"
```

---

## Task 2: Inventory Utility Functions

**Files:**
- Create: `src/engine/inventory.ts`

**Step 1: Create inventory engine with tecgnosis, size, compatibility calculations**

```typescript
import type { InventoryItem, Character, ItemCalidad } from '@/types/character'

// ─── Size System ───

const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL'] as const
const SIZE_UNITS: Record<string, number> = { XXS: 1, XS: 2, S: 4, M: 8, L: 16, XL: 32 }

export function sizeToUnits(size: string): number {
  return SIZE_UNITS[size] ?? 8 // default M
}

export function sizeLabel(size: string): string {
  const labels: Record<string, string> = {
    XXS: 'Minúsculo', XS: 'Muy pequeño', S: 'Pequeño',
    M: 'Mediano', L: 'Grande', XL: 'Muy grande',
  }
  return labels[size] ?? size
}

// ─── Tecgnosis ───

export function countTecgnosisLoad(inventario: InventoryItem[]): number {
  const equipped = inventario.filter(i => i.equipado)
  let count = 0
  let hasHiTechArmor = false

  for (const item of equipped) {
    const nt = (item.detalles.nt as number) ?? 0
    if (nt < 5) continue

    // Armor counts as 1 regardless of pieces
    if (item.category === 'armadura') {
      if (!hasHiTechArmor) {
        hasHiTechArmor = true
        count++
      }
      continue
    }

    // Skip curiosidades (entertainment, fashion items that are flagged)
    if (item.detalles.curiosidad) continue

    count++
  }
  return count
}

export function isTecgnosisOverloaded(inventario: InventoryItem[], nivel: number): boolean {
  return countTecgnosisLoad(inventario) > nivel
}

// ─── Energy Shield Cargo ───

interface ShieldCargoLimit {
  maxUnits: number // in size units (XL=32)
  label: string
}

const SHIELD_CARGO: Record<string, ShieldCargoLimit> = {
  'Escudo de energía antiguo': { maxUnits: 16, label: '1 L' },         // 1 L
  'Escudo de energía estándar': { maxUnits: 32, label: '1 XL' },       // 1 XL
  'Escudo de energía de duelista': { maxUnits: 32, label: '1 XL' },    // 1 XL
  'Escudo de energía de asalto': { maxUnits: 64, label: '2 XL' },      // 2 XL
  'Escudo de energía de batalla': { maxUnits: 96, label: '3 XL' },     // 3 XL
}

export function getShieldCargoLimit(shieldName: string): ShieldCargoLimit | null {
  return SHIELD_CARGO[shieldName] ?? null
}

export function calcEquippedCargoUnits(inventario: InventoryItem[]): number {
  let units = 0
  for (const item of inventario) {
    if (!item.equipado) continue
    // Skip armor (covered by compatibility) and shields and hand-held items
    if (item.category === 'armadura' || item.category === 'escudoEnergia' || item.category === 'escudoMano') continue
    // Skip weapons (held in hands, not cargo)
    if (item.category === 'armaBalas' || item.category === 'armaEnergia' ||
        item.category === 'armaCuerpoACuerpo' || item.category === 'artefactoCuerpoACuerpo') continue
    const size = (item.detalles.tamano as string) ?? 'M'
    units += sizeToUnits(size)
  }
  return units
}

// ─── Armor-Shield Compatibility ───

// Shield compatibility hierarchy: E < A < B
// E = estándar/duelista/antiguo, A = asalto (+E shields), B = batalla (+A+E)
export function isArmorShieldCompatible(
  armorShieldCompat: string | undefined, // 'E', 'A', or 'B'
  shieldName: string
): boolean {
  if (!armorShieldCompat) return false
  const isAssault = shieldName.includes('asalto')
  const isBattle = shieldName.includes('batalla')

  if (isBattle) return armorShieldCompat === 'B'
  if (isAssault) return armorShieldCompat === 'A' || armorShieldCompat === 'B'
  // Standard/duelist/ancient
  return true // E, A, B all work
}

// ─── Weapon Strength Penalty ───

export function calcStrengthPenalty(weaponFue: number, characterFue: number): number {
  return Math.max(0, weaponFue - characterFue)
}

// ─── Quality Adjustments ───

const QUALITY_PRICE_MULT: Record<ItemCalidad, number> = {
  excelente: 1.3,
  maestra: 1.2,
  buena: 1.1,
  estandar: 1.0,
  mediocre: 0.9,
  deficiente: 0.8,
  deteriorada: 0.7,
}

const QUALITY_RESISTANCE_BONUS: Record<ItemCalidad, number> = {
  excelente: 3,
  maestra: 2,
  buena: 1,
  estandar: 0,
  mediocre: 0,
  deficiente: 0,
  deteriorada: 0,
}

export function qualityPriceMult(calidad: ItemCalidad): number {
  return QUALITY_PRICE_MULT[calidad]
}

export function qualityResistanceBonus(calidad: ItemCalidad): number {
  return QUALITY_RESISTANCE_BONUS[calidad]
}

export function qualityMetaBonus(calidad: ItemCalidad): number {
  return calidad === 'excelente' ? 1 : 0
}

// ─── Equipped Armor Resistance ───

export function getEquippedArmorResistance(inventario: InventoryItem[]): number {
  const armor = inventario.find(i => i.equipado && i.category === 'armadura')
  if (!armor) return 0
  const baseR = (armor.detalles.resistencia as number) ?? 0
  return baseR + qualityResistanceBonus(armor.calidad)
    + qualityMetaBonus(armor.calidad) // excelente armor: +1 R per book
}

export function getEquippedArmorProtections(inventario: InventoryItem[]): string[] {
  const armor = inventario.find(i => i.equipado && i.category === 'armadura')
  if (!armor) return []
  return (armor.detalles.caracteristicas as string[]) ?? []
}

// ─── Fuerza weight table ───

export function maxCarryWeight(fuerza: number): number {
  return fuerza * 20 // simplified: Fue 1=10, but table shows ~20kg per point
}

// ─── Migration Helper ───

export function migrateToInventory(character: Character): InventoryItem[] {
  const items: InventoryItem[] = []

  // Migrate armas
  if (character.armas) {
    for (const w of character.armas) {
      items.push({
        id: crypto.randomUUID(),
        category: 'armaBalas', // generic, could be energy too
        nombre: w.nombre,
        detalles: {
          nt: w.nt, meta: w.meta, dano: w.dano, fuerza: w.fuerza,
          alcance: w.alcance, cdt: w.cadenciaDeTiro,
          municion: w.municion, caracteristicas: w.caracteristicas,
        },
        equipado: true,
        calidad: 'estandar',
        cargaActual: w.municion,
        cargaMaxima: w.municion,
        cargasExtra: 0,
      })
    }
  }

  // Migrate equipo
  if (character.equipo) {
    for (const e of character.equipo) {
      items.push({
        id: crypto.randomUUID(),
        category: 'entretenimiento', // generic
        nombre: e.nombre,
        detalles: { nt: e.nt, tamano: e.tamano },
        equipado: true,
        calidad: 'estandar',
      })
    }
  }

  // Migrate otrasPertenencias
  if (character.otrasPertenencias) {
    for (const o of character.otrasPertenencias) {
      items.push({
        id: crypto.randomUUID(),
        category: 'entretenimiento',
        nombre: o.nombre,
        detalles: { lugar: o.lugar },
        equipado: false,
        calidad: 'estandar',
        notas: o.lugar,
      })
    }
  }

  return items
}
```

**Step 2: Verify compilation**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/engine/inventory.ts
git commit -m "feat: add inventory engine with tecgnosis, cargo, compatibility, quality calculations"
```

---

## Task 3: Equipment Matching for Character Creation

**Files:**
- Create: `src/engine/equipmentMatcher.ts`

**Step 1: Create matcher that converts vocation/faction equipment strings to InventoryItems**

This function takes the string arrays from `carrera.equipo` and `premioMaterial` and attempts to find matching items in the equipment.ts catalog. Fuzzy matching by name substring.

```typescript
import type { InventoryItem, ItemCalidad } from '@/types/character'
import {
  ARMAS_BALAS, ARMAS_ENERGIA, ARMAS_CUERPO_A_CUERPO,
  ARMADURAS, ESCUDOS_ENERGIA, ESCUDOS_MANO,
  EQUIPO_GENERAL, MUNICION, ACCESORIOS_ARMA, EXPLOSIVOS,
} from '@/data/equipment'
import type { EquipmentItem } from '@/data/equipment'

// Build a flat search index of all catalog items
const ALL_CATALOG: { item: EquipmentItem; searchName: string }[] = [
  ...ARMAS_BALAS, ...ARMAS_ENERGIA, ...ARMAS_CUERPO_A_CUERPO,
  ...ARMADURAS, ...ESCUDOS_ENERGIA, ...ESCUDOS_MANO,
  ...EQUIPO_GENERAL, ...MUNICION, ...ACCESORIOS_ARMA, ...EXPLOSIVOS,
].map(item => ({
  item,
  searchName: ('nombre' in item ? (item as { nombre: string }).nombre : '').toLowerCase(),
}))

function detectQuality(text: string): ItemCalidad {
  const lower = text.toLowerCase()
  if (lower.includes('excelente')) return 'excelente'
  if (lower.includes('maestra')) return 'maestra'
  if (lower.includes('buena calidad') || lower.includes('buena')) return 'buena'
  return 'estandar'
}

function findCatalogMatch(text: string): EquipmentItem | null {
  const lower = text.toLowerCase()
    .replace(/de buena calidad/g, '')
    .replace(/de calidad excelente/g, '')
    .replace(/\(meta \+1\)/g, '')
    .trim()

  // Try exact-ish match first
  for (const entry of ALL_CATALOG) {
    if (entry.searchName && lower.includes(entry.searchName)) return entry.item
    if (entry.searchName && entry.searchName.includes(lower)) return entry.item
  }

  // Try keyword matching for common items
  const keywords: [string, string][] = [
    ['pistola láser', 'MarTech Amber'],
    ['pistola bláster', 'OSI Alembic'],
    ['fusil bláster', 'OSI Crucible'],
    ['fusil láser', 'MarTech Indigo'],
    ['estoque', 'Estoque'],
    ['espada', 'Espada'],
    ['cuchillo', 'Cuchillo'],
    ['sinteseda', 'Sinteseda'],
    ['esclerosintética', 'Esclerosintética'],
    ['jubón de cuero', 'Jubón de cuero'],
    ['cota de malla', 'Cota de malla de plástico'],
    ['escudo de energía de duelista', 'Escudo de energía de duelista'],
    ['escudo de energía', 'Escudo de energía estándar'],
    ['medpac', 'Medpac personal'],
    ['revólver', 'Revólver medio típico'],
    ['subfusil', 'Subfusil típico'],
  ]
  for (const [keyword, catalogName] of keywords) {
    if (lower.includes(keyword)) {
      const match = ALL_CATALOG.find(e => e.searchName === catalogName.toLowerCase())
      if (match) return match.item
    }
  }

  return null
}

function catalogItemToDetalles(item: EquipmentItem): Record<string, unknown> {
  // Spread all properties except 'category'
  const { category, ...rest } = item as Record<string, unknown>
  return rest
}

export function convertEquipmentStrings(
  equipStrings: string[],
  premioMaterial?: string
): InventoryItem[] {
  const items: InventoryItem[] = []

  for (const str of equipStrings) {
    const calidad = detectQuality(str)
    const match = findCatalogMatch(str)

    if (match) {
      items.push({
        id: crypto.randomUUID(),
        sourceId: ('nombre' in match ? (match as { nombre: string }).nombre : undefined),
        category: match.category,
        nombre: 'nombre' in match ? (match as { nombre: string }).nombre : str,
        detalles: catalogItemToDetalles(match),
        equipado: true,
        calidad,
        cargaActual: 'municion' in match ? (match as { municion: number }).municion : undefined,
        cargaMaxima: 'municion' in match ? (match as { municion: number }).municion : undefined,
        cargasExtra: 0,
      })
    } else {
      // Generic item — could not match catalog
      items.push({
        id: crypto.randomUUID(),
        category: 'entretenimiento',
        nombre: str,
        detalles: { descripcion: str },
        equipado: true,
        calidad,
        custom: true,
      })
    }
  }

  // Handle premioMaterial
  if (premioMaterial) {
    const calidad = detectQuality(premioMaterial)
    const match = findCatalogMatch(premioMaterial)
    if (match) {
      items.push({
        id: crypto.randomUUID(),
        sourceId: ('nombre' in match ? (match as { nombre: string }).nombre : undefined),
        category: match.category,
        nombre: 'nombre' in match ? (match as { nombre: string }).nombre : premioMaterial,
        detalles: catalogItemToDetalles(match),
        equipado: true,
        calidad,
        cargaActual: 'municion' in match ? (match as { municion: number }).municion : undefined,
        cargaMaxima: 'municion' in match ? (match as { municion: number }).municion : undefined,
        cargasExtra: 0,
      })
    } else {
      items.push({
        id: crypto.randomUUID(),
        category: 'entretenimiento',
        nombre: premioMaterial,
        detalles: { descripcion: premioMaterial },
        equipado: true,
        calidad,
        custom: true,
        notas: 'Premio material de facción',
      })
    }
  }

  return items
}
```

**Step 2: Verify compilation**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/engine/equipmentMatcher.ts
git commit -m "feat: add equipment matcher to convert creation strings to inventory items"
```

---

## Task 4: Update StepSummary to Generate Inventory

**Files:**
- Modify: `src/pages/CharacterCreator/StepSummary.tsx`

**Step 1: Import and use convertEquipmentStrings in finalizeCharacter**

Add import:
```typescript
import { convertEquipmentStrings } from '@/engine/equipmentMatcher'
```

In the `handleSave` function, before building the character object, add:
```typescript
const faction = FACTIONS.find(f => f.id === draft.faccion)
const inventario = convertEquipmentStrings(
  draft.equipoVocacion,
  faction?.premioMaterial
)
```

In the character object, change:
```typescript
armas: [],
equipo: [],
otrasPertenencias: [],
```
to:
```typescript
armas: [],
equipo: [],
otrasPertenencias: [],
inventario,
```

**Step 2: Verify compilation and test manually**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/pages/CharacterCreator/StepSummary.tsx
git commit -m "feat: generate inventory from vocation equipment and faction premio material"
```

---

## Task 5: Tab System for CharacterSheet

**Files:**
- Modify: `src/pages/CharacterSheet/index.tsx`

**Step 1: Add tab state and split UI**

Add at top of component:
```typescript
const [activeTab, setActiveTab] = useState<'ficha' | 'equipo'>('ficha')
```

Add migration on load — in the useEffect after setting character, check if inventario exists:
```typescript
import { migrateToInventory } from '@/engine/inventory'

// Inside useEffect, after setCharacter(char):
if (char && !char.inventario) {
  const inventario = migrateToInventory(char)
  const migrated = { ...char, inventario, dinero: {
    ...char.dinero,
    recursos: (char.dinero.recursos || []).map(r =>
      'ubicacion' in r ? r : { ...r, ubicacion: '', periodo: 'mensual' as const }
    ),
  }}
  setCharacter(migrated)
  db.characters.update(char.id, { inventario: migrated.inventario, dinero: migrated.dinero })
}
```

Add tab bar after header, before sections:
```tsx
<div className="sheet-tabs">
  <button
    className={`sheet-tab ${activeTab === 'ficha' ? 'sheet-tab-active' : ''}`}
    onClick={() => setActiveTab('ficha')}
  >Ficha</button>
  <button
    className={`sheet-tab ${activeTab === 'equipo' ? 'sheet-tab-active' : ''}`}
    onClick={() => setActiveTab('equipo')}
  >Equipo</button>
</div>
```

Wrap existing sections (Identity through Narrative) with `{activeTab === 'ficha' && (<>...</>)}`.

Add placeholder for equipo tab:
```tsx
{activeTab === 'equipo' && (
  <section className="sheet-section">
    <h2>Equipo (en construcción)</h2>
  </section>
)}
```

Add CSS for tabs:
```css
.sheet-tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--color-border);
  margin-bottom: var(--space-md);
}
.sheet-tab {
  padding: var(--space-sm) var(--space-lg);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  color: var(--color-text-muted);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.sheet-tab:hover {
  color: var(--color-text);
}
.sheet-tab-active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}
```

**Step 2: Remove old Equipment section from Ficha tab** (the "Equipo y Dinero" section around line 488-500).

**Step 3: Verify and commit**

Run: `npx tsc --noEmit && npm run dev` — check tabs switch visually.

```bash
git add src/pages/CharacterSheet/index.tsx
git commit -m "feat: add Ficha/Equipo tab system to character sheet with inventory migration"
```

---

## Task 6: EquipmentTab Component — Dinero, Recursos, Restricciones

**Files:**
- Create: `src/pages/CharacterSheet/EquipmentTab.tsx`

**Step 1: Build the EquipmentTab component**

This component receives `character` and `onUpdate` (to persist changes). It contains:

1. **Dinero section** — display efectivo with +/- buttons, editable input
2. **Propiedades y Recursos** — CRUD list of Recurso entries
3. **Carga y Restricciones panel** — Tecgnosis indicator, shield cargo, armor-shield compat warnings

Use the functions from `src/engine/inventory.ts` for all calculations.

The component receives:
```typescript
interface EquipmentTabProps {
  character: Character
  onUpdate: (updates: Partial<Character>) => Promise<void>
}
```

The `onUpdate` callback persists to Dexie and updates local state (defined in CharacterSheet index).

This is a large component — implement section by section. Start with Dinero + Recursos + Restricciones. Inventory list comes in next task.

**Step 2: Wire into CharacterSheet**

In `index.tsx`, replace the equipo placeholder with:
```tsx
import { EquipmentTab } from './EquipmentTab'

{activeTab === 'equipo' && (
  <EquipmentTab character={character} onUpdate={handleEquipmentUpdate} />
)}
```

Add `handleEquipmentUpdate`:
```typescript
async function handleEquipmentUpdate(updates: Partial<Character>) {
  if (!character) return
  const updated = { ...character, ...updates, updatedAt: new Date().toISOString() }
  await db.characters.update(character.id, { ...updates, updatedAt: updated.updatedAt })
  setCharacter(updated as Character)
}
```

**Step 3: Verify and commit**

```bash
git add src/pages/CharacterSheet/EquipmentTab.tsx src/pages/CharacterSheet/index.tsx
git commit -m "feat: add EquipmentTab with dinero, recursos, and restriction indicators"
```

---

## Task 7: Inventory List — Equipped and Stored Sections

**Files:**
- Modify: `src/pages/CharacterSheet/EquipmentTab.tsx`

**Step 1: Add equipped/stored inventory sections**

Below the restrictions panel, render two sections:

**Equipado** — grouped by sub-category:
- Armadura (show R.Corporal + protections, quality badge)
- Escudo de energía (show thresholds, activations with decrement button)
- Armas (show stats, ammo bar, Disparar/Recargar/Añadir cargador buttons, strength penalty warning)
- Otro (simple list)

**Almacenado** — same grouping but no usage buttons, just Equipar/Eliminar.

Each item shows: nombre, calidad badge (colored), NT badge if >=5.

For weapons with ammo:
- `Disparar` button: decrements `cargaActual` (by 1 or CdT amount). Disabled if 0.
- `Recargar` button: sets `cargaActual = cargaMaxima`, decrements `cargasExtra`. Disabled if `cargasExtra <= 0`.
- `+ Cargador` button: increments `cargasExtra` by 1.
- Display: `Munición: X/Y | Cargadores: Z`

For energy shields with activations:
- `Activación usada` button: decrements a local counter for session tracking.

All changes to inventory call `onUpdate({ inventario: [...modified] })`.

When equipping/unequipping armor, also call:
```typescript
const newR = getEquippedArmorResistance(newInventario)
const newProtections = getEquippedArmorProtections(newInventario)
onUpdate({
  inventario: newInventario,
  resistencias: {
    ...character.resistencias,
    corporal: newR,
  },
})
```

**Step 2: Verify and commit**

```bash
git add src/pages/CharacterSheet/EquipmentTab.tsx
git commit -m "feat: add equipped/stored inventory sections with ammo, reload, equip/unequip"
```

---

## Task 8: Add Equipment Modal — Catalog + Custom

**Files:**
- Create: `src/pages/CharacterSheet/AddEquipmentModal.tsx`
- Modify: `src/pages/CharacterSheet/EquipmentTab.tsx`

**Step 1: Create AddEquipmentModal**

A modal overlay with two modes:
1. **Catálogo** — Category filter tabs across top (Armas de Balas, Armas de Energía, Cuerpo a Cuerpo, Armaduras, Escudos, Equipo General, etc.). Text search box. Scrollable list showing item name, NT, price, key stats. Click item -> expands detail view with all stats. Quality selector dropdown. "Añadir" button.
2. **Personalizado** — Form: nombre (text), category (dropdown), NT (number), tamaño (dropdown XXS-XL), precio (number), notas (textarea). Quality selector. "Añadir" button.

When adding from catalog, construct `InventoryItem` from the catalog entry with all `detalles` populated from the data arrays. When adding custom, set `custom: true`.

New items default to `equipado: false` (stored).

Props:
```typescript
interface AddEquipmentModalProps {
  open: boolean
  onClose: () => void
  onAdd: (item: InventoryItem) => void
}
```

**Step 2: Wire modal into EquipmentTab**

Add "Añadir Equipo" button at bottom of EquipmentTab. State for modal open/close. On add, push to inventario and call `onUpdate`.

**Step 3: Verify and commit**

```bash
git add src/pages/CharacterSheet/AddEquipmentModal.tsx src/pages/CharacterSheet/EquipmentTab.tsx
git commit -m "feat: add equipment modal with catalog browser, search, quality selector, and custom items"
```

---

## Task 9: Update Ficha Tab Resistances to Reflect Equipped Armor

**Files:**
- Modify: `src/pages/CharacterSheet/index.tsx`

**Step 1: Update resistance display in Ficha tab**

In the Resistances section, change the corporal resistance display to pull from inventory:

```typescript
import { getEquippedArmorResistance, getEquippedArmorProtections } from '@/engine/inventory'

const equippedArmor = character.inventario?.find(i => i.equipado && i.category === 'armadura')
const resCorporal = character.inventario
  ? getEquippedArmorResistance(character.inventario)
  : (character.armadura?.resistenciaCorporal ?? 0)
const armorProtections = character.inventario
  ? getEquippedArmorProtections(character.inventario)
  : []
```

In the corporal resistance card, show protections below the armor name:
```tsx
<div className="derived-detail">
  {equippedArmor?.nombre ?? 'Sin armadura'}
  {armorProtections.length > 0 && (
    <div style={{ fontSize: '0.7rem', marginTop: 2 }}>
      {armorProtections.filter(p => p.startsWith('Protección')).join('; ')}
    </div>
  )}
</div>
```

**Step 2: Verify and commit**

```bash
git add src/pages/CharacterSheet/index.tsx
git commit -m "feat: display equipped armor resistance and protections in Ficha tab"
```

---

## Task 10: Final Polish and Edge Cases

**Files:**
- Various files from above

**Step 1: Handle edge cases**

- Ensure only 1 armor and 1 energy shield can be equipped at a time (equipping a new one unequips the old)
- Ensure `inventario` field defaults to `[]` when creating new characters
- Verify old characters without `inventario` migrate correctly on load
- Test the full flow: create character -> check Equipo tab -> add items -> equip armor -> verify Ficha resistances update -> fire weapon -> reload

**Step 2: Verify full build**

Run: `npx tsc --noEmit && npm run build`
Expected: Clean build, no errors.

**Step 3: Final commit**

```bash
git add -A
git commit -m "fix: equipment system edge cases and polish"
```
