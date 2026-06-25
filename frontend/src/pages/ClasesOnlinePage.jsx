import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CLASES = [
  { id: 1, titulo: 'Vinyasa Despertar',    duracion: 30, nivel: 1, descripcion: 'Activa el cuerpo con suavidad. Perfecta para comenzar el día o cuando el tiempo escasea.',              imagen: '/images/yoga1.jpg' },
  { id: 2, titulo: 'Flow Profundo',        duracion: 60, nivel: 2, descripcion: 'Secuencia fluida que trabaja la fuerza, la flexibilidad y la presencia plena.',                        imagen: '/images/yoga3.jpg' },
  { id: 3, titulo: 'Pranayama y Silencio', duracion: 30, nivel: 1, descripcion: 'Respiración consciente y meditación guiada para calmar la mente y centrar la energía.',               imagen: '/images/yoga2.jpg' },
  { id: 4, titulo: 'Vinyasa Avanzado',     duracion: 60, nivel: 3, descripcion: 'Posturas desafiantes y transiciones avanzadas para quienes quieren profundizar.',                      imagen: '/images/yoga4.jpg' },
  { id: 5, titulo: 'Movilidad y Cuidado',  duracion: 30, nivel: 1, descripcion: 'Cuida tus articulaciones y mejora el rango de movimiento. Ideal para todas las edades.',               imagen: '/images/yoga-36.jpg' },
  { id: 6, titulo: 'Yang & Yin',           duracion: 60, nivel: 2, descripcion: 'Combina movimiento dinámico con posturas pasivas sostenidas para un equilibrio total.',                imagen: '/images/yoga-37.jpg' },
]

const GRUPO_ICONOS = {
  1: (
    <svg viewBox="0 0 70 110" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="35" cy="12" r="6.5" strokeWidth="1.3"/>
      <path d="M35 19 C34 28 33 36 32 48" strokeWidth="1.3"/>
      <path d="M34 27 C28 20 20 15 12 17" strokeWidth="1.2"/>
      <path d="M12 17 C10 16 9 17 10 19" strokeWidth="1"/>
      <path d="M34 30 C41 26 50 26 57 24" strokeWidth="1.2"/>
      <path d="M57 24 C59 23 60 24 59 26" strokeWidth="1"/>
      <path d="M32 48 Q35 52 38 48" strokeWidth="1.1" opacity="0.6"/>
      <path d="M32 48 C28 58 24 66 20 78" strokeWidth="1.3"/>
      <path d="M20 78 Q17 82 14 80" strokeWidth="1.1"/>
      <path d="M38 48 C42 58 48 68 54 82" strokeWidth="1.3"/>
      <path d="M54 82 Q57 86 60 84" strokeWidth="1.1"/>
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
      { id: 'g1-1', titulo: 'Despierta tu columna: movimiento desde adentro',          duracion: 25, nivel: 1, descripcion: 'Activa y moviliza la columna vertebral con movimientos suaves y conscientes que parten del centro hacia fuera.', imagen: '/images/yoga3.jpg', vimeo_id: '1204671530' },
      { id: 'g1-2', titulo: 'Caderas libres: el movimiento que cambia todo',           duracion: 30, nivel: 1, descripcion: 'Abre y libera las caderas para transformar tu forma de moverte en el día a día.', imagen: '/images/yoga1.jpg' },
      { id: 'g1-3', titulo: 'Suelta el peso que llevas en los hombros, ¡literalmente!', duracion: 20, nivel: 1, descripcion: 'Libera la tensión acumulada en cuello, hombros y zona cervical.', imagen: '/images/yoga4.jpg' },
      { id: 'g1-4', titulo: 'La base que lo sostiene todo: despierta tus pies',        duracion: 25, nivel: 1, descripcion: 'Trabaja la conexión con el suelo activando tobillos, arcos plantares y la cadena de movimiento.', imagen: '/images/yoga2.jpg' },
      { id: 'g1-5', titulo: 'Cuando todo se conecta — la clase que lo une todo',       duracion: 30, nivel: 1, descripcion: 'Una secuencia integradora que recorre todos los patrones del grupo.', imagen: '/images/yoga-36.jpg' },
    ],
  },
]

const NIVEL_LABEL = { 1: 'Principiante', 2: 'Intermedio', 3: 'Avanzado' }

// ── Iconos tarjetas de métodos ──────────────────────────────────────────────
function IconTravesia() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="7"  cy="37" r="3.5" fill="currentColor" opacity="0.35"/>
      <circle cx="16" cy="27" r="3.5" fill="currentColor" opacity="0.55"/>
      <circle cx="28" cy="20" r="3.5" fill="currentColor" opacity="0.75"/>
      <circle cx="38" cy="10" r="3.5" fill="currentColor"/>
      <path d="M7 37 Q11 30 16 27 Q22 23 28 20 Q33 16 38 10" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 3" fill="none" opacity="0.45"/>
      <path d="M34 8.5 L38 10 L36.5 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

function IconExplorar() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="16" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="22" cy="22" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2.5 3" opacity="0.5"/>
      {[0,45,90,135,180,225,270,315].map(d => {
        const a = (d-90)*Math.PI/180, isC = d%90===0
        const r1=isC?12:14, r2=16
        return <line key={d} x1={22+Math.cos(a)*r1} y1={22+Math.sin(a)*r1} x2={22+Math.cos(a)*r2} y2={22+Math.sin(a)*r2} stroke="currentColor" strokeWidth={isC?1.4:0.8} opacity={isC?0.9:0.45}/>
      })}
      <path d="M22 22 L26 14 L22 20 L18 28 Z" fill="currentColor" opacity="0.9"/>
      <circle cx="22" cy="22" r="2.5" fill="currentColor"/>
    </svg>
  )
}

function IconGrupos() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" aria-hidden="true">
      <rect x="6"  y="28" width="32" height="8" rx="2.5" strokeWidth="1.3"/>
      <rect x="9"  y="19.5" width="26" height="8" rx="2.5" strokeWidth="1.2" opacity="0.7"/>
      <rect x="12" y="11" width="20" height="8" rx="2.5" strokeWidth="1.1" opacity="0.4"/>
      <circle cx="12" cy="32" r="2" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="23.5" r="2" fill="currentColor" stroke="none" opacity="0.7"/>
      <circle cx="12" cy="15" r="2" fill="currentColor" stroke="none" opacity="0.4"/>
    </svg>
  )
}

// ── Ilustración brújula para Explorar ─────────────────────────────────────
function ExplorarDecor() {
  const cx = 79, cy = 122, r = 68, ri = 46
  return (
    <svg viewBox="0 0 158 255" fill="none" className="tc-map-svg" aria-hidden="true">
      {/* Estrellas */}
      {[[18,25],[140,38],[8,108],[150,88],[22,194],[148,172],[90,244],[108,18],[42,230],[130,218]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i%4===0?1.5:0.8} fill="rgba(255,255,255,0.45)"/>
      ))}
      {/* Anillo exterior */}
      <circle cx={cx} cy={cy} r={r} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      {/* Marcas cardinales */}
      {[0,45,90,135,180,225,270,315].map(deg => {
        const a=(deg-90)*Math.PI/180, isC=deg%90===0, len=isC?11:6
        return <line key={deg}
          x1={cx+Math.cos(a)*(r-len)} y1={cy+Math.sin(a)*(r-len)}
          x2={cx+Math.cos(a)*r}       y2={cy+Math.sin(a)*r}
          stroke={isC ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.22)'}
          strokeWidth={isC?1.5:0.9}/>
      })}
      {/* Anillo interior */}
      <circle cx={cx} cy={cy} r={ri} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 4"/>
      {/* Aguja norte — punta dorada */}
      <path d={`M${cx} ${cy-ri+6} L${cx-7} ${cy+2} L${cx} ${cy-4} Z`} fill="#d4a060" opacity="0.95"/>
      {/* Aguja sur */}
      <path d={`M${cx} ${cy+ri-6} L${cx+7} ${cy-2} L${cx} ${cy+4} Z`} fill="rgba(255,255,255,0.3)"/>
      {/* Lateral E/W */}
      <path d={`M${cx+ri-6} ${cy} L${cx-2} ${cy-6} L${cx+4} ${cy} Z`} fill="rgba(255,255,255,0.18)"/>
      <path d={`M${cx-ri+6} ${cy} L${cx+2} ${cy+6} L${cx-4} ${cy} Z`} fill="rgba(255,255,255,0.18)"/>
      {/* Centro */}
      <circle cx={cx} cy={cy} r={5} fill="rgba(255,255,255,0.55)"/>
      <circle cx={cx} cy={cy} r={2.5} fill="#d4a060"/>
      {/* Letra N */}
      <text x={cx} y={cy-r-5} textAnchor="middle" fontSize="9" fontWeight="700"
        fill="rgba(255,255,255,0.5)" fontFamily="Raleway,sans-serif" letterSpacing="0.12em">N</text>
      {/* Luna decorativa */}
      <path d={`M${cx+50} ${cy+52} a14 14 0 1 1 0 -20 a10 10 0 1 0 0 20 Z`}
        fill="rgba(255,255,255,0.07)"/>
    </svg>
  )
}

// ── Ilustración series para Grupos ────────────────────────────────────────
function GruposDecor() {
  const cx = 79
  const layers = [
    { y:198, w:105, o:0.45 },
    { y:166, w:116, o:0.58 },
    { y:134, w:127, o:0.72 },
    { y:102, w:135, o:0.88 },
    { y:70,  w:143, o:1    },
  ]
  return (
    <svg viewBox="0 0 158 255" fill="none" className="tc-map-svg" aria-hidden="true">
      {/* Fondo: puntos */}
      {[[15,28],[142,42],[8,110],[150,88],[20,200],[146,178],[82,248],[108,18],[38,240]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={0.9} fill="rgba(255,255,255,0.3)"/>
      ))}
      {/* Capas apiladas */}
      {layers.map((l, i) => (
        <g key={i}>
          <rect x={cx-l.w/2} y={l.y} width={l.w} height={26} rx="6"
            fill={`rgba(100,170,120,${l.o * 0.14})`}
            stroke={`rgba(140,200,160,${l.o * 0.48})`}
            strokeWidth="1"/>
          <circle cx={cx-l.w/2+13} cy={l.y+13} r="3.5"
            fill={`rgba(140,200,160,${l.o * 0.75})`}/>
          <line x1={cx-l.w/2+22} y1={l.y+13} x2={cx-l.w/2+l.w*0.5} y2={l.y+13}
            stroke={`rgba(255,255,255,${l.o*0.22})`} strokeWidth="1"/>
          <line x1={cx-l.w/2+22} y1={l.y+20} x2={cx-l.w/2+l.w*0.35} y2={l.y+20}
            stroke={`rgba(255,255,255,${l.o*0.12})`} strokeWidth="1"/>
        </g>
      ))}
      {/* Loto en la parte superior */}
      <g transform={`translate(${cx},38)`}>
        <path d="M0 0 C-8-8-16-14-10-20 C-4-26 0-16 0-10" stroke="rgba(140,200,160,0.65)" strokeWidth="1.3" fill="none"/>
        <path d="M0 0 C8-8 16-14 10-20 C4-26 0-16 0-10"  stroke="rgba(140,200,160,0.65)" strokeWidth="1.3" fill="none"/>
        <path d="M0 0 C-4-12-5-20 0-24 C5-20 4-12 0 0"   stroke="rgba(140,200,160,0.75)" strokeWidth="1.3" fill="none"/>
        <path d="M0 0 C-12-4-18-10-14-18 C-10-22-4-14 0 0" stroke="rgba(140,200,160,0.5)" strokeWidth="1" fill="none"/>
        <path d="M0 0 C12-4 18-10 14-18 C10-22 4-14 0 0"   stroke="rgba(140,200,160,0.5)" strokeWidth="1" fill="none"/>
        <circle cx="0" cy="0" r="3.5" fill="rgba(140,200,160,0.65)"/>
      </g>
    </svg>
  )
}

// ── Ilustración de camino para La Travesía ───────────────────────────────
function TravesiaMapDecor({ progreso }) {
  const waypoints = [
    { cx: 85,  cy: 238 },
    { cx: 30,  cy: 190 },
    { cx: 122, cy: 148 },
    { cx: 34,  cy: 102 },
    { cx: 122, cy: 56  },
    { cx: 72,  cy: 14  },
  ]

  return (
    <svg viewBox="0 0 158 255" fill="none" className="tc-map-svg" aria-hidden="true">
      {/* Montañas de fondo */}
      <path d="M0 255 L0 185 L28 148 L56 172 L82 138 L112 164 L138 130 L158 148 L158 255 Z"
        fill="rgba(255,255,255,0.07)"/>
      <path d="M0 255 L0 210 L20 196 L44 210 L70 194 L100 208 L130 192 L158 204 L158 255 Z"
        fill="rgba(255,255,255,0.05)"/>

      {/* Árboles */}
      <g fill="rgba(255,255,255,0.18)" stroke="none">
        <path d="M52 228 L56 212 L60 228 Z"/>
        <rect x="55.5" y="228" width="1.5" height="6" fill="rgba(255,255,255,0.18)"/>
        <path d="M92 184 L96 170 L100 184 Z"/>
        <rect x="95.5" y="184" width="1.5" height="6" fill="rgba(255,255,255,0.18)"/>
        <path d="M18 148 L22 136 L26 148 Z"/>
        <rect x="21.5" y="148" width="1.5" height="6" fill="rgba(255,255,255,0.18)"/>
        <path d="M130 100 L134 88 L138 100 Z"/>
        <rect x="133.5" y="100" width="1.5" height="6" fill="rgba(255,255,255,0.18)"/>
      </g>

      {/* Camino serpenteante */}
      <path
        d="M85 244 C28 220 16 188 44 166 C72 144 132 136 118 106 C104 76 32 62 68 30 C80 16 74 6 74 6"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2.2"
        strokeDasharray="5 5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Sol en la cima */}
      <circle cx="74" cy="6" r="6" fill="#d4a060" opacity="0.8"/>
      <line x1="74" y1="-2"  x2="74" y2="-4"  stroke="#d4a060" strokeWidth="1.5" opacity="0.7"/>
      <line x1="74" y1="14"  x2="74" y2="16"  stroke="#d4a060" strokeWidth="1.5" opacity="0.7"/>
      <line x1="66" y1="6"   x2="64" y2="6"   stroke="#d4a060" strokeWidth="1.5" opacity="0.7"/>
      <line x1="82" y1="6"   x2="84" y2="6"   stroke="#d4a060" strokeWidth="1.5" opacity="0.7"/>
      <line x1="68.3" y1="0.3"  x2="66.9" y2="-1.1" stroke="#d4a060" strokeWidth="1.5" opacity="0.6"/>
      <line x1="79.7" y1="11.7" x2="81.1" y2="13.1" stroke="#d4a060" strokeWidth="1.5" opacity="0.6"/>

      {/* Paradas del camino */}
      {waypoints.map((wp, i) => {
        const done   = i < progreso
        const active = i === progreso
        const r      = active ? 15 : 12
        return (
          <g key={i}>
            {active && <circle cx={wp.cx} cy={wp.cy} r={24} fill="rgba(140,78,47,0.25)"/>}
            <circle
              cx={wp.cx} cy={wp.cy} r={r}
              fill={done ? '#6b3820' : active ? '#8c4e2f' : 'rgba(255,255,255,0.1)'}
              stroke={done || active ? '#d4a060' : 'rgba(255,255,255,0.35)'}
              strokeWidth="1.8"
            />
            {done ? (
              <polyline
                points={`${wp.cx-5},${wp.cy+0.5} ${wp.cx-1.5},${wp.cy+4.5} ${wp.cx+6},${wp.cy-5}`}
                stroke="#d4a060" strokeWidth="2.2" strokeLinecap="round" fill="none"
              />
            ) : (
              <text x={wp.cx} y={wp.cy + 4} textAnchor="middle"
                fontSize={active ? '8.5' : '8'} fontWeight="700" letterSpacing="0.04em"
                fill={active ? '#fff' : 'rgba(255,255,255,0.5)'}
                fontFamily="Raleway,sans-serif">
                {String(i + 1).padStart(2, '0')}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}


// ── Tarjeta de método ─────────────────────────────────────────────────────
function MetodoCard({ tipo, badge, titulo, subtitulo, descripcion, cta, icon, decoracion, onClick }) {
  return (
    <button className={`metodo-card metodo-card--${tipo}`} onClick={onClick} type="button">
      {badge && <span className="metodo-badge">{badge}</span>}
      <div className="metodo-card-content">
        <div className="metodo-card-left">
          <div className="metodo-icon">{icon}</div>
          <h3 className="metodo-titulo">{titulo}</h3>
          <p className="metodo-subtitulo">{subtitulo}</p>
          <p className="metodo-desc">{descripcion}</p>
          <span className="metodo-cta">{cta} →</span>
        </div>
        {decoracion && <div className="metodo-card-right">{decoracion}</div>}
      </div>
    </button>
  )
}

// ── Tarjeta de La Travesía (paso individual) ──────────────────────────────
function TravesiaCard({ clase: c, stepNum, desbloqueada, completada, onOpen, onCompletar }) {
  return (
    <article className={`travesia-card${!desbloqueada ? ' locked' : ''}${completada ? ' done' : ''}`}>
      <div className="travesia-card-img" style={{ backgroundImage: `url('${c.imagen}')` }}>
        <div className="travesia-step-num">{String(stepNum).padStart(2, '0')}</div>
        {completada && (
          <div className="travesia-done-badge">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="2.5,7 5.5,10 11.5,3.5"/></svg>
            Completada
          </div>
        )}
        {!desbloqueada && (
          <div className="travesia-lock-overlay">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
        )}
      </div>
      <div className="travesia-card-body">
        <div className="clase-badges">
          <span className="badge badge-dur">{c.duracion} min</span>
          <span className={`badge nivel-${c.nivel}`}>{NIVEL_LABEL[c.nivel]}</span>
        </div>
        <h3>{c.titulo}</h3>
        <p>{c.descripcion}</p>
        <div className="travesia-card-actions">
          {desbloqueada ? (
            <>
              <button className="btn btn-sm" onClick={onOpen}>Ver clase →</button>
              {!completada && (
                <button className="btn btn-sm btn-outline btn-completar-card" onClick={onCompletar}>
                  ✓ Marcar completada
                </button>
              )}
            </>
          ) : (
            <span className="travesia-locked-msg">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Completa la etapa anterior
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

// ── Tarjeta de clase (vista filtros y grupos) ─────────────────────────────
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
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
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

// ── Página principal ──────────────────────────────────────────────────────
export default function ClasesOnlinePage() {
  const { isSubscribed, refreshSubscription, user } = useAuth()
  const [vista, setVista] = useState('selector')
  const [filtroDuracion, setFiltroDuracion] = useState('todos')
  const [filtroNivel, setFiltroNivel] = useState('todos')
  const [modalClase, setModalClase] = useState(null)
  const [grupoClases, setGrupoClases] = useState({})
  const [travesiaProgress, setTravesiaProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('travesia_progress') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    if (user) refreshSubscription()
  }, [user])

  useEffect(() => {
    if (vista !== 'grupos') return
    GRUPOS.forEach(async g => {
      if (grupoClases[g.id]) return
      try {
        const res  = await fetch(`/api/clases/grupo/${g.id}`)
        const json = await res.json()
        if (json.success) setGrupoClases(prev => ({ ...prev, [g.id]: json.data }))
      } catch { /* usa datos locales */ }
    })
  }, [vista])

  const marcarCompletada = (claseId) => {
    const nuevas = [...new Set([...travesiaProgress, claseId])]
    setTravesiaProgress(nuevas)
    localStorage.setItem('travesia_progress', JSON.stringify(nuevas))
  }

  const estaDesbloqueada = (index) => {
    if (index === 0) return true
    return travesiaProgress.includes(CLASES[index - 1].id)
  }

  const progreso = travesiaProgress.filter(id => CLASES.some(c => c.id === id)).length

  const visibles = CLASES.filter(c => {
    const okDur = filtroDuracion === 'todos' || String(c.duracion) === filtroDuracion
    const okNiv = filtroNivel   === 'todos' || String(c.nivel)    === filtroNivel
    return okDur && okNiv
  })

  const abrirModal = (clase, conCompletar = false) =>
    setModalClase({ clase, onCompletar: conCompletar ? () => marcarCompletada(clase.id) : null })

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
        <div className="page-header-rule"><span>✦</span></div>
        <p>Tu práctica, a tu ritmo, donde quieras</p>
      </header>

      {/* ── Selector de métodos ── */}
      {vista === 'selector' && (
        <section className="metodos-selector">
          <p className="metodos-eyebrow">Elige cómo practicar</p>
          <h2 className="metodos-heading">¿Cómo quieres practicar hoy?</h2>

          <div className="metodos-grid">
            {/* Tarjeta 1 — La Travesía (destacada, ancho completo) */}
            <MetodoCard
              tipo="travesia"
              badge="NUEVO · EXCLUSIVO"
              titulo="La Travesía"
              subtitulo="Avanza etapa a etapa. Desbloquea tu progreso."
              descripcion="Una experiencia de yoga completamente diferente. Cada clase que practicas desbloquea la siguiente etapa de tu camino. Avanza a tu ritmo, siente cómo evoluciona tu cuerpo y descubre hasta dónde puedes llegar."
              cta="Comenzar la travesía"
              icon={<IconTravesia />}
              decoracion={<TravesiaMapDecor progreso={progreso} />}
              onClick={() => setVista('travesia')}
            />

            {/* Tarjeta 2 — Explorar */}
            <MetodoCard
              tipo="explorar"
              titulo="Explora a tu aire"
              subtitulo="Elige lo que necesitas hoy"
              descripcion="Filtra por nivel, duración o tipo de práctica y encuentra exactamente la clase que tu cuerpo pide en este momento."
              cta="Explorar clases"
              icon={<IconExplorar />}
              decoracion={<ExplorarDecor />}
              onClick={() => setVista('filtros')}
            />

            {/* Tarjeta 3 — Grupos */}
            <MetodoCard
              tipo="grupos"
              titulo="Grupos de Clases"
              subtitulo="Programas con un objetivo claro"
              descripcion="Series diseñadas en torno a un propósito: movilidad, fuerza, restauración... Sigue el programa y nota la diferencia semana a semana."
              cta="Ver los grupos"
              icon={<IconGrupos />}
              decoracion={<GruposDecor />}
              onClick={() => setVista('grupos')}
            />
          </div>
        </section>
      )}

      {/* ── Botón volver ── */}
      {vista !== 'selector' && (
        <div className="volver-wrap">
          <button className="volver-btn" onClick={() => setVista('selector')} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="15,18 9,12 15,6"/></svg>
            Elegir otro método
          </button>
        </div>
      )}

      {/* ── La Travesía ── */}
      {vista === 'travesia' && (
        <section className="travesia-section">
          <div className="travesia-section-header">
            <div>
              <p className="travesia-eyebrow">La Travesía</p>
              <h2 className="travesia-section-titulo">Tu camino, paso a paso</h2>
              <p className="travesia-section-desc">Practica cada clase y desbloquea la siguiente etapa. {!isSubscribed && <Link to="/suscripcion" className="link-tierra">Suscríbete para empezar →</Link>}</p>
            </div>
            <div className="travesia-progreso-wrap">
              <div className="travesia-progreso-bar">
                <div className="travesia-progreso-fill" style={{ width: `${(progreso / CLASES.length) * 100}%` }} />
              </div>
              <p className="travesia-progreso-texto">
                <strong>{progreso}</strong> de {CLASES.length} etapas completadas
              </p>
            </div>
          </div>

          <div className="travesia-grid">
            {CLASES.map((c, i) => {
              const desbloqueada = estaDesbloqueada(i)
              const completada   = travesiaProgress.includes(c.id)
              return (
                <TravesiaCard
                  key={c.id}
                  clase={c}
                  stepNum={i + 1}
                  desbloqueada={isSubscribed && desbloqueada}
                  completada={completada}
                  onOpen={() => abrirModal(c, isSubscribed && desbloqueada && !completada)}
                  onCompletar={() => marcarCompletada(c.id)}
                />
              )
            })}
          </div>

          {!isSubscribed && (
            <div className="travesia-sub-cta">
              <p>Necesitas una suscripción activa para empezar tu travesía.</p>
              <Link to="/suscripcion" className="btn">Ver planes →</Link>
            </div>
          )}
        </section>
      )}

      {/* ── Explorar (filtros) ── */}
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
                <ClaseCard key={c.id} clase={c} subscribed={isSubscribed} onOpen={() => abrirModal(c)} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* ── Grupos de clases ── */}
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
                  <ClaseCard key={c.id} clase={c} subscribed={isSubscribed} onOpen={() => abrirModal(c)} />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ── Modal de vídeo ── */}
      {modalClase && (
        <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setModalClase(null) }}>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setModalClase(null)} aria-label="Cerrar">&times;</button>
            <div className="modal-meta">
              <span className="badge badge-dur">{modalClase.clase.duracion} min</span>
              <span className="badge">{NIVEL_LABEL[modalClase.clase.nivel]}</span>
            </div>
            <h3>{modalClase.clase.titulo}</h3>
            {modalClase.clase.vimeo_id ? (
              <div className="video-embed-wrap">
                <iframe
                  src={`https://player.vimeo.com/video/${modalClase.clase.vimeo_id}?title=0&byline=0&portrait=0&dnt=1`}
                  className="video-embed"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={modalClase.clase.titulo}
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
            {modalClase.onCompletar && (
              <button
                className="btn btn-completar-modal"
                onClick={() => { modalClase.onCompletar(); setModalClase(null) }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                Marcar como completada
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
// REBUILD_MARKER_1782424506
