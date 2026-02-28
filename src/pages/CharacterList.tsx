import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '@/db'
import type { Character } from '@/types/character'

export function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    db.characters
      .orderBy('updatedAt')
      .reverse()
      .toArray()
      .then(setCharacters)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="character-list">
      <header className="character-list-header">
        <Link to="/" className="back-link">← Inicio</Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Personajes</h1>
          <Link to="/personajes/nuevo" className="create-btn">+ Nuevo Personaje</Link>
        </div>
      </header>

      {loading ? (
        <p className="loading">Cargando...</p>
      ) : characters.length === 0 ? (
        <div className="empty-state">
          <p>No tienes personajes todavía.</p>
          <p className="empty-hint">Crea tu primer personaje para empezar tu aventura en los Mundos Conocidos.</p>
        </div>
      ) : (
        <ul className="character-grid">
          {characters.map((char) => (
            <li key={char.id}>
              <Link to={`/personajes/${char.id}`} className="character-card">
                <h3>{char.nombre || 'Sin nombre'}</h3>
                <p>{char.clase} · {char.faccion} · Nivel {char.nivel}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .character-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }
        .character-list-header {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        .back-link {
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }
        .back-link:hover {
          color: var(--color-accent);
        }
        .empty-state {
          text-align: center;
          padding: var(--space-2xl) var(--space-md);
        }
        .empty-hint {
          color: var(--color-text-muted);
          margin-top: var(--space-sm);
        }
        .character-grid {
          list-style: none;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-md);
        }
        .character-card {
          display: block;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-md);
          transition: border-color 0.15s;
        }
        .character-card:hover {
          border-color: var(--color-accent);
        }
        .character-card h3 {
          color: var(--color-accent);
          margin-bottom: var(--space-xs);
        }
        .character-card p {
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }
        .create-btn {
          display: inline-flex;
          align-items: center;
          padding: var(--space-sm) var(--space-lg);
          background: var(--color-accent);
          color: #1a1a2e;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.9rem;
          min-height: var(--tap-min);
        }
        .create-btn:hover {
          background: var(--color-accent-hover);
          color: #1a1a2e;
        }
        .loading {
          text-align: center;
          color: var(--color-text-muted);
          padding: var(--space-xl);
        }
      `}</style>
    </div>
  )
}
