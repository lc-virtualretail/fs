import Dexie, { type EntityTable } from 'dexie'
import type { Character } from '@/types/character'

const db = new Dexie('FadingSunsDB') as Dexie & {
  characters: EntityTable<Character, 'id'>
}

db.version(1).stores({
  characters: 'id, nombre, clase, faccion, updatedAt',
})

export { db }
