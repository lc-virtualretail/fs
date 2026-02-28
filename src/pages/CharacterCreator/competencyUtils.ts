/**
 * Utilities for competency sub-choice handling.
 * Used across character creation steps wherever competency strings
 * require the player to specify a sub-category.
 */

export type SubChoice =
  | { type: 'buttons'; options: string[] }
  | { type: 'text'; placeholder: string }

/**
 * Returns the sub-choice descriptor for a competency string, or null if
 * the competency is already fully specified.
 *
 * Handles:
 *  - Bare "Armas a Distancia" → 4 sub-type buttons
 *  - Slash/o-separated options: "(Balas/Energía)", "(Combate o Guerra)" → buttons
 *  - "cualquiera" / "a elegir" / "elegir" patterns → free text input
 */
export function getSubChoice(comp: string): SubChoice | null {
  if (comp === 'Armas a Distancia') {
    return { type: 'buttons', options: ['Balas', 'Energía', 'Artefacto (elige artefacto)', 'Tiro con Arco'] }
  }
  const match = comp.match(/\(([^)]+)\)/)
  if (!match) return null
  const content = match[1] ?? ''
  if (content === 'cualquiera' || content.includes('elegir')) {
    const base = comp.replace(/\s*\([^)]+\)/, '').trim()
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
  if (chosen === 'Armas a Distancia') return `Armas a Distancia (${sub})`
  return chosen.replace(/\([^)]+\)/, `(${sub})`)
}
