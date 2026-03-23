import React, { useState, useMemo } from 'react'
import type { InventoryItem, ItemCalidad } from '@/types/character'
import {
  ALL_EQUIPMENT,
  EQUIPMENT_CATEGORY_LABELS,
  type EquipmentItem as CatalogItem,
  type EquipmentCategory,
  type ItemSize,
} from '@/data/equipment'

interface AddEquipmentModalProps {
  open: boolean
  onClose: () => void
  onAdd: (item: InventoryItem) => void
}

// ─── Grouped categories for the filter pills ───
type GroupKey =
  | 'armasBalas'
  | 'armasEnergia'
  | 'cuerpoACuerpo'
  | 'armaduras'
  | 'escudos'
  | 'municion'
  | 'explosivos'
  | 'equipoGeneral'
  | 'monturas'
  | 'vehiculos'

interface CategoryGroup {
  key: GroupKey
  label: string
  categories: EquipmentCategory[]
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  { key: 'armasBalas', label: 'Armas de Balas', categories: ['armaBalas'] },
  { key: 'armasEnergia', label: 'Armas de Energía', categories: ['armaEnergia'] },
  { key: 'cuerpoACuerpo', label: 'Cuerpo a Cuerpo', categories: ['armaCuerpoACuerpo', 'artefactoCuerpoACuerpo'] },
  { key: 'armaduras', label: 'Armaduras', categories: ['armadura'] },
  { key: 'escudos', label: 'Escudos', categories: ['escudoMano', 'escudoEnergia'] },
  { key: 'municion', label: 'Munición', categories: ['municion', 'accesorioArma', 'accesorioCuerpoACuerpo'] },
  { key: 'explosivos', label: 'Explosivos', categories: ['explosivo'] },
  {
    key: 'equipoGeneral',
    label: 'Equipo General',
    categories: [
      'comunicacion', 'energia', 'entretenimiento', 'moda', 'iluminacion',
      'medicina', 'droga', 'veneno', 'contencion', 'seguridad', 'servicio',
      'herramienta', 'maquinaPensante', 'dispositivo',
    ],
  },
  { key: 'monturas', label: 'Monturas', categories: ['montura'] },
  { key: 'vehiculos', label: 'Vehículos', categories: ['vehiculo'] },
]

const CALIDAD_OPTIONS: { value: ItemCalidad; label: string }[] = [
  { value: 'excelente', label: 'Excelente' },
  { value: 'maestra', label: 'Maestra' },
  { value: 'buena', label: 'Buena' },
  { value: 'estandar', label: 'Estándar' },
  { value: 'mediocre', label: 'Mediocre' },
  { value: 'deficiente', label: 'Deficiente' },
  { value: 'deteriorada', label: 'Deteriorada' },
]

const SIZE_OPTIONS: ItemSize[] = ['XXS', 'XS', 'S', 'M', 'L', 'XL']

// Keys to exclude when building detalles from catalog item
const EXCLUDED_DETAIL_KEYS = new Set(['category'])

/** Human-readable labels for detail keys */
const DETAIL_LABELS: Record<string, string> = {
  subtype: 'Subtipo',
  calibre: 'Calibre',
  nt: 'NT',
  meta: 'Meta',
  dano: 'Daño',
  fuerza: 'Fuerza',
  alcCorto: 'Alc. Corto',
  alcLargo: 'Alc. Largo',
  cdt: 'CdT',
  municion: 'Munición',
  tamano: 'Tamaño',
  agora: 'Ágora',
  precio: 'Precio',
  caracteristicas: 'Características',
  alimentacion: 'Alimentación',
  tipoEnergia: 'Tipo Energía',
  precioPorDisparo: 'Precio/Disparo',
  efecto: 'Efecto',
  resistencia: 'Resistencia',
  escudoCompatible: 'Escudo Compatible',
  destreza: 'Destreza',
  vigor: 'Vigor',
  umbralMin: 'Umbral Mín.',
  umbralMax: 'Umbral Máx.',
  activaciones: 'Activaciones',
  agotamiento: 'Agotamiento',
  distorsion: 'Distorsión',
  velocidad: 'Velocidad',
  carga: 'Carga',
  vitalidad: 'Vitalidad',
  armadura: 'Armadura',
  alcanceDiario: 'Alcance Diario',
  combustible: 'Combustible',
  comida: 'Comida',
  ataques: 'Ataques',
  subtipo: 'Subtipo',
}

function formatDetailValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.length === 0 ? '—' : value.join(', ')
  }
  if (value === '' || value === null || value === undefined) return '—'
  return String(value)
}

function getNt(item: CatalogItem): string {
  if ('nt' in item && item.nt !== undefined) return String(item.nt)
  return '—'
}

function getPrecio(item: CatalogItem): string {
  if ('precio' in item && item.precio !== undefined) return String(item.precio) + ' F'
  if ('precioPorDisparo' in item && item.precioPorDisparo !== undefined) return String(item.precioPorDisparo) + ' F/disp.'
  return '—'
}

export default function AddEquipmentModal({ open, onClose, onAdd }: AddEquipmentModalProps) {
  const [tab, setTab] = useState<'catalogo' | 'personalizado'>('catalogo')
  const [selectedGroup, setSelectedGroup] = useState<GroupKey>('armasBalas')
  const [searchText, setSearchText] = useState('')
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [calidad, setCalidad] = useState<ItemCalidad>('estandar')

  // Custom item form state
  const [customNombre, setCustomNombre] = useState('')
  const [customCategory, setCustomCategory] = useState<EquipmentCategory>('herramienta')
  const [customNt, setCustomNt] = useState(0)
  const [customTamano, setCustomTamano] = useState<ItemSize>('M')
  const [customPrecio, setCustomPrecio] = useState(0)
  const [customNotas, setCustomNotas] = useState('')
  const [customCalidad, setCustomCalidad] = useState<ItemCalidad>('estandar')

  // Build filtered list
  const activeGroup = CATEGORY_GROUPS.find(g => g.key === selectedGroup)
  const filteredItems = useMemo(() => {
    if (!activeGroup) return []
    const cats = new Set(activeGroup.categories)
    let items = ALL_EQUIPMENT.filter(it => cats.has(it.category as EquipmentCategory))
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase()
      items = items.filter(it => it.nombre.toLowerCase().includes(q))
    }
    return items
  }, [activeGroup, searchText])

  if (!open) return null

  function handleAddCatalogItem(item: CatalogItem) {
    const detalles: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(item)) {
      if (!EXCLUDED_DETAIL_KEYS.has(k)) {
        detalles[k] = v
      }
    }

    const municion = 'municion' in item && typeof item.municion === 'number' ? item.municion : undefined

    const inventoryItem: InventoryItem = {
      id: crypto.randomUUID(),
      sourceId: item.nombre,
      category: item.category,
      nombre: item.nombre,
      detalles,
      equipado: false,
      calidad,
      ...(municion !== undefined && {
        cargaActual: municion,
        cargaMaxima: municion,
        cargasExtra: 0,
      }),
    }
    onAdd(inventoryItem)
    onClose()
  }

  function handleAddCustomItem() {
    if (!customNombre.trim()) return
    const inventoryItem: InventoryItem = {
      id: crypto.randomUUID(),
      category: customCategory,
      nombre: customNombre.trim(),
      detalles: {
        nt: customNt,
        tamano: customTamano,
        precio: customPrecio,
      },
      equipado: false,
      calidad: customCalidad,
      custom: true,
      notas: customNotas.trim() || undefined,
    }
    onAdd(inventoryItem)
    onClose()
  }

  return (
    <>
      <style>{`
        .add-equip-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--space-md);
        }
        .add-equip-modal {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          max-width: 700px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          position: relative;
        }
        .add-equip-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-md);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          background: var(--color-bg-card);
          z-index: 2;
        }
        .add-equip-header h2 {
          margin: 0;
          font-size: 1.1rem;
          color: var(--color-text);
        }
        .add-equip-close {
          background: none;
          border: none;
          color: var(--color-text-muted);
          font-size: 1.4rem;
          cursor: pointer;
          padding: 4px 8px;
          line-height: 1;
          border-radius: var(--radius-sm);
        }
        .add-equip-close:hover {
          color: var(--color-text);
          background: var(--color-bg-surface);
        }
        .add-equip-tabs {
          display: flex;
          border-bottom: 1px solid var(--color-border);
        }
        .add-equip-tab {
          flex: 1;
          padding: var(--space-sm) var(--space-md);
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          font-size: 0.95rem;
          border-bottom: 2px solid transparent;
          transition: color 0.15s, border-color 0.15s;
        }
        .add-equip-tab:hover {
          color: var(--color-text);
        }
        .add-equip-tab.active {
          color: var(--color-accent);
          border-bottom-color: var(--color-accent);
        }
        .add-equip-body {
          padding: var(--space-md);
        }

        /* Category pills */
        .add-equip-pills {
          display: flex;
          gap: var(--space-xs);
          overflow-x: auto;
          padding-bottom: var(--space-xs);
          margin-bottom: var(--space-sm);
          scrollbar-width: thin;
        }
        .add-equip-pill {
          white-space: nowrap;
          padding: 4px 12px;
          border-radius: 999px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-surface);
          color: var(--color-text-muted);
          cursor: pointer;
          font-size: 0.82rem;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          flex-shrink: 0;
        }
        .add-equip-pill:hover {
          border-color: var(--color-accent);
          color: var(--color-text);
        }
        .add-equip-pill.active {
          background: var(--color-accent);
          color: #fff;
          border-color: var(--color-accent);
        }

        /* Search */
        .add-equip-search {
          width: 100%;
          padding: var(--space-xs) var(--space-sm);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: var(--color-bg-surface);
          color: var(--color-text);
          font-size: 0.9rem;
          margin-bottom: var(--space-sm);
        }
        .add-equip-search::placeholder {
          color: var(--color-text-muted);
        }

        /* Item list */
        .add-equip-list {
          max-height: 400px;
          overflow-y: auto;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
        }
        .add-equip-item {
          padding: var(--space-xs) var(--space-sm);
          cursor: pointer;
          border-bottom: 1px solid var(--color-border);
          transition: background 0.1s;
        }
        .add-equip-item:last-child {
          border-bottom: none;
        }
        .add-equip-item:hover {
          background: var(--color-bg-surface);
        }
        .add-equip-item-row {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .add-equip-item-name {
          flex: 1;
          color: var(--color-text);
          font-size: 0.9rem;
        }
        .add-equip-badge {
          font-size: 0.75rem;
          padding: 1px 6px;
          border-radius: var(--radius-sm);
          background: var(--color-bg-surface);
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          white-space: nowrap;
        }
        .add-equip-badge-nt {
          color: var(--color-accent);
          border-color: var(--color-accent);
        }
        .add-equip-price {
          font-size: 0.82rem;
          color: var(--color-text-muted);
          white-space: nowrap;
        }

        /* Expanded item details */
        .add-equip-details {
          margin-top: var(--space-xs);
          padding: var(--space-sm);
          background: var(--color-bg);
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
        }
        .add-equip-detail-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 2px var(--space-md);
          font-size: 0.82rem;
          margin-bottom: var(--space-sm);
        }
        .add-equip-detail-key {
          color: var(--color-text-muted);
          white-space: nowrap;
        }
        .add-equip-detail-val {
          color: var(--color-text);
        }
        .add-equip-actions {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-top: var(--space-sm);
        }
        .add-equip-actions label {
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }
        .add-equip-actions select {
          padding: 2px 6px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: var(--color-bg-surface);
          color: var(--color-text);
          font-size: 0.82rem;
        }
        .add-equip-btn {
          margin-left: auto;
          padding: var(--space-xs) var(--space-md);
          background: var(--color-accent);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 0.85rem;
          transition: background 0.15s;
        }
        .add-equip-btn:hover {
          background: var(--color-accent-hover);
        }

        /* Custom form */
        .add-equip-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        .add-equip-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .add-equip-field label {
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }
        .add-equip-field input,
        .add-equip-field select,
        .add-equip-field textarea {
          padding: var(--space-xs) var(--space-sm);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: var(--color-bg-surface);
          color: var(--color-text);
          font-size: 0.9rem;
        }
        .add-equip-field textarea {
          min-height: 60px;
          resize: vertical;
          font-family: inherit;
        }
        .add-equip-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-sm);
        }
        .add-equip-form-submit {
          align-self: flex-end;
          padding: var(--space-xs) var(--space-lg);
          background: var(--color-accent);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 0.9rem;
          margin-top: var(--space-sm);
          transition: background 0.15s;
        }
        .add-equip-form-submit:hover {
          background: var(--color-accent-hover);
        }
        .add-equip-form-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .add-equip-empty {
          padding: var(--space-lg);
          text-align: center;
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }
      `}</style>

      <div className="add-equip-overlay" onClick={onClose}>
        <div className="add-equip-modal" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="add-equip-header">
            <h2>Añadir Equipo</h2>
            <button className="add-equip-close" onClick={onClose} title="Cerrar">&times;</button>
          </div>

          {/* Tab bar */}
          <div className="add-equip-tabs">
            <button
              className={`add-equip-tab${tab === 'catalogo' ? ' active' : ''}`}
              onClick={() => setTab('catalogo')}
            >
              Catálogo
            </button>
            <button
              className={`add-equip-tab${tab === 'personalizado' ? ' active' : ''}`}
              onClick={() => setTab('personalizado')}
            >
              Personalizado
            </button>
          </div>

          <div className="add-equip-body">
            {tab === 'catalogo' ? (
              <>
                {/* Category pills */}
                <div className="add-equip-pills">
                  {CATEGORY_GROUPS.map(g => (
                    <button
                      key={g.key}
                      className={`add-equip-pill${selectedGroup === g.key ? ' active' : ''}`}
                      onClick={() => { setSelectedGroup(g.key); setExpandedItem(null) }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <input
                  className="add-equip-search"
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchText}
                  onChange={e => { setSearchText(e.target.value); setExpandedItem(null) }}
                />

                {/* Item list */}
                <div className="add-equip-list">
                  {filteredItems.length === 0 ? (
                    <div className="add-equip-empty">No se encontraron objetos.</div>
                  ) : (
                    filteredItems.map((item, idx) => {
                      const itemKey = `${item.category}-${item.nombre}-${idx}`
                      const isExpanded = expandedItem === itemKey
                      return (
                        <div key={itemKey} className="add-equip-item">
                          <div
                            className="add-equip-item-row"
                            onClick={() => setExpandedItem(isExpanded ? null : itemKey)}
                          >
                            <span className="add-equip-item-name">{item.nombre}</span>
                            <span className="add-equip-badge add-equip-badge-nt">NT {getNt(item)}</span>
                            <span className="add-equip-price">{getPrecio(item)}</span>
                          </div>
                          {isExpanded && (
                            <div className="add-equip-details">
                              <div className="add-equip-detail-grid">
                                {Object.entries(item)
                                  .filter(([k]) => k !== 'category' && k !== 'nombre')
                                  .map(([k, v]) => (
                                    <React.Fragment key={k}>
                                      <span className="add-equip-detail-key">
                                        {DETAIL_LABELS[k] ?? k}:
                                      </span>
                                      <span className="add-equip-detail-val">
                                        {formatDetailValue(v)}
                                      </span>
                                    </React.Fragment>
                                  ))}
                              </div>
                              <div className="add-equip-actions">
                                <label>Calidad:</label>
                                <select
                                  value={calidad}
                                  onChange={e => setCalidad(e.target.value as ItemCalidad)}
                                >
                                  {CALIDAD_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                  ))}
                                </select>
                                <button
                                  className="add-equip-btn"
                                  onClick={() => handleAddCatalogItem(item)}
                                >
                                  Añadir
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </>
            ) : (
              /* Custom item form */
              <div className="add-equip-form">
                <div className="add-equip-field">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={customNombre}
                    onChange={e => setCustomNombre(e.target.value)}
                    placeholder="Nombre del objeto"
                  />
                </div>

                <div className="add-equip-form-row">
                  <div className="add-equip-field">
                    <label>Categoría</label>
                    <select
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value as EquipmentCategory)}
                    >
                      {(Object.entries(EQUIPMENT_CATEGORY_LABELS) as [EquipmentCategory, string][]).map(
                        ([val, lbl]) => (
                          <option key={val} value={val}>{lbl}</option>
                        ),
                      )}
                    </select>
                  </div>
                  <div className="add-equip-field">
                    <label>NT</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={customNt}
                      onChange={e => setCustomNt(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="add-equip-form-row">
                  <div className="add-equip-field">
                    <label>Tamaño</label>
                    <select
                      value={customTamano}
                      onChange={e => setCustomTamano(e.target.value as ItemSize)}
                    >
                      {SIZE_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="add-equip-field">
                    <label>Precio (F)</label>
                    <input
                      type="number"
                      min={0}
                      value={customPrecio}
                      onChange={e => setCustomPrecio(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="add-equip-field">
                  <label>Calidad</label>
                  <select
                    value={customCalidad}
                    onChange={e => setCustomCalidad(e.target.value as ItemCalidad)}
                  >
                    {CALIDAD_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className="add-equip-field">
                  <label>Notas</label>
                  <textarea
                    value={customNotas}
                    onChange={e => setCustomNotas(e.target.value)}
                    placeholder="Descripción, efectos, etc."
                  />
                </div>

                <button
                  className="add-equip-form-submit"
                  disabled={!customNombre.trim()}
                  onClick={handleAddCustomItem}
                >
                  Añadir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
