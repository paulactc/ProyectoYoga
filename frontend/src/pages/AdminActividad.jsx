import { useState, useEffect, useCallback } from 'react'

function formatFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminActividad({ token }) {
  const [actividad, setActividad] = useState([])
  const [loading, setLoading] = useState(true)

  const cargar = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/actividad', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await r.json()
      if (data.success) setActividad(data.data)
    } catch {
      // silencioso, no es crítico para el resto del panel
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { cargar() }, [cargar])

  return (
    <>
      <h2 className="admin-titulo" style={{ fontSize: '1.4rem' }}>Actividad</h2>
      <p className="admin-subtitulo">
        Qué clases del Pack Raíz ha reproducido cada suscriptora y cuándo fue la última vez. Se registra al pulsar play, no el tiempo exacto de visionado.
      </p>

      {loading ? (
        <p className="admin-loading">Cargando...</p>
      ) : actividad.length === 0 ? (
        <p className="admin-loading">Todavía no hay reproducciones registradas.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuaria</th>
                <th>Clase</th>
                <th>Veces vista</th>
                <th>Primera vez</th>
                <th>Última vez</th>
              </tr>
            </thead>
            <tbody>
              {actividad.map(a => (
                <tr key={a.usuario_id + '-' + a.clase_id}>
                  <td data-label="Usuaria">{a.nombre}<br /><span style={{ color: 'var(--muted)', fontSize: '0.85em' }}>{a.email}</span></td>
                  <td data-label="Clase">{a.clase_titulo}</td>
                  <td data-label="Veces vista">{a.veces_vista}</td>
                  <td data-label="Primera vez">{formatFecha(a.primera_vista)}</td>
                  <td data-label="Última vez">{formatFecha(a.ultima_vista)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
