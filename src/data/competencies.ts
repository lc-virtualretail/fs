/**
 * Master list of all competencies available in the game (Chapter 3 of the rulebook).
 * Used for free-choice dropdowns (e.g. Independiente's 2 free competencies).
 *
 * Competencies that need sub-specification (like "Armas a Distancia" or
 * "Hablar (idioma a elegir)") are handled by competencyUtils.getSubChoice().
 *
 * Categories used as selectable entries in data files (like "Saber Médico",
 * "Transporte") are NOT listed here — they appear as button options in the
 * fixed-choice UI and are handled by getSubChoice() returning sub-type buttons.
 * Instead, individual competencies are listed here.
 */
export const ALL_COMPETENCIES: string[] = [
  // — Armadura —
  'Armadura de Combate',
  'Armadura de Guerra',
  'Escudo de Mano',

  // — Armas a Distancia (sub-choice: Balas, Energía, Artefacto, Tiro con Arco) —
  'Armas a Distancia',

  // — Armas Cuerpo a Cuerpo —
  'Armas Militares',
  'Artefactos Cuerpo a Cuerpo (elige artefacto)',

  // — Armamento Pesado (wrapped sub-types) —
  'Armamento Pesado',

  // — Instrumento Musical (sub-choice: familias) —
  'Instrumento Musical (a elegir)',

  // — Máquinas Pensantes —
  'Máquinas Pensantes',

  // — Transporte (sub-choice: vehicle type) —
  'Transporte',

  // — Idiomas —
  'Hablar (idioma a elegir)',
  'Leer (idioma a elegir)',

  // — Operaciones —
  'Operaciones a Bordo',

  // — Saber Académico —
  'Saber Alienígena (a elegir)',
  'Saber Animal (a elegir)',
  'Saber de Facción (a elegir)',
  'Saber de Historia',
  'Saber de Red de Salto (a elegir)',
  'Saber Marcial',
  'Saber Oculto',
  'Saber Planetario (a elegir)',
  'Saber Religioso',

  // — Saber Artístico (wrapped sub-types) —
  'Saber Artístico',

  // — Saber Científico (wrapped sub-types) —
  'Saber Científico',

  // — Saber de Oficios (sub-choice: crafts) —
  'Saber de Oficios',

  // — Saber de Usos (sub-choice: social milieu) —
  'Saber de Usos',

  // — Artes Escénicas (sub-choice: performing arts) —
  'Artes Escénicas',

  // — Saber Médico (sub-choice: specialization) —
  'Saber Médico',

  // — Saber Tecnológico (wrapped sub-types: NT5–NT8) —
  'Saber Tecnológico',

  // — Otros —
  'Inteligencia Artificial (IA)',
  'Terraformación',
]

/**
 * Restriction map: competency name → list of allowed class/faction/vocation IDs.
 * If a competency is NOT in this map, it's unrestricted (anyone can learn it).
 *
 * Keys use RESOLVED names for sub-types (e.g. 'Armas a Distancia (Energía)').
 * Values include class IDs ('noble', 'mercader'), faction IDs ('desposeidos'),
 * and vocation IDs ('hermano-de-batalla', 'mercenario', etc.).
 *
 * "Liga Mercantil" from the book maps to clase 'mercader' (all guilds).
 */
export const COMPETENCY_RESTRICTIONS: Record<string, string[]> = {
  // — Armadura —
  'Armadura de Guerra': [
    'noble', 'mercader',
    'adjunto-imperial', 'adjunto-imperial-mercader', 'desposeidos',
    'hermano-de-batalla', 'mercenario', 'pirata', 'templario',
  ],

  // — Armas a Distancia —
  'Armas a Distancia (Energía)': [
    'noble', 'mercader',
    'adjunto-imperial', 'adjunto-imperial-mercader', 'amateur',
    'cadenero', 'cazarrecompensas', 'detective', 'espia', 'explorador',
    'hermano-de-batalla', 'inquisidor', 'mercenario', 'pirata',
    'recuperador', 'tecnorredentor', 'templario', 'trotamundos',
  ],

  // — Armas Cuerpo a Cuerpo —
  'Armas Militares': [
    'noble', 'mercader', 'independiente',
    'adjunto-imperial', 'adjunto-imperial-mercader', 'amateur',
    'cadenero', 'cazarrecompensas', 'espia', 'explorador',
    'hermano-de-batalla', 'ladron', 'mercenario', 'trotamundos',
    'piloto-estelar', 'pirata', 'templario',
  ],

  // — Armamento Pesado —
  'Armamento Pesado (Artillería)': [
    'noble', 'mercader',
    'hermano-de-batalla', 'mercenario',
  ],
  'Armamento Pesado (Artillería Montada)': [
    'noble', 'mercader',
    'adjunto-imperial', 'adjunto-imperial-mercader', 'cadenero',
    'explorador', 'hermano-de-batalla', 'mercenario',
    'piloto-estelar', 'pirata', 'trotamundos',
  ],
  'Armamento Pesado (Demoliciones)': [
    'noble', 'mercader',
    'adjunto-imperial', 'adjunto-imperial-mercader', 'cazarrecompensas',
    'espia', 'explorador', 'hermano-de-batalla', 'inquisidor',
    'ladron', 'mercenario', 'recuperador', 'tecnorredentor',
  ],

  // — Transporte —
  'Vehículos de Guerra': [
    'noble', 'mercader',
    'desposeidos', 'hermano-de-batalla', 'mercenario', 'explorador',
  ],
  'Vehículos Espaciales': [
    'noble', 'mercader',
    'adjunto-imperial', 'adjunto-imperial-mercader', 'espia',
    'hermano-de-batalla', 'mendicante', 'pirata', 'trotamundos',
  ],

  // — Saber Académico —
  'Saber Marcial': [
    'noble', 'mercader',
    'desposeidos', 'hermano-de-batalla', 'mercenario', 'explorador',
  ],

  // — Saber Científico —
  'Saber Científico (Ciencias Aplicadas)': [
    'mercader',
    'erudito', 'recuperador', 'tecnorredentor',
  ],
  'Saber Científico (Ciencias Naturales)': [
    'mercader',
    'erudito',
  ],

  // — Saber Médico —
  'Cirugía': [
    'sacerdote', 'mercader',
    'caballero-expedicionario', 'cadenero', 'entusiasta',
    'erudito', 'sanador',
  ],

  // — Saber Tecnológico —
  'Saber Tecnológico (NT6)': [
    'mercader',
    'adjunto-imperial', 'adjunto-imperial-mercader',
    'caballero-expedicionario', 'comerciante', 'entusiasta', 'espia',
    'hermano-de-batalla', 'ladron', 'ocultista', 'piloto-estelar',
    'recuperador', 'tecnorredentor', 'trotamundos',
  ],
  'Saber Tecnológico (NT7)': [
    'mercader',
    'adjunto-imperial', 'adjunto-imperial-mercader',
    'caballero-expedicionario', 'comerciante', 'entusiasta', 'espia',
    'hermano-de-batalla', 'ladron', 'ocultista', 'piloto-estelar',
    'recuperador', 'tecnorredentor', 'trotamundos',
  ],
  'Saber Tecnológico (NT8)': [
    'mercader',
    'piloto-estelar', 'recuperador', 'tecnorredentor',
  ],

  // — Otros —
  'Inteligencia Artificial (IA)': [
    'mercader',
    'espia', 'ocultista', 'recuperador', 'tecnorredentor',
  ],
  'Terraformación': [
    'mercader',
  ],
}
