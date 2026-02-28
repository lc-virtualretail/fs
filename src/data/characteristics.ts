import type { CharacteristicKey } from '@/types/character'

export interface CharacteristicMeta {
  key: CharacteristicKey
  nombre: string
  abreviatura: string
  categoria: 'cuerpo' | 'mente' | 'espiritu'
  funcion: 'potencia' | 'agilidad' | 'fortaleza'
}

export const CHARACTERISTICS: CharacteristicMeta[] = [
  // Cuerpo
  { key: 'fuerza',       nombre: 'Fuerza',       abreviatura: 'FUE', categoria: 'cuerpo',   funcion: 'potencia' },
  { key: 'destreza',     nombre: 'Destreza',     abreviatura: 'DES', categoria: 'cuerpo',   funcion: 'agilidad' },
  { key: 'constitucion', nombre: 'Constitución', abreviatura: 'CON', categoria: 'cuerpo',   funcion: 'fortaleza' },
  // Mente
  { key: 'inteligencia', nombre: 'Inteligencia', abreviatura: 'INT', categoria: 'mente',    funcion: 'potencia' },
  { key: 'percepcion',   nombre: 'Percepción',   abreviatura: 'PER', categoria: 'mente',    funcion: 'agilidad' },
  { key: 'voluntad',     nombre: 'Voluntad',     abreviatura: 'VOL', categoria: 'mente',    funcion: 'fortaleza' },
  // Espíritu
  { key: 'presencia',    nombre: 'Presencia',    abreviatura: 'PRE', categoria: 'espiritu', funcion: 'potencia' },
  { key: 'intuicion',    nombre: 'Intuición',    abreviatura: 'INTC', categoria: 'espiritu', funcion: 'agilidad' },
  { key: 'fe',           nombre: 'Fe',           abreviatura: 'FE',  categoria: 'espiritu', funcion: 'fortaleza' },
]

export const CHARACTERISTIC_CATEGORIES = [
  { id: 'cuerpo', nombre: 'Cuerpo', keys: ['fuerza', 'destreza', 'constitucion'] as CharacteristicKey[] },
  { id: 'mente', nombre: 'Mente', keys: ['inteligencia', 'percepcion', 'voluntad'] as CharacteristicKey[] },
  { id: 'espiritu', nombre: 'Espíritu', keys: ['presencia', 'intuicion', 'fe'] as CharacteristicKey[] },
]

export function getCharacteristicMeta(key: CharacteristicKey): CharacteristicMeta | undefined {
  return CHARACTERISTICS.find(c => c.key === key)
}
