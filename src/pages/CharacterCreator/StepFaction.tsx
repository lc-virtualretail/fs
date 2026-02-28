import { useState, useEffect } from 'react'
import { FACTIONS } from '@/data/factions'
import { CHARACTERISTICS } from '@/data/characteristics'
import { SKILLS } from '@/data/skills'
import type { CharacteristicKey, SkillKey } from '@/types/character'
import { getMaxStatValue } from '@/engine/derived'
import { CharacteristicsTable } from './components/CharacteristicsTable'
import type { StepProps } from './creatorTypes'
import { getSubChoice, getDisplayLabel, resolveWithSub } from './competencyUtils'

export function StepFaction({ draft, updateDraft, goNext, goBack }: StepProps) {
  const availableFactions = FACTIONS.filter(f => f.clase === draft.clase)
  const selectedFaction = FACTIONS.find(f => f.id === draft.faccion)

  // One selection per choice group
  const [compGroupChoices, setCompGroupChoices] = useState<string[]>([])
  // Sub-choice for each choice group button that needs further specification
  const [compGroupSubChoices, setCompGroupSubChoices] = useState<Record<number, string>>({})
  // Sub-choice for each fixed competency that needs further specification
  const [fixedSubChoices, setFixedSubChoices] = useState<Record<number, string>>({})
  const [charChoices, setCharChoices] = useState<Record<number, CharacteristicKey>>({})
  const [skillChoices, setSkillChoices] = useState<Record<number, SkillKey>>({})

  const [preStepChars] = useState(draft.caracteristicas)

  useEffect(() => {
    setCompGroupChoices([])
    setCompGroupSubChoices({})
    setFixedSubChoices({})
    setCharChoices({})
    setSkillChoices({})
  }, [draft.faccion])

  function selectFaction(id: string) {
    updateDraft({ faccion: id as typeof draft.faccion })
  }

  function getResolvedCharKey(index: number, bonus: { caracteristica: CharacteristicKey; alternativas?: CharacteristicKey[] }): CharacteristicKey {
    if (bonus.alternativas && charChoices[index]) return charChoices[index]
    return bonus.caracteristica
  }

  function getResolvedSkillKey(index: number, bonus: { habilidad: SkillKey; alternativas?: SkillKey[] }): SkillKey {
    if (bonus.alternativas && skillChoices[index]) return skillChoices[index]
    return bonus.habilidad
  }

  function computeNewStats() {
    if (!selectedFaction) return null
    const chars = { ...draft.caracteristicas }
    selectedFaction.aprendizaje.caracteristicas.forEach((b, i) => {
      chars[getResolvedCharKey(i, b)] += b.valor
    })
    const skills = { ...draft.habilidades }
    selectedFaction.aprendizaje.habilidades.forEach((b, i) => {
      skills[getResolvedSkillKey(i, b)] += b.valor
    })
    return { chars, skills }
  }

  function handleNext() {
    if (!selectedFaction) return
    const result = computeNewStats()
    if (!result) return

    const maxVal = getMaxStatValue(1)
    const chars = { ...result.chars }
    for (const key of Object.keys(chars) as CharacteristicKey[]) {
      if (chars[key] > maxVal) chars[key] = maxVal
    }
    const skills = { ...result.skills }
    for (const key of Object.keys(skills) as SkillKey[]) {
      if (skills[key] > maxVal) skills[key] = maxVal
    }

    // Resolve fixed competencies (apply sub-choices where needed)
    const resolvedFixed = selectedFaction.aprendizaje.competenciasFijas.map((c, i) =>
      resolveWithSub(c, fixedSubChoices[i])
    )

    // Resolve choice group competencies (apply sub-choices where needed)
    const resolvedChoices = compGroupChoices
      .map((chosen, gi) => resolveWithSub(chosen, compGroupSubChoices[gi]))
      .filter(Boolean)

    const newComps = [
      ...draft.competencias,
      ...resolvedFixed.map(c => ({ nombre: c, origen: 'Aprendizaje' })),
      ...resolvedChoices.map(c => ({ nombre: c, origen: 'Aprendizaje' })),
    ]

    const newBenefits = [
      ...draft.beneficios,
      {
        nombre: selectedFaction.aprendizaje.beneficio,
        tipo: 'Facción',
        origen: 'Aprendizaje',
        descripcion: `Beneficio de ${selectedFaction.nombre}`,
      },
    ]

    updateDraft({
      caracteristicas: chars,
      habilidades: skills,
      competencias: newComps,
      beneficios: newBenefits,
      bendicionNombre: selectedFaction.bendicion.nombre,
      bendicionEfecto: selectedFaction.bendicion.efecto,
      maldicionNombre: selectedFaction.maldicion.nombre,
      maldicionEfecto: selectedFaction.maldicion.efecto,
      premioMaterial: selectedFaction.premioMaterial,
    })

    goNext()
  }

  // Validation
  const compGroupsComplete = !selectedFaction || selectedFaction.aprendizaje.competenciasEleccion.every((_, gi) => {
    const chosen = compGroupChoices[gi]
    if (!chosen) return false
    const sub = getSubChoice(chosen)
    if (sub !== null) return !!compGroupSubChoices[gi]
    return true
  })

  const fixedComplete = !selectedFaction || selectedFaction.aprendizaje.competenciasFijas.every((c, i) => {
    const sub = getSubChoice(c)
    if (sub !== null) return !!fixedSubChoices[i]
    return true
  })

  const numCharChoices = selectedFaction?.aprendizaje.caracteristicas.filter(b => b.alternativas).length ?? 0
  const charChoicesComplete = Object.keys(charChoices).length >= numCharChoices

  const numSkillChoices = selectedFaction?.aprendizaje.habilidades.filter(b => b.alternativas).length ?? 0
  const skillChoicesComplete = Object.keys(skillChoices).length >= numSkillChoices

  const canProceed =
    draft.faccion !== '' &&
    compGroupsComplete &&
    fixedComplete &&
    charChoicesComplete &&
    skillChoicesComplete

  const preview = computeNewStats()

  return (
    <div>
      <h2 className="step-title">Paso 3: Facción (Aprendizaje)</h2>

      <div className="step-section">
        <h3>Elige tu facción</h3>
        <div className="card-grid">
          {availableFactions.map(f => (
            <button
              key={f.id}
              className={`selectable-card ${draft.faccion === f.id ? 'selected' : ''}`}
              onClick={() => selectFaction(f.id)}
            >
              <h4>{f.nombre}</h4>
              <p>{f.descripcion}</p>
              <div className="card-detail">
                <strong style={{ color: 'var(--color-success)' }}>Bendición:</strong> {f.bendicion.nombre}
              </div>
              <div className="card-detail">
                <strong style={{ color: 'var(--color-danger)' }}>Maldición:</strong> {f.maldicion.nombre}
              </div>
              <div className="card-detail">
                Vocación favorecida: {f.vocacionFavorecida}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedFaction && (
        <>
          {/* Blessing & curse */}
          <div className="step-section">
            <h3>Peculiaridades</h3>
            <div className="info-box" style={{ marginBottom: 'var(--space-sm)' }}>
              <strong style={{ color: 'var(--color-success)' }}>Bendición — {selectedFaction.bendicion.nombre}:</strong>{' '}
              {selectedFaction.bendicion.efecto}
            </div>
            <div className="info-box warning-box">
              <strong>Maldición — {selectedFaction.maldicion.nombre}:</strong>{' '}
              {selectedFaction.maldicion.efecto}
            </div>
          </div>

          {/* Material prize */}
          <div className="step-section">
            <h3>Premio Material</h3>
            <div className="info-box">{selectedFaction.premioMaterial}</div>
          </div>

          {/* Competencies */}
          <div className="step-section">
            <h3>Competencias de Aprendizaje</h3>

            {/* Fixed competencies — with sub-choice inputs where needed */}
            {selectedFaction.aprendizaje.competenciasFijas.length > 0 && (
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                <div className="choice-group-label" style={{ marginBottom: 'var(--space-xs)' }}>Fijas:</div>
                {selectedFaction.aprendizaje.competenciasFijas.map((c, i) => {
                  const sub = getSubChoice(c)
                  if (!sub) {
                    return (
                      <div key={i} className="info-box" style={{ marginBottom: 'var(--space-xs)' }}>
                        {c}
                      </div>
                    )
                  }
                  return (
                    <div key={i} style={{ marginBottom: 'var(--space-sm)' }}>
                      <div className="info-box" style={{ marginBottom: 'var(--space-xs)' }}>
                        {getDisplayLabel(c)}
                      </div>
                      <div style={{ paddingLeft: 'var(--space-sm)', borderLeft: '2px solid var(--color-accent)' }}>
                        <div className="choice-group-label" style={{ marginBottom: 'var(--space-xs)' }}>
                          Especifica subcategoría:
                        </div>
                        {sub.type === 'buttons' ? (
                          <div className="choice-options">
                            {sub.options.map(opt => (
                              <button
                                key={opt}
                                className={`choice-btn ${fixedSubChoices[i] === opt ? 'chosen' : ''}`}
                                onClick={() => setFixedSubChoices(prev => ({ ...prev, [i]: opt }))}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <input
                            type="text"
                            placeholder={sub.placeholder}
                            value={fixedSubChoices[i] ?? ''}
                            onChange={e => setFixedSubChoices(prev => ({ ...prev, [i]: e.target.value }))}
                            style={{ width: '100%', maxWidth: 320 }}
                          />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Choice groups */}
            {selectedFaction.aprendizaje.competenciasEleccion.map((group, gi) => (
              <div key={gi} className="choice-group">
                <div className="choice-group-label">Elige 1 competencia:</div>
                <div className="choice-options">
                  {group.map(c => (
                    <button
                      key={c}
                      className={`choice-btn ${compGroupChoices[gi] === c ? 'chosen' : ''}`}
                      onClick={() => {
                        setCompGroupChoices(prev => {
                          const next = [...prev]
                          next[gi] = c
                          return next
                        })
                        setCompGroupSubChoices(prev => { const next = { ...prev }; delete next[gi]; return next })
                      }}
                    >
                      {getDisplayLabel(c)}
                    </button>
                  ))}
                </div>
                {/* Sub-choice when selected option requires further specification */}
                {compGroupChoices[gi] && (() => {
                  const sub = getSubChoice(compGroupChoices[gi])
                  if (!sub) return null
                  return (
                    <div style={{ marginTop: 'var(--space-xs)', paddingLeft: 'var(--space-sm)', borderLeft: '2px solid var(--color-accent)' }}>
                      <div className="choice-group-label" style={{ marginBottom: 'var(--space-xs)' }}>
                        Especifica subcategoría:
                      </div>
                      {sub.type === 'buttons' ? (
                        <div className="choice-options">
                          {sub.options.map(opt => (
                            <button
                              key={opt}
                              className={`choice-btn ${compGroupSubChoices[gi] === opt ? 'chosen' : ''}`}
                              onClick={() => setCompGroupSubChoices(prev => ({ ...prev, [gi]: opt }))}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder={sub.placeholder}
                          value={compGroupSubChoices[gi] ?? ''}
                          onChange={e => setCompGroupSubChoices(prev => ({ ...prev, [gi]: e.target.value }))}
                          style={{ width: '100%', maxWidth: 320 }}
                        />
                      )}
                    </div>
                  )
                })()}
              </div>
            ))}
          </div>

          {/* Characteristics bonuses with choices */}
          <div className="step-section">
            <h3>Bonificaciones de Características</h3>
            <div className="bonus-list">
              {selectedFaction.aprendizaje.caracteristicas.map((b, i) => {
                const allOptions = b.alternativas ? [b.caracteristica, ...b.alternativas] : [b.caracteristica]
                if (allOptions.length === 1) {
                  const meta = CHARACTERISTICS.find(c => c.key === b.caracteristica)
                  return <div key={i} className="bonus-item bonus-fixed">{meta?.nombre} +{b.valor}</div>
                }
                return (
                  <div key={i} className="bonus-item">
                    <div className="choice-group-label">Elige +{b.valor}:</div>
                    <div className="choice-options">
                      {allOptions.map(opt => {
                        const meta = CHARACTERISTICS.find(c => c.key === opt)
                        return (
                          <button
                            key={opt}
                            className={`choice-btn ${charChoices[i] === opt ? 'chosen' : ''}`}
                            onClick={() => setCharChoices(prev => ({ ...prev, [i]: opt as CharacteristicKey }))}
                          >
                            {meta?.nombre} +{b.valor}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Skills bonuses with choices */}
          <div className="step-section">
            <h3>Bonificaciones de Habilidades</h3>
            <div className="bonus-list">
              {selectedFaction.aprendizaje.habilidades.map((b, i) => {
                const allOptions = b.alternativas ? [b.habilidad, ...b.alternativas] : [b.habilidad]
                if (allOptions.length === 1) {
                  const meta = SKILLS.find(s => s.key === b.habilidad)
                  return <div key={i} className="bonus-item bonus-fixed">{meta?.nombre} +{b.valor}</div>
                }
                return (
                  <div key={i} className="bonus-item">
                    <div className="choice-group-label">Elige +{b.valor}:</div>
                    <div className="choice-options">
                      {allOptions.map(opt => {
                        const meta = SKILLS.find(s => s.key === opt)
                        return (
                          <button
                            key={opt}
                            className={`choice-btn ${skillChoices[i] === opt ? 'chosen' : ''}`}
                            onClick={() => setSkillChoices(prev => ({ ...prev, [i]: opt as SkillKey }))}
                          >
                            {meta?.nombre} +{b.valor}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Benefit */}
          <div className="step-section">
            <h3>Beneficio de Facción</h3>
            <div className="info-box">
              <strong>{selectedFaction.aprendizaje.beneficio}</strong>
            </div>
          </div>

          {/* Preview table */}
          {preview && (
            <div className="step-section">
              <h3>Características acumuladas</h3>
              <CharacteristicsTable current={preview.chars} previous={preStepChars} />
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

      <style>{`
        .bonus-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        .bonus-item {
          padding: var(--space-xs) 0;
        }
        .bonus-fixed {
          padding: var(--space-xs) var(--space-sm);
          background: var(--color-bg-card);
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  )
}
