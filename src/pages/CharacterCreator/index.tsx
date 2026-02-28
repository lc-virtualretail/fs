import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { STEPS, STEP_LABELS, createEmptyDraft, type CharacterDraft, type StepId } from './creatorTypes'
import { StepNarrative } from './StepNarrative'
import { StepSpecies } from './StepSpecies'
import { StepClass } from './StepClass'
import { StepFaction } from './StepFaction'
import { StepVocation } from './StepVocation'
import { StepCustomization } from './StepCustomization'
import { StepSummary } from './StepSummary'

export function CharacterCreator() {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [draft, setDraft] = useState<CharacterDraft>(createEmptyDraft)

  const currentStep: StepId = STEPS[stepIndex] ?? 'narrative'

  const updateDraft = useCallback((updates: Partial<CharacterDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }))
  }, [])

  const goNext = useCallback(() => {
    setStepIndex(i => Math.min(i + 1, STEPS.length - 1))
  }, [])

  const goBack = useCallback(() => {
    setStepIndex(i => Math.max(i - 1, 0))
  }, [])

  const goToStep = useCallback((idx: number) => {
    if (idx <= stepIndex) {
      setStepIndex(idx)
    }
  }, [stepIndex])

  function renderStep() {
    const props = { draft, updateDraft, goNext, goBack }
    switch (currentStep) {
      case 'narrative': return <StepNarrative {...props} />
      case 'species': return <StepSpecies {...props} />
      case 'class': return <StepClass {...props} />
      case 'faction': return <StepFaction {...props} />
      case 'vocation': return <StepVocation {...props} />
      case 'customization': return <StepCustomization {...props} />
      case 'summary': return <StepSummary draft={draft} goBack={goBack} />
      default: return null
    }
  }

  return (
    <div className="creator">
      <header className="creator-header">
        <button className="creator-cancel" onClick={() => navigate('/personajes')}>
          ✕ Cancelar
        </button>
        <h1>Crear Personaje</h1>
      </header>

      {/* Stepper */}
      <nav className="creator-stepper">
        {STEPS.map((step, i) => (
          <button
            key={step}
            className={`stepper-dot ${i === stepIndex ? 'active' : ''} ${i < stepIndex ? 'done' : ''}`}
            onClick={() => goToStep(i)}
            disabled={i > stepIndex}
            title={STEP_LABELS[step]}
          >
            <span className="stepper-number">{i + 1}</span>
            <span className="stepper-label">{STEP_LABELS[step]}</span>
          </button>
        ))}
      </nav>

      {/* Step content */}
      <main className="creator-content">
        {renderStep()}
      </main>

      <style>{`
        .creator {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          min-height: 80dvh;
        }
        .creator-header {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        .creator-cancel {
          background: none;
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          border-radius: var(--radius-sm);
          padding: var(--space-xs) var(--space-md);
          font-size: 0.85rem;
          min-height: 36px;
        }
        .creator-cancel:hover {
          color: var(--color-danger);
          border-color: var(--color-danger);
        }

        .creator-stepper {
          display: flex;
          gap: var(--space-xs);
          overflow-x: auto;
          padding-bottom: var(--space-xs);
        }
        .stepper-dot {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          background: var(--color-bg-surface);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-xs) var(--space-sm);
          color: var(--color-text-muted);
          font-size: 0.75rem;
          min-width: 70px;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .stepper-dot:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .stepper-dot.active {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: var(--color-bg-card);
        }
        .stepper-dot.done {
          border-color: var(--color-success);
          color: var(--color-success);
        }
        .stepper-number {
          font-weight: bold;
          font-size: 1rem;
        }
        .stepper-label {
          white-space: nowrap;
        }

        .creator-content {
          flex: 1;
        }

        /* Shared step styles */
        .step-title {
          font-size: 1.3rem;
          margin-bottom: var(--space-md);
        }
        .step-section {
          margin-bottom: var(--space-lg);
        }
        .step-section h3 {
          font-size: 1rem;
          margin-bottom: var(--space-sm);
          color: var(--color-accent);
        }
        .step-nav {
          display: flex;
          gap: var(--space-md);
          margin-top: var(--space-lg);
          padding-top: var(--space-md);
          border-top: 1px solid var(--color-border);
        }
        .btn {
          padding: var(--space-sm) var(--space-lg);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: var(--color-bg-surface);
          color: var(--color-text);
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.15s;
        }
        .btn:hover:not(:disabled) {
          border-color: var(--color-accent);
        }
        .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .btn-primary {
          background: var(--color-accent);
          color: #1a1a2e;
          border-color: var(--color-accent);
          font-weight: 600;
        }
        .btn-primary:hover:not(:disabled) {
          background: var(--color-accent-hover);
          border-color: var(--color-accent-hover);
        }
        .btn-back {
          background: none;
          border: none;
          color: var(--color-text-muted);
        }
        .btn-back:hover {
          color: var(--color-text);
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          margin-bottom: var(--space-md);
        }
        .form-field label {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }
        .form-field input,
        .form-field textarea {
          width: 100%;
        }
        .form-field textarea {
          min-height: 80px;
          resize: vertical;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: var(--space-md);
        }
        .selectable-card {
          background: var(--color-bg-card);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-md);
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
          color: var(--color-text);
        }
        .selectable-card:hover {
          border-color: var(--color-accent);
        }
        .selectable-card.selected {
          border-color: var(--color-accent);
          background: rgba(196, 163, 90, 0.1);
        }
        .selectable-card h4 {
          color: var(--color-accent);
          margin-bottom: var(--space-xs);
        }
        .selectable-card p {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          line-height: 1.4;
        }
        .card-detail {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-top: var(--space-xs);
        }

        .choice-group {
          margin-bottom: var(--space-md);
        }
        .choice-group-label {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: var(--space-xs);
          font-weight: 500;
        }
        .choice-options {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-sm);
        }
        .choice-btn {
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
        .choice-btn:hover {
          border-color: var(--color-accent);
        }
        .choice-btn.chosen {
          border-color: var(--color-accent);
          background: rgba(196, 163, 90, 0.15);
          color: var(--color-accent);
        }

        .chars-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        .chars-table th,
        .chars-table td {
          padding: var(--space-xs) var(--space-sm);
          text-align: center;
          border: 1px solid var(--color-border);
        }
        .chars-table th {
          background: var(--color-bg-surface);
          color: var(--color-accent);
          font-size: 0.75rem;
        }
        .chars-table td {
          background: var(--color-bg-card);
        }
        .chars-table .cat-header {
          background: var(--color-bg);
          color: var(--color-text-muted);
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .chars-table .changed {
          color: var(--color-accent);
          font-weight: bold;
        }
        .chars-table .over-max {
          color: var(--color-danger);
          font-weight: bold;
        }

        .info-box {
          background: var(--color-bg-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-md);
          font-size: 0.85rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }
        .info-box strong {
          color: var(--color-accent);
        }
        .warning-box {
          background: rgba(196, 74, 74, 0.1);
          border-color: var(--color-danger);
          color: var(--color-text);
        }

        @media (max-width: 600px) {
          .stepper-label {
            display: none;
          }
          .stepper-dot {
            min-width: 40px;
            padding: var(--space-xs);
          }
          .card-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
