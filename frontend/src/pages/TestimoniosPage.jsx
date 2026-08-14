import { useState } from 'react'

export default function TestimoniosPage() {
  const [form, setForm] = useState({ nombre: '', texto: '' })
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/testimonios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setForm({ nombre: '', texto: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const btnText = {
    loading: 'Enviando…',
    success: '¡Enviado! ✓',
    error: 'Error al enviar',
  }[status] || 'Enviar mi opinión'

  return (
    <main className="legal-main">
      <div className="legal-wrap">
        <header className="page-header">
          <p className="hero-eyebrow">Tu experiencia</p>
          <h1>Cuéntame <em>qué tal ha ido</em></h1>
          <p>Si te apetece compartir cómo ha sido tu experiencia en las clases, aquí puedes dejar tu opinión. Con tu permiso, la publicaré en la web para que otras personas la vean.</p>
        </header>

        {status === 'success' ? (
          <p className="legal-updated" style={{ textAlign: 'center', fontSize: '1.05rem' }}>
            ¡Gracias por tu tiempo! He recibido tu opinión.
          </p>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} style={{ maxWidth: 480, margin: '0 auto' }}>
            <input
              type="text"
              placeholder="Tu nombre"
              required
              maxLength={100}
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
            />
            <textarea
              rows={5}
              placeholder="Cuéntame qué tal ha sido tu experiencia..."
              required
              maxLength={1000}
              value={form.texto}
              onChange={e => setForm(f => ({ ...f, texto: e.target.value }))}
            />
            <button type="submit" className="btn" disabled={status === 'loading'}>{btnText}</button>
            {status === 'error' && <p className="plans-error">No se pudo enviar. Inténtalo de nuevo.</p>}
          </form>
        )}
      </div>
    </main>
  )
}
