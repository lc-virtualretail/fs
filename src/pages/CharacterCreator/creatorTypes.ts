import type {
  Characteristics,
  Skills,
  CharacteristicKey,
  SkillKey,
  SpeciesId,
  ClassId,
  FactionId,
  CompetencyEntry,
  BenefitEntry,
} from '@/types/character'

// ─── Level-Up Types ───

export interface LevelUpChoice {
  level: number
  charBonuses: Partial<Record<CharacteristicKey, number>>
  skillBonuses: Partial<Record<SkillKey, number>>
  psiBonus: number          // shares charPoints budget
  teurgiaBonus: number      // shares charPoints budget
  competency: string        // resolved name
  competencySub: string     // sub-choice if needed
  vocationBenefit: string
  classBenefit: string      // empty if even level
}

export function getLevelBudget(level: number) {
  const isEven = level % 2 === 0
  return {
    charPoints: isEven ? 2 : 1,
    skillPoints: isEven ? 3 : 2,
    hasClassBenefit: !isEven && level >= 3,
  }
}

export function createEmptyLevelUpChoice(level: number): LevelUpChoice {
  return {
    level,
    charBonuses: {},
    skillBonuses: {},
    psiBonus: 0,
    teurgiaBonus: 0,
    competency: '',
    competencySub: '',
    vocationBenefit: '',
    classBenefit: '',
  }
}
import { DEFAULT_CHARACTERISTICS, DEFAULT_SKILLS } from '@/types/character'

// ─── Wizard Step IDs ───

export const STEPS = [
  'narrative',
  'species',
  'class',
  'faction',
  'vocation',
  'customization',
  'levelup',
  'summary',
] as const

export type StepId = (typeof STEPS)[number]

export const STEP_LABELS: Record<StepId, string> = {
  narrative: 'Narrativa',
  species: 'Especie',
  class: 'Clase',
  faction: 'Facción',
  vocation: 'Vocación',
  customization: 'Personalización',
  levelup: 'Niveles',
  summary: 'Resumen',
}

// ─── Step Snapshots (for safe backtracking) ───

export interface StepSnapshot {
  caracteristicas: Characteristics
  habilidades: Skills
  competencias: CompetencyEntry[]
  beneficios: BenefitEntry[]
}

// ─── Draft State ───

export interface CharacterDraft {
  // Narrative
  nombre: string
  concepto: string
  planeta: string
  fechaNacimiento: string
  descripcionFisica: string
  personalidad: string
  trasfondo: string

  // Species
  especie: SpeciesId | ''
  tamano: number
  velocidad: number | string
  caracteristicaPrimaria: CharacteristicKey | ''
  caracteristicaSecundaria: CharacteristicKey | ''
  derechosDeNacimiento: string[]
  donIluminacion: 'psi' | 'teurgia' | ''

  // Class
  clase: ClassId | ''

  // Faction
  faccion: FactionId | ''
  bendicionNombre: string
  bendicionEfecto: string
  maldicionNombre: string
  maldicionEfecto: string
  premioMaterial: string

  // Vocation
  vocacion: string

  // Accumulated stats
  caracteristicas: Characteristics
  habilidades: Skills

  // Accumulated lists
  competencias: CompetencyEntry[]
  beneficios: BenefitEntry[]

  // Customization
  freeCompetency: string
  freeBenefit: string
  afliccion: string
  extraBenefit: string // if affliction chosen

  // Level-up (optional, default level 1)
  nivelObjetivo: number
  levelUpChoices: LevelUpChoice[]

  // Equipment from vocation
  equipoVocacion: string[]

  // Snapshots: state BEFORE each step applied its bonuses (for safe backtracking)
  _snapshotPreClase?: StepSnapshot
  _snapshotPreFaccion?: StepSnapshot
  _snapshotPreVocacion?: StepSnapshot
  _snapshotPreCustomization?: StepSnapshot
  _snapshotPreLevelUp?: StepSnapshot
}

export function createEmptyDraft(): CharacterDraft {
  return {
    nombre: '',
    concepto: '',
    planeta: '',
    fechaNacimiento: '',
    descripcionFisica: '',
    personalidad: '',
    trasfondo: '',

    especie: '',
    tamano: 5,
    velocidad: 10,
    caracteristicaPrimaria: '',
    caracteristicaSecundaria: '',
    derechosDeNacimiento: [],
    donIluminacion: '',

    clase: '',
    faccion: '',
    bendicionNombre: '',
    bendicionEfecto: '',
    maldicionNombre: '',
    maldicionEfecto: '',
    premioMaterial: '',

    vocacion: '',

    caracteristicas: { ...DEFAULT_CHARACTERISTICS },
    habilidades: { ...DEFAULT_SKILLS },

    competencias: [],
    beneficios: [],

    freeCompetency: '',
    freeBenefit: '',
    afliccion: '',
    extraBenefit: '',

    nivelObjetivo: 1,
    levelUpChoices: [],

    equipoVocacion: [],
  }
}

// ─── Helpers ───

export function applyCharacteristicBonuses(
  chars: Characteristics,
  bonuses: { key: CharacteristicKey; value: number }[],
): Characteristics {
  const result = { ...chars }
  for (const b of bonuses) {
    result[b.key] += b.value
  }
  return result
}

export function applySkillBonuses(
  skills: Skills,
  bonuses: { key: SkillKey; value: number }[],
): Skills {
  const result = { ...skills }
  for (const b of bonuses) {
    result[b.key] += b.value
  }
  return result
}

/** Clamp stats that exceed the max and return total excess points */
export function calcExcess(
  chars: Characteristics,
  maxValue: number,
): { excess: number; keys: CharacteristicKey[] } {
  let excess = 0
  const keys: CharacteristicKey[] = []
  for (const [key, val] of Object.entries(chars)) {
    if (val > maxValue) {
      excess += val - maxValue
      keys.push(key as CharacteristicKey)
    }
  }
  return { excess, keys }
}

export function calcSkillExcess(
  skills: Skills,
  maxValue: number,
): { excess: number; keys: SkillKey[] } {
  let excess = 0
  const keys: SkillKey[] = []
  for (const [key, val] of Object.entries(skills)) {
    if (val > maxValue) {
      excess += val - maxValue
      keys.push(key as SkillKey)
    }
  }
  return { excess, keys }
}

// ─── Step Props ───

export interface StepProps {
  draft: CharacterDraft
  updateDraft: (updates: Partial<CharacterDraft>) => void
  goNext: () => void
  goBack: () => void
}
