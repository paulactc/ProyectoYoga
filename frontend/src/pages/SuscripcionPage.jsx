import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FAQS = [
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí, sin penalizaciones ni periodos de permanencia. Puedes cancelar en cualquier momento desde tu cuenta y no se te cobrará el siguiente mes.'
  },
  {
    q: '¿Qué pasa cuando termina la prueba gratuita?',
    a: 'Al acabar los 7 días de prueba se activa la suscripción de 19€/mes. Te avisaremos antes de que termine el periodo de prueba.'
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

const BENEFICIOS_GRATIS = [
  'Meditaciones guiadas de Tierra en Calma',
  'Audios para dormir y relajarte',
  'Acceso desde cualquier dispositivo',
  'Sin coste, para siempre',
]

const BENEFICIOS_PAGO = [
  'Todo lo del plan gratuito',
  'Acceso ilimitado al Aula Online',
  'Más de 50 clases de yoga en vídeo',
  'Niveles 1, 2 y 3: de principiante a avanzado',
  'Movilidad, pranayama, meditación en movimiento',
  'Nuevas clases cada mes',
  'Cancela cuando quieras, sin compromiso',
]

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
      <p className="hero-eyebrow">Elige tu camino</p>
      <h1>Empieza <em>gratis</em>,<br />crece cuando quieras</h1>
      <p>Tierra en Calma siempre gratuita. El Aula Online, 7 días de prueba.</p>
    </header>
  )
}

// ── Vista para visitantes sin cuenta ──────────────────────────────────────────
function VisitorPlans({ onCheckout, onOpenRegister, loading, error }) {
  return (
    <>
      <section className="plans-section">
        <p className="clases-desc-eyebrow">Elige tu acceso</p>
        <h2 className="plans-title">¿Por dónde <em>empezamos</em>?</h2>
        <p className="plans-subtitle">Puedes empezar gratis y ampliar cuando quieras.</p>
        <div className="plans-grid">

          {/* Tarjeta gratuita */}
          <div className="plan-card">
            <span className="plan-badge plan-badge-popular">Gratis</span>
            <p className="plan-name">Tierra en Calma</p>
            <div className="plan-price">
              <span className="plan-amount">0</span>
              <span className="plan-precio-sym">€</span>
            </div>
            <p className="plan-billing">Para siempre gratuito</p>
            <div className="plan-divider" />
            <ul className="plan-features">
              {BENEFICIOS_GRATIS.map(b => <li key={b}>{b}</li>)}
            </ul>
            <button
              className="btn btn-outline"
              style={{ width: '100%' }}
              onClick={onOpenRegister}
            >
              Crear cuenta gratuita
            </button>
            <p className="plan-note">Solo tu email. Sin tarjeta.</p>
          </div>

          {/* Tarjeta de pago */}
          <div className="plan-card plan-card-featured">
            <span className="plan-badge">Aula Online · 7 días gratis</span>
            <p className="plan-name">Plan Mensual</p>
            <div className="plan-price">
              <span className="plan-amount">19</span>
              <span className="plan-precio-sym">€</span>
              <span className="plan-period">/mes</span>
            </div>
            <p className="plan-billing">Facturado mensualmente · 7 días gratis al empezar</p>
            <div className="plan-divider" />
            <ul className="plan-features">
              {BENEFICIOS_PAGO.map(b => <li key={b}>{b}</li>)}
            </ul>
            <button
              className="btn"
              style={{ width: '100%' }}
              onClick={onCheckout}
              disabled={loading}
            >
              {loading ? 'Redirigiendo…' : 'Empezar 7 días gratis'}
            </button>
            <p className="plan-note">Pagarás 19€/mes tras los 7 días. Cancela antes y no se te cobra nada.</p>
          </div>

        </div>
        {error && <p className="plans-error">{error}</p>}
      </section>
    </>
  )
}

// ── Vista para usuaria con cuenta gratuita (sin suscripción) ──────────────────
function FreeUserUpgrade({ user, onCheckout, loading, error }) {
  return (
    <section className="plans-section">
      <div className="free-user-banner">
        <span className="free-user-check">✓</span>
        <div>
          <strong>Hola, {user.nombre.split(' ')[0]}</strong>
          <span>Ya tienes acceso gratuito a <Link to="/audios">Tierra en Calma</Link></span>
        </div>
      </div>

      <p className="clases-desc-eyebrow" style={{ marginTop: '2.5rem' }}>Cuando estés lista</p>
      <h2 className="plans-title">Accede al <em>Aula Online</em></h2>
      <p className="plans-subtitle">50 clases de yoga en vídeo. 7 días gratis para probar.</p>

      <div className="plans-grid plans-grid-single">
        <div className="plan-card plan-card-featured">
          <span className="plan-badge">Aula Online · 7 días gratis</span>
          <p className="plan-name">Plan Mensual</p>
          <div className="plan-price">
            <span className="plan-amount">19</span>
            <span className="plan-precio-sym">€</span>
            <span className="plan-period">/mes</span>
          </div>
          <p className="plan-billing">Facturado mensualmente · 7 días gratis al empezar</p>
          <div className="plan-divider" />
          <ul className="plan-features">
            {BENEFICIOS_PAGO.map(b => <li key={b}>{b}</li>)}
          </ul>
          <button
            className="btn"
            style={{ width: '100%' }}
            onClick={onCheckout}
            disabled={loading}
          >
            {loading ? 'Redirigiendo…' : 'Activar 7 días gratis'}
          </button>
          <p className="plan-note">Pagarás 19€/mes tras los 7 días. Cancela antes y no se te cobra nada.</p>
        </div>
      </div>
      {error && <p className="plans-error">{error}</p>}
    </section>
  )
}

// ── Vista de éxito post-Stripe ────────────────────────────────────────────────
function SuccessPanel({ user, refreshing }) {
  return (
    <section style={{ textAlign: 'center', padding: '3rem 2rem 4rem' }}>
      <div className="success-icon" style={{ margin: '0 auto 1.25rem', fontSize: '2rem' }}>✓</div>
      <h2 style={{ marginBottom: '0.75rem' }}>
        ¡Bienvenida{user?.nombre ? `, ${user.nombre.split(' ')[0]}` : ''}!
      </h2>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
        Tu suscripción está activa. Tienes 7 días de prueba gratuita para explorar todo el Aula Online.
      </p>
      <Link to="/aula-online" className="btn">Ir al Aula Online →</Link>
      {refreshing && (
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '1rem' }}>
          Verificando suscripción…
        </p>
      )}
    </section>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function SuscripcionPage({ onOpenLogin, onOpenRegister }) {
  const { user, token, isSubscribed, refreshSubscription } = useAuth()
  const [searchParams] = useSearchParams()
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const comingFromStripe = searchParams.get('exito') === '1'

  useEffect(() => {
    if (!comingFromStripe) return
    setRefreshing(true)
    let attempts = 0
    const poll = async () => {
      await refreshSubscription()
      attempts++
      if (attempts < 5) setTimeout(poll, 1500)
      else setRefreshing(false)
    }
    poll()
  }, []) // eslint-disable-line

  async function handleCheckout() {
    if (!user) {
      onOpenLogin()
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/suscripcion/checkout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        setError(data.message || 'No se pudo iniciar el pago. Inténtalo de nuevo.')
        setLoading(false)
      }
    } catch {
      setError('No se pudo conectar con el servidor.')
      setLoading(false)
    }
  }

  // Estado 1: ya suscriptora de pago
  if (user && isSubscribed) {
    return (
      <>
        <PageHeader />
        <section style={{ textAlign: 'center', padding: '2rem 2rem 4rem' }}>
          <div className="success-icon" style={{ margin: '0 auto 1.25rem' }}>✓</div>
          <p style={{ color: 'var(--muted)', marginBottom: '1.25rem' }}>
            ¡Hola, <strong>{user.nombre.split(' ')[0]}</strong>! Ya tienes acceso completo a Yoga Tierra Viva.
          </p>
          <Link to="/aula-online" className="btn">Ver mis clases →</Link>
        </section>
        <FaqAccordion />
      </>
    )
  }

  // Estado 2: viene de Stripe con éxito
  if (comingFromStripe) {
    return (
      <>
        <PageHeader />
        <SuccessPanel user={user} refreshing={refreshing} />
        <FaqAccordion />
      </>
    )
  }

  // Estado 3: logada pero sin suscripción de pago → mostrar upgrade
  if (user && !isSubscribed) {
    return (
      <>
        <PageHeader />
        <FreeUserUpgrade
          user={user}
          onCheckout={handleCheckout}
          loading={loading}
          error={error}
        />
        <FaqAccordion />
        <div className="cta-final-banner">
          <h2>7 días gratis.<br /><em>Sin compromiso.</em></h2>
          <p>Cancela cuando quieras. Sin permanencia.</p>
          <button className="btn" onClick={handleCheckout} disabled={loading}>
            {loading ? 'Redirigiendo…' : 'Probar el Aula Online'}
          </button>
        </div>
      </>
    )
  }

  // Estado 4: visitante sin cuenta → dos tarjetas
  return (
    <>
      <PageHeader />
      <VisitorPlans
        onCheckout={handleCheckout}
        onOpenRegister={onOpenRegister}
        loading={loading}
        error={error}
      />
      <FaqAccordion />
      <div className="cta-final-banner">
        <h2>Empieza hoy.<br /><em>Es gratis.</em></h2>
        <p>Crea tu cuenta y accede a Tierra en Calma sin coste.</p>
        <button className="btn" onClick={onOpenRegister}>Crear cuenta gratuita</button>
      </div>
    </>
  )
}
