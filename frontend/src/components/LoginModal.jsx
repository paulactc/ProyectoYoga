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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
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
        onClose()
        setEmail('')
        setPassword('')
      } else {
        setError(data.message || 'Error al iniciar sesión')
      }
    } catch {
      setError('No se pudo conectar con el servidor')
    }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-content modal-auth">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h3>Iniciar sesión</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <div className="input-pw-wrap">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Tu contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)} aria-label="Mostrar contraseña">
              <EyeIcon open={showPw} />
            </button>
          </div>
          <p style={{ color: '#b04040', fontSize: '0.85rem', minHeight: '1.2em', marginTop: '-0.25rem' }}>{error}</p>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '0.25rem' }} disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <p className="auth-modal-foot">
          ¿Aún no tienes cuenta? <Link to="/suscripcion" onClick={onClose}>Suscribirme →</Link>
        </p>
      </div>
    </div>
  )
}
