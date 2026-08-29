import { useState } from 'react'

const DIAS = [
  { id: 'lunes', label: 'Lunes' },
  { id: 'miercoles', label: 'Miércoles' },
]

const MENSAJE_AVISO = encodeURIComponent(
  'Hola Paula, el horario de lunes y miércoles a las 19:00h no me encaja. ¿Me avisas cuando abráis nuevos horarios de clases presenciales de Vinyasa en Chiclana de la Frontera? ¡Gracias!'
)

function formatDiasSeleccionados(dias) {
  const nombres = dias.map(id => DIAS.find(d => d.id === id).label)
  return nombres.join(' y ')
}

export default function ReservaPresencialModal({ isOpen, onClose }) {
  const [diasSel, setDiasSel] = useState([])
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' })
  const [status, setStatus] = useState(null) // null | loading | success | error

  function toggleDia(id) {
    setDiasSel(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id])
  }

  function handleClose() {
    onClose()
    setTimeout(() => {
      setDiasSel([])
      setForm({ nombre: '', email: '', telefono: '' })
      setStatus(null)
    }, 200)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (diasSel.length === 0) return
    setStatus('loading')
    try {
      const res = await fetch('/api/reserva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, dias: diasSel }),
      })
      const data = await res.json()
      setStatus(data.success ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) handleClose() }}>
      <div className="modal-content">
        <button className="modal-close" onClick={handleClose}>&times;</button>

        {status === 'success' ? (
          <>
            <h3>¡Reserva enviada!</h3>
            <p className="forgot-desc">
              Te he apuntado para <strong>{formatDiasSeleccionados(diasSel)}</strong>. Te confirmo tu plaza por
              email a <strong>{form.email}</strong> en breve.
            </p>
            <button className="btn" style={{ width: '100%', marginTop: '1rem' }} onClick={handleClose}>Cerrar</button>
          </>
        ) : (
          <>
            <h3>Clases presenciales de Vinyasa</h3>
            <p className="forgot-desc" style={{ marginBottom: '1.25rem' }}>
              Chiclana de la Frontera · 19:00h (1h15) · Todos los niveles · 15€ clase suelta · Plazas abiertas
            </p>

            <p style={{ fontWeight: 600, marginBottom: '0.6rem' }}>¿Qué día(s) te viene bien?</p>
            <div className="reserva-fechas-grid">
              {DIAS.map(d => (
                <button
                  type="button"
                  key={d.id}
                  className={`reserva-fecha-btn${diasSel.includes(d.id) ? ' selected' : ''}`}
                  onClick={() => toggleDia(d.id)}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <form className="contact-form" onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
              <input
                type="text" placeholder="Tu nombre" required
                value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              />
              <input
                type="email" placeholder="Tu email" required
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              <input
                type="tel" placeholder="Teléfono (opcional)"
                value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
              />
              {status === 'error' && (
                <p style={{ color: '#b04040', fontSize: '0.85rem' }}>No se pudo enviar la reserva. Inténtalo de nuevo.</p>
              )}
              <button type="submit" className="btn" disabled={diasSel.length === 0 || status === 'loading'}>
                {status === 'loading' ? 'Enviando…' : 'Reservar mi plaza'}
              </button>
            </form>

            <p className="auth-modal-foot">
              ¿No te encaja este horario? <a
                href={`mailto:paulact39@gmail.com?subject=${encodeURIComponent('Avísame de nuevos horarios de clases presenciales')}&body=${MENSAJE_AVISO}`}
                className="forgot-link"
              >
                Escríbeme para que te avise de nuevos horarios →
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
