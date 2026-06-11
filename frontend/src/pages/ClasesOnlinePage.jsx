import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CLASES = [
  { id: 1, titulo: 'Vinyasa Despertar',   duracion: 30, nivel: 1, descripcion: 'Activa el cuerpo con suavidad. Perfecta para comenzar el día o cuando el tiempo escasea.',              imagen: '/images/yoga-30.jpg' },
  { id: 2, titulo: 'Flow Profundo',       duracion: 60, nivel: 2, descripcion: 'Secuencia fluida que trabaja la fuerza, la flexibilidad y la presencia plena.',                        imagen: '/images/yoga-37.jpg' },
  { id: 3, titulo: 'Pranayama y Silencio',duracion: 30, nivel: 1, descripcion: 'Respiración consciente y meditación guiada para calmar la mente y centrar la energía.',               imagen: '/images/yoga-36.jpg' },
  { id: 4, titulo: 'Vinyasa Avanzado',    duracion: 60, nivel: 3, descripcion: 'Posturas desafiantes y transiciones avanzadas para quienes quieren profundizar.',                      imagen: '/images/yoga-21.jpg' },
  { id: 5, titulo: 'Movilidad y Cuidado', duracion: 30, nivel: 1, descripcion: 'Cuida tus articulaciones y mejora el rango de movimiento. Ideal para todas las edades.',               imagen: '/images/yoga-18.jpg' },
  { id: 6, titulo: 'Yang & Yin',          duracion: 60, nivel: 2, descripcion: 'Combina movimiento dinámico con posturas pasivas sostenidas para un equilibrio total.',                imagen: '/images/yoga-30.jpg' },
]

const NIVEL_LABEL = { 1: 'Principiante', 2: 'Intermedio', 3: 'Avanzado' }

export default function ClasesOnlinePage() {
  const { isSubscribed, refreshSubscription, user } = useAuth()
  const [filtroDuracion, setFiltroDuracion] = useState('todos')
  const [filtroNivel, setFiltroNivel] = useState('todos')
  const [modalClase, setModalClase] = useState(null)

  useEffect(() => {
    if (user) refreshSubscription()
  }, [user])

  const visibles = CLASES.filter(c => {
    const okDur = filtroDuracion === 'todos' || String(c.duracion) === filtroDuracion
    const okNiv = filtroNivel === 'todos' || String(c.nivel) === filtroNivel
    return okDur && okNiv
  })

  return (
    <>
      {!isSubscribed && (
        <div className="sub-banner">
          <p>Activa tu suscripción mensual para acceder a todas las clases</p>
          <Link to="/suscripcion" className="btn btn-sm">Ver plan →</Link>
        </div>
      )}

      <header className="page-header">
        <p className="hero-eyebrow">Tu espacio de práctica</p>
        <h1>Aula <em>Online</em></h1>
        <p>Tu práctica, a tu ritmo, donde quieras</p>
      </header>

      <div className="filtros-section">
        <div className="filtros">
          <div className="filtro-group">
            <span className="filtro-label">Duración</span>
            <div className="filtro-pills">
              {[['todos', 'Todas'], ['30', '30 min'], ['60', '60 min']].map(([val, label]) => (
                <button key={val} className={`pill${filtroDuracion === val ? ' active' : ''}`} onClick={() => setFiltroDuracion(val)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="filtro-group">
            <span className="filtro-label">Nivel</span>
            <div className="filtro-pills">
              {[['todos', 'Todos'], ['1', 'Nivel 1'], ['2', 'Nivel 2'], ['3', 'Nivel 3']].map(([val, label]) => (
                <button key={val} className={`pill${filtroNivel === val ? ' active' : ''}`} onClick={() => setFiltroNivel(val)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="clases-grid-section">
        <div className="clases-grid">
          {visibles.length === 0 ? (
            <p className="no-results">No hay clases con estos filtros. Prueba otra combinación.</p>
          ) : visibles.map(c => (
            <ClaseCard key={c.id} clase={c} subscribed={isSubscribed} onOpen={() => setModalClase(c)} />
          ))}
        </div>
      </section>

      {modalClase && (
        <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setModalClase(null) }}>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setModalClase(null)} aria-label="Cerrar">&times;</button>
            <div className="modal-meta">
              <span className="badge badge-dur">{modalClase.duracion} min</span>
              <span className="badge">{NIVEL_LABEL[modalClase.nivel]}</span>
            </div>
            <h3>{modalClase.titulo}</h3>
            <div className="video-placeholder">
              <div className="video-placeholder-inner">
                <span>▶</span>
                <p>El vídeo de esta clase<br />estará disponible próximamente</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ClaseCard({ clase: c, subscribed, onOpen }) {
  const badges = (
    <div className="clase-badges">
      <span className="badge badge-dur">{c.duracion} min</span>
      <span className={`badge nivel-${c.nivel}`}>{NIVEL_LABEL[c.nivel]}</span>
    </div>
  )

  if (subscribed) {
    return (
      <article className="clase-card">
        <div className="clase-card-img" style={{ backgroundImage: `url('${c.imagen}')` }} />
        <div className="clase-card-body">
          {badges}
          <h3>{c.titulo}</h3>
          <p>{c.descripcion}</p>
          <button className="btn btn-sm" onClick={onOpen}>Ver clase →</button>
        </div>
      </article>
    )
  }

  return (
    <article className="clase-card clase-locked">
      <div className="clase-card-img" style={{ backgroundImage: `url('${c.imagen}')` }}>
        <div className="lock-overlay">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
      </div>
      <div className="clase-card-body">
        {badges}
        <h3>{c.titulo}</h3>
        <p>{c.descripcion}</p>
        <Link to="/suscripcion" className="btn btn-sm btn-outline">Suscribirme →</Link>
      </div>
    </article>
  )
}
