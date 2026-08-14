import { useEffect, useRef, useState } from 'react'

function StatCounter({ valor, etiqueta }) {
  const [conteo, setConteo] = useState(0)
  const ref = useRef(null)
  const animado = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const animar = () => {
      if (animado.current) return
      animado.current = true
      const duracion = 1400
      const inicio = performance.now()
      const paso = (ahora) => {
        const progreso = Math.min((ahora - inicio) / duracion, 1)
        const facilitado = 1 - Math.pow(1 - progreso, 3)
        setConteo(Math.round(facilitado * valor))
        if (progreso < 1) requestAnimationFrame(paso)
      }
      requestAnimationFrame(paso)
    }

    if (typeof IntersectionObserver === 'undefined') {
      animar()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) animar()
      },
      { threshold: 0.2 }
    )
    observer.observe(el)

    // Red de seguridad: si el elemento ya está visible al montar, algunos
    // navegadores retrasan el primer callback del observer más de la cuenta.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) animar()

    return () => observer.disconnect()
  }, [valor])

  return (
    <div className="sobre-stat" ref={ref}>
      <p className="sobre-stat-numero">
        {conteo}<span className="sobre-stat-plus">+</span>
      </p>
      <p className="sobre-stat-label">{etiqueta}</p>
    </div>
  )
}

export default function SobreMiPage() {
  return (
    <div className="sobre-page">

      <header className="sobre-hero">
        <div className="sobre-hero-bg" />
        <div className="sobre-hero-content">
          <p className="sobre-eyebrow">Yoga Tierra Viva</p>
          <h1 className="sobre-titulo">Paula <em>Castillo</em></h1>
          <p className="sobre-subtitulo">Instructora y profesora de yoga</p>
        </div>
      </header>

      <section className="sobre-bio">
        <div className="sobre-bio-inner sobre-bio-inner--full">
          <div className="sobre-bio-texto">
            <h2>Qué es <em>Yoga Tierra Viva</em></h2>
<p>
              Desde siempre me ha movido el bienestar común, y eso es lo que
              me lleva a crear vínculos significativos y a construir espacios
              más humanos, conscientes y cohesionados.
            </p>
            <p>
              Desde <strong>2017</strong> imparto clases presenciales en distintos
              centros, combinando metodología Hatha y Vinyasa adaptada
              a cada grupo y ritmo de vida. A esto se suman colaboraciones
              habituales impartiendo talleres monográficos de temática variada,
              que abarcan desde el trabajo físico y postural de las asanas
              hasta planos más sutiles como la respiración, la meditación
              y la gestión emocional.
            </p>
            <p>
              Mi forma de enseñar y de acompañar se apoya en la sencillez y la cercanía,
              en que puedas llevarlo a tu día a día.
              Todo lo que comparto lo he caminado yo primero, en mi propio proceso.
              Y en él sigo, como tú.
              Nuestras historias serán distintas, y al final
              buscamos lo mismo: paz en el corazón.
            </p>
            <p>
              Este camino consiste en aprender a abrazarte entera, sin dejar fuera nada
              de lo que fuiste ni de lo que eres ahora.
              Es un gesto de ternura hacia ti misma: al emprender este viaje hacia dentro,
              lo que duele se va integrando y transformando por el camino — abriendo paso
              a una manera más propia, más auténtica, de relacionarte contigo mism@ y con el mundo.
            </p>
          </div>
        </div>
      </section>

      <section className="sobre-stats">
        <div className="sobre-stats-inner">
          <StatCounter valor={9} etiqueta="Años de experiencia" />
          <StatCounter valor={20} etiqueta="Talleres de formación" />
          <StatCounter valor={50} etiqueta="Alumnos" />
        </div>
      </section>

      <section className="sobre-formacion">
        <div className="sobre-formacion-inner">
          <p className="sobre-section-eyebrow">Trayectoria</p>
          <h2 className="sobre-section-titulo">Formación <em>académica</em></h2>

          <div className="sobre-cert-grid">

            <div className="sobre-cert-card">
              <span className="sobre-cert-anno">2016</span>
              <h3 className="sobre-cert-titulo">Hatha Yoga <em>Nivel I</em></h3>
              <p className="sobre-cert-rol">Instructor</p>
              <p className="sobre-cert-escuela">200 h · Escuela Internacional del Yoga</p>
              <div className="sobre-reconocimientos">
                <span>European Yoga Federation</span>
                <span>FEDEFY</span>
              </div>
            </div>

            <div className="sobre-cert-card">
              <span className="sobre-cert-anno">2017</span>
              <h3 className="sobre-cert-titulo">Hatha Yoga <em>Nivel II</em></h3>
              <p className="sobre-cert-rol">Profesor</p>
              <p className="sobre-cert-escuela">200 h · Escuela Internacional del Yoga</p>
              <div className="sobre-reconocimientos">
                <span>European Yoga Federation</span>
                <span>FEDEFY</span>
              </div>
            </div>

            <div className="sobre-cert-card">
              <span className="sobre-cert-anno">2018</span>
              <h3 className="sobre-cert-titulo">Vinyasa <em>Flow Yoga</em></h3>
              <p className="sobre-cert-rol">200 h YTT</p>
              <p className="sobre-cert-escuela">con Vidya J. Heisel</p>
              <div className="sobre-reconocimientos">
                <span>Yoga Alliance</span>
                <span>FEDEFY</span>
              </div>
            </div>

            <div className="sobre-cert-card">
              <span className="sobre-cert-anno">2019</span>
              <h3 className="sobre-cert-titulo">Biomecánica <em>del cuerpo</em></h3>
              <p className="sobre-cert-rol">Formación</p>
              <p className="sobre-cert-escuela">BSMT Yoga</p>
            </div>

            <div className="sobre-cert-card sobre-cert-card--activo">
              <span className="sobre-cert-anno">2017</span>
              <h3 className="sobre-cert-titulo">Clases <em>presenciales</em></h3>
              <p className="sobre-cert-rol">En activo</p>
              <p className="sobre-cert-escuela">Diferentes centros de yoga, metodología adaptada a cada grupo. También talleres y retiros.</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
