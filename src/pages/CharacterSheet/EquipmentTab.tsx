import { useState, useRef, useCallback, useEffect } from 'react'
import {
  countTecgnosisLoad,
  isTecgnosisOverloaded,
  getShieldCargoLimit,
  calcEquippedCargoUnits,
  isArmorShieldCompatible,
  qualityResistanceBonus,
  qualityMetaBonus,
  calcStrengthPenalty,
} from '@/engine/inventory'
import type { Character, InventoryItem, Recurso } from '@/types/character'
import AddEquipmentModal from './AddEquipmentModal'

interface EquipmentTabProps {
  character: Character
  onUpdate: (updates: Partial<Character>) => Promise<void>
}

const PERIODO_OPTIONS: Recurso['periodo'][] = ['diario', 'semanal', 'mensual', 'anual']

const emptyRecurso = (): Omit<Recurso, 'notas'> & { notas: string } => ({
  nombre: '',
  ubicacion: '',
  ganancias: 0,
  periodo: 'mensual' as const,
  notas: '',
})

const CALIDAD_COLORS: Record<string, string> = {
  excelente: '#ffd700',
  maestra: '#c0c0c0',
  buena: '#cd7f32',
  estandar: 'var(--color-text-muted)',
  mediocre: '#888',
  deficiente: '#666',
  deteriorada: '#555',
}

const CALIDAD_LABELS: Record<string, string> = {
  excelente: 'Excelente',
  maestra: 'Maestra',
  buena: 'Buena',
  estandar: 'Estándar',
  mediocre: 'Mediocre',
  deficiente: 'Deficiente',
  deteriorada: 'Deteriorada',
}

const WEAPON_CATEGORIES = ['armaBalas', 'armaEnergia', 'armaCuerpoACuerpo', 'artefactoCuerpoACuerpo']

function groupByCategory(items: InventoryItem[]) {
  const armor = items.filter(i => i.category === 'armadura')
  const shields = items.filter(i => i.category === 'escudoEnergia' || i.category === 'escudoMano')
  const weapons = items.filter(i => WEAPON_CATEGORIES.includes(i.category))
  const other = items.filter(i =>
    i.category !== 'armadura' &&
    i.category !== 'escudoEnergia' &&
    i.category !== 'escudoMano' &&
    !WEAPON_CATEGORIES.includes(i.category)
  )
  return { armor, shields, weapons, other }
}

// ─── Inventory Section Component ───

function InventorySection({
  title, items, character, onUpdate, inventario, mode,
}: {
  title: string
  items: InventoryItem[]
  character: Character
  onUpdate: (updates: Partial<Character>) => Promise<void>
  inventario: InventoryItem[]
  mode: 'equipped' | 'stored'
}) {
  const { armor, shields, weapons, other } = groupByCategory(items)

  // ─── Equip restriction checks ───

  function getEquipWarnings(item: InventoryItem): string[] {
    const warnings: string[] = []
    const equippedEnergyShield = inventario.find(i => i.equipado && i.category === 'escudoEnergia' && i.id !== item.id)
    const equippedHandShield = inventario.find(i => i.equipado && i.category === 'escudoMano' && i.id !== item.id)
    const equippedArmor = inventario.find(i => i.equipado && i.category === 'armadura' && i.id !== item.id)

    // Hand shield + energy shield = incompatible
    if (item.category === 'escudoMano' && equippedEnergyShield) {
      warnings.push('Escudo de mano impide que el escudo de energía se active')
    }
    if (item.category === 'escudoEnergia' && equippedHandShield) {
      warnings.push('Un escudo de mano equipado impide que el escudo de energía se active')
    }

    // Armor-energy shield compatibility
    if (item.category === 'armadura' && equippedEnergyShield) {
      const compat = (item.detalles.escudoCompatible as string) ?? ''
      if (!isArmorShieldCompatible(compat, equippedEnergyShield.nombre)) {
        warnings.push(`Armadura incompatible con ${equippedEnergyShield.nombre} — el escudo no se activará (requiere compat. ${equippedEnergyShield.nombre.includes('batalla') ? 'B' : equippedEnergyShield.nombre.includes('asalto') ? 'A o B' : 'E, A o B'}, armadura tiene ${compat || 'ninguna'})`)
      }
    }
    if (item.category === 'escudoEnergia' && equippedArmor) {
      const compat = (equippedArmor.detalles.escudoCompatible as string) ?? ''
      if (!isArmorShieldCompatible(compat, item.nombre)) {
        warnings.push(`${equippedArmor.nombre} es incompatible con este escudo — no se activará (armadura compat: ${compat || 'ninguna'})`)
      }
    }

    return warnings
  }

  function handleEquip(id: string) {
    const item = inventario.find(i => i.id === id)
    if (!item) return
    const warnings = getEquipWarnings(item)
    if (warnings.length > 0) {
      const msg = '⚠ Advertencia:\n\n' + warnings.join('\n') + '\n\n¿Equipar de todas formas?'
      if (!window.confirm(msg)) return
    }
    updateItem(id, { equipado: true })
  }

  function updateItem(id: string, patch: Partial<InventoryItem>) {
    const newInv = inventario.map(i => i.id === id ? { ...i, ...patch } : i)
    // If equipping armor, unequip other armor; same for energy shield and hand shield
    if (patch.equipado === true) {
      const item = inventario.find(i => i.id === id)
      const cat = item?.category
      if (cat === 'armadura' || cat === 'escudoEnergia' || cat === 'escudoMano') {
        for (let j = 0; j < newInv.length; j++) {
          const cur = newInv[j]!
          // Only 1 armor, 1 energy shield, 1 hand shield at a time
          if (cur.category === cat && cur.id !== id) {
            newInv[j] = { ...cur, equipado: false }
          }
        }
      }
    }
    const updates: Partial<Character> = { inventario: newInv }
    // Update armor resistance if armor changed
    const armorChanged = inventario.find(i => i.id === id)?.category === 'armadura'
    if (armorChanged) {
      const eqArmor = newInv.find(i => i.equipado && i.category === 'armadura')
      const baseR = eqArmor ? ((eqArmor.detalles.resistencia as number) ?? 0) : 0
      const qBonus = eqArmor ? qualityResistanceBonus(eqArmor.calidad) + qualityMetaBonus(eqArmor.calidad) : 0
      updates.resistencias = { ...character.resistencias, corporal: baseR + qBonus }
    }
    void onUpdate(updates)
  }

  function removeItem(id: string) {
    const newInv = inventario.filter(i => i.id !== id)
    const removedItem = inventario.find(i => i.id === id)
    const updates: Partial<Character> = { inventario: newInv }
    if (removedItem?.category === 'armadura' && removedItem.equipado) {
      const nextArmor = newInv.find(i => i.equipado && i.category === 'armadura')
      const baseR = nextArmor ? ((nextArmor.detalles.resistencia as number) ?? 0) : 0
      const qBonus = nextArmor ? qualityResistanceBonus(nextArmor.calidad) + qualityMetaBonus(nextArmor.calidad) : 0
      updates.resistencias = { ...character.resistencias, corporal: baseR + qBonus }
    }
    void onUpdate(updates)
  }

  function fireWeapon(id: string) {
    const item = inventario.find(i => i.id === id)
    if (!item || !item.cargaActual || item.cargaActual <= 0) return
    updateItem(id, { cargaActual: Math.max(0, item.cargaActual - 1) })
  }

  function reloadWeapon(id: string) {
    const item = inventario.find(i => i.id === id)
    if (!item || !item.cargasExtra || item.cargasExtra <= 0) return
    updateItem(id, {
      cargaActual: item.cargaMaxima ?? 0,
      cargasExtra: item.cargasExtra - 1,
    })
  }

  function addExtraCharge(id: string) {
    const item = inventario.find(i => i.id === id)
    if (!item) return
    updateItem(id, { cargasExtra: (item.cargasExtra ?? 0) + 1 })
  }

  if (items.length === 0) {
    return (
      <section className="sheet-section">
        <h2>{title}</h2>
        <p className="equip-empty">Nada {mode === 'equipped' ? 'equipado' : 'almacenado'}.</p>
      </section>
    )
  }

  return (
    <section className="sheet-section">
      <h2>{title}</h2>

      {armor.length > 0 && (
        <div className="inv-group">
          <h3 className="inv-group-title">Armadura</h3>
          {armor.map(item => {
            const r = (item.detalles.resistencia as number) ?? 0
            const qr = qualityResistanceBonus(item.calidad) + qualityMetaBonus(item.calidad)
            const protections = ((item.detalles.caracteristicas as string[]) ?? [])
              .filter((s: string) => s.startsWith('Protección'))
            const activeWarnings = item.equipado ? getEquipWarnings(item) : []
            return (
              <div key={item.id} className={`inv-card ${activeWarnings.length > 0 ? 'inv-card-warn' : ''}`}>
                <div className="inv-card-header">
                  <span className="inv-name">{item.nombre}</span>
                  <CalidadBadge calidad={item.calidad} />
                  {(item.detalles.nt as number) >= 5 && <span className="nt-badge">NT{item.detalles.nt as number}</span>}
                </div>
                <div className="inv-stats">
                  R.Corporal: {r + qr}{qr > 0 ? ` (${r}+${qr})` : ''}
                  {item.detalles.escudoCompatible ? <span> · Escudo: {String(item.detalles.escudoCompatible)}</span> : null}
                  {Number(item.detalles.destreza) ? <span> · Des: {Number(item.detalles.destreza)}</span> : null}
                  {Number(item.detalles.vigor) ? <span> · Vig: {Number(item.detalles.vigor)}</span> : null}
                </div>
                {protections.length > 0 && (
                  <div className="inv-protections">{protections.join('; ')}</div>
                )}
                {activeWarnings.map((w, wi) => (
                  <div key={wi} className="inv-warning">{w}</div>
                ))}
                <div className="inv-actions">
                  <button className="inv-btn" onClick={() => item.equipado ? updateItem(item.id, { equipado: false }) : handleEquip(item.id)}>
                    {item.equipado ? 'Desequipar' : 'Equipar'}
                  </button>
                  <button className="inv-btn inv-btn-danger" onClick={() => removeItem(item.id)}>Eliminar</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {shields.length > 0 && (
        <div className="inv-group">
          <h3 className="inv-group-title">Escudos</h3>
          {shields.map(item => {
            const isEnergy = item.category === 'escudoEnergia'
            const activeWarnings = item.equipado ? getEquipWarnings(item) : []
            return (
              <div key={item.id} className={`inv-card ${activeWarnings.length > 0 ? 'inv-card-warn' : ''}`}>
                <div className="inv-card-header">
                  <span className="inv-name">{item.nombre}</span>
                  <CalidadBadge calidad={item.calidad} />
                </div>
                {isEnergy && (
                  <div className="inv-stats">
                    Umbrales: {Number(item.detalles.umbralMin)}-{Number(item.detalles.umbralMax)}
                    {' · '}Activaciones: {Number(item.detalles.activaciones)}
                    {' · '}Agotamiento: {Number(item.detalles.agotamiento)}
                    {item.detalles.distorsion ? <span> · Distorsión: {String(item.detalles.distorsion)}</span> : null}
                  </div>
                )}
                {!isEnergy && (
                  <div className="inv-stats">
                    R: {String(item.detalles.resistencia)}
                    {item.detalles.dano ? <span> · Daño: {String(item.detalles.dano)}</span> : null}
                  </div>
                )}
                {activeWarnings.map((w, wi) => (
                  <div key={wi} className="inv-warning">{w}</div>
                ))}
                <div className="inv-actions">
                  <button className="inv-btn" onClick={() => item.equipado ? updateItem(item.id, { equipado: false }) : handleEquip(item.id)}>
                    {item.equipado ? 'Desequipar' : 'Equipar'}
                  </button>
                  <button className="inv-btn inv-btn-danger" onClick={() => removeItem(item.id)}>Eliminar</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {weapons.length > 0 && (
        <div className="inv-group">
          <h3 className="inv-group-title">Armas</h3>
          {weapons.map(item => {
            const fue = (item.detalles.fuerza as number) ?? 0
            const penalty = calcStrengthPenalty(fue, character.caracteristicas.fuerza)
            const hasMunicion = item.cargaMaxima != null && item.cargaMaxima > 0
            return (
              <div key={item.id} className="inv-card">
                <div className="inv-card-header">
                  <span className="inv-name">{item.nombre}</span>
                  <CalidadBadge calidad={item.calidad} />
                  {(item.detalles.nt as number) >= 5 && <span className="nt-badge">NT{item.detalles.nt as number}</span>}
                </div>
                <div className="inv-stats">
                  {item.detalles.meta != null && <span>Meta: {String(item.detalles.meta)} · </span>}
                  Daño: {String(item.detalles.dano ?? '?')}
                  {fue > 0 && <span> · Fue: {fue}{penalty > 0 && <span className="penalty"> (meta -{penalty})</span>}</span>}
                  {item.detalles.alcCorto ? <span> · Alc: {String(item.detalles.alcCorto)}/{String(item.detalles.alcLargo)}</span> : null}
                  {item.detalles.cdt ? <span> · CdT: {String(item.detalles.cdt)}</span> : null}
                </div>
                {((item.detalles.caracteristicas as string[])?.length ?? 0) > 0 && (
                  <div className="inv-protections">
                    {(item.detalles.caracteristicas as string[]).join(', ')}
                  </div>
                )}
                {hasMunicion && mode === 'equipped' && (
                  <div className="inv-ammo">
                    <div className="ammo-bar">
                      <div
                        className="ammo-fill"
                        style={{ width: `${Math.round(((item.cargaActual ?? 0) / (item.cargaMaxima ?? 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="ammo-text">
                      Munición: {item.cargaActual ?? 0}/{item.cargaMaxima}
                      {' · '}Cargadores: {item.cargasExtra ?? 0}
                    </span>
                    <div className="ammo-actions">
                      <button
                        className="inv-btn inv-btn-sm"
                        onClick={() => fireWeapon(item.id)}
                        disabled={(item.cargaActual ?? 0) <= 0}
                      >Disparar</button>
                      <button
                        className="inv-btn inv-btn-sm"
                        onClick={() => reloadWeapon(item.id)}
                        disabled={(item.cargasExtra ?? 0) <= 0}
                      >Recargar</button>
                      <button
                        className="inv-btn inv-btn-sm"
                        onClick={() => addExtraCharge(item.id)}
                      >+ Cargador</button>
                    </div>
                  </div>
                )}
                <div className="inv-actions">
                  <button className="inv-btn" onClick={() => item.equipado ? updateItem(item.id, { equipado: false }) : handleEquip(item.id)}>
                    {item.equipado ? 'Desequipar' : 'Equipar'}
                  </button>
                  <button className="inv-btn inv-btn-danger" onClick={() => removeItem(item.id)}>Eliminar</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {other.length > 0 && (
        <div className="inv-group">
          <h3 className="inv-group-title">Otro Equipo</h3>
          {other.map(item => (
            <div key={item.id} className="inv-card inv-card-compact">
              <div className="inv-card-header">
                <span className="inv-name">{item.nombre}</span>
                <CalidadBadge calidad={item.calidad} />
                {(item.detalles.nt as number) >= 5 && <span className="nt-badge">NT{item.detalles.nt as number}</span>}
              </div>
              {item.notas && <div className="inv-stats">{item.notas}</div>}
              {item.detalles.efecto ? <div className="inv-stats">{String(item.detalles.efecto)}</div> : null}
              <div className="inv-actions">
                <button className="inv-btn" onClick={() => updateItem(item.id, { equipado: !item.equipado })}>
                  {item.equipado ? 'Desequipar' : 'Equipar'}
                </button>
                <button className="inv-btn inv-btn-danger" onClick={() => removeItem(item.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function CalidadBadge({ calidad }: { calidad: string }) {
  if (calidad === 'estandar') return null
  return (
    <span className="calidad-badge" style={{ color: CALIDAD_COLORS[calidad] ?? 'var(--color-text-muted)' }}>
      {CALIDAD_LABELS[calidad] ?? calidad}
    </span>
  )
}

export function EquipmentTab({ character, onUpdate }: EquipmentTabProps) {
  const [efectivoInput, setEfectivoInput] = useState(String(character.dinero.efectivo))
  const [showRecursoForm, setShowRecursoForm] = useState(false)
  const [nuevoRecurso, setNuevoRecurso] = useState(emptyRecurso())
  const [showAddModal, setShowAddModal] = useState(false)
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Sync input when character changes externally
  useEffect(() => {
    setEfectivoInput(String(character.dinero.efectivo))
  }, [character.dinero.efectivo])

  const updateEfectivo = useCallback((newValue: number) => {
    const clamped = Math.max(0, newValue)
    setEfectivoInput(String(clamped))
    void onUpdate({ dinero: { ...character.dinero, efectivo: clamped } })
  }, [character.dinero, onUpdate])

  function handleEfectivoChange(raw: string) {
    setEfectivoInput(raw)
    const parsed = parseInt(raw, 10)
    if (!isNaN(parsed) && parsed >= 0) {
      void onUpdate({ dinero: { ...character.dinero, efectivo: parsed } })
    }
  }

  function handleEfectivoBlur() {
    const parsed = parseInt(efectivoInput, 10)
    if (isNaN(parsed) || parsed < 0) {
      setEfectivoInput(String(character.dinero.efectivo))
    }
  }

  function startHold(delta: number) {
    // First click: delta 1. Hold: delta 10
    updateEfectivo(character.dinero.efectivo + delta)
    holdTimerRef.current = setInterval(() => {
      updateEfectivo(character.dinero.efectivo + delta * 10)
    }, 400)
  }

  function stopHold() {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current)
      holdTimerRef.current = null
    }
  }

  function removeRecurso(index: number) {
    const newRecursos = character.dinero.recursos.filter((_, i) => i !== index)
    void onUpdate({ dinero: { ...character.dinero, recursos: newRecursos } })
  }

  function addRecurso() {
    if (!nuevoRecurso.nombre.trim()) return
    const recurso: Recurso = {
      nombre: nuevoRecurso.nombre.trim(),
      ubicacion: nuevoRecurso.ubicacion.trim(),
      ganancias: nuevoRecurso.ganancias,
      periodo: nuevoRecurso.periodo,
      ...(nuevoRecurso.notas.trim() ? { notas: nuevoRecurso.notas.trim() } : {}),
    }
    const newRecursos = [...character.dinero.recursos, recurso]
    void onUpdate({ dinero: { ...character.dinero, recursos: newRecursos } })
    setNuevoRecurso(emptyRecurso())
    setShowRecursoForm(false)
  }

  function handleAddItem(item: InventoryItem) {
    const newInv = [...(character.inventario ?? []), item]
    void onUpdate({ inventario: newInv })
    setShowAddModal(false)
  }

  // ─── Restriction calculations ───

  const inventario = character.inventario ?? []
  const tecgnosisLoad = countTecgnosisLoad(inventario)
  const tecgnosisMax = character.nivel
  const tecgnosisOverloaded = isTecgnosisOverloaded(inventario, character.nivel)

  // Shield cargo
  const equippedShield = inventario.find(i => i.category === 'escudoEnergia' && i.equipado)
  const shieldCargoLimit = equippedShield ? getShieldCargoLimit(equippedShield.nombre) : null
  const equippedCargoUnits = shieldCargoLimit ? calcEquippedCargoUnits(inventario) : 0

  // Armor-shield compatibility
  const equippedArmor = inventario.find(i => i.category === 'armadura' && i.equipado)
  const armorShieldCompat = equippedArmor && equippedShield
    ? isArmorShieldCompatible(
        (equippedArmor.detalles['escudoCompatible'] as string) ?? '',
        equippedShield.nombre,
      )
    : null

  // Weapon strength warnings
  const weaponWarnings: { nombre: string; penalty: number }[] = []
  for (const item of inventario) {
    if (!item.equipado) continue
    const weaponCats = ['armaBalas', 'armaEnergia', 'armaCuerpoACuerpo', 'artefactoCuerpoACuerpo']
    if (!weaponCats.includes(item.category)) continue
    const reqFue = item.detalles['fuerza']
    if (typeof reqFue === 'number' && reqFue > character.caracteristicas.fuerza) {
      weaponWarnings.push({
        nombre: item.nombre,
        penalty: reqFue - character.caracteristicas.fuerza,
      })
    }
  }

  const hasRestrictions = true // Always show the section

  return (
    <div className="equip-tab">
      {/* Section 1: Dinero */}
      <section className="sheet-section">
        <h2>Dinero</h2>
        <div className="dinero-row">
          <button
            className="dinero-btn"
            onMouseDown={() => startHold(-1)}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
          >−</button>
          <div className="dinero-input-wrap">
            <input
              type="number"
              className="dinero-input"
              value={efectivoInput}
              onChange={e => handleEfectivoChange(e.target.value)}
              onBlur={handleEfectivoBlur}
              min={0}
            />
            <span className="dinero-label">fénix</span>
          </div>
          <button
            className="dinero-btn"
            onMouseDown={() => startHold(1)}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
          >+</button>
        </div>
      </section>

      {/* Section 2: Propiedades y Recursos */}
      <section className="sheet-section">
        <h2>Propiedades y Recursos</h2>
        {character.dinero.recursos.length === 0 && !showRecursoForm && (
          <p className="equip-empty">Sin recursos registrados.</p>
        )}
        {character.dinero.recursos.map((r, i) => (
          <div key={i} className="recurso-card">
            <div className="recurso-info">
              <strong>{r.nombre}</strong>
              {r.ubicacion && <span className="recurso-meta"> — {r.ubicacion}</span>}
              <div className="recurso-detail">
                {r.ganancias} fénix / {r.periodo}
                {r.notas && <span className="recurso-meta"> · {r.notas}</span>}
              </div>
            </div>
            <button className="recurso-del" onClick={() => removeRecurso(i)}>Eliminar</button>
          </div>
        ))}
        {showRecursoForm ? (
          <div className="recurso-form">
            <div className="recurso-form-grid">
              <label>
                Nombre
                <input
                  type="text"
                  value={nuevoRecurso.nombre}
                  onChange={e => setNuevoRecurso({ ...nuevoRecurso, nombre: e.target.value })}
                  placeholder="Ej: Finca familiar"
                />
              </label>
              <label>
                Ubicación
                <input
                  type="text"
                  value={nuevoRecurso.ubicacion}
                  onChange={e => setNuevoRecurso({ ...nuevoRecurso, ubicacion: e.target.value })}
                  placeholder="Ej: Criticorum"
                />
              </label>
              <label>
                Ganancias
                <input
                  type="number"
                  value={nuevoRecurso.ganancias}
                  onChange={e => setNuevoRecurso({ ...nuevoRecurso, ganancias: parseInt(e.target.value, 10) || 0 })}
                  min={0}
                />
              </label>
              <label>
                Periodo
                <select
                  value={nuevoRecurso.periodo}
                  onChange={e => setNuevoRecurso({ ...nuevoRecurso, periodo: e.target.value as Recurso['periodo'] })}
                >
                  {PERIODO_OPTIONS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label className="recurso-form-full">
                Notas
                <input
                  type="text"
                  value={nuevoRecurso.notas}
                  onChange={e => setNuevoRecurso({ ...nuevoRecurso, notas: e.target.value })}
                  placeholder="Opcional"
                />
              </label>
            </div>
            <div className="recurso-form-actions">
              <button className="btn btn-back" onClick={() => { setShowRecursoForm(false); setNuevoRecurso(emptyRecurso()) }}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={addRecurso}
                disabled={!nuevoRecurso.nombre.trim()}
              >
                Añadir
              </button>
            </div>
          </div>
        ) : (
          <button className="equip-add-btn" onClick={() => setShowRecursoForm(true)}>
            + Añadir Recurso
          </button>
        )}
      </section>

      {/* Section 3: Carga y Restricciones */}
      {hasRestrictions && (
        <section className="sheet-section">
          <h2>Carga y Restricciones</h2>
          <div className="restrictions-panel">
            {/* Tecgnosis */}
            <div className={`restriction-row ${tecgnosisOverloaded ? 'restriction-danger' : 'restriction-ok'}`}>
              <span className="restriction-label">Tecgnosis</span>
              <span>
                Dispositivos NT5+: {tecgnosisLoad} / Tecgnosis: {tecgnosisMax}
                {tecgnosisOverloaded && <strong className="restriction-warn"> — ¡Sobrecargado!</strong>}
              </span>
            </div>

            {/* Shield cargo */}
            {equippedShield && shieldCargoLimit && (
              <div className={`restriction-row ${equippedCargoUnits > shieldCargoLimit.maxUnits ? 'restriction-danger' : 'restriction-ok'}`}>
                <span className="restriction-label">Carga escudo</span>
                <span>
                  Carga extra: {equippedCargoUnits} / Máx: {shieldCargoLimit.maxUnits} ({shieldCargoLimit.label})
                  {equippedCargoUnits > shieldCargoLimit.maxUnits && (
                    <strong className="restriction-warn"> — ¡Excedido!</strong>
                  )}
                </span>
              </div>
            )}

            {/* Armor-shield compatibility */}
            {armorShieldCompat !== null && (
              <div className={`restriction-row ${armorShieldCompat ? 'restriction-ok' : 'restriction-danger'}`}>
                <span className="restriction-label">Armadura-Escudo</span>
                <span>
                  {armorShieldCompat
                    ? 'Compatible'
                    : '¡Escudo no se activará!'}
                </span>
              </div>
            )}

            {/* Weapon strength */}
            {weaponWarnings.map((w, i) => (
              <div key={i} className="restriction-row restriction-danger">
                <span className="restriction-label">Fuerza</span>
                <span>{w.nombre}: Meta −{w.penalty} (falta Fuerza)</span>
              </div>
            ))}

            {!tecgnosisOverloaded && !equippedShield && armorShieldCompat === null && weaponWarnings.length === 0 && (
              <p className="equip-empty">Sin restricciones activas.</p>
            )}
          </div>
        </section>
      )}

      {/* Section 4: Inventario Equipado */}
      <InventorySection
        title="Equipado"
        items={inventario.filter(i => i.equipado)}
        character={character}
        onUpdate={onUpdate}
        inventario={inventario}
        mode="equipped"
      />

      {/* Section 5: Inventario Almacenado */}
      <InventorySection
        title="Almacenado"
        items={inventario.filter(i => !i.equipado)}
        character={character}
        onUpdate={onUpdate}
        inventario={inventario}
        mode="stored"
      />

      {/* Añadir Equipo button */}
      <button className="equip-add-btn equip-add-main" onClick={() => setShowAddModal(true)}>
        + Añadir Equipo
      </button>

      {showAddModal && (
        <AddEquipmentModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddItem}
        />
      )}

      <style>{`
        .equip-tab {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        /* Dinero */
        .dinero-row {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          justify-content: center;
        }
        .dinero-btn {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: var(--color-bg-card);
          color: var(--color-accent);
          font-size: 1.3rem;
          font-weight: bold;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }
        .dinero-btn:hover {
          border-color: var(--color-accent);
          background: var(--color-bg-surface);
        }
        .dinero-btn:active {
          background: var(--color-accent);
          color: var(--color-bg);
        }
        .dinero-input-wrap {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }
        .dinero-input {
          width: 100px;
          text-align: center;
          font-size: 1.3rem;
          font-weight: bold;
          color: var(--color-accent);
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: var(--space-xs) var(--space-sm);
        }
        .dinero-input:focus {
          outline: none;
          border-color: var(--color-accent);
        }
        .dinero-input::-webkit-inner-spin-button,
        .dinero-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .dinero-input[type=number] {
          -moz-appearance: textfield;
        }
        .dinero-label {
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }

        /* Recursos */
        .equip-empty {
          color: var(--color-text-muted);
          font-size: 0.85rem;
          font-style: italic;
        }
        .recurso-card {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--space-md);
          padding: var(--space-sm) var(--space-md);
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          margin-bottom: var(--space-xs);
          font-size: 0.9rem;
        }
        .recurso-info {
          flex: 1;
        }
        .recurso-meta {
          color: var(--color-text-muted);
          font-size: 0.8rem;
        }
        .recurso-detail {
          color: var(--color-text-muted);
          font-size: 0.8rem;
          margin-top: 2px;
        }
        .recurso-del {
          background: none;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          color: var(--color-danger);
          font-size: 0.75rem;
          padding: 2px var(--space-sm);
          cursor: pointer;
          white-space: nowrap;
          transition: border-color 0.15s;
        }
        .recurso-del:hover {
          border-color: var(--color-danger);
        }

        /* Recurso form */
        .recurso-form {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-md);
          margin-top: var(--space-sm);
        }
        .recurso-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-sm);
        }
        .recurso-form-full {
          grid-column: 1 / -1;
        }
        .recurso-form label {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .recurso-form input,
        .recurso-form select {
          padding: var(--space-xs) var(--space-sm);
          background: var(--color-bg-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          color: var(--color-text);
          font-size: 0.85rem;
        }
        .recurso-form input:focus,
        .recurso-form select:focus {
          outline: none;
          border-color: var(--color-accent);
        }
        .recurso-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-sm);
          margin-top: var(--space-md);
        }

        .equip-add-btn {
          background: none;
          border: 1px dashed var(--color-border);
          border-radius: var(--radius-sm);
          color: var(--color-text-muted);
          padding: var(--space-sm) var(--space-md);
          font-size: 0.85rem;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          width: 100%;
          margin-top: var(--space-sm);
        }
        .equip-add-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        /* Restrictions */
        .restrictions-panel {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }
        .restriction-row {
          display: flex;
          gap: var(--space-md);
          align-items: center;
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          border: 1px solid var(--color-border);
        }
        .restriction-ok {
          color: #66bb6a;
          border-color: rgba(102, 187, 106, 0.3);
          background: rgba(102, 187, 106, 0.05);
        }
        .restriction-danger {
          color: var(--color-danger);
          border-color: rgba(196, 74, 74, 0.4);
          background: rgba(196, 74, 74, 0.08);
        }
        .restriction-label {
          font-weight: 600;
          min-width: 120px;
          flex-shrink: 0;
        }
        .restriction-warn {
          font-weight: 700;
        }

        /* Inventory */
        .inv-group {
          margin-bottom: var(--space-md);
        }
        .inv-group-title {
          font-size: 0.85rem;
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: var(--space-xs);
          padding-bottom: var(--space-xs);
          border-bottom: 1px solid var(--color-border);
        }
        .inv-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: var(--space-sm) var(--space-md);
          margin-bottom: var(--space-xs);
        }
        .inv-card-warn {
          border-color: rgba(196, 74, 74, 0.5);
          background: rgba(196, 74, 74, 0.05);
        }
        .inv-warning {
          font-size: 0.75rem;
          color: var(--color-danger);
          background: rgba(196, 74, 74, 0.1);
          border: 1px solid rgba(196, 74, 74, 0.3);
          border-radius: var(--radius-sm);
          padding: 2px var(--space-sm);
          margin-top: var(--space-xs);
        }
        .inv-card-compact {
          padding: var(--space-xs) var(--space-md);
        }
        .inv-card-header {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          flex-wrap: wrap;
        }
        .inv-name {
          font-weight: 600;
          font-size: 0.9rem;
        }
        .calidad-badge {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .nt-badge {
          background: rgba(196, 163, 90, 0.15);
          color: var(--color-accent);
          font-size: 0.7rem;
          font-weight: 600;
          padding: 1px 6px;
          border-radius: 3px;
        }
        .inv-stats {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-top: 2px;
        }
        .inv-protections {
          font-size: 0.75rem;
          color: #66bb6a;
          margin-top: 2px;
        }
        .penalty {
          color: var(--color-danger);
          font-weight: 600;
        }
        .inv-ammo {
          margin-top: var(--space-xs);
          padding: var(--space-xs) 0;
        }
        .ammo-bar {
          height: 6px;
          background: var(--color-bg-surface);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 4px;
        }
        .ammo-fill {
          height: 100%;
          background: var(--color-accent);
          border-radius: 3px;
          transition: width 0.2s;
        }
        .ammo-text {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .ammo-actions {
          display: flex;
          gap: var(--space-xs);
          margin-top: var(--space-xs);
        }
        .inv-actions {
          display: flex;
          gap: var(--space-xs);
          margin-top: var(--space-xs);
        }
        .inv-btn {
          background: none;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          color: var(--color-text-muted);
          font-size: 0.75rem;
          padding: 2px var(--space-sm);
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .inv-btn:hover:not(:disabled) {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }
        .inv-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .inv-btn-sm {
          font-size: 0.7rem;
          padding: 1px var(--space-xs);
        }
        .inv-btn-danger {
          color: var(--color-danger);
        }
        .inv-btn-danger:hover {
          border-color: var(--color-danger);
          color: var(--color-danger);
        }
        .equip-add-main {
          font-size: 1rem;
          padding: var(--space-md);
          border-style: dashed;
          border-width: 2px;
        }
      `}</style>
    </div>
  )
}
