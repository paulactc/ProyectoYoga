import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PANELES = [
  { id: 'escritorio',   label: 'Escritorio' },
  { id: 'pedidos',      label: 'Pedidos' },
  { id: 'suscripciones',label: 'Suscripciones' },
  { id: 'descargas',    label: 'Descargas' },
  { id: 'direccion',    label: 'Dirección' },
  { id: 'metodos-pago', label: 'Métodos de pago' },
  { id: 'detalles',     label: 'Detalles de la cuenta' },
]

export default function MiCuentaPage({ onOpenLogin }) {
  const { user, isSubscribed, token, logout } = useAuth()
  const [panel, setPanel] = useState('escritorio')
  const [detNombre, setDetNombre] = useState('')
  const [detEmail, setDetEmail] = useState('')
  const [saveStatus, setSaveStatus] = useState(null)

  useEffect(() => {
    if (user) {
      setDetNombre(user.nombre)
      setDetEmail(user.email)
    }
  }, [user])

  if (!user) {
    return (
      <main className="cuenta-main">
        <div className="cuenta-login-wrap">
          <p className="hero-eyebrow">Mi cuenta</p>
          <h1>Inicia sesión para continuar</h1>
          <p className="cuenta-login-sub">Accede a tu cuenta para ver tus pedidos, suscripción y detalles.</p>
          <button className="btn" onClick={onOpenLogin}>Iniciar sesión</button>
          <p className="auth-modal-foot" style={{ marginTop: '1.5rem' }}>
            ¿Aún no tienes cuenta? <Link to="/suscripcion">Prueba gratuita →</Link>
          </p>
        </div>
      </main>
    )
  }

  async function handleSaveDetalles(e) {
    e.preventDefault()
    setSaveStatus('loading')
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nombre: detNombre, email: detEmail })
      })
      const data = await res.json()
      if (data.success) {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus(null), 2000)
      } else {
        alert(data.message || 'Error al guardar')
        setSaveStatus(null)
      }
    } catch {
      alert('No se pudo conectar con el servidor')
      setSaveStatus(null)
    }
  }

  return (
    <main className="cuenta-main">
      <div className="cuenta-layout">
        <aside className="cuenta-sidebar">
          <nav className="cuenta-nav">
            {PANELES.map(({ id, label }) => (
              <a key={id} href={`#${id}`}
                className={`cuenta-nav-item${panel === id ? ' cuenta-nav-active' : ''}`}
                onClick={e => { e.preventDefault(); setPanel(id) }}>
                {label}
              </a>
            ))}
            <button className="cuenta-nav-item cuenta-nav-salir" onClick={logout}>Salir</button>
          </nav>
        </aside>

        <section className="cuenta-panel">

          {panel === 'escritorio' && (
            <div className="cuenta-panel-content active">
              <p className="cuenta-saludo">
                Hola <strong>{user.nombre}</strong>{' '}
                <span className="cuenta-saludo-sub">
                  (<a href="#" onClick={e => { e.preventDefault(); logout() }}>
                    ¿no eres {user.nombre.split(' ')[0]}? Cerrar sesión
                  </a>)
                </span>
              </p>
              <p className="cuenta-desc">Desde el escritorio de tu cuenta puedes ver tus pedidos recientes, gestionar tu dirección de facturación y editar tu contraseña y los detalles de tu cuenta.</p>
            </div>
          )}

          {panel === 'pedidos' && (
            <div className="cuenta-panel-content active">
              <h2>Pedidos</h2>
              <p className="cuenta-empty">Todavía no has realizado ningún pedido.</p>
            </div>
          )}

          {panel === 'suscripciones' && (
            <div className="cuenta-panel-content active">
              <h2>Suscripciones</h2>
              <p className="cuenta-empty">
                {isSubscribed
                  ? 'Tu suscripción mensual está activa.'
                  : 'No tienes ninguna suscripción activa. Actívala por 17 €/mes.'}
              </p>
            </div>
          )}

          {panel === 'descargas' && (
            <div className="cuenta-panel-content active">
              <h2>Descargas</h2>
              <p className="cuenta-empty">No hay descargas disponibles.</p>
            </div>
          )}

          {panel === 'direccion' && (
            <div className="cuenta-panel-content active">
              <h2>Dirección</h2>
              <p className="cuenta-empty">Aún no tienes ninguna dirección guardada.</p>
            </div>
          )}

          {panel === 'metodos-pago' && (
            <div className="cuenta-panel-content active">
              <h2>Métodos de pago</h2>
              <p className="cuenta-empty">No tienes ningún método de pago guardado.</p>
            </div>
          )}

          {panel === 'detalles' && (
            <div className="cuenta-panel-content active">
              <h2>Detalles de la cuenta</h2>
              <form className="cuenta-form" onSubmit={handleSaveDetalles}>
                <div className="cuenta-form-row">
                  <label>Nombre</label>
                  <input type="text" autoComplete="name" value={detNombre} onChange={e => setDetNombre(e.target.value)} />
                </div>
                <div className="cuenta-form-row">
                  <label>Email</label>
                  <input type="email" autoComplete="email" value={detEmail} onChange={e => setDetEmail(e.target.value)} />
                </div>
                <button type="submit" className="btn" disabled={saveStatus === 'loading'}>
                  {saveStatus === 'loading' ? 'Guardando…' : saveStatus === 'saved' ? '¡Guardado! ✓' : 'Guardar cambios'}
                </button>
              </form>
            </div>
          )}

        </section>
      </div>
    </main>
  )
}
