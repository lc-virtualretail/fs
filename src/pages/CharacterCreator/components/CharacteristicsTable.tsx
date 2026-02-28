import type { Characteristics, CharacteristicKey } from '@/types/character'
import { CHARACTERISTIC_CATEGORIES } from '@/data/characteristics'
import { getCharacteristicMeta } from '@/data/characteristics'

interface Props {
  current: Characteristics
  previous?: Characteristics
  maxValue?: number
}

export function CharacteristicsTable({ current, previous, maxValue = 8 }: Props) {
  function cellClass(key: CharacteristicKey): string {
    const val = current[key]
    if (val > maxValue) return 'over-max'
    if (previous && val !== previous[key]) return 'changed'
    return ''
  }

  return (
    <table className="chars-table">
      <tbody>
        {CHARACTERISTIC_CATEGORIES.map(cat => (
          <tr key={cat.id}>
            <td className="cat-header">{cat.nombre}</td>
            {cat.keys.map(key => {
              const meta = getCharacteristicMeta(key)
              return (
                <td key={key} className={cellClass(key)}>
                  <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{meta?.abreviatura}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{current[key]}</div>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
