import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function EyeIcon({ open }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {open ? (
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
  )
}

export default function LoginModal({ isOpen, onClose }) {
  const { saveAuth, refreshSubscription } = useAuth()
  const [view, setView] = useState('login') // 'login' | 'forgot' | 'sent'

  // login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // forgot
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')

  function handleClose() {
    onClose()
    setTimeout(() => {
      setView('login')
      setEmail(''); setPassword(''); setLoginError('')
      setForgotEmail(''); setForgotError('')
    }, 200)
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.success) {
        saveAuth(data.data.token, { ...data.data.user, subscribed: false })
        await refreshSubscription()
        handleClose()
      } else {
        setLoginError(data.message || 'Error al iniciar sesión')
      }
    } catch {
      setLoginError('No se pudo conectar con el servidor')
    }
    setLoginLoading(false)
  }

  async function handleForgot(e) {
    e.preventDefault()
    setForgotLoading(true)
    setForgotError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      })
      const data = await res.json()
      if (data.success) {
        setView('sent')
      } else {
        setForgotError(data.message || 'Error al enviar el email')
      }
    } catch {
      setForgotError('No se pudo conectar con el servidor')
    }
    setForgotLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) handleClose() }}>
      <div className="modal-content modal-auth">
        <button className="modal-close" onClick={handleClose}>&times;</button>

        {view === 'login' && (
          <>
            <h3>Iniciar sesión</h3>
            <form onSubmit={handleLogin}>
              <input
                type="email" placeholder="Tu email" value={email}
                onChange={e => setEmail(e.target.value)} required autoComplete="email"
              />
              <div className="input-pw-wrap">
                <input
                  type={showPw ? 'text' : 'password'} placeholder="Tu contraseña"
                  value={password} onChange={e => setPassword(e.target.value)}
                  required autoComplete="current-password"
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)} aria-label="Mostrar contraseña">
                  <EyeIcon open={showPw} />
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: '-0.4rem' }}>
                <button type="button" className="forgot-link" onClick={() => { setForgotEmail(email); setView('forgot') }}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <p style={{ color: '#b04040', fontSize: '0.85rem', minHeight: '1.2em' }}>{loginError}</p>
              <button type="submit" className="btn" style={{ width: '100%' }} disabled={loginLoading}>
                {loginLoading ? 'Entrando…' : 'Entrar'}
              </button>
            </form>
            <p className="auth-modal-foot">
              ¿Aún no tienes cuenta? <Link to="/suscripcion" onClick={handleClose}>Suscribirme →</Link>
            </p>
          </>
        )}

        {view === 'forgot' && (
          <>
            <h3>Recuperar contraseña</h3>
            <p className="forgot-desc">Introduce tu email y te enviaremos un enlace para crear una nueva contraseña.</p>
            <form onSubmit={handleForgot}>
              <input
                type="email" placeholder="Tu email" value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)} required autoComplete="email"
              />
              <p style={{ color: '#b04040', fontSize: '0.85rem', minHeight: '1.2em' }}>{forgotError}</p>
              <button type="submit" className="btn" style={{ width: '100%' }} disabled={forgotLoading}>
                {forgotLoading ? 'Enviando…' : 'Enviar enlace'}
              </button>
            </form>
            <p className="auth-modal-foot">
              <button type="button" className="forgot-link" onClick={() => setView('login')}>← Volver al inicio de sesión</button>
            </p>
          </>
        )}

        {view === 'sent' && (
          <>
            <div className="forgot-sent-icon">✉️</div>
            <h3>Revisa tu email</h3>
            <p className="forgot-desc">
              Si existe una cuenta con <strong>{forgotEmail}</strong>, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
            </p>
            <p className="forgot-desc" style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              Revisa también la carpeta de spam.
            </p>
            <button className="btn" style={{ width: '100%', marginTop: '1rem' }} onClick={handleClose}>
              Cerrar
            </button>
          </>
        )}
      </div>
    </div>
  )
}
