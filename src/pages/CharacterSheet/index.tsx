import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { db } from '@/db'
import { SKILLS } from '@/data/skills'
import { SPECIES } from '@/data/species'
import { CLASSES } from '@/data/classes'
import { FACTIONS } from '@/data/factions'
import { VOCATIONS } from '@/data/vocations'
import { CHARACTERISTIC_CATEGORIES } from '@/data/characteristics'
import { calcVitality, calcImpulse, calcReanimation, calcBankCapacity, calcUsosMax, calcTecgnosis } from '@/engine/derived'
import type { Character } from '@/types/character'

export function CharacterSheet() {
  const { id } = useParams<{ id: string }>()
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      setError('ID de personaje no proporcionado')
      setLoading(false)
      return
    }
    db.characters
      .get(id)
      .then(char => {
        if (!char) {
          setError('Personaje no encontrado')
        } else {
          setCharacter(char)
        }
      })
      .catch(() => setError('Error al cargar el personaje'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Cargando...</p>
  if (error) return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <p style={{ color: 'var(--color-danger)' }}>{error}</p>
      <Link to="/personajes" style={{ color: 'var(--color-accent)', marginTop: '1rem', display: 'inline-block' }}>← Volver a personajes</Link>
    </div>
  )
  if (!character) return null

  const species = SPECIES.find(s => s.id === character.especie)
  const cls = CLASSES.find(c => c.id === character.clase)
  const faction = FACTIONS.find(f => f.id === character.faccion)
  const vocation = VOCATIONS.find(v => v.id === character.vocacion)

  const tempChar = { tamano: character.tamano, caracteristicas: character.caracteristicas, nivel: character.nivel }
  const vitalidad = calcVitality(tempChar)
  const impulso = calcImpulse({ caracteristicas: character.caracteristicas, nivel: character.nivel })
  const reanimacion = calcReanimation({ tamano: character.tamano, nivel: character.nivel })
  const banco = calcBankCapacity(character.nivel)
  const usosMax = calcUsosMax(character.nivel)
  const tecgnosis = calcTecgnosis(character.nivel)

  return (
    <div className="sheet">
      <header className="sheet-header">
        <Link to="/personajes" className="sheet-back">← Personajes</Link>
        <h1 className="sheet-name">{character.nombre}</h1>
        <div className="sheet-subtitle">
          {species?.nombre} · {cls?.nombre} · {faction?.nombre} · Nivel {character.nivel}
        </div>
      </header>

      {/* Identity */}
      <section className="sheet-section">
        <h2>Identidad</h2>
        <div className="sheet-grid">
          <Row label="Vocación" value={vocation?.nombre ?? character.vocacion} />
          <Row label="Bendición" value={character.bendicion} />
          <Row label="Maldición" value={character.maldicion} />
          {character.planeta && <Row label="Planeta natal" value={character.planeta} />}
          {character.fechaNacimiento && <Row label="Nacimiento" value={character.fechaNacimiento} />}
          <Row label="Tamaño / Velocidad" value={`${character.tamano} / ${character.velocidad} m`} />
        </div>
      </section>

      {/* Characteristics */}
      <section className="sheet-section">
        <h2>Características</h2>
        <table className="chars-table">
          <tbody>
            {CHARACTERISTIC_CATEGORIES.map(cat => (
              <tr key={cat.nombre}>
                <td className="cat-header">{cat.nombre}</td>
                {cat.keys.map(key => {
                  const val = character.caracteristicas[key]
                  return (
                    <td key={key}>
                      <div className="char-label">{key.slice(0, 3).toUpperCase()}</div>
                      <div className="char-value">{val}</div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Skills */}
      <section className="sheet-section">
        <h2>Habilidades</h2>
        <div className="skills-grid">
          {SKILLS.map(skill => {
            const val = character.habilidades[skill.key]
            const changed = val !== skill.valorBase
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

      {/* Derived Stats */}
      <section className="sheet-section">
        <h2>Vitalidad y Derivados</h2>
        <div className="derived-grid">
          <div className="derived-card">
            <div className="derived-label">Vitalidad</div>
            <div className="derived-value">{vitalidad}</div>
            <div className="derived-detail">{character.vitalidadActual} / {vitalidad}</div>
          </div>
          <div className="derived-card">
            <div className="derived-label">Reanimación</div>
            <div className="derived-value">{reanimacion}</div>
            <div className="derived-detail">{usosMax} uso(s)</div>
          </div>
          <div className="derived-card">
            <div className="derived-label">Impulso</div>
            <div className="derived-value">{impulso}</div>
            <div className="derived-detail">{usosMax} uso(s)</div>
          </div>
          <div className="derived-card">
            <div className="derived-label">Banco PV</div>
            <div className="derived-value">{banco}</div>
            <div className="derived-detail">PV: {character.pvActuales}</div>
          </div>
          <div className="derived-card">
            <div className="derived-label">Tecgnosis</div>
            <div className="derived-value">{tecgnosis}</div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="sheet-section">
        <h2>Beneficios</h2>
        <ol className="sheet-list">
          {character.beneficios.map((b, i) => (
            <li key={i}>
              <strong>{b.nombre}</strong>
              <span className="list-meta"> — {b.tipo} ({b.origen})</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Competencies */}
      <section className="sheet-section">
        <h2>Competencias</h2>
        <ol className="sheet-list">
          {character.competencias.map((c, i) => (
            <li key={i}>
              {c.nombre}
              <span className="list-meta"> ({c.origen})</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Birthrights */}
      {character.derechosDeNacimiento.length > 0 && (
        <section className="sheet-section">
          <h2>Derechos de Nacimiento</h2>
          <ul className="sheet-list">
            {character.derechosDeNacimiento.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Affliction */}
      {character.afliccion && (
        <section className="sheet-section">
          <h2>Aflicción</h2>
          <div className="sheet-warning">{character.afliccion}</div>
        </section>
      )}

      {/* Equipment */}
      <section className="sheet-section">
        <h2>Equipo y Dinero</h2>
        <div className="sheet-grid">
          <Row label="Dinero" value={`${character.dinero.efectivo} fénix`} />
        </div>
        {character.equipo.length > 0 && (
          <div style={{ marginTop: 'var(--space-sm)' }}>
            {character.equipo.map((e, i) => (
              <div key={i} style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{e.nombre}</div>
            ))}
          </div>
        )}
      </section>

      {/* Narrative */}
      {(character.descripcionFisica || character.personalidad || character.trasfondo) && (
        <section className="sheet-section">
          <h2>Narrativa</h2>
          {character.descripcionFisica && (
            <div className="narrative-block">
              <strong>Descripción física:</strong>
              <p>{character.descripcionFisica}</p>
            </div>
          )}
          {character.personalidad && (
            <div className="narrative-block">
              <strong>Personalidad:</strong>
              <p>{character.personalidad}</p>
            </div>
          )}
          {character.trasfondo && (
            <div className="narrative-block">
              <strong>Trasfondo:</strong>
              <p>{character.trasfondo}</p>
            </div>
          )}
        </section>
      )}

      <style>{`
        .sheet {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }
        .sheet-header {
          border-bottom: 2px solid var(--color-accent);
          padding-bottom: var(--space-md);
        }
        .sheet-back {
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }
        .sheet-back:hover {
          color: var(--color-accent);
        }
        .sheet-name {
          font-size: 1.8rem;
          color: var(--color-accent);
          margin-top: var(--space-xs);
        }
        .sheet-subtitle {
          color: var(--color-text-muted);
          font-size: 0.95rem;
          margin-top: var(--space-xs);
        }

        .sheet-section {
          padding-bottom: var(--space-md);
          border-bottom: 1px solid var(--color-border);
        }
        .sheet-section h2 {
          font-size: 1.1rem;
          color: var(--color-accent);
          margin-bottom: var(--space-sm);
        }

        .sheet-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }
        .sheet-row {
          display: flex;
          gap: var(--space-md);
          font-size: 0.9rem;
        }
        .sheet-row-label {
          color: var(--color-text-muted);
          min-width: 140px;
          flex-shrink: 0;
        }
        .sheet-row-value {
          color: var(--color-text);
        }

        .chars-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        .chars-table td {
          padding: var(--space-xs) var(--space-sm);
          text-align: center;
          border: 1px solid var(--color-border);
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
        .char-label {
          font-size: 0.7rem;
          color: var(--color-accent);
          font-weight: 600;
        }
        .char-value {
          font-size: 1.2rem;
          font-weight: bold;
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

        .derived-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: var(--space-sm);
        }
        .derived-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-md);
          text-align: center;
        }
        .derived-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: var(--space-xs);
        }
        .derived-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--color-accent);
        }
        .derived-detail {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-top: 2px;
        }

        .sheet-list {
          padding-left: var(--space-lg);
          font-size: 0.9rem;
        }
        .sheet-list li {
          margin-bottom: var(--space-xs);
        }
        .list-meta {
          color: var(--color-text-muted);
          font-size: 0.8rem;
        }

        .sheet-warning {
          background: rgba(196, 74, 74, 0.1);
          border: 1px solid var(--color-danger);
          border-radius: var(--radius-md);
          padding: var(--space-md);
          color: var(--color-text);
          font-size: 0.9rem;
        }

        .narrative-block {
          margin-bottom: var(--space-sm);
        }
        .narrative-block p {
          color: var(--color-text-muted);
          font-size: 0.85rem;
          margin-top: 2px;
        }
      `}</style>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="sheet-row">
      <span className="sheet-row-label">{label}</span>
      <span className="sheet-row-value">{value}</span>
    </div>
  )
}
