import type { ClassId } from '@/types/character'
import type { FactionDefinition } from '@/types/rules'

export const FACTIONS: FactionDefinition[] = [
  // ═══════════════════════════════════════════════════
  // CASAS NOBLES (clase: 'noble')
  // ═══════════════════════════════════════════════════
  {
    id: 'al-malik',
    nombre: 'al-Malik',
    clase: 'noble',
    descripcion: 'Nobles intelectuales y artísticos, conocidos por su curiosidad insaciable y su apertura a otras culturas.',
    bendicion: {
      nombre: 'Extrovertido',
      efecto: '+1 meta para la influencia de persuasión con invitados.',
    },
    maldicion: {
      nombre: 'Impetuoso',
      efecto: 'Resistencia Mental –2 contra influencia de persuasión al comerciar.',
    },
    premioMaterial: 'Orbe estético (curiosidad NT6: un orbe flotante del tamaño de una pelota de béisbol; puede seguir a su propietario y emitir una suave luz y música ambiental con una variedad de temas para elegir)',
    vocacionFavorecida: 'Entusiasta',
    aprendizaje: {
      competenciasFijas: ['Hablar (lengua elegante)', 'Saber de Facción (al-Malik)'],
      competenciasEleccion: [
        ['Máquinas Pensantes', 'Usos del Vulgo', 'Armas de Balas', 'Armas de Energía', 'Armas Militares', 'Saber Artístico', 'Artes Escénicas'],
      ],
      caracteristicas: [
        { caracteristica: 'destreza', valor: 1, alternativas: ['inteligencia'] },
        { caracteristica: 'intuicion', valor: 1 },
        { caracteristica: 'presencia', valor: 2 },
        { caracteristica: 'inteligencia', valor: 1 },
      ],
      habilidades: [
        { habilidad: 'academia', valor: 1 },
        { habilidad: 'artes', valor: 1, alternativas: ['representar'] },
        { habilidad: 'cuerpoACuerpo', valor: 1, alternativas: ['disparar', 'tecnorredencion'] },
        { habilidad: 'empatia', valor: 1, alternativas: ['interfaz', 'introspeccion'] },
        { habilidad: 'encanto', valor: 1, alternativas: ['impresionar'] },
      ],
      beneficio: 'Título Nobiliario (caballero)',
    },
  },
  {
    id: 'decados',
    nombre: 'Decados',
    clase: 'noble',
    descripcion: 'Intrigantes y decadentes, los Decados son maestros de la manipulación y el engaño.',
    bendicion: {
      nombre: 'Receloso',
      efecto: 'Percepción +2 si estás cerca de rivales políticos.',
    },
    maldicion: {
      nombre: 'Vanidoso',
      efecto: 'Percepción –2 cuando te hacen un cumplido.',
    },
    premioMaterial: 'Amiguito (curiosidad NT5: parche de piel en la base del cuello; elige una habilidad y obtienes +1 a la meta una vez por escena cuando uses esa habilidad, pero tu próxima tirada de acción física recibe –1 a la meta por una sobrecarga del sistema nervioso)',
    vocacionFavorecida: 'Sibarita',
    aprendizaje: {
      competenciasFijas: ['Saber de Facción (Decados)'],
      competenciasEleccion: [
        ['Saber Artístico', 'Tortura', 'Venenos'],
        ['Armas de Balas', 'Armas de Energía', 'Armas Militares'],
      ],
      caracteristicas: [
        { caracteristica: 'constitucion', valor: 1, alternativas: ['destreza', 'fuerza'] },
        { caracteristica: 'percepcion', valor: 1, alternativas: ['inteligencia'] },
        { caracteristica: 'presencia', valor: 2 },
        { caracteristica: 'voluntad', valor: 1 },
      ],
      habilidades: [
        { habilidad: 'academia', valor: 1, alternativas: ['artes'] },
        { habilidad: 'cuerpoACuerpo', valor: 1, alternativas: ['disparar'] },
        { habilidad: 'disfraz', valor: 1, alternativas: ['interfaz', 'intrusion'] },
        { habilidad: 'encanto', valor: 1, alternativas: ['impresionar', 'charlataneria'] },
        { habilidad: 'observar', valor: 1, alternativas: ['sigilo'] },
      ],
      beneficio: 'Título Nobiliario (caballero)',
    },
  },
  {
    id: 'hawkwood',
    nombre: 'Hawkwood',
    clase: 'noble',
    descripcion: 'Regios y honorables, los Hawkwood son líderes natos que valoran el coraje y la justicia.',
    bendicion: {
      nombre: 'Obstinado',
      efecto: 'Meta +1 en tiradas de Constitución, Voluntad y Fe cuando te retan.',
    },
    maldicion: {
      nombre: 'Orgulloso',
      efecto: 'Inteligencia –2 si te insultan.',
    },
    premioMaterial: 'Arma de buena calidad (meta +1), en general una espada',
    vocacionFavorecida: 'Comandante',
    aprendizaje: {
      competenciasFijas: ['Saber de Facción (Hawkwood)'],
      competenciasEleccion: [
        ['Armas Militares', 'Armas de Balas', 'Armas de Energía'],
        ['Monta', 'Operaciones a Bordo', 'Saber Marcial'],
      ],
      caracteristicas: [
        { caracteristica: 'fe', valor: 1, alternativas: ['voluntad'] },
        { caracteristica: 'constitucion', valor: 2, alternativas: ['fuerza', 'inteligencia'] },
        { caracteristica: 'presencia', valor: 2 },
      ],
      habilidades: [
        { habilidad: 'academia', valor: 1 },
        { habilidad: 'cuerpoACuerpo', valor: 1, alternativas: ['disparar'] },
        { habilidad: 'encanto', valor: 2, alternativas: ['impresionar'] },
        { habilidad: 'introspeccion', valor: 1, alternativas: ['vigor'] },
      ],
      beneficio: 'Título Nobiliario (caballero)',
    },
  },
  {
    id: 'hazat',
    nombre: 'Hazat',
    clase: 'noble',
    descripcion: 'Militantes y apasionados, los Hazat viven para la gloria del combate y el honor familiar.',
    bendicion: {
      nombre: 'Disciplinado',
      efecto: 'Meta +2 a tiradas de combate basadas en la Destreza o la Fuerza; elige solo una característica cuando adquieras esta bendición.',
    },
    maldicion: {
      nombre: 'Vengativo',
      efecto: 'Meta –2 a tiradas basadas en la Voluntad cuando te interrogan o insultan.',
    },
    premioMaterial: 'Capa de sinteseda (armadura NT5; Resistencia Corporal +3, compatible con escudo de energía) y arma de duelo',
    vocacionFavorecida: 'Duelista',
    aprendizaje: {
      competenciasFijas: ['Saber de Facción (Hazat)', 'Saber Marcial'],
      competenciasEleccion: [
        ['Armas de Balas', 'Armas de Energía', 'Armadura de Combate', 'Saber (cualquiera)'],
      ],
      caracteristicas: [
        { caracteristica: 'destreza', valor: 2, alternativas: ['fuerza'] },
        { caracteristica: 'presencia', valor: 2 },
        { caracteristica: 'inteligencia', valor: 1, alternativas: ['voluntad'] },
      ],
      habilidades: [
        { habilidad: 'academia', valor: 1 },
        { habilidad: 'cuerpoACuerpo', valor: 1 },
        { habilidad: 'empatia', valor: 1, alternativas: ['vigor'] },
        { habilidad: 'encanto', valor: 1, alternativas: ['impresionar'] },
        { habilidad: 'disparar', valor: 1, alternativas: ['pelea'] },
      ],
      beneficio: 'Título Nobiliario (caballero)',
    },
  },
  {
    id: 'li-halan',
    nombre: 'Li Halan',
    clase: 'noble',
    descripcion: 'Piadosos y devotos, los Li Halan combinan la nobleza con una profunda fe religiosa.',
    bendicion: {
      nombre: 'Devoto',
      efecto: 'Presencia +2 si estás cerca de pecadores y otros nobles.',
    },
    maldicion: {
      nombre: 'Mancha Dinástica',
      efecto: 'Presencia –2 cerca de miembros de la Iglesia.',
    },
    premioMaterial: 'Reliquia de santo (asociada con un santo de un Mundo Jardín) y una túnica de sinteseda holgada (armadura NT5; Resistencia Corporal +3, compatible con escudo de energía)',
    vocacionFavorecida: 'Cortesano',
    aprendizaje: {
      competenciasFijas: ['Usos de la Catedral', 'Saber de Facción (Li Halan)'],
      competenciasEleccion: [
        ['Saber Religioso', 'Armas de Balas', 'Armas de Energía', 'Armas Militares', 'Artes Escénicas', 'Saber Artístico'],
      ],
      caracteristicas: [
        { caracteristica: 'constitucion', valor: 1, alternativas: ['destreza', 'fuerza'] },
        { caracteristica: 'fe', valor: 2, alternativas: ['presencia'] },
        { caracteristica: 'inteligencia', valor: 2, alternativas: ['intuicion'] },
      ],
      habilidades: [
        { habilidad: 'academia', valor: 1 },
        { habilidad: 'artes', valor: 1, alternativas: ['representar'] },
        { habilidad: 'curar', valor: 1, alternativas: ['observar'] },
        { habilidad: 'empatia', valor: 1, alternativas: ['introspeccion'] },
        { habilidad: 'encanto', valor: 1, alternativas: ['impresionar'] },
      ],
      beneficio: 'Título Nobiliario (caballero)',
    },
  },

  // ═══════════════════════════════════════════════════
  // SECTAS DE LA IGLESIA (clase: 'sacerdote')
  // ═══════════════════════════════════════════════════
  {
    id: 'hermanos-de-batalla',
    nombre: 'Hermanos de Batalla',
    clase: 'sacerdote',
    descripcion: 'Monjes guerreros dedicados a defender la fe con disciplina marcial inquebrantable.',
    bendicion: {
      nombre: 'Disciplinado',
      efecto: 'Meta +2 para quitarte de encima estados.',
    },
    maldicion: {
      nombre: 'Inepto Social',
      efecto: 'Meta –2 en tiradas de Intuición y Percepción para darte cuenta de sutilezas sociales.',
    },
    premioMaterial: 'Espada o arma de balas bendecida (meta +1 a Cuerpo a Cuerpo o Disparar, respectivamente, cuando la empuñas contra un enemigo de la Iglesia)',
    vocacionFavorecida: 'Hermano de batalla',
    aprendizaje: {
      competenciasFijas: ['Armas Militares', 'Saber de Facción (Hermanos de Batalla)'],
      competenciasEleccion: [
        ['Armadura de Combate', 'Armadura de Guerra', 'Armas de Balas', 'Armas de Energía'],
      ],
      caracteristicas: [
        { caracteristica: 'destreza', valor: 1 },
        { caracteristica: 'constitucion', valor: 1 },
        { caracteristica: 'fe', valor: 1 },
        { caracteristica: 'fuerza', valor: 2 },
      ],
      habilidades: [
        { habilidad: 'cuerpoACuerpo', valor: 1, alternativas: ['disparar'] },
        { habilidad: 'curar', valor: 1 },
        { habilidad: 'impresionar', valor: 1, alternativas: ['introspeccion', 'supervivencia'] },
        { habilidad: 'pelea', valor: 1 },
        { habilidad: 'vigor', valor: 1 },
      ],
      beneficio: 'Ordenación Religiosa (aprendiz)',
    },
  },
  {
    id: 'orden-eskatonica',
    nombre: 'Orden Eskatónica',
    clase: 'sacerdote',
    descripcion: 'Esotéricos y buscadores de conocimiento oculto, exploran los misterios del universo.',
    bendicion: {
      nombre: 'Curioso',
      efecto: 'Percepción +2 cuando te encuentres con algo nuevo.',
    },
    maldicion: {
      nombre: 'Sutil',
      efecto: 'Meta –1 para la influencia de persuasión cuando estás explicando algo.',
    },
    premioMaterial: 'Todos los volúmenes de los Evangelios Apócrifos de Horacio (libro o archivo de datos) y cuatro textos con información sobre san Horacio el Docto que la Iglesia rechazó',
    vocacionFavorecida: 'Ocultista',
    aprendizaje: {
      competenciasFijas: ['Saber de Facción (Orden Eskatónica)', 'Saber Oculto'],
      competenciasEleccion: [
        ['Leer (latín)', 'Saber (cualquiera)'],
      ],
      caracteristicas: [
        { caracteristica: 'fe', valor: 2 },
        { caracteristica: 'inteligencia', valor: 1 },
        { caracteristica: 'intuicion', valor: 2 },
      ],
      habilidades: [
        { habilidad: 'academia', valor: 2 },
        { habilidad: 'alquimia', valor: 1, alternativas: ['observar'] },
        { habilidad: 'curar', valor: 1, alternativas: ['encanto', 'impresionar'] },
        { habilidad: 'introspeccion', valor: 1 },
      ],
      beneficio: 'Ordenación Religiosa (novicio)',
    },
  },
  {
    id: 'ortodoxo-de-urth',
    nombre: 'Ortodoxia',
    clase: 'sacerdote',
    descripcion: 'Eclesiásticos y tradicionalistas, guardianes de la doctrina oficial de la Iglesia Universal del Pancreador.',
    bendicion: {
      nombre: 'Devoto',
      efecto: 'Presencia +2 entre pecadores.',
    },
    maldicion: {
      nombre: 'Austero',
      efecto: 'Encanto –2 con miembros del rebaño.',
    },
    premioMaterial: 'Una copia iluminada de los Evangelios Omega y una cruz de salto plateada',
    vocacionFavorecida: 'Clero',
    aprendizaje: {
      competenciasFijas: ['Saber de Facción (ortodoxos de Urth)'],
      competenciasEleccion: [
        ['Leer (latín)', 'Hablar (latín)'],
        ['Saber (cualquiera)', 'Usos de la Corte'],
      ],
      caracteristicas: [
        { caracteristica: 'fe', valor: 2, alternativas: ['voluntad'] },
        { caracteristica: 'inteligencia', valor: 1 },
        { caracteristica: 'presencia', valor: 2 },
      ],
      habilidades: [
        { habilidad: 'academia', valor: 1 },
        { habilidad: 'curar', valor: 1, alternativas: ['empatia', 'introspeccion'] },
        { habilidad: 'encanto', valor: 1, alternativas: ['impresionar'] },
        { habilidad: 'representar', valor: 2 },
      ],
      beneficio: 'Ordenación Religiosa (novicio)',
    },
  },
  {
    id: 'santuario-de-aeon',
    nombre: 'Santuario de Aeón',
    clase: 'sacerdote',
    descripcion: 'Compasivos y sanadores, dedican sus vidas a aliviar el sufrimiento de los demás.',
    bendicion: {
      nombre: 'Compasivo',
      efecto: 'Meta +1 para influencia de persuasión cuando ayudes a los demás.',
    },
    maldicion: {
      nombre: 'Crédulo',
      efecto: 'Resistencia Mental –2 frente a intentos de engatusarte.',
    },
    premioMaterial: 'Tecnal misericordioso menor (dispositivo de NT5; escáner médico o instrumentos de cirugía; meta +2 a tiradas de Curar)',
    vocacionFavorecida: 'Sanador',
    aprendizaje: {
      competenciasFijas: ['Saber (cualquiera)', 'Saber de Facción (Santuario de Aeón)'],
      competenciasEleccion: [
        ['Enfermedades', 'Venenos', 'Cirugía'],
      ],
      caracteristicas: [
        { caracteristica: 'destreza', valor: 2 },
        { caracteristica: 'fe', valor: 1, alternativas: ['intuicion'] },
        { caracteristica: 'inteligencia', valor: 1 },
        { caracteristica: 'presencia', valor: 1 },
      ],
      habilidades: [
        { habilidad: 'academia', valor: 1, alternativas: ['artes', 'representar'] },
        { habilidad: 'curar', valor: 2 },
        { habilidad: 'empatia', valor: 1, alternativas: ['introspeccion'] },
        { habilidad: 'encanto', valor: 1 },
      ],
      beneficio: 'Ordenación Religiosa (novicio)',
    },
  },
  {
    id: 'templo-avesti',
    nombre: 'Templo Avesti',
    clase: 'sacerdote',
    descripcion: 'Fanáticos purificadores que persiguen la herejía y la oscuridad con fuego y fervor.',
    bendicion: {
      nombre: 'Piadoso',
      efecto: 'Meta +1 contra la influencia de coacción entre pecadores.',
    },
    maldicion: {
      nombre: 'Recto',
      efecto: 'Meta –1 en tiradas de Voluntad y Fe cuando se cuestione tu juicio.',
    },
    premioMaterial: 'Colgante con el símbolo de la Llama Sagrada (se convierte en un hierro al rojo vivo para marcar las frentes de los pecadores)',
    vocacionFavorecida: 'Inquisidor',
    aprendizaje: {
      competenciasFijas: ['Saber de Facción (templo Avesti)', 'Tortura'],
      competenciasEleccion: [
        ['Saber (cualquiera)', 'Armas de Balas', 'Armas de Energía'],
      ],
      caracteristicas: [
        { caracteristica: 'constitucion', valor: 1 },
        { caracteristica: 'destreza', valor: 1, alternativas: ['fe'] },
        { caracteristica: 'presencia', valor: 1 },
        { caracteristica: 'percepcion', valor: 2 },
      ],
      habilidades: [
        { habilidad: 'cuerpoACuerpo', valor: 1, alternativas: ['disparar', 'pelea'] },
        { habilidad: 'empatia', valor: 1, alternativas: ['charlataneria'] },
        { habilidad: 'impresionar', valor: 1 },
        { habilidad: 'introspeccion', valor: 1, alternativas: ['vigor'] },
        { habilidad: 'observar', valor: 1 },
      ],
      beneficio: 'Ordenación Religiosa (novicio)',
    },
  },

  // ═══════════════════════════════════════════════════
  // GREMIOS MERCANTILES (clase: 'mercader')
  // ═══════════════════════════════════════════════════
  {
    id: 'aurigas',
    nombre: 'Aurigas',
    clase: 'mercader',
    descripcion: 'Viajeros y pilotos estelares que dominan las rutas de salto entre los mundos.',
    bendicion: {
      nombre: 'Curioso',
      efecto: 'Intuición +2 cuando te encuentres con algo nuevo.',
    },
    maldicion: {
      nombre: 'Indiscreto',
      efecto: 'Presencia –2 cuando te encuentres con algo nuevo.',
    },
    premioMaterial: 'Llave de salto (curiosidad de NT7: un cilindro del tamaño de una linterna de bolsillo; tiene las coordenadas de una ruta entre dos planetas)',
    vocacionFavorecida: 'Piloto estelar',
    aprendizaje: {
      competenciasFijas: ['Saber de Facción (Aurigas)', 'Operaciones a Bordo'],
      competenciasEleccion: [
        ['Máquinas Pensantes', 'Saber de Red de Salto', 'Saber Tecnológico'],
      ],
      caracteristicas: [
        { caracteristica: 'destreza', valor: 1 },
        { caracteristica: 'inteligencia', valor: 2 },
        { caracteristica: 'intuicion', valor: 1 },
        { caracteristica: 'presencia', valor: 1 },
      ],
      habilidades: [
        { habilidad: 'conducir', valor: 1, alternativas: ['introspeccion'] },
        { habilidad: 'encanto', valor: 1 },
        { habilidad: 'interfaz', valor: 1 },
        { habilidad: 'pilotar', valor: 1 },
        { habilidad: 'disparar', valor: 1, alternativas: ['tecnorredencion'] },
      ],
      beneficio: 'Cargo Gremial (alférez)',
    },
  },
  {
    id: 'carroneros',
    nombre: 'Carroñeros',
    clase: 'mercader',
    descripcion: 'Ladrones y contrabandistas que operan en los márgenes de la sociedad y el mercado negro.',
    bendicion: {
      nombre: 'Jefazo',
      efecto: 'Presencia +2 cuando dirijas a tus subordinados.',
    },
    maldicion: {
      nombre: 'Posesivo',
      efecto: 'Presencia –2 cuando te dejen fuera de la acción.',
    },
    premioMaterial: 'Llave de invitados (dispositivo nanotecnológico de NT7: llave maestra; adquiere la forma necesaria para abrir cerrojos mecánicos, volviendo innecesarias ciertas tiradas de Intrusión. Compulsión tecgnóstica: Diligente)',
    vocacionFavorecida: 'Ladrón',
    aprendizaje: {
      competenciasFijas: ['Saber de Facción (Carroñeros)', 'Bajos Fondos'],
      competenciasEleccion: [
        ['Armas de Balas', 'Armas de Energía', 'Transporte (cualquiera)', 'Saber Tecnológico'],
      ],
      caracteristicas: [
        { caracteristica: 'destreza', valor: 1, alternativas: ['fuerza'] },
        { caracteristica: 'inteligencia', valor: 1 },
        { caracteristica: 'percepcion', valor: 1 },
        { caracteristica: 'presencia', valor: 2 },
      ],
      habilidades: [
        { habilidad: 'charlataneria', valor: 1, alternativas: ['encanto', 'impresionar'] },
        { habilidad: 'conducir', valor: 1, alternativas: ['pilotar'] },
        { habilidad: 'cuerpoACuerpo', valor: 1, alternativas: ['disparar', 'pelea'] },
        { habilidad: 'intrusion', valor: 1, alternativas: ['observar'] },
        { habilidad: 'prestidigitacion', valor: 1, alternativas: ['tecnorredencion'] },
      ],
      beneficio: 'Cargo Gremial (asociado)',
    },
  },
  {
    id: 'ingenieros',
    nombre: 'Ingenieros',
    clase: 'mercader',
    descripcion: 'Tecnólogos y científicos que preservan y desarrollan el conocimiento técnico del universo.',
    bendicion: {
      nombre: 'Innovador',
      efecto: 'Intuición +2 cuando intentes inventar algo.',
    },
    maldicion: {
      nombre: 'Inquietante',
      efecto: 'Presencia –2 cuando trates con sirvientes.',
    },
    premioMaterial: 'Multiherramienta (dispositivo nanotecnológico de NT7: incluye herramientas y medidores que cubren la mayoría de necesidades tecnorredentoras; del tamaño de un destornillador. Compulsión tecgnóstica: Diligente)',
    vocacionFavorecida: 'Tecnorredentor',
    aprendizaje: {
      competenciasFijas: ['Saber de Facción (Ingenieros)'],
      competenciasEleccion: [
        ['Oficio (cualquiera)', 'Saber Tecnológico'],
        ['Saber Tecnológico', 'Máquinas Pensantes'],
      ],
      caracteristicas: [
        { caracteristica: 'destreza', valor: 2 },
        { caracteristica: 'inteligencia', valor: 2 },
        { caracteristica: 'intuicion', valor: 1 },
      ],
      habilidades: [
        { habilidad: 'academia', valor: 1 },
        { habilidad: 'alquimia', valor: 1, alternativas: ['oficios', 'introspeccion'] },
        { habilidad: 'interfaz', valor: 1 },
        { habilidad: 'tecnorredencion', valor: 2 },
      ],
      beneficio: 'Cargo Gremial (aprendiz)',
    },
  },
  {
    id: 'magistrados',
    nombre: 'Magistrados',
    clase: 'mercader',
    descripcion: 'La ley mercantil hecha carne, los Magistrados administran justicia y contratos entre los gremios.',
    bendicion: {
      nombre: 'Astuto',
      efecto: 'Resistencia Mental +2 frente a intentos de engatusarte.',
    },
    maldicion: {
      nombre: 'Avaro',
      efecto: 'Percepción –2 cuando haya dinero de por medio.',
    },
    premioMaterial: 'Araña (máquina pensante de NT6; lee la «telaraña» de datos de los Magistrados: listas de trabajos, deudas con el gremio, nombres de morosos, etc. Compulsión tecgnóstica: Indiscreto)',
    vocacionFavorecida: 'Abogado',
    aprendizaje: {
      competenciasFijas: ['Saber de Facción (Magistrados)'],
      competenciasEleccion: [
        ['Saber (cualquiera)'],
        ['Usos de la Catedral', 'Usos de la Corte', 'Bajos Fondos'],
      ],
      caracteristicas: [
        { caracteristica: 'inteligencia', valor: 2 },
        { caracteristica: 'intuicion', valor: 1 },
        { caracteristica: 'presencia', valor: 2 },
      ],
      habilidades: [
        { habilidad: 'academia', valor: 1 },
        { habilidad: 'disparar', valor: 1, alternativas: ['interfaz', 'introspeccion'] },
        { habilidad: 'empatia', valor: 1, alternativas: ['impresionar'] },
        { habilidad: 'encanto', valor: 2 },
      ],
      beneficio: 'Cargo Gremial (asociado)',
    },
  },
  {
    id: 'asamblea',
    nombre: 'La Asamblea',
    clase: 'mercader',
    descripcion: 'Soldados y trabajadores cualificados que forman la columna vertebral de la fuerza laboral gremial.',
    bendicion: {
      nombre: 'Audaz',
      efecto: 'Ventaja de influencia en combate y coacción.',
    },
    maldicion: {
      nombre: 'Insensible',
      efecto: 'Presencia –2 cuando te pidan ayuda.',
    },
    premioMaterial: 'Traje AMuEs (dispositivo de NT6; armadura sintética multiespectro; Resistencia Corporal 4; Protección contra Descargas, Golpes + elige una protección adicional: Blaster, Fuego o Láser; no requiere competencia de armadura. Compulsión tecgnóstica: Protector)',
    vocacionFavorecida: 'Mercenario',
    aprendizaje: {
      competenciasFijas: ['Saber de Facción (Asamblea)'],
      competenciasEleccion: [
        ['Armadura (cualquiera)', 'Armamento Pesado', 'Armas (cualquiera)', 'Transporte (cualquiera)'],
        ['Armadura (cualquiera)', 'Armamento Pesado', 'Armas (cualquiera)', 'Transporte (cualquiera)'],
      ],
      caracteristicas: [
        { caracteristica: 'constitucion', valor: 2, alternativas: ['destreza'] },
        { caracteristica: 'fe', valor: 1, alternativas: ['presencia', 'voluntad'] },
        { caracteristica: 'fuerza', valor: 2 },
      ],
      habilidades: [
        { habilidad: 'conducir', valor: 1, alternativas: ['pilotar'] },
        { habilidad: 'cuerpoACuerpo', valor: 1, alternativas: ['pelea'] },
        { habilidad: 'disparar', valor: 1 },
        { habilidad: 'impresionar', valor: 1 },
        { habilidad: 'tecnorredencion', valor: 1, alternativas: ['vigor'] },
      ],
      beneficio: 'Cargo Gremial (soldado raso)',
    },
  },

  // ═══════════════════════════════════════════════════
  // SOCIEDADES INDEPENDIENTES (clase: 'independiente')
  // ═══════════════════════════════════════════════════
  {
    id: 'desposeidos',
    nombre: 'Los Desposeídos',
    clase: 'independiente',
    descripcion: 'Mercenarios profesionales que ofrecen sus servicios militares al mejor postor.',
    bendicion: {
      nombre: 'Taciturno',
      efecto: 'Resistencia Mental +1 contra influencia.',
    },
    maldicion: {
      nombre: 'Inquieto',
      efecto: 'Presencia –2 en situaciones tensas.',
    },
    premioMaterial: 'Altavoz militar (radio de NT6; alcance planetario + 1 UA interestelar. Compulsión tecgnóstica: Indiscreto)',
    vocacionFavorecida: 'Mercenario',
    aprendizaje: {
      competenciasFijas: ['Saber Marcial'],
      competenciasEleccion: [
        ['Armadura de Combate', 'Armadura de Guerra'],
        ['Armamento Pesado (Artillería)', 'Armamento Pesado (Artillería Montada)', 'Armamento Pesado (Demoliciones)'],
      ],
      caracteristicas: [
        { caracteristica: 'destreza', valor: 2, alternativas: ['fuerza'] },
        { caracteristica: 'constitucion', valor: 2 },
        { caracteristica: 'presencia', valor: 1, alternativas: ['voluntad'] },
      ],
      habilidades: [
        { habilidad: 'conducir', valor: 1, alternativas: ['pilotar', 'vigor'] },
        { habilidad: 'cuerpoACuerpo', valor: 1 },
        { habilidad: 'disparar', valor: 1 },
        { habilidad: 'impresionar', valor: 1 },
        { habilidad: 'pelea', valor: 1 },
      ],
      beneficio: 'Reputación Profesional (novato)',
    },
  },
  {
    id: 'oda',
    nombre: 'ODA (Organización por los Derechos de los Alienígenas)',
    clase: 'independiente',
    descripcion: 'Activistas proalienígenas que luchan por la igualdad y los derechos de las especies no humanas.',
    bendicion: {
      nombre: 'Recto',
      efecto: 'Meta +1 a influencia cuando defiendas la dignidad y los derechos de los alienígenas.',
    },
    maldicion: {
      nombre: 'Resentido',
      efecto: 'Meta –1 en persuasión de influencia contra personas que odian a los alienígenas.',
    },
    premioMaterial: 'Llave amorfa (dispositivo ganzúa de NT6; Compulsión tecgnóstica: Diligente) o intérprete (máquina pensante de NT6; auricular y parche de garganta; entender y hablar hasta tres idiomas alienígenas. Compulsión tecgnóstica: Indiscreto)',
    vocacionFavorecida: 'Abogado',
    aprendizaje: {
      competenciasFijas: ['Hablar (idioma a elegir)', 'Saber Alienígena (especie a elegir)'],
      competenciasEleccion: [
        ['Usos de la Corte', 'Usos de la Catedral', 'Usos del Vulgo'],
      ],
      caracteristicas: [
        { caracteristica: 'intuicion', valor: 2 },
        { caracteristica: 'presencia', valor: 2 },
        { caracteristica: 'voluntad', valor: 1 },
      ],
      habilidades: [
        { habilidad: 'academia', valor: 1 },
        { habilidad: 'encanto', valor: 1, alternativas: ['impresionar'] },
        { habilidad: 'empatia', valor: 1, alternativas: ['sigilo'] },
        { habilidad: 'pelea', valor: 1, alternativas: ['disparar', 'supervivencia'] },
        { habilidad: 'charlataneria', valor: 1, alternativas: ['observar'] },
      ],
      beneficio: 'Reputación Profesional (novato)',
    },
  },
  {
    id: 'san-pablo',
    nombre: 'Sociedad de San Pablo',
    clase: 'independiente',
    descripcion: 'Exploradores intrépidos que buscan descubrir los secretos de los mundos perdidos y lo desconocido.',
    bendicion: {
      nombre: 'Alerta',
      efecto: 'Percepción +2 en entornos desconocidos.',
    },
    maldicion: {
      nombre: 'Nervioso',
      efecto: 'Presencia –2 en situaciones formales.',
    },
    premioMaterial: 'La Guía de Expediciones de la Sociedad de San Pablo (copia física o de datos; competencia amplia de Saber sobre los Mundos Conocidos, aunque bastante superficial)',
    vocacionFavorecida: 'Trotamundos',
    aprendizaje: {
      competenciasFijas: ['Operaciones a Bordo', 'Saber (a elegir)'],
      competenciasEleccion: [
        ['Ciencias de la Vida', 'Saber Alienígena', 'Saber Animal'],
      ],
      caracteristicas: [
        { caracteristica: 'fuerza', valor: 2, alternativas: ['presencia'] },
        { caracteristica: 'intuicion', valor: 2, alternativas: ['percepcion'] },
        { caracteristica: 'constitucion', valor: 1, alternativas: ['fe'] },
      ],
      habilidades: [
        { habilidad: 'conducir', valor: 1, alternativas: ['pilotar'] },
        { habilidad: 'cuerpoACuerpo', valor: 1, alternativas: ['disparar'] },
        { habilidad: 'curar', valor: 1, alternativas: ['supervivencia', 'tecnorredencion'] },
        { habilidad: 'encanto', valor: 1, alternativas: ['observar'] },
        { habilidad: 'tratoConAnimales', valor: 1 },
      ],
      beneficio: 'Reputación Profesional (novato)',
    },
  },
  {
    id: 'vagabundos',
    nombre: 'Vagabundos',
    clase: 'independiente',
    descripcion: 'Mendigos espaciales y nómadas que recorren los mundos buscando oportunidades y refugio.',
    bendicion: {
      nombre: 'Compasivo',
      efecto: 'Meta +1 para influencia de persuasión cuando ayudes a los demás.',
    },
    maldicion: {
      nombre: 'Zafio',
      efecto: 'Presencia –2 en eventos sociales.',
    },
    premioMaterial: '100 fénix extra conseguidos mendigando (puedes dividirlos y guardarlos en diversos escondrijos)',
    vocacionFavorecida: 'Amateur',
    aprendizaje: {
      competenciasFijas: ['Bajos Fondos', 'Hablar (dialecto de los vagabundos)', 'Saber (a elegir)'],
      competenciasEleccion: [],
      caracteristicas: [
        { caracteristica: 'constitucion', valor: 1 },
        { caracteristica: 'fe', valor: 2, alternativas: ['voluntad'] },
        { caracteristica: 'inteligencia', valor: 2 },
      ],
      habilidades: [
        { habilidad: 'charlataneria', valor: 1 },
        { habilidad: 'cuerpoACuerpo', valor: 1, alternativas: ['pelea'] },
        { habilidad: 'encanto', valor: 1, alternativas: ['impresionar'] },
        { habilidad: 'observar', valor: 1, alternativas: ['prestidigitacion'] },
        { habilidad: 'sigilo', valor: 1, alternativas: ['supervivencia', 'vigor'] },
      ],
      beneficio: 'Reputación Profesional (novato)',
    },
  },
  {
    id: 'vuldrok',
    nombre: 'Bárbaros Vuldrok',
    clase: 'independiente',
    descripcion: 'Bárbaros del espacio, guerreros feroces de más allá de las fronteras de los Mundos Conocidos.',
    bendicion: {
      nombre: 'Obstinado',
      efecto: 'Meta +1 en tiradas de Constitución, Voluntad y Fe cuando te retan.',
    },
    maldicion: {
      nombre: 'Orgulloso',
      efecto: 'Inteligencia –2 si te insultan.',
    },
    premioMaterial: 'Arma excelente (meta +1; por lo general un hacha) o escudo de mano excelente (+1 a su bonificador de Resistencia)',
    vocacionFavorecida: 'Pirata',
    aprendizaje: {
      competenciasFijas: ['Hablar (vuldrok)'],
      competenciasEleccion: [
        ['Armadura de Combate', 'Armadura de Guerra', 'Armas Militares'],
        ['Saber de Facción (Vuldrok)', 'Saber de Oficios'],
      ],
      caracteristicas: [
        { caracteristica: 'destreza', valor: 2, alternativas: ['fuerza'] },
        { caracteristica: 'constitucion', valor: 1 },
        { caracteristica: 'fe', valor: 1, alternativas: ['voluntad'] },
        { caracteristica: 'percepcion', valor: 1, alternativas: ['presencia'] },
      ],
      habilidades: [
        { habilidad: 'conducir', valor: 1, alternativas: ['pilotar'] },
        { habilidad: 'cuerpoACuerpo', valor: 1, alternativas: ['disparar', 'pelea'] },
        { habilidad: 'encanto', valor: 1, alternativas: ['impresionar', 'tratoConAnimales'] },
        { habilidad: 'oficios', valor: 1, alternativas: ['tecnorredencion'] },
        { habilidad: 'supervivencia', valor: 1, alternativas: ['vigor'] },
      ],
      beneficio: 'Reputación Profesional (novato)',
    },
  },
]

export function getFactionsByClass(classId: ClassId): FactionDefinition[] {
  return FACTIONS.filter(f => f.clase === classId)
}
