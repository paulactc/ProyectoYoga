import { useState, useEffect } from 'react'
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
        <EyeIcon open={show} />
      </button>
    </div>
  )
}

export default function LoginModal({ isOpen, onClose, initialView = 'login' }) {
  const { saveAuth, refreshSubscription } = useAuth()
  const [view, setView] = useState(initialView)

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

  // register
  const [regForm, setRegForm] = useState({ nombre: '', email: '', telefono: '', password: '', password_confirm: '' })
  const [showRegPw, setShowRegPw] = useState(false)
  const [showRegPw2, setShowRegPw2] = useState(false)
  const [regError, setRegError] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [regSuccessEmail, setRegSuccessEmail] = useState(null)

  useEffect(() => {
    if (isOpen) setView(initialView)
  }, [isOpen, initialView])

  function handleClose() {
    onClose()
    setTimeout(() => {
      setView('login')
      setEmail(''); setPassword(''); setLoginError('')
      setForgotEmail(''); setForgotError('')
      setRegForm({ nombre: '', email: '', telefono: '', password: '', password_confirm: '' })
      setRegError(''); setRegSuccessEmail(null)
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

  async function handleRegister(e) {
    e.preventDefault()
    setRegError('')
    if (regForm.password.length < 8) { setRegError('La contraseña debe tener al menos 8 caracteres'); return }
    if (regForm.password !== regForm.password_confirm) { setRegError('Las contraseñas no coinciden'); return }
    setRegLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: regForm.nombre,
          email: regForm.email,
          telefono: regForm.telefono || null,
          password: regForm.password,
          plan: null,
        })
      })
      const data = await res.json()
      if (data.success || data.pending) {
        setRegSuccessEmail(regForm.email)
        setView('register-success')
      } else {
        setRegError(data.message || 'Error al crear la cuenta')
      }
    } catch {
      setRegError('No se pudo conectar con el servidor')
    }
    setRegLoading(false)
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
              ¿Aún no tienes cuenta? <button type="button" className="forgot-link" onClick={() => setView('register')}>Crear cuenta gratis →</button>
            </p>
          </>
        )}

        {view === 'register' && (
          <>
            <h3>Crea tu cuenta gratuita</h3>
            <p className="forgot-desc">Accede a <strong>Tierra en Calma</strong> · 100% gratuito, siempre.</p>
            <form onSubmit={handleRegister}>
              <input
                type="text" placeholder="Nombre completo" required autoComplete="name"
                value={regForm.nombre} onChange={e => setRegForm(f => ({ ...f, nombre: e.target.value }))}
              />
              <input
                type="email" placeholder="Email" required autoComplete="email"
                value={regForm.email} onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
              />
              <input
                type="tel" placeholder="Teléfono (opcional)" autoComplete="tel"
                value={regForm.telefono} onChange={e => setRegForm(f => ({ ...f, telefono: e.target.value }))}
              />
              <PwInput
                value={regForm.password}
                onChange={v => setRegForm(f => ({ ...f, password: v }))}
                show={showRegPw} setShow={setShowRegPw}
                placeholder="Crea una contraseña (mín. 8 caracteres)"
                autoComplete="new-password"
              />
              <PwInput
                value={regForm.password_confirm}
                onChange={v => setRegForm(f => ({ ...f, password_confirm: v }))}
                show={showRegPw2} setShow={setShowRegPw2}
                placeholder="Confirma tu contraseña"
                autoComplete="new-password"
              />
              <div className="check-group">
                <label className="check-label">
                  <input type="checkbox" required />
                  <span>Acepto los <Link to="/aviso-legal" onClick={handleClose} className="link-legal">Términos y condiciones</Link></span>
                </label>
                <label className="check-label">
                  <input type="checkbox" required />
                  <span>He leído la <Link to="/politica-privacidad" onClick={handleClose} className="link-legal">Política de privacidad</Link></span>
                </label>
              </div>
              <p style={{ color: '#b04040', fontSize: '0.85rem', minHeight: '1.2em', textAlign: 'center' }}>{regError}</p>
              <button type="submit" className="btn" style={{ width: '100%' }} disabled={regLoading}>
                {regLoading ? 'Creando cuenta…' : 'Crear cuenta gratis'}
              </button>
            </form>
            <p className="auth-modal-foot">
              ¿Ya tienes cuenta? <button type="button" className="forgot-link" onClick={() => setView('login')}>Iniciar sesión →</button>
            </p>
          </>
        )}

        {view === 'register-success' && (
          <>
            <div className="forgot-sent-icon">📧</div>
            <h3>Revisa tu email</h3>
            <p className="forgot-desc">
              Hemos enviado un enlace de confirmación a <strong>{regSuccessEmail}</strong>.
            </p>
            <p className="forgot-desc" style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              Haz clic en el enlace para activar tu cuenta. Revisa también la carpeta de spam.
            </p>
            <button className="btn" style={{ width: '100%', marginTop: '1rem' }} onClick={handleClose}>
              Cerrar
            </button>
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
