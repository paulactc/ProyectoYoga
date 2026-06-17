export default function SobreMiPage() {
  return (
    <div className="sobre-page">

      <header className="sobre-hero">
        <div className="sobre-hero-bg" />
        <div className="sobre-hero-content">
          <p className="sobre-eyebrow">Yoga Tierra Viva</p>
          <h1 className="sobre-titulo">Paula <em>Castillo</em></h1>
          <p className="sobre-subtitulo">Instructora y profesora de yoga · Madrid</p>
        </div>
      </header>

      <section className="sobre-bio">
        <div className="sobre-bio-inner">
          <div className="sobre-bio-foto">
            <img src="/images/yo.jpg" alt="Paula Castillo, instructora de yoga" />
          </div>
          <div className="sobre-bio-texto">
            <h2>Qué es <em>Yoga Tierra Viva</em></h2>
            <p>
              El yoga te despierta, te hace sentirte y aprender de ti mismo.
              Esa es mi filosofía y el motor de cada clase que imparto.
            </p>
            <p>
              Mi camino en el yoga nació de la necesidad de escucharme.
              Hoy acompaño a otras personas a descubrir que el brillo siempre
              va desde dentro hacia fuera, y que la esterilla es solo el comienzo.
            </p>
            <p>
              Soy una persona empática y social, con una profunda sensibilidad
              hacia el bienestar común. Me motiva crear vínculos significativos
              y generar entornos colaborativos donde cada experiencia pueda
              resignificarse de manera positiva. Mi curiosidad por comprender
              a las personas y los grupos me permite contribuir activamente
              a construir espacios más humanos, conscientes y cohesionados.
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
                <span className="sobre-timeline-badge">Instructor</span>
                <h3>Hatha Yoga Nivel I</h3>
                <p className="sobre-timeline-horas">200 h · Escuela Internacional del Yoga · Madrid</p>
                <p className="sobre-timeline-desc">
                  Pedagogía, filosofía, anatomía y asanas.
                </p>
                <div className="sobre-reconocimientos">
                  <span>European Yoga Federation</span>
                  <span>Federación Española de Yoga Profesional</span>
                  <span>FEDEFY</span>
                </div>
              </div>
            </div>

            <div className="sobre-timeline-item">
              <div className="sobre-timeline-anno">2017</div>
              <div className="sobre-timeline-card">
                <span className="sobre-timeline-badge">Profesor</span>
                <h3>Hatha Yoga Nivel II</h3>
                <p className="sobre-timeline-horas">200 h · Escuela Internacional del Yoga · Madrid</p>
                <p className="sobre-timeline-desc">
                  Pedagogía, filosofía, anatomía y asanas.
                </p>
                <div className="sobre-reconocimientos">
                  <span>European Yoga Federation</span>
                  <span>Federación Española de Yoga Profesional</span>
                  <span>FEDEFY</span>
                </div>
              </div>
            </div>

            <div className="sobre-timeline-item">
              <div className="sobre-timeline-anno">2018</div>
              <div className="sobre-timeline-card">
                <span className="sobre-timeline-badge sobre-timeline-badge--alliance">Yoga Alliance</span>
                <h3>Vinyasa Flow Yoga</h3>
                <p className="sobre-timeline-horas">200 h YTT · con Vidya J. Heisel · Madrid</p>
                <p className="sobre-timeline-desc">
                  Formación certificada internacionalmente por Yoga Alliance.
                </p>
                <div className="sobre-reconocimientos">
                  <span>FEDEFY · Federación Española de Yoga</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
