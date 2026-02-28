import { useState, useEffect } from 'react'
import { VOCATIONS } from '@/data/vocations'
import { FACTIONS } from '@/data/factions'
import { CHARACTERISTICS } from '@/data/characteristics'
import { SKILLS } from '@/data/skills'
import type { CharacteristicKey, SkillKey } from '@/types/character'
import type { SkillBonus } from '@/types/rules'
import { getMaxStatValue } from '@/engine/derived'
import { CharacteristicsTable } from './components/CharacteristicsTable'
import type { StepProps } from './creatorTypes'

export function StepVocation({ draft, updateDraft, goNext, goBack }: StepProps) {
  // Get vocations for this class + free vocations
  // Independiente can choose libre or mercader vocations (PDF p.47)
  const classVocations = VOCATIONS.filter(v => {
    if (!draft.clase) return false
    if (v.libre) return true
    if (v.clase.includes(draft.clase)) return true
    if (draft.clase === 'independiente' && v.clase.includes('mercader')) return true
    return false
  })
  const selectedVocation = VOCATIONS.find(v => v.id === draft.vocacion)
  const selectedFaction = FACTIONS.find(f => f.id === draft.faccion)
  const favoredVocation = selectedFaction?.vocacionFavorecida

  const [compChoices, setCompChoices] = useState<Record<number, string>>({})
  const [skillChoices, setSkillChoices] = useState<Record<number, SkillKey>>({})
  const [benefitChoice, setBenefitChoice] = useState('')
  const [preStepChars] = useState(draft.caracteristicas)

  useEffect(() => {
    if (!selectedVocation) {
      setCompChoices({})
      setSkillChoices({})
      setBenefitChoice('')
      return
    }
    // Auto-select single-option slots
    const autoChoices: Record<number, string> = {}
    selectedVocation.carrera.competencias.forEach((slot, i) => {
      if (slot.length === 1 && slot[0]) autoChoices[i] = slot[0]
    })
    setCompChoices(autoChoices)
    setSkillChoices({})
    setBenefitChoice('')
  }, [draft.vocacion])

  function selectVocation(id: string) {
    updateDraft({ vocacion: id })
  }

  function resolveSkillBonuses(): { key: SkillKey; value: number }[] {
    if (!selectedVocation) return []
    return selectedVocation.carrera.habilidades.map((b, i) => {
      if (b.alternativas && b.alternativas.length > 0) {
        const chosen = skillChoices[i]
        return { key: chosen || b.habilidad, value: b.valor }
      }
      return { key: b.habilidad, value: b.valor }
    })
  }

  function computeNewStats() {
    if (!selectedVocation) return null

    const chars = { ...draft.caracteristicas }
    for (const b of selectedVocation.carrera.caracteristicas) {
      chars[b.caracteristica] += b.valor
    }

    const skills = { ...draft.habilidades }
    for (const b of resolveSkillBonuses()) {
      skills[b.key] += b.value
    }

    return { chars, skills }
  }

  function handleNext() {
    if (!selectedVocation) return
    const result = computeNewStats()
    if (!result) return

    const maxVal = getMaxStatValue(1)

    // Cap excess
    const chars = { ...result.chars }
    for (const key of Object.keys(chars) as CharacteristicKey[]) {
      if (chars[key] > maxVal) chars[key] = maxVal
    }
    const skills = { ...result.skills }
    for (const key of Object.keys(skills) as SkillKey[]) {
      if (skills[key] > maxVal) skills[key] = maxVal
    }

    const newComps = [
      ...draft.competencias,
      ...selectedVocation.carrera.competencias.map((_, i) => ({
        nombre: compChoices[i] ?? '',
        origen: 'Vocación',
      })).filter(c => c.nombre),
    ]

    const newBenefits = [...draft.beneficios]
    if (benefitChoice) {
      newBenefits.push({
        nombre: benefitChoice,
        tipo: 'Vocación',
        origen: 'Vocación',
        descripcion: `Beneficio de vocación ${selectedVocation.nombre}`,
      })
    }

    updateDraft({
      caracteristicas: chars,
      habilidades: skills,
      competencias: newComps,
      beneficios: newBenefits,
      equipoVocacion: selectedVocation.carrera.equipo,
    })
    goNext()
  }

  const allSkillChoicesMade = !selectedVocation || (
    selectedVocation.carrera.habilidades.every((b, i) =>
      !b.alternativas || b.alternativas.length === 0 || skillChoices[i]
    )
  )

  const allCompChoicesMade = !selectedVocation || (
    selectedVocation.carrera.competencias.every((_, i) => compChoices[i])
  )

  const canProceed =
    draft.vocacion !== '' &&
    allCompChoicesMade &&
    allSkillChoicesMade &&
    benefitChoice !== ''

  const preview = computeNewStats()

  return (
    <div>
      <h2 className="step-title">Paso 4: Vocación (Carrera Temprana)</h2>

      <div className="step-section">
        <h3>Elige tu vocación</h3>
        {favoredVocation && (
          <div className="info-box" style={{ marginBottom: 'var(--space-sm)' }}>
            Vocación favorecida por tu facción: <strong>{favoredVocation}</strong>
          </div>
        )}
        <div className="card-grid">
          {classVocations.map(v => (
            <button
              key={v.id}
              className={`selectable-card ${draft.vocacion === v.id ? 'selected' : ''}`}
              onClick={() => selectVocation(v.id)}
              style={v.nombre === favoredVocation ? { borderColor: 'var(--color-success)' } : undefined}
            >
              <h4>
                {v.nombre}
                {v.libre && <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}> (libre)</span>}
                {v.nombre === favoredVocation && <span style={{ fontSize: '0.7rem', color: 'var(--color-success)' }}> ★</span>}
              </h4>
              <p>{v.descripcion}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedVocation && (
        <>
          {/* Competencies */}
          <div className="step-section">
            <h3>Competencias de Vocación</h3>
            {selectedVocation.carrera.competencias.map((slot, slotIdx) => (
              <div key={slotIdx} className="choice-group" style={{ marginBottom: 'var(--space-sm)' }}>
                <div className="choice-group-label">
                  Competencia {slotIdx + 1}
                  {slot.length > 1 ? ' — elige 1:' : ':'}
                </div>
                <div className="choice-options">
                  {slot.map(option => (
                    <button
                      key={option}
                      className={`choice-btn ${compChoices[slotIdx] === option ? 'chosen' : ''}`}
                      onClick={() => setCompChoices(prev => ({ ...prev, [slotIdx]: option }))}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
              Seleccionadas: {Object.keys(compChoices).length}/{selectedVocation.carrera.competencias.length}
            </div>
          </div>

          {/* Characteristic bonuses */}
          <div className="step-section">
            <h3>Bonificaciones de Características</h3>
            <div className="info-box">
              {selectedVocation.carrera.caracteristicas.map(b => {
                const meta = CHARACTERISTICS.find(c => c.key === b.caracteristica)
                return `${meta?.nombre} +${b.valor}`
              }).join(', ')}
            </div>
          </div>

          {/* Skill bonuses */}
          <div className="step-section">
            <h3>Bonificaciones de Habilidades</h3>
            {selectedVocation.carrera.habilidades.map((bonus, i) => (
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
            <h3>Beneficio de Vocación</h3>
            <div className="choice-group">
              <div className="choice-group-label">Elige 1 beneficio:</div>
              <div className="choice-options">
                {selectedVocation.carrera.beneficios.map(b => (
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

          {/* Equipment */}
          <div className="step-section">
            <h3>Equipo de Vocación</h3>
            <div className="info-box">
              {selectedVocation.carrera.equipo.join(', ')}
            </div>
          </div>

          {/* Preview table */}
          {preview && (
            <div className="step-section">
              <h3>Características acumuladas</h3>
              <CharacteristicsTable
                current={preview.chars}
                previous={preStepChars}
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
