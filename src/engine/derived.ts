import type { Character } from '@/types/character'

/** Vitalidad = Tamaño + Constitución + Voluntad + Fe + Nivel */
export function calcVitality(char: Pick<Character, 'tamano' | 'caracteristicas' | 'nivel'>): number {
  return (
    char.tamano +
    char.caracteristicas.constitucion +
    char.caracteristicas.voluntad +
    char.caracteristicas.fe +
    char.nivel
  )
}

/** Impulso = max(Fuerza, Inteligencia, Presencia) + Nivel */
export function calcImpulse(char: Pick<Character, 'caracteristicas' | 'nivel'>): number {
  return (
    Math.max(
      char.caracteristicas.fuerza,
      char.caracteristicas.inteligencia,
      char.caracteristicas.presencia,
    ) + char.nivel
  )
}

/** Reanimación = Tamaño + Nivel */
export function calcReanimation(char: Pick<Character, 'tamano' | 'nivel'>): number {
  return char.tamano + char.nivel
}

/** Banco de PV: 5 PV base, +5 en cada nivel par */
export function calcBankCapacity(nivel: number): number {
  // Level 1 = 5, Level 2 = 10, Level 3 = 10, Level 4 = 15, etc.
  return 5 + Math.floor(nivel / 2) * 5
}

/** Usos de reanimación e impulso según nivel: 1 base, +1 en niveles 4, 7, 10 */
export function calcUsosMax(nivel: number): number {
  let usos = 1
  if (nivel >= 4) usos++
  if (nivel >= 7) usos++
  if (nivel >= 10) usos++
  return usos
}

/** Tecgnosis = Nivel (siempre) */
export function calcTecgnosis(nivel: number): number {
  return nivel
}

/** Puntuación máxima de características/habilidades según nivel */
export function getMaxStatValue(nivel: number): number {
  if (nivel >= 10) return 10
  if (nivel >= 2) return 9
  return 8
}
