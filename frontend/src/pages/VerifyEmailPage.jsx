import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const { saveAuth } = useAuth()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) { setStatus('invalid'); return }

    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          saveAuth(data.data.token, { ...data.data.user, subscribed: false })
          setStatus('success')
        } else {
          setMessage(data.message || 'El enlace ya no es válido. Vuelve a registrarte.')
          setStatus('expired')
        }
      })
      .catch(() => setStatus('error'))
  }, [])

  const wrapStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6rem 2rem 4rem',
  }

  const boxStyle = {
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
  }

  const h1Style = {
    fontFamily: 'var(--font-heading)',
    fontSize: '2rem',
    fontWeight: 400,
    marginBottom: '0.75rem',
  }

  return (
    <main style={wrapStyle}>
      <div style={boxStyle}>
        {status === 'loading' && (
          <>
            <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌿</p>
            <h1 style={h1Style}>Verificando tu cuenta…</h1>
            <p style={{ color: 'var(--muted)' }}>Un momento, por favor.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="success-icon" style={{ margin: '0 auto 1.5rem' }}>✓</div>
            <h1 style={h1Style}>¡Cuenta confirmada!</h1>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Tu cuenta está lista. ¡Empieza a practicar!</p>
            <Link to="/aula-online" className="btn">Ir al Aula Online →</Link>
          </>
        )}

        {status === 'invalid' && (
          <>
            <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</p>
            <h1 style={h1Style}>Enlace no válido</h1>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>El enlace de verificación no es correcto.</p>
            <Link to="/suscripcion" className="btn">Volver a registrarse</Link>
          </>
        )}

        {(status === 'expired' || status === 'error') && (
          <>
            <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</p>
            <h1 style={h1Style}>{status === 'error' ? 'Error de conexión' : 'Enlace expirado'}</h1>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
              {status === 'error' ? 'No se pudo conectar con el servidor. Inténtalo de nuevo.' : message}
            </p>
            <Link to="/suscripcion" className="btn">Volver a registrarse</Link>
          </>
        )}
      </div>
    </main>
  )
}
