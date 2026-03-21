import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { db } from '@/db'
import { SKILLS } from '@/data/skills'
import { SPECIES } from '@/data/species'
import { CLASSES } from '@/data/classes'
import { FACTIONS } from '@/data/factions'
import { VOCATIONS } from '@/data/vocations'
import { CHARACTERISTIC_CATEGORIES } from '@/data/characteristics'
import { calcVitality, calcImpulse, calcReanimation, calcBankCapacity, calcUsosMax, calcTecgnosis, calcMentalResistance, calcSpiritualResistance, getMaxStatValue } from '@/engine/derived'
import { Tooltip } from '@/components/ui/Tooltip'
import { CHARACTERISTIC_TOOLTIPS, SKILL_TOOLTIPS, COMPETENCY_TOOLTIPS, BENEFIT_TOOLTIPS } from '@/data/tooltips'
import { buildExportPayload, downloadExport, exportFilename } from '@/utils/characterExportImport'
import { LevelUpPanel, isLevelUpComplete } from '@/pages/CharacterCreator/LevelUpPanel'
import { createEmptyLevelUpChoice, getLevelBudget } from '@/pages/CharacterCreator/creatorTypes'
import { resolveWithSub } from '@/pages/CharacterCreator/competencyUtils'
import type { Character, CharacteristicKey, SkillKey } from '@/types/character'
import type { LevelUpChoice } from '@/pages/CharacterCreator/creatorTypes'

export function CharacterSheet() {
  const { id } = useParams<{ id: string }>()
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [levelingUp, setLevelingUp] = useState(false)
  const [levelUpChoice, setLevelUpChoice] = useState<LevelUpChoice | null>(null)
  const [saving, setSaving] = useState(false)

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
  const resMental = calcMentalResistance(character.beneficios)
  const resEspiritual = calcSpiritualResistance(character.beneficios)
  const resCorporal = character.armadura?.resistenciaCorporal ?? 0

  const nextLevel = character.nivel + 1

  function startLevelUp() {
    setLevelUpChoice(createEmptyLevelUpChoice(nextLevel))
    setLevelingUp(true)
  }

  function cancelLevelUp() {
    setLevelingUp(false)
    setLevelUpChoice(null)
  }

  async function confirmLevelUp() {
    if (!character || !levelUpChoice || !isLevelUpComplete(levelUpChoice)) return
    setSaving(true)
    try {
      const newChars = { ...character.caracteristicas }
      for (const [key, val] of Object.entries(levelUpChoice.charBonuses)) {
        if (val) newChars[key as CharacteristicKey] += val
      }
      const newSkills = { ...character.habilidades }
      for (const [key, val] of Object.entries(levelUpChoice.skillBonuses)) {
        if (val) newSkills[key as SkillKey] += val
      }

      const newComps = [...character.competencias]
      const resolvedComp = levelUpChoice.competency
        ? resolveWithSub(levelUpChoice.competency, levelUpChoice.competencySub || undefined)
        : ''
      if (resolvedComp) {
        newComps.push({ nombre: resolvedComp, origen: `Nivel ${nextLevel}` })
      }

      const newBenefits = [...character.beneficios]
      if (levelUpChoice.vocationBenefit) {
        newBenefits.push({
          nombre: levelUpChoice.vocationBenefit,
          tipo: 'Vocación',
          origen: `Nivel ${nextLevel}`,
          descripcion: `Beneficio de vocación (nivel ${nextLevel})`,
        })
      }
      if (levelUpChoice.classBenefit) {
        newBenefits.push({
          nombre: levelUpChoice.classBenefit,
          tipo: 'Clase',
          origen: `Nivel ${nextLevel}`,
          descripcion: `Beneficio de clase (nivel ${nextLevel})`,
        })
      }

      const newNivel = nextLevel
      const newVitalidad = calcVitality({ tamano: character.tamano, caracteristicas: newChars, nivel: newNivel })
      const newReanimacion = calcReanimation({ tamano: character.tamano, nivel: newNivel })
      const newImpulso = calcImpulse({ caracteristicas: newChars, nivel: newNivel })
      const newUsosMax = calcUsosMax(newNivel)
      const newBanco = calcBankCapacity(newNivel)

      const updates: Partial<Character> = {
        nivel: newNivel,
        caracteristicas: newChars,
        habilidades: newSkills,
        competencias: newComps,
        beneficios: newBenefits,
        vitalidadMaxima: newVitalidad,
        vitalidadActual: Math.min(character.vitalidadActual + 1, newVitalidad),
        reanimacionesCantidad: newReanimacion,
        reanimacionesUsosMax: newUsosMax,
        reanimacionesUsos: Math.min(character.reanimacionesUsos, newUsosMax),
        impulsoCantidad: newImpulso,
        impulsoUsosMax: newUsosMax,
        impulsoUsos: Math.min(character.impulsoUsos, newUsosMax),
        bancoPVCapacidad: newBanco,
        pvActuales: Math.min(character.pvActuales, newBanco),
        tecgnosis: calcTecgnosis(newNivel),
        oculto: {
          ...character.oculto,
          psi: character.oculto.psi + (levelUpChoice.psiBonus ?? 0),
          teurgia: character.oculto.teurgia + (levelUpChoice.teurgiaBonus ?? 0),
        },
        resistencias: {
          ...character.resistencias,
          mental: calcMentalResistance(newBenefits),
          espiritual: calcSpiritualResistance(newBenefits),
        },
        updatedAt: new Date().toISOString(),
      }

      await db.characters.update(character.id, updates)
      setCharacter({ ...character, ...updates } as Character)
      setLevelingUp(false)
      setLevelUpChoice(null)
    } catch (err) {
      console.error('Error saving level up:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="sheet">
      <header className="sheet-header">
        <div className="sheet-header-top">
          <Link to="/personajes" className="sheet-back">← Personajes</Link>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="sheet-export-btn" onClick={() => {
              const payload = buildExportPayload([character])
              downloadExport(payload, exportFilename(character.nombre))
            }}>Exportar</button>
            {!levelingUp && (
              <button className="sheet-levelup-btn" onClick={startLevelUp}>
                Subir de Nivel
              </button>
            )}
          </div>
        </div>
        <h1 className="sheet-name">{character.nombre}</h1>
        <div className="sheet-subtitle">
          {species?.nombre} · {cls?.nombre} · {faction?.nombre} · Nivel {character.nivel}
        </div>
      </header>

      {/* Level Up Panel */}
      {levelingUp && levelUpChoice && (
        <section className="sheet-section sheet-levelup-section">
          <h2>Subir a Nivel {nextLevel}</h2>
          <div className="info-box" style={{ marginBottom: 'var(--space-md)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            {(() => {
              const b = getLevelBudget(nextLevel)
              return `+${b.charPoints} característica(s), +${b.skillPoints} habilidad(es), 1 competencia, 1 beneficio de vocación${b.hasClassBenefit ? ', 1 beneficio de clase' : ''}. Máximo por stat: ${getMaxStatValue(nextLevel)}.`
            })()}
          </div>
          <LevelUpPanel
            choice={levelUpChoice}
            onChange={setLevelUpChoice}
            baseChars={character.caracteristicas}
            baseSkills={character.habilidades}
            chosenCompetencies={character.competencias.map(c => c.nombre)}
            claseId={character.clase}
            vocacionId={character.vocacion}
            oculto={character.oculto}
          />
          {/* Derived stats preview */}
          {(() => {
            const previewChars = { ...character.caracteristicas }
            for (const [key, val] of Object.entries(levelUpChoice.charBonuses)) {
              if (val) previewChars[key as CharacteristicKey] += val
            }
            const pVit = calcVitality({ tamano: character.tamano, caracteristicas: previewChars, nivel: nextLevel })
            const pRean = calcReanimation({ tamano: character.tamano, nivel: nextLevel })
            const pImp = calcImpulse({ caracteristicas: previewChars, nivel: nextLevel })
            const pUsos = calcUsosMax(nextLevel)
            const pBanco = calcBankCapacity(nextLevel)
            const pTecg = calcTecgnosis(nextLevel)
            return (
              <div style={{ marginTop: 'var(--space-md)' }}>
                <h3 style={{ fontSize: '0.95rem', color: 'var(--color-accent)', marginBottom: 'var(--space-sm)' }}>
                  Valores proyectados (Nivel {nextLevel})
                </h3>
                <div className="derived-grid">
                  <div className="derived-card">
                    <div className="derived-label">Vitalidad</div>
                    <div className="derived-value">{pVit}</div>
                    <div className="derived-detail">actual: {vitalidad} → {pVit}</div>
                  </div>
                  <div className="derived-card">
                    <div className="derived-label">Reanimación</div>
                    <div className="derived-value">{pRean}</div>
                    <div className="derived-detail">{pUsos} uso(s)</div>
                  </div>
                  <div className="derived-card">
                    <div className="derived-label">Impulso</div>
                    <div className="derived-value">{pImp}</div>
                    <div className="derived-detail">{pUsos} uso(s)</div>
                  </div>
                  <div className="derived-card">
                    <div className="derived-label">Banco PV</div>
                    <div className="derived-value">{pBanco}</div>
                    <div className="derived-detail">actual: {banco} → {pBanco}</div>
                  </div>
                  <div className="derived-card">
                    <div className="derived-label">Tecgnosis</div>
                    <div className="derived-value">{pTecg}</div>
                  </div>
                </div>
              </div>
            )
          })()}

          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)', justifyContent: 'flex-end' }}>
            <button className="btn btn-back" onClick={cancelLevelUp}>Cancelar</button>
            <button
              className="btn btn-primary"
              onClick={confirmLevelUp}
              disabled={saving || !isLevelUpComplete(levelUpChoice)}
            >
              {saving ? 'Guardando...' : 'Confirmar Nivel'}
            </button>
          </div>
        </section>
      )}

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
                      <Tooltip text={CHARACTERISTIC_TOOLTIPS[key]}>
                        <div>
                          <div className="char-label">{key.slice(0, 3).toUpperCase()}</div>
                          <div className="char-value">{val}</div>
                        </div>
                      </Tooltip>
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
                  <Tooltip text={SKILL_TOOLTIPS[skill.key]}>
                    <span>
                      {skill.nombre}
                      {skill.restringida && <span className="skill-restricted"> (R)</span>}
                    </span>
                  </Tooltip>
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

      {/* Resistances */}
      <section className="sheet-section">
        <h2>Resistencias</h2>
        <div className="derived-grid">
          <div className="derived-card">
            <div className="derived-label">Corporal</div>
            <div className="derived-value">{resCorporal}</div>
            <div className="derived-detail">{character.armadura?.nombre ?? 'Sin armadura'}</div>
          </div>
          <div className="derived-card">
            <div className="derived-label">Mental</div>
            <div className="derived-value">{resMental}</div>
            <div className="derived-detail">Rangos y beneficios</div>
          </div>
          <div className="derived-card">
            <div className="derived-label">Espiritual</div>
            <div className="derived-value">{resEspiritual}</div>
            <div className="derived-detail">Austeridades</div>
          </div>
        </div>
      </section>

      {/* Occult */}
      {((character.oculto?.psi ?? 0) > 0 || (character.oculto?.teurgia ?? 0) > 0) && (
        <section className="sheet-section">
          <h2>Oculto</h2>
          <div className="derived-grid">
            {(character.oculto?.psi ?? 0) > 0 && (
              <>
                <div className="derived-card">
                  <div className="derived-label">Psi</div>
                  <div className="derived-value">{character.oculto.psi}</div>
                </div>
                <div className="derived-card">
                  <div className="derived-label">Ansia</div>
                  <div className="derived-value">{character.oculto.ansia}</div>
                </div>
              </>
            )}
            {(character.oculto?.teurgia ?? 0) > 0 && (
              <>
                <div className="derived-card">
                  <div className="derived-label">Teurgia</div>
                  <div className="derived-value">{character.oculto.teurgia}</div>
                </div>
                <div className="derived-card">
                  <div className="derived-label">Hubris</div>
                  <div className="derived-value">{character.oculto.hubris}</div>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="sheet-section">
        <h2>Beneficios</h2>
        <ol className="sheet-list">
          {character.beneficios.map((b, i) => (
            <li key={i}>
              <Tooltip text={BENEFIT_TOOLTIPS[b.nombre]}>
                <span>
                  <strong>{b.nombre}</strong>
                  <span className="list-meta"> — {b.tipo} ({b.origen})</span>
                </span>
              </Tooltip>
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
              <Tooltip text={COMPETENCY_TOOLTIPS[c.nombre]}>
                <span>
                  {c.nombre}
                  <span className="list-meta"> ({c.origen})</span>
                </span>
              </Tooltip>
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
        .sheet-header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sheet-back {
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }
        .sheet-back:hover {
          color: var(--color-accent);
        }
        .sheet-export-btn {
          padding: var(--space-xs) var(--space-md);
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          color: var(--color-text-muted);
          font-size: 0.85rem;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .sheet-export-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }
        .sheet-levelup-btn {
          padding: var(--space-xs) var(--space-md);
          background: var(--color-accent);
          border: 1px solid var(--color-accent);
          border-radius: var(--radius-sm);
          color: var(--color-bg);
          font-size: 0.85rem;
          font-weight: bold;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .sheet-levelup-btn:hover {
          opacity: 0.85;
        }
        .sheet-levelup-section {
          background: rgba(196, 163, 90, 0.05);
          border: 1px solid var(--color-accent);
          border-radius: var(--radius-md);
          padding: var(--space-md);
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

        /* Buttons for level-up actions */
        .btn {
          padding: var(--space-sm) var(--space-lg);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: var(--color-bg-surface);
          color: var(--color-text);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
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
        .info-box {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-md);
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
