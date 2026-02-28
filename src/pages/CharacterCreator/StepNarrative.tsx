import type { StepProps } from './creatorTypes'

export function StepNarrative({ draft, updateDraft, goNext }: StepProps) {
  const canProceed = draft.nombre.trim().length > 0

  return (
    <div>
      <h2 className="step-title">Fase 1: Narrativa del Personaje</h2>

      <div className="form-field">
        <label>Nombre completo *</label>
        <input
          type="text"
          value={draft.nombre}
          onChange={e => updateDraft({ nombre: e.target.value })}
          placeholder="Ej: Sir Aldric Hawkwood"
        />
      </div>

      <div className="form-field">
        <label>Concepto (una frase)</label>
        <input
          type="text"
          value={draft.concepto}
          onChange={e => updateDraft({ concepto: e.target.value })}
          placeholder="Ej: Caballero errante buscando redención"
        />
      </div>

      <div className="form-field">
        <label>Planeta natal</label>
        <input
          type="text"
          value={draft.planeta}
          onChange={e => updateDraft({ planeta: e.target.value })}
          placeholder="Ej: Ravenna, Byzantium Secundus..."
        />
      </div>

      <div className="form-field">
        <label>Fecha de nacimiento</label>
        <input
          type="text"
          value={draft.fechaNacimiento}
          onChange={e => updateDraft({ fechaNacimiento: e.target.value })}
          placeholder="Ej: 4993 EC"
        />
      </div>

      <div className="form-field">
        <label>Descripción física (1 párrafo)</label>
        <textarea
          value={draft.descripcionFisica}
          onChange={e => updateDraft({ descripcionFisica: e.target.value })}
          placeholder="Edad, complexión, rasgos faciales, rasgo distintivo..."
        />
      </div>

      <div className="form-field">
        <label>Personalidad (1 párrafo)</label>
        <textarea
          value={draft.personalidad}
          onChange={e => updateDraft({ personalidad: e.target.value })}
          placeholder="Virtudes, defectos, relación con la fe y el poder..."
        />
      </div>

      <div className="form-field">
        <label>Trasfondo (1 párrafo)</label>
        <textarea
          value={draft.trasfondo}
          onChange={e => updateDraft({ trasfondo: e.target.value })}
          placeholder="Origen familiar, evento clave, motivación actual..."
        />
      </div>

      <div className="step-nav">
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={goNext} disabled={!canProceed}>
          Siguiente →
        </button>
      </div>
    </div>
  )
}
