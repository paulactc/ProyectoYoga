import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CLASES = [
  { id: 1, titulo: 'Vinyasa Despertar',    duracion: 30, nivel: 1, descripcion: 'Activa el cuerpo con suavidad. Perfecta para comenzar el día o cuando el tiempo escasea.',              imagen: '/images/yoga1.jpg' },
  { id: 2, titulo: 'Flow Profundo',        duracion: 60, nivel: 2, descripcion: 'Secuencia fluida que trabaja la fuerza, la flexibilidad y la presencia plena.',                        imagen: '/images/yoga3.jpg' },
  { id: 3, titulo: 'Pranayama y Silencio', duracion: 30, nivel: 1, descripcion: 'Respiración consciente y meditación guiada para calmar la mente y centrar la energía.',               imagen: '/images/yoga2.jpg' },
  { id: 4, titulo: 'Vinyasa Avanzado',     duracion: 60, nivel: 3, descripcion: 'Posturas desafiantes y transiciones avanzadas para quienes quieren profundizar.',                      imagen: '/images/yoga4.jpg' },
  { id: 5, titulo: 'Movilidad y Cuidado',  duracion: 30, nivel: 1, descripcion: 'Cuida tus articulaciones y mejora el rango de movimiento. Ideal para todas las edades.',               imagen: '/images/yoga-36.jpg' },
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
  2: (
    <svg viewBox="0 0 70 110" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Rachis — eje central de la pluma */}
      <path d="M35 6 Q34 50 30 104" strokeWidth="1.4"/>
      {/* Barbas derechas */}
      <path d="M35 11 Q44  8 52 11"  strokeWidth="1.15" opacity="0.92"/>
      <path d="M35 19 Q46 15 55 19"  strokeWidth="1.1"  opacity="0.86"/>
      <path d="M35 28 Q48 23 58 27"  strokeWidth="1.1"  opacity="0.80"/>
      <path d="M35 37 Q48 32 57 37"  strokeWidth="1.0"  opacity="0.74"/>
      <path d="M35 46 Q47 41 56 46"  strokeWidth="1.0"  opacity="0.68"/>
      <path d="M34 55 Q46 50 54 56"  strokeWidth="0.9"  opacity="0.58"/>
      <path d="M33 64 Q43 60 50 65"  strokeWidth="0.85" opacity="0.48"/>
      <path d="M32 73 Q40 69 45 74"  strokeWidth="0.75" opacity="0.38"/>
      <path d="M31 82 Q37 79 40 84"  strokeWidth="0.65" opacity="0.28"/>
      {/* Barbas izquierdas */}
      <path d="M35 11 Q26  8 18 11"  strokeWidth="1.15" opacity="0.92"/>
      <path d="M35 19 Q24 15 15 19"  strokeWidth="1.1"  opacity="0.86"/>
      <path d="M35 28 Q22 23 12 27"  strokeWidth="1.1"  opacity="0.80"/>
      <path d="M35 37 Q22 32 13 37"  strokeWidth="1.0"  opacity="0.74"/>
      <path d="M35 46 Q23 41 14 46"  strokeWidth="1.0"  opacity="0.68"/>
      <path d="M34 55 Q22 50 16 56"  strokeWidth="0.9"  opacity="0.58"/>
      <path d="M33 64 Q23 60 17 65"  strokeWidth="0.85" opacity="0.48"/>
      <path d="M32 73 Q26 69 21 74"  strokeWidth="0.75" opacity="0.38"/>
      <path d="M31 82 Q27 79 24 84"  strokeWidth="0.65" opacity="0.28"/>
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
      { id: 'g1-1', titulo: 'Despierta tu columna: movimiento desde adentro',          duracion: 25, nivel: 1, descripcion: 'Activa y moviliza la columna vertebral con movimientos suaves y conscientes que parten del centro hacia fuera.', imagen: '/images/grupomovilidad1.jpg', vimeo_id: '1204671530' },
      { id: 'g1-2', titulo: 'Caderas libres: el movimiento que cambia todo',           duracion: 30, nivel: 1, descripcion: 'Abre y libera las caderas para transformar tu forma de moverte en el día a día.', imagen: '/images/grupomovilidad2.jpg' },
      { id: 'g1-3', titulo: 'Suelta el peso que llevas en los hombros, ¡literalmente!', duracion: 20, nivel: 1, descripcion: 'Libera la tensión acumulada en cuello, hombros y zona cervical.', imagen: '/images/yoga9.jpg' },
      { id: 'g1-4', titulo: 'La base que lo sostiene todo: despierta tus pies',        duracion: 25, nivel: 1, descripcion: 'Trabaja la conexión con el suelo activando tobillos, arcos plantares y la cadena de movimiento.', imagen: '/images/yoga2.jpg' },
      { id: 'g1-5', titulo: 'Cuando todo se conecta — la clase que lo une todo',       duracion: 30, nivel: 1, descripcion: 'Una secuencia integradora que recorre todos los patrones del grupo.', imagen: '/images/yoga-36.jpg' },
    ],
  },
  {
    id: 2,
    nombre: 'Respiración Consciente',
    descripcion: 'El pranayama es la puerta entre el cuerpo y la mente. Aprende a usar la respiración como herramienta de regulación, enfoque y calma profunda.',
    meta: '5 clases · 20-35 min · Todos los niveles',
    clases: [
      { id: 'g2-1', titulo: 'La respiración que nunca nos enseñaron',      duracion: 20, nivel: 1, descripcion: 'Toma conciencia de tu respiración habitual y aprende la base del pranayama: respirar desde el diafragma.', imagen: '/images/yoga-21.jpg' },
      { id: 'g2-2', titulo: 'Ujjayi: el aliento que centra',               duracion: 25, nivel: 1, descripcion: 'Domina la respiración ujjayi para regular la energía, calentar el cuerpo y mantener la atención durante la práctica.', imagen: '/images/yoga-37.jpg' },
      { id: 'g2-3', titulo: 'Nadi Shodhana: equilibra los dos lados',      duracion: 30, nivel: 1, descripcion: 'La respiración alternada limpia los canales energéticos y equilibra los hemisferios cerebrales para una calma profunda.', imagen: '/images/yoga-30.jpg' },
      { id: 'g2-4', titulo: 'Kapalabhati: enciende tu fuego interior',     duracion: 20, nivel: 2, descripcion: 'Respiración de fuego para limpiar el sistema nervioso, activar el abdomen y aumentar la energía vital.', imagen: '/images/yoga5.jpg' },
      { id: 'g2-5', titulo: 'Respira para soltar: la práctica integradora', duracion: 35, nivel: 1, descripcion: 'Combina las técnicas del grupo en una sesión profunda para liberar tensión y reconectar con tu centro.', imagen: '/images/yoga-18.jpg' },
    ],
  },
]

const NIVEL_LABEL = { 1: 'Principiante', 2: 'Intermedio', 3: 'Avanzado' }

// ── Zonas del camino (sistema de chakras) ─────────────────────────────────
const PATH_ZONES = [
  { desde: 1,  hasta: 8,  nombre: 'El Despertar',     subtitulo: 'Muladhara · Raíz',    color: '#c4784a', bg: 'rgba(140,78,47,0.14)',    particle: '#d4a060' },
  { desde: 9,  hasta: 16, nombre: 'Raíces Profundas', subtitulo: 'Svadhisthana · Agua',  color: '#d4724a', bg: 'rgba(184,92,42,0.14)',    particle: '#e08050' },
  { desde: 17, hasta: 25, nombre: 'Fuego Interior',   subtitulo: 'Manipura · Fuego',     color: '#d4a840', bg: 'rgba(184,136,42,0.14)',   particle: '#d4b060' },
  { desde: 26, hasta: 33, nombre: 'El Corazón Verde', subtitulo: 'Anahata · Corazón',    color: '#5aaa68', bg: 'rgba(74,138,88,0.14)',    particle: '#6aaa78' },
  { desde: 34, hasta: 41, nombre: 'Lago de Silencio', subtitulo: 'Vishuddha · Garganta', color: '#4a98b8', bg: 'rgba(42,104,130,0.14)',   particle: '#5aa8c2' },
  { desde: 42, hasta: 50, nombre: 'Cielo Abierto',    subtitulo: 'Sahasrara · Corona',   color: '#9a7aba', bg: 'rgba(106,74,138,0.14)',   particle: '#9a7aba' },
]

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
      {[[18,25],[140,38],[8,108],[150,88],[22,194],[148,172],[90,244],[108,18],[42,230],[130,218]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i%4===0?1.5:0.8} fill="rgba(255,255,255,0.45)"/>
      ))}
      <circle cx={cx} cy={cy} r={r} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      {[0,45,90,135,180,225,270,315].map(deg => {
        const a=(deg-90)*Math.PI/180, isC=deg%90===0, len=isC?11:6
        return <line key={deg}
          x1={cx+Math.cos(a)*(r-len)} y1={cy+Math.sin(a)*(r-len)}
          x2={cx+Math.cos(a)*r}       y2={cy+Math.sin(a)*r}
          stroke={isC ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.22)'}
          strokeWidth={isC?1.5:0.9}/>
      })}
      <circle cx={cx} cy={cy} r={ri} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 4"/>
      <path d={`M${cx} ${cy-ri+6} L${cx-7} ${cy+2} L${cx} ${cy-4} Z`} fill="#d4a060" opacity="0.95"/>
      <path d={`M${cx} ${cy+ri-6} L${cx+7} ${cy-2} L${cx} ${cy+4} Z`} fill="rgba(255,255,255,0.3)"/>
      <path d={`M${cx+ri-6} ${cy} L${cx-2} ${cy-6} L${cx+4} ${cy} Z`} fill="rgba(255,255,255,0.18)"/>
      <path d={`M${cx-ri+6} ${cy} L${cx+2} ${cy+6} L${cx-4} ${cy} Z`} fill="rgba(255,255,255,0.18)"/>
      <circle cx={cx} cy={cy} r={5} fill="rgba(255,255,255,0.55)"/>
      <circle cx={cx} cy={cy} r={2.5} fill="#d4a060"/>
      <text x={cx} y={cy-r-5} textAnchor="middle" fontSize="9" fontWeight="700"
        fill="rgba(255,255,255,0.5)" fontFamily="Raleway,sans-serif" letterSpacing="0.12em">N</text>
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
      {[[15,28],[142,42],[8,110],[150,88],[20,200],[146,178],[82,248],[108,18],[38,240]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={0.9} fill="rgba(255,255,255,0.3)"/>
      ))}
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
      <path d="M0 255 L0 185 L28 148 L56 172 L82 138 L112 164 L138 130 L158 148 L158 255 Z" fill="rgba(255,255,255,0.07)"/>
      <path d="M0 255 L0 210 L20 196 L44 210 L70 194 L100 208 L130 192 L158 204 L158 255 Z" fill="rgba(255,255,255,0.05)"/>
      <g fill="rgba(255,255,255,0.18)" stroke="none">
        <path d="M52 228 L56 212 L60 228 Z"/><rect x="55.5" y="228" width="1.5" height="6" fill="rgba(255,255,255,0.18)"/>
        <path d="M92 184 L96 170 L100 184 Z"/><rect x="95.5" y="184" width="1.5" height="6" fill="rgba(255,255,255,0.18)"/>
        <path d="M18 148 L22 136 L26 148 Z"/><rect x="21.5" y="148" width="1.5" height="6" fill="rgba(255,255,255,0.18)"/>
        <path d="M130 100 L134 88 L138 100 Z"/><rect x="133.5" y="100" width="1.5" height="6" fill="rgba(255,255,255,0.18)"/>
      </g>
      <path d="M85 244 C28 220 16 188 44 166 C72 144 132 136 118 106 C104 76 32 62 68 30 C80 16 74 6 74 6"
        stroke="rgba(255,255,255,0.35)" strokeWidth="2.2" strokeDasharray="5 5" strokeLinecap="round" fill="none"/>
      <circle cx="74" cy="6" r="6" fill="#d4a060" opacity="0.8"/>
      <line x1="74" y1="-2" x2="74" y2="-4" stroke="#d4a060" strokeWidth="1.5" opacity="0.7"/>
      <line x1="74" y1="14" x2="74" y2="16" stroke="#d4a060" strokeWidth="1.5" opacity="0.7"/>
      <line x1="66" y1="6"  x2="64" y2="6"  stroke="#d4a060" strokeWidth="1.5" opacity="0.7"/>
      <line x1="82" y1="6"  x2="84" y2="6"  stroke="#d4a060" strokeWidth="1.5" opacity="0.7"/>
      {waypoints.map((wp, i) => {
        const done   = i < progreso
        const active = i === progreso
        const r      = active ? 15 : 12
        return (
          <g key={i}>
            {active && <circle cx={wp.cx} cy={wp.cy} r={24} fill="rgba(140,78,47,0.25)"/>}
            <circle cx={wp.cx} cy={wp.cy} r={r}
              fill={done ? '#6b3820' : active ? '#8c4e2f' : 'rgba(255,255,255,0.1)'}
              stroke={done || active ? '#d4a060' : 'rgba(255,255,255,0.35)'}
              strokeWidth="1.8"/>
            {done ? (
              <polyline points={`${wp.cx-5},${wp.cy+0.5} ${wp.cx-1.5},${wp.cy+4.5} ${wp.cx+6},${wp.cy-5}`}
                stroke="#d4a060" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            ) : (
              <text x={wp.cx} y={wp.cy + 4} textAnchor="middle"
                fontSize={active ? '8.5' : '8'} fontWeight="700" letterSpacing="0.04em"
                fill={active ? '#fff' : 'rgba(255,255,255,0.5)'} fontFamily="Raleway,sans-serif">
                {String(i + 1).padStart(2, '0')}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ── Pies avanzando ────────────────────────────────────────────────────────
function WalkingFeet() {
  const steps = [
    { cx: 40, cy: 186, angle: -16 },
    { cx: 68, cy: 158, angle:  13 },
    { cx: 38, cy: 122, angle: -18 },
    { cx: 66, cy:  94, angle:  15 },
    { cx: 40, cy:  58, angle: -14 },
    { cx: 66, cy:  28, angle:  12 },
  ]
  return (
    <svg viewBox="18 0 76 210" className="tis-feet-svg" aria-hidden="true">
      <path d="M53 202 C42 170 62 142 50 102 C38 62 60 44 52 8"
        stroke="rgba(212,160,96,0.18)" strokeWidth="1.5" strokeDasharray="4 5" fill="none"/>
      {steps.map(({ cx, cy, angle }, i) => (
        <g key={i} className="tis-fp" style={{ '--d': `${i * 0.3 + 0.8}s` }}
           transform={`rotate(${angle} ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy + 3} rx="8" ry="12" fill={`rgba(212,160,96,${0.42 + i * 0.07})`}/>
          <circle cx={cx - 5} cy={cy - 9}  r="3"   fill={`rgba(212,160,96,${0.38 + i * 0.07})`}/>
          <circle cx={cx - 1} cy={cy - 11} r="3.3" fill={`rgba(212,160,96,${0.38 + i * 0.07})`}/>
          <circle cx={cx + 4} cy={cy - 10} r="3"   fill={`rgba(212,160,96,${0.34 + i * 0.07})`}/>
        </g>
      ))}
    </svg>
  )
}

// ── Pantalla de inicio tipo videojuego ────────────────────────────────────
function TravesiaIntroScreen({ onEnd }) {
  useEffect(() => {
    const t = setTimeout(onEnd, 4200)
    return () => clearTimeout(t)
  }, [onEnd])

  const stars = Array.from({ length: 28 }, (_, i) => ({
    left:  `${(i * 37 + 3) % 100}%`,
    top:   `${(i * 53 + 7) % 100}%`,
    size:  `${(i % 3) + 1}px`,
    delay: `${(i * 0.38) % 3}s`,
  }))

  return (
    <div className="travesia-intro-screen" onClick={onEnd} role="presentation">
      <div className="tis-stars" aria-hidden="true">
        {stars.map((s, i) => (
          <div key={i} className="tis-star" style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }}/>
        ))}
      </div>
      <div className="tis-content">
        <p className="tis-eyebrow">YOGA TIERRA VIVA</p>
        <div className="tis-title-wrap">
          <span className="tis-la">LA</span>
          <span className="tis-travesia">TRAVESÍA</span>
        </div>
        <WalkingFeet />
        <div className="tis-path-bar">
          <div className="tis-path-fill" />
        </div>
      </div>
    </div>
  )
}

// ── Pantalla de celebración ───────────────────────────────────────────────
function TravesiaCompletionScreen({ onClose }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    left:  `${(i * 41 + 8) % 100}%`,
    dur:   `${1.4 + (i % 4) * 0.35}s`,
    delay: `${(i * 0.1) % 1.6}s`,
    color: i % 3 === 0 ? '#d4a060' : i % 3 === 1 ? 'rgba(140,78,47,0.9)' : 'rgba(255,255,255,0.7)',
    size:  `${(i % 3) * 2 + 5}px`,
  }))
  return (
    <div className="travesia-completion-screen" role="dialog" aria-modal="true">
      <div className="tcs-particles" aria-hidden="true">
        {particles.map((p, i) => (
          <div key={i} className="tcs-particle" style={{ left: p.left, width: p.size, height: p.size, background: p.color, animationDuration: p.dur, animationDelay: p.delay }}/>
        ))}
      </div>
      <div className="tcs-content">
        <div className="tcs-badge" aria-hidden="true">✦</div>
        <p className="tcs-eyebrow">YOGA TIERRA VIVA</p>
        <h2 className="tcs-titulo">¡TRAVESÍA<br/>COMPLETADA!</h2>
        <div className="tcs-stars-row" aria-label="Cinco estrellas">★ ★ ★ ★ ★</div>
        <p className="tcs-msg">
          Has recorrido cada etapa de tu camino.<br/>
          Tu cuerpo ha crecido. Tu práctica, también.
        </p>
        <button className="tcs-btn" onClick={onClose}>Continuar practicando →</button>
      </div>
    </div>
  )
}

// ── Loto decorativo (nodo completado) ─────────────────────────────────────
function LotusDecor() {
  return (
    <svg viewBox="-14 -18 28 20" fill="none" stroke="currentColor" strokeWidth="0.9" className="pnode-lotus-svg" aria-hidden="true">
      <path d="M0 2 C-4-2-6-8-3-11 C-1-13 0-9 0-6" opacity="0.65"/>
      <path d="M0 2 C4-2 6-8 3-11 C1-13 0-9 0-6"   opacity="0.65"/>
      <path d="M0 2 C-2-5-2-10 0-12 C2-10 2-5 0 2"  opacity="0.85"/>
      <path d="M0 2 C-8-2-10-7-7-11 C-5-13-1-8 0-5" opacity="0.45"/>
      <path d="M0 2 C8-2 10-7 7-11 C5-13 1-8 0-5"   opacity="0.45"/>
      <circle cx="0" cy="2" r="2.2" fill="currentColor" stroke="none" opacity="0.55"/>
    </svg>
  )
}

// ── Partículas flotantes de cada zona ─────────────────────────────────────
function ZoneParticles({ color }) {
  const ps = Array.from({ length: 5 }, (_, i) => ({
    left:  `${(i * 19 + 8) % 90 + 5}%`,
    delay: `${i * 0.9}s`,
    dur:   `${4.5 + i * 0.6}s`,
    size:  `${3 + (i % 2)}px`,
  }))
  return (
    <div className="zone-particles" aria-hidden="true">
      {ps.map((p, i) => (
        <div key={i} className="zone-particle" style={{ left: p.left, width: p.size, height: p.size, background: color, animationDuration: p.dur, animationDelay: p.delay }}/>
      ))}
    </div>
  )
}

// ── Nodo del camino ───────────────────────────────────────────────────────
function PathNode({ slot, onOpen }) {
  const { n, clase, isCompleted, isUnlocked, isComingSoon } = slot
  const state = isCompleted ? 'done' : isUnlocked ? 'active' : isComingSoon ? 'soon' : 'locked'
  const clickable = state === 'done' || state === 'active'

  return (
    <div
      className={`pnode pnode--${state}`}
      onClick={clickable ? () => onOpen(slot) : undefined}
      title={clase?.titulo || `Clase ${n} · Próximamente`}
    >
      <div className="pnode-inner">
        {state === 'done' && (
          <>
            <svg className="pnode-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><polyline points="20,6 9,17 4,12"/></svg>
            <div className="pnode-lotus"><LotusDecor /></div>
          </>
        )}
        {state === 'active' && <span className="pnode-num">{n}</span>}
        {state === 'locked' && (
          <svg className="pnode-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        )}
        {state === 'soon' && <span className="pnode-dots">···</span>}
      </div>
      {state === 'active' && clase && (
        <div className="pnode-title" aria-hidden="true">
          {clase.titulo.split(':')[0].split('—')[0].trim().slice(0, 22)}
        </div>
      )}
      {state === 'done' && (
        <div className="pnode-num-small" aria-hidden="true">{n}</div>
      )}
    </div>
  )
}

// ── Banner de zona (chakra) ───────────────────────────────────────────────
function ZoneBanner({ zone }) {
  return (
    <div className="zone-banner" style={{ '--zc': zone.color }}>
      <div className="zone-banner-line" />
      <div className="zone-banner-content">
        <span className="zone-banner-name">{zone.nombre}</span>
        <span className="zone-banner-sub">{zone.subtitulo}</span>
      </div>
      <div className="zone-banner-line" />
    </div>
  )
}

// ── Fila de nodos del camino ──────────────────────────────────────────────
function PathRow({ slots, reversed, onOpen }) {
  const items = reversed ? [...slots].reverse() : slots
  return (
    <div className={`path-row${reversed ? ' path-row--rev' : ''}`}>
      <div className="path-row-line" aria-hidden="true" />
      {items.map(slot => (
        <PathNode key={slot.n} slot={slot} onOpen={onOpen} />
      ))}
    </div>
  )
}

// ── Conector curvo entre filas (estilo TravesiaMapDecor) ─────────────────
function PathTurn({ reversed }) {
  // reversed=true → la fila que acaba de terminar iba de derecha a izquierda
  // → el giro está en el lado IZQUIERDO
  const turnLeft = reversed

  // Curva amplia — control points lejos del borde para que el arco respire
  const curve = turnLeft
    ? 'M30 5 C-14 5 -18 105 30 105'
    : 'M290 5 C334 5 338 105 290 105'

  const mtn1 = turnLeft
    ? 'M35 110 L35 0 L55 34 L95 14 L145 40 L195 16 L245 42 L285 22 L320 46 L320 110 Z'
    : 'M285 110 L285 0 L265 34 L225 14 L175 40 L125 16 L75 42 L35 22 L0 46 L0 110 Z'
  const mtn2 = turnLeft
    ? 'M35 110 L35 0 L60 50 L105 62 L148 42 L188 60 L228 44 L265 58 L300 48 L320 58 L320 110 Z'
    : 'M285 110 L285 0 L260 50 L215 62 L172 42 L132 60 L92 44 L55 58 L20 48 L0 58 L0 110 Z'

  // Puntos de luz (estrellas) en la zona central
  const stars = turnLeft
    ? [[110,12],[160,7],[195,24],[168,44],[215,58],[248,32],[230,72],[145,76],[178,92],[255,88]]
    : [[70,12],[120,7],[125,24],[102,44],[65,58],[32,32],[50,72],[135,76],[92,92],[45,88]]

  // Símbolo ✦ decorativo (posición central del conector)
  const sx = turnLeft ? 195 : 125

  // Posiciones de huellas a lo largo del giro
  const fps = turnLeft
    ? [{ x: 13, y: 26, r: 82 }, { x: 4, y: 55, r: 0 }, { x: 13, y: 84, r: -82 }]
    : [{ x: 307, y: 26, r: -82 }, { x: 316, y: 55, r: 180 }, { x: 307, y: 84, r: 82 }]

  return (
    <div className="path-turn" aria-hidden="true">
      <svg viewBox="0 0 320 110" className="path-turn-svg" preserveAspectRatio="none">
        <path d={mtn1} fill="rgba(255,255,255,0.055)"/>
        <path d={mtn2} fill="rgba(255,255,255,0.03)"/>
        {stars.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1.0} fill="rgba(255,255,255,0.38)"/>
        ))}
        <g transform={`translate(${sx},55)`} opacity="0.52">
          <path d="M0-9 L2 0 L0 9 L-2 0Z" fill="rgba(255,255,255,0.75)"/>
          <path d="M-9 0 L0 2 L9 0 L0-2Z" fill="rgba(255,255,255,0.75)"/>
        </g>
        <path d={curve}
          stroke="rgba(255,255,255,0.34)"
          strokeWidth="2.2"
          strokeDasharray="10 7"
          strokeLinecap="round"
          fill="none"/>
        {fps.map(({ x, y, r }, i) => (
          <g key={i} transform={`translate(${x},${y}) rotate(${r})`} opacity={0.42 - i * 0.04}>
            <ellipse cx="0" cy="6" rx="4.5" ry="7" fill="#d4a060"/>
            <circle cx="-3" cy="-3" r="2" fill="#d4a060"/>
            <circle cx="0" cy="-7" r="2.2" fill="#d4a060"/>
            <circle cx="3.5" cy="-4.5" r="1.8" fill="#d4a060"/>
          </g>
        ))}
      </svg>
    </div>
  )
}

// ── Vista del camino completo (50 clases) ─────────────────────────────────
function TravesiaPathView({ progress, isSubscribed, onNodeClick }) {
  const TOTAL = 50

  const completadas = progress.filter(id => CLASES.some(c => c.id === id)).length

  const SVG_W   = 320
  const SPACING = 52
  const PAD_TOP = 68
  const PAD_BOT = 120
  const SVG_H   = PAD_TOP + (TOTAL - 1) * SPACING + PAD_BOT

  const getZone = (n) => PATH_ZONES.find(z => n >= z.desde && n <= z.hasta)

  // Onda sinusoidal horizontal para las posiciones x (período = 14 nodos)
  const slots = Array.from({ length: TOTAL }, (_, i) => {
    const n            = i + 1
    const clase        = i < CLASES.length ? CLASES[i] : null
    const isComingSoon = i >= CLASES.length
    const isCompleted  = clase ? progress.includes(clase.id) : false
    const prevDone     = i === 0 ? true : (i < CLASES.length ? progress.includes(CLASES[i - 1].id) : false)
    const isUnlocked   = !isComingSoon && isSubscribed && prevDone && !isCompleted
    const x = SVG_W / 2 + 88 * Math.sin(i * Math.PI / 7)
    const y = PAD_TOP + i * SPACING
    return { n, clase, isCompleted, isUnlocked, isComingSoon, x, y }
  })

  // Trazo SVG: curvas cúbicas suaves entre nodos
  const t = SPACING * 0.4
  const pathD = slots.map((s, i) => {
    if (i === 0) return `M${s.x.toFixed(1)},${s.y}`
    const p = slots[i - 1]
    return `C${p.x.toFixed(1)},${p.y + t} ${s.x.toFixed(1)},${s.y - t} ${s.x.toFixed(1)},${s.y}`
  }).join(' ')

  // Campo de estrellas
  const stars = Array.from({ length: 55 }, (_, i) => ({
    cx: (i * 71 + 31) % SVG_W,
    cy: (i * 137 + 53) % SVG_H,
    r:  i % 7 === 0 ? 2 : i % 3 === 0 ? 1.3 : 0.7,
    op: i % 5 === 0 ? 0.5 : 0.28,
  }))

  // Árboles decorativos [x, fracción_y, escala]
  const trees = [
    [16, 0.06, 0.70], [7,  0.15, 0.55], [28, 0.25, 0.82], [12, 0.35, 0.60],
    [22, 0.45, 0.75], [9,  0.55, 0.65], [30, 0.65, 0.80], [14, 0.75, 0.55],
    [20, 0.85, 0.70], [6,  0.93, 0.50],
    [304, 0.04, 0.65], [314, 0.13, 0.80], [296, 0.22, 0.60], [309, 0.32, 0.75],
    [301, 0.42, 0.55], [313, 0.52, 0.70], [299, 0.62, 0.82], [311, 0.71, 0.60],
    [305, 0.81, 0.70], [297, 0.90, 0.65],
  ]

  // Extensión del camino hasta el ॐ
  const omX = SVG_W / 2
  const omY = SVG_H - 60
  const last = slots[TOTAL - 1]
  const fullPathD = pathD + ` C${last.x.toFixed(1)},${last.y + t} ${omX},${omY - 25} ${omX},${omY}`

  return (
    <div className="path-world">
      {/* Barra de progreso global */}
      <div className="path-world-topbar">
        <div className="path-world-progress">
          <div className="path-world-fill" style={{ width: `${(completadas / TOTAL) * 100}%` }} />
        </div>
        <span className="path-world-label">{completadas}<span>/</span>{TOTAL}</span>
      </div>

      {/* Contenedor del camino vertical */}
      <div className="path-vertical" style={{ height: SVG_H }}>

        {/* SVG de fondo */}
        <svg className="path-vertical-svg"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="none"
          aria-hidden="true">

          {/* Bandas de color por zona */}
          {PATH_ZONES.map(zone => {
            const y1 = slots[zone.desde - 1].y - SPACING / 2
            const y2 = slots[Math.min(zone.hasta, TOTAL) - 1].y + SPACING / 2
            return <rect key={zone.nombre} x={0} y={y1} width={SVG_W} height={y2 - y1} fill={zone.bg}/>
          })}

          {/* Silueta de montañas — dos capas */}
          <path
            d={`M0,${SVG_H} L0,${SVG_H*0.12} L${SVG_W*0.1},${SVG_H*0.06} L${SVG_W*0.22},${SVG_H*0.13} L${SVG_W*0.34},${SVG_H*0.03} L${SVG_W*0.47},${SVG_H*0.1} L${SVG_W*0.58},${SVG_H*0.01} L${SVG_W*0.7},${SVG_H*0.09} L${SVG_W*0.82},${SVG_H*0.04} L${SVG_W*0.93},${SVG_H*0.11} L${SVG_W},${SVG_H*0.06} L${SVG_W},${SVG_H} Z`}
            fill="rgba(255,255,255,0.04)"/>
          <path
            d={`M0,${SVG_H} L0,${SVG_H*0.2} L${SVG_W*0.15},${SVG_H*0.16} L${SVG_W*0.28},${SVG_H*0.24} L${SVG_W*0.4},${SVG_H*0.12} L${SVG_W*0.52},${SVG_H*0.21} L${SVG_W*0.63},${SVG_H*0.14} L${SVG_W*0.75},${SVG_H*0.22} L${SVG_W*0.88},${SVG_H*0.13} L${SVG_W},${SVG_H*0.18} L${SVG_W},${SVG_H} Z`}
            fill="rgba(255,255,255,0.025)"/>

          {/* Estrellas de fondo */}
          {stars.map((s, i) => (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={`rgba(255,255,255,${s.op})`}/>
          ))}

          {/* Árboles decorativos */}
          {trees.map(([tx, fy, ts], i) => (
            <g key={`t${i}`} transform={`translate(${tx},${(fy * SVG_H).toFixed(0)}) scale(${ts})`} opacity="0.55">
              <rect x="-2.5" y="0" width="5" height="10" fill="rgba(180,130,60,0.55)"/>
              <polygon points="-14,2 14,2 0,-18" fill="rgba(255,255,255,0.13)"/>
              <polygon points="-10,-14 10,-14 0,-28" fill="rgba(255,255,255,0.11)"/>
              <polygon points="-6,-24 6,-24 0,-36" fill="rgba(255,255,255,0.09)"/>
            </g>
          ))}

          {/* Glow suave del camino */}
          <path d={fullPathD} stroke="rgba(255,255,255,0.07)" strokeWidth="11" fill="none"/>

          {/* Trazo del camino */}
          <path d={fullPathD}
            stroke="rgba(255,255,255,0.40)"
            strokeWidth="2.6"
            strokeDasharray="13 5"
            strokeLinecap="round"
            fill="none"/>

          {/* ✦ en los cambios de zona */}
          {PATH_ZONES.slice(0, -1).map(zone => {
            const last = slots[zone.hasta - 1]
            const next = slots[zone.hasta]
            const mx   = (last.x + next.x) / 2
            const my   = (last.y + next.y) / 2
            return (
              <g key={zone.nombre} transform={`translate(${mx.toFixed(1)},${my})`} opacity="0.5">
                <path d="M0-7 L1.5 0 L0 7 L-1.5 0Z" fill="rgba(255,255,255,0.8)"/>
                <path d="M-7 0 L0 1.5 L7 0 L0-1.5Z" fill="rgba(255,255,255,0.8)"/>
              </g>
            )
          })}
        </svg>

        {/* Banners de zona (HTML sobre SVG) */}
        {PATH_ZONES.map(zone => (
          <div key={zone.nombre}
            className="zone-banner zone-banner-v"
            style={{ top: slots[zone.desde - 1].y - SPACING * 0.72, '--zc': zone.color }}>
            <div className="zone-banner-line"/>
            <div className="zone-banner-content">
              <span className="zone-banner-name">{zone.nombre}</span>
              <span className="zone-banner-sub">{zone.subtitulo}</span>
            </div>
            <div className="zone-banner-line"/>
          </div>
        ))}

        {/* Nodos del camino */}
        {slots.map(slot => {
          const { n, clase, isCompleted, isUnlocked, isComingSoon, x, y } = slot
          const state    = isCompleted ? 'done' : isUnlocked ? 'active' : isComingSoon ? 'soon' : 'locked'
          const clickable = state === 'done' || state === 'active'
          return (
            <div key={n}
              className={`pnode pnode--${state} pnode-v`}
              style={{ left: `${(x / SVG_W) * 100}%`, top: y }}
              onClick={clickable ? () => onNodeClick(slot) : undefined}
              title={clase?.titulo || `Clase ${n} · Próximamente`}
              role={clickable ? 'button' : undefined}>
              <div className="pnode-inner">
                {state === 'done' && (
                  <>
                    <svg className="pnode-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><polyline points="20,6 9,17 4,12"/></svg>
                    <div className="pnode-lotus"><LotusDecor /></div>
                  </>
                )}
                {state === 'active' && <span className="pnode-num">{n}</span>}
                {state === 'locked' && (
                  <svg className="pnode-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                )}
                {state === 'soon' && <span className="pnode-dots">···</span>}
              </div>
              {state === 'active' && clase && (
                <div className="pnode-title">{clase.titulo.split(':')[0].trim().slice(0, 22)}</div>
              )}
              {state === 'done' && <div className="pnode-num-small">{n}</div>}
            </div>
          )
        })}

        {/* ॐ al pie del camino, dentro del contenedor vertical */}
        <div className="path-finish" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: omY - 10, zIndex: 4, padding: '0.6rem 1.5rem 1rem' }}>
          <div className="path-finish-om" aria-hidden="true">ॐ</div>
          <p>La cima de tu travesía te espera</p>
        </div>
      </div>
    </div>
  )
}

// ── Tarjeta de método ─────────────────────────────────────────────────────
function MetodoCard({ tipo, badge, titulo, subtitulo, descripcion, cta, icon, decoracion, onClick }) {
  return (
    <button className={`metodo-card metodo-card--${tipo}`} onClick={onClick} type="button">
      {badge && <span className="metodo-badge">{badge}</span>}
      <div className="metodo-card-content">
        <div className="metodo-card-left">
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

// ── Tarjeta de selección de grupo ─────────────────────────────────────────
function GrupoSelectorCard({ grupo, icono, onSelect }) {
  const tags = grupo.meta.split(' · ')
  return (
    <button className={`gsc gsc--${grupo.id}`} onClick={onSelect} type="button">
      <div className="gsc-top">
        <div className="gsc-text">
          <h3 className="gsc-nombre">{grupo.nombre}</h3>
          <p className="gsc-desc">{grupo.descripcion}</p>
        </div>
        {icono && <div className="gsc-icon">{icono}</div>}
      </div>
      <div className="gsc-tags">
        {tags.map((tag, i) => <span key={i} className="gsc-tag">{tag}</span>)}
      </div>
      <span className="gsc-cta">Comenzar grupo →</span>
    </button>
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
        <div className="clase-card-img">
          <img src={c.imagen} alt={c.titulo} />
        </div>
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
      <div className="clase-card-img">
        <img src={c.imagen} alt={c.titulo} />
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
  const { isSubscribed, refreshSubscription, user, token } = useAuth()
  const [searchParams] = useSearchParams()
  const [vista, setVista] = useState(() => {
    const p = searchParams.get('vista')
    return ['travesia', 'filtros', 'grupos'].includes(p) ? p : 'selector'
  })
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null)
  const [filtroDuracion, setFiltroDuracion] = useState('todos')
  const [filtroNivel, setFiltroNivel] = useState('todos')
  const [modalClase, setModalClase] = useState(null)
  const [videoTerminado, setVideoTerminado] = useState(false)
  const vimeoRef = useRef(null)
  const [grupoClases, setGrupoClases] = useState({})
  const [travesiaProgress, setTravesiaProgress] = useState([])
  const [showIntroAnim, setShowIntroAnim] = useState(false)
  const [showCompletionAnim, setShowCompletionAnim] = useState(false)
  const [confirmModal, setConfirmModal] = useState(null)

  useEffect(() => {
    if (user) refreshSubscription()
  }, [user])

  // Cargar progreso desde la API (por usuario, no localStorage global)
  useEffect(() => {
    if (!user || !token) { setTravesiaProgress([]); return }
    fetch('/api/travesia/progress', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.success) setTravesiaProgress(data.data) })
      .catch(() => {})
  }, [user, token])

  // Detectar fin de vídeo Vimeo via postMessage
  useEffect(() => {
    if (!modalClase?.clase?.vimeo_id) { setVideoTerminado(false); return }
    setVideoTerminado(false)
    function onMsg(e) {
      if (!String(e.origin).includes('vimeo.com')) return
      try {
        const d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        if (d?.event === 'finish') setVideoTerminado(true)
      } catch {}
    }
    window.addEventListener('message', onMsg)
    // Registrar el evento 'finish' con el iframe Vimeo una vez cargue
    const register = () => {
      vimeoRef.current?.contentWindow?.postMessage(
        JSON.stringify({ method: 'addEventListener', value: 'finish' }),
        'https://player.vimeo.com'
      )
    }
    const t1 = setTimeout(register, 1500)
    const t2 = setTimeout(register, 4000)
    return () => {
      window.removeEventListener('message', onMsg)
      clearTimeout(t1); clearTimeout(t2)
    }
  }, [modalClase?.clase?.vimeo_id])

  useEffect(() => {
    if (vista !== 'grupos') setGrupoSeleccionado(null)
  }, [vista])

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

  const progreso = travesiaProgress.filter(id => CLASES.some(c => c.id === id)).length

  const handleStartTravesia = () => {
    if (progreso === 0) setShowIntroAnim(true)
    else setVista('travesia')
  }

  const handleIntroEnd = useCallback(() => {
    setShowIntroAnim(false)
    setVista('travesia')
  }, [])

  const pedirConfirmacion = (claseId) => setConfirmModal(claseId)

  const confirmarCompletada = async () => {
    const claseId = confirmModal
    setConfirmModal(null)
    setModalClase(null)
    setVideoTerminado(false)
    const nuevas = [...new Set([...travesiaProgress, claseId])]
    setTravesiaProgress(nuevas)
    // Guardar en backend (por usuario, no localStorage global)
    if (token) {
      fetch(`/api/travesia/progress/${claseId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
    if (nuevas.filter(id => CLASES.some(c => c.id === id)).length === CLASES.length) {
      setTimeout(() => setShowCompletionAnim(true), 700)
    }
  }

  const visibles = CLASES.filter(c => {
    const okDur = filtroDuracion === 'todos' || String(c.duracion) === filtroDuracion
    const okNiv = filtroNivel   === 'todos' || String(c.nivel)    === filtroNivel
    return okDur && okNiv
  })

  const abrirModal = (clase, conCompletar = false) =>
    setModalClase({ clase, onCompletar: conCompletar ? () => pedirConfirmacion(clase.id) : null })

  const handleNodeClick = (slot) => {
    if (!slot.clase) return
    const completada = travesiaProgress.includes(slot.clase.id)
    abrirModal(slot.clase, !completada)
  }

  return (
    <>
      <div className="en-proceso-banner">
        <span className="en-proceso-icono">✦</span>
        <div>
          <strong>Estamos grabando las clases</strong>
          <span>El Aula Online estará disponible en breve. ¡Gracias por tu paciencia!</span>
        </div>
      </div>

      {/* ── Header en tira estrecha ── */}
      <header className="page-header--aula">
        <div className="aula-strip">
          <span className="aula-strip-eyebrow">Tu espacio de práctica</span>
          <span className="aula-strip-sep" aria-hidden="true">✦</span>
          <h1 className="aula-strip-h1">Aula <em>Online</em></h1>
          <span className="aula-strip-sep" aria-hidden="true">✦</span>
          <span className="aula-strip-sub">Tu práctica, a tu ritmo, donde quieras</span>
        </div>
      </header>

      {/* ── Selector de métodos ── */}
      {vista === 'selector' && (
        <section className="metodos-selector">
          <p className="metodos-eyebrow">Elige cómo practicar</p>
          <h2 className="metodos-heading">¿Cómo quieres practicar hoy?</h2>

          <div className="metodos-grid">
            <MetodoCard
              tipo="travesia"
              badge="NUEVO · EXCLUSIVO"
              titulo="La Travesía"
              subtitulo="Avanza etapa a etapa. Desbloquea tu progreso."
              descripcion="Una experiencia de yoga completamente diferente. Cada clase que practicas desbloquea la siguiente etapa de tu camino. Avanza a tu ritmo, siente cómo evoluciona tu cuerpo y descubre hasta dónde puedes llegar."
              cta="Comenzar la travesía"
              icon={<IconTravesia />}
              decoracion={<TravesiaMapDecor progreso={progreso} />}
              onClick={handleStartTravesia}
            />
            <MetodoCard
              tipo="explorar"
              titulo="Explora a tu aire"
              subtitulo="Elige lo que necesitas hoy"
              descripcion="Filtra por nivel, duración o tipo de práctica y encuentra exactamente la clase que tu cuerpo pide en este momento."
              cta="Explorar clases"
              icon={<IconExplorar />}
              decoracion={<ExplorarDecor />}
              onClick={() => { setVista('filtros'); window.scrollTo({ top: 0 }); }}
            />
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

      {/* ── La Travesía — camino de 50 clases ── */}
      {vista === 'travesia' && (
        <section className="travesia-section">
          <div className="travesia-section-header">
            <div>
              <p className="travesia-eyebrow">La Travesía</p>
              <h2 className="travesia-section-titulo">Tu camino, paso a paso</h2>
              <p className="travesia-section-desc">
                50 etapas que se desbloquean a medida que avanzas.
                {!isSubscribed && <Link to="/suscripcion" className="link-tierra"> Suscríbete para empezar →</Link>}
              </p>
            </div>
            <div className="travesia-progreso-wrap">
              <div className="travesia-progreso-bar">
                <div className="travesia-progreso-fill" style={{ width: `${(progreso / CLASES.length) * 100}%` }} />
              </div>
              <p className="travesia-progreso-texto">
                <strong>{progreso}</strong> de {CLASES.length} disponibles completadas
              </p>
            </div>
          </div>

          <TravesiaPathView
            progress={travesiaProgress}
            isSubscribed={isSubscribed}
            onNodeClick={handleNodeClick}
          />

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
          <div className="filtros-intro">
            <p className="hero-eyebrow">Explora a tu aire</p>
            <h2 className="filtros-titulo">¿Qué necesitas hoy?</h2>
            <p className="filtros-sub">Elige la clase que tu cuerpo pide. Sin límites, sin presión.</p>
          </div>
          <div className="filtros-section">
            <div className="filtros">
              <div className="filtro-group">
                <span className="filtro-label">Duración</span>
                <div className="filtro-pills">
                  {[['todos', 'Todas'], ['30', '30 min'], ['60', '60 min']].map(([val, label]) => (
                    <button key={val} className={`pill${filtroDuracion === val ? ' active' : ''}`} onClick={() => setFiltroDuracion(val)}>{label}</button>
                  ))}
                </div>
              </div>
              <div className="filtro-group">
                <span className="filtro-label">Nivel</span>
                <div className="filtro-pills">
                  {[['todos', 'Todos'], ['1', 'Principiante'], ['2', 'Intermedio'], ['3', 'Avanzado']].map(([val, label]) => (
                    <button key={val} className={`pill${filtroNivel === val ? ' active' : ''}`} onClick={() => setFiltroNivel(val)}>{label}</button>
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
      {vista === 'grupos' && grupoSeleccionado === null && (
        <>
          <div className="filtros-intro">
            <p className="hero-eyebrow">Grupos de Clases</p>
            <h2 className="filtros-titulo">Elige tu programa</h2>
            <p className="filtros-sub">Series diseñadas con un propósito claro. Sigue el camino y nota la diferencia.</p>
          </div>
          <section className="gsc-grid">
            {GRUPOS.map(grupo => (
              <GrupoSelectorCard
                key={grupo.id}
                grupo={grupo}
                onSelect={() => { setGrupoSeleccionado(grupo.id); window.scrollTo({ top: 0 }); }}
              />
            ))}
          </section>
        </>
      )}

      {vista === 'grupos' && grupoSeleccionado !== null && (() => {
        const grupo = GRUPOS.find(g => g.id === grupoSeleccionado)
        if (!grupo) return null
        return (
          <section className="grupos-section">
            <div className="grupo-bloque">
              <button className="volver-grupo-btn" onClick={() => setGrupoSeleccionado(null)} type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="15,18 9,12 15,6"/></svg>
                Volver a grupos
              </button>
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
          </section>
        )
      })()}

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
                  ref={vimeoRef}
                  src={`https://player.vimeo.com/video/${modalClase.clase.vimeo_id}?title=0&byline=0&portrait=0&dnt=1&api=1`}
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
              videoTerminado ? (
                <button className="btn btn-completar-modal" onClick={modalClase.onCompletar}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                  Marcar como completada
                </button>
              ) : (
                <p className="completar-hint">Completa el vídeo para marcar la clase como hecha.</p>
              )
            )}
          </div>
        </div>
      )}

      {/* ── Animación de inicio ── */}
      {showIntroAnim && <TravesiaIntroScreen onEnd={handleIntroEnd} />}

      {/* ── Pantalla de celebración ── */}
      {showCompletionAnim && (
        <TravesiaCompletionScreen onClose={() => setShowCompletionAnim(false)} />
      )}

      {/* ── Modal de confirmación ── */}
      {confirmModal !== null && (
        <div className="confirm-modal-overlay" onClick={e => e.target === e.currentTarget && setConfirmModal(null)}>
          <div className="confirm-modal" role="dialog" aria-modal="true">
            <div className="confirm-modal-icon" aria-hidden="true">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9,12 11,14 15,10" strokeWidth="2.2"/>
              </svg>
            </div>
            <h3>¿Has completado la práctica?</h3>
            <p>
              ¿Realmente has podido realizar esta práctica y sientes que has completado
              las transiciones y asanas con la movilidad, fuerza y habilidad que se pide?
            </p>
            <div className="confirm-modal-actions">
              <button className="btn btn-confirm-yes" onClick={confirmarCompletada}>
                Sí, la he completado ✓
              </button>
              <button className="btn btn-outline btn-confirm-no" onClick={() => setConfirmModal(null)}>
                Todavía no
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
