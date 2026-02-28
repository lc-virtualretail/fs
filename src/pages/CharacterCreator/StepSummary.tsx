import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '@/db'
import { SKILLS } from '@/data/skills'
import { SPECIES } from '@/data/species'
import { CLASSES } from '@/data/classes'
import { FACTIONS } from '@/data/factions'
import { VOCATIONS } from '@/data/vocations'
import { calcVitality, calcImpulse, calcReanimation, calcBankCapacity, calcUsosMax, calcTecgnosis } from '@/engine/derived'
import type { Character } from '@/types/character'
import type { CharacterDraft } from './creatorTypes'
import { CharacteristicsTable } from './components/CharacteristicsTable'

interface Props {
  draft: CharacterDraft
  goBack: () => void
}

export function StepSummary({ draft, goBack }: Props) {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  const species = SPECIES.find(s => s.id === draft.especie)
  const cls = CLASSES.find(c => c.id === draft.clase)
  const faction = FACTIONS.find(f => f.id === draft.faccion)
  const vocation = VOCATIONS.find(v => v.id === draft.vocacion)

  // Build temporary character for derived stat calculations
  const nivel = 1
  const tempChar = {
    tamano: draft.tamano,
    caracteristicas: draft.caracteristicas,
    nivel,
  }

  const vitalidad = calcVitality(tempChar)
  const impulso = calcImpulse({ caracteristicas: draft.caracteristicas, nivel })
  const reanimacion = calcReanimation({ tamano: draft.tamano, nivel })
  const banco = calcBankCapacity(nivel)
  const usosMax = calcUsosMax(nivel)
  const tecgnosis = calcTecgnosis(nivel)

  async function handleSave() {
    setSaving(true)
    try {
      const now = new Date().toISOString()
      const character: Character = {
        id: crypto.randomUUID(),
        nombre: draft.nombre,
        planeta: draft.planeta,
        rango: '',
        fechaNacimiento: draft.fechaNacimiento,
        concepto: draft.concepto,
        descripcionFisica: draft.descripcionFisica,
        personalidad: draft.personalidad,
        trasfondo: draft.trasfondo,
        retrato: null,
        especie: draft.especie as Character['especie'],
        tamano: draft.tamano,
        velocidad: typeof draft.velocidad === 'string' ? parseInt(draft.velocidad) : draft.velocidad,
        clase: draft.clase as Character['clase'],
        nivel,
        faccion: draft.faccion as Character['faccion'],
        bendicion: `${draft.bendicionNombre}: ${draft.bendicionEfecto}`,
        maldicion: `${draft.maldicionNombre}: ${draft.maldicionEfecto}`,
        vocacion: draft.vocacion,
        caracteristicaPrimaria: draft.caracteristicaPrimaria as Character['caracteristicaPrimaria'],
        caracteristicaSecundaria: draft.caracteristicaSecundaria as Character['caracteristicaSecundaria'],
        caracteristicas: { ...draft.caracteristicas },
        habilidades: { ...draft.habilidades },
        oculto: { psi: 0, ansia: 0, teurgia: 0, hubris: 0 },
        resistencias: {
          corporal: 0,
          mental: 0,
          espiritual: 0,
          corporalMod: 0,
          mentalMod: 0,
          espiritualMod: 0,
        },
        armadura: null,
        escudoEnergia: null,
        vitalidadMaxima: vitalidad,
        vitalidadActual: vitalidad,
        reanimacionesCantidad: reanimacion,
        reanimacionesUsos: usosMax,
        reanimacionesUsosMax: usosMax,
        bancoPVCapacidad: banco,
        pvActuales: banco,
        pwActuales: 0,
        impulsoCantidad: impulso,
        impulsoUsos: usosMax,
        impulsoUsosMax: usosMax,
        acciones: [],
        beneficios: draft.beneficios,
        competencias: draft.competencias,
        derechosDeNacimiento: draft.derechosDeNacimiento,
        armas: [],
        equipo: [],
        otrasPertenencias: [],
        dinero: { efectivo: 300, recursos: [] },
        tecgnosis,
        afliccion: draft.afliccion || null,
        notas: '',
        createdAt: now,
        updatedAt: now,
      }

      await db.characters.add(character)
      navigate('/personajes')
    } catch (err) {
      console.error('Error saving character:', err)
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="step-title">Resumen del Personaje</h2>

      {/* 5.1 Identity */}
      <section className="summary-section">
        <h3 className="summary-heading">Identidad</h3>
        <div className="summary-grid">
          <SummaryRow label="Nombre" value={draft.nombre} />
          <SummaryRow label="Concepto" value={draft.concepto} />
          <SummaryRow label="Especie" value={species?.nombre ?? ''} />
          <SummaryRow label="Planeta natal" value={draft.planeta} />
          <SummaryRow label="Fecha de nacimiento" value={draft.fechaNacimiento} />
          <SummaryRow label="Tamaño / Velocidad" value={`${draft.tamano} / ${draft.velocidad} m`} />
        </div>
      </section>

      {/* 5.2 Class & Faction */}
      <section className="summary-section">
        <h3 className="summary-heading">Clase y Facción</h3>
        <div className="summary-grid">
          <SummaryRow label="Clase" value={cls?.nombre ?? ''} />
          <SummaryRow label="Nivel" value={String(nivel)} />
          <SummaryRow label="Facción" value={faction?.nombre ?? ''} />
          <SummaryRow label="Vocación" value={vocation?.nombre ?? ''} />
          <SummaryRow label="Bendición" value={`${draft.bendicionNombre}: ${draft.bendicionEfecto}`} />
          <SummaryRow label="Maldición" value={`${draft.maldicionNombre}: ${draft.maldicionEfecto}`} />
        </div>
      </section>

      {/* 5.3 Characteristics */}
      <section className="summary-section">
        <h3 className="summary-heading">Características</h3>
        <CharacteristicsTable current={draft.caracteristicas} />
      </section>

      {/* 5.4 Skills */}
      <section className="summary-section">
        <h3 className="summary-heading">Habilidades</h3>
        <div className="skills-grid">
          {SKILLS.map(skill => {
            const val = draft.habilidades[skill.key]
            const base = skill.valorBase
            const changed = val !== base
            return (
              <div key={skill.key} className={`skill-row ${changed ? 'skill-changed' : ''}`}>
                <span className="skill-name">
                  {skill.nombre}
                  {skill.restringida && <span className="skill-restricted"> (R)</span>}
                </span>
                <span className="skill-value">{val}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* 5.7 Vitality & Reanimation */}
      <section className="summary-section">
        <h3 className="summary-heading">Vitalidad y Derivados</h3>
        <div className="summary-grid">
          <SummaryRow
            label="Vitalidad"
            value={`${vitalidad} (Tam ${draft.tamano} + CON ${draft.caracteristicas.constitucion} + VOL ${draft.caracteristicas.voluntad} + FE ${draft.caracteristicas.fe} + Nivel ${nivel})`}
          />
          <SummaryRow
            label="Reanimación"
            value={`${reanimacion} valor × ${usosMax} uso(s)`}
          />
          <SummaryRow
            label="Impulso"
            value={`${impulso} valor × ${usosMax} uso(s)`}
          />
          <SummaryRow label="Banco PV" value={`${banco} PV`} />
          <SummaryRow label="Tecgnosis" value={String(tecgnosis)} />
        </div>
      </section>

      {/* 5.10 Benefits */}
      <section className="summary-section">
        <h3 className="summary-heading">Beneficios</h3>
        <ol className="summary-list">
          {draft.beneficios.map((b, i) => (
            <li key={i}>
              <strong>{b.nombre}</strong>
              <span className="summary-meta"> — {b.tipo} ({b.origen})</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 5.11 Competencies */}
      <section className="summary-section">
        <h3 className="summary-heading">Competencias</h3>
        <ol className="summary-list">
          {draft.competencias.map((c, i) => (
            <li key={i}>
              {c.nombre}
              <span className="summary-meta"> ({c.origen})</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 5.12 Birthrights */}
      {draft.derechosDeNacimiento.length > 0 && (
        <section className="summary-section">
          <h3 className="summary-heading">Derechos de Nacimiento</h3>
          <ul className="summary-list">
            {draft.derechosDeNacimiento.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Affliction */}
      {draft.afliccion && (
        <section className="summary-section">
          <h3 className="summary-heading">Aflicción</h3>
          <div className="info-box warning-box">{draft.afliccion}</div>
        </section>
      )}

      {/* 5.13 Equipment */}
      <section className="summary-section">
        <h3 className="summary-heading">Equipo y Dinero</h3>
        <div className="summary-grid">
          {draft.premioMaterial && (
            <SummaryRow label="Premio de facción" value={draft.premioMaterial} />
          )}
          {draft.equipoVocacion.length > 0 && (
            <SummaryRow label="Equipo de vocación" value={draft.equipoVocacion.join(', ')} />
          )}
          <SummaryRow label="Dinero" value="300 fénix" />
        </div>
      </section>

      {/* Narrative */}
      {(draft.descripcionFisica || draft.personalidad || draft.trasfondo) && (
        <section className="summary-section">
          <h3 className="summary-heading">Narrativa</h3>
          {draft.descripcionFisica && (
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <strong>Descripción física:</strong>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{draft.descripcionFisica}</p>
            </div>
          )}
          {draft.personalidad && (
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <strong>Personalidad:</strong>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{draft.personalidad}</p>
            </div>
          )}
          {draft.trasfondo && (
            <div>
              <strong>Trasfondo:</strong>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{draft.trasfondo}</p>
            </div>
          )}
        </section>
      )}

      {/* Actions */}
      <div className="step-nav">
        <button className="btn btn-back" onClick={goBack}>← Atrás</button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Personaje'}
        </button>
      </div>

      <style>{`
        .summary-section {
          margin-bottom: var(--space-lg);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid var(--color-border);
        }
        .summary-heading {
          font-size: 1.1rem;
          color: var(--color-accent);
          margin-bottom: var(--space-sm);
        }
        .summary-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }
        .summary-row {
          display: flex;
          gap: var(--space-md);
          font-size: 0.9rem;
        }
        .summary-row-label {
          color: var(--color-text-muted);
          min-width: 140px;
          flex-shrink: 0;
        }
        .summary-row-value {
          color: var(--color-text);
        }
        .summary-list {
          padding-left: var(--space-lg);
          font-size: 0.9rem;
        }
        .summary-list li {
          margin-bottom: var(--space-xs);
        }
        .summary-meta {
          color: var(--color-text-muted);
          font-size: 0.8rem;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 2px;
        }
        .skill-row {
          display: flex;
          justify-content: space-between;
          padding: var(--space-xs) var(--space-sm);
          background: var(--color-bg-card);
          font-size: 0.85rem;
          border-radius: 2px;
        }
        .skill-changed {
          color: var(--color-accent);
        }
        .skill-name {
          flex: 1;
        }
        .skill-restricted {
          color: var(--color-danger);
          font-size: 0.75rem;
        }
        .skill-value {
          font-weight: bold;
          min-width: 24px;
          text-align: right;
        }
      `}</style>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="summary-row">
      <span className="summary-row-label">{label}</span>
      <span className="summary-row-value">{value}</span>
    </div>
  )
}
