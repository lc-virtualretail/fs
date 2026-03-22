import { useState, useMemo } from 'react'
import type { StepProps } from './creatorTypes'
import { createEmptyLevelUpChoice } from './creatorTypes'
import type { LevelUpChoice } from './creatorTypes'
import type { CharacteristicKey, SkillKey, Characteristics, Skills } from '@/types/character'
import { resolveWithSub } from './competencyUtils'
import { LevelUpPanel, isLevelUpComplete } from './LevelUpPanel'

export function StepLevelUp({ draft, updateDraft, goNext, goBack }: StepProps) {
  const [targetLevel, setTargetLevel] = useState(draft.nivelObjetivo || 1)
  const [levelChoices, setLevelChoices] = useState<LevelUpChoice[]>(
    () => draft.levelUpChoices.length > 0
      ? draft.levelUpChoices
      : []
  )

  // Base snapshot: state after customization + excess redistribution, already baked in
  const [baseSnapshot] = useState(() => draft._snapshotPreLevelUp ?? {
    caracteristicas: { ...draft.caracteristicas },
    habilidades: { ...draft.habilidades },
    competencias: [...draft.competencias],
    beneficios: [...draft.beneficios],
  })

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
   *
   * Since customization picks (freeComp, freeBenefit, affliction, extraBenefit) are already
   * baked into _snapshotPreLevelUp, we just use the snapshot directly.
   */
  const cumulativeStates = useMemo(() => {
    const snapshotChars = baseSnapshot.caracteristicas as Characteristics
    const snapshotSkills = baseSnapshot.habilidades as Skills

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
        if (lc.vocationBenefit && !lc.vocationBenefit.endsWith(': ')) cumBenefits.push(lc.vocationBenefit)
        if (lc.classBenefit && !lc.classBenefit.endsWith(': ')) cumBenefits.push(lc.classBenefit)
      }
    }
    return states
  }, [baseSnapshot, levelChoices])

  const allLevelsComplete = levelChoices.length === 0 || levelChoices.every(lc => isLevelUpComplete(lc))

  function handleNext() {
    if (targetLevel <= 1) {
      // No level-up, just save defaults and proceed
      updateDraft({
        nivelObjetivo: 1,
        levelUpChoices: [],
      })
      goNext()
      return
    }

    // Merge level-up bonuses into stats, competencies, benefits
    const finalChars = { ...baseSnapshot.caracteristicas } as Characteristics
    const finalSkills = { ...baseSnapshot.habilidades } as Skills
    const newComps = [...baseSnapshot.competencias]
    const newBenefits = [...baseSnapshot.beneficios]

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
      nivelObjetivo: targetLevel,
      levelUpChoices: levelChoices,
    })
    goNext()
  }

  const canProceed = allLevelsComplete

  return (
    <div>
      <h2 className="step-title">Paso 6: Nivel Objetivo</h2>

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
              chosenBenefits={state.benefitNames}
              claseId={draft.clase}
              vocacionId={draft.vocacion}
              oculto={(() => {
                const basePsi = (draft.donIluminacion === 'psi' || draft.especie === 'ur-ukar') ? 1 : 0
                const baseTeurgia = draft.donIluminacion === 'teurgia' ? 1 : 0
                if (!basePsi && !baseTeurgia) return undefined
                // Accumulate psi/teurgia from previous levels
                let cumPsi = basePsi
                let cumTeurgia = baseTeurgia
                for (let j = 0; j < i; j++) {
                  const prev = levelChoices[j]
                  if (prev) {
                    cumPsi += prev.psiBonus ?? 0
                    cumTeurgia += prev.teurgiaBonus ?? 0
                  }
                }
                return { psi: cumPsi, ansia: 0, teurgia: cumTeurgia, hubris: 0 }
              })()}
              especieId={draft.especie}
              donIluminacion={draft.donIluminacion}
            />
          ) : null
        })}
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
