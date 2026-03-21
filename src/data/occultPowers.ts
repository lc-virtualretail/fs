// ─── Psychic Powers (Poderes Psíquicos) ───

export interface PsychicPower {
  senda: string
  nombre: string
  requisitoPsi: number
}

export const PSYCHIC_PATHS = [
  'Mano Lejana',
  'Augurio',
  'Psique',
  'Sexto Sentido',
  'Soma',
  'Arte Vis',
] as const

export const PSYCHIC_POWERS: PsychicPower[] = [
  // Mano Lejana (Psicoquinesis)
  { senda: 'Mano Lejana', nombre: 'Mano Alzadora', requisitoPsi: 1 },
  { senda: 'Mano Lejana', nombre: 'Mano Arrojadora', requisitoPsi: 2 },
  { senda: 'Mano Lejana', nombre: 'Mano Aplastante', requisitoPsi: 3 },
  { senda: 'Mano Lejana', nombre: 'Mano Duelista', requisitoPsi: 4 },
  { senda: 'Mano Lejana', nombre: 'Mano Concentrada', requisitoPsi: 5 },
  { senda: 'Mano Lejana', nombre: 'Muro Lejano', requisitoPsi: 6 },
  { senda: 'Mano Lejana', nombre: 'Zancada Aérea', requisitoPsi: 7 },
  { senda: 'Mano Lejana', nombre: 'Mano Demoledora', requisitoPsi: 8 },
  { senda: 'Mano Lejana', nombre: 'Danza Aérea', requisitoPsi: 9 },

  // Augurio (comienza en Psi 6)
  { senda: 'Augurio', nombre: 'Sombras que Fueron', requisitoPsi: 6 },
  { senda: 'Augurio', nombre: 'Sombras por Venir', requisitoPsi: 7 },
  { senda: 'Augurio', nombre: 'Voz del Pasado', requisitoPsi: 8 },
  { senda: 'Augurio', nombre: 'Oráculo', requisitoPsi: 9 },

  // Psique (Telepatía)
  { senda: 'Psique', nombre: 'Habla Mental', requisitoPsi: 1 },
  { senda: 'Psique', nombre: 'Intuir', requisitoPsi: 2 },
  { senda: 'Psique', nombre: 'Crear Sentimientos', requisitoPsi: 3 },
  { senda: 'Psique', nombre: 'Visión Mental', requisitoPsi: 4 },
  { senda: 'Psique', nombre: 'Búsqueda Mental', requisitoPsi: 5 },
  { senda: 'Psique', nombre: 'Grilletes Mentales', requisitoPsi: 6 },
  { senda: 'Psique', nombre: 'Estallido Cerebral', requisitoPsi: 7 },
  { senda: 'Psique', nombre: 'Simpatía', requisitoPsi: 8 },
  { senda: 'Psique', nombre: 'Titiritero', requisitoPsi: 9 },

  // Sexto Sentido (Percepción Extrasensorial)
  { senda: 'Sexto Sentido', nombre: 'Aguzar Sentidos', requisitoPsi: 1 },
  { senda: 'Sexto Sentido', nombre: 'Visión Sutil', requisitoPsi: 2 },
  { senda: 'Sexto Sentido', nombre: 'Premonición', requisitoPsi: 3 },
  { senda: 'Sexto Sentido', nombre: 'Visión Lejana', requisitoPsi: 4 },
  { senda: 'Sexto Sentido', nombre: 'Presencia Lejana', requisitoPsi: 5 },
  { senda: 'Sexto Sentido', nombre: 'Sentidos Compartidos', requisitoPsi: 6 },
  { senda: 'Sexto Sentido', nombre: 'Visión Wyrd', requisitoPsi: 7 },
  { senda: 'Sexto Sentido', nombre: 'Búsqueda', requisitoPsi: 8 },
  { senda: 'Sexto Sentido', nombre: 'Descarga Sensorial', requisitoPsi: 9 },

  // Soma (Control Corporal)
  { senda: 'Soma', nombre: 'Robustecer', requisitoPsi: 1 },
  { senda: 'Soma', nombre: 'Fortalecer', requisitoPsi: 2 },
  { senda: 'Soma', nombre: 'Agilizar', requisitoPsi: 3 },
  { senda: 'Soma', nombre: 'Endurecer', requisitoPsi: 4 },
  { senda: 'Soma', nombre: 'Moldear', requisitoPsi: 5 },
  { senda: 'Soma', nombre: 'Enmascarar', requisitoPsi: 6 },
  { senda: 'Soma', nombre: 'Recuperar', requisitoPsi: 7 },
  { senda: 'Soma', nombre: 'Ralentizar', requisitoPsi: 8 },
  { senda: 'Soma', nombre: 'Adaptar', requisitoPsi: 9 },

  // Arte Vis (Control de Energía)
  { senda: 'Arte Vis', nombre: 'Ojo Vis', requisitoPsi: 1 },
  { senda: 'Arte Vis', nombre: 'Drenaje Vis', requisitoPsi: 2 },
  { senda: 'Arte Vis', nombre: 'Flujo Vis', requisitoPsi: 3 },
  { senda: 'Arte Vis', nombre: 'Descarga Vis', requisitoPsi: 4 },
  { senda: 'Arte Vis', nombre: 'Escudo Vis', requisitoPsi: 5 },
  { senda: 'Arte Vis', nombre: 'Proyectil Vis', requisitoPsi: 6 },
  { senda: 'Arte Vis', nombre: 'Dinamo Vis', requisitoPsi: 7 },
  { senda: 'Arte Vis', nombre: 'Tormenta Vis', requisitoPsi: 8 },
  { senda: 'Arte Vis', nombre: 'Vis Primordial', requisitoPsi: 9 },
]

// ─── Theurgic Rites (Ritos Teúrgicos) ───

export interface TheurgicRite {
  categoria: string
  nombre: string
  requisitoTeurgia: number
}

export const THEURGIC_CATEGORIES = [
  'Ecuménico',
  'Hermanos de Batalla',
  'Orden Eskatónica',
  'Ortodoxia de Urth',
  'Santuario de Aeón',
  'Templo Avesti',
] as const

export const THEURGIC_RITES: TheurgicRite[] = [
  // Ecuménicos
  { categoria: 'Ecuménico', nombre: 'Bendición Sagrada del Profeta', requisitoTeurgia: 1 },
  { categoria: 'Ecuménico', nombre: 'Liturgia Devocional', requisitoTeurgia: 2 },
  { categoria: 'Ecuménico', nombre: 'Imposición de Manos', requisitoTeurgia: 3 },
  { categoria: 'Ecuménico', nombre: 'Expulsión Menor', requisitoTeurgia: 3 },
  { categoria: 'Ecuménico', nombre: 'Reprimenda del Profeta', requisitoTeurgia: 4 },
  { categoria: 'Ecuménico', nombre: 'Don del Púlpito', requisitoTeurgia: 5 },
  { categoria: 'Ecuménico', nombre: 'Juramento a los Santos', requisitoTeurgia: 5 },
  { categoria: 'Ecuménico', nombre: 'Lenguas de Babel', requisitoTeurgia: 6 },
  { categoria: 'Ecuménico', nombre: 'Justa Asignación de Penitencia', requisitoTeurgia: 7 },
  { categoria: 'Ecuménico', nombre: 'Santificación', requisitoTeurgia: 7 },
  { categoria: 'Ecuménico', nombre: 'Escudo de Fe', requisitoTeurgia: 8 },
  { categoria: 'Ecuménico', nombre: 'Salvación Providencial', requisitoTeurgia: 9 },

  // Hermanos de Batalla
  { categoria: 'Hermanos de Batalla', nombre: 'Receptáculo del Alma', requisitoTeurgia: 1 },
  { categoria: 'Hermanos de Batalla', nombre: 'Mano Guiada por la Justicia', requisitoTeurgia: 2 },
  { categoria: 'Hermanos de Batalla', nombre: 'Armadura del Pancreator', requisitoTeurgia: 3 },
  { categoria: 'Hermanos de Batalla', nombre: 'Disipar las Tinieblas', requisitoTeurgia: 4 },
  { categoria: 'Hermanos de Batalla', nombre: 'Fervor de los Justos', requisitoTeurgia: 4 },
  { categoria: 'Hermanos de Batalla', nombre: 'Liturgia de la Hueste Furiosa', requisitoTeurgia: 5 },
  { categoria: 'Hermanos de Batalla', nombre: 'Mano Aniquiladora', requisitoTeurgia: 6 },
  { categoria: 'Hermanos de Batalla', nombre: 'Temible Majestad', requisitoTeurgia: 7 },
  { categoria: 'Hermanos de Batalla', nombre: 'Exorcismo', requisitoTeurgia: 8 },
  { categoria: 'Hermanos de Batalla', nombre: 'Salutación a Zakhayelos', requisitoTeurgia: 9 },

  // Orden Eskatónica
  { categoria: 'Orden Eskatónica', nombre: 'Alineación Astral', requisitoTeurgia: 1 },
  { categoria: 'Orden Eskatónica', nombre: 'Revelación Divina', requisitoTeurgia: 2 },
  { categoria: 'Orden Eskatónica', nombre: 'Rasgar el Velo de la Irracionalidad', requisitoTeurgia: 3 },
  { categoria: 'Orden Eskatónica', nombre: 'Segunda Visión', requisitoTeurgia: 4 },
  { categoria: 'Orden Eskatónica', nombre: 'Transmutación Ósea', requisitoTeurgia: 5 },
  { categoria: 'Orden Eskatónica', nombre: 'Ojo que Todo lo Ve', requisitoTeurgia: 6 },
  { categoria: 'Orden Eskatónica', nombre: 'Refinamiento de Esencia', requisitoTeurgia: 7 },
  { categoria: 'Orden Eskatónica', nombre: 'Investidura', requisitoTeurgia: 8 },
  { categoria: 'Orden Eskatónica', nombre: 'Conocimiento de Tholumiyelos', requisitoTeurgia: 9 },

  // Ortodoxia de Urth
  { categoria: 'Ortodoxia de Urth', nombre: 'Santificación Menor', requisitoTeurgia: 1 },
  { categoria: 'Ortodoxia de Urth', nombre: 'Luz', requisitoTeurgia: 2 },
  { categoria: 'Ortodoxia de Urth', nombre: 'Consagración', requisitoTeurgia: 3 },
  { categoria: 'Ortodoxia de Urth', nombre: 'Corazón Fiel', requisitoTeurgia: 4 },
  { categoria: 'Ortodoxia de Urth', nombre: 'Sellar el Templo', requisitoTeurgia: 5 },
  { categoria: 'Ortodoxia de Urth', nombre: 'Suelo Consagrado', requisitoTeurgia: 6 },
  { categoria: 'Ortodoxia de Urth', nombre: 'Voz Sagrada', requisitoTeurgia: 7 },
  { categoria: 'Ortodoxia de Urth', nombre: 'Aura de Autoridad', requisitoTeurgia: 8 },
  { categoria: 'Ortodoxia de Urth', nombre: 'Voluntad del Pancreator', requisitoTeurgia: 9 },

  // Santuario de Aeón
  { categoria: 'Santuario de Aeón', nombre: 'Purificación', requisitoTeurgia: 1 },
  { categoria: 'Santuario de Aeón', nombre: 'Lumbre', requisitoTeurgia: 2 },
  { categoria: 'Santuario de Aeón', nombre: 'Calma', requisitoTeurgia: 3 },
  { categoria: 'Santuario de Aeón', nombre: 'Corazón Sabio', requisitoTeurgia: 4 },
  { categoria: 'Santuario de Aeón', nombre: 'Multiplicación Fructífera', requisitoTeurgia: 5 },
  { categoria: 'Santuario de Aeón', nombre: 'Recuperación', requisitoTeurgia: 5 },
  { categoria: 'Santuario de Aeón', nombre: 'Maná del Cielo', requisitoTeurgia: 6 },
  { categoria: 'Santuario de Aeón', nombre: 'Mano Sanadora de Santa Amaltea', requisitoTeurgia: 7 },
  { categoria: 'Santuario de Aeón', nombre: 'Santuario', requisitoTeurgia: 8 },
  { categoria: 'Santuario de Aeón', nombre: 'Invitación a Hamomeyelos', requisitoTeurgia: 9 },

  // Templo Avesti
  { categoria: 'Templo Avesti', nombre: 'Discernir la Falsedad de Corazón', requisitoTeurgia: 1 },
  { categoria: 'Templo Avesti', nombre: 'Rastro del Mal', requisitoTeurgia: 2 },
  { categoria: 'Templo Avesti', nombre: 'Remordimiento de Conciencia', requisitoTeurgia: 3 },
  { categoria: 'Templo Avesti', nombre: 'Portador de Antorcha', requisitoTeurgia: 4 },
  { categoria: 'Templo Avesti', nombre: 'Fallo de los Sin Alma', requisitoTeurgia: 5 },
  { categoria: 'Templo Avesti', nombre: 'Temible Majestad', requisitoTeurgia: 6 },
  { categoria: 'Templo Avesti', nombre: 'Orden Inquisitorial', requisitoTeurgia: 7 },
  { categoria: 'Templo Avesti', nombre: 'Tortura de los Condenados', requisitoTeurgia: 8 },
  { categoria: 'Templo Avesti', nombre: 'Petición a Jachemuyelos', requisitoTeurgia: 9 },
]
