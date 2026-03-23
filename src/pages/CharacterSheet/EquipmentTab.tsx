import { useState, useRef, useCallback, useEffect } from 'react'
import {
  countTecgnosisLoad,
  isTecgnosisOverloaded,
  getShieldCargoLimit,
  calcEquippedCargoUnits,
  isArmorShieldCompatible,
} from '@/engine/inventory'
import type { Character, Recurso } from '@/types/character'

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

export function EquipmentTab({ character, onUpdate }: EquipmentTabProps) {
  const [efectivoInput, setEfectivoInput] = useState(String(character.dinero.efectivo))
  const [showRecursoForm, setShowRecursoForm] = useState(false)
  const [nuevoRecurso, setNuevoRecurso] = useState(emptyRecurso())
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
    if (item.category !== 'armaBalas' && item.category !== 'armaCaC') continue
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

      {/* Section 4: Placeholder for inventory (Task 7) */}
      {/* TODO: Task 7 — Full inventory management (add/remove/edit items, equip/unequip, category filters, quality editing) */}

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
      `}</style>
    </div>
  )
}
