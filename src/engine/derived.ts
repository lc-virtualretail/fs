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

/**
 * Resistencia Mental = rangos sociales (+2 cada uno) + beneficios específicos.
 * Los rangos sociales son: Título Nobiliario, Ordenación Religiosa,
 * Cargo Gremial, Reputación Profesional.
 * Beneficios que dan +2 incondicional: Mente Estoica, Sabio.
 */
const RANK_BENEFITS = ['Título Nobiliario', 'Ordenación Religiosa', 'Cargo Gremial', 'Reputación Profesional']
const MENTAL_FLAT_BENEFITS = ['Mente Estoica', 'Sabio']

export function calcMentalResistance(beneficios: { nombre: string }[]): number {
  let total = 0
  for (const b of beneficios) {
    if (RANK_BENEFITS.some(r => b.nombre.startsWith(r))) total += 2
    if (MENTAL_FLAT_BENEFITS.includes(b.nombre)) total += 2
  }
  return total
}

/**
 * Resistencia Espiritual = austeridades (+2, NO se acumulan entre sí).
 * Si tienes al menos una austeridad, R.Espiritual = 2.
 */
const AUSTERITY_BENEFITS = [
  'Armadura de Pureza', 'Condicionamiento Mental', 'Conocimiento Wyrd',
  'Incubación', 'Resurgir de las Cenizas', 'Voto de Pobreza',
]

export function calcSpiritualResistance(beneficios: { nombre: string }[]): number {
  return beneficios.some(b => AUSTERITY_BENEFITS.includes(b.nombre)) ? 2 : 0
}
