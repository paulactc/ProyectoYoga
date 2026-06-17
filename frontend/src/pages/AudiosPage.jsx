import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AudiosPage({ onOpenLogin, onOpenRegister }) {
  const { user, token } = useAuth()
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/meditaciones/series')
      .then(r => r.json())
      .then(d => { if (d.success) setSeries(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalMeds = series.reduce((sum, s) => sum + (s.meditaciones?.length || 0), 0)

  return (
    <div className="audios-page">
      <HeroAudios
        isLoggedIn={!!user}
        onOpenLogin={onOpenLogin}
        onOpenRegister={onOpenRegister}
        totalMeds={totalMeds}
        totalSeries={series.length}
      />
      <div id="audios-contenido">
        {loading ? (
          <div className="audios-loading">
            <span>Cargando meditaciones...</span>
          </div>
        ) : (
          series.map(serie => (
            <SerieSection
              key={serie.id}
              serie={serie}
              isLoggedIn={!!user}
              token={token}
              onOpenLogin={onOpenLogin}
              onOpenRegister={onOpenRegister}
            />
          ))
        )}
      </div>
      <CtaSection />
    </div>
  )
}

function HeroAudios({ isLoggedIn, onOpenLogin, onOpenRegister, totalMeds, totalSeries }) {
  return (
    <section className="audios-hero">
      <div className="audios-hero-bg" />
      <div className="audios-hero-content">
        <span className="audios-gratis-badge">
          {isLoggedIn ? '✓ Acceso libre · 100% gratuito' : 'Gratuito · Registro en 1 minuto'}
        </span>
        <h1 className="audios-hero-title">
          Tierra<br />
          <em>en Calma</em>
        </h1>
        <p className="audios-hero-sub">
          Series de meditación guiada para dormir mejor,
          reducir el estrés y volver a ti en cualquier momento del día.
        </p>
        <div className="audios-hero-claims">
          <span className="audios-claim">Dormir mejor</span>
          <span className="audios-claim-sep">✦</span>
          <span className="audios-claim">Soltar el ruido mental</span>
          <span className="audios-claim-sep">✦</span>
          <span className="audios-claim">Volver a ti</span>
        </div>
        {isLoggedIn ? (
          <a href="#audios-contenido" className="audios-hero-cta">
            Escuchar ahora
            <span className="audios-hero-arrow">↓</span>
          </a>
        ) : (
          <button className="audios-hero-cta" onClick={onOpenRegister}>
            Crear cuenta gratis
            <span className="audios-hero-arrow">↓</span>
          </button>
        )}
      </div>
      <div className="audios-hero-scroll-hint" />
    </section>
  )
}

function SerieSection({ serie, isLoggedIn, token, onOpenLogin, onOpenRegister }) {
  const acento = '#9b7fd4'
  const bgColor = '#1a1030'

  return (
    <section
      className="audios-categoria"
      style={{ '--cat-acento': acento, '--cat-bg': bgColor }}
    >
      <div className="audios-categoria-header">
        <span className="audios-cat-icono">☽</span>
        <div>
          <p className="audios-cat-tagline">
            Serie · {serie.meditaciones?.length || 0} meditaciones
          </p>
          <h2 className="audios-cat-titulo">{serie.titulo}</h2>
          <p className="audios-cat-desc">{serie.descripcion}</p>
        </div>
      </div>

      {!isLoggedIn && (
        <div className="audios-gate">
          <div className="audios-gate-inner">
            <svg className="audios-gate-icono" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <div>
              <p className="audios-gate-titulo">Crea tu cuenta gratuita para escuchar</p>
              <p className="audios-gate-sub">Tierra en Calma es completamente gratuito. Solo necesitas una cuenta.</p>
            </div>
            <button className="btn" onClick={onOpenRegister}>Registrarse gratis →</button>
          </div>
        </div>
      )}

      <div className="audios-grid">
        {serie.meditaciones?.map((med, i) => (
          <AudioCard
            key={med.id}
            audio={med}
            acento={acento}
            isLoggedIn={isLoggedIn}
            token={token}
            onOpenLogin={onOpenLogin}
            numero={i + 1}
          />
        ))}
      </div>
    </section>
  )
}

function AudioCard({ audio, acento, isLoggedIn, token, onOpenLogin, numero }) {
  const [jugando, setJugando] = useState(false)
  const [progreso, setProgreso] = useState(0)
  const audioRef = useRef(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [feedbackError, setFeedbackError] = useState('')
  const [feedbackEnviado, setFeedbackEnviado] = useState(false)
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => {
    fetch(`/api/meditaciones/${audio.id}/feedback`)
      .then(r => r.json())
      .then(d => { if (d.success) setFeedbacks(d.data) })
      .catch(() => {})
  }, [audio.id])

  useEffect(() => {
    if (!audio.src) return
    const el = new Audio(audio.src)
    audioRef.current = el
    el.addEventListener('timeupdate', () => {
      if (el.duration) setProgreso(el.currentTime / el.duration)
    })
    el.addEventListener('ended', () => {
      setJugando(false)
      setProgreso(0)
    })
    return () => { el.pause(); el.src = '' }
  }, [audio.src])

  function handlePlay() {
    if (!audio.disponible) return
    if (!isLoggedIn) { onOpenLogin?.(); return }
    if (!audio.src) {
      setJugando(v => !v)
      return
    }
    const el = audioRef.current
    if (jugando) { el.pause(); setJugando(false) }
    else { el.play(); setJugando(true) }
  }

  function handleSeek(e) {
    if (!audioRef.current?.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = ratio * audioRef.current.duration
    setProgreso(ratio)
  }

  async function handleFeedbackSubmit(e) {
    e.preventDefault()
    if (!feedbackText.trim() || enviando) return
    setFeedbackError('')
    setEnviando(true)
    try {
      const res = await fetch(`/api/meditaciones/${audio.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ texto: feedbackText.trim() }),
      })
      const d = await res.json()
      if (d.success) {
        setFeedbackEnviado(true)
        setFeedbackText('')
        const r2 = await fetch(`/api/meditaciones/${audio.id}/feedback`)
        const d2 = await r2.json()
        if (d2.success) setFeedbacks(d2.data)
      } else {
        setFeedbackError(d.message || 'Error al enviar')
      }
    } catch {
      setFeedbackError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const numPad = String(numero).padStart(2, '0')

  const ICONOS = [
    <svg key="1" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 24a12 12 0 1 1-12-12 9.5 9.5 0 0 0 12 12z" fill="rgba(212,160,96,0.08)"/>
      <circle cx="36" cy="14" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="30" cy="10" r="0.8" fill="currentColor" stroke="none"/>
      <circle cx="38" cy="20" r="0.8" fill="currentColor" stroke="none"/>
    </svg>,
    <svg key="2" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M4 24 Q10 16 16 24 Q22 32 28 24 Q34 16 44 24"/>
      <path d="M4 32 Q10 24 16 32 Q22 40 28 32 Q34 24 44 32" opacity="0.4"/>
      <path d="M4 16 Q10 8 16 16 Q22 24 28 16 Q34 8 44 16" opacity="0.2"/>
    </svg>,
    <svg key="3" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 36 C24 36 12 28 12 20 C12 14 18 10 24 14 C30 10 36 14 36 20 C36 28 24 36 24 36z" fill="rgba(212,160,96,0.08)"/>
      <path d="M24 36 C20 30 14 26 16 18" opacity="0.5"/>
      <path d="M24 36 C28 30 34 26 32 18" opacity="0.5"/>
      <line x1="24" y1="36" x2="24" y2="42"/>
    </svg>,
    <svg key="4" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 38 C24 38 10 30 10 18 C10 10 18 6 24 10 C30 6 38 10 38 18 C38 30 24 38 24 38z" fill="rgba(212,160,96,0.08)"/>
      <line x1="24" y1="38" x2="24" y2="44"/>
      <path d="M24 28 L24 14" opacity="0.5"/>
      <path d="M24 22 L18 17" opacity="0.4"/>
      <path d="M24 22 L30 17" opacity="0.4"/>
    </svg>,
    <svg key="5" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M24 24 C24 22 26 20 28 22 C30 24 28 28 24 28 C20 28 16 24 16 20 C16 14 22 10 28 12 C36 14 40 22 38 30 C36 38 28 42 20 40"/>
    </svg>,
  ]
  const icono = ICONOS[(numero - 1) % ICONOS.length]

  return (
    <article className={`audio-card${!audio.disponible ? ' audio-card--pronto' : ''}`}>
      {!audio.disponible && <span className="audio-pronto-badge">Próximamente</span>}
      <span className="audio-card-num" aria-hidden="true">{numPad}</span>

      <div className="audio-card-main">
        <div className="audio-card-icono" aria-hidden="true">{icono}</div>
        <div className="audio-card-info">
          <p className="audio-card-label">Meditación {numero}</p>
          <h3 className="audio-titulo">{audio.titulo}</h3>
          {jugando && <span className="audio-en-curso">reproduciendo</span>}
        </div>
        <div className="audio-card-actions">
          <button
            className={`audio-play-btn${jugando ? ' playing' : ''}`}
            style={{ '--acento': acento }}
            onClick={handlePlay}
            aria-label={
              !audio.disponible ? 'Próximamente'
              : !isLoggedIn ? 'Inicia sesión para escuchar'
              : jugando ? 'Pausar'
              : 'Reproducir'
            }
            disabled={!audio.disponible}
            title={!isLoggedIn && audio.disponible ? 'Regístrate para escuchar' : undefined}
          >
            {!isLoggedIn && audio.disponible ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            ) : jugando ? (
              <span className="audio-pause-icon"><span /><span /></span>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <span className="audio-duracion">{audio.duracion} min</span>
        </div>
      </div>

      {jugando && (
        <div className="audio-card-playing">
          <div className="audio-wave">
            {Array.from({ length: 28 }).map((_, i) => (
              <span key={i} className="audio-wave-bar" style={{ animationDelay: `${(i * 0.07).toFixed(2)}s` }} />
            ))}
          </div>
          {audio.src && (
            <div className="audio-progress" onClick={handleSeek} title="Haz clic para avanzar">
              <div className="audio-progress-bar" style={{ width: `${progreso * 100}%`, background: acento }} />
            </div>
          )}
        </div>
      )}

      {audio.disponible && (
        <div className="audio-feedback-area">
          {feedbacks.length > 0 && (
            <ul className="audio-feedback-lista">
              {feedbacks.map(fb => (
                <li key={fb.id} className="audio-feedback-item">
                  <strong>{fb.nombre}</strong> — <em>{fb.texto}</em>
                </li>
              ))}
            </ul>
          )}
          {isLoggedIn && (
            feedbackEnviado ? (
              <p className="audio-feedback-gracias">¡Gracias por compartir tu experiencia! 🌿</p>
            ) : (
              <form className="audio-feedback-form" onSubmit={handleFeedbackSubmit}>
                <label className="audio-feedback-label">¿Qué te ha parecido?</label>
                <textarea
                  className="audio-feedback-textarea"
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Comparte tu experiencia con esta meditación..."
                  rows={2}
                  maxLength={1000}
                />
                {feedbackError && <p className="audio-feedback-error">{feedbackError}</p>}
                <button
                  type="submit"
                  className="audio-feedback-btn"
                  disabled={enviando || !feedbackText.trim()}
                >
                  {enviando ? 'Enviando…' : 'Compartir'}
                </button>
              </form>
            )
          )}
        </div>
      )}
    </article>
  )
}

function CtaSection() {
  return (
    <section className="audios-cta-section">
      <div className="audios-cta-inner">
        <p className="audios-cta-eyebrow">¿Quieres ir más lejos?</p>
        <h2 className="audios-cta-titulo">
          El movimiento completa<br />lo que el audio empieza
        </h2>
        <p className="audios-cta-texto">
          Estos audios son solo el principio. En el Aula Online encontrarás clases de yoga,
          pranayama y más — todo diseñado para que construyas una práctica real, sostenible y tuya.
        </p>
        <div className="audios-cta-btns">
          <Link to="/suscripcion" className="btn">Ver planes · desde 12€/mes</Link>
          <Link to="/aula-online" className="btn btn-outline-dark">Explorar clases →</Link>
        </div>
        <p className="audios-cta-nota">7 días de prueba gratuita</p>
      </div>
    </section>
  )
}
