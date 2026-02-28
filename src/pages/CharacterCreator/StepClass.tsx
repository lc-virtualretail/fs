import { useState, useEffect } from 'react'
import { CLASSES } from '@/data/classes'
import { CHARACTERISTICS } from '@/data/characteristics'
import { SKILLS } from '@/data/skills'
import type { CharacteristicKey, SkillKey } from '@/types/character'
import type { CharacteristicBonus, SkillBonus } from '@/types/rules'
import { CharacteristicsTable } from './components/CharacteristicsTable'
import type { StepProps } from './creatorTypes'

export function StepClass({ draft, updateDraft, goNext, goBack }: StepProps) {
  const selectedClass = CLASSES.find(c => c.id === draft.clase)

  // Track choices for this step
  const [compChoices, setCompChoices] = useState<string[]>([]) // one per competenciasEleccion group
  const [charChoices, setCharChoices] = useState<Record<number, CharacteristicKey>>({})
  const [skillChoices, setSkillChoices] = useState<Record<number, SkillKey>>({})
  const [benefitChoice, setBenefitChoice] = useState<string>('')
  const [preClassChars] = useState(draft.caracteristicas)

  // Reset choices when class changes
  useEffect(() => {
    setCompChoices([])
    setCharChoices({})
    setSkillChoices({})
    setBenefitChoice('')
  }, [draft.clase])

  function selectClass(id: string) {
    updateDraft({ clase: id as typeof draft.clase })
  }

  function resolveCharBonuses(): { key: CharacteristicKey; value: number }[] {
    if (!selectedClass) return []
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

    const skills = { ...draft.habilidades }
    for (const b of resolveSkillBonuses()) {
      skills[b.key] += b.value
    }

    return { chars, skills }
  }

  function handleNext() {
    if (!selectedClass) return
    const { chars, skills } = computeNewStats()

    // Build competencies list
    const newComps = [
      ...draft.competencias,
      ...selectedClass.educacion.competenciasFijas.map(c => ({ nombre: c, origen: 'Educación' })),
      ...compChoices.filter(Boolean).map(c => ({ nombre: c, origen: 'Educación' })),
    ]

    // Build benefits list
    const newBenefits = [
      ...draft.beneficios,
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
    })
    goNext()
  }

  // Check if all required choices are made
  const allCompChoicesMade = !selectedClass || (
    selectedClass.educacion.competenciasEleccion.every((_, i) => compChoices[i])
  )
  const allCharChoicesMade = !selectedClass || (
    selectedClass.educacion.caracteristicas.every((b, i) =>
      !b.alternativas || b.alternativas.length === 0 || charChoices[i]
    )
  )
  const allSkillChoicesMade = !selectedClass || (
    selectedClass.educacion.habilidades.every((b, i) =>
      !b.alternativas || b.alternativas.length === 0 || skillChoices[i]
    )
  )

  const canProceed = draft.clase !== '' && allCompChoicesMade && allCharChoicesMade && allSkillChoicesMade && benefitChoice !== ''

  const preview = draft.clase ? computeNewStats() : null

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
              <strong>Fijas:</strong> {selectedClass.educacion.competenciasFijas.join(', ')}
            </div>
            {selectedClass.educacion.competenciasEleccion.map((group, gi) => (
              <div className="choice-group" key={gi}>
                <div className="choice-group-label">Elige una:</div>
                <div className="choice-options">
                  {group.map(opt => (
                    <button
                      key={opt}
                      className={`choice-btn ${compChoices[gi] === opt ? 'chosen' : ''}`}
                      onClick={() => {
                        const next = [...compChoices]
                        next[gi] = opt
                        setCompChoices(next)
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Characteristic bonuses */}
          <div className="step-section">
            <h3>Bonificaciones de Características</h3>
            {selectedClass.educacion.caracteristicas.map((bonus, i) => (
              <CharBonusRow
                key={i}
                bonus={bonus}
                chosen={charChoices[i]}
                onChoose={(key) => setCharChoices(prev => ({ ...prev, [i]: key }))}
              />
            ))}
          </div>

          {/* Skill bonuses */}
          <div className="step-section">
            <h3>Bonificaciones de Habilidades</h3>
            {selectedClass.educacion.habilidades.map((bonus, i) => (
              <SkillBonusRow
                key={i}
                bonus={bonus}
                chosen={skillChoices[i]}
                onChoose={(key) => setSkillChoices(prev => ({ ...prev, [i]: key }))}
              />
            ))}
          </div>

          {/* Benefit choice */}
          <div className="step-section">
            <h3>Beneficios</h3>
            <div className="info-box" style={{ marginBottom: 'var(--space-sm)' }}>
              <strong>Automático:</strong> {selectedClass.educacion.beneficioArquetipico} (arquetípico)
            </div>
            <div className="choice-group">
              <div className="choice-group-label">Elige 1 beneficio de clase:</div>
              <div className="choice-options">
                {selectedClass.educacion.beneficiosDeClase
                  .filter(b => b !== selectedClass.educacion.beneficioArquetipico)
                  .map(b => (
                    <button
                      key={b}
                      className={`choice-btn ${benefitChoice === b ? 'chosen' : ''}`}
                      onClick={() => setBenefitChoice(b)}
                    >
                      {b}
                    </button>
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

function CharBonusRow({ bonus, chosen, onChoose }: {
  bonus: CharacteristicBonus
  chosen: CharacteristicKey | undefined
  onChoose: (key: CharacteristicKey) => void
}) {
  const meta = CHARACTERISTICS.find(c => c.key === bonus.caracteristica)

  if (!bonus.alternativas || bonus.alternativas.length === 0) {
    return (
      <div className="info-box" style={{ marginBottom: 'var(--space-sm)' }}>
        {meta?.nombre} +{bonus.valor} (fijo)
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
            <button
              key={key}
              className={`choice-btn ${chosen === key ? 'chosen' : ''}`}
              onClick={() => onChoose(key)}
            >
              {m?.nombre} ({m?.abreviatura})
            </button>
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
        {meta?.nombre} +{bonus.valor} (fijo)
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
            <button
              key={key}
              className={`choice-btn ${chosen === key ? 'chosen' : ''}`}
              onClick={() => onChoose(key)}
            >
              {m?.nombre}
            </button>
          )
        })}
      </div>
    </div>
  )
}
