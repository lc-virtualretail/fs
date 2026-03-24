import type { Character, CompetencyEntry, InventoryItem, ItemCalidad } from '@/types/character'

// ─── Size System ───

const SIZE_UNITS: Record<string, number> = {
  XXS: 1,
  XS: 2,
  S: 4,
  M: 8,
  L: 16,
  XL: 32,
}

const SIZE_LABELS: Record<string, string> = {
  XXS: 'Diminuto',
  XS: 'Muy pequeño',
  S: 'Pequeño',
  M: 'Mediano',
  L: 'Grande',
  XL: 'Muy grande',
}

/** Converts a size code (XXS–XL) to cargo units. */
export function sizeToUnits(size: string): number {
  return SIZE_UNITS[size.toUpperCase()] ?? 0
}

/** Returns the Spanish label for a size code. */
export function sizeLabel(size: string): string {
  return SIZE_LABELS[size.toUpperCase()] ?? size
}

// ─── Tecgnosis Load ───

/** Counts equipped items with NT >= 5 for tecgnosis load. Armor counts as 1 max. Curiosidades are skipped. */
export function countTecgnosisLoad(inventario: InventoryItem[]): number {
  let count = 0
  let armorCounted = false

  for (const item of inventario) {
    if (!item.equipado) continue
    if (item.detalles['curiosidad'] === true) continue

    const nt = item.detalles['nt']
    if (typeof nt !== 'number' || nt < 5) continue

    if (item.category === 'armadura') {
      if (!armorCounted) {
        armorCounted = true
        count++
      }
    } else {
      count++
    }
  }

  return count
}

/** Returns true if tecgnosis load exceeds character level. */
export function isTecgnosisOverloaded(inventario: InventoryItem[], nivel: number): boolean {
  return countTecgnosisLoad(inventario) > nivel
}

// ─── Shield Cargo ───

interface CargoLimit {
  maxUnits: number
  label: string
}

const SHIELD_CARGO: Record<string, CargoLimit> = {
  antiguo: { maxUnits: 16, label: '1L' },
  'estándar': { maxUnits: 32, label: '1XL' },
  estandar: { maxUnits: 32, label: '1XL' },
  duelista: { maxUnits: 32, label: '1XL' },
  asalto: { maxUnits: 64, label: '2XL' },
  batalla: { maxUnits: 96, label: '3XL' },
}

/** Returns cargo limit {maxUnits, label} for a given energy shield name. */
export function getShieldCargoLimit(shieldName: string): CargoLimit | null {
  const key = shieldName.toLowerCase().trim()
  for (const [name, limit] of Object.entries(SHIELD_CARGO)) {
    if (key.includes(name)) return limit
  }
  return null
}

/** Sums size units of equipped items excluding armor, shields, and weapons (those are held/worn, not cargo). */
export function calcEquippedCargoUnits(inventario: InventoryItem[]): number {
  let total = 0
  for (const item of inventario) {
    if (!item.equipado) continue
    if (item.category === 'armadura' || item.category === 'escudo' || item.category === 'armaBalas' || item.category === 'armaCaC') continue

    const tamano = item.detalles['tamano']
    if (typeof tamano === 'string') {
      total += sizeToUnits(tamano)
    } else if (typeof tamano === 'number') {
      total += tamano
    }
  }
  return total
}

// ─── Armor-Shield Compatibility ───

/**
 * Checks if an armor is compatible with a given shield.
 * armorCompat is 'E' (estándar), 'A' (asalto), or 'B' (batalla).
 * Battle shield needs B. Assault needs A or B. Standard/duelist/ancient works with any.
 */
export function isArmorShieldCompatible(armorCompat: string, shieldName: string): boolean {
  const key = shieldName.toLowerCase().trim()

  if (key.includes('batalla')) {
    return armorCompat === 'B'
  }
  if (key.includes('asalto')) {
    return armorCompat === 'A' || armorCompat === 'B'
  }
  // estándar, duelista, antiguo — any armor works
  return true
}

// ─── Weapon Strength Penalty ───

/** Returns the strength penalty: max(0, weaponFue - characterFue). */
export function calcStrengthPenalty(weaponFue: number, characterFue: number): number {
  return Math.max(0, weaponFue - characterFue)
}

// ─── Quality ───

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

const QUALITY_META_BONUS: Record<ItemCalidad, number> = {
  excelente: 1,
  maestra: 0,
  buena: 0,
  estandar: 0,
  mediocre: 0,
  deficiente: 0,
  deteriorada: 0,
}

/** Returns price multiplier for a given quality tier. */
export function qualityPriceMult(calidad: ItemCalidad): number {
  return QUALITY_PRICE_MULT[calidad]
}

/** Returns resistance bonus for a given quality tier. */
export function qualityResistanceBonus(calidad: ItemCalidad): number {
  return QUALITY_RESISTANCE_BONUS[calidad]
}

/** Returns meta bonus for a given quality tier (excelente: +1, rest: 0). */
export function qualityMetaBonus(calidad: ItemCalidad): number {
  return QUALITY_META_BONUS[calidad]
}

// ─── Equipped Armor Helpers ───

/** Finds equipped armor and returns total resistance (base + quality bonuses). */
export function getEquippedArmorResistance(inventario: InventoryItem[]): number {
  const armor = inventario.find(i => i.category === 'armadura' && i.equipado)
  if (!armor) return 0

  const baseR = typeof armor.detalles['resistenciaCorporal'] === 'number'
    ? (armor.detalles['resistenciaCorporal'] as number)
    : 0

  return baseR + qualityResistanceBonus(armor.calidad) + qualityMetaBonus(armor.calidad)
}

/** Returns the caracteristicas (protections) string array from equipped armor. */
export function getEquippedArmorProtections(inventario: InventoryItem[]): string[] {
  const armor = inventario.find(i => i.category === 'armadura' && i.equipado)
  if (!armor) return []

  const protections = armor.detalles['caracteristicas']
  if (Array.isArray(protections)) {
    return protections.filter((p): p is string => typeof p === 'string')
  }
  if (typeof protections === 'string') {
    return [protections]
  }
  return []
}

// ─── Armor/Shield Competency Checks ───

export interface CompetencyWarning {
  item: string
  competencia: string
  penalidad: string
}

/**
 * Checks equipped armor and hand shields against character competencies.
 * Returns warnings for missing competencies (unfavorable Vigor/attack rolls).
 *
 * Rules:
 * - Civil armor: no competency needed
 * - Combat armor (combate): requires "Armadura de Combate"
 * - War armor (guerra): requires "Armadura de Guerra"
 * - Space armor (espacial): requires "Armadura de Guerra" + "Operaciones a Bordo"
 * - Hand shield: requires "Escudo de Mano"
 */
export function getCompetencyWarnings(
  inventario: InventoryItem[],
  competencias: CompetencyEntry[],
): CompetencyWarning[] {
  const warnings: CompetencyWarning[] = []
  const compNames = new Set(competencias.map(c => c.nombre))

  // Check both canonical and legacy name formats
  const hasArmorCombat = compNames.has('Armadura de Combate') || compNames.has('Armadura (Combate)')
  const hasArmorWar = compNames.has('Armadura de Guerra') || compNames.has('Armadura (Guerra)')

  for (const item of inventario) {
    if (!item.equipado) continue

    if (item.category === 'armadura') {
      const subtype = item.detalles['subtype'] as string | undefined
      if (subtype === 'combate' && !hasArmorCombat) {
        warnings.push({
          item: item.nombre,
          competencia: 'Armadura de Combate',
          penalidad: 'Tiradas de Vigor desfavorables',
        })
      } else if (subtype === 'guerra') {
        if (!hasArmorWar) {
          warnings.push({
            item: item.nombre,
            competencia: 'Armadura de Guerra',
            penalidad: 'Tiradas de Vigor desfavorables',
          })
        }
      } else if (subtype === 'espacial') {
        const missing: string[] = []
        if (!hasArmorWar) missing.push('Armadura de Guerra')
        if (!compNames.has('Operaciones a Bordo')) missing.push('Operaciones a Bordo')
        if (missing.length > 0) {
          warnings.push({
            item: item.nombre,
            competencia: missing.join(' + '),
            penalidad: 'Tiradas de Vigor desfavorables',
          })
        }
      }
    }

    if (item.category === 'escudoMano' && !compNames.has('Escudo de Mano')) {
      warnings.push({
        item: item.nombre,
        competencia: 'Escudo de Mano',
        penalidad: 'Tiradas de Vigor y de ataque desfavorables',
      })
    }
  }

  return warnings
}

// ─── Migration ───

let migrationCounter = 0

function generateMigrationId(): string {
  migrationCounter++
  return `migrated-${Date.now()}-${migrationCounter}`
}

/**
 * Converts old armas, equipo, and otrasPertenencias arrays into InventoryItem[].
 * Returns a new inventario array (does not mutate the character).
 */
export function migrateToInventory(
  character: Pick<Character, 'armas' | 'equipo' | 'otrasPertenencias'>
): InventoryItem[] {
  const items: InventoryItem[] = []

  // Armas → category 'armaBalas' with all fields as detalles
  for (const arma of character.armas) {
    items.push({
      id: generateMigrationId(),
      category: 'armaBalas',
      nombre: arma.nombre,
      detalles: {
        nt: arma.nt,
        meta: arma.meta,
        dano: arma.dano,
        fuerza: arma.fuerza,
        alcance: arma.alcance,
        cadenciaDeTiro: arma.cadenciaDeTiro,
        municion: arma.municion,
        caracteristicas: arma.caracteristicas,
      },
      equipado: true,
      calidad: 'estandar',
    })
  }

  // Equipo → generic items
  for (const eq of character.equipo) {
    items.push({
      id: generateMigrationId(),
      category: 'equipo',
      nombre: eq.nombre,
      detalles: {
        nt: eq.nt,
        tamano: eq.tamano,
      },
      equipado: true,
      calidad: 'estandar',
    })
  }

  // Otras pertenencias → non-equipped items
  for (const otra of character.otrasPertenencias) {
    items.push({
      id: generateMigrationId(),
      category: 'otro',
      nombre: otra.nombre,
      detalles: {
        lugar: otra.lugar,
      },
      equipado: false,
      calidad: 'estandar',
    })
  }

  return items
}
