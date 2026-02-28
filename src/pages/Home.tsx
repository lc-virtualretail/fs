import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Fading Suns</h1>
        <p className="home-subtitle">Compañero de Juego</p>
      </header>

      <nav className="home-nav">
        <Link to="/personajes" className="home-card">
          <h2>Personajes</h2>
          <p>Crea y gestiona tus personajes</p>
        </Link>

        <div className="home-card home-card--disabled">
          <h2>Campañas</h2>
          <p>Próximamente</p>
        </div>

        <div className="home-card home-card--disabled">
          <h2>Motor de Reglas</h2>
          <p>Próximamente</p>
        </div>
      </nav>

      <style>{`
        .home {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xl);
          padding-top: var(--space-2xl);
        }
        .home-header {
          text-align: center;
        }
        .home-header h1 {
          font-size: 2.5rem;
          letter-spacing: 0.05em;
        }
        .home-subtitle {
          color: var(--color-text-muted);
          font-size: 1.1rem;
          margin-top: var(--space-xs);
        }
        .home-nav {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-md);
          width: 100%;
          max-width: 800px;
        }
        .home-card {
          display: block;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          transition: border-color 0.2s, transform 0.1s;
        }
        .home-card:hover {
          border-color: var(--color-accent);
          transform: translateY(-2px);
        }
        .home-card h2 {
          font-size: 1.3rem;
          margin-bottom: var(--space-xs);
        }
        .home-card p {
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }
        .home-card--disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .home-card--disabled:hover {
          border-color: var(--color-border);
          transform: none;
        }
      `}</style>
    </div>
  )
}
