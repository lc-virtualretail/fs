import { useState, useEffect } from 'react'
import { CLASSES } from '@/data/classes'
import { CHARACTERISTICS } from '@/data/characteristics'
import { SKILLS } from '@/data/skills'
import type { CharacteristicKey, SkillKey } from '@/types/character'
import type { CharacteristicBonus, SkillBonus } from '@/types/rules'
import { CharacteristicsTable } from './components/CharacteristicsTable'
import type { StepProps } from './creatorTypes'
import { ALL_COMPETENCIES } from '@/data/competencies'
import { getSubChoice, getDisplayLabel, resolveWithSub, filterAvailableCompetencies, filterSubChoiceOptions } from './competencyUtils'
import { Tooltip } from '@/components/ui/Tooltip'
import { COMPETENCY_TOOLTIPS, CHARACTERISTIC_TOOLTIPS, SKILL_TOOLTIPS, BENEFIT_TOOLTIPS } from '@/data/tooltips'

export function StepClass({ draft, updateDraft, goNext, goBack }: StepProps) {
  const selectedClass = CLASSES.find(c => c.id === draft.clase)

  // Track choices for this step
  const [compChoices, setCompChoices] = useState<string[]>([]) // one per competenciasEleccion group
  const [compSubChoices, setCompSubChoices] = useState<Record<number, string>>({}) // sub-choice per group
  const [charChoices, setCharChoices] = useState<Record<number, CharacteristicKey>>({})
  const [skillChoices, setSkillChoices] = useState<Record<number, SkillKey>>({})
  const [freeCompChoices, setFreeCompChoices] = useState<string[]>([]) // free competency selections
  const [freeCompSubChoices, setFreeCompSubChoices] = useState<Record<number, string>>({}) // sub-choices for free comps
  const [benefitChoice, setBenefitChoice] = useState<string>('')
  // Snapshot: species-only state (saved by StepSpecies). Stable base for backtracking.
  const [baseSnapshot] = useState(() => draft._snapshotPreClase ?? {
    caracteristicas: { ...draft.caracteristicas },
    habilidades: { ...draft.habilidades },
    competencias: [...draft.competencias],
    beneficios: [...draft.beneficios],
  })
  const preClassChars = baseSnapshot.caracteristicas

  // Free distribution state for Independiente
  const [freeCharPoints, setFreeCharPoints] = useState<Record<CharacteristicKey, number>>({} as Record<CharacteristicKey, number>)
  const [freeSkillPoints, setFreeSkillPoints] = useState<Record<SkillKey, number>>({} as Record<SkillKey, number>)

  // Reset choices when class changes
  useEffect(() => {
    setCompChoices([])
    setCompSubChoices({})
    setFreeCompChoices([])
    setFreeCompSubChoices({})
    setCharChoices({})
    setSkillChoices({})
    setBenefitChoice('')
    setFreeCharPoints({} as Record<CharacteristicKey, number>)
    setFreeSkillPoints({} as Record<SkillKey, number>)
  }, [draft.clase])

  function selectClass(id: string) {
    updateDraft({ clase: id as typeof draft.clase })
  }

  const hasFreeChars = (selectedClass?.educacion.caracteristicasLibres ?? 0) > 0
  const hasFreeSkills = (selectedClass?.educacion.habilidadesLibres ?? 0) > 0
  const totalFreeCharPoints = selectedClass?.educacion.caracteristicasLibres ?? 0
  const totalFreeSkillPoints = selectedClass?.educacion.habilidadesLibres ?? 0

  const usedFreeCharPoints = Object.values(freeCharPoints).reduce((sum, v) => sum + (v || 0), 0)
  const usedFreeSkillPoints = Object.values(freeSkillPoints).reduce((sum, v) => sum + (v || 0), 0)
  const remainingFreeCharPoints = totalFreeCharPoints - usedFreeCharPoints
  const remainingFreeSkillPoints = totalFreeSkillPoints - usedFreeSkillPoints

  function resolveCharBonuses(): { key: CharacteristicKey; value: number }[] {
    if (!selectedClass) return []
    if (hasFreeChars) {
      return Object.entries(freeCharPoints)
        .filter(([, v]) => v > 0)
        .map(([key, value]) => ({ key: key as CharacteristicKey, value }))
    }
    return selectedClass.educacion.caracteristicas.map((b, i) => {
      if (b.alternativas && b.alternativas.length > 0) {
        const chosen = charChoices[i]
        return { key: chosen || b.caracteristica, value: b.valor }
      }
      return { key: b.caracteristica, value: b.valor }
    })
  }

  function resolveSkillBonuses(): { key: SkillKey; value: number }[] {
    if (!selectedClass) return []
    if (hasFreeSkills) {
      return Object.entries(freeSkillPoints)
        .filter(([, v]) => v > 0)
        .map(([key, value]) => ({ key: key as SkillKey, value }))
    }
    return selectedClass.educacion.habilidades.map((b, i) => {
      if (b.alternativas && b.alternativas.length > 0) {
        const chosen = skillChoices[i]
        return { key: chosen || b.habilidad, value: b.valor }
      }
      return { key: b.habilidad, value: b.valor }
    })
  }

  function computeNewStats() {
    // Start from species base
    const chars = { ...preClassChars }
    for (const b of resolveCharBonuses()) {
      chars[b.key] += b.value
    }

    const skills = { ...baseSnapshot.habilidades }
    for (const b of resolveSkillBonuses()) {
      skills[b.key] += b.value
    }

    return { chars, skills }
  }

  function handleNext() {
    if (!selectedClass) return
    const { chars, skills } = computeNewStats()

    // Build competencies list from snapshot base (not draft, which may have stale data from later steps)
    const newComps = [
      ...baseSnapshot.competencias,
      ...selectedClass.educacion.competenciasFijas.map(c => ({ nombre: c, origen: 'Educación' })),
      ...compChoices.filter(Boolean).map((c, i) => ({ nombre: resolveWithSub(c, compSubChoices[i]), origen: 'Educación' })),
      ...freeCompChoices.filter(Boolean).map((c, i) => ({ nombre: resolveWithSub(c, freeCompSubChoices[i]), origen: 'Educación' })),
    ]

    // Build benefits list from snapshot base
    const newBenefits = [
      ...baseSnapshot.beneficios,
      {
        nombre: selectedClass.educacion.beneficioArquetipico,
        tipo: 'Arquetípico',
        origen: 'Educación',
        descripcion: `Beneficio arquetípico de ${selectedClass.nombre}`,
      },
    ]
    if (benefitChoice) {
      newBenefits.push({
        nombre: benefitChoice,
        tipo: 'Clase',
        origen: 'Educación',
        descripcion: `Beneficio de clase ${selectedClass.nombre}`,
      })
    }

    updateDraft({
      caracteristicas: chars,
      habilidades: skills,
      competencias: newComps,
      beneficios: newBenefits,
      // Save snapshot so StepFaction has a clean base for backtracking
      _snapshotPreFaccion: {
        caracteristicas: { ...chars },
        habilidades: { ...skills },
        competencias: [...newComps],
        beneficios: [...newBenefits],
      },
    })
    goNext()
  }

  // Check if all required choices are made
  const allCompChoicesMade = !selectedClass || (
    selectedClass.educacion.competenciasEleccion.every((_, i) => {
      const chosen = compChoices[i]
      if (!chosen) return false
      const sub = getSubChoice(chosen)
      if (sub !== null) return !!compSubChoices[i]
      return true
    })
  )
  const allCharChoicesMade = !selectedClass || (
    hasFreeChars
      ? remainingFreeCharPoints === 0
      : selectedClass.educacion.caracteristicas.every((b, i) =>
          !b.alternativas || b.alternativas.length === 0 || charChoices[i]
        )
  )
  const allSkillChoicesMade = !selectedClass || (
    hasFreeSkills
      ? remainingFreeSkillPoints === 0
      : selectedClass.educacion.habilidades.every((b, i) =>
          !b.alternativas || b.alternativas.length === 0 || skillChoices[i]
        )
  )

  const numFreeComps = selectedClass?.educacion.competenciasLibres ?? 0
  const allFreeCompsMade = numFreeComps === 0 || (
    freeCompChoices.filter(Boolean).length >= numFreeComps &&
    freeCompChoices.every((c, i) => {
      if (!c) return true
      const sub = getSubChoice(c)
      if (sub !== null) return !!freeCompSubChoices[i]
      return true
    })
  )

  const canProceed = draft.clase !== '' && allCompChoicesMade && allFreeCompsMade && allCharChoicesMade && allSkillChoicesMade && benefitChoice !== ''

  const preview = draft.clase ? computeNewStats() : null

  // Build combined benefit list for independiente (any class + free benefits)
  const allBenefitOptions = (() => {
    if (!selectedClass) return []
    if (selectedClass.educacion.beneficiosDeCualquierClase) {
      const allClassBenefits = new Set<string>()
      for (const cls of CLASSES) {
        for (const b of cls.educacion.beneficiosDeClase) {
          if (b !== selectedClass.educacion.beneficioArquetipico) {
            allClassBenefits.add(b)
          }
        }
      }
      return Array.from(allClassBenefits).sort()
    }
    return selectedClass.educacion.beneficiosDeClase
      .filter(b => b !== selectedClass.educacion.beneficioArquetipico)
  })()

  return (
    <div>
      <h2 className="step-title">Paso 2: Clase (Educación)</h2>

      <div className="step-section">
        <h3>Elige tu clase</h3>
        <div className="card-grid">
          {CLASSES.map(cls => (
            <button
              key={cls.id}
              className={`selectable-card ${draft.clase === cls.id ? 'selected' : ''}`}
              onClick={() => selectClass(cls.id)}
            >
              <h4>{cls.nombre}</h4>
              <p>{cls.descripcion}</p>
              <div className="card-detail">
                Arquetipo: {cls.educacion.beneficioArquetipico}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedClass && (
        <>
          {/* Competency choices */}
          <div className="step-section">
            <h3>Competencias de Educación</h3>
            <div className="info-box" style={{ marginBottom: 'var(--space-sm)' }}>
              <strong>Fijas:</strong>{' '}
              {selectedClass.educacion.competenciasFijas.map((c, i) => (
                <span key={i}>
                  {i > 0 && ', '}
                  <Tooltip text={COMPETENCY_TOOLTIPS[c]}>{c}</Tooltip>
                </span>
              ))}
            </div>
            {selectedClass.educacion.competenciasEleccion.map((group, gi) => (
              <div className="choice-group" key={gi}>
                <div className="choice-group-label">Elige una:</div>
                <div className="choice-options">
                  {group.map(opt => (
                    <Tooltip key={opt} text={COMPETENCY_TOOLTIPS[opt]}>
                      <button
                        className={`choice-btn ${compChoices[gi] === opt ? 'chosen' : ''}`}
                        onClick={() => {
                          const next = [...compChoices]
                          next[gi] = opt
                          setCompChoices(next)
                          setCompSubChoices(prev => { const n = { ...prev }; delete n[gi]; return n })
                        }}
                      >
                        {getDisplayLabel(opt)}
                      </button>
                    </Tooltip>
                  ))}
                </div>
                {/* Sub-choice when selected option requires further specification */}
                {compChoices[gi] && (() => {
                  const sub = getSubChoice(compChoices[gi])
                  if (!sub) return null
                  return (
                    <div style={{ marginTop: 'var(--space-xs)', paddingLeft: 'var(--space-sm)', borderLeft: '2px solid var(--color-accent)' }}>
                      <div className="choice-group-label" style={{ marginBottom: 'var(--space-xs)' }}>
                        Especifica subcategoría:
                      </div>
                      {sub.type === 'buttons' ? (
                        <div className="choice-options">
                          {sub.options.map(o => (
                            <Tooltip key={o} text={COMPETENCY_TOOLTIPS[`${compChoices[gi]} (${o})`] || COMPETENCY_TOOLTIPS[o]}>
                              <button
                                className={`choice-btn ${compSubChoices[gi] === o ? 'chosen' : ''}`}
                                onClick={() => setCompSubChoices(prev => ({ ...prev, [gi]: o }))}
                              >
                                {o}
                              </button>
                            </Tooltip>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder={sub.placeholder}
                          value={compSubChoices[gi] ?? ''}
                          onChange={e => setCompSubChoices(prev => ({ ...prev, [gi]: e.target.value }))}
                          style={{ width: '100%', maxWidth: 320 }}
                        />
                      )}
                    </div>
                  )
                })()}
              </div>
            ))}
            {/* Free competency dropdowns */}
            {numFreeComps > 0 && (
              <div className="choice-group">
                <div className="choice-group-label">
                  Elige {numFreeComps} competencia{numFreeComps > 1 ? 's' : ''} adicional{numFreeComps > 1 ? 'es' : ''} (trasfondo):
                </div>
                {Array.from({ length: numFreeComps }, (_, i) => {
                  // Exclude competencies already picked in other slots or in fixed/choice comps
                  const alreadyPicked = [
                    ...selectedClass.educacion.competenciasFijas,
                    ...compChoices.filter(Boolean).map((c, ci) => resolveWithSub(c, compSubChoices[ci])),
                    ...freeCompChoices.filter((c, fi) => fi !== i && c).map((c, fi) => resolveWithSub(c, freeCompSubChoices[fi])),
                  ]
                  const available = filterAvailableCompetencies(
                    ALL_COMPETENCIES.filter(c => !alreadyPicked.includes(c)),
                    draft.clase, draft.faccion, draft.vocacion,
                  )
                  const sub = freeCompChoices[i] ? getSubChoice(freeCompChoices[i]) : null
                  return (
                    <div key={i} style={{ marginBottom: 'var(--space-sm)' }}>
                      <select
                        value={freeCompChoices[i] ?? ''}
                        onChange={e => {
                          const next = [...freeCompChoices]
                          next[i] = e.target.value
                          setFreeCompChoices(next)
                          setFreeCompSubChoices(prev => { const n = { ...prev }; delete n[i]; return n })
                        }}
                        style={{ width: '100%', maxWidth: 320 }}
                      >
                        <option value="">— Selecciona competencia {i + 1} —</option>
                        {available.map(c => (
                          <option key={c} value={c}>{getDisplayLabel(c)}</option>
                        ))}
                      </select>
                      {sub && (() => {
                        const filteredOpts = sub.type === 'buttons'
                          ? filterSubChoiceOptions(freeCompChoices[i] ?? '', sub.options, draft.clase, draft.faccion, draft.vocacion)
                          : null
                        return (
                          <div style={{ marginTop: 'var(--space-xs)', paddingLeft: 'var(--space-sm)', borderLeft: '2px solid var(--color-accent)' }}>
                            <div className="choice-group-label" style={{ marginBottom: 'var(--space-xs)' }}>
                              Especifica subcategoría:
                            </div>
                            {filteredOpts ? (
                              <div className="choice-options">
                                {filteredOpts.map(o => (
                                  <Tooltip key={o} text={COMPETENCY_TOOLTIPS[`${freeCompChoices[i]} (${o})`] || COMPETENCY_TOOLTIPS[o]}>
                                    <button
                                      className={`choice-btn ${freeCompSubChoices[i] === o ? 'chosen' : ''}`}
                                      onClick={() => setFreeCompSubChoices(prev => ({ ...prev, [i]: o }))}
                                    >
                                      {o}
                                    </button>
                                  </Tooltip>
                                ))}
                              </div>
                            ) : (
                              <input
                                type="text"
                                placeholder={(sub as { placeholder: string }).placeholder}
                                value={freeCompSubChoices[i] ?? ''}
                                onChange={e => setFreeCompSubChoices(prev => ({ ...prev, [i]: e.target.value }))}
                                style={{ width: '100%', maxWidth: 320 }}
                              />
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Characteristic bonuses */}
          <div className="step-section">
            <h3>Bonificaciones de Características</h3>
            {hasFreeChars ? (
              <FreePointDistribution
                type="characteristic"
                totalPoints={totalFreeCharPoints}
                remaining={remainingFreeCharPoints}
                distribution={freeCharPoints}
                baseValues={preClassChars as unknown as Record<string, number>}
                maxValue={8}
                onChange={setFreeCharPoints as (d: Record<string, number>) => void}
              />
            ) : (
              selectedClass.educacion.caracteristicas.map((bonus, i) => (
                <CharBonusRow
                  key={i}
                  bonus={bonus}
                  chosen={charChoices[i]}
                  onChoose={(key) => setCharChoices(prev => ({ ...prev, [i]: key }))}
                />
              ))
            )}
          </div>

          {/* Skill bonuses */}
          <div className="step-section">
            <h3>Bonificaciones de Habilidades</h3>
            {hasFreeSkills ? (
              <FreePointDistribution
                type="skill"
                totalPoints={totalFreeSkillPoints}
                remaining={remainingFreeSkillPoints}
                distribution={freeSkillPoints}
                baseValues={draft.habilidades as unknown as Record<string, number>}
                maxValue={8}
                onChange={setFreeSkillPoints as (d: Record<string, number>) => void}
              />
            ) : (
              selectedClass.educacion.habilidades.map((bonus, i) => (
                <SkillBonusRow
                  key={i}
                  bonus={bonus}
                  chosen={skillChoices[i]}
                  onChoose={(key) => setSkillChoices(prev => ({ ...prev, [i]: key }))}
                />
              ))
            )}
          </div>

          {/* Benefit choice */}
          <div className="step-section">
            <h3>Beneficios</h3>
            <div className="info-box" style={{ marginBottom: 'var(--space-sm)' }}>
              <strong>Automático:</strong>{' '}
              <Tooltip text={BENEFIT_TOOLTIPS[selectedClass.educacion.beneficioArquetipico]}>
                {selectedClass.educacion.beneficioArquetipico}
              </Tooltip>{' '}
              (arquetípico)
            </div>
            <div className="choice-group">
              <div className="choice-group-label">
                {selectedClass.educacion.beneficiosDeCualquierClase
                  ? 'Elige 1 beneficio (de cualquier clase o beneficios libres):'
                  : 'Elige 1 beneficio de clase:'}
              </div>
              <div className="choice-options">
                {allBenefitOptions.map(b => (
                  <Tooltip key={b} text={BENEFIT_TOOLTIPS[b]}>
                    <button
                      className={`choice-btn ${benefitChoice === b ? 'chosen' : ''}`}
                      onClick={() => setBenefitChoice(b)}
                    >
                      {b}
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>

          {/* Preview table */}
          {preview && (
            <div className="step-section">
              <h3>Características acumuladas</h3>
              <CharacteristicsTable
                current={preview.chars}
                previous={preClassChars}
              />
            </div>
          )}
        </>
      )}

      <div className="step-nav">
        <button className="btn btn-back" onClick={goBack}>← Atrás</button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={handleNext} disabled={!canProceed}>
          Siguiente →
        </button>
      </div>
    </div>
  )
}

// ─── Free Point Distribution Component ───

function FreePointDistribution({ type, totalPoints, remaining, distribution, baseValues, maxValue, onChange }: {
  type: 'characteristic' | 'skill'
  totalPoints: number
  remaining: number
  distribution: Record<string, number>
  baseValues: Record<string, number>
  maxValue: number
  onChange: (d: Record<string, number>) => void
}) {
  const items: { key: string; nombre: string }[] = type === 'characteristic'
    ? CHARACTERISTICS.map(c => ({ key: c.key, nombre: c.nombre }))
    : SKILLS.map(s => ({ key: s.key, nombre: s.nombre }))
  const tooltips = type === 'characteristic' ? CHARACTERISTIC_TOOLTIPS : SKILL_TOOLTIPS

  function adjust(key: string, delta: number) {
    const current = distribution[key] || 0
    const newVal = current + delta
    if (newVal < 0) return
    if (delta > 0 && remaining <= 0) return
    // Check max: base + bonus <= maxValue
    if (delta > 0 && (baseValues[key] || 0) + newVal > maxValue) return
    onChange({ ...distribution, [key]: newVal })
  }

  return (
    <div>
      <div className="info-box" style={{ marginBottom: 'var(--space-sm)' }}>
        Distribuye {totalPoints} puntos libremente.
        Puntos restantes: <strong style={{ color: remaining > 0 ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>{remaining}</strong>
        {' '}(máximo por {type === 'characteristic' ? 'característica' : 'habilidad'}: {maxValue})
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-xs)' }}>
        {items.map(item => {
          const added = distribution[item.key] || 0
          const base = baseValues[item.key] || 0
          const atMax = base + added >= maxValue
          return (
            <Tooltip key={item.key} text={tooltips[item.key]}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-xs)',
                padding: '4px 8px', borderRadius: 4,
                background: added > 0 ? 'rgba(var(--accent-rgb, 139,92,246), 0.15)' : 'transparent',
              }}>
                <button
                  className="choice-btn"
                  style={{ padding: '2px 8px', fontSize: '0.8rem', minWidth: 28 }}
                  disabled={added === 0}
                  onClick={() => adjust(item.key, -1)}
                >−</button>
                <button
                  className="choice-btn"
                  style={{ padding: '2px 8px', fontSize: '0.8rem', minWidth: 28 }}
                  disabled={remaining <= 0 || atMax}
                  onClick={() => adjust(item.key, 1)}
                >+</button>
                <span style={{ flex: 1, fontSize: '0.85rem' }}>
                  {item.nombre}
                  {added > 0 && <span style={{ color: 'var(--color-accent)', marginLeft: 4 }}>+{added}</span>}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', minWidth: 24, textAlign: 'center' }}>
                  {base + added}
                </span>
              </div>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}

// ─── Fixed Bonus Row Components ───

function CharBonusRow({ bonus, chosen, onChoose }: {
  bonus: CharacteristicBonus
  chosen: CharacteristicKey | undefined
  onChoose: (key: CharacteristicKey) => void
}) {
  const meta = CHARACTERISTICS.find(c => c.key === bonus.caracteristica)

  if (!bonus.alternativas || bonus.alternativas.length === 0) {
    return (
      <div className="info-box" style={{ marginBottom: 'var(--space-sm)' }}>
        <Tooltip text={CHARACTERISTIC_TOOLTIPS[bonus.caracteristica]}>
          {meta?.nombre} +{bonus.valor} (fijo)
        </Tooltip>
      </div>
    )
  }

  const options = [bonus.caracteristica, ...bonus.alternativas]
  return (
    <div className="choice-group">
      <div className="choice-group-label">+{bonus.valor} punto(s) — elige:</div>
      <div className="choice-options">
        {options.map(key => {
          const m = CHARACTERISTICS.find(c => c.key === key)
          return (
            <Tooltip key={key} text={CHARACTERISTIC_TOOLTIPS[key]}>
              <button
                className={`choice-btn ${chosen === key ? 'chosen' : ''}`}
                onClick={() => onChoose(key)}
              >
                {m?.nombre} ({m?.abreviatura})
              </button>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}

function SkillBonusRow({ bonus, chosen, onChoose }: {
  bonus: SkillBonus
  chosen: SkillKey | undefined
  onChoose: (key: SkillKey) => void
}) {
  const meta = SKILLS.find(s => s.key === bonus.habilidad)

  if (!bonus.alternativas || bonus.alternativas.length === 0) {
    return (
      <div className="info-box" style={{ marginBottom: 'var(--space-sm)' }}>
        <Tooltip text={SKILL_TOOLTIPS[bonus.habilidad]}>
          {meta?.nombre} +{bonus.valor} (fijo)
        </Tooltip>
      </div>
    )
  }

  const options = [bonus.habilidad, ...bonus.alternativas]
  return (
    <div className="choice-group">
      <div className="choice-group-label">+{bonus.valor} punto(s) — elige:</div>
      <div className="choice-options">
        {options.map(key => {
          const m = SKILLS.find(s => s.key === key)
          return (
            <Tooltip key={key} text={SKILL_TOOLTIPS[key]}>
              <button
                className={`choice-btn ${chosen === key ? 'chosen' : ''}`}
                onClick={() => onChoose(key)}
              >
                {m?.nombre}
              </button>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}
