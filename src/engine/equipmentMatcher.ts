// ─── Equipment Matcher ───
// Converts vocation/faction equipment strings into InventoryItem objects
// by matching against the equipment catalog.

import type { InventoryItem, ItemCalidad } from '@/types/character'
import { ALL_EQUIPMENT, type EquipmentItem } from '@/data/equipment'

// ─── Search Index ───

interface IndexEntry {
  nombreLower: string
  item: EquipmentItem
}

const searchIndex: IndexEntry[] = ALL_EQUIPMENT.map(item => ({
  nombreLower: item.nombre.toLowerCase(),
  item,
}))

// ─── Keyword Fallbacks ───
// Maps common short descriptions to canonical catalog names

const KEYWORD_FALLBACKS: [string, string][] = [
  ['escudo de energía de duelista', 'Escudo de energía de duelista'],
  ['escudo de energía', 'Escudo de energía estándar'],
  ['pistola láser', 'MarTech Amber'],
  ['pistola bláster', 'OSI Alembic'],
  ['fusil bláster', 'OSI Crucible'],
  ['fusil láser', 'MarTech Indigo'],
  ['estoque', 'Estoque'],
  ['espada', 'Espada'],
  ['cuchillo', 'Cuchillo'],
  ['sinteseda', 'Sinteseda'],
  ['jubón de cuero', 'Jubón de cuero'],
  ['cota de malla', 'Cota de malla de plástico'],
  ['medpac', 'Medpac personal'],
  ['revólver', 'Revólver medio típico (.40)'],
  ['subfusil', 'Subfusil típico (.40)'],
]

// ─── Quality Detection ───

const QUALITY_PATTERNS: [RegExp, ItemCalidad][] = [
  [/excelente/i, 'excelente'],
  [/maestra/i, 'maestra'],
  [/buena\s+calidad/i, 'buena'],
  [/\bbuena\b/i, 'buena'],
]

/** Detects item quality from a descriptive string. */
export function detectQuality(text: string): ItemCalidad {
  for (const [pattern, calidad] of QUALITY_PATTERNS) {
    if (pattern.test(text)) return calidad
  }
  return 'estandar'
}

// ─── Cleaning helpers ───

/** Removes quality phrases, meta bonuses, and parenthetical notes for matching. */
function cleanForMatching(text: string): string {
  let cleaned = text
  // Remove quality phrases
  cleaned = cleaned.replace(/\b(excelente|maestra|buena\s+calidad|buena|de\s+buena\s+calidad)\b/gi, '')
  // Remove meta bonus patterns like "(meta +1)"
  cleaned = cleaned.replace(/\(meta\s*[+-]?\d+\)/gi, '')
  // Remove parenthetical notes (ammo counts, descriptions)
  cleaned = cleaned.replace(/\([^)]*\)/g, '')
  // Remove filler words
  cleaned = cleaned.replace(/\b(arma|de|en\s+general\s+una?|por\s+lo\s+general\s+una?|calidad|un|una)\b/gi, '')
  // Collapse whitespace and trim
  cleaned = cleaned.replace(/\s+/g, ' ').trim()
  return cleaned
}

// ─── Catalog Matching ───

/** Finds a catalog item matching the given equipment text. Returns null if no match. */
export function findCatalogMatch(text: string): EquipmentItem | null {
  const textLower = text.toLowerCase()

  // 1. Try exact name match first
  const exact = searchIndex.find(e => e.nombreLower === textLower)
  if (exact) return exact.item

  // 2. Try keyword fallbacks (longest match first — array is ordered)
  for (const [keyword, catalogName] of KEYWORD_FALLBACKS) {
    if (textLower.includes(keyword)) {
      const match = searchIndex.find(e => e.item.nombre === catalogName)
      if (match) return match.item
    }
  }

  // 3. Clean the text and try substring matching against catalog
  const cleaned = cleanForMatching(text).toLowerCase()
  if (cleaned.length > 0) {
    // Try: catalog name is contained in cleaned text
    const containsMatch = searchIndex.find(e =>
      cleaned.includes(e.nombreLower)
    )
    if (containsMatch) return containsMatch.item

    // Try: cleaned text is contained in catalog name
    const reverseMatch = searchIndex.find(e =>
      e.nombreLower.includes(cleaned)
    )
    if (reverseMatch) return reverseMatch.item
  }

  return null
}

// ─── Ammo / Cargo Detection ───

/** Extracts extra magazine/charge count from parenthetical notes like "(3 cargadores)" or "(3 células de fusión)". */
function extractExtraAmmo(text: string): number {
  const match = text.match(/\((\d+)\s+(cargador|cargadores|célula|células|baterías?|cargas?)\b/i)
  return match?.[1] ? parseInt(match[1], 10) : 0
}

// ─── Item Builder ───

let nextId = 1

function generateId(): string {
  return `eq-${Date.now()}-${nextId++}`
}

/** Builds detalles from a catalog item by spreading all props except category and nombre. */
function buildDetalles(catalogItem: EquipmentItem): Record<string, unknown> {
  const { category: _cat, nombre: _nom, ...rest } = catalogItem
  return rest as Record<string, unknown>
}

/** Builds an InventoryItem from matched catalog item or creates a custom item. */
function buildItem(
  originalText: string,
  catalogItem: EquipmentItem | null,
  calidad: ItemCalidad,
  notas?: string,
): InventoryItem {
  if (catalogItem) {
    const detalles = buildDetalles(catalogItem)
    const municion = 'municion' in catalogItem && typeof catalogItem.municion === 'number'
      ? catalogItem.municion
      : undefined

    const extraAmmo = extractExtraAmmo(originalText)

    const item: InventoryItem = {
      id: generateId(),
      category: catalogItem.category,
      nombre: catalogItem.nombre,
      detalles,
      equipado: true,
      calidad,
    }

    if (municion !== undefined) {
      item.cargaActual = municion
      item.cargaMaxima = municion
      item.cargasExtra = extraAmmo
    }

    if (notas !== undefined) {
      item.notas = notas
    }

    return item
  }

  // Unmatched — custom item
  return {
    id: generateId(),
    category: 'entretenimiento',
    nombre: originalText,
    detalles: {},
    equipado: true,
    calidad,
    custom: true,
    notas: notas ?? undefined,
  }
}

// ─── Main Entry Point ───

/**
 * Converts vocation/faction equipment strings into InventoryItem objects.
 * Matches against the equipment catalog where possible; unmatched strings
 * become custom items.
 *
 * @param equipStrings - Array of equipment description strings from vocation
 * @param premioMaterial - Optional faction premio material string
 * @returns Array of InventoryItem objects
 */
export function convertEquipmentStrings(
  equipStrings: string[],
  premioMaterial?: string,
): InventoryItem[] {
  const items: InventoryItem[] = []

  for (const str of equipStrings) {
    const calidad = detectQuality(str)
    const match = findCatalogMatch(str)
    items.push(buildItem(str, match, calidad))
  }

  // Handle premio material separately
  if (premioMaterial) {
    const calidad = detectQuality(premioMaterial)
    const match = findCatalogMatch(premioMaterial)
    items.push(buildItem(
      premioMaterial,
      match,
      calidad,
      match ? undefined : 'Premio material de facción',
    ))
  }

  return items
}
