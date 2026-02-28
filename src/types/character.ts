// ─── Enums & ID Types ───

export type SpeciesId = 'humano' | 'ur-obun' | 'ur-ukar' | 'vorox'

export type ClassId = 'noble' | 'sacerdote' | 'mercader' | 'independiente'

export type FactionId =
  // Noble houses
  | 'al-malik' | 'decados' | 'hawkwood' | 'hazat' | 'li-halan'
  // Church sects
  | 'hermanos-de-batalla' | 'orden-eskatonica' | 'ortodoxo-de-urth' | 'santuario-de-aeon' | 'templo-avesti'
  // Merchant guilds
  | 'aurigas' | 'carroneros' | 'ingenieros' | 'magistrados' | 'asamblea'
  // Independent societies
  | 'desposeidos' | 'oda' | 'san-pablo' | 'vagabundos' | 'vuldrok'

export type CharacteristicKey =
  | 'fuerza' | 'destreza' | 'constitucion'
  | 'inteligencia' | 'percepcion' | 'voluntad'
  | 'presencia' | 'intuicion' | 'fe'

export type SkillKey =
  | 'academia' | 'alquimia' | 'artes' | 'charlataneria' | 'conducir'
  | 'cuerpoACuerpo' | 'curar' | 'disfraz' | 'disparar' | 'empatia'
  | 'encanto' | 'impresionar' | 'interfaz' | 'introspeccion' | 'intrusion'
  | 'pelea' | 'observar' | 'oficios' | 'pilotar' | 'prestidigitacion'
  | 'representar' | 'sigilo' | 'supervivencia' | 'tecnorredencion'
  | 'tratoConAnimales' | 'vigor'

// ─── Sub-Structures ───

export interface Characteristics {
  // Cuerpo (Body)
  fuerza: number
  destreza: number
  constitucion: number
  // Mente (Mind)
  inteligencia: number
  percepcion: number
  voluntad: number
  // Espíritu (Spirit)
  presencia: number
  intuicion: number
  fe: number
}

export interface Skills {
  academia: number
  alquimia: number
  artes: number
  charlataneria: number
  conducir: number
  cuerpoACuerpo: number
  curar: number
  disfraz: number
  disparar: number
  empatia: number
  encanto: number
  impresionar: number
  interfaz: number
  introspeccion: number
  intrusion: number
  pelea: number
  observar: number
  oficios: number
  pilotar: number
  prestidigitacion: number
  representar: number
  sigilo: number
  supervivencia: number
  tecnorredencion: number
  tratoConAnimales: number
  vigor: number
}

export interface OccultTracker {
  psi: number
  ansia: number
  teurgia: number
  hubris: number
}

export interface Resistances {
  corporal: number
  mental: number
  espiritual: number
  corporalMod: number
  mentalMod: number
  espiritualMod: number
}

export interface ArmorData {
  nombre: string
  resistenciaCorporal: number
  protecciones: {
    blastr: boolean
    fuego: boolean
    endur: boolean
    laser: boolean
    desc: boolean
    golpe: boolean
    sonico: boolean
  }
}

export interface EnergyShield {
  nombre: string
  umbrales: number
  impactos: number
}

export interface Weapon {
  nombre: string
  nt: number
  meta: number
  dano: number
  fuerza: number
  alcance: string
  cadenciaDeTiro: string
  municion: number
  caracteristicas: string
}

export interface EquipmentItem {
  nombre: string
  nt: number
  tamano: number
}

export interface Money {
  efectivo: number
  recursos: { nombre: string; ganancias: number }[]
}

export interface ActionEntry {
  maniobra: string
  meta: number
  impacto: number
}

export interface BenefitEntry {
  nombre: string
  tipo: string
  origen: string
  descripcion: string
}

export interface CompetencyEntry {
  nombre: string
  origen: string
}

// ─── Main Character ───

export interface Character {
  id: string

  // Identity
  nombre: string
  planeta: string
  rango: string
  fechaNacimiento: string

  // Narrative
  concepto: string
  descripcionFisica: string
  personalidad: string
  trasfondo: string
  retrato: string | null

  // Species
  especie: SpeciesId
  tamano: number
  velocidad: number

  // Class
  clase: ClassId
  nivel: number

  // Faction
  faccion: FactionId
  bendicion: string
  maldicion: string

  // Vocation
  vocacion: string

  // Characteristics
  caracteristicaPrimaria: CharacteristicKey
  caracteristicaSecundaria: CharacteristicKey
  caracteristicas: Characteristics

  // Skills
  habilidades: Skills

  // Occult
  oculto: OccultTracker

  // Resistances
  resistencias: Resistances

  // Armor & Shield
  armadura: ArmorData | null
  escudoEnergia: EnergyShield | null

  // Vitality
  vitalidadMaxima: number
  vitalidadActual: number

  // Reanimations
  reanimacionesCantidad: number
  reanimacionesUsos: number
  reanimacionesUsosMax: number

  // VP Bank
  bancoPVCapacidad: number
  pvActuales: number
  pwActuales: number

  // Impulse
  impulsoCantidad: number
  impulsoUsos: number
  impulsoUsosMax: number

  // Actions
  acciones: ActionEntry[]

  // Benefits, Competencies, Birthrights
  beneficios: BenefitEntry[]
  competencias: CompetencyEntry[]
  derechosDeNacimiento: string[]

  // Equipment
  armas: Weapon[]
  equipo: EquipmentItem[]
  otrasPertenencias: { nombre: string; lugar: string }[]
  dinero: Money
  tecgnosis: number

  // Affliction
  afliccion: string | null

  // Notes
  notas: string

  // Metadata
  createdAt: string
  updatedAt: string
}

// ─── Defaults ───

export const DEFAULT_CHARACTERISTICS: Characteristics = {
  fuerza: 3,
  destreza: 3,
  constitucion: 3,
  inteligencia: 3,
  percepcion: 3,
  voluntad: 3,
  presencia: 3,
  intuicion: 3,
  fe: 3,
}

export const DEFAULT_SKILLS: Skills = {
  academia: 3,
  alquimia: 0,    // Restricted
  artes: 3,
  charlataneria: 3,
  conducir: 3,
  cuerpoACuerpo: 3,
  curar: 3,
  disfraz: 3,
  disparar: 3,
  empatia: 3,
  encanto: 3,
  impresionar: 3,
  interfaz: 0,    // Restricted
  introspeccion: 3,
  intrusion: 3,
  pelea: 3,
  observar: 3,
  oficios: 3,
  pilotar: 0,     // Restricted
  prestidigitacion: 3,
  representar: 3,
  sigilo: 3,
  supervivencia: 3,
  tecnorredencion: 3,
  tratoConAnimales: 3,
  vigor: 3,
}

export const RESTRICTED_SKILLS: SkillKey[] = ['alquimia', 'interfaz', 'pilotar']
