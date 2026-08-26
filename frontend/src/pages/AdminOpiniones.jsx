import { useState, useEffect, useCallback } from 'react'

function formatFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AdminOpiniones({ token }) {
  const [testimonios, setTestimonios] = useState([])
  const [loading, setLoading] = useState(true)
  const [accionando, setAccionando] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/opiniones', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await r.json()
      if (data.success) setTestimonios(data.data)
    } catch {
      // silencioso, no es crítico para el resto del panel
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { cargar() }, [cargar])

  async function aprobar(tipo, id) {
    setAccionando(tipo + id + '_aprobar')
    try {
      await fetch(`/api/admin/opiniones/${tipo}/${id}/aprobar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      await cargar()
    } finally {
      setAccionando(null)
    }
  }

  async function borrar(tipo, id) {
    if (!confirm('¿Eliminar esta opinión?')) return
    setAccionando(tipo + id + '_borrar')
    try {
      await fetch(`/api/admin/opiniones/${tipo}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      await cargar()
    } finally {
      setAccionando(null)
    }
  }

  return (
    <>
      <h2 className="admin-titulo" style={{ fontSize: '1.4rem' }}>Opiniones</h2>
      <p className="admin-subtitulo">
        Todo el feedback de la web: el formulario público en <code>/opiniones</code>, las reseñas de meditaciones
        y las de clases del Pack Raíz. Nada se publica hasta que lo apruebes aquí.
      </p>

      {loading ? (
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
                        onClick={() => aprobar(t.tipo, t.id)}
                        disabled={accionando !== null}
                      >
                        {accionando === t.tipo + t.id + '_aprobar' ? '...' : 'Aprobar'}
                      </button>
                    )}
                    <button
                      className="admin-btn admin-btn--cancelar"
                      onClick={() => borrar(t.tipo, t.id)}
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
    </>
  )
}
