import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const CATEGORIAS = [
  {
    id: 'nidra',
    nombre: 'Yoga Nidra',
    tagline: 'El sueño consciente',
    descripcion: 'Una práctica milenaria que induce un estado entre vigilia y sueño. Profundamente regeneradora — 30 minutos equivalen a 2-3 horas de descanso.',
    color: '#1a1030',
    acento: '#9b7fd4',
    icono: '◎',
    audios: [
      {
        id: 'n1',
        titulo: 'Cuerpo sin Peso',
        duracion: 30,
        descripcion: 'La práctica completa. Recorre cada parte del cuerpo hasta disolverlo en silencio.',
        disponible: true,
      },
      {
        id: 'n2',
        titulo: 'El Lago en Calma',
        duracion: 20,
        descripcion: 'Una visualización guiada para soltar el día y encontrar la quietud interior.',
        disponible: true,
      },
      {
        id: 'n3',
        titulo: 'Descanso Profundo',
        duracion: 45,
        descripcion: 'La sesión larga. Para cuando necesitas una recuperación completa del cuerpo y la mente.',
        disponible: false,
      },
    ],
  },
  {
    id: 'dormir',
    nombre: 'Antes de dormir',
    tagline: 'Cierra el día con calma',
    descripcion: 'Audios cortos y directos para apagar el ruido mental, soltar las tensiones del día y preparar el cuerpo para un sueño reparador.',
    color: '#0f1a14',
    acento: '#6aab7e',
    icono: '☽',
    audios: [
      {
        id: 'd1',
        titulo: 'Apaga el Ruido',
        duracion: 10,
        descripcion: 'Para cuando los pensamientos no paran. Una técnica simple para vaciar la mente.',
        disponible: true,
      },
      {
        id: 'd2',
        titulo: 'Respiración 4-7-8',
        duracion: 8,
        descripcion: 'La técnica de respiración más eficaz para conciliar el sueño. Guiada segundo a segundo.',
        disponible: true,
      },
      {
        id: 'd3',
        titulo: 'Gratitud Nocturna',
        duracion: 12,
        descripcion: 'Un cierre suave y consciente para el día. Para irse a la cama con ligereza.',
        disponible: false,
      },
    ],
  },
]

export default function AudiosPage() {
  return (
    <div className="audios-page">
      <HeroAudios />
      {CATEGORIAS.map(cat => (
        <CategoriaSection key={cat.id} categoria={cat} />
      ))}
      <CtaSection />
    </div>
  )
}

function HeroAudios() {
  return (
    <section className="audios-hero">
      <div className="audios-hero-bg" />
      <div className="audios-hero-content">
        <span className="audios-gratis-badge">100% gratuito · Sin registro</span>
        <h1 className="audios-hero-title">
          Tierra<br />
          <em>en Calma</em>
        </h1>
        <p className="audios-hero-sub">
          Audios de Yoga Nidra y meditaciones guiadas para dormir mejor,
          reducir el estrés y encontrar calma en cualquier momento del día.
        </p>
        <div className="audios-hero-stats">
          <div className="audios-stat">
            <span className="audios-stat-num">6</span>
            <span className="audios-stat-label">audios disponibles</span>
          </div>
          <div className="audios-stat-sep" />
          <div className="audios-stat">
            <span className="audios-stat-num">0€</span>
            <span className="audios-stat-label">coste total</span>
          </div>
          <div className="audios-stat-sep" />
          <div className="audios-stat">
            <span className="audios-stat-num">2</span>
            <span className="audios-stat-label">categorías</span>
          </div>
        </div>
        <a href="#audios-contenido" className="audios-hero-cta">
          Escuchar ahora
          <span className="audios-hero-arrow">↓</span>
        </a>
      </div>
      <div className="audios-hero-scroll-hint" />
    </section>
  )
}

function CategoriaSection({ categoria: cat }) {
  return (
    <section
      id={cat.id === 'nidra' ? 'audios-contenido' : undefined}
      className="audios-categoria"
      style={{ '--cat-acento': cat.acento, '--cat-bg': cat.color }}
    >
      <div className="audios-categoria-header">
        <span className="audios-cat-icono">{cat.icono}</span>
        <div>
          <p className="audios-cat-tagline">{cat.tagline}</p>
          <h2 className="audios-cat-titulo">{cat.nombre}</h2>
          <p className="audios-cat-desc">{cat.descripcion}</p>
        </div>
      </div>
      <div className="audios-grid">
        {cat.audios.map(audio => (
          <AudioCard key={audio.id} audio={audio} acento={cat.acento} />
        ))}
      </div>
    </section>
  )
}

function AudioCard({ audio, acento }) {
  const [jugando, setJugando] = useState(false)
  const [progreso, setProgreso] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    if (!audio.src) return
    const el = new Audio(audio.src)
    audioRef.current = el
    el.addEventListener('timeupdate', () => {
      if (el.duration) setProgreso(el.currentTime / el.duration)
    })
    el.addEventListener('ended', () => { setJugando(false); setProgreso(0) })
    return () => { el.pause(); el.src = '' }
  }, [audio.src])

  function handlePlay() {
    if (!audio.disponible) return
    if (!audio.src) { setJugando(j => !j); return }
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

  return (
    <article className={`audio-card${!audio.disponible ? ' audio-card--pronto' : ''}`}>
      {!audio.disponible && (
        <span className="audio-pronto-badge">Próximamente</span>
      )}
      <div className="audio-card-top">
        <button
          className={`audio-play-btn${jugando ? ' playing' : ''}`}
          style={{ '--acento': acento }}
          onClick={handlePlay}
          aria-label={jugando ? 'Pausar' : 'Reproducir'}
          disabled={!audio.disponible}
        >
          {jugando ? (
            <span className="audio-pause-icon"><span /><span /></span>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div className="audio-card-meta">
          <span className="audio-duracion">{audio.duracion} min</span>
          {jugando && <span className="audio-en-curso">reproduciendo</span>}
        </div>
      </div>
      <h3 className="audio-titulo">{audio.titulo}</h3>
      <p className="audio-desc">{audio.descripcion}</p>
      {jugando && (
        <>
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
        </>
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
        <p className="audios-cta-nota">7 días de prueba gratuita · Sin tarjeta de crédito</p>
      </div>
    </section>
  )
}
