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
import { DEFAULT_CHARACTERISTICS, DEFAULT_SKILLS } from '@/types/character'

// ─── Wizard Step IDs ───

export const STEPS = [
  'narrative',
  'species',
  'class',
  'faction',
  'vocation',
  'customization',
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
  summary: 'Resumen',
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

  // Equipment from vocation
  equipoVocacion: string[]
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
