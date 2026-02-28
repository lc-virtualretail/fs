import type { SkillDefinition } from '@/types/rules'

export const SKILLS: SkillDefinition[] = [
  { key: 'academia', nombre: 'Academia', valorBase: 3, restringida: false, caracteristicasAsociadas: ['inteligencia', 'percepcion'] },
  { key: 'alquimia', nombre: 'Alquimia', valorBase: 0, restringida: true, caracteristicasAsociadas: ['inteligencia', 'percepcion'] },
  { key: 'artes', nombre: 'Artes', valorBase: 3, restringida: false, caracteristicasAsociadas: ['intuicion', 'presencia'] },
  { key: 'charlataneria', nombre: 'Charlatanería', valorBase: 3, restringida: false, caracteristicasAsociadas: ['presencia', 'voluntad'] },
  { key: 'conducir', nombre: 'Conducir', valorBase: 3, restringida: false, caracteristicasAsociadas: ['destreza', 'percepcion'] },
  { key: 'cuerpoACuerpo', nombre: 'Cuerpo a Cuerpo', valorBase: 3, restringida: false, caracteristicasAsociadas: ['fuerza', 'destreza'] },
  { key: 'curar', nombre: 'Curar', valorBase: 3, restringida: false, caracteristicasAsociadas: ['inteligencia', 'destreza'] },
  { key: 'disfraz', nombre: 'Disfraz', valorBase: 3, restringida: false, caracteristicasAsociadas: ['intuicion', 'destreza'] },
  { key: 'disparar', nombre: 'Disparar', valorBase: 3, restringida: false, caracteristicasAsociadas: ['destreza', 'percepcion'] },
  { key: 'empatia', nombre: 'Empatía', valorBase: 3, restringida: false, caracteristicasAsociadas: ['intuicion', 'percepcion'] },
  { key: 'encanto', nombre: 'Encanto', valorBase: 3, restringida: false, caracteristicasAsociadas: ['presencia', 'fe'] },
  { key: 'impresionar', nombre: 'Impresionar', valorBase: 3, restringida: false, caracteristicasAsociadas: ['presencia', 'fuerza'] },
  { key: 'interfaz', nombre: 'Interfaz', valorBase: 0, restringida: true, caracteristicasAsociadas: ['inteligencia', 'percepcion'] },
  { key: 'introspeccion', nombre: 'Introspección', valorBase: 3, restringida: false, caracteristicasAsociadas: ['voluntad', 'intuicion'] },
  { key: 'intrusion', nombre: 'Intrusión', valorBase: 3, restringida: false, caracteristicasAsociadas: ['destreza', 'percepcion'] },
  { key: 'pelea', nombre: 'Pelea', valorBase: 3, restringida: false, caracteristicasAsociadas: ['fuerza', 'destreza'] },
  { key: 'observar', nombre: 'Observar', valorBase: 3, restringida: false, caracteristicasAsociadas: ['percepcion', 'intuicion'] },
  { key: 'oficios', nombre: 'Oficios', valorBase: 3, restringida: false, caracteristicasAsociadas: ['destreza', 'inteligencia'] },
  { key: 'pilotar', nombre: 'Pilotar', valorBase: 0, restringida: true, caracteristicasAsociadas: ['destreza', 'percepcion'] },
  { key: 'prestidigitacion', nombre: 'Prestidigitación', valorBase: 3, restringida: false, caracteristicasAsociadas: ['destreza', 'intuicion'] },
  { key: 'representar', nombre: 'Representar', valorBase: 3, restringida: false, caracteristicasAsociadas: ['presencia', 'intuicion'] },
  { key: 'sigilo', nombre: 'Sigilo', valorBase: 3, restringida: false, caracteristicasAsociadas: ['destreza', 'percepcion'] },
  { key: 'supervivencia', nombre: 'Supervivencia', valorBase: 3, restringida: false, caracteristicasAsociadas: ['constitucion', 'percepcion'] },
  { key: 'tecnorredencion', nombre: 'Tecnorredención', valorBase: 3, restringida: false, caracteristicasAsociadas: ['inteligencia', 'intuicion'] },
  { key: 'tratoConAnimales', nombre: 'Trato con Animales', valorBase: 3, restringida: false, caracteristicasAsociadas: ['intuicion', 'voluntad'] },
  { key: 'vigor', nombre: 'Vigor', valorBase: 3, restringida: false, caracteristicasAsociadas: ['fuerza', 'destreza', 'constitucion'] },
]

export function getSkillByKey(key: string): SkillDefinition | undefined {
  return SKILLS.find(s => s.key === key)
}
