// ─── Equipment Data from Fading Suns 4th Ed Rulebook ───
// All prices in Fénix (F). All data sourced from Libro PJ pp.220-260

// ═══════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

export type EquipmentCategory =
  | 'armaBalas'
  | 'armaEnergia'
  | 'armaCuerpoACuerpo'
  | 'artefactoCuerpoACuerpo'
  | 'municion'
  | 'accesorioArma'
  | 'accesorioCuerpoACuerpo'
  | 'explosivo'
  | 'armadura'
  | 'escudoMano'
  | 'escudoEnergia'
  | 'comunicacion'
  | 'energia'
  | 'entretenimiento'
  | 'moda'
  | 'iluminacion'
  | 'medicina'
  | 'droga'
  | 'veneno'
  | 'contencion'
  | 'seguridad'
  | 'servicio'
  | 'herramienta'
  | 'maquinaPensante'
  | 'dispositivo'
  | 'montura'
  | 'vehiculo'

export type WeaponSubtype =
  | 'derringer'
  | 'armaLigera'
  | 'armaMedia'
  | 'armaPesada'
  | 'subfusil'
  | 'escopeta'
  | 'fusil'
  | 'fusilFrancotirador'
  | 'pistolLaser'
  | 'fusilLaser'
  | 'fusilAsaltoLaser'
  | 'pistolBlaster'
  | 'fusilBlaster'
  | 'escopetaBlaster'
  | 'lanzallamas'
  | 'chirriador'
  | 'aturdidor'
  | 'miniLaser'

export type ArmorSubtype =
  | 'civil'
  | 'combate'
  | 'guerra'
  | 'espacial'

export type ShieldCompatibility = 'E' | 'A' | 'B'

export type ItemSize = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL'

export interface BulletWeapon {
  category: 'armaBalas'
  subtype: WeaponSubtype
  nombre: string
  calibre: string
  nt: number
  meta: number | string
  dano: number | string
  fuerza: number
  alcCorto: number
  alcLargo: number
  cdt: string  // e.g. "2", "3(r)"
  municion: number
  tamano: ItemSize
  agora: string
  precio: number
  caracteristicas: string[]
  alimentacion: string  // 'automatica' | 'manual' | 'revolver' | 'cerrojo' | 'corredera'
}

export interface EnergyWeapon {
  category: 'armaEnergia'
  subtype: WeaponSubtype
  nombre: string
  nt: number
  meta: number | string
  dano: number | string
  fuerza: number
  alcCorto: number
  alcLargo: number
  cdt: string
  municion: number | string  // '∞' for unlimited
  tamano: ItemSize
  agora: string
  precio: number
  caracteristicas: string[]
  tipoEnergia: string  // 'laser' | 'blaster' | 'fuego' | 'sonico' | 'descarga'
}

export interface MeleeWeapon {
  category: 'armaCuerpoACuerpo' | 'artefactoCuerpoACuerpo'
  nombre: string
  nt: number
  meta: number | string
  dano: number | string
  fuerza: number
  tamano: ItemSize
  agora: string
  precio: number
  caracteristicas: string[]
}

export interface Ammo {
  category: 'municion'
  nombre: string
  calibre: string
  nt: number
  precioPorDisparo: number | string
  caracteristicas: string[]
}

export interface WeaponAccessory {
  category: 'accesorioArma' | 'accesorioCuerpoACuerpo'
  nombre: string
  nt: number
  precio: number | string
  efecto: string
}

export interface Explosive {
  category: 'explosivo'
  nombre: string
  nt: number
  meta: number | string
  dano: number | string
  fuerza: number
  alcCorto: number
  alcLargo: number
  cdt: string
  municion: number
  tamano: ItemSize
  agora: string
  precio: number
  caracteristicas: string[]
}

export interface Armor {
  category: 'armadura'
  subtype: ArmorSubtype
  nombre: string
  nt: number
  resistencia: number | string
  escudoCompatible: ShieldCompatibility
  destreza: number
  vigor: number
  agora: string
  precio: number
  caracteristicas: string[]
}

export interface HandShield {
  category: 'escudoMano'
  nombre: string
  nt: number
  resistencia: string  // e.g. "+3"
  dano: number | string
  fuerza: number
  tamano: ItemSize
  agora: string
  precio: number
  caracteristicas: string[]
}

export interface EnergyShield {
  category: 'escudoEnergia'
  nombre: string
  nt: number
  umbralMin: number
  umbralMax: number
  activaciones: number
  agotamiento: number
  distorsion: string
  agora: string
  precio: number
  caracteristicas: string[]
}

export interface GeneralEquipment {
  category: 'comunicacion' | 'energia' | 'entretenimiento' | 'moda' | 'iluminacion' |
    'medicina' | 'droga' | 'veneno' | 'contencion' | 'seguridad' | 'servicio' |
    'herramienta' | 'maquinaPensante' | 'dispositivo'
  nombre: string
  nt: number | string
  tamano?: ItemSize
  precio: number | string
  efecto: string
}

export interface Mount {
  category: 'montura'
  nombre: string
  velocidad: string
  carga: string
  vitalidad: number
  tamano: number
  precio: number
  comida: number
  ataques: string
}

export interface Vehicle {
  category: 'vehiculo'
  subtipo: string
  nombre: string
  nt: number
  velocidad: string
  carga: string
  vitalidad: number
  armadura: number
  alcanceDiario: string
  precio: number
  combustible: number
  caracteristicas: string
}

export type EquipmentItem =
  | BulletWeapon
  | EnergyWeapon
  | MeleeWeapon
  | Ammo
  | WeaponAccessory
  | Explosive
  | Armor
  | HandShield
  | EnergyShield
  | GeneralEquipment
  | Mount
  | Vehicle

// ═══════════════════════════════════════════════════════════════
// ARMAS DE BALAS
// ═══════════════════════════════════════════════════════════════

export const ARMAS_BALAS: BulletWeapon[] = [
  // --- DERRINGERS ---
  { category: 'armaBalas', subtype: 'derringer', nombre: 'Derringer Lank (.32)', calibre: '.32', nt: 4, meta: -1, dano: 3, fuerza: 1, alcCorto: 5, alcLargo: 10, cdt: '2', municion: 5, tamano: 'XS', agora: 'Rara; Carroñeros (Lank)', precio: 70, caracteristicas: ['Un uso', 'Invisible para escáneres NT0-5'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'derringer', nombre: 'Mitchau Maverick (.32)', calibre: '.32', nt: 3, meta: -1, dano: 3, fuerza: 1, alcCorto: 5, alcLargo: 10, cdt: '2', municion: 5, tamano: 'XS', agora: 'Hazat (Mitchau)', precio: 50, caracteristicas: [], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'derringer', nombre: 'Varsten Snake-eyes (.32)', calibre: '.32', nt: 3, meta: -1, dano: 3, fuerza: 1, alcCorto: 5, alcLargo: 10, cdt: '2', municion: 2, tamano: 'XS', agora: 'Decados (Varsten)', precio: 45, caracteristicas: ['Robusta'], alimentacion: 'manual' },
  { category: 'armaBalas', subtype: 'derringer', nombre: 'Revólver Derringer típico (.32)', calibre: '.32', nt: 3, meta: -1, dano: 3, fuerza: 1, alcCorto: 5, alcLargo: 10, cdt: '2', municion: 4, tamano: 'XS', agora: 'Común', precio: 50, caracteristicas: [], alimentacion: 'revolver' },

  // --- ARMAS LIGERAS ---
  { category: 'armaBalas', subtype: 'armaLigera', nombre: 'Arma ligera alim. auto. típica (.32)', calibre: '.32', nt: 4, meta: 0, dano: 4, fuerza: 2, alcCorto: 10, alcLargo: 20, cdt: '3', municion: 13, tamano: 'S', agora: '', precio: 150, caracteristicas: [], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'armaLigera', nombre: 'Fenir Monbow (.32)', calibre: '.32', nt: 4, meta: 0, dano: 4, fuerza: 2, alcCorto: 10, alcLargo: 20, cdt: '3', municion: 13, tamano: 'S', agora: 'Fenir y concesionarios', precio: 150, caracteristicas: [], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'armaLigera', nombre: 'Rumber Mitchau (.32)', calibre: '.32', nt: 4, meta: 0, dano: 4, fuerza: 2, alcCorto: 10, alcLargo: 20, cdt: '3', municion: 13, tamano: 'S', agora: 'Común; Hazat (Mitchau)', precio: 160, caracteristicas: [], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'armaLigera', nombre: 'Arma corta Phoenix (.32)', calibre: '.32', nt: 4, meta: 0, dano: 4, fuerza: 2, alcCorto: 10, alcLargo: 20, cdt: '2', municion: 12, tamano: 'S', agora: 'Común; MC (Imp)', precio: 120, caracteristicas: ['Robusta'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'armaLigera', nombre: 'Sumpter Krant (.32)', calibre: '.32', nt: 4, meta: 0, dano: 4, fuerza: 2, alcCorto: 10, alcLargo: 20, cdt: '3', municion: 15, tamano: 'S', agora: 'Común; al-Malik (Sumpter)', precio: 200, caracteristicas: [], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'armaLigera', nombre: 'Arma corta Tarasov (.32)', calibre: '.32', nt: 3, meta: 0, dano: 4, fuerza: 2, alcCorto: 5, alcLargo: 10, cdt: '2', municion: 2, tamano: 'S', agora: 'MC (Magistrados)', precio: 50, caracteristicas: ['Robusta', 'Pomo (3 daño)'], alimentacion: 'manual' },
  { category: 'armaBalas', subtype: 'armaLigera', nombre: 'Revólver típico (.32)', calibre: '.32', nt: 3, meta: 0, dano: 4, fuerza: 2, alcCorto: 10, alcLargo: 20, cdt: '3', municion: 6, tamano: 'S', agora: '', precio: 100, caracteristicas: ['Robusto'], alimentacion: 'revolver' },
  { category: 'armaBalas', subtype: 'armaLigera', nombre: 'Fenir Shortstop (.32)', calibre: '.32', nt: 3, meta: 0, dano: 4, fuerza: 2, alcCorto: 10, alcLargo: 20, cdt: '3', municion: 6, tamano: 'S', agora: 'Fenir y concesionarios', precio: 100, caracteristicas: ['Robusto'], alimentacion: 'revolver' },
  { category: 'armaBalas', subtype: 'armaLigera', nombre: 'MacCauly Learmat (.32)', calibre: '.32', nt: 3, meta: 0, dano: 4, fuerza: 2, alcCorto: 10, alcLargo: 20, cdt: '3', municion: 7, tamano: 'S', agora: 'Tetis (LM)', precio: 125, caracteristicas: ['Robusto'], alimentacion: 'revolver' },
  { category: 'armaBalas', subtype: 'armaLigera', nombre: 'Mitchau Protector (.32)', calibre: '.32', nt: 3, meta: 0, dano: 4, fuerza: 2, alcCorto: 10, alcLargo: 20, cdt: '3', municion: 6, tamano: 'S', agora: 'Común; Hazat (Mitchau)', precio: 110, caracteristicas: ['Robusto'], alimentacion: 'revolver' },

  // --- ARMAS MEDIAS ---
  { category: 'armaBalas', subtype: 'armaMedia', nombre: 'Arma media alim. auto. típica (.40)', calibre: '.40', nt: 4, meta: 0, dano: 5, fuerza: 3, alcCorto: 20, alcLargo: 30, cdt: '3', municion: 10, tamano: 'S', agora: '', precio: 250, caracteristicas: [], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'armaMedia', nombre: 'Imman Vorton (.40)', calibre: '.40', nt: 4, meta: 0, dano: 5, fuerza: 2, alcCorto: 20, alcLargo: 30, cdt: '3', municion: 10, tamano: 'S', agora: 'Común; al-Malik (Imman)', precio: 300, caracteristicas: [], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'armaMedia', nombre: 'Krossler Dunehound (.40)', calibre: '.40', nt: 4, meta: 0, dano: 5, fuerza: 3, alcCorto: 20, alcLargo: 30, cdt: '3', municion: 10, tamano: 'S', agora: 'Común; Bannockburn (LM)', precio: 200, caracteristicas: [], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'armaMedia', nombre: 'Mitchau Ripper (.40)', calibre: '.40', nt: 4, meta: 0, dano: 5, fuerza: 3, alcCorto: 20, alcLargo: 30, cdt: '3', municion: 11, tamano: 'S', agora: 'Común; Hazat (Mitchau)', precio: 220, caracteristicas: [], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'armaMedia', nombre: 'Pistola de oficial Tarasov (.40)', calibre: '.40', nt: 3, meta: 0, dano: 5, fuerza: 3, alcCorto: 10, alcLargo: 20, cdt: '2', municion: 5, tamano: 'S', agora: 'Común; MC (Magistrados)', precio: 150, caracteristicas: ['Robusta', 'Pomo (3 daño)'], alimentacion: 'manual' },
  { category: 'armaBalas', subtype: 'armaMedia', nombre: 'Revólver medio típico (.40)', calibre: '.40', nt: 3, meta: 0, dano: 5, fuerza: 3, alcCorto: 20, alcLargo: 30, cdt: '3', municion: 6, tamano: 'S', agora: '', precio: 200, caracteristicas: ['Robusto'], alimentacion: 'revolver' },
  { category: 'armaBalas', subtype: 'armaMedia', nombre: 'Drexler Firehunter (.38)', calibre: '.38', nt: 3, meta: 0, dano: 5, fuerza: 3, alcCorto: 20, alcLargo: 30, cdt: '3', municion: 6, tamano: 'S', agora: 'Hawkwood y LM (Hwk)', precio: 200, caracteristicas: ['Robusto'], alimentacion: 'revolver' },
  { category: 'armaBalas', subtype: 'armaMedia', nombre: 'Mitchau QuarryGun (.40)', calibre: '.40', nt: 5, meta: 0, dano: 5, fuerza: 3, alcCorto: 30, alcLargo: 40, cdt: '2', municion: 6, tamano: 'M', agora: 'Rara; Hazat (Mitchau)', precio: 350, caracteristicas: ['Mira 2', 'Robusto'], alimentacion: 'revolver' },
  { category: 'armaBalas', subtype: 'armaMedia', nombre: 'Mitchau Thunderer (.40)', calibre: '.40', nt: 3, meta: 0, dano: 5, fuerza: 3, alcCorto: 20, alcLargo: 30, cdt: '3', municion: 6, tamano: 'S', agora: 'Común; Hazat e IU (Mitchau)', precio: 200, caracteristicas: ['Robusto'], alimentacion: 'revolver' },
  { category: 'armaBalas', subtype: 'armaMedia', nombre: 'Nerew Peacetrunk (.40)', calibre: '.40', nt: 3, meta: 0, dano: 5, fuerza: 3, alcCorto: 20, alcLargo: 35, cdt: '3', municion: 6, tamano: 'S', agora: 'Raro; Marte (Nerew)', precio: 200, caracteristicas: ['Robusto'], alimentacion: 'revolver' },

  // --- ARMAS PESADAS ---
  { category: 'armaBalas', subtype: 'armaPesada', nombre: 'Arma pesada alim. auto. típica (.47)', calibre: '.47', nt: 4, meta: 0, dano: 6, fuerza: 4, alcCorto: 30, alcLargo: 40, cdt: '2', municion: 8, tamano: 'M', agora: 'Común', precio: 300, caracteristicas: [], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'armaPesada', nombre: 'Krosler Sampson (.47)', calibre: '.47', nt: 4, meta: 0, dano: 6, fuerza: 4, alcCorto: 30, alcLargo: 40, cdt: '2', municion: 8, tamano: 'M', agora: 'Común; Bannockburn (LM)', precio: 300, caracteristicas: [], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'armaPesada', nombre: 'Sumpter Urthquake (.47)', calibre: '.47', nt: 4, meta: 0, dano: 6, fuerza: 4, alcCorto: 30, alcLargo: 40, cdt: '2', municion: 8, tamano: 'M', agora: 'Común; al-Malik (Sumpter)', precio: 300, caracteristicas: [], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'armaPesada', nombre: 'Sumpter Urthquake Longsword (.47)', calibre: '.47', nt: 4, meta: '+1', dano: 6, fuerza: 4, alcCorto: 30, alcLargo: 50, cdt: '2', municion: 8, tamano: 'M', agora: 'Raro; al-Malik (Sumpter)', precio: 350, caracteristicas: ['Culata'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'armaPesada', nombre: 'Tenson Blitzer (.47)', calibre: '.47', nt: 4, meta: 0, dano: 6, fuerza: 4, alcCorto: 25, alcLargo: 35, cdt: '2', municion: 8, tamano: 'M', agora: 'Leagueheim', precio: 280, caracteristicas: [], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'armaPesada', nombre: 'Revólver pesado típico (.47)', calibre: '.47', nt: 3, meta: 0, dano: 6, fuerza: 4, alcCorto: 30, alcLargo: 40, cdt: '2', municion: 6, tamano: 'M', agora: 'Común', precio: 250, caracteristicas: ['Robusto'], alimentacion: 'revolver' },
  { category: 'armaBalas', subtype: 'armaPesada', nombre: 'MacCauly Buster (.50)', calibre: '.50', nt: 3, meta: 0, dano: 6, fuerza: 5, alcCorto: 40, alcLargo: 60, cdt: '2', municion: 7, tamano: 'M', agora: 'Raro; Tetis (MacCauly)', precio: 300, caracteristicas: ['Robusto'], alimentacion: 'revolver' },
  { category: 'armaBalas', subtype: 'armaPesada', nombre: 'Sumpter Ulik (.47)', calibre: '.47', nt: 3, meta: 0, dano: 6, fuerza: 4, alcCorto: 30, alcLargo: 40, cdt: '2', municion: 6, tamano: 'M', agora: 'Común; al-Malik (Sumpter)', precio: 250, caracteristicas: ['Robusto'], alimentacion: 'revolver' },
  { category: 'armaBalas', subtype: 'armaPesada', nombre: 'Sumpter Ulik Longsword (.47)', calibre: '.47', nt: 3, meta: '+1', dano: 6, fuerza: 4, alcCorto: 30, alcLargo: 50, cdt: '2', municion: 6, tamano: 'M', agora: 'Raro; al-Malik (Sumpter)', precio: 300, caracteristicas: ['Culata', 'Robusto'], alimentacion: 'revolver' },
  { category: 'armaBalas', subtype: 'armaPesada', nombre: 'Revólver vuldrok (.47)', calibre: '.47', nt: 3, meta: 0, dano: 6, fuerza: 5, alcCorto: 30, alcLargo: 40, cdt: '3', municion: 5, tamano: 'M', agora: 'Común; Vuldrok', precio: 250, caracteristicas: ['Inestable'], alimentacion: 'revolver' },
  { category: 'armaBalas', subtype: 'armaPesada', nombre: 'Tenson Mauler (.47)', calibre: '.47', nt: 3, meta: 0, dano: 6, fuerza: 4, alcCorto: 25, alcLargo: 35, cdt: '2', municion: 6, tamano: 'M', agora: 'Leagueheim', precio: 230, caracteristicas: ['Robusto'], alimentacion: 'revolver' },

  // --- FUSILES ---
  { category: 'armaBalas', subtype: 'fusil', nombre: 'Fusil alim. auto. típico (10mm)', calibre: '10mm', nt: 4, meta: 0, dano: 7, fuerza: 3, alcCorto: 40, alcLargo: 125, cdt: '3(r)', municion: 30, tamano: 'XL', agora: 'Común', precio: 500, caracteristicas: ['Culata'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'fusil', nombre: 'Blue Lion M3 (.40)', calibre: '.40', nt: 4, meta: 0, dano: 6, fuerza: 2, alcCorto: 40, alcLargo: 120, cdt: '2(r)', municion: 25, tamano: 'XL', agora: 'Hawkwood', precio: 400, caracteristicas: ['Culata'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'fusil', nombre: 'Hyram Splendor (.51)', calibre: '.51', nt: 4, meta: -2, dano: 8, fuerza: 4, alcCorto: 50, alcLargo: 150, cdt: '3(r)', municion: 25, tamano: 'XL', agora: 'Raro; Decados', precio: 600, caracteristicas: ['Culata'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'fusil', nombre: 'Masseri Stomper (.47)', calibre: '.47', nt: 4, meta: 0, dano: 7, fuerza: 3, alcCorto: 45, alcLargo: 125, cdt: '3(r)', municion: 30, tamano: 'XL', agora: 'MC (Masseri)', precio: 500, caracteristicas: ['Culata'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'fusil', nombre: 'Modelo Hazat 68 (.40)', calibre: '.40', nt: 4, meta: 0, dano: 6, fuerza: 2, alcCorto: 40, alcLargo: 120, cdt: '3(r)', municion: 32, tamano: 'XL', agora: 'Común; Hazat', precio: 500, caracteristicas: ['Culata'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'fusil', nombre: 'Modelo Hazat 86 (10mm)', calibre: '10mm', nt: 4, meta: 0, dano: 7, fuerza: 2, alcCorto: 40, alcLargo: 125, cdt: '3(r)', municion: 28, tamano: 'XL', agora: 'Común; Hazat', precio: 550, caracteristicas: ['Culata'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'fusil', nombre: 'Asamblea Rover (10mm)', calibre: '10mm', nt: 4, meta: 0, dano: 7, fuerza: 3, alcCorto: 40, alcLargo: 125, cdt: '3(r)', municion: 32, tamano: 'XL', agora: 'Común; LM (Asamblea)', precio: 850, caracteristicas: ['Culata', 'Robusto', 'Trípode/bípode'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'fusil', nombre: 'Tarasov StormRifle (.40)', calibre: '.40', nt: 4, meta: 0, dano: 6, fuerza: 4, alcCorto: 30, alcLargo: 80, cdt: '1(r)', municion: 12, tamano: 'XL', agora: 'Común; MC (Magistrados)', precio: 300, caracteristicas: ['Culata', 'Robusto'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'fusil', nombre: 'Van Gelder Thracker (.47)', calibre: '.47', nt: 4, meta: 0, dano: 7, fuerza: 3, alcCorto: 45, alcLargo: 125, cdt: '3(r)', municion: 30, tamano: 'XL', agora: 'MC (Van Gelder)', precio: 500, caracteristicas: ['Culata'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'fusil', nombre: 'Fusil alim. cerrojo típico (.40)', calibre: '.40', nt: 3, meta: 0, dano: 6, fuerza: 2, alcCorto: 40, alcLargo: 120, cdt: '1', municion: 8, tamano: 'XL', agora: '', precio: 200, caracteristicas: ['Culata'], alimentacion: 'cerrojo' },
  { category: 'armaBalas', subtype: 'fusil', nombre: 'Rifle de caza básico (.40)', calibre: '.40', nt: 3, meta: 0, dano: 6, fuerza: 2, alcCorto: 40, alcLargo: 110, cdt: '1', municion: 6, tamano: 'XL', agora: '', precio: 150, caracteristicas: ['Culata'], alimentacion: 'cerrojo' },
  { category: 'armaBalas', subtype: 'fusil', nombre: 'Dragonfly 7 (.40)', calibre: '.40', nt: 3, meta: 0, dano: 6, fuerza: 2, alcCorto: 45, alcLargo: 140, cdt: '1', municion: 5, tamano: 'XL', agora: 'Común; Li Halan', precio: 250, caracteristicas: ['Culata', 'Robusto'], alimentacion: 'cerrojo' },
  { category: 'armaBalas', subtype: 'fusil', nombre: 'Fusil imperial (.40)', calibre: '.40', nt: 4, meta: 0, dano: 6, fuerza: 2, alcCorto: 40, alcLargo: 120, cdt: '2', municion: 10, tamano: 'XL', agora: 'Común; Imp', precio: 200, caracteristicas: ['Culata'], alimentacion: 'cerrojo' },
  { category: 'armaBalas', subtype: 'fusil', nombre: "Oro'ym rifle tritón (.47)", calibre: '.47', nt: 5, meta: 0, dano: 7, fuerza: 3, alcCorto: 45, alcLargo: 140, cdt: '2', municion: 5, tamano: 'XL', agora: "Raro; Oro'ym", precio: 120, caracteristicas: ['Acuático', 'Culata', 'Robusto'], alimentacion: 'cerrojo' },
  { category: 'armaBalas', subtype: 'fusil', nombre: 'Vuldrok Longarm (.47)', calibre: '.47', nt: 3, meta: 0, dano: 7, fuerza: 4, alcCorto: 45, alcLargo: 125, cdt: '2', municion: 5, tamano: 'XL', agora: 'Común; Vuldrok', precio: 300, caracteristicas: ['Culata'], alimentacion: 'cerrojo' },
  { category: 'armaBalas', subtype: 'fusil', nombre: 'Fusil Tarasov (.40)', calibre: '.40', nt: 3, meta: 0, dano: 6, fuerza: 2, alcCorto: 30, alcLargo: 80, cdt: '2', municion: 5, tamano: 'XL', agora: 'MC (Magistrados)', precio: 120, caracteristicas: ['Culata', 'Robusto'], alimentacion: 'revolver' },

  // --- FUSILES DE FRANCOTIRADOR ---
  { category: 'armaBalas', subtype: 'fusilFrancotirador', nombre: 'Fusil francotirador cerrojo típico (13mm)', calibre: '13mm', nt: 3, meta: 0, dano: 8, fuerza: 4, alcCorto: 50, alcLargo: 150, cdt: '1', municion: 5, tamano: 'XL', agora: 'Raro', precio: 700, caracteristicas: ['Mira 3', 'Culata'], alimentacion: 'cerrojo' },
  { category: 'armaBalas', subtype: 'fusilFrancotirador', nombre: 'Hyram Glory alim. auto. (13mm)', calibre: '13mm', nt: 3, meta: 0, dano: 8, fuerza: 4, alcCorto: 50, alcLargo: 150, cdt: '2(r)', municion: 15, tamano: 'XL', agora: 'Común; Decados', precio: 1000, caracteristicas: ['Mira 2', 'Culata'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'fusilFrancotirador', nombre: 'Radir Longshot cerrojo (13mm)', calibre: '13mm', nt: 4, meta: '+1', dano: 8, fuerza: 4, alcCorto: 55, alcLargo: 175, cdt: '1', municion: 5, tamano: 'XL', agora: 'Raro; MC (Radir)', precio: 1500, caracteristicas: ['Mira 4', 'Culata', 'Robusto'], alimentacion: 'cerrojo' },

  // --- SUBFUSILES ---
  { category: 'armaBalas', subtype: 'subfusil', nombre: 'Subfusil típico (.40)', calibre: '.40', nt: 4, meta: 0, dano: 5, fuerza: 1, alcCorto: 30, alcLargo: 40, cdt: '3(r)', municion: 20, tamano: 'L', agora: '', precio: 350, caracteristicas: ['Culata'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'subfusil', nombre: 'Herstal Project 98 (.32)', calibre: '.32', nt: 4, meta: 0, dano: 4, fuerza: 0, alcCorto: 15, alcLargo: 25, cdt: '3(r)', municion: 56, tamano: 'L', agora: 'Raro; Leagueheim', precio: 500, caracteristicas: ['Culata', 'Robusto'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'subfusil', nombre: 'Jahnisak Muffler (.40)', calibre: '.40', nt: 4, meta: 0, dano: 5, fuerza: 1, alcCorto: 30, alcLargo: 40, cdt: '3(r)', municion: 20, tamano: 'L', agora: '', precio: 350, caracteristicas: ['Culata'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'subfusil', nombre: 'K&M S-M7 (.40)', calibre: '.40', nt: 4, meta: '+1', dano: 5, fuerza: 1, alcCorto: 30, alcLargo: 40, cdt: '3(r)', municion: 30, tamano: 'L', agora: 'Tetis (solo al-M y Asamblea)', precio: 500, caracteristicas: ['Culata', 'Estabilizador'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'subfusil', nombre: 'Lank Stinger (.40)', calibre: '.40', nt: 4, meta: 0, dano: 5, fuerza: 1, alcCorto: 30, alcLargo: 40, cdt: '3(r)', municion: 20, tamano: 'L', agora: 'Carroñeros (Lank)', precio: 400, caracteristicas: ['Culata', 'Robusto'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'subfusil', nombre: 'MarTech Cobra (.40)', calibre: '.40', nt: 4, meta: 0, dano: 5, fuerza: 1, alcCorto: 30, alcLargo: 40, cdt: '3(r)', municion: 30, tamano: 'L', agora: 'Común; MC (Ingenieros)', precio: 400, caracteristicas: ['Culata'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'subfusil', nombre: 'Subfusil Tarasov (.40)', calibre: '.40', nt: 4, meta: 0, dano: 5, fuerza: 1, alcCorto: 20, alcLargo: 30, cdt: '2(r)', municion: 15, tamano: 'L', agora: 'Común; MC (Magistrados)', precio: 200, caracteristicas: ['Culata', 'Robusto'], alimentacion: 'automatica' },

  // --- ESCOPETAS ---
  { category: 'armaBalas', subtype: 'escopeta', nombre: 'Escopeta típica (cal.10)', calibre: 'cal.10', nt: 3, meta: '+1/0/-1', dano: '8/4/1', fuerza: 4, alcCorto: 10, alcLargo: 20, cdt: '2', municion: 7, tamano: 'L', agora: '', precio: 300, caracteristicas: ['Culata'], alimentacion: 'manual' },
  { category: 'armaBalas', subtype: 'escopeta', nombre: 'Escopeta típica 2 cañones (cal.10)', calibre: 'cal.10', nt: 3, meta: '+1/0/-1', dano: '8/4/1', fuerza: 4, alcCorto: 10, alcLargo: 20, cdt: '2', municion: 2, tamano: 'L', agora: '', precio: 200, caracteristicas: ['Culata'], alimentacion: 'manual' },
  { category: 'armaBalas', subtype: 'escopeta', nombre: 'Dreskel Boomer (cal.10)', calibre: 'cal.10', nt: 3, meta: '+1/0/-1', dano: '8/4/1', fuerza: 4, alcCorto: 10, alcLargo: 20, cdt: '2', municion: 7, tamano: 'L', agora: 'Carroñeros (Dreskel)', precio: 325, caracteristicas: ['Culata'], alimentacion: 'manual' },
  { category: 'armaBalas', subtype: 'escopeta', nombre: 'Dreskel Gatling (cal.8)', calibre: 'cal.8', nt: 4, meta: '+1/0/-1', dano: '9/5/1', fuerza: 4, alcCorto: 12, alcLargo: 25, cdt: '2(r)', municion: 12, tamano: 'L', agora: 'Común; Carroñeros (Dreskel)', precio: 450, caracteristicas: ['Culata'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'escopeta', nombre: 'Hazat Riotgun (cal.10)', calibre: 'cal.10', nt: 4, meta: '+1/0/-1', dano: '8/4/1', fuerza: 4, alcCorto: 10, alcLargo: 22, cdt: '2(r)', municion: 20, tamano: 'L', agora: 'Común; Hazat', precio: 400, caracteristicas: ['Culata'], alimentacion: 'automatica' },
  { category: 'armaBalas', subtype: 'escopeta', nombre: 'Xien Shortbarrel (cal.10)', calibre: 'cal.10', nt: 3, meta: '+2/-2/no', dano: '8/4', fuerza: 4, alcCorto: 5, alcLargo: 10, cdt: '2', municion: 6, tamano: 'L', agora: 'Común; Icono (Xien)', precio: 275, caracteristicas: ['Recortada'], alimentacion: 'manual' },
  { category: 'armaBalas', subtype: 'escopeta', nombre: 'Escopeta vuldrok (cal.10)', calibre: 'cal.10', nt: 3, meta: '+1/0/-1', dano: '8/4/1', fuerza: 4, alcCorto: 10, alcLargo: 20, cdt: '2', municion: 5, tamano: 'L', agora: 'Común; Vuldrok', precio: 300, caracteristicas: ['Culata'], alimentacion: 'manual' },
]

// ═══════════════════════════════════════════════════════════════
// ARMAS DE ENERGÍA
// ═══════════════════════════════════════════════════════════════

export const ARMAS_ENERGIA: EnergyWeapon[] = [
  // --- MINILÁSERES ---
  { category: 'armaEnergia', subtype: 'miniLaser', nombre: 'MarTech Midget', nt: 6, meta: 0, dano: 3, fuerza: 0, alcCorto: 5, alcLargo: 10, cdt: '2', municion: 7, tamano: 'XS', agora: 'Raro; LM y al-Malik (MarTech)', precio: 200, caracteristicas: ['Láser'], tipoEnergia: 'laser' },
  { category: 'armaEnergia', subtype: 'miniLaser', nombre: 'Anillo láser (artesanal)', nt: 6, meta: 0, dano: 3, fuerza: 0, alcCorto: 5, alcLargo: 10, cdt: '1', municion: 1, tamano: 'XXS', agora: 'Raro; al-Malik', precio: 600, caracteristicas: ['Láser', 'Camuflada'], tipoEnergia: 'laser' },

  // --- PISTOLAS LÁSER ---
  { category: 'armaEnergia', subtype: 'pistolLaser', nombre: 'Pistola láser kurgan', nt: 6, meta: 0, dano: 4, fuerza: 0, alcCorto: 15, alcLargo: 25, cdt: '3', municion: 18, tamano: 'S', agora: 'Común; Kurga', precio: 400, caracteristicas: ['Láser', 'Inestable'], tipoEnergia: 'laser' },
  { category: 'armaEnergia', subtype: 'pistolLaser', nombre: 'MarTech Amber', nt: 6, meta: '+1', dano: 4, fuerza: 0, alcCorto: 10, alcLargo: 20, cdt: '2', municion: 21, tamano: 'S', agora: 'Común; LM y al-Malik (MarTech)', precio: 300, caracteristicas: ['Láser'], tipoEnergia: 'laser' },
  { category: 'armaEnergia', subtype: 'pistolLaser', nombre: 'MarTech Gold', nt: 6, meta: '+1', dano: 5, fuerza: 0, alcCorto: 10, alcLargo: 20, cdt: '2', municion: 15, tamano: 'S', agora: 'Común; LM y al-Malik (MarTech)', precio: 300, caracteristicas: ['Láser'], tipoEnergia: 'laser' },

  // --- FUSILES LÁSER ---
  { category: 'armaEnergia', subtype: 'fusilLaser', nombre: 'MarTech Indigo', nt: 6, meta: '+1', dano: 7, fuerza: 0, alcCorto: 30, alcLargo: 80, cdt: '2', municion: 23, tamano: 'XL', agora: 'Común; LM y al-Malik (MarTech)', precio: 500, caracteristicas: ['Láser'], tipoEnergia: 'laser' },
  { category: 'armaEnergia', subtype: 'fusilLaser', nombre: 'MarTech Safire (francotirador)', nt: 6, meta: '+1', dano: 7, fuerza: 0, alcCorto: 60, alcLargo: 160, cdt: '1', municion: 10, tamano: 'XL', agora: 'Común; LM y al-Malik (MarTech)', precio: 600, caracteristicas: ['Láser'], tipoEnergia: 'laser' },

  // --- FUSILES DE ASALTO LÁSER ---
  { category: 'armaEnergia', subtype: 'fusilAsaltoLaser', nombre: 'MarTech Red', nt: 6, meta: '+1', dano: 8, fuerza: 0, alcCorto: 20, alcLargo: 60, cdt: '2', municion: 20, tamano: 'XL', agora: 'Raro; LM y al-Malik (MarTech)', precio: 700, caracteristicas: ['Láser'], tipoEnergia: 'laser' },
  { category: 'armaEnergia', subtype: 'fusilAsaltoLaser', nombre: 'Varsten Blacklight', nt: 6, meta: 0, dano: 8, fuerza: 0, alcCorto: 20, alcLargo: 60, cdt: '2', municion: 20, tamano: 'XL', agora: 'Raro; Decados (Varsten)', precio: 700, caracteristicas: ['Láser'], tipoEnergia: 'laser' },

  // --- PISTOLAS BLÁSTER ---
  { category: 'armaEnergia', subtype: 'pistolBlaster', nombre: 'OSI Alembic', nt: 7, meta: 0, dano: 7, fuerza: 3, alcCorto: 10, alcLargo: 20, cdt: '1', municion: 10, tamano: 'S', agora: 'Raro; Nobles (OSI)', precio: 700, caracteristicas: ['Bláster'], tipoEnergia: 'blaster' },
  { category: 'armaEnergia', subtype: 'pistolBlaster', nombre: 'Lank Eruptor', nt: 7, meta: 0, dano: 7, fuerza: 3, alcCorto: 10, alcLargo: 20, cdt: '1(r)', municion: 9, tamano: 'M', agora: 'Raro; Carroñeros (Lank)', precio: 900, caracteristicas: ['Bláster'], tipoEnergia: 'blaster' },
  { category: 'armaEnergia', subtype: 'pistolBlaster', nombre: 'Bláster ancestral vuldrok', nt: 7, meta: 0, dano: 6, fuerza: 3, alcCorto: 10, alcLargo: 20, cdt: '1', municion: 13, tamano: 'S', agora: 'Raro; Vuldrok (reliquia)', precio: 1000, caracteristicas: ['Bláster', 'Robusto'], tipoEnergia: 'blaster' },

  // --- FUSILES BLÁSTER ---
  { category: 'armaEnergia', subtype: 'fusilBlaster', nombre: 'Republic Arms 3000', nt: 8, meta: '+1', dano: 15, fuerza: 4, alcCorto: 30, alcLargo: 80, cdt: '1', municion: 20, tamano: 'XL', agora: 'Exótico; Imp', precio: 5000, caracteristicas: ['Bláster', 'Culata'], tipoEnergia: 'blaster' },
  { category: 'armaEnergia', subtype: 'fusilBlaster', nombre: 'OSI Crucible', nt: 7, meta: 0, dano: 9, fuerza: 3, alcCorto: 20, alcLargo: 30, cdt: '1', municion: 15, tamano: 'XL', agora: 'Raro; Nobles y LM (OSI)', precio: 1000, caracteristicas: ['Bláster'], tipoEnergia: 'blaster' },
  { category: 'armaEnergia', subtype: 'fusilBlaster', nombre: 'Filobláster Nitobi', nt: 7, meta: -1, dano: 9, fuerza: 3, alcCorto: 20, alcLargo: 30, cdt: '1', municion: 15, tamano: 'XL', agora: 'Raro; Baluarte (Nitobi)', precio: 3000, caracteristicas: ['Bláster', 'Inestable', 'Endurecida', 'Dos manos'], tipoEnergia: 'blaster' },

  // --- ESCOPETAS BLÁSTER ---
  { category: 'armaEnergia', subtype: 'escopetaBlaster', nombre: 'OSI Volcano', nt: 7, meta: '+2/0/-1', dano: '9/7/5', fuerza: 4, alcCorto: 10, alcLargo: 20, cdt: '1', municion: 8, tamano: 'L', agora: 'Rara; Nobles y LM (OSI)', precio: 1200, caracteristicas: ['Bláster', 'Culata'], tipoEnergia: 'blaster' },
  { category: 'armaEnergia', subtype: 'escopetaBlaster', nombre: 'Lank Incinerator', nt: 7, meta: '+2/0/-1', dano: '9/7/5', fuerza: 4, alcCorto: 10, alcLargo: 20, cdt: '1(r)', municion: 8, tamano: 'L', agora: 'Rara; Carroñeros (Lank)', precio: 1400, caracteristicas: ['Bláster', 'Culata'], tipoEnergia: 'blaster' },

  // --- LANZALLAMAS ---
  { category: 'armaEnergia', subtype: 'lanzallamas', nombre: 'Lanzallamas kalomita', nt: 4, meta: '+2', dano: '5(3)', fuerza: 2, alcCorto: 10, alcLargo: 20, cdt: '1', municion: 10, tamano: 'L', agora: 'Común; Avesti', precio: 150, caracteristicas: ['Fuego'], tipoEnergia: 'fuego' },
  { category: 'armaEnergia', subtype: 'lanzallamas', nombre: 'Kendra Dragon (napalm)', nt: 3, meta: '+2', dano: '4(4)', fuerza: 3, alcCorto: 10, alcLargo: 20, cdt: '1', municion: 6, tamano: 'XL', agora: 'Común', precio: 150, caracteristicas: ['Fuego'], tipoEnergia: 'fuego' },

  // --- CHIRRIADORES ---
  { category: 'armaEnergia', subtype: 'chirriador', nombre: 'Harpy screamer', nt: 6, meta: '+1', dano: 5, fuerza: 2, alcCorto: 10, alcLargo: 20, cdt: '1', municion: 15, tamano: 'S', agora: '', precio: 300, caracteristicas: ['Sónica'], tipoEnergia: 'sonico' },
  { category: 'armaEnergia', subtype: 'chirriador', nombre: 'Módulo tonal obun', nt: 5, meta: '+1', dano: 'Representar', fuerza: 0, alcCorto: 10, alcLargo: 20, cdt: '1', municion: '∞', tamano: 'S', agora: "Raro; Obun", precio: 1000, caracteristicas: ['Sónico', 'Requiere Artes Escénicas (Canto)'], tipoEnergia: 'sonico' },

  // --- ATURDIDORES ---
  { category: 'armaEnergia', subtype: 'aturdidor', nombre: 'Arbogast Sleeper', nt: 6, meta: '+1', dano: 4, fuerza: 2, alcCorto: 10, alcLargo: 20, cdt: '2', municion: 15, tamano: 'S', agora: '', precio: 300, caracteristicas: ['Descarga'], tipoEnergia: 'descarga' },
  { category: 'armaEnergia', subtype: 'aturdidor', nombre: 'OSI Tesla', nt: 6, meta: '+1', dano: 6, fuerza: 2, alcCorto: 8, alcLargo: 15, cdt: '2', municion: 6, tamano: 'S', agora: '(OSI)', precio: 600, caracteristicas: ['Descarga'], tipoEnergia: 'descarga' },
  { category: 'armaEnergia', subtype: 'aturdidor', nombre: 'Womper', nt: 7, meta: '+1', dano: 5, fuerza: 2, alcCorto: 10, alcLargo: 20, cdt: '1', municion: 15, tamano: 'S', agora: 'Rara; LM', precio: 900, caracteristicas: ['Área 2m', 'Descarga', 'Golpe'], tipoEnergia: 'descarga' },
]

// ═══════════════════════════════════════════════════════════════
// MUNICIÓN Y ACCESORIOS
// ═══════════════════════════════════════════════════════════════

export const MUNICION: Ammo[] = [
  // --- MUNICIÓN ESTÁNDAR ---
  { category: 'municion', nombre: 'Balas calibre .32', calibre: '.32', nt: 3, precioPorDisparo: 0.25, caracteristicas: ['Endurecida a NT5'] },
  { category: 'municion', nombre: 'Balas calibre .38-.40', calibre: '.38-.40', nt: 3, precioPorDisparo: 0.5, caracteristicas: ['Endurecida a NT5', 'Ruido'] },
  { category: 'municion', nombre: 'Balas calibre .47-.50', calibre: '.47-.50', nt: 3, precioPorDisparo: 1, caracteristicas: ['Endurecida a NT5', 'Ruido'] },
  { category: 'municion', nombre: 'Balas calibre 10mm', calibre: '10mm', nt: 3, precioPorDisparo: 2, caracteristicas: ['Endurecida a NT5', 'Ruido'] },
  { category: 'municion', nombre: 'Balas calibre 13mm', calibre: '13mm', nt: 3, precioPorDisparo: 3, caracteristicas: ['Endurecida a NT5', 'Ruido'] },
  { category: 'municion', nombre: 'Cartucho de escopeta', calibre: 'cal.10', nt: 3, precioPorDisparo: 0.5, caracteristicas: ['Perdigones', 'Ruido'] },
  { category: 'municion', nombre: 'Célula de fusión', calibre: 'universal', nt: 6, precioPorDisparo: 10, caracteristicas: ['Carga cualquier arma de energía'] },

  // --- MUNICIÓN ESPECIAL ---
  { category: 'municion', nombre: 'Cápsula de bláster', calibre: 'especial', nt: 6, precioPorDisparo: 'calibre+6', caracteristicas: ['+1 daño', 'Endurecida', 'Bláster'] },
  { category: 'municion', nombre: 'Bala expansiva', calibre: 'especial', nt: 3, precioPorDisparo: 'calibre+1', caracteristicas: ['Herida'] },
  { category: 'municion', nombre: 'Golpeadora', calibre: 'especial', nt: 5, precioPorDisparo: 'calibre+3', caracteristicas: ['Golpe', 'Objetivo dañado = Aturdido'] },
  { category: 'municion', nombre: 'Bala desgarradora', calibre: 'especial', nt: 6, precioPorDisparo: 'calibre+3', caracteristicas: ['Superendurecida'] },
  { category: 'municion', nombre: 'Garra de vorox', calibre: 'especial', nt: 5, precioPorDisparo: 'calibre+2', caracteristicas: ['+1 daño', 'Herida'] },
]

export const ACCESORIOS_ARMA: WeaponAccessory[] = [
  // --- ACCESORIOS DE ARMAS DE FUEGO ---
  { category: 'accesorioArma', nombre: 'Mira láser', nt: 4, precio: 150, efecto: '+2 potencial a la meta de maniobras de apuntar' },
  { category: 'accesorioArma', nombre: 'Mira nocturna', nt: 4, precio: 100, efecto: 'Anula reducción de visibilidad por la noche' },
  { category: 'accesorioArma', nombre: 'Mira óptica (por nivel)', nt: 3, precio: '30 × nivel', efecto: 'Reduce penalizador de alcance en -1 por nivel' },
  { category: 'accesorioArma', nombre: 'Arma no metálica', nt: 4, precio: '×2', efecto: 'No activa detectores de metales' },
  { category: 'accesorioArma', nombre: 'Silenciador', nt: 3, precio: 20, efecto: 'Anula Ruido para calibres .38-.40' },
  { category: 'accesorioArma', nombre: 'Trípode/bípode', nt: 2, precio: 10, efecto: 'Reduce a la mitad la Fuerza necesaria' },

  // --- ACCESORIOS CUERPO A CUERPO ---
  { category: 'accesorioCuerpoACuerpo', nombre: 'Guarda con forma de cesta', nt: 2, precio: 20, efecto: 'Resistencia Corporal +1 contra ataques cuerpo a cuerpo' },
  { category: 'accesorioCuerpoACuerpo', nombre: 'Rompescudos de energía', nt: 8, precio: 200, efecto: 'Requiere célula de fusión; sobrecarga escudo de energía con victoria' },
  { category: 'accesorioCuerpoACuerpo', nombre: 'Garrote con pinchos', nt: 1, precio: 10, efecto: '-1 meta; gana propiedad Endurecido' },
  { category: 'accesorioCuerpoACuerpo', nombre: 'Punta de choque', nt: 4, precio: 30, efecto: 'Requiere célula de fusión; -1 meta; gana Descarga (15 descargas)' },
  { category: 'accesorioCuerpoACuerpo', nombre: 'Vibromejora', nt: 5, precio: 100, efecto: 'Requiere célula de fusión; -1 meta; gana Vibro' },
]

// ═══════════════════════════════════════════════════════════════
// EXPLOSIVOS
// ═══════════════════════════════════════════════════════════════

export const EXPLOSIVOS: Explosive[] = [
  { category: 'explosivo', nombre: 'Metralla tamaño canica', nt: 6, meta: 0, dano: 3, fuerza: 0, alcCorto: 10, alcLargo: 20, cdt: '2', municion: 5, tamano: 'XXS', agora: 'Rara', precio: 20, caracteristicas: ['Área 3m', 'Bláster', 'Explo.'] },
  { category: 'explosivo', nombre: 'Metralla tamaño huevo', nt: 6, meta: 0, dano: 5, fuerza: 1, alcCorto: 10, alcLargo: 20, cdt: '2', municion: 3, tamano: 'XS', agora: 'Rara', precio: 30, caracteristicas: ['Área 3m', 'Bláster', 'Explo.'] },
  { category: 'explosivo', nombre: 'Metralla tamaño puño', nt: 6, meta: 0, dano: 6, fuerza: 1, alcCorto: 10, alcLargo: 20, cdt: '2', municion: 2, tamano: 'S', agora: 'Rara', precio: 50, caracteristicas: ['Área 3m', 'Bláster', 'Explo.'] },
  { category: 'explosivo', nombre: 'Bomba fétida etyri', nt: 0, meta: -1, dano: 0, fuerza: 1, alcCorto: 0, alcLargo: 0, cdt: '1', municion: 2, tamano: 'M', agora: 'Común; Etyri', precio: 10, caracteristicas: ['Des+Per -1, Sigilo -3 por impacto'] },
  { category: 'explosivo', nombre: 'Granada de fragmentación', nt: 6, meta: 0, dano: 10, fuerza: 1, alcCorto: 10, alcLargo: 20, cdt: '2', municion: 2, tamano: 'S', agora: '', precio: 50, caracteristicas: ['Área 5m', 'Fuerza explo. 12', 'Explo.', 'Herida', 'Golpe'] },
]

// ═══════════════════════════════════════════════════════════════
// ARMAS CUERPO A CUERPO
// ═══════════════════════════════════════════════════════════════

export const ARMAS_CUERPO_A_CUERPO: MeleeWeapon[] = [
  // --- ARMAS ESTÁNDAR ---
  { category: 'armaCuerpoACuerpo', nombre: 'Hacha de mano / hacha de leñador', nt: 1, meta: 0, dano: 6, fuerza: 4, tamano: 'L', agora: '', precio: 2, caracteristicas: [] },
  { category: 'armaCuerpoACuerpo', nombre: 'Hacha de guerra', nt: 1, meta: 0, dano: 7, fuerza: 5, tamano: 'L', agora: '', precio: 5, caracteristicas: ['Militar'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Motoespada', nt: 5, meta: -1, dano: 7, fuerza: 5, tamano: 'L', agora: 'Rara; Decados', precio: 150, caracteristicas: ['Endurecida', 'Herida', 'Militar', 'Ruido'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Porra', nt: 0, meta: 0, dano: 4, fuerza: 2, tamano: 'L', agora: '', precio: 0.5, caracteristicas: [] },
  { category: 'armaCuerpoACuerpo', nombre: 'Bastón', nt: 0, meta: -1, dano: 5, fuerza: 3, tamano: 'XL', agora: '', precio: 1, caracteristicas: ['Golpe'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Maza', nt: 1, meta: 0, dano: 5, fuerza: 3, tamano: 'L', agora: 'Común', precio: 10, caracteristicas: ['Endurecida', 'Militar', 'Golpe'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Daga', nt: 1, meta: 0, dano: 4, fuerza: 2, tamano: 'M', agora: '', precio: 4, caracteristicas: [] },
  { category: 'armaCuerpoACuerpo', nombre: 'Daga de puño ukar', nt: 5, meta: 0, dano: 4, fuerza: 2, tamano: 'M', agora: 'Común; Aylón', precio: 50, caracteristicas: ['Endurecida', 'Veneno 3'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Daga de mano izquierda', nt: 2, meta: 0, dano: 4, fuerza: 2, tamano: 'M', agora: 'Rara', precio: 5, caracteristicas: ['Guarda', 'Militar'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Garrote vil', nt: 0, meta: -1, dano: '1 + estrangular', fuerza: 1, tamano: 'XS', agora: 'Raro', precio: 5, caracteristicas: ['Estrangular: usa maniobra presa'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Gran arma', nt: 1, meta: 0, dano: 8, fuerza: 6, tamano: 'XL', agora: 'Rara', precio: 40, caracteristicas: ['Dos manos', 'Militar'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Claymore de adepto', nt: 5, meta: 0, dano: 8, fuerza: 6, tamano: 'XL', agora: 'Hermanos de Batalla', precio: 100, caracteristicas: ['Guarda', 'Endurecida', 'Militar', 'Golpe'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Cuchillo', nt: 1, meta: 0, dano: 3, fuerza: 1, tamano: 'S', agora: '', precio: 2, caracteristicas: [] },
  { category: 'armaCuerpoACuerpo', nombre: 'Cuchillo hueco', nt: 4, meta: 0, dano: 3, fuerza: 1, tamano: 'M', agora: 'Raro', precio: 50, caracteristicas: ['Veneno 5'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Cuchillo de trinchera', nt: 3, meta: 0, dano: 3, fuerza: 1, tamano: 'M', agora: 'Raro', precio: 6, caracteristicas: ['Puño de acero integrado', 'Militar'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Puño de acero', nt: 1, meta: '+2', dano: 1, fuerza: 0, tamano: 'XS', agora: '', precio: 2, caracteristicas: ['Golpe'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Zapatos de guerra shantor', nt: 5, meta: '+2', dano: 1, fuerza: 0, tamano: 'XS', agora: 'al-Malik', precio: 20, caracteristicas: ['Endurecidos', 'Militares', 'Golpe'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Lucero del alba', nt: 1, meta: -1, dano: 5, fuerza: 4, tamano: 'L', agora: 'Raro', precio: 20, caracteristicas: ['Endurecido', 'Militar', 'Golpe', 'Ignora escudos de mano'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Estoque', nt: 2, meta: 0, dano: 5, fuerza: 3, tamano: 'L', agora: 'Común', precio: 20, caracteristicas: ['Militar'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Porra de choque', nt: 4, meta: 0, dano: 6, fuerza: 2, tamano: 'L', agora: 'Común', precio: 15, caracteristicas: ['Descarga (15 descargas por célula de fusión)'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Porra solar hironem (yesht)', nt: 2, meta: 0, dano: 'Fe', fuerza: 2, tamano: 'L', agora: 'Hironem', precio: 100, caracteristicas: ['Descarga (15 descargas por célula de fusión)'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Lanza', nt: 1, meta: 0, dano: 5, fuerza: 3, tamano: 'L', agora: '', precio: 2, caracteristicas: ['Dos manos = Endurecida'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Lanza de caballería', nt: 1, meta: -1, dano: 8, fuerza: 5, tamano: 'XL', agora: 'Rara', precio: 20, caracteristicas: ['Militar', 'Cargar: +tamaño montura al daño'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Cuerno shantor', nt: 5, meta: 0, dano: 5, fuerza: 2, tamano: 'M', agora: 'Común; al-Malik', precio: 30, caracteristicas: ['Guarda', 'Endurecido', 'Militar', 'Cargar: +2 daño'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Espada', nt: 1, meta: 0, dano: 6, fuerza: 4, tamano: 'L', agora: '', precio: 20, caracteristicas: ['Militar'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Espada kurgan', nt: 4, meta: 0, dano: 6, fuerza: 2, tamano: 'L', agora: 'Kurga', precio: 45, caracteristicas: ['Guarda', 'Militar', 'Vaina de pierna (patada: +3 daño)'] },
  { category: 'armaCuerpoACuerpo', nombre: "Espada de cristal ascorbita (arbat'a)", nt: 2, meta: 0, dano: 6, fuerza: 3, tamano: 'L', agora: 'Ascorbita', precio: 1000, caracteristicas: ['Endurecida', 'Militar', 'Ruido', 'Vibro (3 turnos)'] },
  { category: 'armaCuerpoACuerpo', nombre: 'Espada vorox (glankesh)', nt: 2, meta: 0, dano: 6, fuerza: 4, tamano: 'L', agora: 'Vorox', precio: 15, caracteristicas: ['Militar', 'Endurecida en manos vorox'] },

  // --- ARTEFACTOS CUERPO A CUERPO ---
  { category: 'artefactoCuerpoACuerpo', nombre: 'Espada de flujo', nt: 8, meta: '+1', dano: 7, fuerza: 3, tamano: 'L', agora: 'Exótica', precio: 15000, caracteristicas: ['Bláster', 'Endurecida'] },
  { category: 'artefactoCuerpoACuerpo', nombre: 'Espada de neblina', nt: 8, meta: '+1', dano: 7, fuerza: 3, tamano: 'L', agora: 'Exótica', precio: 30000, caracteristicas: ['Bláster', 'Endurecida', 'Psi'] },
  { category: 'artefactoCuerpoACuerpo', nombre: 'Espada monofilamento', nt: 8, meta: 0, dano: 8, fuerza: 2, tamano: 'L', agora: 'Exótica', precio: 10000, caracteristicas: ['Ignora armadura'] },
]

// ═══════════════════════════════════════════════════════════════
// ARMADURAS
// ═══════════════════════════════════════════════════════════════

export const ARMADURAS: Armor[] = [
  // --- CIVILES ---
  { category: 'armadura', subtype: 'civil', nombre: 'Ropa gruesa', nt: 0, resistencia: 1, escudoCompatible: 'E', destreza: 0, vigor: 0, agora: '', precio: 1, caracteristicas: [] },
  { category: 'armadura', subtype: 'civil', nombre: 'Jubón de cuero', nt: 1, resistencia: 2, escudoCompatible: 'A', destreza: 0, vigor: 0, agora: '', precio: 5, caracteristicas: ['Protección contra Descargas y Golpes'] },
  { category: 'armadura', subtype: 'civil', nombre: 'Polímero tejido', nt: 4, resistencia: 2, escudoCompatible: 'E', destreza: 0, vigor: 0, agora: 'Común', precio: 200, caracteristicas: ['Protección contra Descargas, Endurecido y Golpes'] },
  { category: 'armadura', subtype: 'civil', nombre: 'Sinteseda', nt: 5, resistencia: 3, escudoCompatible: 'E', destreza: 0, vigor: 0, agora: 'Rara', precio: 300, caracteristicas: ['Protección contra Descargas'] },
  { category: 'armadura', subtype: 'civil', nombre: 'Esclerosintética', nt: 6, resistencia: 4, escudoCompatible: 'A', destreza: -1, vigor: 0, agora: 'Exótica', precio: 500, caracteristicas: ['Protección contra Descargas y Golpes'] },
  { category: 'armadura', subtype: 'civil', nombre: 'Tela inteligente', nt: 7, resistencia: 4, escudoCompatible: 'A', destreza: 0, vigor: 0, agora: 'Exótica', precio: 600, caracteristicas: ['Protección contra Descargas, Endurecido y Golpes'] },

  // --- COMBATE ---
  { category: 'armadura', subtype: 'combate', nombre: 'Acolchado de batalla', nt: 0, resistencia: 1, escudoCompatible: 'E', destreza: 0, vigor: 0, agora: '', precio: 3, caracteristicas: ['Protección contra Descargas y Golpes'] },
  { category: 'armadura', subtype: 'combate', nombre: 'Jubón de cuero tachonado', nt: 1, resistencia: 3, escudoCompatible: 'A', destreza: -1, vigor: 0, agora: '', precio: 8, caracteristicas: ['Protección contra Golpes'] },
  { category: 'armadura', subtype: 'combate', nombre: 'Jubón tachonado con plástico', nt: 5, resistencia: 3, escudoCompatible: 'A', destreza: 0, vigor: 0, agora: 'Común', precio: 15, caracteristicas: ['Protección contra Descargas y Golpes'] },
  { category: 'armadura', subtype: 'combate', nombre: 'Jubón tachonado con acerástico', nt: 5, resistencia: 3, escudoCompatible: 'A', destreza: 0, vigor: 0, agora: 'Raro', precio: 30, caracteristicas: ['Protección contra Descargas, Endurecido y Golpes'] },
  { category: 'armadura', subtype: 'combate', nombre: 'Traje galisp (hierro)', nt: 3, resistencia: 4, escudoCompatible: 'E', destreza: 0, vigor: 0, agora: 'Ukar', precio: 30, caracteristicas: ['Hedionda (Sigilo -3 en entorno no ukar)', 'Protección contra Descargas y Golpes'] },
  { category: 'armadura', subtype: 'combate', nombre: 'Media armadura de placas', nt: 1, resistencia: 5, escudoCompatible: 'B', destreza: -1, vigor: 0, agora: '', precio: 30, caracteristicas: ['Protección contra Endurecido y Golpes'] },
  { category: 'armadura', subtype: 'combate', nombre: 'Media armadura de plástico', nt: 5, resistencia: 5, escudoCompatible: 'B', destreza: 0, vigor: 0, agora: 'Común', precio: 60, caracteristicas: ['Protección contra Descargas y Golpes'] },
  { category: 'armadura', subtype: 'combate', nombre: 'Media armadura de acerástico', nt: 5, resistencia: 5, escudoCompatible: 'B', destreza: 0, vigor: 0, agora: 'Rara', precio: 100, caracteristicas: ['Protección contra Descargas, Endurecido y Golpes'] },
  { category: 'armadura', subtype: 'combate', nombre: 'Coraza de coral', nt: 0, resistencia: 5, escudoCompatible: 'B', destreza: 0, vigor: 0, agora: "Oro'ym", precio: 100, caracteristicas: ['Protección contra Descargas y Golpes', 'Pierde 1R por golpe, recupera 1R/día en agua de mar'] },

  // --- GUERRA ---
  { category: 'armadura', subtype: 'guerra', nombre: 'Exoesqueleto de acerámico', nt: 6, resistencia: 10, escudoCompatible: 'B', destreza: 0, vigor: 0, agora: 'Raro', precio: 2000, caracteristicas: ['NBQ', 'Protección contra Descargas, Endurecido, Golpes y Láser', 'Obstaculizante', 'Energía 24h'] },
  { category: 'armadura', subtype: 'guerra', nombre: 'Túnica de adepto (exoesqueleto)', nt: 6, resistencia: 10, escudoCompatible: 'B', destreza: 1, vigor: 2, agora: 'Hermanos de Batalla', precio: 10000, caracteristicas: ['NBQ', 'Protección contra Descargas, Endurecido, Golpes y Láser', 'Obstaculizante', '+1h soporte vital', 'Radio', 'Prismáticos'] },
  { category: 'armadura', subtype: 'guerra', nombre: 'Cota de escamas', nt: 1, resistencia: 6, escudoCompatible: 'B', destreza: -1, vigor: -1, agora: '', precio: 20, caracteristicas: ['Obstaculizante', 'Protección contra Endurecido y Golpes'] },
  { category: 'armadura', subtype: 'guerra', nombre: 'Cota de escamas de plástico', nt: 5, resistencia: 6, escudoCompatible: 'A', destreza: -1, vigor: 0, agora: 'Común', precio: 50, caracteristicas: ['Obstaculizante', 'Protección contra Descargas y Golpes'] },
  { category: 'armadura', subtype: 'guerra', nombre: 'Cota de escamas de acerástico', nt: 5, resistencia: 6, escudoCompatible: 'A', destreza: -1, vigor: 0, agora: 'Rara', precio: 80, caracteristicas: ['Protección contra Descargas, Endurecido y Golpes', 'Obstaculizante'] },
  { category: 'armadura', subtype: 'guerra', nombre: 'Escamas de dragón de fuego frío', nt: 1, resistencia: 6, escudoCompatible: 'B', destreza: -1, vigor: 0, agora: 'Vuldrok', precio: 200, caracteristicas: ['Obstaculizante', 'Protección contra Blásters, Descargas, Fuego, Golpes y Láser'] },
  { category: 'armadura', subtype: 'guerra', nombre: 'Traje repeledor kurgan', nt: 6, resistencia: 0, escudoCompatible: 'E', destreza: 0, vigor: 0, agora: 'Kurga', precio: 250, caracteristicas: ['Activación: -2 a la meta para acertar a su portador, dura 10 turnos'] },
  { category: 'armadura', subtype: 'guerra', nombre: 'Cota de malla', nt: 1, resistencia: 7, escudoCompatible: 'A', destreza: -1, vigor: -2, agora: '', precio: 50, caracteristicas: ['Obstaculizante', 'Protección contra Endurecido y Golpes'] },
  { category: 'armadura', subtype: 'guerra', nombre: 'Cota de malla de plástico', nt: 5, resistencia: 7, escudoCompatible: 'A', destreza: -1, vigor: 0, agora: 'Común', precio: 80, caracteristicas: ['Obstaculizante', 'Protección contra Descargas y Golpes'] },
  { category: 'armadura', subtype: 'guerra', nombre: 'Cota de malla de acerástico', nt: 5, resistencia: 7, escudoCompatible: 'A', destreza: -1, vigor: 0, agora: 'Rara', precio: 100, caracteristicas: ['Obstaculizante', 'Protección contra Descargas, Endurecido y Golpes'] },
  { category: 'armadura', subtype: 'guerra', nombre: 'Armadura de placas completa', nt: 1, resistencia: 8, escudoCompatible: 'B', destreza: -1, vigor: -2, agora: '', precio: 80, caracteristicas: ['Obstaculizante', 'Protección contra Endurecido y Golpes'] },
  { category: 'armadura', subtype: 'guerra', nombre: 'Armadura de placas de plástico', nt: 5, resistencia: 8, escudoCompatible: 'B', destreza: -1, vigor: -1, agora: 'Común', precio: 100, caracteristicas: ['Obstaculizante', 'Protección contra Descargas y Golpes'] },
  { category: 'armadura', subtype: 'guerra', nombre: 'Armadura de placas de acerástico', nt: 5, resistencia: 8, escudoCompatible: 'B', destreza: -1, vigor: -1, agora: 'Rara', precio: 150, caracteristicas: ['Protección contra Descargas, Endurecido y Golpes', 'Obstaculizante'] },

  // --- ESPACIALES ---
  { category: 'armadura', subtype: 'espacial', nombre: 'Traje espacial', nt: 5, resistencia: 2, escudoCompatible: 'B', destreza: -2, vigor: -1, agora: 'Común', precio: 100, caracteristicas: ['24h soporte vital', 'NBQ', 'Obstaculizante', 'Protección contra Descargas, Endurecido, Fuego y Golpes'] },
  { category: 'armadura', subtype: 'espacial', nombre: 'Traje espacial acorazado', nt: 5, resistencia: 6, escudoCompatible: 'B', destreza: -1, vigor: -2, agora: 'Común', precio: 400, caracteristicas: ['Como traje espacial + Protección contra Blásters y Láseres'] },
  { category: 'armadura', subtype: 'espacial', nombre: 'Traje táctico Auriga', nt: 7, resistencia: 3, escudoCompatible: 'A', destreza: -1, vigor: 0, agora: 'Aurigas', precio: 1000, caracteristicas: ['Como traje espacial + Protección contra Blásters y Láseres'] },
  { category: 'armadura', subtype: 'espacial', nombre: 'Traje espacial de saqueador', nt: 6, resistencia: 7, escudoCompatible: 'B', destreza: -1, vigor: -1, agora: 'Raro', precio: 1000, caracteristicas: ['Como traje espacial + Protección contra Blásters y Láseres'] },
  { category: 'armadura', subtype: 'espacial', nombre: 'Traje espacial antiguo', nt: 4, resistencia: 1, escudoCompatible: 'B', destreza: -3, vigor: -2, agora: 'Raro', precio: 50, caracteristicas: ['12h soporte vital', 'NBQ', 'Protección contra Descargas y Golpes'] },
]

// ═══════════════════════════════════════════════════════════════
// ESCUDOS
// ═══════════════════════════════════════════════════════════════

export const ESCUDOS_MANO: HandShield[] = [
  { category: 'escudoMano', nombre: 'Escudo de cuerpo (acero)', nt: 1, resistencia: '+3', dano: '5 (Golpe)', fuerza: 5, tamano: 'XL', agora: 'Común', precio: 15, caracteristicas: ['Poco manejable', 'Protección contra Golpes'] },
  { category: 'escudoMano', nombre: 'Escudo antidisturbios (plástico)', nt: 4, resistencia: '+3', dano: 4, fuerza: 0, tamano: 'L', agora: 'Común', precio: 25, caracteristicas: ['Protección contra Golpes'] },
  { category: 'escudoMano', nombre: 'Escudo de batalla (acerástico)', nt: 5, resistencia: '+4', dano: 4, fuerza: 0, tamano: 'L', agora: 'Raro', precio: 50, caracteristicas: ['Poco manejable', 'Protección contra Endurecido y Golpes'] },
  { category: 'escudoMano', nombre: 'Rodela (acero)', nt: 1, resistencia: '+2', dano: 3, fuerza: 2, tamano: 'M', agora: 'Común', precio: 10, caracteristicas: ['Protección contra Golpes'] },
  { category: 'escudoMano', nombre: 'Rodela de duelista (acerástico)', nt: 5, resistencia: '+2', dano: 1, fuerza: 0, tamano: 'M', agora: 'Rara', precio: 25, caracteristicas: ['Protección contra Endurecido y Golpes', 'Resistencia +4 contra proyectiles'] },
]

export const ESCUDOS_ENERGIA: EnergyShield[] = [
  { category: 'escudoEnergia', nombre: 'Escudo de energía antiguo', nt: 6, umbralMin: 6, umbralMax: 9, activaciones: 8, agotamiento: 10, distorsion: '+2 R', agora: 'Raro', precio: 300, caracteristicas: ['Tamaño S', 'Compatible armaduras E', 'Ruido al activarse', 'Incompatible con objetos XL'] },
  { category: 'escudoEnergia', nombre: 'Escudo de energía estándar', nt: 7, umbralMin: 5, umbralMax: 10, activaciones: 10, agotamiento: 13, distorsion: '+1 R', agora: 'Común', precio: 500, caracteristicas: ['Tamaño S', 'Compatible armaduras E', 'Ruido al activarse'] },
  { category: 'escudoEnergia', nombre: 'Escudo de energía de duelista', nt: 7, umbralMin: 5, umbralMax: 10, activaciones: 15, agotamiento: 13, distorsion: '0', agora: 'Raro', precio: 1000, caracteristicas: ['Tamaño XS', 'Compatible armaduras E', 'Ruido al activarse'] },
  { category: 'escudoEnergia', nombre: 'Escudo de energía de asalto', nt: 7, umbralMin: 5, umbralMax: 15, activaciones: 20, agotamiento: 15, distorsion: '+1 R', agora: 'Exótico', precio: 3000, caracteristicas: ['Tamaño M', 'Compatible armaduras A y E', 'Siempre hace Ruido'] },
  { category: 'escudoEnergia', nombre: 'Escudo de energía de batalla', nt: 7, umbralMin: 5, umbralMax: 20, activaciones: 30, agotamiento: 15, distorsion: '+1 R', agora: 'Exótico', precio: 5000, caracteristicas: ['Tamaño M', 'Compatible armaduras A y E', 'Siempre hace Ruido'] },
]

// ═══════════════════════════════════════════════════════════════
// EQUIPO GENERAL Y SERVICIOS
// ═══════════════════════════════════════════════════════════════

export const EQUIPO_GENERAL: GeneralEquipment[] = [
  // --- COMUNICACIONES ---
  { category: 'comunicacion', nombre: 'Tarjeta brillante', nt: 5, tamano: 'XS', precio: 100, efecto: 'Tableta naipe, conecta dispositivos NT4-5 a red inalámbrica; Alc. 100km; Seg. Ardua' },
  { category: 'comunicacion', nombre: 'Walkie-talkie', nt: 4, tamano: 'S', precio: 25, efecto: 'Comunicador básico; Alc. 25km; Seg. Difícil' },
  { category: 'comunicacion', nombre: 'Auriculares militares', nt: 4, tamano: 'XS', precio: 35, efecto: 'Comunicador militar; Alc. 25km; Seg. Difícil' },
  { category: 'comunicacion', nombre: 'Pulsera de ejecutivo', nt: 5, tamano: 'XXS', precio: 50, efecto: 'Comunicador compacto; Alc. 25km; Seg. Ardua' },
  { category: 'comunicacion', nombre: 'Pin susurrador', nt: 5, tamano: 'XXS', precio: 100, efecto: 'Collar+auricular miniatura personalizado; Alc. 10km; Seg. Exigente (e); Decados monopolio' },
  { category: 'comunicacion', nombre: 'Imp. Starlight DCLA', nt: 8, tamano: 'XL', precio: 300, efecto: 'Radio de taquiones interplanetaria; Alc. 100 UA; 10s retraso/UA; Seg. Ardua (e)' },
  { category: 'comunicacion', nombre: 'Radio cuántica', nt: 8, tamano: 'XL', precio: 5000, efecto: 'Transferencia cuántica instantánea; Alc. 100 UA; Seg. Milagrosa (e)' },
  { category: 'comunicacion', nombre: 'Rúter de codificación', nt: '4+', tamano: 'M', precio: 'NT×20', efecto: 'Codifica la comunicación' },
  { category: 'comunicacion', nombre: 'Equipo de espía', nt: '4+', tamano: 'L', precio: 'NT×100', efecto: 'Tiradas de piratear para interceptar son favorables' },

  // --- ENERGÍA ---
  { category: 'energia', nombre: 'Célula de fusión (XS)', nt: 6, tamano: 'XS', precio: 10, efecto: 'Escudo de duelista, armas de energía, espada de flujo; 3F recargar' },
  { category: 'energia', nombre: 'Célula de fusión (S)', nt: 6, tamano: 'S', precio: 10, efecto: 'Escudos de energía, radios, máquinas pensantes portátiles; 3F recargar' },
  { category: 'energia', nombre: 'Célula de fusión (M+)', nt: 6, tamano: 'M', precio: 10, efecto: 'Deslizadores pequeños o motos aerodeslizadoras; 3F recargar' },

  // --- ILUMINACIÓN ---
  { category: 'iluminacion', nombre: 'Vela', nt: 1, tamano: 'XXS', precio: 0.25, efecto: '3-12 horas' },
  { category: 'iluminacion', nombre: 'Antorcha', nt: 1, tamano: 'M', precio: 1, efecto: '20-60 minutos' },
  { category: 'iluminacion', nombre: 'Farol', nt: 1, tamano: 'M', precio: 2, efecto: '50-100 horas (aceite 2F; daño fuego 2+2 prolongado)' },
  { category: 'iluminacion', nombre: 'Siemprebrilla', nt: 8, tamano: 'M', precio: 200, efecto: 'Siglos; siempre encendida' },
  { category: 'iluminacion', nombre: 'Antorcha de fusión', nt: 5, tamano: 'S', precio: 25, efecto: '10 horas; Robusta' },

  // --- MODA ---
  { category: 'moda', nombre: 'Ropa de trabajo resistente', nt: 0, precio: 10, efecto: 'Dura un año' },
  { category: 'moda', nombre: 'Ropa de trabajo de invierno', nt: 0, precio: 20, efecto: 'Protección contra frío; dura un año' },
  { category: 'moda', nombre: 'Botas de tacón', nt: 1, precio: 3, efecto: 'Par' },
  { category: 'moda', nombre: 'Conjunto casual', nt: 1, precio: 2, efecto: 'Ropa informal' },
  { category: 'moda', nombre: 'Ropa elegante o formal', nt: 2, precio: 5, efecto: 'Vestimenta distinguida' },
  { category: 'moda', nombre: 'Moda eclesiástica', nt: 1, precio: 10, efecto: 'Vestimenta de Iglesia' },
  { category: 'moda', nombre: 'Moda gremial', nt: 3, precio: 15, efecto: 'Vestimenta de Liga' },
  { category: 'moda', nombre: 'Moda noble', nt: 3, precio: '15 + rango', efecto: 'Vestimenta noble' },
  { category: 'moda', nombre: 'Traje inteligente', nt: 7, precio: 250, efecto: 'Antisuciedad, autorreparable, ajustable, cambia color' },
  { category: 'moda', nombre: 'Traje inteligente ignífugo', nt: 7, precio: 325, efecto: 'Como traje inteligente + Protección contra Fuego' },
  { category: 'moda', nombre: 'Traje inteligente impenetrable (+1R)', nt: 7, precio: 300, efecto: 'Como traje inteligente + R.Corporal +1; Protección contra Endurecido' },

  // --- MEDICINA ---
  { category: 'medicina', nombre: 'Autosanguijuela', nt: 5, tamano: 'XXS', precio: 10, efecto: '1/día neutraliza drogas/venenos, anula 1 estado; paciente sufre 1 Vitalidad' },
  { category: 'medicina', nombre: 'Maletín de médico', nt: 2, tamano: 'L', precio: 10, efecto: 'Curar: +1 meta (20 usos)' },
  { category: 'medicina', nombre: 'Elixir', nt: 7, tamano: 'XXS', precio: 10, efecto: 'Según potencia; no cuenta para sobrecarga tecgnóstica' },
  { category: 'medicina', nombre: 'Elixir autoinyectable', nt: 6, tamano: 'XS', precio: 25, efecto: 'Inyecta automáticamente 1 dosis cuando herida > reanimaciones' },
  { category: 'medicina', nombre: 'Bisturí', nt: 2, tamano: 'XS', precio: 3, efecto: '+1 meta a operar (1 uso); como cuchillo: 2 daño + Endurecido' },
  { category: 'medicina', nombre: 'Medpac personal', nt: 4, tamano: 'XS', precio: 5, efecto: 'Tratar heridas favorables, +1 Vitalidad si éxito (1 uso)' },
  { category: 'medicina', nombre: 'Medpac médico', nt: 4, tamano: 'M', precio: 20, efecto: 'Tratar heridas favorables, +1 Vitalidad si éxito (10 usos)' },
  { category: 'medicina', nombre: 'Medpac de expedición', nt: 4, tamano: 'XL', precio: 100, efecto: 'Tratar heridas favorables, +1 Vit si éxito (30 usos); reduce venenos a la mitad' },
  { category: 'medicina', nombre: 'Medpac nanotecnológico', nt: 7, tamano: 'L', precio: 1000, efecto: '1 Descanso instantáneo + 1 Vitalidad por PV (20 usos)' },
  { category: 'medicina', nombre: 'Equipo quirúrgico', nt: 4, tamano: 'L', precio: 200, efecto: 'Requerido para maniobras de operar' },
  { category: 'medicina', nombre: 'Detectavenenos', nt: 5, tamano: 'S', precio: 100, efecto: 'Detecta venenos de su archivo de datos' },

  // --- DROGAS ---
  { category: 'droga', nombre: 'Tranquilizante de animales', nt: 3, precio: 3, efecto: 'Potencia 4; 10 min; Sobredosis: Con -1, Intl -1; Inconsciente' },
  { category: 'droga', nombre: 'Cocaína', nt: 0, precio: 6, efecto: 'Potencia 5; 10 min; Sobredosis: Pre -1, Intl -1; Despreocupado, Estimulado' },
  { category: 'droga', nombre: 'Especia obun (vol-qhaatai)', nt: 0, precio: 50, efecto: 'Potencia 2; 10 min; Sobredosis: Vol -2; Iluminado' },
  { category: 'droga', nombre: 'Opio', nt: 0, precio: 5, efecto: 'Potencia 3 (A); 20 min; Sobredosis: Per -1, Fue -1; Atontado, Eufórico; Abstinencia: Cansado' },
  { category: 'droga', nombre: 'Morfina', nt: 0, precio: 8, efecto: 'Potencia 4 (A); 30 min; Sobredosis: Per -1, Fue -1; Atontado, Insensibilizado; Abstinencia: Atontado' },
  { category: 'droga', nombre: 'Heroína', nt: 0, precio: 10, efecto: 'Potencia 6 (A); 15 min; Sobredosis: Per -2, Fue -2; Eufórico, Aturdido; Abstinencia: Atormentado' },
  { category: 'droga', nombre: 'Selchakah (hierba Decados)', nt: 0, precio: 10, efecto: 'Potencia 5 (A); 20 min; Sobredosis: Vol -2, Intl -2; Epifanía, Eufórico; Abstinencia: Enfadado' },

  // --- VENENOS ---
  { category: 'veneno', nombre: 'Extracto de garra de vorox', nt: 0, precio: 20, efecto: 'Potencia 3; 5 min; Sobredosis: Des -1, Fue -1; Confuso, Atontado' },
  { category: 'veneno', nombre: 'Mordisco de serpiente de cascabel', nt: 0, precio: 5, efecto: 'Potencia 7; 1 hora; Sobredosis: Con -2, Per -1; Atontado, Atormentado' },
  { category: 'veneno', nombre: 'Grixi (veneno de filo ukar)', nt: 0, precio: 50, efecto: 'Potencia 8; 1 hora; Sobredosis: Con -1, Fue -1; Malherido' },
  { category: 'veneno', nombre: 'Plox (veneno de filo ukar)', nt: 0, precio: 25, efecto: 'Potencia 5; 2 min; Sobredosis: Paralizado; Cansado' },

  // --- CONTENCIÓN ---
  { category: 'contencion', nombre: 'Esposas', nt: '1+', precio: 'NT×5', efecto: 'Vitalidad NT×2; Protección escala con NT; Seg. = NT' },
  { category: 'contencion', nombre: 'Cadenas de la Asamblea', nt: 6, precio: 300, efecto: 'Vitalidad 13 (protección contra todo); Seg. Hercúlea (e); dolor a distancia' },
  { category: 'contencion', nombre: 'Nanofutón con ataduras', nt: 7, precio: 600, efecto: 'Pelear+Des para atar; Fue+Vig desfavorable contra Ardua para liberarse; Vitalidad 8' },

  // --- SEGURIDAD ---
  { category: 'seguridad', nombre: 'Cerradura genética (puerta)', nt: '6+', precio: 'NT×200', efecto: 'Bioescáner de cuerpo entero; Seg. Tenaz (gen)' },
  { category: 'seguridad', nombre: 'Cerradura magna de acerámico', nt: '5+', precio: 'NT×10', efecto: 'Vitalidad 12 (protección contra todo); Seg. Tenaz; requiere piratear' },
  { category: 'seguridad', nombre: 'Teclado codificador', nt: '5+', precio: 'NT×20', efecto: 'Usa Interfaz o Intrusión para abrir cerraduras mismo NT o inferior' },
  { category: 'seguridad', nombre: 'Llaves de ladrón', nt: '1-4', precio: 'NT×10', efecto: 'Usa Intrusión para abrir cerraduras mismo NT o inferior' },
  { category: 'seguridad', nombre: 'Guardia de perímetro SV', nt: 6, tamano: 'S', precio: 200, efecto: 'Orbe espía 8cm, control remoto/patrulla; Seg. Ardua; reconocimiento facial, infrarrojos, visión nocturna' },
  { category: 'seguridad', nombre: 'Cerradura Wellesley', nt: 4, precio: 2, efecto: 'Candado mejorado; Vitalidad 8 (prot. Fuego, Endurecido, Golpes); Seg. Exigente (e); Carroñeros favorables' },

  // --- HERRAMIENTAS ---
  { category: 'herramienta', nombre: 'Caja de herramientas estandarizada', nt: '1-8', tamano: 'L', precio: 'NT×10', efecto: 'Según NT; sin herramientas, Tecnorredención desfavorable' },
  { category: 'herramienta', nombre: 'Taller bien surtido', nt: '1-8', precio: 'NT×200', efecto: 'Tiradas de Tecnorredención relevantes favorables' },
  { category: 'herramienta', nombre: 'Pala', nt: '1-3', tamano: 'L', precio: 'NT×2', efecto: 'Herramienta de excavación' },
  { category: 'herramienta', nombre: 'Costurero', nt: 3, tamano: 'XS', precio: 1, efecto: 'Kit de costura' },

  // --- DISPOSITIVOS (MÁQUINAS PENSANTES) ---
  { category: 'dispositivo', nombre: 'Contable', nt: '4+', precio: 'NT×100+200', efecto: 'Tiradas matemáticas favorables' },
  { category: 'dispositivo', nombre: 'Almacenamiento de datos', nt: '4+', precio: 'NT×NT', efecto: 'Almacena NT en terabytes; compatible dispositivos mismo NT' },
  { category: 'dispositivo', nombre: 'Escáner facial', nt: '5+', precio: 'NT×100+200', efecto: 'Reconoce caras; reduce Resistencia a ver disfraz en NT-3' },
  { category: 'dispositivo', nombre: 'Biblioteca', nt: '4+', precio: 'NT×200+600', efecto: 'NT×1000 libros; reduce a la mitad tiempo de investigación' },
  { category: 'dispositivo', nombre: 'Consejero', nt: '5+', precio: 'NT×300+600', efecto: 'Competencias de Saber equivalentes al NT' },
  { category: 'dispositivo', nombre: 'Asesor vital', nt: '4+', precio: 'NT×200+100', efecto: 'Tiradas favorables para tarea preparada (no combate)' },
  { category: 'dispositivo', nombre: 'Mapeador', nt: '5+', precio: 'NT×100+200', efecto: 'Mapas; Supervivencia y orientación favorables (+2 meta si obsoletos)' },
  { category: 'dispositivo', nombre: 'Adjunto (portátil)', nt: '4+', precio: 'NT×50', efecto: 'Escribir, calcular, conectar, programar, simular; acciones tardan ×2 pero favorables' },
  { category: 'dispositivo', nombre: 'Secretario', nt: '5+', precio: 'NT×200+100', efecto: 'Graba experiencias; tiradas de Academia favorables' },
  { category: 'dispositivo', nombre: 'Sistemas de puntería asistida', nt: '5+', precio: 'NT×100+200', efecto: '+2 meta primer turno apuntando (máx +3); ignora condiciones ambientales' },

  // --- ENTRETENIMIENTO ---
  { category: 'entretenimiento', nombre: 'Caja de fantasía (realidad artificial)', nt: 5, precio: 1000, efecto: 'Inmersión investigar y simulaciones; no eres consciente del entorno real' },
  { category: 'entretenimiento', nombre: 'Gramófono/cilindro de cera', nt: 3, precio: 10, efecto: 'Frágil; grabaciones 10-45 min' },
  { category: 'entretenimiento', nombre: 'Cinta/disco láser/digital', nt: 4, precio: 20, efecto: 'Robusta; grabaciones 45-90 min' },
  { category: 'entretenimiento', nombre: 'Fotones/cuántico', nt: 5, precio: 30, efecto: 'Indestructible; grabaciones ilimitadas' },
  { category: 'entretenimiento', nombre: 'Sinfonía personalizada', nt: 6, precio: 50, efecto: 'Música IA personalizada reactiva al humor/entorno' },
  { category: 'entretenimiento', nombre: 'Hoja de noticias', nt: 2, precio: 0.25, efecto: 'Noticias de actualidad' },
  { category: 'entretenimiento', nombre: 'Proyector de imágenes en movimiento', nt: 3, precio: 20, efecto: 'Frágil; grabaciones 10-45 min' },
  { category: 'entretenimiento', nombre: 'Aparato de televisión', nt: 4, precio: 40, efecto: 'Robusto; grabaciones 45-90 min' },
  { category: 'entretenimiento', nombre: 'Linterna mágica (holográfico)', nt: 5, precio: 60, efecto: 'Indestructible; grabaciones ilimitadas' },
  { category: 'entretenimiento', nombre: 'Videopergamino / videolibro', nt: 6, precio: 500, efecto: 'Vídeo superligero; equivalente a biblioteca pública' },
  { category: 'entretenimiento', nombre: 'Baraja de cartas', nt: 2, precio: 3, efecto: 'Juego de cartas' },
  { category: 'entretenimiento', nombre: 'Dados', nt: 0, precio: 1, efecto: 'Juego de dados' },
  { category: 'entretenimiento', nombre: 'Juego de mesa', nt: 1, precio: 10, efecto: 'Juego de mesa variado' },
]

// ═══════════════════════════════════════════════════════════════
// MONTURAS
// ═══════════════════════════════════════════════════════════════

export const MONTURAS: Mount[] = [
  { category: 'montura', nombre: 'Bruto', velocidad: 'Parsimonioso (4-6 km/h)', carga: '400 kg', vitalidad: 19, tamano: 8, precio: 20, comida: 5, ataques: 'Secreción maloliente; R.Corporal 2' },
  { category: 'montura', nombre: 'Camello', velocidad: 'Prudente (15-55 km/h)', carga: '200 kg', vitalidad: 22, tamano: 7, precio: 500, comida: 4, ataques: 'Mordisco: meta 8, daño 1; Embestida: meta 6, daño 3' },
  { category: 'montura', nombre: 'Burro', velocidad: 'Lento (8-40 km/h)', carga: '75 kg', vitalidad: 18, tamano: 6, precio: 25, comida: 0.5, ataques: 'Mordisco: meta 10, daño 1; Coz: meta 8, daño 3' },
  { category: 'montura', nombre: 'Lagarto feriza', velocidad: 'Prudente (15-55 km/h)', carga: '150 kg', vitalidad: 25, tamano: 7, precio: 800, comida: 10, ataques: 'Escupitajo ácido: meta 14, alc. 5-10, daño 2 + 2 prolongado' },
  { category: 'montura', nombre: 'Caballo', velocidad: 'Prudente (10-50 km/h)', carga: '100 kg', vitalidad: 20, tamano: 7, precio: 200, comida: 6, ataques: 'Mordisco: meta 9, daño 1; Coz: meta 7, daño 5' },
  { category: 'montura', nombre: 'Caballo de guerra', velocidad: 'Prudente (8-40 km/h)', carga: '150 kg', vitalidad: 21, tamano: 7, precio: 1000, comida: 10, ataques: 'Mordisco: meta 12, daño 1; Coz: meta 10, daño 6' },
  { category: 'montura', nombre: 'Corcel vuann', velocidad: 'Prudente (10-65 km/h)', carga: '20 kg', vitalidad: 16, tamano: 7, precio: 20, comida: 2, ataques: 'Mordisco: meta 9, daño 1; Coz: meta 9, daño 4' },
]

// ═══════════════════════════════════════════════════════════════
// VEHÍCULOS
// ═══════════════════════════════════════════════════════════════

export const VEHICULOS: Vehicle[] = [
  // --- ANIMALES ---
  { category: 'vehiculo', subtipo: 'animal', nombre: 'Carro de brutos', nt: 1, velocidad: 'Parsimonioso (4 km/h)', carga: '1 tonelada', vitalidad: 20, armadura: 0, alcanceDiario: '50 km', precio: 10, combustible: 10, caracteristicas: '2 brutos' },
  { category: 'vehiculo', subtipo: 'animal', nombre: 'Carruaje', nt: 1, velocidad: 'Lento (8 km/h)', carga: '1 tonelada', vitalidad: 24, armadura: 0, alcanceDiario: '100 km', precio: 40, combustible: 24, caracteristicas: '4 caballos' },

  // --- MOTOS ---
  { category: 'vehiculo', subtipo: 'moto', nombre: 'Autoquad de la Liga', nt: 4, velocidad: 'Prudente (70 km/h)', carga: '75 kg', vitalidad: 10, armadura: 0, alcanceDiario: '280 km', precio: 1000, combustible: 28, caracteristicas: 'Piloto automático: meta 8' },
  { category: 'vehiculo', subtipo: 'moto', nombre: 'Moto Masat-50', nt: 4, velocidad: 'Prudente (65 km/h)', carga: '20 kg', vitalidad: 10, armadura: 0, alcanceDiario: '200 km', precio: 750, combustible: 20, caracteristicas: '' },

  // --- COCHES ---
  { category: 'vehiculo', subtipo: 'coche', nombre: 'AT Rover Hazat', nt: 4, velocidad: 'Rápido (110 km/h)', carga: '100 kg', vitalidad: 32, armadura: 6, alcanceDiario: '250 km', precio: 2500, combustible: 25, caracteristicas: '' },
  { category: 'vehiculo', subtipo: 'coche', nombre: 'Transporte Hazat (camión)', nt: 4, velocidad: 'Rápido (95 km/h)', carga: '2 toneladas', vitalidad: 40, armadura: 6, alcanceDiario: '300 km', precio: 3000, combustible: 30, caracteristicas: '' },
  { category: 'vehiculo', subtipo: 'coche', nombre: 'Autocoche de lujo de la Liga', nt: 4, velocidad: 'Rápido (130 km/h)', carga: '300 kg', vitalidad: 24, armadura: 6, alcanceDiario: '120 km', precio: 3000, combustible: 15, caracteristicas: 'Máquina pensante NT4; Piloto automático: meta 10' },
  { category: 'vehiculo', subtipo: 'coche', nombre: 'Carruaje Auto Street de la Liga', nt: 4, velocidad: 'Prudente (80 km/h)', carga: '20 kg', vitalidad: 16, armadura: 2, alcanceDiario: '300 km', precio: 1500, combustible: 30, caracteristicas: 'Piloto automático: meta 8' },
  { category: 'vehiculo', subtipo: 'coche', nombre: 'Todoterreno Shodan', nt: 4, velocidad: 'Rápido (95 km/h)', carga: '1 tonelada', vitalidad: 40, armadura: 4, alcanceDiario: '250 km', precio: 2500, combustible: 25, caracteristicas: 'Máquina pensante NT4; Mapeador' },

  // --- DESLIZADORES MOTO ---
  { category: 'vehiculo', subtipo: 'deslizadorMoto', nombre: 'Lancety Pegasus-250', nt: 5, velocidad: 'Veloz (400 km/h)', carga: '10 kg', vitalidad: 12, armadura: 0, alcanceDiario: '450 km', precio: 9000, combustible: 18, caracteristicas: 'Máquina pensante NT5; Mapeador' },
  { category: 'vehiculo', subtipo: 'deslizadorMoto', nombre: 'Mestengo Rover', nt: 5, velocidad: 'Veloz (300 km/h)', carga: '10 kg', vitalidad: 12, armadura: 0, alcanceDiario: '500 km', precio: 7000, combustible: 20, caracteristicas: 'Máquina pensante NT5; Mapeador' },
  { category: 'vehiculo', subtipo: 'deslizadorMoto', nombre: 'Planiciclo tulaniano', nt: 5, velocidad: 'Rápido (200 km/h)', carga: '10 kg', vitalidad: 10, armadura: 0, alcanceDiario: '200 km', precio: 4500, combustible: 8, caracteristicas: 'Máquina pensante NT5; Mapeador' },

  // --- DESLIZADORES COCHE ---
  { category: 'vehiculo', subtipo: 'deslizadorCoche', nombre: 'Deslizador Juandaastas', nt: 5, velocidad: 'Veloz (375 km/h)', carga: '20 kg', vitalidad: 14, armadura: 2, alcanceDiario: '350 km', precio: 15000, combustible: 14, caracteristicas: 'Máquina pensante NT5; Mapeador; Escáner facial; Piloto automático' },
  { category: 'vehiculo', subtipo: 'deslizadorCoche', nombre: 'Berlina Lionheart', nt: 5, velocidad: 'Veloz (300 km/h)', carga: '100 kg', vitalidad: 16, armadura: 3, alcanceDiario: '250 km', precio: 7000, combustible: 10, caracteristicas: 'Máquina pensante NT5; Mapeador; Piloto automático: meta 12' },
  { category: 'vehiculo', subtipo: 'deslizadorCoche', nombre: 'Carruaje Lionheart', nt: 5, velocidad: 'Rápido (120 km/h)', carga: '100 kg', vitalidad: 10, armadura: 0, alcanceDiario: '300 km', precio: 2000, combustible: 12, caracteristicas: 'Máquina pensante NT5; Mapeador; Piloto automático: meta 12' },
  { category: 'vehiculo', subtipo: 'deslizadorCoche', nombre: 'Aerocoche Grifo Masood', nt: 5, velocidad: 'Veloz (480 km/h)', carga: '20 kg', vitalidad: 18, armadura: 2, alcanceDiario: '400 km', precio: 10000, combustible: 16, caracteristicas: 'Máquina pensante NT5; Mapeador; Piloto automático: meta 13' },

  // --- MOCHILA PROPULSORA ---
  { category: 'vehiculo', subtipo: 'mochilaPropulsora', nombre: 'Mochila propulsora típica', nt: 6, velocidad: 'Prudente (80 km/h)', carga: '0 kg', vitalidad: 6, armadura: 0, alcanceDiario: '75 km', precio: 7000, combustible: 4, caracteristicas: 'Requiere competencia Mochila Propulsora y habilidad Pilotar' },

  // --- ACUÁTICOS ---
  { category: 'vehiculo', subtipo: 'acuatico', nombre: 'Buque cisterna Tollefsen', nt: 4, velocidad: 'Prudente (50 km/h)', carga: '30000 ton', vitalidad: 70, armadura: 5, alcanceDiario: '3000 km', precio: 200000, combustible: 300, caracteristicas: '30 pasajeros (+2 por ton. de cargo sacrificada)' },
  { category: 'vehiculo', subtipo: 'acuatico', nombre: 'Yate Baosi', nt: 4, velocidad: 'Prudente (80 km/h)', carga: '1 tonelada', vitalidad: 30, armadura: 2, alcanceDiario: '100 km', precio: 42000, combustible: 10, caracteristicas: '8 pasajeros' },
  { category: 'vehiculo', subtipo: 'acuatico', nombre: 'Velero Challat', nt: 2, velocidad: 'Lento (30 km/h)', carga: '20 kg', vitalidad: 14, armadura: 1, alcanceDiario: 'Infinito', precio: 5000, combustible: 0, caracteristicas: '2 pasajeros; viento' },
  { category: 'vehiculo', subtipo: 'acuatico', nombre: 'Barco rueda de paletas Tesla', nt: 3, velocidad: 'Lento (30 km/h)', carga: '20 toneladas', vitalidad: 20, armadura: 1, alcanceDiario: '300 km', precio: 8000, combustible: 30, caracteristicas: '200 pasajeros' },

  // --- AÉREOS ---
  { category: 'vehiculo', subtipo: 'aereo', nombre: 'Dirigible', nt: 3, velocidad: 'Prudente (80 km/h)', carga: '500 kg', vitalidad: 20, armadura: 0, alcanceDiario: '500 km', precio: 5000, combustible: 50, caracteristicas: '60 pasajeros' },
  { category: 'vehiculo', subtipo: 'aereo', nombre: 'Avión de carga', nt: 4, velocidad: 'Veloz (400 km/h)', carga: '10 ton', vitalidad: 30, armadura: 2, alcanceDiario: '1000 km', precio: 15000, combustible: 100, caracteristicas: '4 pasajeros (+2 por ton. de cargo sacrificada)' },
  { category: 'vehiculo', subtipo: 'aereo', nombre: 'Avión de hélice', nt: 4, velocidad: 'Rápido (160 km/h)', carga: '200 kg', vitalidad: 10, armadura: 0, alcanceDiario: '500 km', precio: 7000, combustible: 50, caracteristicas: '2 pasajeros; suele ser marino' },
  { category: 'vehiculo', subtipo: 'aereo', nombre: 'Jet personal', nt: 4, velocidad: 'A Reacción (1000 km/h)', carga: '100 kg', vitalidad: 20, armadura: 2, alcanceDiario: '1000 km', precio: 12000, combustible: 200, caracteristicas: '1 pasajero' },
  { category: 'vehiculo', subtipo: 'aereo', nombre: 'Jumbo (transporte)', nt: 4, velocidad: 'A Reacción (1000 km/h)', carga: '400 ton', vitalidad: 50, armadura: 3, alcanceDiario: '10000 km', precio: 200000, combustible: 2000, caracteristicas: '60 pasajeros (+1 por ton. de cargo sacrificada)' },
  { category: 'vehiculo', subtipo: 'saltador', nombre: 'Buey Volador L.A.', nt: 5, velocidad: 'Veloz (640 km/h)', carga: '20 ton', vitalidad: 24, armadura: 7, alcanceDiario: '3000 km', precio: 15000, combustible: 120, caracteristicas: '4 pasajeros (+2 por ton. de cargo sacrificada)' },
  { category: 'vehiculo', subtipo: 'saltador', nombre: 'Carro de San Pablo', nt: 5, velocidad: 'Veloz (500 km/h)', carga: '20 ton', vitalidad: 20, armadura: 10, alcanceDiario: '5000 km', precio: 15000, combustible: 200, caracteristicas: '3 pasajeros (+2 por ton. de cargo sacrificada)' },
  { category: 'vehiculo', subtipo: 'acelerador', nombre: 'Aeroyate Krusler', nt: 6, velocidad: 'Supersónico (1200 km/h)', carga: '2 ton', vitalidad: 24, armadura: 6, alcanceDiario: '3000 km', precio: 25000, combustible: 120, caracteristicas: '4 pasajeros (+2 por ton. de cargo sacrificada)' },
  { category: 'vehiculo', subtipo: 'acelerador', nombre: 'Corredor Solar Tanic', nt: 6, velocidad: 'Supersónico (1600 km/h)', carga: '500 kg', vitalidad: 20, armadura: 4, alcanceDiario: '2000 km', precio: 40000, combustible: 80, caracteristicas: '2 pasajeros' },
]

// ═══════════════════════════════════════════════════════════════
// CALIDAD DE OBJETOS
// ═══════════════════════════════════════════════════════════════

export const CALIDAD_AJUSTE_PRECIO = [
  { calidad: 'Excelente', ajuste: '+30%', bonus: '+1 meta; +3 Resistencia objeto' },
  { calidad: 'Maestra', ajuste: '+20%', bonus: '+2 Resistencia objeto' },
  { calidad: 'Buena', ajuste: '+10%', bonus: '+1 Resistencia objeto' },
  { calidad: 'Estándar', ajuste: '0%', bonus: '' },
  { calidad: 'Mediocre', ajuste: '-10%', bonus: '' },
  { calidad: 'Deficiente', ajuste: '-20%', bonus: '' },
  { calidad: 'Deteriorada', ajuste: '-30%', bonus: '' },
] as const

// ═══════════════════════════════════════════════════════════════
// HELPER: ALL EQUIPMENT
// ═══════════════════════════════════════════════════════════════

export const ALL_EQUIPMENT: EquipmentItem[] = [
  ...ARMAS_BALAS,
  ...ARMAS_ENERGIA,
  ...ARMAS_CUERPO_A_CUERPO,
  ...MUNICION,
  ...ACCESORIOS_ARMA,
  ...EXPLOSIVOS,
  ...ARMADURAS,
  ...ESCUDOS_MANO,
  ...ESCUDOS_ENERGIA,
  ...EQUIPO_GENERAL,
  ...MONTURAS,
  ...VEHICULOS,
]

// Category labels for UI
export const EQUIPMENT_CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  armaBalas: 'Armas de Balas',
  armaEnergia: 'Armas de Energía',
  armaCuerpoACuerpo: 'Armas Cuerpo a Cuerpo',
  artefactoCuerpoACuerpo: 'Artefactos Cuerpo a Cuerpo',
  municion: 'Munición',
  accesorioArma: 'Accesorios de Arma',
  accesorioCuerpoACuerpo: 'Accesorios Cuerpo a Cuerpo',
  explosivo: 'Explosivos',
  armadura: 'Armaduras',
  escudoMano: 'Escudos de Mano',
  escudoEnergia: 'Escudos de Energía',
  comunicacion: 'Comunicaciones',
  energia: 'Energía',
  entretenimiento: 'Entretenimiento',
  moda: 'Moda',
  iluminacion: 'Iluminación',
  medicina: 'Medicina',
  droga: 'Drogas',
  veneno: 'Venenos',
  contencion: 'Contención',
  seguridad: 'Seguridad',
  servicio: 'Servicios',
  herramienta: 'Herramientas',
  maquinaPensante: 'Máquinas Pensantes',
  dispositivo: 'Dispositivos',
  montura: 'Monturas',
  vehiculo: 'Vehículos',
}
