import { SPECIES } from '@/data/species'
import { CHARACTERISTICS } from '@/data/characteristics'
import { DEFAULT_CHARACTERISTICS, DEFAULT_SKILLS } from '@/types/character'
import type { CharacteristicKey } from '@/types/character'
import { CharacteristicsTable } from './components/CharacteristicsTable'
import type { StepProps } from './creatorTypes'

export function StepSpecies({ draft, updateDraft, goNext, goBack }: StepProps) {
  const selectedSpecies = SPECIES.find(s => s.id === draft.especie)

  // Which characteristics can be primary?
  const primaryOptions: CharacteristicKey[] = selectedSpecies?.caracteristicasForzadas?.primaria
    ?? CHARACTERISTICS.map(c => c.key)
  const secondaryOptions: CharacteristicKey[] = selectedSpecies?.caracteristicasForzadas?.secundaria
    ?? CHARACTERISTICS.map(c => c.key)

  function selectSpecies(id: string) {
    const sp = SPECIES.find(s => s.id === id)
    if (!sp) return
    updateDraft({
      especie: sp.id as typeof draft.especie,
      tamano: sp.tamano,
      velocidad: sp.velocidad,
      derechosDeNacimiento: sp.derechosDeNacimiento,
      donIluminacion: '',
      caracteristicaPrimaria: '',
      caracteristicaSecundaria: '',
      caracteristicas: { ...DEFAULT_CHARACTERISTICS },
    })
  }

  // Ur-obun needs to choose between Psi 1 or Teúrgia 1
  const needsIluminacionChoice = draft.especie === 'ur-obun'

  function selectPrimary(key: CharacteristicKey) {
    const chars = { ...DEFAULT_CHARACTERISTICS }
    chars[key] = 5
    if (draft.caracteristicaSecundaria && draft.caracteristicaSecundaria !== key) {
      chars[draft.caracteristicaSecundaria] = 4
    }
    updateDraft({
      caracteristicaPrimaria: key,
      caracteristicas: chars,
    })
  }

  function selectSecondary(key: CharacteristicKey) {
    if (key === draft.caracteristicaPrimaria) return
    const chars = { ...DEFAULT_CHARACTERISTICS }
    if (draft.caracteristicaPrimaria) {
      chars[draft.caracteristicaPrimaria] = 5
    }
    chars[key] = 4
    updateDraft({
      caracteristicaSecundaria: key,
      caracteristicas: chars,
    })
  }

  const canProceed =
    draft.especie !== '' &&
    draft.caracteristicaPrimaria !== '' &&
    draft.caracteristicaSecundaria !== '' &&
    (!needsIluminacionChoice || draft.donIluminacion !== '')

  return (
    <div>
      <h2 className="step-title">Paso 1: Especie</h2>

      <div className="step-section">
        <h3>Elige tu especie</h3>
        <div className="card-grid">
          {SPECIES.map(sp => (
            <button
              key={sp.id}
              className={`selectable-card ${draft.especie === sp.id ? 'selected' : ''}`}
              onClick={() => selectSpecies(sp.id)}
            >
              <h4>{sp.nombre}</h4>
              <p>{sp.descripcion}</p>
              <div className="card-detail">
                Tamaño: {sp.tamano} · Velocidad: {sp.velocidad} m
              </div>
              {sp.derechosDeNacimiento.length > 0 && (
                <div className="card-detail" style={{ marginTop: 4 }}>
                  <strong style={{ color: 'var(--color-accent)' }}>Derechos:</strong>{' '}
                  {sp.derechosDeNacimiento.length} habilidades especiales
                </div>
              )}
              {sp.restricciones.length > 0 && (
                <div className="card-detail" style={{ color: 'var(--color-danger)' }}>
                  {sp.restricciones.join('; ')}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {draft.especie && (
        <>
          <div className="step-section">
            <h3>Característica primaria (→ 5)</h3>
            {selectedSpecies?.caracteristicasForzadas?.primaria && (
              <div className="info-box" style={{ marginBottom: 'var(--space-sm)' }}>
                Esta especie solo permite: {primaryOptions.map(k => {
                  const c = CHARACTERISTICS.find(c => c.key === k)
                  return c?.nombre
                }).join(' o ')}
              </div>
            )}
            <div className="choice-options">
              {primaryOptions.map(key => {
                const meta = CHARACTERISTICS.find(c => c.key === key)
                return (
                  <button
                    key={key}
                    className={`choice-btn ${draft.caracteristicaPrimaria === key ? 'chosen' : ''}`}
                    onClick={() => selectPrimary(key)}
                  >
                    {meta?.nombre} ({meta?.abreviatura})
                  </button>
                )
              })}
            </div>
          </div>

          <div className="step-section">
            <h3>Característica secundaria (→ 4)</h3>
            <div className="choice-options">
              {secondaryOptions.filter(k => k !== draft.caracteristicaPrimaria).map(key => {
                const meta = CHARACTERISTICS.find(c => c.key === key)
                return (
                  <button
                    key={key}
                    className={`choice-btn ${draft.caracteristicaSecundaria === key ? 'chosen' : ''}`}
                    onClick={() => selectSecondary(key)}
                  >
                    {meta?.nombre} ({meta?.abreviatura})
                  </button>
                )
              })}
            </div>
          </div>

          {draft.caracteristicaPrimaria && draft.caracteristicaSecundaria && (() => {
            // Compute species-only values for display (draft.caracteristicas may have stale bonuses)
            const displayChars = { ...DEFAULT_CHARACTERISTICS }
            displayChars[draft.caracteristicaPrimaria] = 5
            displayChars[draft.caracteristicaSecundaria] = 4
            return (
            <div className="step-section">
              <h3>Características base</h3>
              <CharacteristicsTable current={displayChars} />
            </div>
            )
          })()}

          {selectedSpecies && selectedSpecies.derechosDeNacimiento.length > 0 && (
            <div className="step-section">
              <h3>Derechos de Nacimiento</h3>
              <ul style={{ paddingLeft: 'var(--space-lg)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {selectedSpecies.derechosDeNacimiento.map((d, i) => (
                  <li key={i} style={{ marginBottom: 'var(--space-xs)' }}>{d}</li>
                ))}
              </ul>
              {needsIluminacionChoice && (
                <div style={{ marginTop: 'var(--space-sm)' }}>
                  <h4 style={{ marginBottom: 'var(--space-xs)' }}>Don de la iluminación — elige uno:</h4>
                  <div className="choice-options">
                    <button
                      className={`choice-btn ${draft.donIluminacion === 'psi' ? 'chosen' : ''}`}
                      onClick={() => updateDraft({ donIluminacion: 'psi' })}
                    >
                      Psi 1
                    </button>
                    <button
                      className={`choice-btn ${draft.donIluminacion === 'teurgia' ? 'chosen' : ''}`}
                      onClick={() => updateDraft({ donIluminacion: 'teurgia' })}
                    >
                      Teúrgia 1
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="step-nav">
        <button className="btn btn-back" onClick={goBack}>← Atrás</button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={() => {
          // Recompute species-only characteristics from scratch (draft.caracteristicas
          // may still have bonuses from later steps if user navigated back)
          const speciesChars = { ...DEFAULT_CHARACTERISTICS }
          if (draft.caracteristicaPrimaria) speciesChars[draft.caracteristicaPrimaria] = 5
          if (draft.caracteristicaSecundaria) speciesChars[draft.caracteristicaSecundaria] = 4

          // Reset accumulated stats to species-only state and save snapshot
          updateDraft({
            caracteristicas: speciesChars,
            habilidades: { ...DEFAULT_SKILLS },
            competencias: [],
            beneficios: [],
            _snapshotPreClase: {
              caracteristicas: { ...speciesChars },
              habilidades: { ...DEFAULT_SKILLS },
              competencias: [],
              beneficios: [],
            },
          })
          goNext()
        }} disabled={!canProceed}>
          Siguiente →
        </button>
      </div>
    </div>
  )
}
