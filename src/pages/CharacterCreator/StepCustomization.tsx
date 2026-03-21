import { useState, useMemo } from 'react'
import { CLASSES } from '@/data/classes'
import { VOCATIONS } from '@/data/vocations'
import { ALL_COMPETENCIES } from '@/data/competencies'
import type { StepProps } from './creatorTypes'
import { createEmptyLevelUpChoice } from './creatorTypes'
import type { LevelUpChoice } from './creatorTypes'
import type { CharacteristicKey, SkillKey, Characteristics, Skills } from '@/types/character'
import { getSubChoice, getDisplayLabel, resolveWithSub } from './competencyUtils'
import { LevelUpPanel, isLevelUpComplete } from './LevelUpPanel'
import { Tooltip } from '@/components/ui/Tooltip'
import { BENEFIT_TOOLTIPS, COMPETENCY_TOOLTIPS } from '@/data/tooltips'

// Common free benefits available to all characters
const FREE_BENEFITS = [
  'Agilidad', 'Aliado', 'Artes Marciales', 'Autónomo', 'Autoridad',
  'Campeón', 'Contacto', 'Contactos Criminales', 'Dos Pistolas', 'Esgrima',
  'Imperioso', 'Influyente', 'Ingenioso', 'Inspirador', 'Mano Firme',
  'Nobleza Obliga', 'Red de Cotilleos', 'Reputación Profesional',
  'Riqueza', 'Sentido del Peligro', 'Sirviente',
]

// Common afflictions
const AFFLICTIONS = [
  'Adicción', 'Cobardía', 'Curiosidad Compulsiva', 'Deuda',
  'Devoción Fanática', 'Enemigo', 'Fobia', 'Impulsivo',
  'Juramento', 'Lisiado', 'Marcado', 'Obsesión',
  'Pesadillas', 'Secreto Oscuro', 'Vengativo',
]

export function StepCustomization({ draft, updateDraft, goNext, goBack }: StepProps) {
  const [freeComp, setFreeComp] = useState(draft.freeCompetency)
  const [freeCompSub, setFreeCompSub] = useState('')
  const [freeBenefit, setFreeBenefit] = useState(draft.freeBenefit)
  const [affliction, setAffliction] = useState(draft.afliccion)
  const [extraBenefit, setExtraBenefit] = useState(draft.extraBenefit)

  // Level-up state
  const [targetLevel, setTargetLevel] = useState(draft.nivelObjetivo || 1)
  const [levelChoices, setLevelChoices] = useState<LevelUpChoice[]>(
    () => draft.levelUpChoices.length > 0
      ? draft.levelUpChoices
      : []
  )

  // Snapshot: species+class+faction+vocation state (saved by StepVocation). Stable base for backtracking.
  const [baseSnapshot] = useState(() => draft._snapshotPreCustomization ?? {
    caracteristicas: { ...draft.caracteristicas },
    habilidades: { ...draft.habilidades },
    competencias: [...draft.competencias],
    beneficios: [...draft.beneficios],
  })

  // Get all available benefits (class + vocation + free)
  const selectedClass = CLASSES.find(c => c.id === draft.clase)
  const selectedVocation = VOCATIONS.find(v => v.id === draft.vocacion)
  const allBenefits = [
    ...new Set([
      ...FREE_BENEFITS,
      ...(selectedClass?.educacion.beneficiosDeClase ?? []),
      ...(selectedVocation?.carrera.beneficios ?? []),
    ]),
  ].sort()

  // Exclude already-chosen benefits (use snapshot base, not draft which may have stale data)
  const chosenBenefitNames = baseSnapshot.beneficios.map(b => b.nombre)
  const availableBenefits = allBenefits.filter(b => !chosenBenefitNames.includes(b))

  // Available competencies: filter out already-chosen ones
  const chosenCompNames = baseSnapshot.competencias.map(c => c.nombre)
  const availableComps = ALL_COMPETENCIES.filter(c => {
    const resolved = resolveWithSub(c, undefined)
    return !chosenCompNames.includes(resolved)
  })

  // Resolved free competency name
  const resolvedFreeComp = freeComp ? resolveWithSub(freeComp, freeCompSub || undefined) : ''
  const freeCompSubChoice = freeComp ? getSubChoice(freeComp) : null

  // --- Level-up helpers ---
  function handleTargetLevelChange(newTarget: number) {
    const clamped = Math.max(1, newTarget)
    setTargetLevel(clamped)
    if (clamped <= 1) {
      setLevelChoices([])
    } else {
      setLevelChoices(prev => {
        const result: LevelUpChoice[] = []
        for (let lvl = 2; lvl <= clamped; lvl++) {
          const existing = prev.find(c => c.level === lvl)
          result.push(existing ?? createEmptyLevelUpChoice(lvl))
        }
        return result
      })
    }
  }

  function updateLevelChoice(index: number, updated: LevelUpChoice) {
    setLevelChoices(prev => {
      const copy = [...prev]
      copy[index] = updated
      return copy
    })
  }

  /**
   * Compute cumulative chars/skills/competencies/benefits up to (but not including) a given level index.
   * This lets each LevelUpPanel enforce the correct stat cap at its level.
   */
  const cumulativeStates = useMemo(() => {
    const snapshotChars = (baseSnapshot as { caracteristicas?: Characteristics }).caracteristicas ?? draft.caracteristicas
    const snapshotSkills = (baseSnapshot as { habilidades?: Skills }).habilidades ?? draft.habilidades

    const states: {
      chars: Characteristics
      skills: Skills
      compNames: string[]
      benefitNames: string[]
    }[] = []

    let cumChars = { ...snapshotChars }
    let cumSkills = { ...snapshotSkills }
    let cumComps = [...baseSnapshot.competencias.map(c => c.nombre)]
    let cumBenefits = [...baseSnapshot.beneficios.map(b => b.nombre)]

    // Add customization-level picks to the base
    if (resolvedFreeComp) cumComps.push(resolvedFreeComp)
    if (freeBenefit) cumBenefits.push(freeBenefit)
    if (affliction && extraBenefit) cumBenefits.push(extraBenefit)

    for (let i = 0; i < levelChoices.length; i++) {
      // State BEFORE this level applies
      states.push({
        chars: { ...cumChars },
        skills: { ...cumSkills },
        compNames: [...cumComps],
        benefitNames: [...cumBenefits],
      })

      // Apply this level's bonuses for the next iteration
      const lc = levelChoices[i]
      if (lc) {
        for (const [key, val] of Object.entries(lc.charBonuses)) {
          if (val) cumChars = { ...cumChars, [key]: cumChars[key as CharacteristicKey] + val }
        }
        for (const [key, val] of Object.entries(lc.skillBonuses)) {
          if (val) cumSkills = { ...cumSkills, [key]: cumSkills[key as SkillKey] + val }
        }
        const resolvedLvComp = lc.competency
          ? resolveWithSub(lc.competency, lc.competencySub || undefined)
          : ''
        if (resolvedLvComp) cumComps.push(resolvedLvComp)
        if (lc.vocationBenefit) cumBenefits.push(lc.vocationBenefit)
        if (lc.classBenefit) cumBenefits.push(lc.classBenefit)
      }
    }
    return states
  }, [baseSnapshot, draft.caracteristicas, draft.habilidades, levelChoices, resolvedFreeComp, freeBenefit, affliction, extraBenefit])

  const allLevelsComplete = levelChoices.every(isLevelUpComplete)

  function handleNext() {
    const newComps = [...baseSnapshot.competencias]
    if (resolvedFreeComp) {
      newComps.push({ nombre: resolvedFreeComp, origen: 'Personalización' })
    }

    const newBenefits = [...baseSnapshot.beneficios]
    if (freeBenefit) {
      newBenefits.push({
        nombre: freeBenefit,
        tipo: 'Libre',
        origen: 'Personalización',
        descripcion: 'Beneficio libre de personalización',
      })
    }
    if (affliction && extraBenefit) {
      newBenefits.push({
        nombre: extraBenefit,
        tipo: 'Libre',
        origen: 'Personalización (aflicción)',
        descripcion: `Beneficio extra por aflicción: ${affliction}`,
      })
    }

    // Merge level-up bonuses into stats, competencies, benefits
    const snapshotChars = (baseSnapshot as { caracteristicas?: Characteristics }).caracteristicas ?? draft.caracteristicas
    const snapshotSkills = (baseSnapshot as { habilidades?: Skills }).habilidades ?? draft.habilidades
    const finalChars = { ...snapshotChars }
    const finalSkills = { ...snapshotSkills }

    for (const lc of levelChoices) {
      for (const [key, val] of Object.entries(lc.charBonuses)) {
        if (val) finalChars[key as CharacteristicKey] += val
      }
      for (const [key, val] of Object.entries(lc.skillBonuses)) {
        if (val) finalSkills[key as SkillKey] += val
      }
      const resolvedLvComp = lc.competency
        ? resolveWithSub(lc.competency, lc.competencySub || undefined)
        : ''
      if (resolvedLvComp) {
        newComps.push({ nombre: resolvedLvComp, origen: `Nivel ${lc.level}` })
      }
      if (lc.vocationBenefit) {
        newBenefits.push({
          nombre: lc.vocationBenefit,
          tipo: 'Vocación',
          origen: `Nivel ${lc.level}`,
          descripcion: `Beneficio de vocación (nivel ${lc.level})`,
        })
      }
      if (lc.classBenefit) {
        newBenefits.push({
          nombre: lc.classBenefit,
          tipo: 'Clase',
          origen: `Nivel ${lc.level}`,
          descripcion: `Beneficio de clase (nivel ${lc.level})`,
        })
      }
    }

    updateDraft({
      caracteristicas: finalChars,
      habilidades: finalSkills,
      competencias: newComps,
      beneficios: newBenefits,
      freeCompetency: resolvedFreeComp,
      freeBenefit,
      afliccion: affliction,
      extraBenefit,
      nivelObjetivo: targetLevel,
      levelUpChoices: levelChoices,
    })
    goNext()
  }

  const freeCompComplete = freeComp !== '' && (freeCompSubChoice === null || !!freeCompSub)
  const canProceed = freeCompComplete && freeBenefit !== '' && allLevelsComplete

  return (
    <div>
      <h2 className="step-title">Paso 5: Personalización y Equipo</h2>

      {/* Free competency */}
      <div className="step-section">
        <h3>Competencia libre</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>
          Elige 1 competencia sin restricciones. Puede ser cualquiera que no tengas ya.
        </p>
        <div className="choice-options" style={{ flexWrap: 'wrap' }}>
          {availableComps.map(c => (
            <Tooltip key={c} text={COMPETENCY_TOOLTIPS[c]}>
              <button
                className={`choice-btn ${freeComp === c ? 'chosen' : ''}`}
                onClick={() => { setFreeComp(c); setFreeCompSub('') }}
              >
                {getDisplayLabel(c)}
              </button>
            </Tooltip>
          ))}
        </div>
        {freeCompSubChoice && (
          <div style={{ marginTop: 'var(--space-sm)', paddingLeft: 'var(--space-sm)', borderLeft: '2px solid var(--color-accent)' }}>
            <div className="choice-group-label" style={{ marginBottom: 'var(--space-xs)' }}>
              Especifica subcategoría:
            </div>
            {freeCompSubChoice.type === 'buttons' ? (
              <div className="choice-options" style={{ flexWrap: 'wrap' }}>
                {freeCompSubChoice.options.map(opt => (
                  <Tooltip key={opt} text={COMPETENCY_TOOLTIPS[opt]}>
                    <button
                      className={`choice-btn ${freeCompSub === opt ? 'chosen' : ''}`}
                      onClick={() => setFreeCompSub(opt)}
                    >
                      {opt}
                    </button>
                  </Tooltip>
                ))}
              </div>
            ) : (
              <input
                type="text"
                placeholder={freeCompSubChoice.placeholder}
                value={freeCompSub}
                onChange={e => setFreeCompSub(e.target.value)}
                style={{ width: '100%', maxWidth: 320 }}
              />
            )}
          </div>
        )}
      </div>

      {/* Free benefit */}
      <div className="step-section">
        <h3>Beneficio libre</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>
          Elige 1 beneficio de cualquier lista (clase, vocación o libre).
        </p>
        <div className="choice-options" style={{ flexWrap: 'wrap' }}>
          {availableBenefits.map(b => (
            <Tooltip key={b} text={BENEFIT_TOOLTIPS[b]}>
              <button
                className={`choice-btn ${freeBenefit === b ? 'chosen' : ''}`}
                onClick={() => setFreeBenefit(b)}
              >
                {b}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Affliction (optional) */}
      <div className="step-section">
        <h3>Aflicción (opcional)</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>
          Si eliges una aflicción, ganas 1 beneficio adicional.
        </p>
        <div className="choice-options" style={{ flexWrap: 'wrap' }}>
          <button
            className={`choice-btn ${affliction === '' ? 'chosen' : ''}`}
            onClick={() => { setAffliction(''); setExtraBenefit('') }}
          >
            Sin aflicción
          </button>
          {AFFLICTIONS.map(a => (
            <Tooltip key={a} text={BENEFIT_TOOLTIPS[a]}>
              <button
                className={`choice-btn ${affliction === a ? 'chosen' : ''}`}
                onClick={() => setAffliction(a)}
              >
                {a}
              </button>
            </Tooltip>
          ))}
        </div>

        {affliction && (
          <div style={{ marginTop: 'var(--space-md)' }}>
            <div className="choice-group-label">Beneficio extra (por aflicción):</div>
            <div className="choice-options" style={{ flexWrap: 'wrap' }}>
              {availableBenefits
                .filter(b => b !== freeBenefit)
                .map(b => (
                  <Tooltip key={b} text={BENEFIT_TOOLTIPS[b]}>
                    <button
                      className={`choice-btn ${extraBenefit === b ? 'chosen' : ''}`}
                      onClick={() => setExtraBenefit(b)}
                    >
                      {b}
                    </button>
                  </Tooltip>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Level-up (optional) */}
      <div className="step-section">
        <h3>Nivel objetivo (opcional)</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>
          Por defecto se crea un personaje de nivel 1. Si deseas un nivel superior, indica el nivel objetivo.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <label htmlFor="target-level" style={{ fontWeight: 'bold' }}>Nivel:</label>
          <input
            id="target-level"
            type="number"
            min={1}
            value={targetLevel}
            onChange={e => handleTargetLevelChange(parseInt(e.target.value) || 1)}
            style={{ width: 70, textAlign: 'center' }}
          />
        </div>
        {levelChoices.map((lc, i) => {
          const state = cumulativeStates[i]
          return state ? (
            <LevelUpPanel
              key={lc.level}
              choice={lc}
              onChange={updated => updateLevelChoice(i, updated)}
              baseChars={state.chars}
              baseSkills={state.skills}
              chosenCompetencies={state.compNames}
              claseId={draft.clase}
              vocacionId={draft.vocacion}
            />
          ) : null
        })}
      </div>

      {/* Equipment & money summary */}
      <div className="step-section">
        <h3>Equipo y Dinero</h3>
        <div className="info-box">
          <p><strong>Dinero inicial:</strong> 300 fénix</p>
          {draft.premioMaterial && (
            <p style={{ marginTop: 4 }}><strong>Premio de facción:</strong> {draft.premioMaterial}</p>
          )}
          {draft.equipoVocacion.length > 0 && (
            <p style={{ marginTop: 4 }}><strong>Equipo de vocación:</strong> {draft.equipoVocacion.join(', ')}</p>
          )}
          <p style={{ marginTop: 4, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Armas: 1 por cada competencia de arma. Las de energía con calidad mediocre + 1 célula de fusión.
            Armadura según competencias de armadura adquiridas.
          </p>
        </div>
      </div>

      {/* Current benefits summary */}
      <div className="step-section">
        <h3>Beneficios acumulados</h3>
        <div className="info-box">
          {baseSnapshot.beneficios.map((b, i) => (
            <div key={i} style={{ marginBottom: 2 }}>
              <Tooltip text={BENEFIT_TOOLTIPS[b.nombre]}><strong>{b.nombre}</strong></Tooltip>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}> ({b.origen})</span>
            </div>
          ))}
          {freeBenefit && (
            <div style={{ marginBottom: 2 }}>
              <strong>{freeBenefit}</strong>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}> (Personalización)</span>
            </div>
          )}
          {affliction && extraBenefit && (
            <div>
              <strong>{extraBenefit}</strong>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}> (Aflicción: {affliction})</span>
            </div>
          )}
        </div>
      </div>

      {/* Competencies summary */}
      <div className="step-section">
        <h3>Competencias acumuladas</h3>
        <div className="info-box">
          {baseSnapshot.competencias.map((c, i) => (
            <span key={i}>
              <Tooltip text={COMPETENCY_TOOLTIPS[c.nombre]}>{c.nombre}</Tooltip>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}> ({c.origen})</span>
              {i < baseSnapshot.competencias.length - 1 ? ' · ' : ''}
            </span>
          ))}
          {freeComp.trim() && (
            <span>
              {baseSnapshot.competencias.length > 0 ? ' · ' : ''}
              {freeComp.trim()}
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}> (Personalización)</span>
            </span>
          )}
        </div>
      </div>

      <div className="step-nav">
        <button className="btn btn-back" onClick={goBack}>← Atrás</button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={handleNext} disabled={!canProceed}>
          Ver Resumen →
        </button>
      </div>
    </div>
  )
}
