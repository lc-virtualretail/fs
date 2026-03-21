/**
 * Utilities for competency sub-choice handling.
 * Used across character creation steps wherever competency strings
 * require the player to specify a sub-category.
 */
import { COMPETENCY_RESTRICTIONS } from '@/data/competencies'

export type SubChoice =
  | { type: 'buttons'; options: string[]; resolveToSub?: boolean }
  | { type: 'text'; placeholder: string }

/**
 * Bare category names (no parenthetical) that expand into sub-choices.
 * Used when data files reference a category like 'Saber Médico' and the
 * player must pick a specific competency from it.
 *
 * resolveToSub: when true, the resolved name is just the sub-option
 * (e.g. 'Saber Médico' + 'Cirugía' → 'Cirugía').
 * When false, uses wrapped format (e.g. 'Artes Escénicas' + 'Canto' → 'Artes Escénicas (Canto)').
 */
const bareCategorySubChoices: Record<string, { options: string[]; resolveToSub: boolean }> = {
  'Armas a Distancia': {
    options: ['Balas', 'Energía', 'Artefacto (elige artefacto)', 'Tiro con Arco'],
    resolveToSub: false,
  },
  'Armamento Pesado': {
    options: ['Artillería', 'Artillería Montada', 'Demoliciones'],
    resolveToSub: false,
  },
  'Artes Escénicas': {
    options: ['Canto', 'Danza', 'Magia', 'Música', 'Oratoria', 'Teatro'],
    resolveToSub: false,
  },
  'Saber Artístico': {
    options: ['Escritura', 'Escultura', 'Linterna Mágica', 'Pintura', 'Poesía'],
    resolveToSub: false,
  },
  'Saber Científico': {
    options: ['Ciencias Aplicadas', 'Ciencias de la Vida', 'Ciencias Naturales'],
    resolveToSub: false,
  },
  'Saber Médico': {
    options: ['Cirugía', 'Enfermedades', 'Tortura', 'Venenos'],
    resolveToSub: true,
  },
  'Saber de Oficios': {
    options: [
      'Arquitectura', 'Carpintería', 'Cartografía', 'Cerámica',
      'Cerrajería', 'Cocina', 'Herrería', 'Joyería',
      'Marroquinería', 'Mampostería', 'Sastrería', 'Tejeduría',
    ],
    resolveToSub: true,
  },
  'Saber de Usos': {
    options: ['Bajos Fondos', 'Usos de la Catedral', 'Usos de la Corte', 'Usos del Vulgo'],
    resolveToSub: true,
  },
  'Saber de Facción': {
    options: [
      'al-Malik', 'Decados', 'Hawkwood', 'Hazat', 'Li Halan',
      'Hermanos de Batalla', 'Orden Eskatónica', 'Ortodoxia',
      'Santuario de Aeón', 'Templo Avesti',
      'Aurigas', 'Carroñeros', 'Ingenieros', 'Magistrados',
      'La Asamblea', 'Los Desposeídos', 'ODA',
      'Sociedad de San Pablo', 'Vagabundos', 'Bárbaros Vuldrok',
    ],
    resolveToSub: false,
  },
  'Saber Alienígena': {
    options: ['Obun', 'Ukar', 'Vorox', 'Etyri', 'Gannok', 'Shantor'],
    resolveToSub: false,
  },
  'Saber Animal': {
    options: ['Mundos Conocidos', 'Territorio Bárbaro'],
    resolveToSub: false,
  },
  'Saber de Red de Salto': {
    options: ['Mundos Conocidos', 'Territorio Bárbaro'],
    resolveToSub: false,
  },
  'Saber Tecnológico': {
    options: ['NT5', 'NT6', 'NT7', 'NT8'],
    resolveToSub: false,
  },
  'Transporte': {
    options: [
      'Monta', 'Vehículos Acuáticos', 'Vehículos Aéreos',
      'Vehículos de Animales', 'Vehículos de Guerra',
      'Vehículos Espaciales', 'Vehículos Terrestres',
    ],
    resolveToSub: true,
  },
}

/**
 * Known sub-types for competencies that use the (cualquiera)/(a elegir) pattern.
 * When matched, buttons are shown instead of a free-text input.
 *
 * resolveToSub: when true, resolved name is just the chosen option.
 */
const knownSubTypes: Record<string, { options: string[]; resolveToSub: boolean }> = {
  'Armadura': { options: ['Combate', 'Guerra'], resolveToSub: false },
  'Instrumento Musical': {
    options: ['Cuerda', 'Viento madera', 'Percusión', 'Teclado', 'Viento metal'],
    resolveToSub: false,
  },
  'Saber Alienígena': {
    options: ['Obun', 'Ukar', 'Vorox', 'Etyri', 'Gannok', 'Shantor'],
    resolveToSub: false,
  },
  'Saber Animal': {
    options: ['Mundos Conocidos', 'Territorio Bárbaro'],
    resolveToSub: false,
  },
  'Saber de Red de Salto': {
    options: ['Mundos Conocidos', 'Territorio Bárbaro'],
    resolveToSub: false,
  },
  'Saber Tecnológico': {
    options: ['NT5', 'NT6', 'NT7', 'NT8'],
    resolveToSub: false,
  },
  'Oficio': {
    options: [
      'Arquitectura', 'Carpintería', 'Cartografía', 'Cerámica',
      'Cerrajería', 'Cocina', 'Herrería', 'Joyería',
      'Marroquinería', 'Mampostería', 'Sastrería', 'Tejeduría',
    ],
    resolveToSub: true,
  },
  'Ciencias': {
    options: ['Ciencias Aplicadas', 'Ciencias de la Vida', 'Ciencias Naturales'],
    resolveToSub: true,
  },
  'Ciencia': {
    options: ['Ciencias Aplicadas', 'Ciencias de la Vida', 'Ciencias Naturales'],
    resolveToSub: true,
  },
  'Saber de Facción': {
    options: [
      'al-Malik', 'Decados', 'Hawkwood', 'Hazat', 'Li Halan',
      'Hermanos de Batalla', 'Orden Eskatónica', 'Ortodoxia',
      'Santuario de Aeón', 'Templo Avesti',
      'Aurigas', 'Carroñeros', 'Ingenieros', 'Magistrados',
      'La Asamblea', 'Los Desposeídos', 'ODA',
      'Sociedad de San Pablo', 'Vagabundos', 'Bárbaros Vuldrok',
    ],
    resolveToSub: false,
  },
  'Saber': {
    options: [
      'Saber Alienígena', 'Saber Animal', 'Saber Artístico',
      'Saber Científico', 'Saber de Facción', 'Saber de Historia',
      'Saber de Oficios', 'Saber de Red de Salto', 'Saber de Usos',
      'Saber Marcial', 'Saber Médico', 'Saber Oculto',
      'Saber Planetario', 'Saber Religioso', 'Saber Tecnológico',
    ],
    resolveToSub: true,
  },
}

/**
 * Returns the sub-choice descriptor for a competency string, or null if
 * the competency is already fully specified.
 *
 * Handles:
 *  - Bare category names (e.g. "Saber Médico", "Armas a Distancia") → buttons
 *  - "cualquiera" / "a elegir" / "elegir" patterns → buttons (if known) or text
 *  - Slash/o-separated options: "(Balas/Energía)", "(Combate o Guerra)" → buttons
 */
export function getSubChoice(comp: string): SubChoice | null {
  // Check bare category names first
  const bare = bareCategorySubChoices[comp]
  if (bare) {
    return { type: 'buttons', options: bare.options, resolveToSub: bare.resolveToSub }
  }

  // Check for parenthetical content
  const match = comp.match(/\(([^)]+)\)/)
  if (!match) return null
  const content = match[1] ?? ''

  if (content === 'cualquiera' || content.includes('elegir') || content.includes('elige')) {
    const base = comp.replace(/\s*\([^)]+\)/, '').trim()
    const known = knownSubTypes[base]
    if (known) {
      return { type: 'buttons', options: known.options, resolveToSub: known.resolveToSub }
    }
    return { type: 'text', placeholder: `Especifica ${base}…` }
  }

  const opts = content.split(/\/| o /).map(s => s.trim()).filter(Boolean)
  if (opts.length > 1) return { type: 'buttons', options: opts }

  return null
}

/**
 * Returns a clean display label for a competency button.
 * Strips the parenthetical hint when a sub-choice UI will handle the selection.
 */
export function getDisplayLabel(comp: string): string {
  const sub = getSubChoice(comp)
  if (sub?.type === 'buttons') return comp.replace(/\s*\([^)]+\)/, '').trim()
  return comp
}

/**
 * Resolves the final saved competency name given a base option and a sub-choice.
 */
export function resolveWithSub(chosen: string, sub: string | undefined): string {
  if (!sub) return chosen

  const sc = getSubChoice(chosen)
  if (sc?.type === 'buttons' && sc.resolveToSub) return sub

  // Wrap in parenthetical
  if (chosen.includes('(')) return chosen.replace(/\([^)]+\)/, `(${sub})`)
  return `${chosen} (${sub})`
}

/**
 * Checks if a specific resolved competency is available given the character's
 * current class, faction, and/or vocation. Unrestricted competencies always return true.
 */
export function isCompetencyAvailable(
  resolvedName: string,
  clase?: string,
  faccion?: string,
  vocacion?: string,
): boolean {
  const allowed = COMPETENCY_RESTRICTIONS[resolvedName]
  if (!allowed) return true
  return [clase, faccion, vocacion].some(id => id != null && allowed.includes(id))
}

/**
 * Filters a list of base competencies keeping only those available to the character.
 * For entries with sub-choices, checks if at least one sub-option is available.
 */
export function filterAvailableCompetencies(
  comps: string[],
  clase?: string,
  faccion?: string,
  vocacion?: string,
): string[] {
  return comps.filter(comp => {
    const sub = getSubChoice(comp)
    if (sub?.type === 'buttons') {
      // Category: available if at least one sub-option passes
      return sub.options.some(opt => {
        const resolved = resolveWithSub(comp, opt)
        return isCompetencyAvailable(resolved, clase, faccion, vocacion)
      })
    }
    return isCompetencyAvailable(comp, clase, faccion, vocacion)
  })
}

/**
 * Filters sub-choice options, removing restricted ones the character can't access.
 */
export function filterSubChoiceOptions(
  baseComp: string,
  options: string[],
  clase?: string,
  faccion?: string,
  vocacion?: string,
): string[] {
  return options.filter(opt => {
    const resolved = resolveWithSub(baseComp, opt)
    return isCompetencyAvailable(resolved, clase, faccion, vocacion)
  })
}
