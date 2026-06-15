import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
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
    amount: '12€',
    period: '/mes',
    billing: 'Facturado como 144€/año',
    save: 'Ahorra un 29%',
    btnText: 'Empezar prueba gratuita',
    note: '7 días gratis · 144€/año · Cancela cuando quieras',
    formTitle: 'Plan Anual — 12€/mes',
    formSub: 'Facturado como 144€/año · 7 días gratis',
  },
  monthly: {
    label: 'Plan Mensual',
    badge: 'Popular',
    featured: false,
    amount: '17€',
    period: '/mes',
    billing: 'Facturado mensualmente',
    save: null,
    btnText: 'Empezar prueba gratuita',
    note: '7 días gratis · Sin permanencia · Cancela cuando quieras',
    formTitle: 'Plan Mensual — 17€/mes',
    formSub: 'Facturado mensualmente · 7 días gratis',
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
      <p className="plans-subtitle">Sin tarjeta de crédito. Cancela cuando quieras.</p>
      <div className="plans-grid">
        {Object.entries(PLANS).map(([key, plan]) => (
          <div key={key} className={`plan-card${plan.featured ? ' plan-card-featured' : ''}`}>
            <span className={`plan-badge${plan.featured ? '' : ' plan-badge-popular'}`}>{plan.badge}</span>
            <p className="plan-name">{plan.label}</p>
            <div className="plan-price">
              <span className="plan-amount">{plan.amount}</span>
              <span className="plan-period">{plan.period}</span>
            </div>
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
  const { user, isSubscribed, token, refreshSubscription } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', password: '', password_confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successEmail, setSuccessEmail] = useState(null)
  const [activating, setActivating] = useState(false)
  const formRef = useRef(null)

  function selectPlan(plan) {
    setSelectedPlan(plan)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  async function handleActivate() {
    setActivating(true)
    try {
      const res = await fetch('/api/suscripcion/activar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      const data = await res.json()
      if (data.success) {
        await refreshSubscription()
      } else {
        alert(data.message || 'Error al activar la suscripción')
        setActivating(false)
      }
    } catch {
      alert('No se pudo conectar con el servidor')
      setActivating(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return }
    if (form.password !== form.password_confirm) { setError('Las contraseñas no coinciden'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono || null,
          password: form.password,
          plan: selectedPlan,
        })
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Error al crear la cuenta')
        setLoading(false)
        return
      }
      if (data.pending) {
        setSuccessEmail(form.email)
      }
    } catch {
      setError('No se pudo conectar con el servidor')
      setLoading(false)
    }
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

  if (user && !isSubscribed) {
    return (
      <>
        <PageHeader />
        <PlanCards onSelect={selectPlan} />
        {selectedPlan && (
          <section ref={formRef} className="pricing-form-section">
            <div className="pricing-form-header">
              <p className="hero-eyebrow">{PLANS[selectedPlan].label}</p>
              <h2>Activa tu <em>suscripción</em></h2>
              <p>{PLANS[selectedPlan].formSub}</p>
            </div>
            <div className="pricing-form-card">
              <div className="already-sub">
                <p>Hola, <strong>{user.nombre.split(' ')[0]}</strong>. Activa por <strong>{PLANS[selectedPlan].amount}{PLANS[selectedPlan].period}</strong>.</p>
                <button className="btn" style={{ marginTop: '1rem', width: '100%' }} onClick={handleActivate} disabled={activating}>
                  {activating ? 'Activando…' : 'Activar suscripción'}
                </button>
                <p className="pricing-note" style={{ marginTop: '0.75rem' }}>Sin compromiso · Cancela cuando quieras</p>
              </div>
            </div>
            <button className="btn-change-plan" onClick={() => setSelectedPlan(null)}>← Cambiar plan</button>
          </section>
        )}
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
          <span>Estamos preparando el Aula Online. Cuando las clases estén listas, podrás activar tu plan aquí.</span>
        </div>
      </div>

      <PageHeader />
      <PlanCards onSelect={selectPlan} />

      {selectedPlan && (
        <section ref={formRef} className="pricing-form-section">
          <div className="pricing-form-header">
            <p className="hero-eyebrow">{PLANS[selectedPlan].label}</p>
            <h2>Empieza tu prueba <em>gratuita</em></h2>
            <p>{PLANS[selectedPlan].formSub}</p>
          </div>
          <div className="pricing-form-card">
            {successEmail ? (
              <div className="subscribe-success">
                <div className="success-icon" style={{ fontSize: '1.6rem' }}>📧</div>
                <h3>Revisa tu email</h3>
                <p>Hemos enviado un enlace de confirmación a <strong>{successEmail}</strong>.</p>
                <p style={{ fontSize: '0.85rem' }}>Haz clic en el enlace para activar tu cuenta y completar la suscripción.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="form-section-label">Datos personales</p>
                <input type="text" placeholder="Nombre completo" required autoComplete="name" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
                <input type="email" placeholder="Email" required autoComplete="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                <input type="tel" placeholder="Teléfono (opcional)" autoComplete="tel" value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} />

                <p className="form-section-label" style={{ marginTop: '0.5rem' }}>Acceso a tu cuenta</p>
                <PwInput value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} show={showPw} setShow={setShowPw} placeholder="Crea una contraseña (mín. 8 caracteres)" autoComplete="new-password" />
                <PwInput value={form.password_confirm} onChange={v => setForm(f => ({ ...f, password_confirm: v }))} show={showPw2} setShow={setShowPw2} placeholder="Confirma tu contraseña" autoComplete="new-password" />

                <p className="form-section-label" style={{ marginTop: '0.5rem' }}>Pago</p>
                <div className="payment-placeholder">
                  <span className="payment-placeholder-icon">💳</span>
                  <p>Pasarela de pago segura<br /><small>Integración con Stripe próximamente</small></p>
                </div>

                <div className="check-group">
                  <label className="check-label">
                    <input type="checkbox" required />
                    <span>Acepto los <a href="#" className="link-legal">Términos y condiciones</a></span>
                  </label>
                  <label className="check-label">
                    <input type="checkbox" required />
                    <span>He leído la <a href="#" className="link-legal">Política de privacidad</a></span>
                  </label>
                </div>

                <p style={{ color: '#b04040', fontSize: '0.85rem', minHeight: '1.2em', textAlign: 'center' }}>{error}</p>
                <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Procesando…' : `7 días gratis · Luego ${PLANS[selectedPlan].amount}${PLANS[selectedPlan].period}`}
                </button>
                <p className="pricing-note">7 días de prueba gratuita · Sin permanencia · Cancela cuando quieras</p>
              </form>
            )}
          </div>
          <button className="btn-change-plan" onClick={() => { setSelectedPlan(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            ← Cambiar plan
          </button>
        </section>
      )}

      <FaqAccordion />

      <div className="cta-final-banner">
        <h2>Empieza hoy.<br /><em>7 días gratis.</em></h2>
        <p>Sin tarjeta de crédito requerida. Sin permanencia. Solo yoga.</p>
        <a href="#top" className="btn" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          Comenzar prueba gratuita
        </a>
      </div>
    </>
  )
}
