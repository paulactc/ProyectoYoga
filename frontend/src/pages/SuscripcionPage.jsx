import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FAQS = [
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí, sin penalizaciones ni periodos de permanencia. Puedes cancelar en cualquier momento desde tu cuenta y no se te cobrará el siguiente mes.'
  },
  {
    q: '¿Qué pasa cuando termina la prueba gratuita?',
    a: 'Al acabar los 7 días de prueba se activa la suscripción según el plan elegido. Te avisaremos antes de que termine el periodo de prueba.'
  },
  {
    q: '¿En qué dispositivos puedo practicar?',
    a: 'Las clases funcionan en cualquier navegador moderno: móvil, tablet, ordenador o smart TV. Sin apps adicionales.'
  },
  {
    q: '¿Las clases son en directo?',
    a: 'Todas las clases son en formato de vídeo bajo demanda. Puedes practicar cuando quieras, las veces que quieras, sin horario fijo.'
  },
  {
    q: '¿Para qué nivel son las clases?',
    a: 'Tenemos niveles 1 (principiante), 2 (intermedio) y 3 (avanzado). Puedes empezar desde cero o retomar tu práctica donde la dejaste.'
  },
]

const BENEFICIOS = [
  'Acceso ilimitado a todas las clases',
  'Clases de pranayama y meditación',
  'Clases de asanas y movimientos',
  'Niveles 1, 2 y 3: de principiante a avanzado',
  'Nuevas clases cada mes',
  'Practica desde cualquier dispositivo',
  'Cancela cuando quieras, sin compromiso',
]

const PLANS = {
  annual: {
    label: 'Plan Anual',
    badge: 'El más elegido',
    featured: true,
    amount: null,
    period: '/mes',
    billing: 'Facturado anualmente',
    save: 'Máximo ahorro',
    btnText: 'Disponible próximamente',
    note: 'Mientras tanto, accede gratis a Tierra en Calma',
  },
  monthly: {
    label: 'Plan Mensual',
    badge: 'Popular',
    featured: false,
    amount: null,
    period: '/mes',
    billing: 'Facturado mensualmente',
    save: null,
    btnText: 'Disponible próximamente',
    note: 'Mientras tanto, accede gratis a Tierra en Calma',
  },
}

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <section className="faq-section">
      <h2>Preguntas frecuentes</h2>
      <div className="faq-list">
        {FAQS.map((faq, i) => (
          <div className={`faq-item${openIndex === i ? ' open' : ''}`} key={i}>
            <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
              <span>{faq.q}</span>
              <span className="faq-chevron">▼</span>
            </button>
            <div className="faq-answer">{faq.a}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function PageHeader() {
  return (
    <header className="page-header page-header-pricing">
      <p className="hero-eyebrow">7 días gratis</p>
      <h1>Tu práctica <em>sin límites</em></h1>
      <p>Elige tu plan y empieza hoy. Sin compromisos.</p>
    </header>
  )
}

function PlanCards({ onSelect, disableSelect }) {
  return (
    <section className="plans-section">
      <p className="clases-desc-eyebrow">Elige tu plan</p>
      <h2 className="plans-title">Empieza con <em>7 días gratis</em></h2>
      <p className="plans-subtitle">Cancela cuando quieras.</p>
      <div className="plans-grid">
        {Object.entries(PLANS).map(([key, plan]) => (
          <div key={key} className={`plan-card${plan.featured ? ' plan-card-featured' : ''}`}>
            <span className={`plan-badge${plan.featured ? '' : ' plan-badge-popular'}`}>{plan.badge}</span>
            <p className="plan-name">{plan.label}</p>
            <p className="plan-precio-pronto">Precio por confirmar</p>
            <p className="plan-billing">{plan.billing}</p>
            {plan.save && <span className="plan-save">{plan.save}</span>}
            <div className="plan-divider" />
            <ul className="plan-features">
              {BENEFICIOS.map(b => <li key={b}>{b}</li>)}
            </ul>
            {!disableSelect && (
              <button
                className={`btn${plan.featured ? '' : ' btn-outline'}`}
                style={{ width: '100%' }}
                onClick={() => onSelect(key)}
              >
                {plan.btnText}
              </button>
            )}
            <p className="plan-note">{plan.note}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function PwInput({ value, onChange, show, setShow, placeholder, autoComplete }) {
  return (
    <div className="input-pw-wrap">
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button type="button" className="pw-toggle" onClick={() => setShow(v => !v)} aria-label="Mostrar contraseña">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {show ? (
            <>
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </>
          ) : (
            <>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </>
          )}
        </svg>
      </button>
    </div>
  )
}

export default function SuscripcionPage() {
  const { user, isSubscribed } = useAuth()
  const [showAviso, setShowAviso] = useState(false)
  const avisoRef = useRef(null)

  function selectPlan() {
    setShowAviso(true)
    setTimeout(() => avisoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
  }

  if (user && isSubscribed) {
    return (
      <>
        <PageHeader />
        <PlanCards onSelect={() => {}} disableSelect />
        <section style={{ textAlign: 'center', padding: '2rem 2rem 4rem' }}>
          <div className="success-icon" style={{ margin: '0 auto 1.25rem' }}>✓</div>
          <p style={{ color: 'var(--muted)', marginBottom: '1.25rem' }}>
            ¡Hola, <strong>{user.nombre.split(' ')[0]}</strong>! Ya eres parte de Yoga Tierra Viva.
          </p>
          <Link to="/aula-online" className="btn">Ver mis clases →</Link>
        </section>
        <FaqAccordion />
      </>
    )
  }

  return (
    <>
      <div className="en-proceso-banner">
        <span className="en-proceso-icono">✦</span>
        <div>
          <strong>Suscripción próximamente disponible</strong>
          <span>Estamos preparando el Aula Online. Mientras tanto, accede gratis a <Link to="/audios" style={{ color: 'inherit', textDecoration: 'underline' }}>Tierra en Calma</Link>.</span>
        </div>
      </div>

      <PageHeader />
      <PlanCards onSelect={selectPlan} />

      {showAviso && (
        <section ref={avisoRef} className="suscripcion-aviso">
          <div className="suscripcion-aviso-inner">
            <span className="suscripcion-aviso-icono">☽</span>
            <h3>El Aula Online está en construcción</h3>
            <p>
              Estamos preparando las clases con todo el cuidado que merecen.
              Mientras tanto, te invitamos a crear tu <strong>cuenta gratuita</strong> y
              disfrutar de <em>Tierra en Calma</em> — meditaciones guiadas disponibles ya.
            </p>
            <Link to="/audios" className="btn" style={{ marginTop: '0.5rem' }}>
              Crear cuenta gratuita →
            </Link>
            <button
              className="suscripcion-aviso-volver"
              onClick={() => { setShowAviso(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            >
              ← Volver a los planes
            </button>
          </div>
        </section>
      )}

      <FaqAccordion />

      <div className="cta-final-banner">
        <h2>Empieza hoy.<br /><em>Es gratis.</em></h2>
        <p>Accede a Tierra en Calma sin coste. El Aula Online llegará pronto.</p>
        <Link to="/audios" className="btn">Crear cuenta gratuita →</Link>
      </div>
    </>
  )
}
