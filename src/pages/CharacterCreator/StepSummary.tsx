import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '@/db'
import { SKILLS } from '@/data/skills'
import { SPECIES } from '@/data/species'
import { CLASSES } from '@/data/classes'
import { FACTIONS } from '@/data/factions'
import { VOCATIONS } from '@/data/vocations'
import { CHARACTERISTICS } from '@/data/characteristics'
import { calcVitality, calcImpulse, calcReanimation, calcBankCapacity, calcUsosMax, calcTecgnosis, getMaxStatValue } from '@/engine/derived'
import type { Character, CharacteristicKey, SkillKey, Characteristics, Skills } from '@/types/character'
import type { CharacterDraft } from './creatorTypes'
import { CharacteristicsTable } from './components/CharacteristicsTable'
import { Tooltip } from '@/components/ui/Tooltip'
import { COMPETENCY_TOOLTIPS, CHARACTERISTIC_TOOLTIPS, SKILL_TOOLTIPS, BENEFIT_TOOLTIPS } from '@/data/tooltips'

interface Props {
  draft: CharacterDraft
  goBack: () => void
}

export function StepSummary({ draft, goBack }: Props) {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  const species = SPECIES.find(s => s.id === draft.especie)
  const cls = CLASSES.find(c => c.id === draft.clase)
  const faction = FACTIONS.find(f => f.id === draft.faccion)
  const vocation = VOCATIONS.find(v => v.id === draft.vocacion)

  const nivel = 1
  const maxVal = getMaxStatValue(nivel)

  // --- Excess redistribution logic ---
  const charExcess = useMemo(() => {
    let total = 0
    const overKeys: { key: CharacteristicKey; over: number }[] = []
    for (const [key, val] of Object.entries(draft.caracteristicas)) {
      if (val > maxVal) {
        const over = val - maxVal
        total += over
        overKeys.push({ key: key as CharacteristicKey, over })
      }
    }
    return { total, overKeys }
  }, [draft.caracteristicas, maxVal])

  const skillExcess = useMemo(() => {
    let total = 0
    const overKeys: { key: SkillKey; over: number }[] = []
    for (const [key, val] of Object.entries(draft.habilidades)) {
      if (val > maxVal) {
        const over = val - maxVal
        total += over
        overKeys.push({ key: key as SkillKey, over })
      }
    }
    return { total, overKeys }
  }, [draft.habilidades, maxVal])

  const hasExcess = charExcess.total > 0 || skillExcess.total > 0

  // Track where the player assigns excess points
  const [charRedist, setCharRedist] = useState<Partial<Record<CharacteristicKey, number>>>({})
  const [skillRedist, setSkillRedist] = useState<Partial<Record<SkillKey, number>>>({})

  const charRedistTotal = Object.values(charRedist).reduce((s, v) => s + (v ?? 0), 0)
  const skillRedistTotal = Object.values(skillRedist).reduce((s, v) => s + (v ?? 0), 0)

  const charRedistRemaining = charExcess.total - charRedistTotal
  const skillRedistRemaining = skillExcess.total - skillRedistTotal

  // Build final stats with excess capped and redistribution applied
  const finalChars = useMemo(() => {
    const result = { ...draft.caracteristicas } as Characteristics
    // Cap overflowing stats
    for (const { key } of charExcess.overKeys) {
      result[key] = maxVal
    }
    // Apply redistribution
    for (const [key, val] of Object.entries(charRedist)) {
      if (val) result[key as CharacteristicKey] += val
    }
    return result
  }, [draft.caracteristicas, charExcess.overKeys, charRedist, maxVal])

  const finalSkills = useMemo(() => {
    const result = { ...draft.habilidades } as Skills
    // Cap overflowing stats
    for (const { key } of skillExcess.overKeys) {
      result[key] = maxVal
    }
    // Apply redistribution
    for (const [key, val] of Object.entries(skillRedist)) {
      if (val) result[key as SkillKey] += val
    }
    return result
  }, [draft.habilidades, skillExcess.overKeys, skillRedist, maxVal])

  const excessFullyDistributed = charRedistRemaining === 0 && skillRedistRemaining === 0

  // Build temporary character for derived stat calculations
  const tempChar = {
    tamano: draft.tamano,
    caracteristicas: finalChars,
    nivel,
  }

  const vitalidad = calcVitality(tempChar)
  const impulso = calcImpulse({ caracteristicas: finalChars, nivel })
  const reanimacion = calcReanimation({ tamano: draft.tamano, nivel })
  const banco = calcBankCapacity(nivel)
  const usosMax = calcUsosMax(nivel)
  const tecgnosis = calcTecgnosis(nivel)

  async function handleSave() {
    setSaving(true)
    try {
      const now = new Date().toISOString()
      const character: Character = {
        id: crypto.randomUUID(),
        nombre: draft.nombre,
        planeta: draft.planeta,
        rango: '',
        fechaNacimiento: draft.fechaNacimiento,
        concepto: draft.concepto,
        descripcionFisica: draft.descripcionFisica,
        personalidad: draft.personalidad,
        trasfondo: draft.trasfondo,
        retrato: null,
        especie: draft.especie as Character['especie'],
        tamano: draft.tamano,
        velocidad: typeof draft.velocidad === 'string' ? parseInt(draft.velocidad) : draft.velocidad,
        clase: draft.clase as Character['clase'],
        nivel,
        faccion: draft.faccion as Character['faccion'],
        bendicion: `${draft.bendicionNombre}: ${draft.bendicionEfecto}`,
        maldicion: `${draft.maldicionNombre}: ${draft.maldicionEfecto}`,
        vocacion: draft.vocacion,
        caracteristicaPrimaria: draft.caracteristicaPrimaria as Character['caracteristicaPrimaria'],
        caracteristicaSecundaria: draft.caracteristicaSecundaria as Character['caracteristicaSecundaria'],
        caracteristicas: { ...finalChars },
        habilidades: { ...finalSkills },
        oculto: {
          psi: draft.donIluminacion === 'psi' || draft.especie === 'ur-ukar' ? 1 : 0,
          ansia: 0,
          teurgia: draft.donIluminacion === 'teurgia' ? 1 : 0,
          hubris: 0,
        },
        resistencias: {
          corporal: 0,
          mental: 0,
          espiritual: 0,
          corporalMod: 0,
          mentalMod: 0,
          espiritualMod: 0,
        },
        armadura: null,
        escudoEnergia: null,
        vitalidadMaxima: vitalidad,
        vitalidadActual: vitalidad,
        reanimacionesCantidad: reanimacion,
        reanimacionesUsos: usosMax,
        reanimacionesUsosMax: usosMax,
        bancoPVCapacidad: banco,
        pvActuales: banco,
        pwActuales: 0,
        impulsoCantidad: impulso,
        impulsoUsos: usosMax,
        impulsoUsosMax: usosMax,
        acciones: [],
        beneficios: draft.beneficios,
        competencias: draft.competencias,
        derechosDeNacimiento: draft.derechosDeNacimiento,
        armas: [],
        equipo: [],
        otrasPertenencias: [],
        dinero: { efectivo: 300, recursos: [] },
        tecgnosis,
        afliccion: draft.afliccion || null,
        notas: '',
        createdAt: now,
        updatedAt: now,
      }

      await db.characters.add(character)
      navigate('/personajes')
    } catch (err) {
      console.error('Error saving character:', err)
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="step-title">Resumen del Personaje</h2>

      {/* 5.1 Identity */}
      <section className="summary-section">
        <h3 className="summary-heading">Identidad</h3>
        <div className="summary-grid">
          <SummaryRow label="Nombre" value={draft.nombre} />
          <SummaryRow label="Concepto" value={draft.concepto} />
          <SummaryRow label="Especie" value={species?.nombre ?? ''} />
          <SummaryRow label="Planeta natal" value={draft.planeta} />
          <SummaryRow label="Fecha de nacimiento" value={draft.fechaNacimiento} />
          <SummaryRow label="Tamaño / Velocidad" value={`${draft.tamano} / ${draft.velocidad} m`} />
        </div>
      </section>

      {/* 5.2 Class & Faction */}
      <section className="summary-section">
        <h3 className="summary-heading">Clase y Facción</h3>
        <div className="summary-grid">
          <SummaryRow label="Clase" value={cls?.nombre ?? ''} />
          <SummaryRow label="Nivel" value={String(nivel)} />
          <SummaryRow label="Facción" value={faction?.nombre ?? ''} />
          <SummaryRow label="Vocación" value={vocation?.nombre ?? ''} />
          <SummaryRow label="Bendición" value={`${draft.bendicionNombre}: ${draft.bendicionEfecto}`} />
          <SummaryRow label="Maldición" value={`${draft.maldicionNombre}: ${draft.maldicionEfecto}`} />
        </div>
      </section>

      {/* Excess redistribution */}
      {hasExcess && (
        <section className="summary-section excess-section">
          <h3 className="summary-heading">Regla de Exceso</h3>
          <div className="info-box" style={{ marginBottom: 'var(--space-md)' }}>
            Algunas características o habilidades superan el máximo de <strong>{maxVal}</strong> a nivel 1.
            Debes redistribuir los puntos de exceso a otras de tu elección.
          </div>

          {charExcess.total > 0 && (
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-sm)' }}>
                Exceso en Características — <span style={{ color: charRedistRemaining > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                  {charRedistRemaining} punto(s) por asignar
                </span>
              </h4>
              <div className="excess-source">
                {charExcess.overKeys.map(({ key, over }) => {
                  const meta = CHARACTERISTICS.find(c => c.key === key)
                  return (
                    <span key={key} className="excess-tag">
                      {meta?.nombre}: {draft.caracteristicas[key]} → {maxVal} (+{over} exceso)
                    </span>
                  )
                })}
              </div>
              <div className="redist-grid">
                {CHARACTERISTICS.filter(c => {
                  const isOver = charExcess.overKeys.some(o => o.key === c.key)
                  return !isOver
                }).map(c => {
                  const baseVal = draft.caracteristicas[c.key]
                  const added = charRedist[c.key] ?? 0
                  const currentVal = baseVal + added
                  const canAdd = charRedistRemaining > 0 && currentVal < maxVal
                  const canRemove = added > 0
                  return (
                    <div key={c.key} className="redist-row">
                      <Tooltip text={CHARACTERISTIC_TOOLTIPS[c.key]}>
                      <span className="redist-name">{c.nombre} ({c.abreviatura})</span>
                    </Tooltip>
                      <span className="redist-val">{baseVal}</span>
                      <button
                        className="redist-btn"
                        disabled={!canRemove}
                        onClick={() => setCharRedist(prev => ({ ...prev, [c.key]: (prev[c.key] ?? 0) - 1 }))}
                      >−</button>
                      <span className={`redist-added ${added > 0 ? 'has-added' : ''}`}>+{added}</span>
                      <button
                        className="redist-btn"
                        disabled={!canAdd}
                        onClick={() => setCharRedist(prev => ({ ...prev, [c.key]: (prev[c.key] ?? 0) + 1 }))}
                      >+</button>
                      <span className="redist-total">{currentVal}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {skillExcess.total > 0 && (
            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-sm)' }}>
                Exceso en Habilidades — <span style={{ color: skillRedistRemaining > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                  {skillRedistRemaining} punto(s) por asignar
                </span>
              </h4>
              <div className="excess-source">
                {skillExcess.overKeys.map(({ key, over }) => {
                  const meta = SKILLS.find(s => s.key === key)
                  return (
                    <span key={key} className="excess-tag">
                      {meta?.nombre}: {draft.habilidades[key]} → {maxVal} (+{over} exceso)
                    </span>
                  )
                })}
              </div>
              <div className="redist-grid">
                {SKILLS.filter(s => {
                  const isOver = skillExcess.overKeys.some(o => o.key === s.key)
                  return !isOver
                }).map(s => {
                  const baseVal = draft.habilidades[s.key]
                  const added = skillRedist[s.key] ?? 0
                  const currentVal = baseVal + added
                  const canAdd = skillRedistRemaining > 0 && currentVal < maxVal
                  const canRemove = added > 0
                  return (
                    <div key={s.key} className="redist-row">
                      <Tooltip text={SKILL_TOOLTIPS[s.key]}>
                        <span className="redist-name">
                          {s.nombre}
                          {s.restringida && <span className="skill-restricted"> (R)</span>}
                        </span>
                      </Tooltip>
                      <span className="redist-val">{baseVal}</span>
                      <button
                        className="redist-btn"
                        disabled={!canRemove}
                        onClick={() => setSkillRedist(prev => ({ ...prev, [s.key]: (prev[s.key] ?? 0) - 1 }))}
                      >−</button>
                      <span className={`redist-added ${added > 0 ? 'has-added' : ''}`}>+{added}</span>
                      <button
                        className="redist-btn"
                        disabled={!canAdd}
                        onClick={() => setSkillRedist(prev => ({ ...prev, [s.key]: (prev[s.key] ?? 0) + 1 }))}
                      >+</button>
                      <span className="redist-total">{currentVal}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 5.3 Characteristics */}
      <section className="summary-section">
        <h3 className="summary-heading">Características</h3>
        <CharacteristicsTable current={finalChars} />
      </section>

      {/* 5.4 Skills */}
      <section className="summary-section">
        <h3 className="summary-heading">Habilidades</h3>
        <div className="skills-grid">
          {SKILLS.map(skill => {
            const val = finalSkills[skill.key]
            const base = skill.valorBase
            const changed = val !== base
            return (
              <Tooltip key={skill.key} text={SKILL_TOOLTIPS[skill.key]}>
                <div className={`skill-row ${changed ? 'skill-changed' : ''}`}>
                  <span className="skill-name">
                    {skill.nombre}
                    {skill.restringida && <span className="skill-restricted"> (R)</span>}
                  </span>
                  <span className="skill-value">{val}</span>
                </div>
              </Tooltip>
            )
          })}
        </div>
      </section>

      {/* Occult */}
      {(draft.donIluminacion !== '' || draft.especie === 'ur-ukar') && (
        <section className="summary-section">
          <h3 className="summary-heading">Oculto</h3>
          <div className="summary-grid">
            {(draft.donIluminacion === 'psi' || draft.especie === 'ur-ukar') && (
              <>
                <SummaryRow label="Psi" value="1" />
                <SummaryRow label="Ansia" value="0" />
              </>
            )}
            {draft.donIluminacion === 'teurgia' && (
              <>
                <SummaryRow label="Teurgia" value="1" />
                <SummaryRow label="Hubris" value="0" />
              </>
            )}
          </div>
        </section>
      )}

      {/* 5.7 Vitality & Reanimation */}
      <section className="summary-section">
        <h3 className="summary-heading">Vitalidad y Derivados</h3>
        <div className="summary-grid">
          <SummaryRow
            label="Vitalidad"
            value={`${vitalidad} (Tam ${draft.tamano} + CON ${finalChars.constitucion} + VOL ${finalChars.voluntad} + FE ${finalChars.fe} + Nivel ${nivel})`}
          />
          <SummaryRow
            label="Reanimación"
            value={`${reanimacion} valor × ${usosMax} uso(s)`}
          />
          <SummaryRow
            label="Impulso"
            value={`${impulso} valor × ${usosMax} uso(s)`}
          />
          <SummaryRow label="Banco PV" value={`${banco} PV`} />
          <SummaryRow label="Tecgnosis" value={String(tecgnosis)} />
        </div>
      </section>

      {/* 5.10 Benefits */}
      <section className="summary-section">
        <h3 className="summary-heading">Beneficios</h3>
        <ol className="summary-list">
          {draft.beneficios.map((b, i) => (
            <li key={i}>
              <Tooltip text={BENEFIT_TOOLTIPS[b.nombre]}>
                <strong>{b.nombre}</strong>
              </Tooltip>
              <span className="summary-meta"> — {b.tipo} ({b.origen})</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 5.11 Competencies */}
      <section className="summary-section">
        <h3 className="summary-heading">Competencias</h3>
        <ol className="summary-list">
          {draft.competencias.map((c, i) => (
            <li key={i}>
              <Tooltip text={COMPETENCY_TOOLTIPS[c.nombre]}>
                {c.nombre}
              </Tooltip>
              <span className="summary-meta"> ({c.origen})</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 5.12 Birthrights */}
      {draft.derechosDeNacimiento.length > 0 && (
        <section className="summary-section">
          <h3 className="summary-heading">Derechos de Nacimiento</h3>
          <ul className="summary-list">
            {draft.derechosDeNacimiento.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Affliction */}
      {draft.afliccion && (
        <section className="summary-section">
          <h3 className="summary-heading">Aflicción</h3>
          <div className="info-box warning-box">{draft.afliccion}</div>
        </section>
      )}

      {/* 5.13 Equipment */}
      <section className="summary-section">
        <h3 className="summary-heading">Equipo y Dinero</h3>
        <div className="summary-grid">
          {draft.premioMaterial && (
            <SummaryRow label="Premio de facción" value={draft.premioMaterial} />
          )}
          {draft.equipoVocacion.length > 0 && (
            <SummaryRow label="Equipo de vocación" value={draft.equipoVocacion.join(', ')} />
          )}
          <SummaryRow label="Dinero" value="300 fénix" />
        </div>
      </section>

      {/* Narrative */}
      {(draft.descripcionFisica || draft.personalidad || draft.trasfondo) && (
        <section className="summary-section">
          <h3 className="summary-heading">Narrativa</h3>
          {draft.descripcionFisica && (
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <strong>Descripción física:</strong>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{draft.descripcionFisica}</p>
            </div>
          )}
          {draft.personalidad && (
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <strong>Personalidad:</strong>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{draft.personalidad}</p>
            </div>
          )}
          {draft.trasfondo && (
            <div>
              <strong>Trasfondo:</strong>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{draft.trasfondo}</p>
            </div>
          )}
        </section>
      )}

      {/* Actions */}
      <div className="step-nav">
        <button className="btn btn-back" onClick={goBack}>← Atrás</button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || !excessFullyDistributed}>
          {saving ? 'Guardando...' : hasExcess && !excessFullyDistributed ? 'Asigna el exceso primero' : 'Guardar Personaje'}
        </button>
      </div>

      <style>{`
        .summary-section {
          margin-bottom: var(--space-lg);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid var(--color-border);
        }
        .summary-heading {
          font-size: 1.1rem;
          color: var(--color-accent);
          margin-bottom: var(--space-sm);
        }
        .summary-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }
        .summary-row {
          display: flex;
          gap: var(--space-md);
          font-size: 0.9rem;
        }
        .summary-row-label {
          color: var(--color-text-muted);
          min-width: 140px;
          flex-shrink: 0;
        }
        .summary-row-value {
          color: var(--color-text);
        }
        .summary-list {
          padding-left: var(--space-lg);
          font-size: 0.9rem;
        }
        .summary-list li {
          margin-bottom: var(--space-xs);
        }
        .summary-meta {
          color: var(--color-text-muted);
          font-size: 0.8rem;
        }

        .excess-section {
          background: rgba(196, 163, 90, 0.05);
          border: 1px solid var(--color-accent);
          border-radius: var(--radius-md);
          padding: var(--space-md);
        }
        .excess-source {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-xs);
          margin-bottom: var(--space-sm);
        }
        .excess-tag {
          background: rgba(196, 74, 74, 0.15);
          color: var(--color-danger);
          padding: 2px var(--space-sm);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
        }
        .redist-grid {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .redist-row {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          padding: 3px var(--space-sm);
          background: var(--color-bg-card);
          border-radius: 2px;
          font-size: 0.85rem;
        }
        .redist-name {
          flex: 1;
          min-width: 120px;
        }
        .redist-val {
          color: var(--color-text-muted);
          min-width: 20px;
          text-align: right;
        }
        .redist-btn {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: var(--color-bg-surface);
          color: var(--color-text);
          font-size: 1rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
        .redist-btn:hover:not(:disabled) {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }
        .redist-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }
        .redist-added {
          min-width: 24px;
          text-align: center;
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .redist-added.has-added {
          color: var(--color-success);
          font-weight: bold;
        }
        .redist-total {
          min-width: 20px;
          text-align: right;
          font-weight: bold;
          color: var(--color-accent);
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 2px;
        }
        .skill-row {
          display: flex;
          justify-content: space-between;
          padding: var(--space-xs) var(--space-sm);
          background: var(--color-bg-card);
          font-size: 0.85rem;
          border-radius: 2px;
        }
        .skill-changed {
          color: var(--color-accent);
        }
        .skill-name {
          flex: 1;
        }
        .skill-restricted {
          color: var(--color-danger);
          font-size: 0.75rem;
        }
        .skill-value {
          font-weight: bold;
          min-width: 24px;
          text-align: right;
        }
      `}</style>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="summary-row">
      <span className="summary-row-label">{label}</span>
      <span className="summary-row-value">{value}</span>
    </div>
  )
}
