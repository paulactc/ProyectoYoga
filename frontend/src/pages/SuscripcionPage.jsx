import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// El Pack Raíz está a la venta; la suscripción mensual queda en construcción (ver MonthlyCard)
const PACK_DISPONIBLE = true
const PACK_PRECIO = 15

const FAQS = [
  {
    q: '¿El Pack Raíz caduca?',
    a: 'No. Es un pago único y el acceso a esas 10 clases es tuyo para siempre, sin renovaciones ni suscripción.'
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

const BENEFICIOS_PACK = [
  'Todo lo del plan gratuito',
  '10 clases completas de yoga en vídeo',
  'Movilidad Funcional (5 clases)',
  'Respiración Consciente (5 clases)',
  'Acceso para siempre, un único pago',
  'Sin renovación, sin suscripción',
]

const BENEFICIOS_PAGO = [
  'Todo lo del Pack Raíz',
  'Acceso ilimitado al Aula Online',
  'Todas las clases nuevas cada mes',
  'Niveles 1, 2 y 3: de principiante a avanzado',
  'La Travesía: el camino completo de 50 etapas',
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
      <p>Tierra en Calma siempre gratuita. El Pack Raíz, un único pago de {PACK_PRECIO}€.</p>
    </header>
  )
}

// ── Tarjeta gratuita ───────────────────────────────────────────────────────
function FreeCard({ onOpenRegister }) {
  return (
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
      <button className="btn btn-outline" style={{ width: '100%' }} onClick={onOpenRegister}>
        Crear cuenta gratuita
      </button>
      <p className="plan-note">Solo tu email. Sin tarjeta.</p>
    </div>
  )
}

// ── Tarjeta del Pack Raíz (pago único) ─────────────────────────────────────
function PackCard({ onBuy, loading, error, owned }) {
  return (
    <div className="plan-card plan-card-featured">
      <span className="plan-badge">Pack Raíz</span>
      <p className="plan-name">10 Clases</p>
      <div className="plan-price">
        <span className="plan-amount">{PACK_PRECIO}</span>
        <span className="plan-precio-sym">€</span>
      </div>
      <p className="plan-billing">Pago único · acceso para siempre</p>
      <div className="plan-divider" />
      <ul className="plan-features">
        {BENEFICIOS_PACK.map(b => <li key={b}>{b}</li>)}
      </ul>
      {owned ? (
        <p className="plan-note" style={{ textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: 'var(--tierra)' }}>
          ✓ Ya tienes este pack
        </p>
      ) : PACK_DISPONIBLE ? (
        <button className="btn" style={{ width: '100%' }} onClick={onBuy} disabled={loading}>
          {loading ? 'Redirigiendo…' : 'Comprar pack'}
        </button>
      ) : (
        <p className="plan-proximamente">Disponible muy pronto</p>
      )}
      <p className="plan-note">{PACK_PRECIO}€ pago único · 1,50€/clase</p>
      {error && <p className="plans-error">{error}</p>}
    </div>
  )
}

// ── Tarjeta de suscripción mensual (en construcción) ───────────────────────
function MonthlyCard() {
  return (
    <div className="plan-card">
      <span className="plan-badge plan-badge-popular">En construcción</span>
      <p className="plan-name">Plan Mensual</p>
      <div className="plan-price">
        <span className="plan-amount">19</span>
        <span className="plan-precio-sym">€</span>
        <span className="plan-period">/mes</span>
      </div>
      <p className="plan-billing">Próximamente</p>
      <div className="plan-divider" />
      <ul className="plan-features">
        {BENEFICIOS_PAGO.map(b => <li key={b}>{b}</li>)}
      </ul>
      <p className="plan-proximamente">Disponible cuando el Aula tenga más clases</p>
    </div>
  )
}

// ── Vista para visitantes sin cuenta ──────────────────────────────────────────
function VisitorPlans({ onBuyPack, onOpenRegister, loading, error }) {
  return (
    <section className="plans-section">
      <p className="clases-desc-eyebrow">Elige tu acceso</p>
      <h2 className="plans-title">¿Por dónde <em>empezamos</em>?</h2>
      <p className="plans-subtitle">Puedes empezar gratis y ampliar cuando quieras.</p>
      <div className="plans-grid plans-grid-3">
        <FreeCard onOpenRegister={onOpenRegister} />
        <PackCard onBuy={onBuyPack} loading={loading} error={error} owned={false} />
        <MonthlyCard />
      </div>
    </section>
  )
}

// ── Vista para usuaria con cuenta (sin suscripción) ────────────────────────
function FreeUserUpgrade({ user, ownsPack, onBuyPack, loading, error }) {
  return (
    <section className="plans-section">
      <div className="free-user-banner">
        <span className="free-user-check">✓</span>
        <div>
          <strong>Hola, {user.nombre.split(' ')[0]}</strong>
          <span>Ya tienes acceso gratuito a <Link to="/audios">Tierra en Calma</Link></span>
        </div>
      </div>

      <p className="clases-desc-eyebrow" style={{ marginTop: '2.5rem' }}>
        {ownsPack ? 'Tu acceso' : 'Cuando estés lista'}
      </p>
      <h2 className="plans-title">
        {ownsPack ? <>Tu <em>Pack Raíz</em></> : <>Consigue el <em>Pack Raíz</em></>}
      </h2>
      <p className="plans-subtitle">10 clases de yoga en vídeo, tuyas para siempre.</p>
      <div className="plans-grid">
        <PackCard onBuy={onBuyPack} loading={loading} error={error} owned={ownsPack} />
        <MonthlyCard />
      </div>
      {ownsPack && (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/aula-online" className="btn">Ir a mis clases →</Link>
        </p>
      )}
    </section>
  )
}

// ── Vista de éxito post-Stripe (suscripción) ──────────────────────────────
function SuccessPanel({ user, refreshing }) {
  return (
    <section style={{ textAlign: 'center', padding: '3rem 2rem 4rem' }}>
      <div className="success-icon" style={{ margin: '0 auto 1.25rem', fontSize: '2rem' }}>✓</div>
      <h2 style={{ marginBottom: '0.75rem' }}>
        ¡Bienvenida{user?.nombre ? `, ${user.nombre.split(' ')[0]}` : ''}!
      </h2>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
        Tu suscripción está activa. Explora todo el Aula Online.
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

// ── Vista de éxito post-Stripe (pack) ──────────────────────────────────────
function PackSuccessPanel({ user, refreshing }) {
  return (
    <section style={{ textAlign: 'center', padding: '3rem 2rem 4rem' }}>
      <div className="success-icon" style={{ margin: '0 auto 1.25rem', fontSize: '2rem' }}>✓</div>
      <h2 style={{ marginBottom: '0.75rem' }}>
        ¡Bienvenida{user?.nombre ? `, ${user.nombre.split(' ')[0]}` : ''}!
      </h2>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
        Tu Pack Raíz está activo. Ya tienes acceso para siempre a las 10 clases.
      </p>
      <Link to="/aula-online" className="btn">Ir a mis clases →</Link>
      {refreshing && (
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '1rem' }}>
          Verificando compra…
        </p>
      )}
    </section>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function SuscripcionPage({ onOpenLogin, onOpenRegister }) {
  const { user, token, isSubscribed, ownsPack, refreshSubscription, refreshPack } = useAuth()
  const [searchParams] = useSearchParams()
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const comingFromStripe     = searchParams.get('exito') === '1'
  const comingFromPackStripe = searchParams.get('pack_exito') === '1'

  useEffect(() => {
    if (!comingFromStripe && !comingFromPackStripe) return
    setRefreshing(true)
    let attempts = 0
    const poll = async () => {
      if (comingFromPackStripe) await refreshPack()
      else await refreshSubscription()
      attempts++
      if (attempts < 5) setTimeout(poll, 1500)
      else setRefreshing(false)
    }
    poll()
  }, []) // eslint-disable-line

  async function handleBuyPack() {
    if (!user) {
      onOpenLogin()
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/pack/checkout', {
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

  // Estado 2: viene de Stripe con éxito (suscripción)
  if (comingFromStripe) {
    return (
      <>
        <PageHeader />
        <SuccessPanel user={user} refreshing={refreshing} />
        <FaqAccordion />
      </>
    )
  }

  // Estado 3: viene de Stripe con éxito (pack)
  if (comingFromPackStripe) {
    return (
      <>
        <PageHeader />
        <PackSuccessPanel user={user} refreshing={refreshing} />
        <FaqAccordion />
      </>
    )
  }

  // Estado 4: logada (con o sin pack) pero sin suscripción → mostrar Pack Raíz
  if (user && !isSubscribed) {
    return (
      <>
        <PageHeader />
        <FreeUserUpgrade
          user={user}
          ownsPack={ownsPack}
          onBuyPack={handleBuyPack}
          loading={loading}
          error={error}
        />
        <FaqAccordion />
        {!ownsPack && (
          <div className="cta-final-banner">
            <h2>Sin compromiso.</h2>
            <p>Pago único, acceso para siempre.</p>
            <button className="btn" onClick={handleBuyPack} disabled={loading}>
              {loading ? 'Redirigiendo…' : 'Comprar el Pack Raíz'}
            </button>
          </div>
        )}
      </>
    )
  }

  // Estado 5: visitante sin cuenta → tres tarjetas
  return (
    <>
      <PageHeader />
      <VisitorPlans
        onBuyPack={handleBuyPack}
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
