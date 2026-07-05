import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useSearchParams, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CLASES = [
  // ── FASE 1: Cimientos y Alineación (1-8) ──────────────────────────────
  { id: 1,  titulo: 'El primer paso: activar el cuerpo desde la raíz',        duracion: 30, nivel: 1, descripcion: 'Toma conciencia de las plantas de los pies, activa la cadena muscular desde la base y establece la conexión entre suelo y movimiento.',                                                          imagen: '/images/yoga1.jpg' },
  { id: 2,  titulo: 'Alineación consciente: pies, rodillas, caderas',          duracion: 30, nivel: 1, descripcion: 'Aprende a alinear el tren inferior para proteger las articulaciones y crear una base sólida en cada postura.',                                                                                      imagen: '/images/yoga2.jpg' },
  { id: 3,  titulo: 'La columna neutra: encontrar tu eje',                     duracion: 30, nivel: 1, descripcion: 'Descubre la posición natural de la columna y cómo mantenerla en movimiento. El eje que sostiene toda la práctica.',                                                                                  imagen: '/images/yoga3.jpg' },
  { id: 4,  titulo: 'Escápulas despiertas: hombros en su lugar',               duracion: 25, nivel: 1, descripcion: 'Activa y estabiliza la cintura escapular para proteger los hombros y abrir el pecho con seguridad.',                                                                                               imagen: '/images/yoga4.jpg' },
  { id: 5,  titulo: 'Respiración y movimiento: el ritmo que sostiene la práctica', duracion: 30, nivel: 1, descripcion: 'Integra la respiración diafragmática con el movimiento para crear una práctica fluida, sostenida y presente.',                                                                                imagen: '/images/yoga5.jpg' },
  { id: 6,  titulo: 'El suelo pélvico como centro de poder',                   duracion: 30, nivel: 1, descripcion: 'Aprende a activar, relajar y coordinar el suelo pélvico. La base energética y física que nutre toda la práctica.', imagen: '/images/yoga9.jpg', vimeo_id: '1206825714' },
  { id: 7,  titulo: 'Activar antes de estirar: el cuerpo inteligente',         duracion: 25, nivel: 1, descripcion: 'Por qué es crucial activar el músculo antes de elongarlo. Una clase que cambia la forma en que entiendes el yoga.',                                                                                 imagen: '/images/yoga10.jpg' },
  { id: 8,  titulo: 'Integración postural: de pie a la esterilla',             duracion: 35, nivel: 1, descripcion: 'Sesión integradora de la Fase 1. Recorre todos los principios de alineación en una secuencia cohesionada y consciente.',                                                                           imagen: '/images/yoga11.jpg' },
  // ── FASE 2: Movilidad y Conciencia Corporal (9-15) ────────────────────
  { id: 9,  titulo: 'Movilidad de columna: flexión, extensión, rotación',      duracion: 30, nivel: 1, descripcion: 'Recorre los tres planos de movimiento de la columna con conciencia y control. La columna que respira es la que dura.',                                                                              imagen: '/images/yoga12.jpg' },
  { id: 10, titulo: 'Caderas líquidas: primeros círculos de apertura',          duracion: 30, nivel: 1, descripcion: 'Inicia el trabajo de apertura de caderas de forma suave y progresiva, explorando el rango articular disponible.',                                                                                  imagen: '/images/yoga-18.jpg' },
  { id: 11, titulo: 'Tobillos y muñecas: las bases olvidadas',                 duracion: 25, nivel: 1, descripcion: 'Movilidad y fortalecimiento de las articulaciones distales que sostienen toda la práctica en el suelo y de pie.',                                                                                   imagen: '/images/yoga-21.jpg' },
  { id: 12, titulo: 'Torsiones suaves: desintoxicar y alinear',                duracion: 30, nivel: 1, descripcion: 'Las torsiones bien ejecutadas liberan tensión profunda, estimulan los órganos y realinean la columna sin forzar.',                                                                                  imagen: '/images/yoga-30.jpg' },
  { id: 13, titulo: 'Movilidad escapular: preparar el tren superior',           duracion: 25, nivel: 1, descripcion: 'Gana rango de movimiento en la cintura escapular antes de cargar peso en brazos. Hombros libres, práctica segura.',                                                                                imagen: '/images/yoga-36.jpg' },
  { id: 14, titulo: 'El cuerpo en espiral: rotaciones seguras',                 duracion: 30, nivel: 2, descripcion: 'Explora las rotaciones de tronco con conciencia postural. La espiral que conecta pies, caderas y hombros.',                                                                                        imagen: '/images/yoga-37.jpg' },
  { id: 15, titulo: 'Fluidez articular: de la rigidez a la libertad',           duracion: 35, nivel: 1, descripcion: 'Clase integradora de movilidad. Un recorrido completo por todas las articulaciones para encontrar libertad de movimiento.',                                                                        imagen: '/images/yoga1.jpg' },
  // ── FASE 3: Construcción de Fuerza · Core (16-20) ─────────────────────
  { id: 16, titulo: 'El core profundo: más allá del abdomen visible',           duracion: 30, nivel: 1, descripcion: 'Descubre los músculos estabilizadores profundos — transverso, multífidos, suelo pélvico — y cómo activarlos con precisión.',                                                                       imagen: '/images/yoga2.jpg' },
  { id: 17, titulo: 'Plancha consciente: fuerza con alineación',                duracion: 30, nivel: 2, descripcion: 'La plancha no es solo resistencia: es activación total del cuerpo. Aprende a hacerla bien antes de hacerla más.',                                                                                  imagen: '/images/yoga3.jpg' },
  { id: 18, titulo: 'Estabilidad lumbo-pélvica en movimiento',                  duracion: 35, nivel: 2, descripcion: 'Aprende a mantener la pelvis estable mientras las piernas y brazos se mueven. La clave para proteger la zona lumbar.',                                                                             imagen: '/images/yoga4.jpg' },
  { id: 19, titulo: 'Core dinámico: fuerza en transición',                      duracion: 35, nivel: 2, descripcion: 'Trabaja la fuerza del centro en movimiento real: entradas y salidas de posturas, transiciones fluidas y controladas.',                                                                             imagen: '/images/yoga5.jpg' },
  { id: 20, titulo: 'De la estabilidad a la potencia central',                  duracion: 40, nivel: 2, descripcion: 'Clase integradora del core. Combina estabilidad profunda con potencia funcional para un centro que realmente sostiene.',                                                                           imagen: '/images/yoga9.jpg' },
  // ── FASE 4: Apertura de Caderas Progresiva (21-27) ────────────────────
  { id: 21, titulo: 'Caderas nivel I: apertura externa suave',                  duracion: 35, nivel: 1, descripcion: 'Primer trabajo sistemático de apertura de cadera externa. Posturas accesibles con tiempo y presencia.',                                                                                            imagen: '/images/yoga10.jpg' },
  { id: 22, titulo: 'Flexores de cadera: liberar lo que sostenemos',            duracion: 30, nivel: 1, descripcion: 'Iliopsoas, recto femoral, tensor… Los flexores acumulan tensión emocional y postural. Aprende a soltarlos con seguridad.',                                                                        imagen: '/images/yoga11.jpg' },
  { id: 23, titulo: 'Caderas nivel II: rotación profunda',                      duracion: 40, nivel: 2, descripcion: 'Avanza hacia una mayor rotación externa con posturas que requieren activación y apertura simultáneas.',                                                                                            imagen: '/images/yoga12.jpg' },
  { id: 24, titulo: 'Isquiotibiales conscientes: elongar sin forzar',           duracion: 30, nivel: 1, descripcion: 'El trabajo correcto de los isquiotibiales: cómo elongarlos con soporte muscular activo para ganar sin lesionar.',                                                                                  imagen: '/images/yoga-18.jpg' },
  { id: 25, titulo: 'El camino a Paloma: apertura progresiva',                  duracion: 40, nivel: 2, descripcion: 'Preparación paso a paso para Eka Pada Rajakapotasana. Una clase que respeta el tiempo de tu cuerpo.',                                                                                              imagen: '/images/yoga-21.jpg' },
  { id: 26, titulo: 'Caderas nivel III: preparación para posturas avanzadas',   duracion: 45, nivel: 3, descripcion: 'Exploración profunda del rango articular de cadera. Prerequisito para Hanumanasana y variantes avanzadas.',                                                                                        imagen: '/images/yoga-30.jpg' },
  { id: 27, titulo: 'Integración de cadera: fuerza y flexibilidad unidas',      duracion: 40, nivel: 2, descripcion: 'Clase integradora de la Fase 4. La cadera que abre con fuerza es más segura y más libre.',                                                                                                        imagen: '/images/yoga-36.jpg' },
  // ── FASE 5: Fuerza en Tren Superior y Hombros (28-33) ─────────────────
  { id: 28, titulo: 'Hombros fuertes, hombros seguros',                         duracion: 30, nivel: 2, descripcion: 'Construye la base muscular del hombro: manguito rotador, deltoides, trapecio inferior. Fuerza antes que movilidad.',                                                                              imagen: '/images/yoga-37.jpg' },
  { id: 29, titulo: 'Fuerza de brazos: primeros apoyos',                        duracion: 35, nivel: 2, descripcion: 'Tríceps, bíceps y muñecas como soporte real. Aprende los primeros apoyos en manos con conciencia y control.',                                                                                     imagen: '/images/yoga1.jpg' },
  { id: 30, titulo: 'Estabilidad escapular en carga',                           duracion: 35, nivel: 2, descripcion: 'Cuando el peso cae en los brazos, las escápulas deben estar activas. Aprende a estabilizarlas bajo carga.',                                                                                       imagen: '/images/yoga2.jpg' },
  { id: 31, titulo: 'Del Perro Boca Abajo a Chaturanga consciente',             duracion: 40, nivel: 2, descripcion: 'La transición más técnica del yoga: de Adho Mukha a Chaturanga con alineación real y sin compensar.',                                                                                              imagen: '/images/yoga3.jpg' },
  { id: 32, titulo: 'Dorsales y core: la conexión de fuerza',                   duracion: 35, nivel: 2, descripcion: 'Dorsal ancho, serrato y core trabajan juntos para crear una cadena posterior sólida. La fuerza que une todo.',                                                                                    imagen: '/images/yoga4.jpg' },
  { id: 33, titulo: 'Preparación física para el peso en manos',                 duracion: 40, nivel: 2, descripcion: 'Clase integradora del tren superior. Todo el trabajo converge en la preparación para los arm balances.',                                                                                           imagen: '/images/yoga5.jpg' },
  // ── FASE 6: Equilibrio y Fuerza en Piernas (34-37) ────────────────────
  { id: 34, titulo: 'Equilibrio nivel I: el árbol y sus raíces',                duracion: 30, nivel: 1, descripcion: 'Vrksasana y variantes accesibles. Los fundamentos del equilibrio monopodal: dónde mirar, dónde activar.',                                                                                        imagen: '/images/yoga9.jpg' },
  { id: 35, titulo: 'Fuerza de piernas: guerreros conscientes',                  duracion: 35, nivel: 2, descripcion: 'Virabhadrasana I, II y III con énfasis en activación muscular, alineación y resistencia. Los guerreros desde dentro.',                                                                           imagen: '/images/yoga10.jpg' },
  { id: 36, titulo: 'Equilibrio nivel II: desafiar la estabilidad',              duracion: 35, nivel: 2, descripcion: 'Ardha Chandrasana, Virabhadrasana III, variantes en palancas. El equilibrio que se gana con práctica constante.',                                                                                imagen: '/images/yoga11.jpg' },
  { id: 37, titulo: 'Propiocepción avanzada: el cuerpo que confía',             duracion: 40, nivel: 3, descripcion: 'Entrena el sistema propioceptivo con transiciones de equilibrio en cadena. El cuerpo aprende a confiar en sí mismo.',                                                                             imagen: '/images/yoga12.jpg' },
  // ── FASE 7: Backbends Progresivos (38-42) ─────────────────────────────
  { id: 38, titulo: 'Extensión de columna: primeros backbends',                  duracion: 30, nivel: 1, descripcion: 'Cobra, Esfinge, Langosta suave. Aprende a extender la columna con soporte muscular, sin comprimir las lumbares.',                                                                                imagen: '/images/yoga-18.jpg' },
  { id: 39, titulo: 'Abrir el corazón: nivel intermedio',                        duracion: 35, nivel: 2, descripcion: 'Ustrasana, Dhanurasana, Setu Bandha. El corazón se abre cuando el cuerpo está preparado y la mente confía.',                                                                                     imagen: '/images/yoga-21.jpg' },
  { id: 40, titulo: 'Backbends nivel II: fuerza en la apertura',                 duracion: 40, nivel: 2, descripcion: 'Profundiza en la extensión torácica con Chakrasana preparatorio. Fuerza de piernas, apertura de psoas y pecho.',                                                                                 imagen: '/images/yoga-30.jpg' },
  { id: 41, titulo: 'Puente y Rueda: preparación progresiva',                    duracion: 40, nivel: 2, descripcion: 'El trabajo hacia Urdhva Dhanurasana: cómo construirla desde el puente con fuerza, apertura y confianza.',                                                                                         imagen: '/images/yoga-36.jpg' },
  { id: 42, titulo: 'Flexibilidad de columna con soporte muscular',              duracion: 45, nivel: 3, descripcion: 'Clase integradora de backbends. La columna que se abre con músculos activos es más segura y más profunda.',                                                                                       imagen: '/images/yoga-37.jpg' },
  // ── FASE 8: Arm Balances y Preparación a Inversiones (43-47) ──────────
  { id: 43, titulo: 'Primeros equilibrios de brazos: Bakasana',                  duracion: 35, nivel: 2, descripcion: 'Bakasana paso a paso. Aprende a encontrar el punto de equilibrio sin miedo y con técnica.',                                                                                                      imagen: '/images/yoga1.jpg' },
  { id: 44, titulo: 'Core y hombros: la combinación clave',                      duracion: 40, nivel: 3, descripcion: 'El secreto de los arm balances: core comprimido y hombros activos al mismo tiempo. Entrena la conexión.',                                                                                        imagen: '/images/yoga2.jpg' },
  { id: 45, titulo: 'Arm balances nivel II: desafíos de estabilidad',            duracion: 40, nivel: 3, descripcion: 'Variantes de Bakasana, Bhujapidasana y Tittibhasana. Progresa con seguridad hacia los equilibrios más complejos.',                                                                                imagen: '/images/yoga3.jpg' },
  { id: 46, titulo: 'Preparación técnica para invertir el cuerpo',               duracion: 35, nivel: 2, descripcion: 'Aprende a invertir con seguridad: Sirsasana con soporte, Prasarita Padottanasana, Sarvangasana.',                                                                                                imagen: '/images/yoga4.jpg' },
  { id: 47, titulo: 'El miedo y la confianza: paso previo a invertir',           duracion: 35, nivel: 2, descripcion: 'El componente mental de las inversiones. Respiración, visualización y aproximación gradual al volteo.',                                                                                           imagen: '/images/yoga5.jpg' },
  // ── FASE 9: Inversiones e Integración Final (48-50) ───────────────────
  { id: 48, titulo: 'Invertidas nivel I: Delfín y preparación a Sirsasana',     duracion: 40, nivel: 3, descripcion: 'Ardha Sirsasana y Makarasana. Fortalece cuello, hombros y core para invertir con seguridad total.',                                                                                                imagen: '/images/yoga9.jpg' },
  { id: 49, titulo: 'Invertidas nivel II: Sirsasana con soporte',               duracion: 45, nivel: 3, descripcion: 'Sirsasana asistida y con pared. La postura más completa del yoga: calma, fuerza e inversión en su forma plena.',                                                                                  imagen: '/images/yoga10.jpg' },
  { id: 50, titulo: 'La travesía completa: cuerpo, mente y práctica integradas', duracion: 60, nivel: 3, descripcion: 'La clase final. Un recorrido por todos los principios de la Travesía: alineación, fuerza, apertura e inversión. El cuerpo que ha llegado hasta aquí lo ha ganado.', imagen: '/images/yoga11.jpg' },
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
      { id: 'g1-3', titulo: 'Suelta el peso que llevas en los hombros, ¡literalmente!', duracion: 30, nivel: 1, descripcion: 'Libera la tensión acumulada en cuello, hombros y zona cervical.', imagen: '/images/yoga9.jpg' },
      { id: 'g1-4', titulo: 'La base que lo sostiene todo: despierta tus pies',        duracion: 25, nivel: 1, descripcion: 'Trabaja la conexión con el suelo activando tobillos, arcos plantares y la cadena de movimiento que empieza en los pies, recorriendo gemelos, isquiotibiales y cuádriceps hasta la cadera.', imagen: '/images/yoga10.jpg', vimeo_id: '1206606063' },
      { id: 'g1-5', titulo: 'Cuando todo se conecta — la clase que lo une todo',       duracion: 30, nivel: 1, descripcion: 'Una secuencia integradora que recorre todos los patrones del grupo.', imagen: '/images/yoga12.jpg' },
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

const NIVEL_LABEL = { 1: 'Todos los niveles', 2: 'Intermedio', 3: 'Avanzado' }

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
    { cx: 40, cy: 186, angle: -16, left: true  },
    { cx: 68, cy: 158, angle:  13, left: false },
    { cx: 38, cy: 122, angle: -18, left: true  },
    { cx: 66, cy:  94, angle:  15, left: false },
    { cx: 40, cy:  58, angle: -14, left: true  },
    { cx: 66, cy:  28, angle:  12, left: false },
  ]
  return (
    <svg viewBox="18 0 76 210" className="tis-feet-svg" aria-hidden="true">
      <path d="M53 202 C42 170 62 142 50 102 C38 62 60 44 52 8"
        stroke="rgba(212,160,96,0.18)" strokeWidth="1.5" strokeDasharray="4 5" fill="none"/>
      {steps.map(({ cx, cy, angle, left }, i) => {
        const op = 0.44 + i * 0.07
        // mirror: pie izquierdo / pie derecho
        const sx = left ? 1 : -1
        return (
          <g key={i} className="tis-fp" style={{ '--d': `${i * 0.3 + 0.8}s` }}
             transform={`translate(${cx},${cy}) rotate(${angle}) scale(${sx},1)`}>
            {/* Cuerpo: ancho en los dedos (top), estrecho en el talón (bottom) */}
            <path
              d="M -5 -1 C -6.5 -5 -6 -10 0 -10 C 6 -10 6.5 -5 5 -1 C 4 5 3 9 0 11 C -3 9 -4 5 -5 -1 Z"
              fill={`rgba(212,160,96,${op})`}
            />
            {/* 5 dedos en arco */}
            <circle cx="-5"   cy="-12.5" r="1.8" fill={`rgba(212,160,96,${op * 0.9})`}/>
            <circle cx="-2.5" cy="-14"   r="1.9" fill={`rgba(212,160,96,${op * 0.9})`}/>
            <circle cx="0.5"  cy="-14.5" r="2"   fill={`rgba(212,160,96,${op * 0.9})`}/>
            <circle cx="3.5"  cy="-13.5" r="1.8" fill={`rgba(212,160,96,${op * 0.9})`}/>
            <circle cx="5.5"  cy="-12"   r="1.6" fill={`rgba(212,160,96,${op * 0.9})`}/>
          </g>
        )
      })}
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

  // Progreso "dibujado" — arranca en 0 y anima al valor real en el primer render
  // También re-anima cada vez que se completa una nueva clase
  const [drawnProgress, setDrawnProgress] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setDrawnProgress(completadas), 350)
    return () => clearTimeout(t)
  }, [completadas])

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

          {/* Trazo del camino (fondo, punteado) */}
          <path d={fullPathD}
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="2.6"
            strokeDasharray="13 5"
            strokeLinecap="round"
            fill="none"/>

          {/* Pasos completados — glow dorado */}
          <path
            d={pathD}
            pathLength="1"
            stroke="rgba(212,160,96,0.18)"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            style={{
              strokeDasharray: '1',
              strokeDashoffset: String(1 - drawnProgress / TOTAL),
              transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)',
            }}
          />

          {/* Pasos completados — trazo dorado sólido */}
          <path
            d={pathD}
            pathLength="1"
            stroke="rgba(212,160,96,0.92)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
            style={{
              strokeDasharray: '1',
              strokeDashoffset: String(1 - drawnProgress / TOTAL),
              transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)',
            }}
          />

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
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span className="lock-overlay-text">Plan Mensual</span>
        </div>
      </div>
      <div className="clase-card-body">
        {badges}
        <h3>{c.titulo}</h3>
        <p>{c.descripcion}</p>
        <Link to="/suscripcion" className="btn btn-sm">Desbloquear · 7 días gratis</Link>
      </div>
    </article>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ── CALENDARIO DE PRÁCTICA ────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════

const DIAS_SEMANA  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
const MESES_CORTO  = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']

// Patrón de días dentro de cada semana (0 = lunes)
const PLAN_PATTERNS = { '3m': [0,1,3,4], '6m': [0,3] }
const PLAN_LABEL    = { '3m': '3 meses · 4 clases/semana', '6m': '6 meses · 2 clases/semana' }

function calParseDate(str) {
  if (!str) return null
  const s = typeof str === 'string' ? str.replace('T', ' ').split(' ')[0] : str
  const [y, m, d] = String(s).split('-').map(Number)
  return new Date(y, m - 1, d)
}

function calAddDays(date, n) {
  const d = new Date(date); d.setDate(d.getDate() + n); return d
}

function calDiffDays(a, b) {
  return Math.round((new Date(a.getFullYear(), a.getMonth(), a.getDate()) -
    new Date(b.getFullYear(), b.getMonth(), b.getDate())) / 86400000)
}

function calGetMonday(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dow = d.getDay()
  d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1))
  return d
}

function calFormatDate(date) {
  return `${date.getDate()} ${MESES_CORTO[date.getMonth()]} ${date.getFullYear()}`
}

function calFormatDay(date) {
  return `${DIAS_SEMANA[date.getDay()]} ${date.getDate()} ${MESES_CORTO[date.getMonth()]}`
}

// Genera los 50 fechas de práctica a partir de start_date y plan_type
function calGenerateSchedule(startDateStr, planType) {
  const pattern   = PLAN_PATTERNS[planType] || PLAN_PATTERNS['3m']
  const startDate = calParseDate(startDateStr)
  const monday    = calGetMonday(startDate)
  const dates     = []
  let week = 0
  while (dates.length < 50) {
    for (const offset of pattern) {
      const d = calAddDays(monday, week * 7 + offset)
      if (d >= startDate) { dates.push(d); if (dates.length === 50) break }
    }
    week++
  }
  return dates
}

// Aplica retrasos acumulados y devuelve array de slots con estado
function calComputeSlots(startDateStr, planType, progressWithDates, clasesArray) {
  const rawDates = calGenerateSchedule(startDateStr, planType)
  const today    = new Date(); today.setHours(0,0,0,0)

  // Mapa: índice de clase (0-based) → completedAt Date
  const completionMap = {}
  for (const p of progressWithDates) {
    const idx = clasesArray.findIndex(c => String(c.id) === String(p.clase_id))
    if (idx >= 0) completionMap[idx] = calParseDate(p.completed_at)
  }

  let acumulado = 0
  return rawDates.map((raw, i) => {
    const scheduledDate = calAddDays(raw, acumulado)
    const completed     = i in completionMap
    const completedAt   = completionMap[i] || null
    let   delay         = 0

    if (completed) {
      const d = calDiffDays(completedAt, scheduledDate)
      if (d > 0) { delay = d; acumulado += d }
    }

    const status = completed
      ? 'done'
      : calDiffDays(today, scheduledDate) > 0
        ? 'overdue'
        : calDiffDays(today, scheduledDate) === 0
          ? 'today'
          : 'upcoming'

    return { num: i + 1, scheduledDate, completed, completedAt, delay, status }
  })
}

// Agrupa los slots en semanas de práctica (no semanas calendario)
function calGroupWeeks(slots, planType) {
  const size = PLAN_PATTERNS[planType]?.length || 4
  const weeks = []
  for (let i = 0; i < slots.length; i += size) {
    weeks.push({ num: Math.floor(i / size) + 1, slots: slots.slice(i, i + size) })
  }
  return weeks
}

// ── Onboarding del calendario (primera entrada a Travesía sin plan) ───────
function CalendarOnboarding({ onSelect, onDismiss, loading, error }) {
  return (
    <div className="cal-onboarding-overlay" role="dialog" aria-modal="true" aria-label="Configura tu calendario de práctica">
      <div className="cal-onboarding">
        <div className="cal-onboarding-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8"  y1="14" x2="8"  y2="14" strokeWidth="2.5"/>
            <line x1="12" y1="14" x2="12" y2="14" strokeWidth="2.5"/>
            <line x1="16" y1="14" x2="16" y2="14" strokeWidth="2.5"/>
            <line x1="8"  y1="18" x2="8"  y2="18" strokeWidth="2.5"/>
            <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2.5"/>
          </svg>
        </div>
        <h2 className="cal-onboarding-titulo">Tu calendario de práctica</h2>
        <p className="cal-onboarding-desc">
          La Travesía se recorre mejor con un ritmo claro. Elige tu plan y el
          calendario se crea hoy con las 50 clases repartidas — si te saltas un
          día, se reajusta solo para que nunca pierdas el hilo.
        </p>
        <div className="cal-onboarding-cards">
          <button className="cal-ob-card cal-ob-card--3m" onClick={() => onSelect('3m')} disabled={loading}>
            <span className="cal-ob-badge">Recomendado</span>
            <p className="cal-ob-dur">3 meses</p>
            <p className="cal-ob-freq">4 clases por semana</p>
            <p className="cal-ob-desc">
              El ritmo óptimo para que la Travesía deje huella real. La práctica frecuente
              hace que los cambios se instalen en el cuerpo. Lunes, martes, jueves y viernes.
            </p>
          </button>
          <button className="cal-ob-card" onClick={() => onSelect('6m')} disabled={loading}>
            <p className="cal-ob-dur">6 meses</p>
            <p className="cal-ob-freq">2 clases por semana</p>
            <p className="cal-ob-desc">
              Más espacio entre sesiones para asimilar y recuperar.
              Ideal si tu agenda lo necesita. Lunes y jueves.
            </p>
          </button>
        </div>
        {error && <p className="cal-ob-error">{error}</p>}
        <button className="cal-ob-skip" onClick={onDismiss} type="button">
          Ahora no, ir al camino →
        </button>
      </div>
    </div>
  )
}

// ── Selector de plan (visible en el tab Mi Calendario si no hay plan) ──────
function PlanSelector({ onSelect, loading }) {
  return (
    <div className="cal-selector">
      <h3 className="cal-selector-titulo">Planifica tu Travesía</h3>
      <p className="cal-selector-sub">
        Elige el ritmo que mejor encaja con tu vida. El calendario se crea hoy
        y se ajusta automáticamente si te saltas alguna sesión.
      </p>
      <div className="cal-selector-cards">
        <button className="cal-plan-card cal-plan-card--3m" onClick={() => onSelect('3m')} disabled={loading}>
          <div className="cal-plan-card-inner">
            <span className="cal-plan-badge">Recomendado</span>
            <p className="cal-plan-dur">3 meses</p>
            <p className="cal-plan-freq">4 clases por semana</p>
            <p className="cal-plan-desc">
              El ritmo óptimo para que la práctica se integre de verdad en cuerpo y mente.
              Lunes, martes, jueves y viernes.
            </p>
          </div>
        </button>
        <button className="cal-plan-card cal-plan-card--6m" onClick={() => onSelect('6m')} disabled={loading}>
          <div className="cal-plan-card-inner">
            <p className="cal-plan-dur">6 meses</p>
            <p className="cal-plan-freq">2 clases por semana</p>
            <p className="cal-plan-desc">
              Más espacio entre sesiones para asimilar y recuperar.
              Lunes y jueves.
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}

// ── Panel del calendario ──────────────────────────────────────────────────
function CalendarioPanel({ plan, progressWithDates, clasesArray, userName, onCambiarPlan }) {
  const [mostrarTodo, setMostrarTodo] = useState(false)

  const slots  = calComputeSlots(plan.start_date, plan.plan_type, progressWithDates, clasesArray)
  const weeks  = calGroupWeeks(slots, plan.plan_type)
  const today  = new Date(); today.setHours(0,0,0,0)

  const completadas  = slots.filter(s => s.completed).length
  const hayPendiente = slots.find(s => s.status === 'overdue')
  const proximaIdx   = slots.findIndex(s => s.status === 'today' || s.status === 'upcoming')

  // Semana activa (la que contiene la próxima clase o la última completada)
  const semanaActivaNum = proximaIdx >= 0
    ? Math.floor(proximaIdx / (PLAN_PATTERNS[plan.plan_type]?.length || 4)) + 1
    : weeks.length

  // Por defecto: semanas completadas colapsadas + semana activa + 2 siguientes
  const weeksCutoff = mostrarTodo ? weeks.length : Math.min(semanaActivaNum + 2, weeks.length)
  const weeksVisibles = weeks.slice(0, weeksCutoff)

  return (
    <div className="cal-panel">
      {/* Cabecera */}
      <div className="cal-panel-header">
        <div>
          <p className="cal-nombre">Calendario de {userName.split(' ')[0]}</p>
          <p className="cal-meta">
            {PLAN_LABEL[plan.plan_type]}
            <span className="cal-meta-sep">·</span>
            Inicio: {calFormatDate(calParseDate(plan.start_date))}
          </p>
        </div>
        <div className="cal-resumen">
          <span className="cal-resumen-num">{completadas}</span>
          <span className="cal-resumen-de">/{slots.length}</span>
          <span className="cal-resumen-label">clases</span>
        </div>
      </div>

      {hayPendiente && (
        <div className="cal-aviso-retraso">
          Tienes clases pendientes del plan — las fechas siguientes se han ajustado automáticamente.
        </div>
      )}

      {/* Semanas */}
      <div className="cal-weeks">
        {weeksVisibles.map(week => {
          const allDone    = week.slots.every(s => s.completed)
          const isActive   = week.num === semanaActivaNum
          const startDate  = week.slots[0].scheduledDate
          const endDate    = week.slots[week.slots.length - 1].scheduledDate
          const rangoLabel = startDate.getMonth() === endDate.getMonth()
            ? `${startDate.getDate()}–${endDate.getDate()} ${MESES_CORTO[endDate.getMonth()]}`
            : `${startDate.getDate()} ${MESES_CORTO[startDate.getMonth()]} – ${endDate.getDate()} ${MESES_CORTO[endDate.getMonth()]}`

          return (
            <div key={week.num} className={`cal-week${allDone ? ' cal-week--done' : isActive ? ' cal-week--active' : ''}`}>
              <div className="cal-week-head">
                <span className="cal-week-num">Semana {week.num}</span>
                <span className="cal-week-rango">{rangoLabel}</span>
                {allDone && <span className="cal-week-tick" aria-hidden="true">✓</span>}
              </div>
              <div className="cal-week-items">
                {week.slots.map(slot => {
                  const clase = clasesArray[slot.num - 1]
                  return (
                    <div key={slot.num} className={`cal-item cal-item--${slot.status}`}>
                      <div className="cal-item-dot">
                        {slot.status === 'done'
                          ? <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="3,8 7,12 13,4"/></svg>
                          : <span>{slot.num}</span>}
                      </div>
                      <div className="cal-item-body">
                        <span className="cal-item-fecha">{calFormatDay(slot.scheduledDate)}</span>
                        <span className="cal-item-titulo">
                          {clase
                            ? clase.titulo.split(':')[0].split('—')[0].trim()
                            : `Clase ${slot.num} · Próximamente`}
                        </span>
                      </div>
                      <div className="cal-item-estado">
                        {slot.status === 'done' && slot.delay > 0 && (
                          <span className="cal-delay-badge" title={`${slot.delay} día${slot.delay > 1 ? 's' : ''} de retraso`}>
                            +{slot.delay}d
                          </span>
                        )}
                        {slot.status === 'today'   && <span className="cal-hoy-badge">Hoy</span>}
                        {slot.status === 'overdue' && <span className="cal-pendiente-badge">Pendiente</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Expandir / Cambiar plan */}
      <div className="cal-footer">
        {!mostrarTodo && weeksCutoff < weeks.length && (
          <button className="cal-ver-mas-btn" onClick={() => setMostrarTodo(true)}>
            Ver plan completo ({weeks.length - weeksCutoff} semanas más)
          </button>
        )}
        <button className="cal-cambiar-btn" onClick={onCambiarPlan}>
          Cambiar ritmo de práctica
        </button>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────
export default function ClasesOnlinePage() {
  const { isSubscribed, refreshSubscription, user, token } = useAuth()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const [vista, setVista] = useState(() => {
    const p = searchParams.get('vista')
    return ['travesia', 'filtros', 'grupos'].includes(p) ? p : 'selector'
  })

  // Cuando el usuario navega a /aula-online desde el menú (misma URL, nuevo location.key),
  // volver siempre al selector de métodos
  useEffect(() => {
    const p = searchParams.get('vista')
    if (!p) setVista('selector')
  }, [location.key])
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null)
  const [filtroDuracion, setFiltroDuracion] = useState('todos')
  const [filtroNivel, setFiltroNivel] = useState('todos')
  const [modalClase, setModalClase] = useState(null)
  const [videoTerminado, setVideoTerminado] = useState(false)
  const vimeoRef = useRef(null)
  const [grupoClases, setGrupoClases] = useState({})
  const [travesiaProgress, setTravesiaProgress] = useState([])
  const [progressWithDates, setProgressWithDates] = useState([])
  const [plan, setPlan] = useState(null)
  const [planLoading, setPlanLoading] = useState(false)
  const [travesiaView, setTravesiaView] = useState('camino')  // 'camino' | 'calendario'
  const [showIntroAnim, setShowIntroAnim] = useState(false)
  const [showCompletionAnim, setShowCompletionAnim] = useState(false)
  const [confirmModal, setConfirmModal] = useState(null)
  const [planLoaded, setPlanLoaded] = useState(false)
  const [showCalOnboarding, setShowCalOnboarding] = useState(false)
  const [planError, setPlanError] = useState('')
  const calOnboardingShown = useRef(false)

  useEffect(() => {
    if (user) refreshSubscription()
  }, [user])

  // Cargar progreso desde la API (con fechas)
  useEffect(() => {
    if (!user || !token) { setTravesiaProgress([]); setProgressWithDates([]); return }
    fetch('/api/travesia/progress', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setProgressWithDates(data.data)
          setTravesiaProgress(data.data.map(r => Number(r.clase_id)))
        }
      })
      .catch(() => {})
  }, [user, token])

  // Cargar plan de práctica
  useEffect(() => {
    if (!user || !token) { setPlan(null); setPlanLoaded(true); return }
    fetch('/api/travesia/plan', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.success) setPlan(data.data) })
      .catch(() => {})
      .finally(() => setPlanLoaded(true))
  }, [user, token])

  // Mostrar onboarding del calendario la primera vez que se entra sin plan
  useEffect(() => {
    if (vista === 'travesia' && isSubscribed && planLoaded && plan === null && !calOnboardingShown.current) {
      calOnboardingShown.current = true
      setShowCalOnboarding(true)
    }
  }, [vista, isSubscribed, planLoaded, plan])

  const handleCrearPlan = async (planType) => {
    if (!token) return
    setPlanLoading(true)
    setPlanError('')
    try {
      const r    = await fetch('/api/travesia/plan', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ plan_type: planType }) })
      const data = await r.json()
      if (data.success && data.data) {
        setPlan(data.data)
        setShowCalOnboarding(false)
        setTravesiaView('calendario')
      } else {
        setPlanError('No se pudo crear el calendario. Inténtalo de nuevo.')
      }
    } catch {
      setPlanError('Error de conexión. Comprueba tu red e inténtalo de nuevo.')
    }
    setPlanLoading(false)
  }

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
    const nuevas = [...new Set([...travesiaProgress, Number(claseId)])]
    setTravesiaProgress(nuevas)
    const todayStr = new Date().toISOString()
    setProgressWithDates(prev => {
      if (prev.some(p => String(p.clase_id) === String(claseId))) return prev
      return [...prev, { clase_id: String(claseId), completed_at: todayStr }]
    })
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
      {/* ── Banner de acceso para no suscritas ── */}
      {!isSubscribed && (
        <div className="aula-acceso-banner">
          <div className="aula-acceso-inner">
            {user ? (
              <>
                <span className="aula-acceso-icono">✦</span>
                <div className="aula-acceso-texto">
                  <strong>Hola, {user.nombre.split(' ')[0]}</strong>
                  <span>Activa tu suscripción para desbloquear todas las clases · 7 días gratis</span>
                </div>
                <Link to="/suscripcion" className="btn btn-sm aula-acceso-btn">
                  Activar ahora →
                </Link>
              </>
            ) : (
              <>
                <span className="aula-acceso-icono">✦</span>
                <div className="aula-acceso-texto">
                  <strong>Zona exclusiva para suscriptoras</strong>
                  <span>19€/mes · 7 días gratis · Cancela cuando quieras</span>
                </div>
                <Link to="/suscripcion" className="btn btn-sm aula-acceso-btn">
                  Ver planes →
                </Link>
              </>
            )}
          </div>
        </div>
      )}

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
              descripcion="50 etapas que se desbloquean con tu progreso real. Y ahora con tu calendario personal: planifica a 3 o 6 meses, y si te saltas una sesión el plan se ajusta automáticamente para que nunca pierdas el ritmo."
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
              onClick={() => { setVista('grupos'); window.scrollTo({ top: 0 }); }}
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

          {/* Tabs: El Camino / Mi Calendario */}
          {isSubscribed && (
            <div className="travesia-tabs">
              <button
                className={`travesia-tab${travesiaView === 'camino' ? ' travesia-tab--active' : ''}`}
                onClick={() => setTravesiaView('camino')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="5" cy="19" r="2.5"/><circle cx="12" cy="12" r="2.5"/><circle cx="19" cy="5" r="2.5"/>
                  <path d="M5 19 Q8 15 12 12 Q16 9 19 5" strokeDasharray="3 2" opacity="0.5"/>
                </svg>
                El Camino
              </button>
              <button
                className={`travesia-tab${travesiaView === 'calendario' ? ' travesia-tab--active' : ''}`}
                onClick={() => setTravesiaView('calendario')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="14" x2="8" y2="14" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="12" y1="14" x2="12" y2="14" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="16" y1="14" x2="16" y2="14" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                Mi Calendario
              </button>
            </div>
          )}

          {/* Vista: El Camino */}
          {travesiaView === 'camino' && (
            <>
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
            </>
          )}

          {/* Vista: Mi Calendario */}
          {travesiaView === 'calendario' && isSubscribed && (
            <div className="travesia-calendario-wrap">
              {!plan ? (
                <PlanSelector onSelect={handleCrearPlan} loading={planLoading} />
              ) : (
                <CalendarioPanel
                  plan={plan}
                  progressWithDates={progressWithDates}
                  clasesArray={CLASES}
                  userName={user?.nombre || ''}
                  onCambiarPlan={() => setPlan(null)}
                />
              )}
            </div>
          )}

          {/* Onboarding del calendario — overlay sobre la sección */}
          {showCalOnboarding && (
            <CalendarOnboarding
              onSelect={handleCrearPlan}
              onDismiss={() => setShowCalOnboarding(false)}
              loading={planLoading}
              error={planError}
            />
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
                  {[['todos', 'Todos'], ['1', 'Todos los niveles'], ['2', 'Intermedio'], ['3', 'Avanzado']].map(([val, label]) => (
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
