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
          <h1><em>Despierta.</em> <span className="hero-h1-main">Siente.</span> <em>Brilla.</em></h1>
          <p className="hero-sub">Construye espacios y caminos a nivel físico y mental, fuera y dentro de la esterilla.</p>
          <div className="hero-cta">
            <Link to="/aula-online" className="btn btn-hero-secondary">Aula Online</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-overlay" />
          <video
            autoPlay
            muted
            loop
            playsInline
            className="hero-video"
            poster="/images/saltamontes.jpg"
          >
            <source src="/images/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* TIERRA EN CALMA — showcase */}
      <section className="tq-showcase">
        <div className="tq-showcase-bg" />
        <div className="tq-showcase-inner">
          <div className="tq-showcase-text">
            <h2 className="tq-titulo">Tierra <em>en Calma</em></h2>
            <Link to="/audios" className="tq-cta">
              Escuchar ahora — es gratis <span>→</span>
            </Link>
          </div>
          <div className="tq-showcase-cards">
            <div className="tq-card tq-card--nidra">
              <span className="tq-card-icono">◎</span>
              <p className="tq-card-nombre">Yoga Nidra</p>
              <p className="tq-card-hint">El sueño consciente · 20–45 min</p>
            </div>
            <div className="tq-card tq-card--sleep">
              <span className="tq-card-icono">☽</span>
              <p className="tq-card-nombre">Antes de dormir</p>
              <p className="tq-card-hint">Cierra el día con calma · 8–12 min</p>
            </div>
          </div>
        </div>
      </section>

      {/* NUESTRA FORMA DE PRACTICAR */}
      <section id="clases" className="clases-desc-section">
        <p className="clases-desc-eyebrow">Nuestra forma de practicar</p>
        <div className="clases-desc-grid">
          <div className="clases-desc-item">
            <h3>El cuerpo como camino</h3>
            <p>Una práctica fundamental de cuidado y autoconocimiento. Un espacio de disfrute y exploración donde reencontrarte a través del cuerpo y volver a ti.</p>
          </div>
          <div className="clases-desc-divider" />
          <div className="clases-desc-item">
            <h3>La respiración y la mente</h3>
            <p>Para profundizar en estados más inconscientes, reequilibrar el sistema y descubrir una herramienta de autorregulación y foco en uno mism@.</p>
          </div>
        </div>
      </section>

      {/* CLASES ONLINE — diseño profesional split */}
      <section className="online-teaser">
        <div className="online-teaser-img">
          <img src="/images/yoga-18.jpg" alt="Clase de yoga online" />
        </div>
        <div className="online-teaser-text">
          <p className="hero-eyebrow">Aula Online</p>
          <h2>Practica donde quieras,<br /><em>cuando quieras</em></h2>
          <p className="online-teaser-desc">
            Yoga, meditación y pranayama en vídeo bajo demanda.<br />
            A tu ritmo, sin horarios fijos, desde cualquier dispositivo.
          </p>
          <div className="teaser-disciplinas">
            <div className="teaser-disciplina">
              <p className="teaser-disc-nombre">Vinyasa</p>
              <p className="teaser-disc-desc">Secuencias dinámicas que conectan respiración y movimiento, ideales para activar el cuerpo y la mente</p>
            </div>
            <div className="teaser-disciplina">
              <p className="teaser-disc-nombre">Yin Yoga</p>
              <p className="teaser-disc-desc">Posturas pasivas y de larga duración para soltar tensiones profundas y calmar el sistema nervioso</p>
            </div>
            <div className="teaser-disciplina">
              <p className="teaser-disc-nombre">Meditación</p>
              <p className="teaser-disc-desc">Prácticas guiadas para entrenar la atención, reducir el estrés y conectar contigo</p>
            </div>
            <div className="teaser-disciplina">
              <p className="teaser-disc-nombre">Pranayama</p>
              <p className="teaser-disc-desc">Técnicas de respiración consciente para regular la energía y equilibrar el estado emocional</p>
            </div>
          </div>
          <div className="teaser-pills">
            <span className="teaser-pill">Clases de 30 y 60 min</span>
            <span className="teaser-pill">Niveles 1, 2 y 3</span>
            <span className="teaser-pill">Clases nuevas cada mes</span>
            <span className="teaser-pill">Móvil, tablet y ordenador</span>
          </div>
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
            <Link to="/sobre-mi" className="btn btn-outline" style={{ marginTop: '1rem', display: 'inline-block' }}>Saber más</Link>
          </div>
          <div className="sobre-mi-img">
            <img src="/images/yo.jpg" alt="Instructora de yoga" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stats-bar-inner">

          <div className="stat-item">
            <span className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                <path d="M18 11V6.5a1.5 1.5 0 0 0-3 0V11"/>
                <path d="M15 11V5a1.5 1.5 0 0 0-3 0v6"/>
                <path d="M12 11V6.5a1.5 1.5 0 0 0-3 0V15"/>
                <path d="M9 11.5a1.5 1.5 0 0 0-3 0V17a6 6 0 0 0 12 0v-2a1.5 1.5 0 0 0-3 0"/>
              </svg>
            </span>
            <span className="stat-label">Todos los niveles</span>
          </div>

          <div className="stat-item">
            <span className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                <path d="M15 10l4.553-2.277A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14"/>
                <rect x="2" y="6" width="13" height="12" rx="2"/>
              </svg>
            </span>
            <span className="stat-label">+30 clases grabadas</span>
          </div>

          <div className="stat-item">
            <span className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/>
              </svg>
            </span>
            <span className="stat-label">Contenido nuevo</span>
          </div>

          <div className="stat-item">
            <span className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
                <path d="M9 21V12h6v9"/>
              </svg>
            </span>
            <span className="stat-label">Desde casa, cuando quieras</span>
          </div>

        </div>
      </div>

      {/* TESTIMONIOS */}
      <section className="testimonios">
        <p className="clases-desc-eyebrow">Lo que dicen</p>
        <h2 className="testimonios-titulo">Cuando compartimos energía,<br /><em>las distancias desaparecen</em></h2>
        <div className="testimonios-grid">
          {[
            { texto: 'Llevo años con Paula y cada clase es un regalo. Llego con la cabeza llena y salgo en otro estado. Ha transformado mi relación con mi cuerpo y conmigo misma.', nombre: 'Laura M.', detalle: 'Alumna desde 2021' },
            { texto: 'Paula tiene una forma de enseñar muy especial. Nunca me había sentido tan segura en una clase de yoga. Cada movimiento tiene sentido y lo explica con una calma que se contagia.', nombre: 'Sofía R.', detalle: 'Alumna desde 2022' },
            { texto: 'Las clases de pranayama me cambiaron la vida. Yo era muy escéptica pero después de la primera sesión ya no pude parar. La recomiendo a cualquier persona, venga de donde venga.', nombre: 'Ana P.', detalle: 'Alumna desde 2023' },
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
