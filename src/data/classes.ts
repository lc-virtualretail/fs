import type { ClassDefinition } from '@/types/rules'

export const CLASSES: ClassDefinition[] = [
  {
    id: 'noble',
    nombre: 'Noble',
    descripcion: 'Los gobernantes de los Mundos Conocidos. Criados en el honor, el deber y la espada.',
    educacion: {
      competenciasFijas: [
        'Armas Militares',
        'Hablar/Leer (urthés)',
        'Saber Planetario (planeta natal)',
        'Usos de la Corte',
      ],
      competenciasEleccion: [
        ['Monta', 'Saber Artístico', 'Saber Marcial'],
      ],
      caracteristicas: [
        { caracteristica: 'constitucion', valor: 1, alternativas: ['destreza', 'fuerza'] },
        { caracteristica: 'fe', valor: 1, alternativas: ['voluntad'] },
        { caracteristica: 'inteligencia', valor: 1 },
        { caracteristica: 'presencia', valor: 2 },
      ],
      habilidades: [
        { habilidad: 'academia', valor: 1 },
        { habilidad: 'artes', valor: 1 },
        { habilidad: 'cuerpoACuerpo', valor: 1 },
        { habilidad: 'encanto', valor: 2, alternativas: ['impresionar'] },
      ],
      beneficioArquetipico: 'Imperioso',
      beneficiosDeClase: [
        'Agilidad', 'Artes Marciales', 'Autoridad', 'Bendición de San Lextius',
        'Campeón', 'Dos Pistolas', 'Esgrima', 'Imperioso', 'Nobleza Obliga',
        'Terrateniente', 'Riqueza', 'Sirviente', 'Título Nobiliario',
      ],
    },
  },
  {
    id: 'sacerdote',
    nombre: 'Sacerdote',
    descripcion: 'Los guardianes de la fe. La Iglesia guía las almas de los Mundos Conocidos.',
    educacion: {
      competenciasFijas: [
        'Hablar/Leer (urthés)',
        'Saber Planetario (planeta natal)',
        'Saber Religioso',
        'Usos de la Catedral',
      ],
      competenciasEleccion: [
        ['Leer (latín eclesiástico)', 'Saber de Historia', 'Saber Científico (Ciencias de la Vida)'],
      ],
      caracteristicas: [
        { caracteristica: 'fe', valor: 2 },
        { caracteristica: 'voluntad', valor: 1, alternativas: ['intuicion'] },
        { caracteristica: 'inteligencia', valor: 1, alternativas: ['presencia'] },
        { caracteristica: 'percepcion', valor: 1 },
      ],
      habilidades: [
        { habilidad: 'academia', valor: 1 },
        { habilidad: 'encanto', valor: 1, alternativas: ['impresionar'] },
        { habilidad: 'introspeccion', valor: 1 },
        { habilidad: 'observar', valor: 1 },
        { habilidad: 'representar', valor: 1 },
      ],
      beneficioArquetipico: 'Inspirador',
      beneficiosDeClase: [
        'Autoridad', 'Bendición del Santo', 'Campeón', 'Iluminado',
        'Inspirador', 'Ordenación Religiosa', 'Riqueza', 'Sirviente', 'Súplica',
      ],
    },
  },
  {
    id: 'mercader',
    nombre: 'Mercader',
    descripcion: 'Los comerciantes y tecnólogos. La Liga Mercantil mueve la economía de los Mundos Conocidos.',
    educacion: {
      competenciasFijas: [
        'Hablar/Leer (urthés)',
        'Saber Planetario (planeta natal)',
        'Saber Tecnológico (NT5)',
        'Usos del Vulgo',
      ],
      competenciasEleccion: [
        ['Máquinas Pensantes', 'Vehículos Terrestres', 'Saber Científico (Ciencias Aplicadas)'],
      ],
      caracteristicas: [
        { caracteristica: 'inteligencia', valor: 2 },
        { caracteristica: 'percepcion', valor: 1, alternativas: ['voluntad'] },
        { caracteristica: 'destreza', valor: 1, alternativas: ['presencia'] },
        { caracteristica: 'constitucion', valor: 1 },
      ],
      habilidades: [
        { habilidad: 'charlataneria', valor: 1, alternativas: ['encanto'] },
        { habilidad: 'oficios', valor: 1, alternativas: ['tecnorredencion'] },
        { habilidad: 'observar', valor: 1 },
        { habilidad: 'intrusion', valor: 1 },
        { habilidad: 'academia', valor: 1 },
      ],
      beneficioArquetipico: 'Ingenioso',
      beneficiosDeClase: [
        'Artes Marciales', 'Autoridad', 'Campeón', 'Cargo Gremial',
        'Dos Pistolas', 'Embargo', 'Ingenioso', 'Riqueza', 'Sirviente',
      ],
    },
  },
  {
    id: 'independiente',
    nombre: 'Independiente',
    descripcion: 'Los que buscan su propio camino fuera de las grandes facciones.',
    educacion: {
      competenciasFijas: [
        'Hablar/Leer (urthés)',
        'Saber Planetario (planeta natal)',
      ],
      competenciasEleccion: [
        ['Usos de la Corte', 'Usos de la Catedral', 'Usos del Vulgo'],
        ['Armas de Balas', 'Monta', 'Saber de Historia'],
      ],
      caracteristicas: [
        { caracteristica: 'constitucion', valor: 1, alternativas: ['fuerza', 'destreza'] },
        { caracteristica: 'voluntad', valor: 1, alternativas: ['percepcion'] },
        { caracteristica: 'fe', valor: 1, alternativas: ['intuicion'] },
        { caracteristica: 'presencia', valor: 1 },
        { caracteristica: 'inteligencia', valor: 1 },
      ],
      habilidades: [
        { habilidad: 'vigor', valor: 1 },
        { habilidad: 'observar', valor: 1 },
        { habilidad: 'supervivencia', valor: 1 },
        { habilidad: 'pelea', valor: 1, alternativas: ['disparar'] },
        { habilidad: 'encanto', valor: 1, alternativas: ['charlataneria'] },
      ],
      beneficioArquetipico: 'Autónomo',
      beneficiosDeClase: [
        'Agilidad', 'Artes Marciales', 'Autónomo', 'Campeón', 'Dos Pistolas',
        'Reputación Profesional', 'Riqueza', 'Sirviente',
      ],
    },
  },
]

export function getClassById(id: string): ClassDefinition | undefined {
  return CLASSES.find(c => c.id === id)
}
