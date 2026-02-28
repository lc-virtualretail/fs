import type { CharacteristicKey, ClassId, FactionId, SkillKey } from './character'

// ─── Species Definition ───

export interface SpeciesDefinition {
  id: string
  nombre: string
  descripcion: string
  tamano: number
  velocidad: number | string // string for Vorox multi-speed
  derechosDeNacimiento: string[]
  restricciones: string[]
  caracteristicasForzadas?: {
    primaria?: CharacteristicKey[]  // Must choose one of these
    secundaria?: CharacteristicKey[]
  }
  maxCaracteristicas?: Partial<Record<CharacteristicKey, number>> // Species-specific max overrides
}

// ─── Class Definition ───

export interface ClassEducation {
  competenciasFijas: string[]
  competenciasEleccion: string[][] // Each sub-array is a group to pick one from
  caracteristicas: CharacteristicBonus[]
  habilidades: SkillBonus[]
  beneficioArquetipico: string
  beneficiosDeClase: string[]
}

export interface ClassDefinition {
  id: ClassId
  nombre: string
  descripcion: string
  educacion: ClassEducation
}

// ─── Faction Definition ───

export interface FactionDefinition {
  id: FactionId
  nombre: string
  clase: ClassId
  descripcion: string
  bendicion: { nombre: string; efecto: string }
  maldicion: { nombre: string; efecto: string }
  premioMaterial: string
  vocacionFavorecida: string
  aprendizaje: {
    competenciasFijas: string[]
    competenciasEleccion: string[][] // Each sub-array is a group to pick one from
    caracteristicas: CharacteristicBonus[]
    habilidades: SkillBonus[]
    beneficio: string
  }
}

// ─── Vocation Definition ───

export interface VocationDefinition {
  id: string
  nombre: string
  clase: ClassId[] // Which classes can choose this vocation
  descripcion: string
  libre: boolean // Available to all classes
  especial?: string // Special rule (e.g. free Psi/Teurgy point for Psíquico/Teúrgo)
  carrera: {
    competencias: string[][] // Each inner array = one slot; player picks one option per slot
    caracteristicas: CharacteristicBonus[]
    habilidades: SkillBonus[]
    beneficios: string[]
    equipo: string[]
  }
}

// ─── Benefit Definition ───

export type BenefitType =
  | 'impetu'         // Ímpetu
  | 'privilegio'     // Privilegio
  | 'capacidad'      // Capacidad
  | 'austeridad'     // Austeridad
  | 'poder'          // Poder
  | 'ciberdispositivo' // Ciberdispositivo

export interface BenefitDefinition {
  id: string
  nombre: string
  tipo: BenefitType
  origen: 'clase' | 'vocacion' | 'libre'
  requisitos: string
  descripcion: string
}

// ─── Shared Types ───

export interface CharacteristicBonus {
  caracteristica: CharacteristicKey
  valor: number
  alternativas?: CharacteristicKey[] // If present, user chooses one
}

export interface SkillBonus {
  habilidad: SkillKey
  valor: number
  alternativas?: SkillKey[] // If present, user chooses one
}

// ─── Level Progression ───

export interface LevelProgression {
  nivel: number
  competencias: number
  caracteristicas: number
  beneficioClase: boolean  // Odd levels
  beneficioVocacion: boolean // Every level
  habilidades: number
  vitalidad: number       // Always +1
  reanimacionUsoExtra: boolean  // Levels 4, 7, 10
  impulsoUsoExtra: boolean      // Levels 4, 7, 10
  bancoIncremento: number       // +5 on even levels, 0 on odd
}

// ─── Skill Metadata ───

export interface SkillDefinition {
  key: SkillKey
  nombre: string
  valorBase: number
  restringida: boolean
  caracteristicasAsociadas: CharacteristicKey[]
}
