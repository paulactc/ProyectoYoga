import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminPage() {
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [accionando, setAccionando] = useState(null)

  const [testimonios, setTestimonios] = useState([])
  const [loadingTestimonios, setLoadingTestimonios] = useState(true)

  useEffect(() => {
    if (!user) return
    if (user.rol !== 'admin') { navigate('/'); return }
  }, [user, navigate])

  const cargarUsuarios = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const r = await fetch('/api/admin/usuarios', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await r.json()
      if (data.success) setUsuarios(data.data)
      else setError('Error al cargar usuarios.')
    } catch {
      setError('Error de red.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (user?.rol === 'admin') cargarUsuarios()
  }, [user, cargarUsuarios])

  const cargarTestimonios = useCallback(async () => {
    setLoadingTestimonios(true)
    try {
      const r = await fetch('/api/admin/opiniones', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await r.json()
      if (data.success) setTestimonios(data.data)
    } catch {
      // silencioso, no es crítico para el resto del panel
    } finally {
      setLoadingTestimonios(false)
    }
  }, [token])

  useEffect(() => {
    if (user?.rol === 'admin') cargarTestimonios()
  }, [user, cargarTestimonios])

  async function aprobarTestimonio(tipo, id) {
    setAccionando(tipo + id + '_aprobar')
    try {
      await fetch(`/api/admin/opiniones/${tipo}/${id}/aprobar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      await cargarTestimonios()
    } finally {
      setAccionando(null)
    }
  }

  async function borrarTestimonio(tipo, id) {
    if (!confirm('¿Eliminar esta opinión?')) return
    setAccionando(tipo + id + '_borrar')
    try {
      await fetch(`/api/admin/opiniones/${tipo}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      await cargarTestimonios()
    } finally {
      setAccionando(null)
    }
  }

  async function activar(userId) {
    setAccionando(userId + '_activar')
    try {
      const r = await fetch(`/api/admin/suscripcion/${userId}/activar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ meses: 12 }),
      })
      const data = await r.json()
      if (data.success) await cargarUsuarios()
      else setError('No se pudo activar.')
    } catch {
      setError('Error de red.')
    } finally {
      setAccionando(null)
    }
  }

  async function cancelar(userId) {
    if (!confirm('¿Cancelar la suscripción de esta usuaria?')) return
    setAccionando(userId + '_cancelar')
    try {
      const r = await fetch(`/api/admin/suscripcion/${userId}/cancelar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await r.json()
      if (data.success) await cargarUsuarios()
      else setError('No se pudo cancelar.')
    } catch {
      setError('Error de red.')
    } finally {
      setAccionando(null)
    }
  }

  if (!user || user.rol !== 'admin') return null

  const pagadas   = usuarios.filter(u => u.sub_estado === 'activa')
  const conPack   = usuarios.filter(u => u.sub_estado !== 'activa' && !!u.pack_slugs)
  const gratuitas = usuarios.filter(u => u.sub_estado !== 'activa' && !u.pack_slugs)

  function formatFecha(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <h1 className="admin-titulo">Panel de administración</h1>
        <p className="admin-subtitulo">Yoga Tierra Viva · Gestión de usuarias</p>

        <div className="admin-stats">
          <div className="admin-stat">
            <span className="admin-stat-num">{usuarios.length}</span>
            <span className="admin-stat-label">Total usuarias</span>
          </div>
          <div className="admin-stat admin-stat--pago">
            <span className="admin-stat-num">{pagadas.length}</span>
            <span className="admin-stat-label">Con suscripción activa</span>
          </div>
          <div className="admin-stat admin-stat--pago">
            <span className="admin-stat-num">{conPack.length}</span>
            <span className="admin-stat-label">Con Pack Raíz</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat-num">{gratuitas.length}</span>
            <span className="admin-stat-label">Cuenta gratuita</span>
          </div>
        </div>

        {error && <p className="admin-error">{error}</p>}

        {loading ? (
          <p className="admin-loading">Cargando...</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Válida hasta</th>
                  <th>Método</th>
                  <th>Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => {
                  const esPago = u.sub_estado === 'activa'
                  const esManual = u.stripe_subscription_id === 'manual_admin'
                  const tienePack = !esPago && !!u.pack_slugs
                  return (
                    <tr key={u.id} className={esPago || tienePack ? 'admin-row--pago' : ''}>
                      <td>{u.nombre}</td>
                      <td className="admin-email">{u.email}</td>
                      <td>
                        {esPago ? (
                          <span className="admin-badge admin-badge--pago">
                            {esManual ? 'Pago (manual)' : 'Pago'}
                          </span>
                        ) : tienePack ? (
                          <span className="admin-badge admin-badge--pago">Pack Raíz</span>
                        ) : (
                          <span className="admin-badge admin-badge--free">Gratuita</span>
                        )}
                      </td>
                      <td>{esPago ? formatFecha(u.sub_fin) : tienePack ? formatFecha(u.pack_created_at) : '—'}</td>
                      <td className="admin-metodo">
                        {esPago
                          ? (u.stripe_subscription_id ? (esManual ? 'Admin' : 'Stripe') : '—')
                          : tienePack ? 'Stripe (pack)' : '—'}
                      </td>
                      <td>{formatFecha(u.created_at)}</td>
                      <td className="admin-acciones">
                        {esPago ? (
                          <button
                            className="admin-btn admin-btn--cancelar"
                            onClick={() => cancelar(u.id)}
                            disabled={accionando !== null}
                          >
                            {accionando === u.id + '_cancelar' ? '...' : 'Cancelar'}
                          </button>
                        ) : (
                          <button
                            className="admin-btn admin-btn--activar"
                            onClick={() => activar(u.id)}
                            disabled={accionando !== null}
                          >
                            {accionando === u.id + '_activar' ? '...' : 'Activar 12m'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <h2 className="admin-titulo" style={{ fontSize: '1.4rem', marginTop: '3rem' }}>Opiniones</h2>
        <p className="admin-subtitulo">
          Todo el feedback de la web: el formulario público en <code>/opiniones</code>, las reseñas de meditaciones
          y las de clases del Pack Raíz. Nada se publica hasta que lo apruebes aquí.
        </p>

        {loadingTestimonios ? (
          <p className="admin-loading">Cargando...</p>
        ) : testimonios.length === 0 ? (
          <p className="admin-loading">Todavía no hay opiniones enviadas.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Origen</th>
                  <th>Opinión</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {testimonios.map(t => (
                  <tr key={t.tipo + t.id}>
                    <td>{t.nombre}</td>
                    <td>{t.origen}</td>
                    <td style={{ maxWidth: 360, whiteSpace: 'pre-wrap' }}>{t.texto}</td>
                    <td>
                      {t.visible
                        ? <span className="admin-badge admin-badge--pago">Publicada</span>
                        : <span className="admin-badge admin-badge--free">Pendiente</span>}
                    </td>
                    <td>{formatFecha(t.created_at)}</td>
                    <td className="admin-acciones">
                      {!t.visible && (
                        <button
                          className="admin-btn admin-btn--activar"
                          onClick={() => aprobarTestimonio(t.tipo, t.id)}
                          disabled={accionando !== null}
                        >
                          {accionando === t.tipo + t.id + '_aprobar' ? '...' : 'Aprobar'}
                        </button>
                      )}
                      <button
                        className="admin-btn admin-btn--cancelar"
                        onClick={() => borrarTestimonio(t.tipo, t.id)}
                        disabled={accionando !== null}
                      >
                        {accionando === t.tipo + t.id + '_borrar' ? '...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
