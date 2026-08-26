import { useState, useEffect, useCallback } from 'react'

const BLOQUE_VACIO = {
  parrafo: { tipo: 'parrafo', texto: '' },
  subtitulo: { tipo: 'subtitulo', texto: '' },
  imagen: { tipo: 'imagen', src: '', alt: '' },
}

const POST_VACIO = {
  titulo: '',
  resumen: '',
  imagen_portada: '',
  imagen_portada_alt: '',
  tiempo_lectura: '',
  publicado: false,
  contenido: [{ tipo: 'parrafo', texto: '' }],
}

function formatFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AdminBlog({ token }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null) // null = cerrado, 'new' = creando, número = editando
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [accionando, setAccionando] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/blog', { headers: { Authorization: `Bearer ${token}` } })
      const data = await r.json()
      if (data.success) setPosts(data.data)
    } catch {
      // silencioso, no es crítico para el resto del panel
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { cargar() }, [cargar])

  function abrirNuevo() {
    setForm(structuredClone(POST_VACIO))
    setEditId('new')
    setError('')
  }

  async function abrirEditar(id) {
    setError('')
    try {
      const r = await fetch(`/api/admin/blog/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await r.json()
      if (data.success) {
        setForm({
          titulo: data.data.titulo,
          resumen: data.data.resumen || '',
          imagen_portada: data.data.imagen_portada || '',
          imagen_portada_alt: data.data.imagen_portada_alt || '',
          tiempo_lectura: data.data.tiempo_lectura || '',
          publicado: !!data.data.publicado,
          contenido: data.data.contenido,
        })
        setEditId(id)
      }
    } catch {
      setError('No se pudo cargar el artículo.')
    }
  }

  function cerrar() {
    setEditId(null)
    setForm(null)
    setError('')
  }

  async function borrar(id) {
    if (!confirm('¿Eliminar este artículo? No se puede deshacer.')) return
    setAccionando(id + '_borrar')
    try {
      await fetch(`/api/admin/blog/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      await cargar()
      if (editId === id) cerrar()
    } finally {
      setAccionando(null)
    }
  }

  function actualizarCampo(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  function actualizarBloque(i, campo, valor) {
    setForm(f => {
      const contenido = [...f.contenido]
      contenido[i] = { ...contenido[i], [campo]: valor }
      return { ...f, contenido }
    })
  }

  function cambiarTipoBloque(i, tipo) {
    setForm(f => {
      const contenido = [...f.contenido]
      contenido[i] = { ...BLOQUE_VACIO[tipo] }
      return { ...f, contenido }
    })
  }

  function anadirBloque() {
    setForm(f => ({ ...f, contenido: [...f.contenido, { tipo: 'parrafo', texto: '' }] }))
  }

  function eliminarBloque(i) {
    setForm(f => ({ ...f, contenido: f.contenido.filter((_, idx) => idx !== i) }))
  }

  function moverBloque(i, dir) {
    setForm(f => {
      const j = i + dir
      if (j < 0 || j >= f.contenido.length) return f
      const contenido = [...f.contenido]
      ;[contenido[i], contenido[j]] = [contenido[j], contenido[i]]
      return { ...f, contenido }
    })
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')
    if (!form.titulo.trim()) return setError('El título es obligatorio.')
    const bloqueIncompleto = form.contenido.some(b => (b.tipo === 'imagen' ? !b.src.trim() : !b.texto.trim()))
    if (bloqueIncompleto) return setError('Revisa los bloques: todos necesitan texto (o una URL de imagen).')

    setSaving(true)
    try {
      const url = editId === 'new' ? '/api/admin/blog' : `/api/admin/blog/${editId}`
      const method = editId === 'new' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        await cargar()
        cerrar()
      } else {
        setError(data.message || 'No se pudo guardar.')
      }
    } catch {
      setError('Error de red al guardar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <h2 className="admin-titulo" style={{ fontSize: '1.4rem' }}>Blog</h2>
      <p className="admin-subtitulo">Escribe y publica tus propios artículos, sin tocar código.</p>

      {!editId && (
        <button className="admin-btn admin-btn--activar" onClick={abrirNuevo} style={{ marginBottom: '1.5rem' }}>
          + Nuevo artículo
        </button>
      )}

      {editId && form && (
        <form className="admin-blog-editor" onSubmit={guardar}>
          <label className="admin-blog-campo">
            Título
            <input type="text" value={form.titulo} onChange={e => actualizarCampo('titulo', e.target.value)} maxLength={300} required />
          </label>

          <label className="admin-blog-campo">
            Resumen (aparece en la lista del blog)
            <textarea rows={2} value={form.resumen} onChange={e => actualizarCampo('resumen', e.target.value)} maxLength={800} />
          </label>

          <div className="admin-blog-row">
            <label className="admin-blog-campo">
              Imagen de portada (URL)
              <input type="text" value={form.imagen_portada} onChange={e => actualizarCampo('imagen_portada', e.target.value)} placeholder="/images/mi-foto.jpg" />
            </label>
            <label className="admin-blog-campo">
              Texto alternativo de la imagen
              <input type="text" value={form.imagen_portada_alt} onChange={e => actualizarCampo('imagen_portada_alt', e.target.value)} />
            </label>
          </div>

          <label className="admin-blog-campo">
            Tiempo de lectura (déjalo en blanco para calcularlo solo)
            <input type="text" value={form.tiempo_lectura} onChange={e => actualizarCampo('tiempo_lectura', e.target.value)} placeholder="Ej. 5 min de lectura" />
          </label>

          <h3 className="admin-blog-bloques-titulo">Contenido</h3>
          {form.contenido.map((bloque, i) => (
            <div className="admin-blog-bloque" key={i}>
              <div className="admin-blog-bloque-head">
                <select value={bloque.tipo} onChange={e => cambiarTipoBloque(i, e.target.value)}>
                  <option value="parrafo">Párrafo</option>
                  <option value="subtitulo">Subtítulo</option>
                  <option value="imagen">Imagen</option>
                </select>
                <div className="admin-blog-bloque-acciones">
                  <button type="button" onClick={() => moverBloque(i, -1)} disabled={i === 0} aria-label="Subir bloque">↑</button>
                  <button type="button" onClick={() => moverBloque(i, 1)} disabled={i === form.contenido.length - 1} aria-label="Bajar bloque">↓</button>
                  <button type="button" onClick={() => eliminarBloque(i)} disabled={form.contenido.length === 1} aria-label="Eliminar bloque">✕</button>
                </div>
              </div>
              {bloque.tipo === 'imagen' ? (
                <>
                  <input type="text" placeholder="URL de la imagen" value={bloque.src} onChange={e => actualizarBloque(i, 'src', e.target.value)} />
                  <input type="text" placeholder="Texto alternativo" value={bloque.alt || ''} onChange={e => actualizarBloque(i, 'alt', e.target.value)} />
                </>
              ) : (
                <textarea
                  rows={bloque.tipo === 'subtitulo' ? 1 : 4}
                  placeholder={bloque.tipo === 'subtitulo' ? 'Texto del subtítulo' : 'Texto del párrafo'}
                  value={bloque.texto}
                  onChange={e => actualizarBloque(i, 'texto', e.target.value)}
                />
              )}
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn--activar admin-blog-anadir" onClick={anadirBloque}>+ Añadir bloque</button>

          <label className="admin-blog-publicar">
            <input type="checkbox" checked={form.publicado} onChange={e => actualizarCampo('publicado', e.target.checked)} />
            Publicado (visible en la web)
          </label>

          {error && <p className="plans-error">{error}</p>}

          <div className="admin-blog-form-acciones">
            <button type="submit" className="btn" disabled={saving}>{saving ? 'Guardando…' : 'Guardar artículo'}</button>
            <button type="button" className="admin-btn admin-btn--cancelar" onClick={cerrar}>Cancelar</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="admin-loading">Cargando...</p>
      ) : posts.length === 0 ? (
        <p className="admin-loading">Todavía no hay artículos.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td>{p.titulo}</td>
                  <td>
                    {p.publicado
                      ? <span className="admin-badge admin-badge--pago">Publicado</span>
                      : <span className="admin-badge admin-badge--free">Borrador</span>}
                  </td>
                  <td>{formatFecha(p.created_at)}</td>
                  <td className="admin-acciones">
                    <button className="admin-btn admin-btn--activar" onClick={() => abrirEditar(p.id)} disabled={accionando !== null}>
                      Editar
                    </button>
                    <button
                      className="admin-btn admin-btn--cancelar"
                      onClick={() => borrar(p.id)}
                      disabled={accionando !== null}
                    >
                      {accionando === p.id + '_borrar' ? '...' : 'Eliminar'}
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
