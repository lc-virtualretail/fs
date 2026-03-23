# Equipment System Design

## Overview

Add a full equipment management system to the character sheet. The character sheet splits into two tabs: **Ficha** (current stats/skills/benefits) and **Equipo** (inventory, money, resources, restrictions). Equipment from character creation is auto-converted into inventory items.

## Data Model

### InventoryItem

```typescript
interface InventoryItem {
  id: string                    // uuid
  sourceId?: string             // ref to equipment.ts catalog entry
  category: EquipmentCategory   // from equipment.ts
  nombre: string
  detalles: Record<string, any> // full stats from catalog or custom
  equipado: boolean             // equipped vs stored
  calidad: 'excelente' | 'maestra' | 'buena' | 'estandar' | 'mediocre' | 'deficiente' | 'deteriorada'
  cargaActual?: number          // current ammo/charges
  cargaMaxima?: number          // max capacity
  cargasExtra?: number          // spare magazines/fusion cells
  custom?: boolean              // true if not from rulebook
  notas?: string
}
```

### Recurso (expanded)

```typescript
interface Recurso {
  nombre: string        // "Tienda de especias"
  ubicacion: string     // "Byzantium Secundus"
  ganancias: number     // fenix per period
  periodo: 'diario' | 'semanal' | 'mensual' | 'anual'
  notas?: string
}
```

### Character changes

- Add `inventario: InventoryItem[]`
- Replace `dinero.recursos` type with `Recurso[]` (add ubicacion + periodo)
- Keep old fields (`armas`, `equipo`, `otrasPertenencias`) for backward compat; migrate on load
- Armor equipped from inventory auto-updates `resistencias.corporal` and protections

### Quality price adjustments (from rulebook p.223)

| Quality | Price Adj | Object Resistance | Special |
|---|---|---|---|
| Excelente | +30% | +3 | +1 meta for intended task |
| Maestra | +20% | +2 | — |
| Buena | +10% | +1 | — |
| Estandar | 0% | — | — |
| Mediocre | -10% | — | — |
| Deficiente | -20% | — | — |
| Deteriorada | -30% | — | — |

## UI Structure

### Tab System

Character sheet header gains two tabs: **Ficha** | **Equipo**. Tab Ficha contains everything currently shown minus the equipment/money section. Tab Equipo contains all new equipment UI.

### Tab Equipo Sections

#### a) Dinero y Recursos
- Efectivo display with +/- buttons to edit during campaign
- List of Recurso entries (name, location, income, period)
- Add/edit/delete resource buttons

#### b) Carga y Restricciones (info panel)

**Tecgnosis indicator:**
- Count equipped items with NT >= 5 (armor counts as 1, curiosities excluded, ur artifacts NT9-10 always overload)
- Display: `Dispositivos NT5+: X / Tecgnosis: Y`
- Green if X <= Y, red warning if X > Y with compulsion types listed

**Energy shield cargo limit:**
- If shield equipped, show extra objects allowed vs carried
- Limits per shield type (besides compatible armor + held items):
  - Antiguo: 1 L
  - Estándar/Duelista: 1 XL
  - Asalto: 2 XL
  - Batalla: 3 XL
- Size conversion: 1 XL = 2 L = 4 M = 8 S = 16 XS = 32 XXS
- Warning if exceeded

**Armor-shield compatibility:**
- Armors marked E (compatible with Estándar/Duelista/Antiguo), A (+Asalto), B (+Batalla)
- If equipped armor not compatible with equipped shield -> red warning "Escudo no se activará"

**Weapon strength requirements:**
- Per equipped weapon: if character Fuerza < weapon Fue -> show penalty "Meta -X (falta Fuerza)"

All warnings are informational only (DJ has final word per rulebook).

#### c) Equipado (what you carry)

Organized by sub-sections:

**Armadura:** If armor equipped, show name, quality, R.Corporal (adjusted by quality), protection properties. This also updates Resistencias in Ficha tab.

**Escudo de energía:** Name, thresholds (min-max), activations remaining (with decrement button), exhaustion number, distortion.

**Armas:** Each weapon shows full stats, plus:
- Ammo indicator: `[|||.....]` visual or `X / Y`
- **Disparar** button: decrements cargaActual by CdT or 1
- **Recargar** button: refills from cargasExtra (decrements cargasExtra)
- **Añadir cargador/pila** button: increments cargasExtra
- Strength penalty warning if applicable

**Otro equipo:** Simple list of other equipped items with name, quality, notes.

Each item has: **Desequipar** button (moves to Almacenado), **Eliminar** button.

#### d) Almacenado (possessions not on person)

Same category breakdown but no usage buttons. Each item has **Equipar** button (moves to Equipado).

#### e) Añadir Equipo (modal)

- **From catalog:** Filterable by category tabs + text search. Shows all details. Select quality. Add button.
- **Custom item:** Free-form: nombre, category dropdown, NT, tamano, precio, notas. Marked `custom: true`.

#### f) Propiedades y Recursos

Moved here from dinero. Full CRUD for income-generating properties with nombre, ubicacion, ganancias, periodo, notas.

## Character Creation Integration

In `finalizeCharacter` (Step 7 Summary):
- `carrera.equipo` strings from vocation are matched against equipment.ts catalog
- Faction `premioMaterial` items with quality indicators are parsed (e.g. "arma de buena calidad" -> calidad: 'buena')
- Matched items become `InventoryItem` with `equipado: true`, `calidad: 'estandar'` (unless specified)
- Unmatched strings become generic items with basic info
- All items get `cargaActual = cargaMaxima` (full ammo)

## Resistance Auto-Calculation

When armor is equipped/unequipped from inventory:
- `resistencias.corporal` updates to armor's R value (adjusted by quality: excelente +1)
- Armor protection properties are stored and shown in Ficha tab Resistencias section
- If no armor equipped, corporal resistance = 0

## Size Restrictions Summary (from rulebook)

- Objects size L+ require two hands
- Objects XL cannot be concealed
- Energy shield limits cargo volume (see table above)
- Armor-shield compatibility (E/A/B system)
- Weapon Fuerza requirement: -1 meta per point below minimum

## Migration

For existing characters without `inventario`:
- On load, if `inventario` is undefined, build it from `armas` + `equipo` + `otrasPertenencias`
- Set all migrated items as `equipado: true`, `calidad: 'estandar'`
- Migrate `dinero.recursos` to new Recurso format with `ubicacion: ''`, `periodo: 'mensual'`
