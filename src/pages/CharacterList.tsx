import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '@/db'
import {
  buildExportPayload,
  downloadExport,
  exportFilename,
  parseAndValidateImport,
  importCharacters,
} from '@/utils/characterExportImport'
import type { Character } from '@/types/character'

type ImportStatus =
  | { phase: 'idle' }
  | { phase: 'preview'; characters: Omit<Character, 'id'>[]; filename: string }
  | { phase: 'error'; message: string }
  | { phase: 'success'; count: number }

export function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [importStatus, setImportStatus] = useState<ImportStatus>({ phase: 'idle' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  function loadCharacters() {
    return db.characters
      .orderBy('updatedAt')
      .reverse()
      .toArray()
      .then(setCharacters)
  }

  useEffect(() => {
    loadCharacters().finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string) {
    await db.characters.delete(id)
    setCharacters(prev => prev.filter(c => c.id !== id))
    setConfirmDelete(null)
  }

  function handleExportAll() {
    const payload = buildExportPayload(characters)
    downloadExport(payload, exportFilename())
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = parseAndValidateImport(reader.result as string)
      if (result.ok) {
        setImportStatus({ phase: 'preview', characters: result.data.characters, filename: file.name })
      } else {
        setImportStatus({ phase: 'error', message: result.error })
      }
    }
    reader.onerror = () => {
      setImportStatus({ phase: 'error', message: 'Error al leer el archivo' })
    }
    reader.readAsText(file)

    // Reset input so the same file can be selected again
    e.target.value = ''
  }

  async function handleImportConfirm() {
    if (importStatus.phase !== 'preview') return
    try {
      const count = await importCharacters(importStatus.characters)
      await loadCharacters()
      setImportStatus({ phase: 'success', count })
      setTimeout(() => setImportStatus({ phase: 'idle' }), 4000)
    } catch {
      setImportStatus({ phase: 'error', message: 'Error al guardar los personajes' })
    }
  }

  return (
    <div className="character-list">
      <header className="character-list-header">
        <Link to="/" className="back-link">&larr; Inicio</Link>
        <div className="header-row">
          <h1>Personajes</h1>
          <div className="header-actions">
            <button className="secondary-btn" onClick={() => fileInputRef.current?.click()}>
              Importar
            </button>
            {characters.length > 0 && (
              <button className="secondary-btn" onClick={handleExportAll}>
                Exportar Todos
              </button>
            )}
            <Link to="/personajes/nuevo" className="create-btn">+ Nuevo Personaje</Link>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </header>

      {/* Import feedback panel */}
      {importStatus.phase === 'error' && (
        <div className="import-panel import-error">
          <p>{importStatus.message}</p>
          <button className="secondary-btn" onClick={() => setImportStatus({ phase: 'idle' })}>Cerrar</button>
        </div>
      )}

      {importStatus.phase === 'preview' && (
        <div className="import-panel import-preview">
          <p><strong>Importar {importStatus.characters.length} personaje{importStatus.characters.length > 1 ? 's' : ''}</strong> desde {importStatus.filename}:</p>
          <ul className="import-char-list">
            {importStatus.characters.map((c, i) => (
              <li key={i}>{c.nombre || 'Sin nombre'} — {c.clase} · {c.faccion}</li>
            ))}
          </ul>
          <div className="import-actions">
            <button className="create-btn" onClick={handleImportConfirm}>Importar</button>
            <button className="secondary-btn" onClick={() => setImportStatus({ phase: 'idle' })}>Cancelar</button>
          </div>
        </div>
      )}

      {importStatus.phase === 'success' && (
        <div className="import-panel import-success">
          <p>{importStatus.count} personaje{importStatus.count > 1 ? 's' : ''} importado{importStatus.count > 1 ? 's' : ''} correctamente.</p>
        </div>
      )}

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
            <li key={char.id} className="character-card-wrapper">
              <Link to={`/personajes/${char.id}`} className="character-card">
                <h3>{char.nombre || 'Sin nombre'}</h3>
                <p>{char.clase} · {char.faccion} · Nivel {char.nivel}</p>
              </Link>
              {confirmDelete === char.id ? (
                <div className="delete-confirm">
                  <span className="delete-confirm-text">&iquest;Eliminar?</span>
                  <button className="delete-confirm-yes" onClick={() => handleDelete(char.id)}>S&iacute;</button>
                  <button className="delete-confirm-no" onClick={() => setConfirmDelete(null)}>No</button>
                </div>
              ) : (
                <button className="delete-btn" onClick={() => setConfirmDelete(char.id)} title="Eliminar personaje">&times;</button>
              )}
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
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-sm);
        }
        .header-actions {
          display: flex;
          gap: var(--space-sm);
          align-items: center;
          flex-wrap: wrap;
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
        .character-card-wrapper {
          position: relative;
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
        .delete-btn {
          position: absolute;
          top: var(--space-xs);
          right: var(--space-xs);
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: var(--radius-sm);
          background: transparent;
          color: var(--color-text-muted);
          font-size: 0.85rem;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.15s, color 0.15s;
        }
        .character-card-wrapper:hover .delete-btn {
          opacity: 1;
        }
        .delete-btn:hover {
          color: var(--color-danger);
          background: rgba(196, 74, 74, 0.1);
        }
        .delete-confirm {
          position: absolute;
          top: var(--space-xs);
          right: var(--space-xs);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          background: var(--color-bg-surface);
          border: 1px solid var(--color-danger);
          border-radius: var(--radius-sm);
          padding: 2px var(--space-xs);
        }
        .delete-confirm-text {
          font-size: 0.8rem;
          color: var(--color-danger);
        }
        .delete-confirm-yes,
        .delete-confirm-no {
          border: none;
          border-radius: var(--radius-sm);
          padding: 2px var(--space-sm);
          font-size: 0.8rem;
          cursor: pointer;
          min-height: 26px;
        }
        .delete-confirm-yes {
          background: var(--color-danger);
          color: white;
        }
        .delete-confirm-yes:hover {
          background: #d35555;
        }
        .delete-confirm-no {
          background: var(--color-bg-card);
          color: var(--color-text-muted);
        }
        .delete-confirm-no:hover {
          color: var(--color-text);
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
          border: none;
          cursor: pointer;
        }
        .create-btn:hover {
          background: var(--color-accent-hover);
          color: #1a1a2e;
        }
        .secondary-btn {
          display: inline-flex;
          align-items: center;
          padding: var(--space-sm) var(--space-md);
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-muted);
          font-size: 0.9rem;
          cursor: pointer;
          min-height: var(--tap-min);
          transition: border-color 0.15s, color 0.15s;
        }
        .secondary-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }
        .import-panel {
          padding: var(--space-md);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: var(--color-bg-card);
        }
        .import-error {
          border-color: var(--color-danger);
          color: var(--color-danger);
        }
        .import-error .secondary-btn {
          margin-top: var(--space-sm);
          color: var(--color-danger);
          border-color: var(--color-danger);
        }
        .import-preview p {
          margin-bottom: var(--space-sm);
        }
        .import-char-list {
          list-style: none;
          margin-bottom: var(--space-md);
        }
        .import-char-list li {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          padding: var(--space-xs) 0;
          border-bottom: 1px solid var(--color-border);
        }
        .import-actions {
          display: flex;
          gap: var(--space-sm);
        }
        .import-success {
          border-color: var(--color-accent);
          color: var(--color-accent);
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
