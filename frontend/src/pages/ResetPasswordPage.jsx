import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'done' | 'error'
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return }
    setStatus('loading')
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      })
      const data = await res.json()
      if (data.success) {
        setStatus('done')
      } else {
        setError(data.message || 'El enlace no es válido o ha expirado')
        setStatus('error')
      }
    } catch {
      setError('No se pudo conectar con el servidor')
      setStatus('error')
    }
  }

  if (!token) {
    return (
      <main className="reset-main">
        <div className="reset-wrap">
          <p className="hero-eyebrow">Contraseña</p>
          <h1>Enlace no válido</h1>
          <p className="reset-desc">Este enlace no es válido. Solicita uno nuevo desde la pantalla de inicio de sesión.</p>
          <Link to="/" className="btn" style={{ marginTop: '1.5rem' }}>Ir al inicio</Link>
        </div>
      </main>
    )
  }

  if (status === 'done') {
    return (
      <main className="reset-main">
        <div className="reset-wrap">
          <div className="reset-check">✓</div>
          <h1>Contraseña actualizada</h1>
          <p className="reset-desc">Tu contraseña se ha cambiado correctamente. Ya puedes iniciar sesión con tu nueva contraseña.</p>
          <Link to="/" className="btn" style={{ marginTop: '1.5rem' }}>Ir al inicio</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="reset-main">
      <div className="reset-wrap">
        <p className="hero-eyebrow">Contraseña</p>
        <h1>Nueva contraseña</h1>
        <p className="reset-desc">Elige una contraseña segura de al menos 8 caracteres.</p>
        <form className="reset-form" onSubmit={handleSubmit}>
          <div className="cuenta-form-row">
            <label>Nueva contraseña</label>
            <div className="input-pw-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)} aria-label="Mostrar contraseña">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPw ? (
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
          </div>
          <div className="cuenta-form-row">
            <label>Confirmar contraseña</label>
            <input
              type={showPw ? 'text' : 'password'}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required autoComplete="new-password"
              placeholder="Repite la contraseña"
            />
          </div>
          {error && <p className="reset-error">{error}</p>}
          <button type="submit" className="btn" style={{ width: '100%' }} disabled={status === 'loading'}>
            {status === 'loading' ? 'Guardando…' : 'Guardar nueva contraseña'}
          </button>
        </form>
      </div>
    </main>
  )
}
