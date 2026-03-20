/**
 * Tooltip descriptions for game elements — extracted from the Fading Suns rulebook (Libro PJ).
 * Used across all character creation steps to provide context on hover.
 */

// ── Skills (Habilidades) ──

export const SKILL_TOOLTIPS: Record<string, string> = {
  academia: 'Sirve para investigar documentos escritos en busca de información, sobre todo información perdida u oculta. Funciona para buscar en bases de datos gremiales, repositorios eclesiásticos y bibliotecas olvidadas.',
  alquimia: 'Restringida. El arte y la ciencia de transmutar la materia. Los alquimistas también refinan el alma. Permite elaborar diversas pociones y sustancias, y refinar instrumentos para usarlos en rituales teúrgicos.',
  artes: 'Representa tu habilidad canalizando tu imaginación para expresar ideas y emociones con una técnica en particular, así como la comprensión general sobre cualquier técnica artística y sus obras más famosas.',
  charlataneria: 'El arte de hablar (o más bien mentir) para librarte de una situación o arrastrar a alguien a ella. Sabes cómo utilizar tu encanto natural, tu evasión verbal y tu descaro sin límites para conseguir que los demás te crean.',
  conducir: 'Permite conducir vehículos terrestres (incluidos los deslizadores, que son coches que se deslizan a pocos centímetros del suelo pero no vuelan). También incluye conocimientos básicos sobre cómo cuidar de tu vehículo.',
  cuerpoACuerpo: 'Representa la capacidad de empuñar todo tipo de armas cuerpo a cuerpo, como garrotes, espadas de energía, cuchillos o bastones. Cualquier tipo de arma cuerpo a cuerpo entra dentro de esta categoría.',
  curar: 'Abarca todo lo relacionado con la medicina, incluyendo primeros auxilios, cirugía, enfermedades, diagnosis y medicina preventiva. También puede incluir la implantación de dispositivos cibernéticos.',
  disfraz: 'Usa Disfraz cuando quieras hacerte pasar por otra persona. Gracias a la ropa, el maquillaje y las prótesis podrás cambiar tu aspecto. También existen opciones más tecnológicas.',
  disparar: 'Se aplica a cualquier dispositivo que propulse un objeto o una descarga de energía (bala, flecha, láser o incluso una piedra). Incluye hondas y arcos, mosquetes primitivos, fusiles de asalto y pistolas de energía.',
  empatia: 'Sirve para interpretar indicios verbales y no verbales y saber lo que otras personas sienten. Tienes la capacidad de analizar el tono y la entonación de alguien, así como su postura y sus gestos.',
  encanto: 'Representa tu amabilidad y tu capacidad de persuadir a los demás. Es la habilidad que necesitas para caer bien a la gente. Puedes usarla para causar una buena impresión, calmar a alguien enfadado o influir positivamente.',
  impresionar: 'Te permite dar órdenes a alguien, aterrorizarlo o intimidarlo. A diferencia del Encanto, que se utiliza para caer bien y convencer, Impresionar sirve para coaccionar a los demás por la fuerza de tu presencia.',
  interfaz: 'Restringida. Permite manejar y programar máquinas pensantes complejas. Necesaria para acceder a bases de datos protegidas, pilotar naves con sistemas avanzados y programar autómatas.',
  introspeccion: 'Sirve para alcanzar un estado de concentración profunda. Entrar en este trance meditativo requiere mantener la concentración durante un largo período de tiempo. Útil para oraciones, meditación y artes marciales.',
  intrusion: 'Te permite infiltrar sistemas de seguridad y forzar cerraduras. Se aplica a forzar cerraduras mecánicas o eléctricas, así como a desactivar alarmas y eludir medidas de seguridad.',
  pelea: 'Se utiliza en los combates cuerpo a cuerpo sin armas, e incluye dar puñetazos o patadas, hacer agarres e incluso utilizar armas improvisadas como botellas o sillas.',
  observar: 'Refleja tu percepción innata de lo que te rodea. Se aplica cuando estás buscando activamente. También podrías usarla para comprobar si te has dado cuenta de algo inesperado.',
  oficios: 'Sirve para fabricar, reparar y evaluar objetos conocidos por su funcionalidad (por lo general de NT3 o superior); te permite, por ejemplo, forjar espadas, fabricar joyas o construir casas.',
  pilotar: 'Restringida. Puedes pilotar vehículos voladores. También incluye conocimientos básicos sobre cómo cuidar de tu vehículo y hacer reparaciones temporales. Cada tipo de vehículo requiere su competencia.',
  prestidigitacion: 'Talento asociado con charlatanes y artistas callejeros. Utiliza esta habilidad para ocultar objetos de pequeño tamaño o hacer que desaparezcan los de otra persona sin que se dé cuenta.',
  representar: 'Sirve para provocar una reacción emocional en el público. Para usarla necesitas la competencia de Artes Escénicas asociada (Danza, Canto, Teatro, etc.).',
  sigilo: 'Representa tu capacidad para moverte en silencio y no ser visto. Se aplica a ocultarse a sí mismo (ocultar objetos pequeños utiliza Prestidigitación). Requiere algún tipo de cobertura o distracción.',
  supervivencia: 'Te permite sobrevivir en condiciones adversas (por lo general, en medio de la naturaleza, lejos de la civilización). Incluye rastrear animales o personas, hacer fuego e improvisar un refugio.',
  tecnorredencion: 'Sirve para fabricar y reparar tecnología. Los habitantes de los Mundos Conocidos lo ven como un proceso de redención de tecnología averiada o recalcitrante, que a menudo consideran que tiene vida propia.',
  tratoConAnimales: 'Representa tu comprensión y empatía hacia los animales, incluidas especies alienígenas no racionales. Con esta habilidad, puedes adiestrar animales y comprendes su comportamiento en general.',
  vigor: 'Describe la condición física del personaje, lo que incluye actividades como correr, saltar, nadar, escalar y resistir el agotamiento. Se utiliza en proezas atléticas y acciones de fuerza bruta.',
}

// ── Characteristics (Características) ──

export const CHARACTERISTIC_TOOLTIPS: Record<string, string> = {
  fuerza: 'Cuerpo · Potencia. Potencia muscular. La Fuerza determina cuánto peso puedes levantar, ayuda en los ataques cuerpo a cuerpo e influye en acciones atléticas como saltar y escalar.',
  destreza: 'Cuerpo · Agilidad. Agilidad y habilidades motoras. Define cómo de ágil y flexible eres, así como tu capacidad para manipular con cuidado instrumentos y objetos pequeños. Se usa en ataques a corto alcance y esquivar.',
  constitucion: 'Cuerpo · Fortaleza. Resistencia y complexión robusta. Refleja tu aguante, tu capacidad de mantener a raya las enfermedades y resistir venenos y toxinas. Factor de la Vitalidad.',
  inteligencia: 'Mente · Potencia. Capacidad analítica y rapidez mental. Determina tu facilidad para recordar y entender cosas, lo que ayuda con cualquier acción relacionada con el aprendizaje.',
  percepcion: 'Mente · Agilidad. Agudeza y alerta sensorial. Refleja lo consciente que eres de tu entorno e implica darse cuenta de personas o detalles ocultos, así como de otros cambios a tu alrededor.',
  voluntad: 'Mente · Fortaleza. Autocontrol y convicción. Refleja tu resolución y determina lo bien que resistes activamente los intentos de engañarte o confundirte. Factor de la Vitalidad.',
  presencia: 'Espíritu · Potencia. Elegancia, atracción y magnetismo personal. Refleja tu capacidad para influenciar a los demás. La gente tiende a verse atraída por personajes con Presencia alta.',
  intuicion: 'Espíritu · Agilidad. Imaginación e ingenio. Refleja tu entendimiento, tu sexto sentido y lo receptivo que eres a ideas distintas. Se usa para entender motivaciones ajenas y en trabajos creativos.',
  fe: 'Espíritu · Fortaleza. Valor y conciencia. Refleja tu luz interior, el faro que te orienta en tiempos oscuros. Los personajes con mucha Fe se sienten seguros de sí mismos. Factor de la Vitalidad.',
}

// ── Competencies (Competencias) ──

export const COMPETENCY_TOOLTIPS: Record<string, string> = {
  // Armadura
  'Armadura de Combate': 'Abarca el uso de armaduras ligeras e intermedias. Sin esta competencia, tus tiradas de Vigor serán desfavorables.',
  'Armadura de Guerra': 'Restringida. Te has entrenado en el uso de armaduras pesadas. Sin esta competencia, tus tiradas de Vigor serán desfavorables.',
  'Escudo de Mano': 'El uso entrenado de escudos de mano, como rodelas y escudos antidisturbios. Sin esta competencia, tus tiradas de Vigor y de ataque serán desfavorables.',

  // Armas a Distancia
  'Armas a Distancia': 'Especialización en un tipo de arma a distancia. Se usa con la habilidad Disparar.',
  'Armas a Distancia (Balas)': 'Sabes cómo usar y realizar el mantenimiento de armas a distancia que disparan proyectiles físicos (pistolas de balas, rifles, etc.).',
  'Armas a Distancia (Energía)': 'Restringida. Sabes cómo usar y realizar el mantenimiento de armas a distancia que proyectan energía: láseres, blásters, lanzallamas.',
  'Armas a Distancia (Artefacto)': 'Sabes cómo usar y realizar el mantenimiento de armas a distancia altamente tecnológicas. Cada arma requiere su propia competencia.',
  'Armas a Distancia (Tiro con Arco)': 'Sabes cómo usar y realizar el mantenimiento de un arco con flechas y otras armas de cuerda como las ballestas.',

  // Armas Cuerpo a Cuerpo
  'Armas Militares': 'Restringida. Abarca cualquier arma asociada comúnmente con el ejército o los duelos, como espadas, sables, armas de asta, etcétera.',
  'Artefactos Cuerpo a Cuerpo (elige artefacto)': 'Abarca armas de alta tecnología, como espadas de flujo o lanzas de energía vau. Cada arma requiere su propia competencia.',

  // Armamento Pesado
  'Armamento Pesado': 'Uso de armas pesadas de un tipo: Artillería, Artillería Montada o Demoliciones.',
  'Armamento Pesado (Artillería)': 'Restringida. Sabes cómo usar y realizar el mantenimiento de armas de artillería: morteros, lanzamisiles, etcétera.',
  'Armamento Pesado (Artillería Montada)': 'Restringida. Te permite usar armas pesadas montadas sobre plataformas o vehículos. También incluye las armas de las naves estelares.',
  'Armamento Pesado (Demoliciones)': 'Restringida. Sabes cómo fabricar y utilizar explosivos.',

  // Transporte
  'Monta': 'Sabes cómo montar un animal, por lo general un caballo, pero también existen otras criaturas adiestradas para aceptar jinetes. Se utiliza con la habilidad Vigor.',
  'Vehículos Acuáticos': 'Sabes manejar barcos de timón, lanchas y otros vehículos para desplazarse por el agua.',
  'Vehículos Aéreos': 'Sabes manejar aeronaves, como aceleradores, jets y planeadores. Se utiliza con la habilidad Pilotar.',
  'Vehículos de Animales': 'Estás acostumbrado a vehículos terrestres (carretas, carros, trineos) tirados por uno o varios animales. Se utiliza con la habilidad Conducir.',
  'Vehículos de Guerra': 'Restringida. Sabes manejar vehículos terrestres acorazados propios del ejército, como tanques y artillería móvil. Se utiliza con la habilidad Conducir.',
  'Vehículos Espaciales': 'Restringida. Te has formado para pilotar vehículos espaciales. Se usa con la habilidad Pilotar.',
  'Vehículos Terrestres': 'Vehículos terrestres (deslizadores, coches de ruedas y motos) de motor o propulsados por otros tipos de tecnología. Se utiliza con la habilidad Conducir.',
  'Transporte': 'Conocimientos sobre cómo manejar (conducir o pilotar) un tipo de vehículo a elegir.',

  // Idiomas
  'Hablar (idioma a elegir)': 'Puedes hablar un idioma con fluidez. El idioma común de los Mundos Conocidos es el urthés. Otros idiomas incluyen el vuldrés y otros idiomas alienígenas.',
  'Leer (idioma a elegir)': 'La mayoría de campesinos no saben leer. Con esta competencia puedes leer un idioma. El idioma común escrito es el urthés.',

  // Operaciones
  'Operaciones a Bordo': 'Estás versado en las reglas y normativas de la vida a bordo de una nave y te has entrenado en las actividades básicas de los vehículos espaciales. Incluye experiencia con trajes espaciales.',

  // Saber Académico
  'Saber Alienígena (a elegir)': 'Has adquirido conocimiento sobre otra especie alienígena: su cultura, costumbres e historia. También permite estar familiarizado con su sociedad.',
  'Saber Animal (a elegir)': 'Tienes conocimientos sobre el reino animal que incluyen criaturas alienígenas de diversos mundos. Elige región: Mundos Conocidos o Territorio Bárbaro.',
  'Saber de Facción (a elegir)': 'Entiendes el funcionamiento interno de diversas facciones: creencias, costumbres y estructura.',
  'Saber de Historia': 'Has estudiado la historia (fundamentalmente de los Mundos Conocidos). Hay quien dice que quienes no tienen esta competencia están condenados a repetir sus errores.',
  'Saber de Red de Salto (a elegir)': 'Conocimiento general sobre la red de salto. En tu cabeza tienes un mapa con la posición relativa de los planetas y las conexiones entre ellos. Elige: Mundos Conocidos o Territorio Bárbaro.',
  'Saber Marcial': 'Restringida. Amplio conocimiento sobre tácticas militares. Podría ser necesaria para planificar o ejecutar movimientos de tropas, o anticipar los movimientos del enemigo.',
  'Saber Oculto': 'Tienes conocimientos sobre los fenómenos esotéricos, arcanos y extraños comúnmente conocidos como «lo oculto». Incluye poderes psíquicos, teúrgia y superciencia anunnaki.',
  'Saber Planetario (a elegir)': 'Tienes conocimientos sobre un planeta de los Mundos Conocidos y su sistema solar. Representa un conocimiento más detallado que el Saber de Red de Salto.',
  'Saber Religioso': 'Estás versado en las creencias, enseñanzas, costumbres, dogmas, escrituras y ritos de la Iglesia Universal del Sol Celestial. También incluye conocimiento sobre himnos, fábulas y vidas de los santos.',

  // Saber Artístico
  'Saber Artístico': 'Competencias de Saber Artístico: se suelen utilizar con la habilidad Artes y sirven tanto para crear una obra de arte como para entenderla y valorarla.',

  // Saber Científico
  'Saber Científico': 'El Saber Científico se suele utilizar con la habilidad Academia, pero también podría ser necesario para reparar, fabricar e inventar tecnología usando Tecnorredención.',
  'Saber Científico (Ciencias Aplicadas)': 'Restringida. Sabes cómo crear o producir objetos tecnológicos utilizando la ciencia de la Liga Mercantil.',
  'Saber Científico (Ciencias de la Vida)': 'Has estudiado los organismos vivos.',
  'Saber Científico (Ciencias Naturales)': 'Restringida. Has estudiado física, astronomía, química y ciencia planetaria.',

  // Saber de Oficios
  'Arquitectura': 'Comprendes el arte y la práctica de diseñar edificios y estructuras de gran tamaño.',
  'Carpintería': 'Sabes construir edificios y otras estructuras de madera. También incluye objetos básicos (no artísticos): armarios, sillas, taburetes, bastones, etcétera.',
  'Cartografía': 'Sabes crear mapas.',
  'Cerámica': 'Has aprendido a fabricar objetos útiles con arcilla o materiales similares.',
  'Cerrajería': 'Conoces los fundamentos de los cerrojos, eres capaz de fabricarlos y podría ser más fácil forzarlos (con la habilidad Intrusión).',
  'Cocina': 'Has aprendido a preparar comida sabrosa y nutritiva. Algunos tipos de alta cocina podrían requerir también el uso de la habilidad Artes.',
  'Herrería': 'Sabes cómo forjar metales para fabricar objetos.',
  'Joyería': 'Sabes crear joyas a partir de metales y otros materiales.',
  'Marroquinería': 'Sabes utilizar el cuero para fabricar armaduras, prendas y otros objetos.',
  'Mampostería': 'Sabes construir estructuras de piedra, ladrillo y argamasa.',
  'Sastrería': 'Sabes confeccionar prendas a partir de tejidos.',
  'Tejeduría': 'Sabes fabricar textiles a partir de materias primas.',

  // Saber de Usos
  'Bajos Fondos': 'Extenso conocimiento sobre prácticas y costumbres criminales. Incluye conocimiento sobre las principales bandas de los Mundos Conocidos y las costumbres de zonas con gran delincuencia.',
  'Usos de la Catedral': 'Los usos del clero incluyen reglas no escritas sobre cómo reconocer y dirigirse a todo tipo de sacerdotes. Es especialmente importante saber cuándo bromear y cuándo mantenerse solemne.',
  'Usos de la Corte': 'Conoces las costumbres de la vida en la corte. Un error de protocolo en la corte es algo muy grave. El comportamiento cortesano incluye gran cantidad de expectativas tácitas y sutiles.',
  'Usos del Vulgo': 'Las costumbres de la gente corriente y de quienes la frecuentan: gremios e independientes. Incluye reglas no escritas sobre cómo regatear en el ágora y saber el precio de las cosas.',

  // Artes Escénicas
  'Artes Escénicas': 'Competencias relacionadas con la habilidad Representar: Canto, Danza, Magia, Música, Oratoria o Teatro.',

  // Saber Médico
  'Cirugía': 'Restringida. Sabes realizar intervenciones quirúrgicas en seres vivos.',
  'Enfermedades': 'Tienes conocimientos sobre enfermedades y sus tratamientos.',
  'Tortura': 'Has aprendido métodos que utilizan la represión física para sonsacar información.',
  'Venenos': 'Tienes conocimientos sobre venenos y sus antídotos.',
  'Saber Médico': 'Competencias del Saber Médico: suelen ser necesarias para diagnosticar o sanar a alguien con la habilidad Curar.',

  // Saber Tecnológico
  'Saber Tecnológico': 'Competencias que se aplican a niveles tecnológicos diferentes y deben aprenderse en orden, empezando por NT5. Se utiliza con la habilidad Tecnorredención.',
  'Saber Tecnológico (NT5)': 'Sabes cómo usar y reparar tecnología de nivel 5.',
  'Saber Tecnológico (NT6)': 'Restringida. Requisito: Saber Tecnológico (NT5). Sabes cómo usar y reparar tecnología de nivel 6.',
  'Saber Tecnológico (NT7)': 'Restringida. Requisito: Saber Tecnológico (NT6). Sabes cómo usar y reparar tecnología de nivel 7.',
  'Saber Tecnológico (NT8)': 'Restringida. Requisito: Saber Tecnológico (NT7). Sabes cómo usar y reparar tecnología de nivel 8. Este es el nivel tecnológico más alto que puede aprender un personaje.',

  // Otros
  'Máquinas Pensantes': 'Competencia necesaria para usar y programar máquinas pensantes complejas, como las que se encuentran en las naves estelares o los archivos de la Iglesia.',
  'Instrumento Musical (a elegir)': 'Cada familia de instrumentos requiere su propia competencia: Cuerda, Viento madera, Percusión, Teclado, Viento metal. Requisito: Artes Escénicas (Música).',
  'Inteligencia Artificial (IA)': 'Restringida. Requisito: Máquinas Pensantes. Te has instruido en el arte y la ciencia de programar máquinas pensantes dotadas de razón.',
  'Terraformación': 'Restringida (Liga Mercantil). Has estudiado el proceso para terraformar planetas y que sean habitables para los humanos.',
  'Saber de Oficios': 'Competencias que se suelen utilizar con la habilidad Oficios y sirven tanto para crear un objeto como para entenderlo y valorarlo.',
}

// ── Benefits (Beneficios) ──
// Format: 'Scope • Type • Requisito: X. Mechanical description from the rulebook (pp. 119–166).'

export const BENEFIT_TOOLTIPS: Record<string, string> = {
  // ── Class archetypes (Ímpetu) ──
  'Imperioso': 'Clase • Ímpetu • Requisito: Noble. Una vez por escena, gasta una acción secundaria para adoptar un porte imperioso contra un intento de influencia o poder oculto. Roba PV de la reserva (máx. 5 + nivel) para aumentar tu Resistencia Mental o Espiritual.',
  'Inspirador': 'Clase • Ímpetu • Requisito: Sacerdote. Puedes dar PV y PW de tu depósito a otros personajes incluso fuera de tu turno. Deben verte u oírte. Máximo de destinatarios por ronda = tu nivel. Además, una vez por escena puedes dar 1 PW del arca de la compañía a un miembro sin votación.',
  'Ingenioso': 'Clase • Ímpetu • Requisito: Mercader. Una vez por escena, puedes conseguir recompensas adicionales de una tirada exitosa en una acción primaria. Convierte 3 de los PV que ganes con la tirada en 1 punto de wyrd.',
  'Autónomo': 'Clase • Ímpetu • Requisito: Independiente. Una vez por escena, puedes ejercer tu libertad frente a una acción de influencia o poder oculto. Roba PV de la reserva (máx. 5 + nivel) para aumentar tu Resistencia Mental o Espiritual.',

  // ── Class benefits (Noble) ──
  'Agilidad': 'Clase • Capacidad • Requisito: Libre o duelista. Una vez por ronda, cuando gastes PV para aumentar tu Resistencia Corporal contra un ataque físico, añade +2 por cada PV gastado. No se aplica con armadura de combate, de guerra, traje espacial, armadura civil con penalización de Destreza/Vigor, ni estando sobrecargado.',
  'Autoridad': 'Clase • Privilegio • Requisito: Título Nobiliario 3+ (barón). Una vez por escena y por nivel, cuando realices acciones de influencia contra personas sujetas a la ley de tu casa, ignoras cualquier Resistencia Mental de su rango si son de menor rango que tú.',
  'Bendición de San Lextius': 'Clase • Ímpetu • Requisito: Noble. Una vez por acto, tras rezar a san Lextius como acción primaria, convierte PV de tu depósito o banco en PW (3 PV = 1 PW) hasta un máximo de PW = tu Fe. Debes comportarte según los ideales de caballería o recibirás el estado Penalizado.',
  'Campeón': 'Clase • Ímpetu • Requisito: Noble. Una vez por escena, designa a alguien como tu campeón. Como acción primaria, puedes darle PV y PW de tu banco (máx. por turno = tu nivel). Debes estar presente, al alcance de la vista y el oído.',
  'Dos Pistolas': 'Clase • Capacidad • Requisitos: Duelista o hermano de batalla o noble o pirata, y las competencias de arma adecuadas. Con una pistola en cada mano, puedes atacar con la de la mano no dominante en vez de moverte. Sin Ambidiestro, la tirada de la mano no dominante es desfavorable.',
  'Esgrima': 'Clase • Capacidad • Requisitos: Competencia Armas Militares y varía según estilo (Duelo: Noble; Kraxi: Decados/mercader/ukar; Serpentis: Noble; Torero: Noble). Ventajas especiales en combate con un tipo de arma. Sin la competencia, tiradas desfavorables. Se puede adquirir dos veces: Galán y Espadachín.',
  'Nobleza Obliga': 'Clase • Ímpetu • Requisito: Noble. Como acción primaria, gasta PV y PW de tu banco para mejorar las acciones de influencia de personajes no nobles (meta, impacto o Resistencia). Solo para ayudarlos. Usos por escena = tu nivel. Destinatarios por ronda = tu Presencia.',
  'Terrateniente': 'Clase • Privilegio • Requisito: Mercader o noble o sacerdote. Los siervos de tus tierras son tus vasallos. Tiradas de influencia contra ellos favorables. Puedes juzgar sus delitos y reunir milicia en tiempos de guerra.',
  'Riqueza': 'Clase • Privilegio • Requisito: Mercader o noble o sacerdote. Ingresos regulares vinculados a tu rango. Se puede adquirir varias veces: 1.º Bueno (3000/año), 2.º Acomodado (5000), 3.º Pudiente (10000), 4.º Rico (15000), 5.º Opulento (20000). Al inicio dispones del 10% de tus ingresos anuales.',
  'Sirviente': 'Clase • Privilegio • Requisito: Mercader o noble o sacerdote. Un sirviente devoto de nivel = mitad del tuyo. Usa tu depósito de PV. Puede ser un senescal, amigo de la infancia o similar.',
  'Título Nobiliario': 'Clase • Privilegio • Requisito: Noble. Rango nobiliario jerárquico. Cada nivel sucesivo aumenta tu rango y ofrece Resistencia Mental +2 acumulable. Rangos: 1.º Caballero, 2.º Baronet, 3.º Barón, 4.º Marqués, 5.º Conde, 6.º Duque.',
  'Título Nobiliario (caballero)': 'Clase • Privilegio • Requisito: Noble. Rango 1. Resistencia Mental +2. Título de caballero o dama otorgado por tu casa noble.',

  // ── Class benefits (Sacerdote) ──
  'Bendición del Santo': 'Clase • Capacidad • Requisito: Independiente o mercader. Una vez por acto, tras rezar al santo de tu elección como acción primaria, convierte PV de tu depósito o banco en PW (3 PV = 1 PW) hasta un máximo de PW = tu Fe. Debes comportarte según los ideales del santo o recibirás el estado Penalizado.',
  'Condenar': 'Clase • Ímpetu • Requisito: Sacerdote. Una vez por escena y por nivel, retira PV del banco/depósito de otra persona (= tu nivel + 1 por cada 3 PV de tu depósito que gastes). Los PV condenados van a la reserva. No puedes condenar a la misma persona más de una vez por escena.',
  'Iluminado': 'Clase • Capacidad • Requisito: Monje u ocultista o psíquico o sacerdote o teúrgo. Una vez por obra, convierte PV de tu depósito o banco en PW (3 PV = 1 PW) hasta un máximo de PW = tu nivel.',
  'Ordenación Religiosa': 'Clase • Privilegio • Requisito: Sacerdote. Rango eclesiástico jerárquico. Cada nivel sucesivo aumenta tu rango y ofrece Resistencia Mental +2 acumulable. Rangos: 1.º Novicio, 2.º Canónigo, 3.º Diácono, 4.º Sacerdote, 5.º Obispo, 6.º Arzobispo.',
  'Ordenación Religiosa (aprendiz)': 'Clase • Privilegio. Rango eclesiástico de aprendiz (Hermanos de Batalla). Primer paso en la jerarquía.',
  'Ordenación Religiosa (novicio)': 'Clase • Privilegio. Rango eclesiástico de novicio. Resistencia Mental +2. Acceso a los recursos básicos de tu orden.',
  'Purga': 'Clase • Capacidad • Requisito: Sacerdote. Una vez por escena, impón penitencia a alguien con estado Presionado. Si no la cumple en una semana, queda Culpable crónico.',
  'Súplica': 'Clase • Capacidad • Requisito: Sacerdote o corista. Una vez por acto, cuando obtienes PV por un impulso, convierte hasta (tu Intuición) PV en PW (1:1). Debes dar al menos la mitad de los PW al arca de la compañía en la misma ronda o quedarás Penalizado.',

  // ── Class benefits (Mercader) ──
  'Cargo Gremial': 'Clase • Privilegio • Requisito: Mercader. Rango gremial jerárquico. Se puede adquirir varias veces. Cada rango ofrece Resistencia Mental +2 acumulable.',
  'Cargo Gremial (alférez)': 'Clase • Privilegio. Rango 1 de alférez en los Aurigas. Resistencia Mental +2.',
  'Cargo Gremial (aprendiz)': 'Clase • Privilegio. Rango de aprendiz en Ingenieros. Acceso a talleres y formación.',
  'Cargo Gremial (asociado)': 'Clase • Privilegio. Rango de asociado en Magistrados o Carroñeros. Miembro pleno.',
  'Cargo Gremial (soldado raso)': 'Clase • Privilegio. Rango de soldado raso en la Asamblea. Miembro reconocido de la fuerza mercenaria.',
  'Embargo': 'Clase • Privilegio • Requisito: Cargo Gremial rango 3+. Declara un embargo contra alguien para que ningún miembro de la Liga comercie con él. El 70% del comercio pasa por la Liga. Tiradas de influencia para negociar favorables.',
  'Experto en Tecnología': 'Clase • Capacidad • Requisito: Mercader. Declara afinidad con un tipo de equipo NT5+. Tiradas para repararlo favorables. Inmune a la compulsión del objeto en uso sobrecargado con éxito crítico.',
  'Manitas': 'Clase • Capacidad • Requisito: Mercader. Una vez por nivel y por escena, haz una tirada favorable con un dispositivo NT5+ (uso, comprensión o reparación). Cada uso puede ser un dispositivo diferente. No se aplica a ataques. Tiradas contra compulsiones tecgnósticas favorables.',
  'Tahúr': 'Clase • Capacidad • Requisito: Mercader. Una vez por escena, antes de tirar, apuesta PV de la reserva. Si la tirada no produce al menos esa cantidad, pierdes el doble. Si no puedes pagar, Penalizado.',

  // ── Independiente class ──
  'Reputación Profesional': 'Clase • Privilegio • Requisito: Independiente. Se puede adquirir varias veces. Cada rango ofrece Resistencia Mental +2. Rangos: 1.º Novato, 2.º Oficial, 3.º Experto, 4.º Sabio, 5.º Maestro.',
  'Reputación Profesional (novato)': 'Clase • Privilegio. Primer rango de reputación como independiente. Resistencia Mental +2.',

  // ── Class benefits (shared) ──
  'Adjunto de Casa': 'Clase • Privilegio • Requisito: Independiente. Empleado por una casa noble. +2 a meta de influencia de persuasión contra miembros de la casa. Una vez por acto, menciona el nombre de tu jefe para una tirada de influencia favorable.',
  'Alentar': 'Clase • Capacidad • Requisito: Comandante o sanador o sacerdote. Una vez por escena y por nivel, como acción secundaria, un aliado herido gana una reanimación extra (no consume las suyas). Solo una vez por acto por persona.',
  'Armonizar': 'Clase • Capacidad • Requisito: Sacerdote o corista. Como acción primaria, ayuda a alguien para que su tirada sea favorable (no combate ni influencia). Debes tener al menos 1 punto de habilidad por encima de la base. Alternativa: cantar para dar +2 a la meta.',
  'Artes Marciales': 'Clase • Capacidad • Requisito: Varía según estilo (Graa: Vorox; Jox Kai Von: libre; Koto: libre; Shaidán: Noble; Talón de Hierro: Asamblea/cadenero/cazarrecompensas/mercenario). Ventajas especiales en combate cuerpo a cuerpo. Se puede adquirir dos veces: Adepto y Maestro.',
  'Cartulario': 'Clase • Privilegio • Requisitos: Sacerdote o clero, y Ordenación Religiosa. Acceso a bibliotecas protegidas de la Iglesia y archivos de datos eclesiásticos encriptados sin necesidad de tirada de Interfaz.',
  'Héroe del Pueblo': 'Clase • Privilegio • Requisito: Fraile o independiente o sanador. Tiradas favorables con campesinos. Meta +2 para convencerlos de que te escondan de las autoridades.',
  'Hierofante': 'Clase • Privilegio • Requisitos: Sacerdote o clero, y Saber Religioso. Tiradas sobre debates de escrituras favorables. Puedes formular nuevas doctrinas e introducir interpretaciones que transformen herejías en diferencias de doctrina.',
  'Inviolabilidad': 'Clase • Capacidad • Requisito: Clero o sacerdote. Una vez por escena, gasta 1 PV para intimidar a todas las personas próximas. Los que no superen su Resistencia Mental quedan Atónitos y no pueden atacarte. No puedes atacar ni coaccionar a los Atónitos.',
  'Legado': 'Clase • Privilegio • Requisito: Sacerdote o clero. Embajador eclesiástico en una casa noble. Resistencia Mental +2 contra nobles de la casa, competencia Usos de la Corte. Tiradas de influencia favorables con miembros de la casa en funciones sacerdotales.',
  'Pastor del Rebaño': 'Clase • Ímpetu • Requisito: Sacerdote. Una vez por escena, pide PV del depósito de cada PJ presente (máx. 3 + 1 por nivel por PJ). Colócalos en un arca del rebaño. Solo tú puedes gastarlos, en ti o en otros.',
  'Puntería': 'Clase • Capacidad • Requisito: Duelista o mercader o noble. Ventajas especiales con armas de fuego o láser en combate. Sin la competencia de Arma a Distancia adecuada, tiradas desfavorables. Se puede adquirir dos veces: Buen Tirador y Pistolero.',
  'Sabio': 'Clase • Privilegio • Requisitos: Sacerdote y una secta que no pertenezca a la Iglesia. Autoridad religiosa en tu secta. Resistencia Mental +2, acumulable si se adquiere varias veces.',
  'Sello Inquisitorial': 'Clase • Privilegio • Requisitos: Sacerdote o inquisidor, y Ordenación Religiosa 4+. Sello permanente del sínodo inquisitorial. Funciones inquisitoriales a tiempo completo sin consultar a superiores.',
  'Sermón Virtuoso': 'Clase • Capacidad • Requisitos: Sacerdote y Artes Escénicas (Oratoria) 5+. Una vez por escena, como acción primaria, recita los Evangelios Omega. Mantén el sermón como acción secundaria (máx. 1 turno/nivel). Los aliados creyentes reciben el estado Divinamente Inspirados.',

  // ── Vocation: Military / Combat ──
  'Apuntar donde Duele': 'Vocación • Capacidad • Requisito: Cadenero o cazarrecompensas o duelista. Cuando gastes PV para aumentar el daño, los primeros 3 puntos cuestan 1 PV cada uno (el resto 2 PV como siempre).',
  'Armado hasta los Dientes': 'Vocación • Capacidad • Requisitos: Cazarrecompensas o duelista o hermano de batalla o mercenario o pirata, y las competencias de armas apropiadas. Con arma cuerpo a cuerpo en mano dominante y arma de fuego en la otra, ataca con el arma de fuego en vez de moverte. Sin Ambidiestro, tirada desfavorable.',
  'Condicionamiento Mental': 'Vocación • Austeridad • Requisito: Hermano de batalla o templario o ur-obun. Resistencia Espiritual +2 mediante rigurosos ejercicios mentales y espirituales diarios.',
  'Danza de la Destrucción': 'Vocación • Capacidad • Requisito: Duelista. Una vez por escena, en postura de danza con un ataque victorioso, intenta una acción primaria adicional de intimidar, cautivar o enardecer. Requiere moverte al menos 1 m. Si fallas, pierdes la postura salvo que gastes 1 PV.',
  'Guardaespaldas': 'Vocación • Capacidad • Requisito: Templario. Si no has actuado esta ronda, intercepta un ataque contra alguien cercano (alcanzable con una acción de movimiento). El ataque va dirigido a ti.',
  'Inalterable': 'Vocación • Capacidad • Requisito: Hermano de batalla. Puedes usar quitárselo de encima como acción secundaria para anular cualquier estado. Si tienes prohibido quitarte el estado, puedes ignorar la restricción.',
  'Instinto Marcial': 'Vocación • Capacidad • Requisito: Hermano de batalla o mercenario. Añade tu Constitución o Voluntad (elige una) al valor de tus impulsos. Además, un impulso adicional una vez por acto.',
  'Lealtad hasta la Muerte': 'Vocación • Ímpetu • Requisito: Comandante o lord. Una vez por acto, da un discurso inspirador (1 min + tirada de enardecer). Los PV van a un arca de valor. Los Enardecidos reciben el estado Valiente (inmunes a Asustado/Intimidado, Resistencia Mental +2 contra Aterrorizado).',
  'Leva': 'Vocación • Privilegio • Requisitos: Comandante o lord, y Título Nobiliario 2+. Recluta milicianos entre campesinos con la maniobra dar una orden. La Resistencia depende del tamaño de la unidad y las circunstancias.',
  'Mantok': 'Vocación • Capacidad • Requisito: Hermano de batalla. Estilo de lucha cuerpo a cuerpo de los Hermanos de Batalla. Funciona como Artes Marciales (escuela Mantok). Se puede adquirir dos veces: Adepto y Maestro.',
  'Matón a Sueldo': 'Vocación • Privilegio • Requisito: Ronin. Siervo integrado en una casa noble. Estipendio de 150 fénix/año y transporte gratis en misiones. Te ven como miembro de la casa desde fuera, pero con el estatus más bajo dentro.',
  'Medalla al Mérito': 'Vocación • Privilegio • Requisito: Adjunto imperial o caballero expedicionario u orden de caballería o templario. Resistencia Mental +1. Moderadamente famoso. +2 a meta de influencia con miembros de tu orden.',
  'Medalla al Valor': 'Vocación • Privilegio • Requisito: Adjunto imperial o caballero expedicionario u orden de caballería o templario. +2 a la meta de quitárselo de encima. Resistencia Mental +1.',
  'Medalla de la Orden': 'Vocación • Privilegio • Requisito: Orden de caballería o templario. Estipendio anual de 300 fénix. Alojamiento y ayuda de la orden. Código de conducta obligatorio.',
  'Mente Estratégica': 'Vocación • Capacidad • Requisito: Comandante. Como acción secundaria, gasta PV de tu depósito para modificar la siguiente tirada de un aliado en +1/−1 por PV (máx. = tu nivel). Una vez por escena por persona.',
  'Nacido en el Campo de Batalla': 'Vocación • Capacidad • Requisito: Hermano de batalla o mercenario o pirata o templario. Inmune al estado Intimidado. Resistencia Mental y Espiritual +2 contra influencia y poderes ocultos que impongan estados de miedo.',
  'Parangón de la Orden': 'Vocación • Ímpetu • Requisito: Caballero expedicionario u orden de caballería o templario. Elige una causa de tu orden. Una vez por escena, si tu acción sirve a la causa, recoge PV de la reserva = tu Fe.',
  'Puntería Asistida': 'Vocación • Ciberdispositivo de NT7 • Requisito: Duelista o pirata. Apunta a oponentes sin mirarlos, sin desventaja (incluso Cegado o Visión Reducida). Si los miras al atacar, +2 a meta. Compulsión tecgnóstica: Sanguinario.',
  'Rango Militar': 'Vocación • Privilegio • Requisitos: Para oficiales: Cargo Gremial o comandante u Ordenación Religiosa o Título Nobiliario; sin requisitos para tropa. Oficiales: +1 acumulable a meta de liderar tropas. Tropa: +1 acumulable a meta de Encanto/Observar entre soldados.',
  'Resistente': 'Vocación • Capacidad • Requisito: Hermano de batalla o mercenario. Una vez por escena, cuando recibas daño, gasta 1 PV por punto de daño para anularlo (máx. = tu Vigor).',
  'Salvación': 'Vocación • Capacidad • Requisito: Hermano de batalla. Una vez por acto, si recibes daño mortal, reza para recuperar Vitalidad = el valor de tus impulsos.',

  // ── Vocation: Social / Intrigue ──
  'Acompañamiento': 'Vocación • Capacidad • Requisito: Cortesano. Como acción primaria, haz trabar amistad contra (tu nivel) individuos. Se unen a tu séquito, siguen tus órdenes y te defienden el resto de la escena.',
  'Agente Secreto': 'Vocación • Privilegio • Requisito: Espía. Rango jerárquico de espía: 1.º Recluta, 2.º Agente, 3.º Operativo, 4.º Supervisor, 5.º Maestro de espías. Cada rango añade +1 a Charlatanería con agentes aliados/rivales. Tu agencia da +2 a una habilidad según facción.',
  'Agitador': 'Vocación • Capacidad • Requisito: Conspirador o espía. Enardece campesinos con oratoria (maniobra enardecer con Artes Escénicas: Oratoria). Los Enardecidos te siguen y atacan al objetivo que señales. No te absuelve legalmente.',
  'Amante': 'Vocación • Privilegio • Requisito: Cortesano. Pareja de una persona con poder. Si conocen la relación: +2 a meta de influencia y +1 a Resistencia Mental contra oponentes. Una vez por escena, pide un regalo (Encanto + Presencia, Resistencia Mental −4 de tu pareja).',
  'Arte del Insulto': 'Vocación • Capacidad • Requisito: Espía o conspirador o cortesano o sibarita. Cuando superas la maniobra humillar, impones el estado Berserk en vez de Enfadado.',
  'Calculador': 'Vocación • Ímpetu • Requisito: Conspirador. Inmune a estados negativos por el sufrimiento ajeno. Riesgo calculado: una vez por escena, coge (nivel + 5) PV de la reserva. Devuelve la deuda antes de que acabe la escena o sufre penalizador a tiradas sociales.',
  'Chantaje': 'Vocación • Capacidad • Requisito: Sibarita. Una vez por obra, organiza una fiesta para chantajear a (tu Charlatanería) personas. Durante la obra, reclama favores sociales, recursos o servicios.',
  'Chivos Expiatorios': 'Vocación • Capacidad • Requisito: Conspirador. Cuando vayas a recibir Humillado o Presionado, pásalo a un chivo expiatorio. Cuando descubran una intriga tuya, sacrifica un contacto para evitarlo (se volverá tu enemigo).',
  'Congraciarse': 'Vocación • Capacidad • Requisito: Comerciante o cortesano o sibarita. Cuando uses persuasión contra alguien amistoso, además del impacto, el objetivo queda Congraciado: comparte cotilleos y te ensalza ante otros.',
  'Consejo Privado': 'Vocación • Privilegio • Requisito: Lord. Reúne un consejo de PNJ (cantidad = tu nivel). Cada consejero da +2 a meta en su ámbito (Iglesia, Liga, casas, alienígenas, guerra, habilidades, espionaje). Cada efecto una vez por escena.',
  'De Confianza': 'Vocación • Capacidad • Requisito: Magnate. Tiradas favorables para convencer a otros de que te presten dinero o inviertan en tus negocios. Sueles conseguir sumas mayores de lo normal.',
  'Libertinaje': 'Vocación • Capacidad • Requisito: Sibarita. Tras 5 min interactuando con alguien, usa la maniobra pervertir (Encanto) contra su Resistencia Mental. Si vences, queda Pervertido y puedes empujarlo a acciones escandalosas con maniobras de convencer.',
  'Maestro del Engaño': 'Vocación • Capacidad • Requisitos: Conspirador y Charlatanería 5+. Tus maniobras de engañar son favorables. Resistencia Mental +2 contra los engaños de los demás.',
  'Miembro del Consejo': 'Vocación • Privilegio • Requisitos: Conspirador o cortesano, y Título Nobiliario 1+. Asesor de un lord de tu casa. Resistencia Mental +2 contra coacción mientras trabajes para él.',
  'Mímesis': 'Vocación • Capacidad • Requisito: Espía. Tras observar 5 min a alguien, imita su comportamiento y tics. Tirada de imitar (Disfraz) favorable; quienes intenten ver a través hacen tirada desfavorable. Puedes imitar la competencia de Usos del objetivo.',
  'Porte Noble': 'Vocación • Capacidad • Requisito: Confesor. Tienes la competencia Usos de la Corte. Tus tiradas de persuasión o coacción (elige uno) son favorables contra nobles.',
  'Red de Mentiras': 'Vocación • Capacidad • Requisito: Conspirador. Red de agentes que permite maniobras de Encanto o Charlatanería a distancia contra cualquiera relacionado con tus agentes. Los objetivos ganan +2 a Resistencia Mental. Si fallas, pillan a tu agente.',
  'Respetable': 'Vocación • Capacidad • Requisito: Cortesano. Los miembros de cortes nobles no hostiles se comportan amistosamente contigo. Tiradas de Encanto favorables contra miembros de tu casa o quienes la sirvan.',
  'Segunda Piel': 'Vocación • Capacidad • Requisito: Espía o incógnito. Elige una identidad y un objeto/comportamiento asociado. Como acción secundaria, ponte/quítate el disfraz. Los oponentes no pueden detectarlo con percepción instintiva y las tiradas para verlo son desfavorables.',

  // ── Vocation: Ecclesiastical ──
  'Absolución': 'Vocación • Privilegio • Requisito: Confesor. Como acción primaria, anula un estado social o mental (breve, temporal o persistente, no crónico ni oculto) prescribiendo una penitencia. No más de una vez por acto por penitente.',
  'Armadura de Pureza': 'Vocación • Austeridad • Requisito: Inquisidor o monje. Resistencia Espiritual +2. Si abandonas la oración diaria, pierdes el beneficio hasta que practiques al menos dos días.',
  'Armadura de Santidad': 'Vocación • Privilegio • Requisito: Fraile. Tu comunidad te tiene en alta estima (Amigados automáticamente). Puedes cautivarlos con una acción secundaria. No pueden atacarte mientras estén Cautivados.',
  'Caza de Brujas': 'Vocación • Privilegio • Requisito: Sacerdote o inquisidor. Una vez por obra, pide a la Inquisición un Sello Inquisitorial temporal para extirpar una herejía o interrogar a alguien.',
  'Confesor de la Casa': 'Vocación • Privilegio • Requisito: Confesor. Tienes el beneficio Adjunto de Casa de la casa a la que sirves. Tiradas favorables para conseguir audiencia con miembros de la casa.',
  'Cuerpo Sutil': 'Vocación • Capacidad • Requisito: Monje. Trance contemplativo: no necesitas agua ni comida, los venenos dejan de hacerte daño. Si mantienes el trance durante un Descanso: elimina venenos/infecciones, anula un estado crónico, cura Vitalidad = tu nivel.',
  'Cuestor': 'Vocación • Privilegio • Requisito: Clero. Influencia favorable en el ámbito de Usos de la Catedral. +2 a la meta de eludir en ese ámbito.',
  'Cuidar del Rebaño': 'Vocación • Ímpetu • Requisito: Fraile. Una vez por acto, nombra (tu Fe) personas como tu rebaño. Una vez por escena, cuando un miembro gane PV por impulso, añade el valor de tus impulsos a los PV ganados (sin costarte impulsos).',
  'Epifanía': 'Vocación • Capacidad • Requisitos: Entusiasta o erudito o mendicante o monje u oniromante, y una o más competencias de Saber. Una vez por acto, declara una frase sabia. Quienes superen Introspección + Intuición contra su Voluntad reciben el estado Gnosis (tiradas favorables sobre el tema).',
  'Fortaleza en la Fe': 'Vocación • Capacidad • Requisito: Mendicante o sanador. Una vez por escena, como acción secundaria, recita un pasaje para que la siguiente tirada de un oyente sea favorable. Gasta 2 PV por oyente adicional (máx. = tu Fe).',
  'Góspel': 'Vocación • Capacidad • Requisitos: Corista y Artes Escénicas (Canto). Gasta 1 PV y canta un himno como acción primaria. Afectas a (tu Representar) oyentes. Mientras cantes (acción secundaria), los oyentes ganan Resistencia Mental y Espiritual +2 contra estados no deseados.',
  'Guardar Secretos': 'Vocación • Capacidad • Requisito: Confesor. Tiradas de Empatía favorables para detectar motivos, sinceridad e intenciones (ej: detectar mentira).',
  'Incubación': 'Vocación • Austeridad • Requisito: Mendicante u oniromante. Resistencia Espiritual +2. Una vez a la semana como mínimo, debes Descansar en una zona sagrada (santuario, templo o zona consagrada).',
  'Indulgencia': 'Vocación • Capacidad • Requisito: Clero. Habla 1 min con alguien para anular un estado mental o social (temporal o persistente) o reducir un crónico a persistente. Una vez por acto por persona.',
  'Inspirar Miedo': 'Vocación • Capacidad • Requisito: Inquisidor. Una vez por escena, cuando venças en influencia de coacción, impón un efecto adicional: Culpable o Asustado (persistente) además del estado normal.',
  'Llamamiento a la Penitencia': 'Vocación • Capacidad • Requisito: Confesor. Una vez por escena, maniobra de presionar contra la Fe de cada oyente. Los que no superen quedan Penalizados hasta que se confiesen o acabe la escena. Afecta a todos, incluidos aliados.',
  'Microconfesiones': 'Vocación • Capacidad • Requisito: Confesor u oniromante. Cuando intenten confundirte o engañarte, tira 1d20: 1-10 = tirada desfavorable para el atacante; 11-20 = sin efecto.',
  'Oración Terapéutica': 'Vocación • Capacidad • Requisito: Sanador. Como acción primaria, toca a alguien herido en esta escena y reza: cura 1 punto de Vitalidad por cada punto de Fe que tengas. Una vez por escena por objetivo.',
  'Orden Monástica': 'Vocación • Privilegio • Requisito: Monje. Alojamiento y orientación en lugares de tu orden. +2 a meta de influencia con miembros de la orden. Resistencia Mental +2 contra coacción de miembros de la Iglesia ajenos a tu orden.',
  'Palabras Liberadoras': 'Vocación • Capacidad • Requisito: Fraile u oniromante. Como acción primaria, mitiga un estado mental o social de alguien: no siente los efectos durante tantos turnos como PV gastes. También puedes usar escuchar confesión (Empatía) tras hablar 1 min.',
  'Respiración Coordinada': 'Vocación • Ímpetu • Requisito: Corista. Una vez por escena, cuando un compañero use un impulso, gana PV como si tú también lo hubieses gastado, sin gastar tus impulsos.',
  'Ritos Teúrgicos': 'Vocación • Poder. Conoces ritos teúrgicos con efectos sobrenaturales. Los poderes tienen inconvenientes como la Hubris teúrgica.',
  'Sacerdote Secular': 'Vocación • Capacidad • Requisito: Fraile. Competencia Usos del Vulgo sin tiradas desfavorables. Tiradas de influencia favorables contra las clases bajas. La gente acude a ti con sus problemas.',
  'Tonalidad': 'Vocación • Capacidad • Requisito: Corista. Una vez por escena, como acción primaria, establece un ritmo cantado. Cada ronda que mantengas el ritmo (acción primaria), tus compañeros restan 1 a la Resistencia enemiga por PV que gastes (máx. = tu Representar).',
  'Voto de Pobreza': 'Vocación • Austeridad • Requisito: Mendicante o monje. Resistencia Espiritual +2. No puedes acumular riqueza; renuncia al dinero que recibas (excepto necesidades básicas). Puedes aceptar regalos útiles no extravagantes.',

  // ── Vocation: Occult / Psychic ──
  'Aventurarse en las Tinieblas': 'Vocación • Capacidad • Requisito: Ocultista. Una vez por escena, al fallar una tirada, repítela como favorable. Pero recibes el estado Perseguido el resto de la escena (no puedes quitártelo, persuasión desfavorable).',
  'Conocimiento Wyrd': 'Vocación • Austeridad • Requisito: Ocultista. Resistencia Espiritual +2. Debes estudiar asiduamente ciencias esotéricas y buscar nuevos saberes ocultos o científicos.',
  'Contrarrestar las Tinieblas': 'Vocación • Capacidad • Requisito: Ocultista. Como acción primaria, mitiga un estado causado por poderes ocultos (psíquicos, teúrgia, artefactos ur). El estado deja de afectar durante tantos turnos como PV gastes.',
  'Imbuir Filacteria': 'Vocación • Capacidad • Requisitos: Hermano de batalla o teúrgo, y Teúrgia 5+. Imbuve un objeto con ritos teúrgicos. Cualquier teúrgo que lo sostenga puede lanzar los ritos contenidos. Límite de puntos de rito = tu nivel. Un día por nivel de rito. Una filacteria al mes.',
  'Imbuir Sagrario': 'Vocación • Capacidad • Requisito: Hermano de batalla o psíquico o teúrgo. Un sagrario funciona como arca de PV (capacidad = Psi/Teúrgia × 2) para alimentar poderes ocultos. Recárgalo con tus PV en una ceremonia de 1 hora.',
  'Miembro de Aquelarre': 'Vocación • Privilegio • Requisito: Psíquico. Reconoces señales y códigos de tu aquelarre. Acceso a reuniones, entrenamiento psíquico y ayuda de otros miembros. Obligaciones: misiones para la organización. Ilegal según la Iglesia.',
  'Poderes Psíquicos': 'Vocación • Poder. Habilidades psíquicas que dan acceso a poderes psi. Inconvenientes: Ansia psíquica y otros fenómenos peligrosos.',
  'Rango de Derviche': 'Vocación • Privilegio. Rango en una orden de derviches psíquicos. Reconocimiento entre usuarios ocultos y acceso a entrenamiento psíquico.',
  'Santificar Armas y Armadura': 'Vocación • Capacidad • Requisitos: Hermano de batalla o teúrgo, y Teúrgia 6+. Mejora un arma (meta o daño) o armadura (Resistencia Corporal) de calidad maestra. Bonificador máx. = mitad de tu nivel. Dura el resto de la obra. El portador gasta 1 PV por ataque para activar.',
  'Talismán Sintonizado': 'Vocación • Capacidad • Requisitos: Psi y psíquico. Sintoniza psíquicamente un objeto de buena calidad para canalizar poderes. Armas: 1 PV por +1 daño hasta tu Intuición. Armadura: +2 Resistencia Corporal por PV. Se puede adquirir varias veces para distintos talismanes.',

  // ── Vocation: Scholar / Explorer ──
  'Analizar Personalidad': 'Vocación • Capacidad • Requisito: Oniromante. Observa a una persona durante al menos una escena para crear su perfil. Cuando la influencies, el estado que impongas será un nivel más persistente de lo normal.',
  'Antropólogo': 'Vocación • Capacidad • Requisito: Erudito o mendicante o trotamundos. Comunícate con culturas cuyo idioma desconozcas mediante gestos y señas. Si una tribu hostil está dispuesta a comunicarse, puedes volverlos neutrales durante la escena.',
  'Aprender de los Errores': 'Vocación • Capacidad • Requisito: Adjunto imperial o amateur o incógnito. Cuando falles una tirada, añade 1 PV de la reserva a tu depósito. La tirada sigue siendo fallida.',
  'Botánico': 'Vocación • Capacidad • Requisito: Entusiasta o erudito. Identificas plantas nutritivas, venenosas o curativas al inspeccionarlas. Puedes plantar huertos especializados.',
  'Cartógrafo': 'Vocación • Capacidad • Requisito: Trotamundos. Conoces la topografía de planetas. 1.ª vez: planetas de una casa/Iglesia/Liga. 2.ª vez: todos los Mundos Conocidos. Evitas tiradas de conocimiento geológico en esos planetas.',
  'Conexión Empática': 'Vocación • Capacidad • Requisito: Oniromante. Usa Empatía en vez de Encanto o Impresionar (elige uno) para maniobras de influencia. Adquiérelo dos veces para sustituir también la otra habilidad.',
  'Conocimiento Superficial': 'Vocación • Capacidad • Requisito: Amateur o erudito o escriba. Una vez por escena, gasta 1 PV para usar una competencia de saber o ciencia que no tengas para una tirada.',
  'Dominio del Terreno': 'Vocación • Capacidad • Requisito: Explorador. Elige dominios (cantidad = tu Supervivencia): ártico, bosque, ciénaga, desierto, montaña, océano, selva, subterráneo, vacío. En tus dominios, tiradas de Trato con Animales, Observar, Sigilo y Supervivencia favorables.',
  'Elaborar Elixir': 'Vocación • Capacidad • Requisito: Sanador o tecnorredentor. Necesitas laboratorio y materiales (50 fénix/dosis). 8 horas de trabajo (4 h si Curar 7+). Tirada de Alquimia + Intuición. Sin Saber Tecnológico (NT7), tirada desfavorable.',
  'Extensor de Memoria': 'Vocación • Ciberdispositivo de NT6 • Requisito: Erudito o explorador. Implante que almacena información y ofrece memoria fotográfica. Tiradas de entrar en el palacio de la memoria (Academia) y recordar (Introspección) favorables. Compulsión tecgnóstica: Infalible.',
  'Lingüista': 'Vocación • Capacidad • Requisito: Erudito o escriba. Competencia Hablar con todos los idiomas de los Mundos Conocidos (excepto secretos). Sin acento, dialectos incluidos. Adquiérelo dos veces para también Leer todos los idiomas.',
  'Mecenas de las Artes': 'Vocación • Privilegio • Requisito: Entusiasta. Amigo de artistas, acceso a eventos artísticos. Influencia favorable contra artistas y dependientes de tus donaciones. Una vez por escena, tirada favorable de Academia, Alquimia, Artes o Tecnorredención tras hablar con un artista.',
  'Memoria Perfecta': 'Vocación • Capacidad • Requisito: Escriba. Tiradas de entrar en el palacio de la memoria (Academia) y recordar (Introspección) favorables si tienes la competencia requerida. Nunca olvidas caras ni nombres.',
  'Mentor': 'Vocación • Privilegio • Requisito: Incógnito. Un antiguo mentor te acompaña. Al subir de nivel, puedes elegir beneficios de tu vocación original. Una vez por escena, tu mentor puede sustituirte como objetivo de un ataque.',
  'Ojo Experto': 'Vocación • Capacidad • Requisito: Artista o entusiasta o ladrón. Evalúa un objeto o identifica falsificaciones como acción primaria (en vez de más tiempo). Tirada de evaluar obra de arte (Artes) favorable.',
  'Orientado': 'Vocación • Capacidad • Requisito: Explorador o trotamundos. Siempre sabes dónde estás en relación con los puntos cardinales o, en el espacio, con el cuerpo estelar más cercano. Sin tirada necesaria.',
  'Planificador de Ruta': 'Vocación • Ciberdispositivo de NT6 • Requisito: Explorador o trotamundos. Implante que almacena datos y ofrece las mejores rutas a cualquier destino por terreno conocido. Compulsión tecgnóstica: Infalible.',
  'Polímata': 'Vocación • Capacidad • Requisito: Erudito. Obtén temporalmente una competencia que no tengas consultando una fuente o practicando 10 min (dura el resto del acto). +2 a meta de Tecnorredención con tus diseños.',
  'Suerte del Principiante': 'Vocación • Capacidad • Requisito: Amateur o entusiasta. Una vez por escena, aumenta tu puntuación de cualquier habilidad (incluso restringida) en tu Fe, Intuición o Inteligencia (la más alta) para una tirada.',
  'Tutor': 'Vocación • Privilegio • Requisito: Entusiasta. Un maestro te da +2 a meta con una habilidad específica y mejora el impacto (+2 daño o +1 duración de estado). Se puede adquirir varias veces con habilidades distintas.',
  'Vigía': 'Vocación • Capacidad • Requisito: Explorador o recuperador. Tiradas de localizar, buscar (Observar) y tantear (Intrusión) para detectar trampas, emboscadas y sorpresas favorables. Tiradas de Sigilo para esconderte favorables.',

  // ── Vocation: Commerce / Crime ──
  'Abogado Magistrado': 'Vocación • Privilegio • Requisitos: Libre y Riqueza (Acomodado o superior). Se te asigna un abogado de los Magistrados para representarte en litigios penales o contratos. Debes poder contactar con el gremio.',
  'Ahorros': 'Vocación • Ímpetu • Requisito: Comerciante o banquero o ladrón. Una vez por escena, lanza 1d20. Usa el resultado para sustituir una tirada más adelante en la escena. No se puede modificar ni ser éxito crítico.',
  'Amigos en Altas Esferas': 'Vocación • Privilegio • Requisito: Abogado o magnate. Tienes (tu nivel) amigos influyentes en distintos subgrupos. Una vez por escena, recurre a uno para una tirada de influencia favorable en su especialidad. Debes poder comunicarte con él.',
  'Asesor Financiero': 'Vocación • Ímpetu • Requisito: Banquero. Una vez por escena, crea un arca de inversión recogiendo hasta 3 PV de cada PJ presente (pueden ofrecer más, máx. por persona = tu nivel). Funciona como banco; no se pueden añadir más PV una vez creada.',
  'Burocracia': 'Vocación • Capacidad • Requisito: Abogado. Redacta contratos (1 hora). El firmante recibe el estado Vinculado hasta que complete la tarea. Si incumple, queda Penalizado crónico. También puedes evaluar contratos ajenos para encontrar vacíos legales.',
  'Contorsionista': 'Vocación • Capacidad • Requisito: Artista o ladrón. Tiradas favorables para acciones que requieran mover todo el cuerpo: Representar (Baile), Sigilo, Vigor (incluida esquivar).',
  'Curtido': 'Vocación • Capacidad • Requisito: Detective. Penalizador −2 a escuchar confesión (Empatía). Pero +2 a meta de intentos de coacción y Resistencia Mental +2 contra estados Asustado o Aterrorizado.',
  'Deducir': 'Vocación • Capacidad • Requisito: Detective o inquisidor u ocultista. Gasta 1 PV como acción primaria para entrar en trance deductivo. Tiradas de Observar (detectar, buscar, localizar) favorables para resolver un misterio. Desventaja: tiradas no relacionadas desfavorables.',
  'Delegar': 'Vocación • Privilegio • Requisito: Adjunto imperial o caballero expedicionario o detective o inquisidor. Una vez por obra, delega en aliados (máx. 2 personas por nivel) tus privilegios de investigación hasta que acabe el caso.',
  'Empleador': 'Vocación • Privilegio • Requisito: Cadenero. Puedes capturar esclavos y contratar empleados legalmente. Sin este beneficio, el tráfico humano es castigado con trabajos forzados.',
  'Escamoteo': 'Vocación • Capacidad • Requisito: Ladrón. Tiradas de Prestidigitación para hurtar y ocultar objetos favorables. Además, puedes usar Prestidigitación en vez de Representar para cautivar si usas ambas manos.',
  'Escudo de la Ley': 'Vocación • Privilegio • Requisito: Abogado. Resistencia Mental +2 contra humillar y dar una orden. Al gastar PV contra estas maniobras, ganas +2 por PV (doble valor). Quienes fallen estas maniobras contra ti quedan Culpables.',
  'Estafa a Largo Plazo': 'Vocación • Ímpetu • Requisito: Magnate. Una vez por escena, abre un arca de estafa (Observar + Intuición vs. Resistencia Elemental). Cada tirada que genere PV añade 1 PV extra al arca de la reserva. Transfiere al depósito como acción secundaria.',
  'Falsificador': 'Vocación • Capacidad • Requisito: Clero o escriba o espía. Copia la letra de cualquier persona con una muestra de su escritura. Usa Academia + Destreza en vez de Artes + Percepción. Tirada favorable.',
  'Fondo de Cobertura': 'Vocación • Ímpetu • Requisito: Magnate. Una vez por escena, abre un arca de cobertura (Introspección + Inteligencia vs. Resistencia Elemental). Cada turno, mueve 1 PV del arca a tu depósito hasta vaciarla.',
  'Golpe de Efecto': 'Vocación • Capacidad • Requisito: Abogado. Al vencer con enardecer (Representar + Oratoria), en vez de Cautivado puedes imponer: Amigado, Atónito, Confuso, Convencido, Engañado o Predispuesto.',
  'Impuesto sobre la Renta': 'Vocación • Ímpetu • Requisito: Comerciante. Cuando seas objetivo de un ataque físico o coacción, ganas 1 PV de la reserva. No funciona si el atacante es compañero, aliado o amigo.',
  'Impuestos': 'Vocación • Ímpetu • Requisito: Banquero. Cuando un PJ/PNJ gaste PV para aumentar su Resistencia Mental contra tu influencia, el primer PV gastado va a tu depósito en vez de a la reserva.',
  'Intruso': 'Vocación • Capacidad • Requisito: Ladrón o recuperador. Tiradas de Intrusión para abrir cerraduras o descifrar códigos: las normales son favorables, las desfavorables son normales.',
  'Juego Sucio': 'Vocación • Capacidad • Requisito: Abogado. Contactos turbios que manipulan pruebas o ensucian la reputación de testigos. Una vez por acto. Usarlo más de una vez por obra puede traer repercusiones.',
  'Llave Maestra': 'Vocación • Capacidad • Requisito: Escriba. Tiradas de Interfaz favorables con archivos de datos y máquinas pensantes desconectados de redes.',
  'Nadar con Tiburones': 'Vocación • Ímpetu • Requisito: Comerciante o magnate. Una vez por escena, como acción secundaria, recoge PV de la reserva (= tu Charlatanería, Encanto o Impresionar) en un arca de tiburones. Al final de la escena, devuelve préstamo + 3 PV o queda Penalizado.',
  'Percepción Mejorada': 'Vocación • Capacidad • Requisito: Ladrón o recuperador. Tiradas de Observar (vista/oído) favorables. Tiradas de Sigilo en multitudes o entornos urbanos favorables.',
  'Persecutor': 'Vocación • Capacidad • Requisito: Cazarrecompensas. Al interactuar con aliados de tu presa, usa presionar/intimidar/pedir para imponer el estado Obligado. El Obligado te ayuda a localizar a tu presa y responde con sinceridad.',
  'Prestamista': 'Vocación • Ímpetu • Requisito: Banquero. Como acción primaria, presta PV de tu depósito a otro personaje. Al final de la escena, debe devolver el préstamo + 20% de interés. Si no paga, queda Penalizado.',
  'Árbol del Dinero': 'Vocación • Ímpetu • Requisito: Banquero o piloto estelar. Añade +2 a tu cantidad de impulsos y recibes un impulso adicional aunque tu nivel no te permita tener más de uno.',

  // ── Vocation: Technology ──
  'Abrelatas': 'Vocación • Capacidad • Requisito: Pirata o recuperador. Experto en provocar grandes daños a la parte externa de vehículos. Atraviesa el revestimiento en 1 turno (terrestres) a 1 min (naves). Gasta 2 PV para agrandar la hendidura.',
  'Comprender Nivel Tecnológico': 'Vocación • Capacidad • Requisito: Tecnorredentor. Permite inventar objetos del nivel tecnológico comprendido. Se adquiere varias veces: 1.º NT5, 2.º NT6, 3.º NT7, 4.º NT8. Inmune a la compulsión tecgnóstica del nivel comprendido.',
  'Consejero': 'Vocación • Ciberdispositivo de NT6 • Requisito: Libre. Máquina pensante implantada que te aconseja. Conoce 5 competencias de Saber (intercambiables por 100 fénix). Compulsión tecgnóstica: Infalible.',
  'Espíritu Máquina': 'Vocación • Ciberdispositivo de NT7 • Requisito: Tecnorredentor. Implante de IA para conectarte a otras máquinas pensantes. Conexión física o inalámbrica (10 m). Tiradas de Interfaz favorables. Compulsión tecgnóstica: Infalible.',
  'Fabricar Dispositivo de Energía': 'Vocación • Capacidad • Requisitos: Tecnorredentor y Comprender NT7+. Fabrica armas de energía o escudos de energía. Tirada de Tecnorredención + Destreza vs. Resistencia Ardua. Materiales = mitad del precio. Un día por cada 100 fénix.',
  'Fabricar Tecnología Asombrosa': 'Vocación • Capacidad • Requisitos: Comprender NT5+ y tecnorredentor. Fabrica artilugios y herramientas asombrosas. Un día por nivel tecnológico. Materiales = mitad del precio base. Cautivar y divertir favorables con los objetos creados.',
  'Mecánico': 'Vocación • Capacidad • Requisito: Piloto estelar o tecnorredentor. Tiradas favorables para reparar un tipo de transporte que conoces a fondo. Puedes transmitir la ventaja a otra persona por comunicación directa. Un nuevo tipo por nivel.',
  'Recrear Artefacto': 'Vocación • Capacidad • Requisitos: Recuperador o tecnorredentor, y las competencias Ciencias Aplicadas y Saber Tecnológico (NT7). Crea réplicas de artefactos (NT6+). Materiales = 1/4 del valor. Tirada de Tecnorredención + Intuición (8 h mín.).',

  // ── Vocation: Transport / Exploration ──
  'Amigo Animal': 'Vocación • Capacidad • Requisito: Explorador o trotamundos. Elige un animal de tamaño 1-3 como compañero leal. Puedes darle órdenes simples. Si lo pierdes, puedes trabar amistad con otro usando Trato con Animales.',
  'Camaleón': 'Vocación • Capacidad • Requisitos: Explorador y el beneficio Dominio del Terreno. En uno de tus dominios, ocúltate como acción primaria. Los oponentes no hacen percepción instintiva; localizar y buscar desfavorables. +2 a meta de ataques mientras estés escondido.',
  'Estómago': 'Vocación • Capacidad • Requisito: Explorador o trotamundos. Tiradas para quitarte de encima venenos naturales favorables. Sin efectos de sobredosis. Duración de toxinas reducida a la mitad. También contra comida contaminada.',
  'Intrépido': 'Vocación • Ímpetu • Requisito: Piloto estelar. Pilotando, como acción primaria tira Pilotar/Conducir + Fe vs. Resistencia Difícil. Los PV van a un arca del intrépido (se rellena cada turno de la reserva). Solo para pilotaje y Resistencia de la nave.',
  'Piloto de Acrobacias': 'Vocación • Capacidad • Requisito: Piloto estelar. Tiradas de hacer acrobacias (Pilotar) favorables. Una vez por escena, ignora la desgracia de un fallo crítico de Pilotar.',
  'Temerario': 'Vocación • Capacidad • Requisito: Amateur o piloto estelar. Una vez por escena, antes de tirar, declara que quieres aumentar el resultado (máx. = tu habilidad). Si tienes éxito, más PV (incluso éxito crítico). Si fallas, fallo crítico.',

  // ── Vocation: Adjunto Imperial ──
  'Pase de Acceso Ilimitado': 'Vocación • Privilegio • Requisito: Adjunto imperial o caballero expedicionario o detective o inquisidor. Mientras trabajes en un caso, entra libremente en cualquier casa, monasterio o negocio relacionado. Ignora restricciones de rango y afiliación.',
  'Privilegio Imperial': 'Vocación • Privilegio • Requisito: Caballero expedicionario. Cruzar fronteras feudales, inspeccionar registros públicos. Inmunidad Diplomática. Estipendio de 300 fénix/año. Código de conducta obligatorio; rechazo = cárcel o muerte.',
  'Privilegio de Adjunto Imperial': 'Vocación • Privilegio • Requisito: Los nobles no pueden ser adjuntos. Estipendio de 100 fénix/año, transporte gratis en naves militares imperiales, cruzar fronteras sin impuestos, abogado gratis. Código de conducta obligatorio.',
  'Regreso Triunfal': 'Vocación • Capacidad • Requisitos: Incógnito, y Mentor o Partidarios. Al reclamar tu posición, ganas (tu nivel) tiradas favorables. No afecta tiradas contra tu rival. Al conseguirlo, elige otro beneficio de tu vocación recuperada.',
  'Resurgir de las Cenizas': 'Vocación • Austeridad • Requisito: Adjunto imperial o caballero expedicionario. Resistencia Espiritual +2. Es en realidad la herejía del Sol Renacido dedicada al emperador (mantenlo en secreto).',
  'Partidarios': 'Vocación • Privilegio • Requisito: Incógnito. Aliados dispuestos a traicionar a tus rivales. Te dan información periódica sobre tus enemigos. También te permiten encontrar refugio cuando necesites escapar.',

  // ── Vocation: Noble specific ──
  'Intocable': 'Vocación • Capacidad • Requisito: Lord. Una vez por acto, como acción primaria, declárate intocable. El resto de la escena, nadie puede gastar PV para modificar tiradas o mejorar impacto contra ti (pero sí para superar tu Resistencia o aumentar la suya).',
  'Verdugo': 'Vocación • Privilegio • Requisito: Lord. Permiso para ejecutar a súbditos de tu casa. No excluye investigaciones. Adquiérelo dos veces para ejecutar también a traidores del emperador.',

  // ── Vocation: Entertainer ──
  'Centro de Atención': 'Vocación • Capacidad • Requisito: Artista. Tras superar una acción de Representar, tu primer intento de persuasión en la siguiente escena es favorable contra quien vio tu actuación. Resistencia Mental +2 contra humillar y divertir.',
  'Derechos de Autor': 'Vocación • Privilegio • Requisito: Artista. Tiradas de persuasión favorables contra fans. Ingresos anuales de 200 fénix. El DJ tira 1d20 para determinar si un PNJ es fan según trasfondo (rural/urbano/cosmopolita).',
  'Melómano': 'Vocación • Capacidad • Requisito: Artista o corista. Maniobras de enardecer (Representar) favorables al cantar (con Artes Escénicas: Canto) o tocar instrumento. Puedes adquirir competencia temporal de un instrumento nuevo tras escucharlo 5 min. Famoso en círculos musicales.',
  'Oído Absoluto': 'Vocación • Capacidad • Requisito: Artista o corista. Memoriza canciones, poemas y obras tras una escucha. Al usar Representar, gasta 1 PV y tira 1d20: 1-10 = favorable; 11-20 = normal.',
  'Virtuoso': 'Vocación • Capacidad • Requisito: Artista. La maniobra crear arte (Artes) se puede intentar como acción primaria en un solo turno (normalmente requiere tiempo narrado). La obra impone el mismo estado a quien la vea.',
  '¡Era una broma!': 'Vocación • Ímpetu • Requisito: Mercúreo. Una vez por acto, crea un arca de broma (máx. PV = tu Inteligencia). Usa su valor como bonificador a Resistencia contra víctimas de tus bromas. Máx. usos por acto = tu nivel.',
  'Zona de Autonomía Temporal': 'Vocación • Capacidad • Requisito: Mercúreo. Una vez por escena, ignora los bonificadores de Resistencia Mental de rangos sociales (Título, Ordenación, Cargo, Reputación). Una vez por turno contra una persona. Total por escena = tu nivel.',

  // ── Vocation: Miscellaneous ──
  'Imán para los Problemas': 'Vocación • Capacidad • Requisito: Ronin. Una vez por escena, intercepta un ataque contra otra persona como acción refleja (+4 a tu Resistencia). Percepción +1 a percepción instintiva para sentir el peligro.',
  'Implacable': 'Vocación • Capacidad • Requisito: Cadenero o cazarrecompensas o espía o inquisidor. Las acciones de influencia o poderes ocultos que impongan Asustado, Aterrorizado o Intimidado son desfavorables contra ti.',
  'Insensibilizado': 'Vocación • Capacidad • Requisito: Mercenario o ronin. Inmune a Berserk y Penalizado por desapego emocional. Ventaja de iniciativa. Tiradas de Introspección para restablecerte de estados crónicos favorables.',
  'Leyenda Viviente': 'Vocación • Privilegio • Requisito: Mendicante o ronin. Los desconocidos te ofrecen alojamiento y comida gratis. Transporte gratis en bodegas de carga. Se espera que seas un ejemplo de virtud.',
  'Nada que Perder': 'Vocación • Capacidad • Requisito: Cadenero o ronin o ukar. Intentos de infligirte Cautivado, Culpable, Divertido o Presionado son desfavorables. Pero el estado Divinamente Inspirado no te afecta.',
  'Nacido con Estrella': 'Vocación • Capacidad • Requisito: Amateur. Éxito crítico no solo con el número meta, sino también con el inmediatamente inferior. Solo la primera vez por escena.',
  'Acceso al Registro de Criminales': 'Vocación • Privilegio • Requisito: Cazarrecompensas o detective o escriba. Acceso a una lista compartida de recompensas con referencias visuales, métodos de transporte y crímenes. Requiere acceso a una máquina pensante o contactar a un funcionario.',
  'Hombre del Saco': 'Vocación • Privilegio • Requisito: Cadenero. Coacción favorable contra personas sin rango (pero persuasión desfavorable). Puedes reclutar (tu nivel) matones locales en 30 min para el resto del acto.',
  'Olor de la Bruja': 'Vocación • Capacidad • Requisito: Inquisidor u ocultista o psíquico o teúrgo. Gasta 1 PV, tira Observar + Intuición como acción primaria contra Resistencia Espiritual del objetivo. Detecta corrupción sobrenatural (Psi/Ansia, Teúrgia/Hubris). Posibles falsos positivos.',
  'Sabueso': 'Vocación • Capacidad • Requisito: Cazarrecompensas o inquisidor. En un lugar frecuentado por tu presa, busca 10 min a 1 hora para encontrar pistas sobre su paradero actual (o destino si dejó el planeta).',
  'Reputación de Cazador': 'Vocación • Privilegio • Requisito: Cazarrecompensas. Te enteras de recompensas antes de que se publiquen. Los pagadores te aprecian y te pagan un 20% más.',

  // ── Species benefits: Ur-obun ──
  'Descendiente de Dhiyana': 'Vocación • Capacidad • Requisitos: Obun y nivel 1. Personificas los aspectos masculino y femenino de lo divino. Persuasión favorable con obun que lo sepan. Tiradas de reprimir/reconciliar (Ansia) o arrepentirte/expiar (Hubris) favorables (elige un tipo).',
  'Memoria Oral': 'Vocación • Capacidad • Requisito: Obun o Educación Alienígena (obun). Tiradas de entrar en el palacio de la memoria (Academia) y recordar (Introspección) favorables si tienes la competencia requerida.',

  // ── Species benefits: Ur-ukar ──
  'Furia Acumulada': 'Vocación • Capacidad • Requisito: Ukar. Declara que una tirada de coacción es favorable (antes de hacerla), (tu nivel) veces por escena. No es necesario hablar; gruñir es suficiente.',

  // ── Species benefits: Vorox ──
  'Oler el Peligro': 'Vocación • Capacidad • Requisito: Vorox. Percepción +2 en percepción instintiva. Tiradas de localizar para percibir enemigos y peligros ocultos favorables (salvo que el origen enmascare su olor).',

  // ── Other benefits ──
  'Acuerdo de Pasaje': 'Vocación • Privilegio • Requisito: Libre. No necesitas reservar pasaje en naves estelares. Habitación compartida en transportes. Con Riqueza Acomodado+, camarote propio. Adquiérelo dos veces para incluir a tu compañía.',
}

/**
 * Lookup a tooltip for any game element by name.
 * Searches in order: competencies, skills (by nombre), characteristics (by key), benefits.
 */
export function getTooltip(name: string): string | undefined {
  // Direct competency match
  if (COMPETENCY_TOOLTIPS[name]) return COMPETENCY_TOOLTIPS[name]

  // Skill match by nombre
  for (const [key, desc] of Object.entries(SKILL_TOOLTIPS)) {
    if (key === name) return desc
  }

  // Characteristic match by key
  if (CHARACTERISTIC_TOOLTIPS[name]) return CHARACTERISTIC_TOOLTIPS[name]

  // Benefit match
  if (BENEFIT_TOOLTIPS[name]) return BENEFIT_TOOLTIPS[name]

  return undefined
}
