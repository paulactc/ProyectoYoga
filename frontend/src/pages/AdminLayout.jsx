import { useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminUsuarios from './AdminUsuarios'
import AdminOpiniones from './AdminOpiniones'
import AdminBlog from './AdminBlog'

function tabClase({ isActive }) {
  return isActive ? 'admin-tab admin-tab--activa' : 'admin-tab'
}

export default function AdminLayout() {
  const { user, token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    if (user.rol !== 'admin') { navigate('/'); return }
  }, [user, navigate])

  if (!user || user.rol !== 'admin') return null

  return (
    <main className="admin-page">
      <div className="admin-container">
        <h1 className="admin-titulo">Panel de administración</h1>
        <p className="admin-subtitulo">Yoga Tierra Viva</p>

        <nav className="admin-tabs">
          <NavLink to="/admin" end className={tabClase}>Suscriptoras</NavLink>
          <NavLink to="/admin/opiniones" className={tabClase}>Opiniones</NavLink>
          <NavLink to="/admin/blog" className={tabClase}>Blog</NavLink>
        </nav>

        <Routes>
          <Route index element={<AdminUsuarios token={token} />} />
          <Route path="opiniones" element={<AdminOpiniones token={token} />} />
          <Route path="blog" element={<AdminBlog token={token} />} />
        </Routes>
      </div>
    </main>
  )
}
