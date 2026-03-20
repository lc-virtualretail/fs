import { db } from '@/db'
import type { Character } from '@/types/character'

// ─── Export Format ───

export interface FadingSunsExport {
  formatVersion: 1
  exportedAt: string
  characters: Omit<Character, 'id'>[]
}

// ─── Required fields for validation ───

const REQUIRED_STRING_FIELDS: (keyof Character)[] = [
  'nombre', 'especie', 'clase', 'faccion', 'vocacion',
]

const REQUIRED_NUMBER_FIELDS: (keyof Character)[] = [
  'nivel', 'tamano', 'velocidad',
]

const CHARACTERISTIC_KEYS = [
  'fuerza', 'destreza', 'constitucion',
  'inteligencia', 'percepcion', 'voluntad',
  'presencia', 'intuicion', 'fe',
] as const

const SKILL_KEYS = [
  'academia', 'alquimia', 'artes', 'charlataneria', 'conducir',
  'cuerpoACuerpo', 'curar', 'disfraz', 'disparar', 'empatia',
  'encanto', 'impresionar', 'interfaz', 'introspeccion', 'intrusion',
  'pelear', 'observar', 'oficios', 'pilotar', 'prestidigitacion',
  'representar', 'sigilo', 'supervivencia', 'tecnorredencion',
  'tratoConAnimales', 'vigor',
] as const

// ─── Build Export Payload ───

export function buildExportPayload(characters: Character[]): FadingSunsExport {
  return {
    formatVersion: 1,
    exportedAt: new Date().toISOString(),
    characters: characters.map(({ id: _, ...rest }) => rest),
  }
}

// ─── Download File ───

export function downloadExport(payload: FadingSunsExport, filename: string): void {
  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ─── Generate Filename ───

export function exportFilename(nombre?: string): string {
  const date = new Date().toISOString().slice(0, 10)
  if (nombre) {
    const safe = nombre.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ _-]/g, '').replace(/\s+/g, '-')
    return `${safe}-${date}.fsc.json`
  }
  return `personajes-${date}.fsc.json`
}

// ─── Validate Import ───

type ValidationResult =
  | { ok: true; data: FadingSunsExport }
  | { ok: false; error: string }

export function parseAndValidateImport(jsonString: string): ValidationResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonString)
  } catch {
    return { ok: false, error: 'El archivo no contiene JSON válido' }
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { ok: false, error: 'El archivo no tiene el formato esperado' }
  }

  const obj = parsed as Record<string, unknown>

  if (typeof obj.formatVersion === 'number' && obj.formatVersion > 1) {
    return { ok: false, error: 'Este archivo fue creado con una versión más reciente de la aplicación' }
  }

  if (!Array.isArray(obj.characters)) {
    return { ok: false, error: 'El archivo no tiene el formato esperado' }
  }

  if (obj.characters.length === 0) {
    return { ok: false, error: 'El archivo no contiene personajes' }
  }

  // Validate each character
  for (let i = 0; i < obj.characters.length; i++) {
    const c = obj.characters[i] as Record<string, unknown>
    const nombre = typeof c.nombre === 'string' ? c.nombre : `#${i + 1}`

    // Check required string fields
    for (const field of REQUIRED_STRING_FIELDS) {
      if (typeof c[field] !== 'string') {
        return { ok: false, error: `Personaje "${nombre}": falta el campo "${field}"` }
      }
    }

    // Check required number fields
    for (const field of REQUIRED_NUMBER_FIELDS) {
      if (typeof c[field] !== 'number') {
        return { ok: false, error: `Personaje "${nombre}": falta el campo "${field}"` }
      }
    }

    // Check characteristics object
    if (typeof c.caracteristicas !== 'object' || c.caracteristicas === null) {
      return { ok: false, error: `Personaje "${nombre}": faltan las características` }
    }
    const chars = c.caracteristicas as Record<string, unknown>
    for (const key of CHARACTERISTIC_KEYS) {
      if (typeof chars[key] !== 'number') {
        return { ok: false, error: `Personaje "${nombre}": falta la característica "${key}"` }
      }
    }

    // Check skills object
    if (typeof c.habilidades !== 'object' || c.habilidades === null) {
      return { ok: false, error: `Personaje "${nombre}": faltan las habilidades` }
    }
    const skills = c.habilidades as Record<string, unknown>
    for (const key of SKILL_KEYS) {
      if (typeof skills[key] !== 'number') {
        return { ok: false, error: `Personaje "${nombre}": falta la habilidad "${key}"` }
      }
    }
  }

  return { ok: true, data: parsed as FadingSunsExport }
}

// ─── Import Characters to DB ───

export async function importCharacters(
  characters: Omit<Character, 'id'>[]
): Promise<number> {
  const now = new Date().toISOString()
  const withIds = characters.map(c => ({
    ...c,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }))
  await db.characters.bulkAdd(withIds)
  return withIds.length
}
