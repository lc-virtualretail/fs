import type { LevelProgression } from '@/types/rules'

export const LEVEL_PROGRESSION: LevelProgression[] = [
  { nivel: 1,  competencias: 0, caracteristicas: 0,  beneficioClase: true,  beneficioVocacion: true,  habilidades: 0,  vitalidad: 0, reanimacionUsoExtra: false, impulsoUsoExtra: false, bancoIncremento: 0 },
  { nivel: 2,  competencias: 1, caracteristicas: 2,  beneficioClase: false, beneficioVocacion: true,  habilidades: 3,  vitalidad: 1, reanimacionUsoExtra: false, impulsoUsoExtra: false, bancoIncremento: 5 },
  { nivel: 3,  competencias: 1, caracteristicas: 1,  beneficioClase: true,  beneficioVocacion: true,  habilidades: 2,  vitalidad: 1, reanimacionUsoExtra: false, impulsoUsoExtra: false, bancoIncremento: 0 },
  { nivel: 4,  competencias: 1, caracteristicas: 2,  beneficioClase: false, beneficioVocacion: true,  habilidades: 3,  vitalidad: 1, reanimacionUsoExtra: true,  impulsoUsoExtra: true,  bancoIncremento: 5 },
  { nivel: 5,  competencias: 1, caracteristicas: 1,  beneficioClase: true,  beneficioVocacion: true,  habilidades: 2,  vitalidad: 1, reanimacionUsoExtra: false, impulsoUsoExtra: false, bancoIncremento: 0 },
  { nivel: 6,  competencias: 1, caracteristicas: 2,  beneficioClase: false, beneficioVocacion: true,  habilidades: 3,  vitalidad: 1, reanimacionUsoExtra: false, impulsoUsoExtra: false, bancoIncremento: 5 },
  { nivel: 7,  competencias: 1, caracteristicas: 1,  beneficioClase: true,  beneficioVocacion: true,  habilidades: 2,  vitalidad: 1, reanimacionUsoExtra: true,  impulsoUsoExtra: true,  bancoIncremento: 0 },
  { nivel: 8,  competencias: 1, caracteristicas: 2,  beneficioClase: false, beneficioVocacion: true,  habilidades: 3,  vitalidad: 1, reanimacionUsoExtra: false, impulsoUsoExtra: false, bancoIncremento: 5 },
  { nivel: 9,  competencias: 1, caracteristicas: 1,  beneficioClase: true,  beneficioVocacion: true,  habilidades: 2,  vitalidad: 1, reanimacionUsoExtra: false, impulsoUsoExtra: false, bancoIncremento: 0 },
  { nivel: 10, competencias: 1, caracteristicas: 2,  beneficioClase: false, beneficioVocacion: true,  habilidades: 3,  vitalidad: 1, reanimacionUsoExtra: true,  impulsoUsoExtra: true,  bancoIncremento: 5 },
]

export function getLevelProgression(nivel: number): LevelProgression | undefined {
  return LEVEL_PROGRESSION.find(lp => lp.nivel === nivel)
}
