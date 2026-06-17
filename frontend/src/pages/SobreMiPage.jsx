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
              El yoga te despierta, te hace sentirte y aprender de ti mismo.
              Mi camino en él nació de la necesidad de escucharme, y hoy acompaño
              a otras personas a descubrir que el brillo siempre va desde dentro hacia fuera.
            </p>
            <p>
              Soy una persona empática y social, con una profunda sensibilidad
              hacia el bienestar común. Me motiva crear vínculos significativos
              y construir espacios más humanos, conscientes y cohesionados.
            </p>
            <p>
              Desde <strong>2019</strong> imparto clases presenciales en distintos
              centros, combinando metodología Hatha y Vinyasa adaptada
              a cada grupo y ritmo de vida.
            </p>
          </div>
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
              <span className="sobre-cert-anno">2019</span>
              <h3 className="sobre-cert-titulo">Clases <em>presenciales</em></h3>
              <p className="sobre-cert-rol">En activo</p>
              <p className="sobre-cert-escuela">Diferentes centros de yoga, metodología adaptada a cada grupo.</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
