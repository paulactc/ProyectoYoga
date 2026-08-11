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

      {/* FORMAS DE PRACTICAR CONMIGO — presencial, privada u online */}
      <section className="servicios-section">
        <p className="clases-desc-eyebrow">Cómo practicar conmigo</p>
        <h2 className="servicios-titulo">Distintas formas de <em>practicar conmigo</em></h2>
        <div className="servicios-grid">
          <div className="servicio-card">
            <div className="servicio-card-img servicio-card-img--tall">
              <img src="/images/yoga-18.jpg" alt="Clase de yoga presencial en grupo" />
              <span className="servicio-card-tag">Presencial</span>
            </div>
            <div className="servicio-card-body">
              <h3>Clases presenciales, en grupo</h3>
              <p>En distintos centros, con metodología adaptada a cada grupo y ajustes físicos precisos en cada postura. Mi forma habitual de dar clase desde 2017.</p>
              <a href="#contacto" className="servicio-card-cta">Consultar horarios y centros <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div className="servicio-card">
            <div className="servicio-card-img servicio-card-img--taller">
              <img src="/images/yogaprivadas.jpg" alt="Clase privada de yoga uno a uno" />
              <span className="servicio-card-tag">Clases privadas</span>
            </div>
            <div className="servicio-card-body">
              <h3>Clases privadas, 1 a 1</h3>
              <p>Sesiones diseñadas solo para ti: tu cuerpo, tu historia, tu ritmo. Trabajamos exactamente lo que necesitas, sin encajar en un molde ni compartir el tiempo con nadie más.</p>
              <a href="#contacto" className="servicio-card-cta">Consultar disponibilidad <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div className="servicio-card">
            <div className="servicio-card-img">
              <img src="/images/avanzadoa2.jpg" alt="Clase de yoga online en directo por videollamada" />
              <span className="servicio-card-tag">Online</span>
            </div>
            <div className="servicio-card-body">
              <h3>Clases en directo, online</h3>
              <p>Practica conmigo en tiempo real por videollamada, en sesión individual o en grupo reducido. La cercanía de una clase presencial, desde donde estés.</p>
              <a href="#contacto" className="servicio-card-cta">Consultar disponibilidad <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
      </section>

      {/* EL PACK RAÍZ — apoyo a la práctica, no el centro de la web */}
      {/*
        Antes esta sección era un teaser de 3 cajas (La Travesía / Explora / Grupos)
        que enlazaban a distintas vistas del Aula Online con suscripción mensual.
        Se archivó junto con esas vistas — ver frontend/src/pages/_archivo/.
      */}
      <section className="online-teaser">
        <div className="online-teaser-img online-teaser-img--derecha">
          <img src="/images/yoga17.jpg" alt="Ajuste físico preciso en clase de movilidad funcional" />
        </div>
        <div className="online-teaser-text">
          <p className="hero-eyebrow">Un apoyo para tu práctica</p>
          <h2>Diez clases para<br /><em>practicar en casa, a tu ritmo</em></h2>
          <p className="online-teaser-desc">
            Mi foco es acompañarte en persona. El Pack Raíz es un extra: pensado
            para esos momentos puntuales en los que quieres practicar en casa
            a tu ritmo, o para conocer mi forma de enseñar antes de venir a clase.
          </p>
          <div className="teaser-pastel-grid">
            <div className="teaser-pastel-box teaser-pastel-box--1">
              <p className="teaser-pastel-nombre">Ajustes precisos</p>
              <p className="teaser-pastel-desc">Indicaciones claras de alineación en cada clase, no solo posturas.</p>
            </div>
            <div className="teaser-pastel-box teaser-pastel-box--2">
              <p className="teaser-pastel-nombre">Movilidad funcional</p>
              <p className="teaser-pastel-desc">Patrones de movimiento que tu cuerpo usa de verdad, cada día.</p>
            </div>
            <div className="teaser-pastel-box teaser-pastel-box--3">
              <p className="teaser-pastel-nombre">Pago único</p>
              <p className="teaser-pastel-desc">15€, sin renovaciones. El pack es tuyo para siempre.</p>
            </div>
          </div>
          <Link to="/suscripcion" className="btn">Ver el Pack Raíz →</Link>
        </div>
      </section>

      {/* NUESTRA FORMA DE PRACTICAR */}
      <section id="clases" className="clases-desc-section">
        <p className="clases-desc-eyebrow">Nuestra forma de practicar</p>
        <div className="clases-desc-grid">
          <div className="clases-desc-item">
            <h3>El cuerpo como camino</h3>
            <p>Una práctica para cuidarte y reencontrarte a través del movimiento. Un espacio donde explorar, escuchar tu cuerpo y volver a ti, sin exigencias ni prisas.</p>
          </div>
          <div className="clases-desc-divider" />
          <div className="clases-desc-item">
            <h3>La respiración y la mente</h3>
            <p>La respiración conecta el cuerpo y la mente de formas que sorprenden. Aprenderás a usarla para calmarte, centrarte y encontrar tu propio equilibrio cuando el día se complica.</p>
          </div>
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
            <Link to="/sobre-mi" className="btn btn-outline" style={{ marginTop: '1rem', display: 'inline-block', alignSelf: 'center' }}>Saber más</Link>
          </div>
          <div className="sobre-mi-img">
            <img src="/images/yoga11.jpg" alt="Instructora de yoga" />
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
            <span className="stat-label">Trato personal, tú a tú</span>
            <span className="stat-detail">practicas adaptadas a tu cuerpo y tu historia</span>
          </div>

          <div className="stat-item">
            <span className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                <path d="M15 10l4.553-2.277A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14"/>
                <rect x="2" y="6" width="13" height="12" rx="2"/>
              </svg>
            </span>
            <span className="stat-label">Pack Raíz de apoyo</span>
            <span className="stat-detail">10 clases para practicar en casa, a tu ritmo</span>
          </div>

          <div className="stat-item">
            <span className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/>
              </svg>
            </span>
            <span className="stat-label">Ajustes físicos precisos</span>
            <span className="stat-detail">en cada clase</span>
          </div>

          <div className="stat-item">
            <span className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
                <path d="M9 21V12h6v9"/>
              </svg>
            </span>
            <span className="stat-label">Presencial, en directo o grabado</span>
            <span className="stat-detail">elige cómo practicar conmigo</span>
          </div>

        </div>
      </div>

      {/* TESTIMONIOS */}
      <section className="testimonios">
        <p className="clases-desc-eyebrow">Lo que dicen</p>
        <h2 className="testimonios-titulo">Cuando compartimos energía,<br /><em>las distancias desaparecen</em></h2>
        <div className="testimonios-grid">
          {[
            { texto: 'Yo nunca había hecho yoga en mi vida y la verdad es que me dio un poco de miedo al principio. Pero con Paula desde el primer día me sentí en casa. Ahora no me la quita nadie.', nombre: 'Laura M.', detalle: 'Alumna desde 2021' },
            { texto: 'Vine porque tenía la espalda fatal y me quedé por todo lo demás. Paula te escucha, adapta la clase a cómo estás ese día y encima te lo pasas bien. Eso no lo encuentras en todos lados.', nombre: 'Sofía R.', detalle: 'Alumna desde 2022' },
            { texto: 'Lo de la respiración me parecía un rollo hasta que lo probé. Salí de esa clase sin ansiedad por primera vez en meses. No sé cómo explicarlo pero funciona, y Paula sabe muy bien lo que hace.', nombre: 'Ana P.', detalle: 'Alumna desde 2023' },
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

      {/* TIERRA EN CALMA — showcase, en segundo plano al final del recorrido */}
      <section className="tq-showcase">
        <div className="tq-showcase-bg" />
        <div className="tq-showcase-inner">
          <div className="tq-showcase-text">
            <h2 className="tq-titulo">Tierra <em>en Calma</em></h2>
            <p className="tq-desc">Meditaciones guiadas de noche para soltar la tensión del día y preparar el cuerpo y la mente para el descanso profundo.</p>
            <Link to="/audios" className="tq-cta">
              Escuchar ahora GRATIS <span>→</span>
            </Link>
          </div>
          <div className="tq-feature">
            <div className="tq-feature-glow" />
            <span className="tq-feature-moon">☽</span>
            <p className="tq-feature-nombre">Antes de dormir</p>
            <p className="tq-feature-desc">Una meditación guiada para soltar la tensión del día, calmar el sistema nervioso y preparar el cuerpo y la mente para el descanso.</p>
            <span className="tq-feature-sep" />
            <p className="tq-feature-hint">Cierra el día con calma · 10-15 min</p>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="contacto">
        <div className="contacto-inner">
          <h2>Contáctame</h2>
          <p className="contacto-sub">Da el primer paso. Tu camino empieza aquí.</p>
          <div className="contacto-foto">
            <img src="/images/yoga6.jpg" alt="Yoga Tierra Viva" />
          </div>
          <form className="contact-form" onSubmit={handleContact}>
            <input type="text" placeholder="Tu nombre" required value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
            <input type="email" placeholder="Tu email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <textarea rows={4} placeholder="Tu mensaje" required value={form.mensaje} onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))} />
            <button type="submit" className="btn" disabled={contactStatus === 'loading'}>{contactBtnText}</button>
          </form>
        </div>
      </section>
    </>
  )
}
