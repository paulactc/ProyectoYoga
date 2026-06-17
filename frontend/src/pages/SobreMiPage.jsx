export default function SobreMiPage() {
  return (
    <div className="sobre-page">

      <section className="sobre-bio">
        <div className="sobre-bio-inner">
          <div className="sobre-bio-foto">
            <img src="/images/yo.jpg" alt="Paula Castillo, instructora de yoga" />
          </div>
          <div className="sobre-bio-texto">
            <p className="sobre-eyebrow" style={{ color: '#8b5e3c', marginBottom: '0.5rem' }}>Yoga Tierra Viva</p>
            <h1 className="sobre-titulo" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#2c2c2c', marginBottom: '0.25rem' }}>
              Paula <em>Castillo</em>
            </h1>
            <p className="sobre-subtitulo" style={{ color: '#999', marginBottom: '1.5rem' }}>
              Instructora y profesora de yoga · Madrid
            </p>
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
              centros de Madrid, combinando metodología Hatha y Vinyasa adaptada
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
                <p className="sobre-timeline-horas">200 h · Escuela Internacional del Yoga · Madrid</p>
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
                <p className="sobre-timeline-horas">200 h · Escuela Internacional del Yoga · Madrid</p>
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
                <p className="sobre-timeline-horas">200 h YTT · Madrid</p>
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
                <p className="sobre-timeline-horas">Madrid · en activo</p>
                <p className="sobre-timeline-desc">
                  Impartiendo clases en diferentes centros de yoga de Madrid,
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
