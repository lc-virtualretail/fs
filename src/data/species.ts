import type { SpeciesDefinition } from '@/types/rules'

export const SPECIES: SpeciesDefinition[] = [
  {
    id: 'humano',
    nombre: 'Humano',
    descripcion: 'La especie más extendida y numerosa de los Mundos Conocidos. Flexibles y adaptables.',
    tamano: 5,
    velocidad: 10,
    derechosDeNacimiento: [],
    restricciones: [],
  },
  {
    id: 'ur-obun',
    nombre: 'Ur-obun',
    descripcion: 'Psíquicos humanoides con una sociedad comunal y contemplativa.',
    tamano: 5,
    velocidad: 10,
    derechosDeNacimiento: [
      'Don de la iluminación: Comienzas con Psi 1 o Teúrgia 1.',
      'Sagacidad: Inteligencia y Voluntad pueden alcanzar 11 (tras nivel 10).',
      'Serenidad: +2 a la meta en tiradas para quitarte de encima estados de estrés.',
      'Hablar (lojmaa): Lengua materna como competencia.',
    ],
    restricciones: [],
    maxCaracteristicas: {
      inteligencia: 11,
      voluntad: 11,
    },
  },
  {
    id: 'ur-ukar',
    nombre: 'Ur-ukar',
    descripcion: 'Psíquicos humanoides con un pasado brutal.',
    tamano: 5,
    velocidad: 10,
    derechosDeNacimiento: [
      'Alerta: Percepción instintiva con olfato, oído y tacto.',
      'Don de la iluminación: Comienzas con Psi 1.',
      'Tacto sensible: Observar por tacto da más información.',
      'Hablar (uryari): Lengua materna como competencia.',
    ],
    restricciones: [],
  },
  {
    id: 'vorox',
    nombre: 'Vorox',
    descripcion: 'Gigantes de seis extremidades conocidos por su fiera lealtad.',
    tamano: 7,
    velocidad: '14/21/28', // 2 patas / 4 patas / 6 patas
    derechosDeNacimiento: [
      'Mordisco: Maniobra morder (3 puntos de daño).',
      'Brutal: Fuerza y Constitución pueden alcanzar 12 (tras nivel 10).',
      'Extremidades adicionales: 6 extremidades. Velocidad 14/21/28 m.',
      'Enorme: Tamaño 7. Ropa adaptada (precio +10%).',
      'Depredador: Tiradas de Supervivencia favorables cuando tienes hambre.',
      'Olfato sensible: Detectar y seguir olores sutiles.',
      'Hablar (voroxiano): Lengua materna como competencia.',
      'Zafio: Posibles tiradas desfavorables en influencia con desconocidos.',
    ],
    restricciones: [
      'Sin poderes ocultos: No puedes tener vocación de psíquico ni teúrgo.',
    ],
    caracteristicasForzadas: {
      primaria: ['fuerza', 'constitucion'], // Must choose one of these
    },
    maxCaracteristicas: {
      fuerza: 12,
      constitucion: 12,
    },
  },
]

export function getSpeciesById(id: string): SpeciesDefinition | undefined {
  return SPECIES.find(s => s.id === id)
}
