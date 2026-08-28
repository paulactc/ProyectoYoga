import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// El sistema de "La Travesía" (50 clases) y el selector de métodos con
// Explora/Grupos quedaron archivados en ./_archivo/TravesiaSuscripcionMensual.jsx
// (ver cabecera de ese fichero). Esta página ahora muestra un único recorrido:
// las 10 clases del Pack Raíz, en el orden en que están pensadas para practicarse.
const GRUPOS = [
  {
    id: 1,
    tipo: 'vinyasa',
    nombre: 'Movilidad Funcional',
    descripcion: 'Cada clase trabaja un patrón de movimiento que el cuerpo necesita en la vida cotidiana. No yoga de posturas por posturas, sino movimiento con propósito.',
    meta: '5 clases · 20-30 min · Todos los niveles',
    clases: [
      { id: 'g1-1', titulo: 'Despierta tu columna: movimiento desde adentro',          duracion: 25, nivel: 1, descripcion: 'Activa y moviliza la columna vertebral con movimientos suaves y conscientes que parten del centro hacia fuera.', imagen: '/images/grupomovilidad1.jpg', vimeo_id: '1204671530' },
      { id: 'g1-2', titulo: 'Caderas libres: el movimiento que cambia todo',           duracion: 30, nivel: 1, descripcion: 'Abre y libera las caderas para transformar tu forma de moverte en el día a día.', imagen: '/images/yoga2movilidad.jpg', vimeo_id: '1209940701' },
      { id: 'g1-3', titulo: 'Suelta el peso que llevas en los hombros, ¡literalmente!', duracion: 30, nivel: 1, descripcion: 'Libera la tensión acumulada en cuello, hombros y zona cervical.', imagen: '/images/yoga9.jpg', vimeo_id: '1209932441' },
      { id: 'g1-4', titulo: 'La base que lo sostiene todo: despierta tus pies',        duracion: 25, nivel: 1, descripcion: 'Trabaja la conexión con el suelo activando tobillos, arcos plantares y la cadena de movimiento que empieza en los pies, recorriendo gemelos, isquiotibiales y cuádriceps hasta la cadera.', imagen: '/images/yoga10.jpg', vimeo_id: '1206606063' },
      { id: 'g1-5', titulo: 'Cuando todo se conecta — la clase que lo une todo',       duracion: 30, nivel: 1, descripcion: 'Una secuencia integradora que recorre todos los patrones del grupo.', imagen: '/images/yoga12.jpg', vimeo_id: '1209967860' },
    ],
  },
  {
    id: 3,
    tipo: 'vinyasa',
    nombre: 'Vinyasa',
    descripcion: 'Flujo continuo de posturas coordinadas con la respiración. Secuencias para llevar la conciencia del cuerpo a un movimiento más fluido.',
    meta: '5 clases · 30-60 min · Nivel intermedio',
    clases: [
      { id: 'g3-1', titulo: 'Del cuerpo al silencio',        duracion: 60, nivel: 2, descripcion: 'Del cuerpo al silencio: una práctica que va soltando capas hasta llegar a la quietud interior.', imagen: '/images/yoga11.jpg', vimeo_id: '1206825714' },
      { id: 'g3-2', titulo: 'El regreso constante',          duracion: 30, nivel: 2, descripcion: 'Una clase para practicar el gesto más honesto del yoga: darte cuenta de que la mente se fue, y volver. Sin culpa, sin esperar quedarte quieta para siempre, solo notar y regresar al cuerpo, una y otra vez, tantas veces como haga falta.', imagen: '/images/yoga14.jpg', vimeo_id: '1210240715' },
      { id: 'g3-3', titulo: 'Fuerza silenciosa',              duracion: 40, nivel: 2, descripcion: 'La fuerza que no necesita hacer ruido: posturas sostenidas con control, para encontrar estabilidad sin tensión de más.', imagen: '/images/yoga25.jpg', vimeo_id: '1218287865' },
      { id: 'g3-4', titulo: 'Los cimientos en Vinyasa',       duracion: 30, nivel: 2, descripcion: 'Trabaja la cadena de tobillo, rodilla y cadera para construir un enraizamiento sólido en Tadasana, la postura base de la que nacen gran parte de las demás.', imagen: '/images/yoga28.jpg', vimeo_id: '1221525071' },
      { id: 'g3-5', titulo: 'Vinyasa construyendo Janu Sirsasana', duracion: 30, nivel: 2, descripcion: 'Una secuencia que prepara cadera, isquiotibiales y columna para llegar con seguridad a Janu Sirsasana, la flexión hacia la pierna extendida que calma el sistema nervioso y invita a soltar el control.', imagen: '/images/yoga29.jpg', vimeo_id: '1222049222' },
    ],
  },
]

const NIVEL_LABEL = { 1: 'Todos los niveles', 2: 'Intermedio', 3: 'Avanzado' }

// ── Tarjeta de clase ─────────────────────────────────────────────────────
function ClaseCard({ clase: c, subscribed, lockLabel = 'Pack Raíz', paso, onOpen }) {
  const imgStyle = c.imgCropTop ? { objectPosition: 'center bottom' } : undefined

  const inner = (
    <>
      <div className="clase-card-img">
        {paso != null && <span className="clase-card-paso">{String(paso).padStart(2, '0')}</span>}
        <img src={c.imagen} alt={c.titulo} style={imgStyle} />
        {!subscribed && (
          <div className="lock-overlay">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span className="lock-overlay-text">{lockLabel}</span>
          </div>
        )}
      </div>
      <div className="clase-card-overlay">
        <div className="clase-badges">
          <span className="badge badge-dur">{c.duracion} min</span>
          <span className={`badge nivel-${c.nivel}`}>{NIVEL_LABEL[c.nivel]}</span>
        </div>
        <h3>{c.titulo}</h3>
        {c.subtitulo && <p className="clase-subtitulo">{c.subtitulo}</p>}
        <span className="clase-card-ver">{subscribed ? 'Ver clase →' : 'Desbloquear →'}</span>
      </div>
    </>
  )

  if (subscribed) {
    return (
      <article className="clase-card" onClick={onOpen} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onOpen()}>
        {inner}
      </article>
    )
  }
  return (
    <article className="clase-card clase-locked">
      <Link to="/suscripcion" className="clase-card-link">{inner}</Link>
    </article>
  )
}

// ── Página principal ──────────────────────────────────────────────────────
export default function ClasesOnlinePage() {
  const { isSubscribed, ownsPack, user, token } = useAuth()
  const desbloqueado = isSubscribed || ownsPack

  const [grupoClases, setGrupoClases] = useState({})
  const [modalClase, setModalClase] = useState(null)
  const [videoActive, setVideoActive] = useState(false)
  const vimeoRef = useRef(null)
  const [claseFeedbacks, setClaseFeedbacks] = useState({})
  const [reviewTexto, setReviewTexto] = useState('')
  const [reviewStatus, setReviewStatus] = useState(null)

  // Aviso de novedades para quien ya tiene el pack — una vez por novedad,
  // se marca como vista en localStorage al cerrarla.
  const NOVEDAD_KEY = 'novedad-vinyasa-2026-08'
  const [showNovedad, setShowNovedad] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    if (desbloqueado && !localStorage.getItem(NOVEDAD_KEY)) setShowNovedad(true)
  }, [desbloqueado])

  const cerrarNovedad = () => {
    localStorage.setItem(NOVEDAD_KEY, '1')
    setShowNovedad(false)
  }

  // Datos en vivo desde el backend por grupo — si se suben vídeos nuevos,
  // aparecen sin tocar el frontend.
  useEffect(() => {
    GRUPOS.forEach(async g => {
      try {
        const res = await fetch(`/api/clases/grupo/${g.id}`)
        const json = await res.json()
        if (json.success) setGrupoClases(prev => ({ ...prev, [g.id]: json.data }))
      } catch { /* usa datos locales */ }
    })
  }, [])

  // Las 10 clases del pack, en el orden de práctica: Movilidad Funcional primero,
  // Vinyasa después.
  const clasesPack = GRUPOS.flatMap(g => {
    const clases = grupoClases[g.id]?.length ? grupoClases[g.id] : g.clases
    return clases.map(c => ({ ...c, tipo: g.tipo }))
  })

  useEffect(() => {
    setVideoActive(false)
    setReviewTexto('')
    setReviewStatus(null)
  }, [modalClase])

  useEffect(() => {
    const id = modalClase?.id
    if (!id) return
    if (claseFeedbacks[id] !== undefined) return
    fetch(`/api/clases/${encodeURIComponent(id)}/feedback`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setClaseFeedbacks(prev => ({ ...prev, [id]: data.data }))
      })
      .catch(() => {})
  }, [modalClase?.id])

  const handleSubmitResena = async (e) => {
    e.preventDefault()
    const id = modalClase?.id
    if (!id || !token) return
    setReviewStatus('loading')
    try {
      const res = await fetch(`/api/clases/${encodeURIComponent(id)}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ texto: reviewTexto }),
      })
      const data = await res.json()
      if (data.success) {
        setReviewStatus('success')
        setReviewTexto('')
      } else {
        setReviewStatus(data.message || 'error')
      }
    } catch {
      setReviewStatus('error')
    }
  }

  return (
    <>
      {/* ── Banner de acceso para quien no tiene el pack ── */}
      {!desbloqueado && (
        <div className="aula-acceso-banner">
          <div className="aula-acceso-inner">
            {user ? (
              <>
                <span className="aula-acceso-icono">✦</span>
                <div className="aula-acceso-texto">
                  <strong>Hola, {user.nombre.split(' ')[0]}</strong>
                  <span>Consigue el Pack Raíz (15,99€, para siempre) para desbloquear tus clases</span>
                </div>
                <Link to="/suscripcion" className="btn btn-sm aula-acceso-btn">Consigue el Pack Raíz →</Link>
              </>
            ) : (
              <>
                <span className="aula-acceso-icono">✦</span>
                <div className="aula-acceso-texto">
                  <strong>Zona exclusiva</strong>
                  <span>Pack Raíz desde 15,99€, un único pago</span>
                </div>
                <Link to="/suscripcion" className="btn btn-sm aula-acceso-btn">Ver el pack →</Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Aviso de novedades para quien ya tiene el pack ── */}
      {desbloqueado && showNovedad && (
        <div className="aula-novedad-banner">
          <div className="aula-novedad-inner">
            <span className="aula-novedad-badge">Nuevo</span>
            <span className="aula-novedad-texto">2 clases nuevas de Vinyasa en tu pack, ya disponibles.</span>
            <button className="aula-novedad-cerrar" onClick={cerrarNovedad} aria-label="Cerrar aviso">×</button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="page-header--aula">
        <div className="aula-strip">
          <span className="aula-strip-eyebrow">Pack Raíz · 10 clases</span>
          <span className="aula-strip-sep" aria-hidden="true">✦</span>
          <h1 className="aula-strip-h1">Tu <em>Pack</em></h1>
          <span className="aula-strip-sep" aria-hidden="true">✦</span>
          <span className="aula-strip-sub">Ajustes físicos precisos, movilidad funcional y flujo</span>
        </div>
      </header>

      {/* ── Presentación del pack ── */}
      <section className="pack-intro">
        <p className="clases-desc-eyebrow">Un pack cerrado, no una plataforma infinita</p>
        <h2 className="pack-intro-titulo">Las clases justas, en el orden que tu cuerpo necesita</h2>
        <p className="pack-intro-desc">
          10 clases pensadas como un único recorrido: primero <strong>Movilidad Funcional</strong>, para
          activar y alinear el cuerpo con instrucciones precisas de ajuste — después
          <strong> vinyasa</strong>, para llevar ese cuerpo a un flujo más continuo. Sin suscripción y sin
          contenido infinito: un pago único, acceso para siempre.
        </p>
      </section>

      {/* ── Lista ordenada de clases ── */}
      <section className="clases-grid-section">
        <div className="clases-grid clases-grid--pack">
          {clasesPack.map((c, i) => (
            <ClaseCard
              key={c.id}
              clase={c}
              paso={i + 1}
              subscribed={desbloqueado}
              lockLabel="Pack Raíz"
              onOpen={() => setModalClase(c)}
            />
          ))}
        </div>
      </section>

      {/* ── Modal de vídeo ── */}
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
                {!videoActive ? (
                  <button className="video-poster" onClick={() => setVideoActive(true)} aria-label="Reproducir vídeo">
                    {modalClase.imagen && (
                      <img src={modalClase.imagen} alt={modalClase.titulo} className="video-poster-img" />
                    )}
                    <span className="video-poster-play" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </span>
                  </button>
                ) : (
                  <iframe
                    ref={vimeoRef}
                    src={`https://player.vimeo.com/video/${modalClase.vimeo_id}?title=0&byline=0&portrait=0&dnt=1&api=1&autoplay=1`}
                    className="video-embed"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={modalClase.titulo}
                  />
                )}
              </div>
            ) : (
              <div className="clase-presentacion">
                {modalClase.imagen && (
                  <div className="clase-presentacion-img-wrap">
                    <img
                      src={modalClase.imagen}
                      alt={modalClase.titulo}
                      className="clase-presentacion-img"
                    />
                  </div>
                )}
                <div className="clase-presentacion-body">
                  {modalClase.descripcion && (
                    <p className="clase-presentacion-desc">{modalClase.descripcion}</p>
                  )}
                  <p className="clase-presentacion-pronto">
                    🎬 El vídeo de esta clase llegará pronto — mientras tanto, lee, respira y prepárate para empezar.
                  </p>
                </div>
              </div>
            )}

            {/* ── Reseñas ── */}
            <div className="modal-resenas">
              <h4 className="modal-resenas-titulo">Experiencias de la comunidad</h4>
              {(() => {
                const feedbacks = claseFeedbacks[modalClase.id]
                if (!feedbacks) return <p className="modal-resenas-empty">Cargando…</p>
                if (feedbacks.length === 0)
                  return <p className="modal-resenas-empty">Todavía no hay reseñas. ¡Comparte la tuya!</p>
                return (
                  <ul className="modal-resenas-list">
                    {feedbacks.map(r => (
                      <li key={r.id} className="modal-resena-item">
                        <p className="modal-resena-texto">"{r.texto}"</p>
                        <span className="modal-resena-autor">{r.nombre}</span>
                      </li>
                    ))}
                  </ul>
                )
              })()}

              {desbloqueado && reviewStatus !== 'success' && (
                <form className="modal-resena-form" onSubmit={handleSubmitResena}>
                  <textarea
                    className="modal-resena-input"
                    placeholder="¿Cómo te ha sentado esta práctica?"
                    value={reviewTexto}
                    onChange={e => setReviewTexto(e.target.value)}
                    rows={3}
                    required
                    maxLength={1000}
                  />
                  {reviewStatus && reviewStatus !== 'loading' && (
                    <p className="modal-resena-error">
                      {reviewStatus === 'Ya has compartido tu experiencia en esta clase'
                        ? 'Ya has compartido tu experiencia en esta clase.'
                        : 'Algo ha ido mal. Inténtalo de nuevo.'}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="modal-resena-btn"
                    disabled={reviewStatus === 'loading' || reviewTexto.trim().length < 2}
                  >
                    {reviewStatus === 'loading' ? 'Enviando…' : 'Compartir mi experiencia →'}
                  </button>
                </form>
              )}
              {desbloqueado && reviewStatus === 'success' && (
                <p className="modal-resena-ok">¡Gracias por compartir! Se publicará en cuanto la revise.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
