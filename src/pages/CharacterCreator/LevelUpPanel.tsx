import { useState } from 'react'
import { CHARACTERISTICS } from '@/data/characteristics'
import { SKILLS } from '@/data/skills'
import { ALL_COMPETENCIES } from '@/data/competencies'
import { CLASSES } from '@/data/classes'
import { VOCATIONS } from '@/data/vocations'
import { getMaxStatValue } from '@/engine/derived'
import { Tooltip } from '@/components/ui/Tooltip'
import { BENEFIT_TOOLTIPS, COMPETENCY_TOOLTIPS, CHARACTERISTIC_TOOLTIPS, SKILL_TOOLTIPS } from '@/data/tooltips'
import { getSubChoice, getDisplayLabel, resolveWithSub } from './competencyUtils'
import type { LevelUpChoice } from './creatorTypes'
import { getLevelBudget } from './creatorTypes'
import type { CharacteristicKey, SkillKey, Characteristics, Skills } from '@/types/character'

interface OcultoState {
  psi: number
  ansia: number
  teurgia: number
  hubris: number
}

interface LevelUpPanelProps {
  choice: LevelUpChoice
  onChange: (updated: LevelUpChoice) => void
  /** Cumulative characteristics BEFORE this level's bonuses */
  baseChars: Characteristics
  /** Cumulative skills BEFORE this level's bonuses */
  baseSkills: Skills
  /** All competency names already chosen (base + previous levels) */
  chosenCompetencies: string[]
  claseId: string
  vocacionId: string
  /** Oculto state (cumulative before this level) for Psi/Teurgia distribution */
  oculto?: OcultoState
}

export function LevelUpPanel({
  choice,
  onChange,
  baseChars,
  baseSkills,
  chosenCompetencies,
  claseId,
  vocacionId,
  oculto,
}: LevelUpPanelProps) {
  const [open, setOpen] = useState(true)

  const level = choice.level
  const budget = getLevelBudget(level)
  const maxVal = getMaxStatValue(level)

  const selectedClass = CLASSES.find(c => c.id === claseId)
  const selectedVocation = VOCATIONS.find(v => v.id === vocacionId)

  // --- Characteristic distribution (includes psi/teurgia from same budget) ---
  const charTotal = Object.values(choice.charBonuses).reduce((s, v) => s + (v ?? 0), 0)
    + (choice.psiBonus ?? 0) + (choice.teurgiaBonus ?? 0)
  const charRemaining = budget.charPoints - charTotal

  // --- Psi/Teurgia availability ---
  const hasPsi = (oculto?.psi ?? 0) > 0
  const hasTeurgia = (oculto?.teurgia ?? 0) > 0
  const currentPsi = (oculto?.psi ?? 0) + (choice.psiBonus ?? 0)
  const currentTeurgia = (oculto?.teurgia ?? 0) + (choice.teurgiaBonus ?? 0)
  const maxPsi = 10 - (oculto?.ansia ?? 0)
  const maxTeurgia = 10 - (oculto?.hubris ?? 0)

  // --- Skill distribution ---
  const skillTotal = Object.values(choice.skillBonuses).reduce((s, v) => s + (v ?? 0), 0)
  const skillRemaining = budget.skillPoints - skillTotal

  // --- Competency ---
  const compSubChoice = choice.competency ? getSubChoice(choice.competency) : null

  const availableComps = ALL_COMPETENCIES.filter(c => {
    const resolved = resolveWithSub(c, undefined)
    return !chosenCompetencies.includes(resolved)
  })

  // --- Benefits ---
  const vocationBenefits = selectedVocation?.carrera.beneficios ?? []
  const classBenefits = selectedClass?.educacion.beneficiosDeClase ?? []

  // --- Completion check ---
  const charComplete = charRemaining === 0
  const skillComplete = skillRemaining === 0
  const compComplete = choice.competency !== '' && (compSubChoice === null || !!choice.competencySub)
  const vocBenComplete = choice.vocationBenefit !== ''
  const clsBenComplete = !budget.hasClassBenefit || choice.classBenefit !== ''
  const isComplete = charComplete && skillComplete && compComplete && vocBenComplete && clsBenComplete

  function updateChar(key: CharacteristicKey, delta: number) {
    const prev = choice.charBonuses[key] ?? 0
    onChange({
      ...choice,
      charBonuses: { ...choice.charBonuses, [key]: prev + delta },
    })
  }

  function updateSkill(key: SkillKey, delta: number) {
    const prev = choice.skillBonuses[key] ?? 0
    onChange({
      ...choice,
      skillBonuses: { ...choice.skillBonuses, [key]: prev + delta },
    })
  }

  return (
    <div className="levelup-panel">
      <button
        className="levelup-header"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className="levelup-title">
          Nivel {level}
          <span className="levelup-budget-hint">
            ({budget.charPoints} car. / {budget.skillPoints} hab.
            {budget.hasClassBenefit ? ' / ben. clase' : ''})
          </span>
        </span>
        <span className={`levelup-status ${isComplete ? 'complete' : 'incomplete'}`}>
          {isComplete ? '\u2713' : `${[charComplete, skillComplete, compComplete, vocBenComplete, clsBenComplete].filter(Boolean).length}/5`}
        </span>
        <span className="levelup-chevron">{open ? '\u25B2' : '\u25BC'}</span>
      </button>

      {open && (
        <div className="levelup-body">
          {/* Characteristic points */}
          <div className="levelup-section">
            <h4 className="levelup-section-title">
              Características —{' '}
              <span style={{ color: charRemaining > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                {charRemaining} punto(s) por asignar
              </span>
            </h4>
            <div className="redist-grid">
              {CHARACTERISTICS.map(c => {
                const baseVal = baseChars[c.key]
                const added = choice.charBonuses[c.key] ?? 0
                const currentVal = baseVal + added
                const canAdd = charRemaining > 0 && currentVal < maxVal
                const canRemove = added > 0
                return (
                  <div key={c.key} className="redist-row">
                    <span className="redist-name">
                      <Tooltip text={CHARACTERISTIC_TOOLTIPS[c.key]}>
                        <span>{c.nombre} ({c.abreviatura})</span>
                      </Tooltip>
                    </span>
                    <span className="redist-val">{baseVal}</span>
                    <button
                      className="redist-btn"
                      disabled={!canRemove}
                      onClick={() => updateChar(c.key, -1)}
                      type="button"
                    >{'\u2212'}</button>
                    <span className={`redist-added ${added > 0 ? 'has-added' : ''}`}>+{added}</span>
                    <button
                      className="redist-btn"
                      disabled={!canAdd}
                      onClick={() => updateChar(c.key, 1)}
                      type="button"
                    >+</button>
                    <span className="redist-total">{currentVal}</span>
                  </div>
                )
              })}
            </div>
            {/* Psi / Teurgia (same char point budget) */}
            {(hasPsi || hasTeurgia) && (
              <div className="redist-grid" style={{ marginTop: 'var(--space-xs)' }}>
                {hasPsi && (() => {
                  const basePsi = oculto?.psi ?? 0
                  const added = choice.psiBonus ?? 0
                  const canAdd = charRemaining > 0 && currentPsi < maxPsi
                  const canRemove = added > 0
                  return (
                    <div className="redist-row">
                      <span className="redist-name" style={{ color: 'var(--color-accent)' }}>
                        Psi <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(max {maxPsi}, Ansia {oculto?.ansia ?? 0})</span>
                      </span>
                      <span className="redist-val">{basePsi}</span>
                      <button
                        className="redist-btn"
                        disabled={!canRemove}
                        onClick={() => onChange({ ...choice, psiBonus: added - 1 })}
                        type="button"
                      >{'\u2212'}</button>
                      <span className={`redist-added ${added > 0 ? 'has-added' : ''}`}>+{added}</span>
                      <button
                        className="redist-btn"
                        disabled={!canAdd}
                        onClick={() => onChange({ ...choice, psiBonus: added + 1 })}
                        type="button"
                      >+</button>
                      <span className="redist-total">{currentPsi}</span>
                    </div>
                  )
                })()}
                {hasTeurgia && (() => {
                  const baseTeurgia = oculto?.teurgia ?? 0
                  const added = choice.teurgiaBonus ?? 0
                  const canAdd = charRemaining > 0 && currentTeurgia < maxTeurgia
                  const canRemove = added > 0
                  return (
                    <div className="redist-row">
                      <span className="redist-name" style={{ color: 'var(--color-accent)' }}>
                        Teurgia <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(max {maxTeurgia}, Hubris {oculto?.hubris ?? 0})</span>
                      </span>
                      <span className="redist-val">{baseTeurgia}</span>
                      <button
                        className="redist-btn"
                        disabled={!canRemove}
                        onClick={() => onChange({ ...choice, teurgiaBonus: added - 1 })}
                        type="button"
                      >{'\u2212'}</button>
                      <span className={`redist-added ${added > 0 ? 'has-added' : ''}`}>+{added}</span>
                      <button
                        className="redist-btn"
                        disabled={!canAdd}
                        onClick={() => onChange({ ...choice, teurgiaBonus: added + 1 })}
                        type="button"
                      >+</button>
                      <span className="redist-total">{currentTeurgia}</span>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>

          {/* Skill points */}
          <div className="levelup-section">
            <h4 className="levelup-section-title">
              Habilidades —{' '}
              <span style={{ color: skillRemaining > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                {skillRemaining} punto(s) por asignar
              </span>
            </h4>
            <div className="redist-grid">
              {SKILLS.map(s => {
                const baseVal = baseSkills[s.key]
                const added = choice.skillBonuses[s.key] ?? 0
                const currentVal = baseVal + added
                const canAdd = skillRemaining > 0 && currentVal < maxVal
                const canRemove = added > 0
                return (
                  <div key={s.key} className="redist-row">
                    <span className="redist-name">
                      <Tooltip text={SKILL_TOOLTIPS[s.key]}>
                        <span>
                          {s.nombre}
                          {s.restringida && <span className="skill-restricted"> (R)</span>}
                        </span>
                      </Tooltip>
                    </span>
                    <span className="redist-val">{baseVal}</span>
                    <button
                      className="redist-btn"
                      disabled={!canRemove}
                      onClick={() => updateSkill(s.key, -1)}
                      type="button"
                    >{'\u2212'}</button>
                    <span className={`redist-added ${added > 0 ? 'has-added' : ''}`}>+{added}</span>
                    <button
                      className="redist-btn"
                      disabled={!canAdd}
                      onClick={() => updateSkill(s.key, 1)}
                      type="button"
                    >+</button>
                    <span className="redist-total">{currentVal}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Competency */}
          <div className="levelup-section">
            <h4 className="levelup-section-title">Competencia</h4>
            <div className="choice-options" style={{ flexWrap: 'wrap' }}>
              {availableComps.map(c => (
                <Tooltip key={c} text={COMPETENCY_TOOLTIPS[c]}>
                  <button
                    className={`choice-btn ${choice.competency === c ? 'chosen' : ''}`}
                    onClick={() => onChange({ ...choice, competency: c, competencySub: '' })}
                    type="button"
                  >
                    {getDisplayLabel(c)}
                  </button>
                </Tooltip>
              ))}
            </div>
            {compSubChoice && (
              <div style={{ marginTop: 'var(--space-sm)', paddingLeft: 'var(--space-sm)', borderLeft: '2px solid var(--color-accent)' }}>
                <div className="choice-group-label" style={{ marginBottom: 'var(--space-xs)' }}>
                  Especifica subcategoría:
                </div>
                {compSubChoice.type === 'buttons' ? (
                  <div className="choice-options" style={{ flexWrap: 'wrap' }}>
                    {compSubChoice.options.map(opt => (
                      <Tooltip key={opt} text={COMPETENCY_TOOLTIPS[opt]}>
                        <button
                          className={`choice-btn ${choice.competencySub === opt ? 'chosen' : ''}`}
                          onClick={() => onChange({ ...choice, competencySub: opt })}
                          type="button"
                        >
                          {opt}
                        </button>
                      </Tooltip>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder={compSubChoice.placeholder}
                    value={choice.competencySub}
                    onChange={e => onChange({ ...choice, competencySub: e.target.value })}
                    style={{ width: '100%', maxWidth: 320 }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Vocation benefit */}
          <div className="levelup-section">
            <h4 className="levelup-section-title">Beneficio de vocación</h4>
            <div className="choice-options" style={{ flexWrap: 'wrap' }}>
              {vocationBenefits.map(b => (
                <Tooltip key={b} text={BENEFIT_TOOLTIPS[b]}>
                  <button
                    className={`choice-btn ${choice.vocationBenefit === b ? 'chosen' : ''}`}
                    onClick={() => onChange({ ...choice, vocationBenefit: b })}
                    type="button"
                  >
                    {b}
                  </button>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Class benefit (odd levels only) */}
          {budget.hasClassBenefit && (
            <div className="levelup-section">
              <h4 className="levelup-section-title">Beneficio de clase</h4>
              <div className="choice-options" style={{ flexWrap: 'wrap' }}>
                {classBenefits.map(b => (
                  <Tooltip key={b} text={BENEFIT_TOOLTIPS[b]}>
                    <button
                      className={`choice-btn ${choice.classBenefit === b ? 'chosen' : ''}`}
                      onClick={() => onChange({ ...choice, classBenefit: b })}
                      type="button"
                    >
                      {b}
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .levelup-panel {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-sm);
          overflow: hidden;
        }
        .levelup-header {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          width: 100%;
          padding: var(--space-sm) var(--space-md);
          background: var(--color-bg-card);
          border: none;
          cursor: pointer;
          color: var(--color-text);
          font-size: 0.95rem;
          text-align: left;
        }
        .levelup-header:hover {
          background: var(--color-bg-surface);
        }
        .levelup-title {
          flex: 1;
          font-weight: bold;
        }
        .levelup-budget-hint {
          font-weight: normal;
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-left: var(--space-xs);
        }
        .levelup-status {
          font-size: 0.8rem;
          padding: 2px var(--space-sm);
          border-radius: var(--radius-sm);
        }
        .levelup-status.complete {
          background: rgba(90, 196, 90, 0.15);
          color: var(--color-success);
        }
        .levelup-status.incomplete {
          background: rgba(196, 163, 90, 0.15);
          color: var(--color-accent);
        }
        .levelup-chevron {
          font-size: 0.7rem;
          color: var(--color-text-muted);
        }
        .levelup-body {
          padding: var(--space-md);
          border-top: 1px solid var(--color-border);
        }
        .levelup-section {
          margin-bottom: var(--space-md);
        }
        .levelup-section:last-child {
          margin-bottom: 0;
        }
        .levelup-section-title {
          font-size: 0.9rem;
          margin-bottom: var(--space-sm);
          color: var(--color-accent);
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
        .skill-restricted {
          color: var(--color-danger);
          font-size: 0.75rem;
        }

        /* Choice buttons (self-contained for use outside wizard) */
        .levelup-panel .choice-options {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-sm);
        }
        .levelup-panel .choice-btn {
          padding: var(--space-xs) var(--space-md);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: var(--color-bg-surface);
          color: var(--color-text);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.15s;
          min-height: 36px;
        }
        .levelup-panel .choice-btn:hover {
          border-color: var(--color-accent);
        }
        .levelup-panel .choice-btn.chosen {
          border-color: var(--color-accent);
          background: rgba(196, 163, 90, 0.15);
          color: var(--color-accent);
        }
        .levelup-panel .choice-group-label {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: var(--space-xs);
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}

/** Check whether a LevelUpChoice is fully filled in */
export function isLevelUpComplete(choice: LevelUpChoice): boolean {
  const budget = getLevelBudget(choice.level)
  const charTotal = Object.values(choice.charBonuses).reduce((s, v) => s + (v ?? 0), 0)
    + (choice.psiBonus ?? 0) + (choice.teurgiaBonus ?? 0)
  const skillTotal = Object.values(choice.skillBonuses).reduce((s, v) => s + (v ?? 0), 0)

  const compSubChoice = choice.competency ? getSubChoice(choice.competency) : null
  const compComplete = choice.competency !== '' && (compSubChoice === null || !!choice.competencySub)

  return (
    charTotal === budget.charPoints &&
    skillTotal === budget.skillPoints &&
    compComplete &&
    choice.vocationBenefit !== '' &&
    (!budget.hasClassBenefit || choice.classBenefit !== '')
  )
}
