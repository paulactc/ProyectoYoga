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

          <div className="sobre-timeline">

            <div className="sobre-timeline-item">
              <div className="sobre-timeline-anno">2016</div>
              <div className="sobre-timeline-card">
                <h3>Hatha Yoga Nivel I · <span style={{ fontWeight: 400, fontSize: '0.95em' }}>Instructor</span></h3>
                <p className="sobre-timeline-horas">200 h · Escuela Internacional del Yoga</p>
                <div className="sobre-reconocimientos">
                  <span>European Yoga Federation</span>
                  <span>FEDEFY</span>
                </div>
              </div>
            </div>

            <div className="sobre-timeline-item">
              <div className="sobre-timeline-anno">2017</div>
              <div className="sobre-timeline-card">
                <h3>Hatha Yoga Nivel II · <span style={{ fontWeight: 400, fontSize: '0.95em' }}>Profesor</span></h3>
                <p className="sobre-timeline-horas">200 h · Escuela Internacional del Yoga</p>
                <div className="sobre-reconocimientos">
                  <span>European Yoga Federation</span>
                  <span>FEDEFY</span>
                </div>
              </div>
            </div>

            <div className="sobre-timeline-item">
              <div className="sobre-timeline-anno">2018</div>
              <div className="sobre-timeline-card">
                <h3>Vinyasa Flow Yoga · <span style={{ fontWeight: 400, fontSize: '0.95em' }}>con Vidya J. Heisel</span></h3>
                <p className="sobre-timeline-horas">200 h YTT · con Vidya J. Heisel</p>
                <div className="sobre-reconocimientos">
                  <span>Yoga Alliance</span>
                  <span>FEDEFY</span>
                </div>
              </div>
            </div>

            <div className="sobre-timeline-item">
              <div className="sobre-timeline-anno">2019</div>
              <div className="sobre-timeline-card">
                <h3>Clases presenciales en centros</h3>
                <p className="sobre-timeline-horas">En activo</p>
                <p className="sobre-timeline-desc">
                  Impartiendo clases en diferentes centros de yoga,
                  con metodología adaptada a cada grupo.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
