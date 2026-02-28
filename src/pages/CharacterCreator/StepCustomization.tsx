import { useState } from 'react'
import { CLASSES } from '@/data/classes'
import { VOCATIONS } from '@/data/vocations'
import type { StepProps } from './creatorTypes'

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
  const [freeBenefit, setFreeBenefit] = useState(draft.freeBenefit)
  const [affliction, setAffliction] = useState(draft.afliccion)
  const [extraBenefit, setExtraBenefit] = useState(draft.extraBenefit)

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

  // Exclude already-chosen benefits
  const chosenBenefitNames = draft.beneficios.map(b => b.nombre)
  const availableBenefits = allBenefits.filter(b => !chosenBenefitNames.includes(b))

  function handleNext() {
    const newComps = [...draft.competencias]
    if (freeComp.trim()) {
      newComps.push({ nombre: freeComp.trim(), origen: 'Personalización' })
    }

    const newBenefits = [...draft.beneficios]
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

    updateDraft({
      competencias: newComps,
      beneficios: newBenefits,
      freeCompetency: freeComp,
      freeBenefit,
      afliccion: affliction,
      extraBenefit,
    })
    goNext()
  }

  const canProceed = freeComp.trim().length > 0 && freeBenefit !== ''

  return (
    <div>
      <h2 className="step-title">Paso 5: Personalización y Equipo</h2>

      {/* Free competency */}
      <div className="step-section">
        <h3>Competencia libre</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>
          Elige 1 competencia sin restricciones. Puede ser cualquiera que no tengas ya.
        </p>
        <div className="form-field">
          <input
            type="text"
            value={freeComp}
            onChange={e => setFreeComp(e.target.value)}
            placeholder="Ej: Armas de Energía, Bajos Fondos, Idioma..."
          />
        </div>
      </div>

      {/* Free benefit */}
      <div className="step-section">
        <h3>Beneficio libre</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>
          Elige 1 beneficio de cualquier lista (clase, vocación o libre).
        </p>
        <div className="choice-options" style={{ flexWrap: 'wrap' }}>
          {availableBenefits.map(b => (
            <button
              key={b}
              className={`choice-btn ${freeBenefit === b ? 'chosen' : ''}`}
              onClick={() => setFreeBenefit(b)}
            >
              {b}
            </button>
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
            <button
              key={a}
              className={`choice-btn ${affliction === a ? 'chosen' : ''}`}
              onClick={() => setAffliction(a)}
            >
              {a}
            </button>
          ))}
        </div>

        {affliction && (
          <div style={{ marginTop: 'var(--space-md)' }}>
            <div className="choice-group-label">Beneficio extra (por aflicción):</div>
            <div className="choice-options" style={{ flexWrap: 'wrap' }}>
              {availableBenefits
                .filter(b => b !== freeBenefit)
                .map(b => (
                  <button
                    key={b}
                    className={`choice-btn ${extraBenefit === b ? 'chosen' : ''}`}
                    onClick={() => setExtraBenefit(b)}
                  >
                    {b}
                  </button>
                ))}
            </div>
          </div>
        )}
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
          {draft.beneficios.map((b, i) => (
            <div key={i} style={{ marginBottom: 2 }}>
              <strong>{b.nombre}</strong>
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
          {draft.competencias.map((c, i) => (
            <span key={i}>
              {c.nombre}
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}> ({c.origen})</span>
              {i < draft.competencias.length - 1 ? ' · ' : ''}
            </span>
          ))}
          {freeComp.trim() && (
            <span>
              {draft.competencias.length > 0 ? ' · ' : ''}
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
