import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const heroImgRef = useRef(null)
  const heroSectionRef = useRef(null)
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [contactStatus, setContactStatus] = useState(null)

  useEffect(() => {
    function onScroll() {
      if (window.innerWidth > 768 && heroImgRef.current && heroSectionRef.current) {
        const scrollY = window.scrollY
        if (scrollY <= heroSectionRef.current.offsetHeight + 200) {
          heroImgRef.current.style.transform = `translateY(${scrollY * 0.22}px)`
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleContact(e) {
    e.preventDefault()
    setContactStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      setContactStatus(data.success ? 'success' : 'error')
      if (data.success) setForm({ nombre: '', email: '', mensaje: '' })
    } catch {
      setContactStatus('error')
    }
    setTimeout(() => setContactStatus(null), 3000)
  }

  const contactBtnText = {
    loading: 'Enviando…',
    success: '¡Enviado! ✓',
    error: 'Error al enviar',
  }[contactStatus] || 'Enviar mensaje'

  return (
    <>
      {/* HERO */}
      <section id="inicio" className="hero" ref={heroSectionRef}>
        <div className="hero-content">
          <p className="hero-eyebrow">Movilidad como terapia natural</p>
          <h1><em>Despierta.</em><br />Siente.<br /><em>Brilla.</em></h1>
          <p className="hero-sub">Construye espacios y caminos a nivel físico y mental, fuera y dentro de la esterilla.</p>
          <div className="hero-cta">
            <Link to="/suscripcion" className="btn btn-hero-primary">Prueba 7 días gratis</Link>
            <a href="#clases" className="btn btn-hero-secondary">Ver clases</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-overlay" />
          <picture>
            <source media="(max-width: 768px)" srcSet="/images/saltamontes.jpg" />
            <img ref={heroImgRef} src="/images/saltamontes.jpg" alt="Yoga" />
          </picture>
        </div>
      </section>

      {/* LO QUE PRACTICAMOS */}
      <section id="clases" className="clases-desc-section">
        <p className="clases-desc-eyebrow">Lo que practicamos</p>
        <div className="clases-desc-grid">
          <div className="clases-desc-item">
            <span className="clases-desc-tag">Yoga Vinyasa</span>
            <h3>Movimiento y exploración</h3>
            <p>Una práctica fundamental de cuidado y autoconocimiento. Un espacio de disfrute y exploración donde reencontrarte a través del cuerpo y volver a ti.</p>
          </div>
          <div className="clases-desc-divider" />
          <div className="clases-desc-item">
            <span className="clases-desc-tag">Yin Yoga</span>
            <h3>Pranayama y meditación</h3>
            <p>Para profundizar en estados más inconscientes, reequilibrar el sistema y descubrir una herramienta de autorregulación y foco en uno mism@.</p>
          </div>
        </div>
      </section>

      {/* CLASES ONLINE — diseño profesional split */}
      <section className="online-teaser">
        <div className="online-teaser-img">
          <img src="/images/yoga-36.jpg" alt="Clase de yoga online" />
        </div>
        <div className="online-teaser-text">
          <p className="hero-eyebrow">Clases Online</p>
          <h2>Practica donde quieras,<br /><em>cuando quieras</em></h2>
          <p className="online-teaser-desc">
            Yoga y pranayama en vídeo bajo demanda. A tu ritmo, sin horarios fijos, desde cualquier dispositivo.
          </p>
          <ul className="teaser-feature-list">
            <li>Clases de 30 y 60 minutos</li>
            <li>Niveles 1, 2 y 3: principiante a avanzado</li>
            <li>Asanas, movimiento libre y pranayama</li>
            <li>Nuevas clases incorporadas cada mes</li>
            <li>Compatible con móvil, tablet y ordenador</li>
          </ul>
          <div className="teaser-price-hint">
            Desde <strong>12€/mes</strong> · 7 días de prueba gratuita
          </div>
          <Link to="/suscripcion" className="btn">Ver planes →</Link>
        </div>
      </section>

      {/* SOBRE MÍ */}
      <section id="sobre-mi" className="section sobre-mi">
        <div className="sobre-mi-content">
          <div className="sobre-mi-text">
            <h2>Qué es Yoga Tierra</h2>
            <p>El yoga te despierta, te hace sentirte y aprender de ti mismo. Esa es mi filosofía y el motor de cada clase que imparto.</p>
            <p>Mi camino en el yoga nació de la necesidad de escucharme. Hoy acompaño a otros a descubrir que el brillo siempre va desde dentro hacia fuera, y que la esterilla es solo el comienzo.</p>
            <p>Una metodología flexible capaz de adaptarse a tu ritmo de vida.</p>
          </div>
          <div className="sobre-mi-img">
            <img src="/images/yo.jpg" alt="Instructora de yoga" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stats-bar-inner">
          {[
            { number: '+200', unit: '', label: 'alumnas activas' },
            { number: '4.9', unit: '★', label: 'valoración media' },
            { number: '+30', unit: '', label: 'clases en biblioteca' },
            { number: '7', unit: '', label: 'días de prueba gratis' },
          ].map(({ number, unit, label }) => (
            <div className="stat-item" key={label}>
              <span className="stat-number">{number}<em>{unit}</em></span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIOS */}
      <section className="testimonios">
        <p className="clases-desc-eyebrow">Lo que dicen</p>
        <h2 className="testimonios-titulo">Ellas ya lo sienten</h2>
        <div className="testimonios-grid">
          {[
            { texto: 'Desde que empecé con Yoga Tierra Viva noto que mi cuerpo responde diferente. Llevo tres meses y ya no entiendo mis mañanas sin esta práctica.', nombre: 'Laura M.', detalle: '3 meses practicando' },
            { texto: 'Lo que más me sorprendió fue lo flexible que es todo. Puedo practicar cuando quiero, al ritmo que necesito. Encaja perfectamente con mi vida.', nombre: 'Sofía R.', detalle: '5 meses practicando' },
            { texto: 'Las clases de pranayama cambiaron mi relación con el estrés. Nunca pensé que la respiración pudiera ser tan poderosa. Lo recomiendo a todo el mundo.', nombre: 'Ana P.', detalle: '2 meses practicando' },
          ].map(({ texto, nombre, detalle }) => (
            <div className="testimonio-card" key={nombre}>
              <div className="testimonio-stars">★★★★★</div>
              <p className="testimonio-quote">"{texto}"</p>
              <div className="testimonio-autor">
                <strong>{nombre}</strong>
                {detalle}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="section contacto">
        <h2>Contáctame</h2>
        <p className="section-sub">Da el primer paso. Tu camino empieza aquí.</p>
        <form className="contact-form" onSubmit={handleContact}>
          <input type="text" placeholder="Tu nombre" required value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
          <input type="email" placeholder="Tu email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <textarea rows={5} placeholder="Tu mensaje" required value={form.mensaje} onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))} />
          <button type="submit" className="btn" disabled={contactStatus === 'loading'}>{contactBtnText}</button>
        </form>
      </section>
    </>
  )
}
