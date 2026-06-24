import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CLASES = [
  { id: 1, titulo: 'Vinyasa Despertar',   duracion: 30, nivel: 1, descripcion: 'Activa el cuerpo con suavidad. Perfecta para comenzar el día o cuando el tiempo escasea.',              imagen: '/images/yoga1.jpg' },
  { id: 2, titulo: 'Flow Profundo',       duracion: 60, nivel: 2, descripcion: 'Secuencia fluida que trabaja la fuerza, la flexibilidad y la presencia plena.',                        imagen: '/images/yoga3.jpg' },
  { id: 3, titulo: 'Pranayama y Silencio',duracion: 30, nivel: 1, descripcion: 'Respiración consciente y meditación guiada para calmar la mente y centrar la energía.',               imagen: '/images/yoga2.jpg' },
  { id: 4, titulo: 'Vinyasa Avanzado',    duracion: 60, nivel: 3, descripcion: 'Posturas desafiantes y transiciones avanzadas para quienes quieren profundizar.',                      imagen: '/images/yoga4.jpg' },
  { id: 5, titulo: 'Movilidad y Cuidado', duracion: 30, nivel: 1, descripcion: 'Cuida tus articulaciones y mejora el rango de movimiento. Ideal para todas las edades.',               imagen: '/images/yoga-36.jpg' },
  { id: 6, titulo: 'Yang & Yin',          duracion: 60, nivel: 2, descripcion: 'Combina movimiento dinámico con posturas pasivas sostenidas para un equilibrio total.',                imagen: '/images/yoga-37.jpg' },
]

const GRUPO_ICONOS = {
  1: (
    <svg viewBox="0 0 70 110" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* cabeza */}
      <circle cx="35" cy="12" r="6.5" strokeWidth="1.3"/>
      {/* columna — ligera curva lateral */}
      <path d="M35 19 C34 28 33 36 32 48" strokeWidth="1.3"/>
      {/* brazo izquierdo — sube en arco */}
      <path d="M34 27 C28 20 20 15 12 17" strokeWidth="1.2"/>
      {/* muñeca izquierda — pequeña curva de mano */}
      <path d="M12 17 C10 16 9 17 10 19" strokeWidth="1"/>
      {/* brazo derecho — se abre a la derecha */}
      <path d="M34 30 C41 26 50 26 57 24" strokeWidth="1.2"/>
      {/* muñeca derecha */}
      <path d="M57 24 C59 23 60 24 59 26" strokeWidth="1"/>
      {/* cadera / pelvis */}
      <path d="M32 48 Q35 52 38 48" strokeWidth="1.1" opacity="0.6"/>
      {/* pierna izquierda — flexión hacia adelante */}
      <path d="M32 48 C28 58 24 66 20 78" strokeWidth="1.3"/>
      {/* pie izquierdo en el suelo */}
      <path d="M20 78 Q17 82 14 80" strokeWidth="1.1"/>
      {/* pierna derecha — extendida hacia atrás */}
      <path d="M38 48 C42 58 48 68 54 82" strokeWidth="1.3"/>
      {/* pie derecho */}
      <path d="M54 82 Q57 86 60 84" strokeWidth="1.1"/>
      {/* línea de tierra */}
      <path d="M8 90 Q35 87 62 90" strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
}

const GRUPOS = [
  {
    id: 1,
    nombre: 'Movilidad Funcional',
    descripcion: 'Cada clase trabaja un patrón de movimiento que el cuerpo necesita en la vida cotidiana. No yoga de posturas por posturas, sino movimiento con propósito.',
    meta: '5 clases · 20-30 min · Todos los niveles',
    clases: [
      { id: 'g1-1', titulo: 'Despierta tu columna: movimiento desde adentro',       duracion: 25, nivel: 1, descripcion: 'Activa y moviliza la columna vertebral con movimientos suaves y conscientes que parten del centro hacia fuera.', imagen: '/images/yoga3.jpg', vimeo_id: '1204272676' },
      { id: 'g1-2', titulo: 'Caderas libres: el movimiento que cambia todo',         duracion: 30, nivel: 1, descripcion: 'Abre y libera las caderas para transformar tu forma de moverte en el día a día. La articulación más influyente del cuerpo.', imagen: '/images/yoga1.jpg' },
      { id: 'g1-3', titulo: 'Suelta el peso que llevas en los hombros, ¡literalmente!', duracion: 20, nivel: 1, descripcion: 'Libera la tensión acumulada en cuello, hombros y zona cervical. Especialmente para quienes pasan horas frente a una pantalla.', imagen: '/images/yoga4.jpg' },
      { id: 'g1-4', titulo: 'La base que lo sostiene todo: despierta tus pies',     duracion: 25, nivel: 1, descripcion: 'Trabaja la conexión con el suelo activando tobillos, arcos plantares y la cadena de movimiento que empieza en los pies.', imagen: '/images/yoga2.jpg' },
      { id: 'g1-5', titulo: 'Cuando todo se conecta — la clase que lo une todo',    duracion: 30, nivel: 1, descripcion: 'Una secuencia integradora que recorre todos los patrones del grupo. El cierre perfecto para sentir el cuerpo como una unidad.', imagen: '/images/yoga-36.jpg' },
    ],
  },
]

const NIVEL_LABEL = { 1: 'Principiante', 2: 'Intermedio', 3: 'Avanzado' }

export default function ClasesOnlinePage() {
  const { isSubscribed, refreshSubscription, user } = useAuth()
  const [vista, setVista] = useState('filtros')
  const [filtroDuracion, setFiltroDuracion] = useState('todos')
  const [filtroNivel, setFiltroNivel] = useState('todos')
  const [modalClase, setModalClase] = useState(null)
  const [grupoClases, setGrupoClases] = useState({})

  useEffect(() => {
    if (user) refreshSubscription()
  }, [user])

  useEffect(() => {
    if (vista !== 'grupos') return
    GRUPOS.forEach(async g => {
      if (grupoClases[g.id]) return
      try {
        const res = await fetch(`/api/clases/grupo/${g.id}`)
        const json = await res.json()
        if (json.success) setGrupoClases(prev => ({ ...prev, [g.id]: json.data }))
      } catch { /* sin conexión, usa datos locales */ }
    })
  }, [vista])

  const visibles = CLASES.filter(c => {
    const okDur = filtroDuracion === 'todos' || String(c.duracion) === filtroDuracion
    const okNiv = filtroNivel === 'todos' || String(c.nivel) === filtroNivel
    return okDur && okNiv
  })

  return (
    <>
      <div className="en-proceso-banner">
        <span className="en-proceso-icono">✦</span>
        <div>
          <strong>Estamos grabando las clases</strong>
          <span>El Aula Online estará disponible en breve. ¡Gracias por tu paciencia!</span>
        </div>
      </div>

      <header className="page-header page-header--aula">
        <p className="hero-eyebrow">Tu espacio de práctica</p>
        <h1>Aula <em>Online</em></h1>
        <p>Tu práctica, a tu ritmo, donde quieras</p>
      </header>

      <div className="vista-selector">
        <button
          className={`vista-tab${vista === 'filtros' ? ' active' : ''}`}
          onClick={() => setVista('filtros')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
          Buscar por filtros
        </button>
        <button
          className={`vista-tab${vista === 'grupos' ? ' active' : ''}`}
          onClick={() => setVista('grupos')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Por grupos de clases
        </button>
      </div>

      {vista === 'filtros' && (
        <>
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
        </>
      )}

      {vista === 'grupos' && (
        <section className="grupos-section">
          {GRUPOS.map(grupo => (
            <div key={grupo.id} className="grupo-bloque">
              <div className="grupo-header">
                <div className="grupo-header-content">
                  <p className="grupo-eyebrow">Grupo {String(grupo.id).padStart(2, '0')}</p>
                  <h2 className="grupo-nombre">{grupo.nombre}</h2>
                  <div className="grupo-tags">
                    {grupo.meta.split(' · ').map((tag, i) => (
                      <span key={i} className="grupo-tag">{tag}</span>
                    ))}
                  </div>
                  <p className="grupo-desc">{grupo.descripcion}</p>
                </div>
                {GRUPO_ICONOS[grupo.id] && (
                  <div className="grupo-ilustracion">{GRUPO_ICONOS[grupo.id]}</div>
                )}
              </div>
              <div className="clases-grid">
                {(grupoClases[grupo.id] || grupo.clases).map(c => (
                  <ClaseCard key={c.id} clase={c} subscribed={isSubscribed} onOpen={() => setModalClase(c)} />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {modalClase && (
        <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setModalClase(null) }}>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setModalClase(null)} aria-label="Cerrar">&times;</button>
            <div className="modal-meta">
              <span className="badge badge-dur">{modalClase.duracion} min</span>
              <span className="badge">{NIVEL_LABEL[modalClase.nivel]}</span>
            </div>
            <h3>{modalClase.titulo}</h3>
            {modalClase.vimeo_id ? (
              <div className="video-embed-wrap">
                <iframe
                  src={`https://player.vimeo.com/video/${modalClase.vimeo_id}?autoplay=1&title=0&byline=0&portrait=0`}
                  className="video-embed"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={modalClase.titulo}
                />
              </div>
            ) : (
              <div className="video-placeholder">
                <div className="video-placeholder-inner">
                  <span>▶</span>
                  <p>El vídeo de esta clase<br />estará disponible próximamente</p>
                </div>
              </div>
            )}
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
