import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PANELES = [
  { id: 'pedidos',      label: 'Pedidos' },
  { id: 'direccion',    label: 'Dirección' },
  { id: 'metodos-pago', label: 'Métodos de pago' },
  { id: 'detalles',     label: 'Detalles de la cuenta' },
]

const ESTADOS = {
  activa:    { label: 'Activa',    cls: 'pedido-estado-activa' },
  cancelada: { label: 'Cancelada', cls: 'pedido-estado-cancelada' },
  expirada:  { label: 'Expirada',  cls: 'pedido-estado-expirada' },
}

const TIPOS_TARJETA = [
  { value: 'visa',       label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'amex',       label: 'American Express' },
  { value: 'otro',       label: 'Otro' },
]

export default function MiCuentaPage({ onOpenLogin }) {
  const { user, token, updateUser, logout } = useAuth()
  const [panel, setPanel] = useState('pedidos')

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

  return (
    <main className="cuenta-main">
      <div className="cuenta-layout">
        <aside className="cuenta-sidebar">
          <div className="cuenta-user-info">
            <span className="cuenta-user-avatar">{(user.nombre || '?')[0].toUpperCase()}</span>
            <div>
              <p className="cuenta-user-nombre">{user.nombre}{user.apellidos ? ' ' + user.apellidos : ''}</p>
              <p className="cuenta-user-email">{user.email}</p>
            </div>
          </div>
          <nav className="cuenta-nav">
            {PANELES.map(({ id, label }) => (
              <a key={id} href={`#${id}`}
                className={`cuenta-nav-item${panel === id ? ' cuenta-nav-active' : ''}`}
                onClick={e => { e.preventDefault(); setPanel(id) }}>
                {label}
              </a>
            ))}
            <button className="cuenta-nav-item cuenta-nav-salir" onClick={logout}>Cerrar sesión</button>
          </nav>
        </aside>

        <section className="cuenta-panel">
          {panel === 'pedidos'      && <PanelPedidos token={token} />}
          {panel === 'direccion'    && <PanelDireccion token={token} user={user} />}
          {panel === 'metodos-pago' && <PanelMetodosPago token={token} />}
          {panel === 'detalles'     && <PanelDetalles token={token} user={user} updateUser={updateUser} />}
        </section>
      </div>
    </main>
  )
}

// ── Panel Pedidos ────────────────────────────────────────────────────────────
function PanelPedidos({ token }) {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cuenta/pedidos', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setPedidos(d.data) })
      .finally(() => setLoading(false))
  }, [token])

  function handleDescargar(id) {
    const a = document.createElement('a')
    a.href = `/api/cuenta/pedidos/${id}/factura`
    a.setAttribute('download', '')
    // token en header no es posible con <a>, usamos fetch + blob
    fetch(`/api/cuenta/pedidos/${id}/factura`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `factura-${id}.pdf`
        link.click()
        URL.revokeObjectURL(url)
      })
  }

  return (
    <div className="cuenta-panel-content active">
      <h2>Pedidos</h2>
      {loading && <p className="cuenta-empty">Cargando…</p>}
      {!loading && pedidos.length === 0 && (
        <p className="cuenta-empty">Todavía no has realizado ningún pedido.</p>
      )}
      {!loading && pedidos.length > 0 && (
        <div className="pedidos-lista">
          {pedidos.map(p => {
            const estado = ESTADOS[p.estado] || { label: p.estado, cls: '' }
            return (
              <div className="pedido-card" key={p.id}>
                <div className="pedido-card-info">
                  <p className="pedido-titulo">Suscripción mensual</p>
                  <p className="pedido-fecha">
                    {fmtDate(p.fecha_inicio)} — {fmtDate(p.fecha_fin)}
                  </p>
                  <span className={`pedido-estado ${estado.cls}`}>{estado.label}</span>
                </div>
                <div className="pedido-card-right">
                  <p className="pedido-importe">{Number(p.importe).toFixed(2)} €</p>
                  <button className="btn-factura" onClick={() => handleDescargar(p.id)}>
                    Descargar factura
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Panel Dirección ──────────────────────────────────────────────────────────
function PanelDireccion({ token, user }) {
  const [form, setForm] = useState({ nombre: '', apellidos: '', nif: '', calle: '', ciudad: '', provincia: '', cp: '', pais: 'España' })
  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetch('/api/cuenta/direccion', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setForm(f => ({ ...f, ...d.data }))
        } else {
          setForm(f => ({ ...f, nombre: user.nombre || '', apellidos: user.apellidos || '' }))
        }
      })
  }, [token])

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  const tieneFacturaCompleta = form.nif && form.calle && form.ciudad

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/cuenta/direccion', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (data.success) { setStatus('saved'); setTimeout(() => setStatus(null), 2500) }
    else { alert(data.message || 'Error al guardar'); setStatus(null) }
  }

  return (
    <div className="cuenta-panel-content active">
      <h2>Dirección</h2>
      <p className="cuenta-panel-desc">
        Esta dirección se usará en tus facturas.{' '}
        {tieneFacturaCompleta
          ? <span className="factura-tipo factura-completa">Factura completa activada ✓</span>
          : <span className="factura-tipo factura-simple">Añade NIF + dirección para factura completa</span>
        }
      </p>
      <form className="cuenta-form" onSubmit={handleSubmit}>
        <div className="cuenta-form-2col">
          <Field label="Nombre" value={form.nombre} onChange={v => set('nombre', v)} />
          <Field label="Apellidos" value={form.apellidos} onChange={v => set('apellidos', v)} />
        </div>
        <Field label="NIF / CIF" value={form.nif} onChange={v => set('nif', v)} placeholder="12345678A" />
        <Field label="Calle y número" value={form.calle} onChange={v => set('calle', v)} />
        <div className="cuenta-form-2col">
          <Field label="Código postal" value={form.cp} onChange={v => set('cp', v)} />
          <Field label="Ciudad" value={form.ciudad} onChange={v => set('ciudad', v)} />
        </div>
        <div className="cuenta-form-2col">
          <Field label="Provincia" value={form.provincia} onChange={v => set('provincia', v)} />
          <Field label="País" value={form.pais} onChange={v => set('pais', v)} />
        </div>
        <button type="submit" className="btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Guardando…' : status === 'saved' ? 'Guardado ✓' : 'Guardar dirección'}
        </button>
      </form>
    </div>
  )
}

// ── Panel Métodos de pago ────────────────────────────────────────────────────
function PanelMetodosPago({ token }) {
  const [tarjetas, setTarjetas] = useState([])
  const [form, setForm] = useState({ tipo: 'visa', ultimos_cuatro: '', mes_expiry: '', anio_expiry: '' })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    fetch('/api/cuenta/metodos-pago', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setTarjetas(d.data) })
  }, [token])

  useEffect(() => { load() }, [load])

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/cuenta/metodos-pago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, mes_expiry: Number(form.mes_expiry), anio_expiry: Number(form.anio_expiry) })
    })
    const data = await res.json()
    if (data.success) {
      setForm({ tipo: 'visa', ultimos_cuatro: '', mes_expiry: '', anio_expiry: '' })
      setShowForm(false)
      load()
    } else {
      alert(data.message || 'Error al añadir tarjeta')
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar esta tarjeta?')) return
    await fetch(`/api/cuenta/metodos-pago/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    load()
  }

  async function handlePredeterminado(id) {
    await fetch(`/api/cuenta/metodos-pago/${id}/predeterminado`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    })
    load()
  }

  return (
    <div className="cuenta-panel-content active">
      <h2>Métodos de pago</h2>
      {tarjetas.length === 0 && !showForm && (
        <p className="cuenta-empty" style={{ marginBottom: '1.5rem' }}>No tienes ninguna tarjeta guardada.</p>
      )}
      {tarjetas.length > 0 && (
        <div className="tarjetas-lista">
          {tarjetas.map(t => (
            <div className="tarjeta-card" key={t.id}>
              <div className="tarjeta-icono">{iconoTipo(t.tipo)}</div>
              <div className="tarjeta-info">
                <p className="tarjeta-numero">•••• •••• •••• {t.ultimos_cuatro}</p>
                <p className="tarjeta-expiry">Caduca {String(t.mes_expiry).padStart(2,'0')}/{t.anio_expiry}</p>
                {t.predeterminado ? (
                  <span className="tarjeta-badge">Predeterminada</span>
                ) : (
                  <button className="tarjeta-link" onClick={() => handlePredeterminado(t.id)}>
                    Establecer como predeterminada
                  </button>
                )}
              </div>
              <button className="tarjeta-eliminar" onClick={() => handleDelete(t.id)} title="Eliminar tarjeta">✕</button>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <form className="cuenta-form add-tarjeta-form" onSubmit={handleAdd}>
          <h3 className="add-tarjeta-titulo">Nueva tarjeta</h3>
          <div className="cuenta-form-row">
            <label>Tipo de tarjeta</label>
            <select className="cuenta-select" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
              {TIPOS_TARJETA.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="cuenta-form-row">
            <label>Últimos 4 dígitos</label>
            <input
              type="text" maxLength={4} pattern="\d{4}" required placeholder="1234"
              value={form.ultimos_cuatro}
              onChange={e => setForm(f => ({ ...f, ultimos_cuatro: e.target.value.replace(/\D/g, '') }))}
            />
          </div>
          <div className="cuenta-form-2col">
            <div className="cuenta-form-row">
              <label>Mes expiración</label>
              <input type="number" min={1} max={12} required placeholder="MM" value={form.mes_expiry}
                onChange={e => setForm(f => ({ ...f, mes_expiry: e.target.value }))} />
            </div>
            <div className="cuenta-form-row">
              <label>Año expiración</label>
              <input type="number" min={2024} max={2040} required placeholder="AAAA" value={form.anio_expiry}
                onChange={e => setForm(f => ({ ...f, anio_expiry: e.target.value }))} />
            </div>
          </div>
          <div className="add-tarjeta-actions">
            <button type="submit" className="btn" disabled={saving}>{saving ? 'Añadiendo…' : 'Añadir tarjeta'}</button>
            <button type="button" className="btn-link" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      ) : (
        <button className="btn-outline" onClick={() => setShowForm(true)}>+ Añadir tarjeta</button>
      )}
    </div>
  )
}

// ── Panel Detalles de la cuenta ──────────────────────────────────────────────
function PanelDetalles({ token, user, updateUser }) {
  const [nombre, setNombre] = useState(user.nombre || '')
  const [apellidos, setApellidos] = useState(user.apellidos || '')
  const [email, setEmail] = useState(user.email || '')
  const [infoStatus, setInfoStatus] = useState(null)

  const [passActual, setPassActual] = useState('')
  const [passNueva, setPassNueva] = useState('')
  const [passConfirm, setPassConfirm] = useState('')
  const [passStatus, setPassStatus] = useState(null)
  const [passError, setPassError] = useState('')

  async function handleSaveInfo(e) {
    e.preventDefault()
    setInfoStatus('loading')
    const res = await fetch('/api/auth/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nombre, apellidos, email })
    })
    const data = await res.json()
    if (data.success) {
      updateUser({ nombre, apellidos, email })
      setInfoStatus('saved')
      setTimeout(() => setInfoStatus(null), 2500)
    } else {
      alert(data.message || 'Error al guardar')
      setInfoStatus(null)
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setPassError('')
    if (passNueva !== passConfirm) {
      setPassError('Las contraseñas no coinciden')
      return
    }
    setPassStatus('loading')
    const res = await fetch('/api/cuenta/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ passwordActual: passActual, passwordNueva: passNueva })
    })
    const data = await res.json()
    if (data.success) {
      setPassActual(''); setPassNueva(''); setPassConfirm('')
      setPassStatus('saved')
      setTimeout(() => setPassStatus(null), 2500)
    } else {
      setPassError(data.message || 'Error al cambiar contraseña')
      setPassStatus(null)
    }
  }

  return (
    <div className="cuenta-panel-content active">
      <h2>Detalles de la cuenta</h2>

      <form className="cuenta-form" onSubmit={handleSaveInfo}>
        <div className="cuenta-form-2col">
          <Field label="Nombre" value={nombre} onChange={setNombre} required />
          <Field label="Apellidos" value={apellidos} onChange={setApellidos} />
        </div>
        <Field label="Email" type="email" value={email} onChange={setEmail} required />
        <button type="submit" className="btn" disabled={infoStatus === 'loading'}>
          {infoStatus === 'loading' ? 'Guardando…' : infoStatus === 'saved' ? 'Guardado ✓' : 'Guardar cambios'}
        </button>
      </form>

      <div className="cuenta-divider" />

      <h3 className="cuenta-h3">Cambiar contraseña</h3>
      <form className="cuenta-form" onSubmit={handleChangePassword}>
        <Field label="Contraseña actual" type="password" value={passActual} onChange={setPassActual} required autoComplete="current-password" />
        <Field label="Nueva contraseña" type="password" value={passNueva} onChange={setPassNueva} required autoComplete="new-password" />
        <Field label="Confirmar nueva contraseña" type="password" value={passConfirm} onChange={setPassConfirm} required autoComplete="new-password" />
        {passError && <p className="cuenta-form-error">{passError}</p>}
        <button type="submit" className="btn" disabled={passStatus === 'loading'}>
          {passStatus === 'loading' ? 'Actualizando…' : passStatus === 'saved' ? 'Contraseña actualizada ✓' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', required, autoComplete, placeholder }) {
  return (
    <div className="cuenta-form-row">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

function fmtDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

function iconoTipo(tipo) {
  const map = { visa: 'VISA', mastercard: 'MC', amex: 'AMEX', otro: '💳' }
  return map[tipo] || '💳'
}
