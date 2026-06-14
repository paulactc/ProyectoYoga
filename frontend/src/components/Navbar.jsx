import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onOpenLogin }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'nav-active' : ''

  function closeMenu() { setMenuOpen(false) }

  return (
    <nav className="navbar">
      <a href="/#inicio" className="nav-logo" onClick={closeMenu}>Yoga Tierra Viva</a>

      <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
        <li><a href="/#inicio" onClick={closeMenu}>Inicio</a></li>
        <li>
          <Link to="/audios" className={`nav-audios-link${isActive('/audios') ? ' nav-active' : ''}`} onClick={closeMenu}>
            Tierra en Calma
          </Link>
        </li>
        <li><Link to="/aula-online" className={isActive('/aula-online')} onClick={closeMenu}>Aula Online</Link></li>
        <li><a href="/#sobre-mi" onClick={closeMenu}>Qué es Yoga Tierra</a></li>
        <li><a href="/#contacto" onClick={closeMenu}>Contacto</a></li>
        <li><Link to="/suscripcion" className={isActive('/suscripcion')} onClick={closeMenu}>Suscripción</Link></li>
        {user ? (
          <>
            <li><Link to="/mi-cuenta" className={isActive('/mi-cuenta')} onClick={closeMenu}>Mi cuenta</Link></li>
            <li><button className="nav-link-btn" onClick={() => { logout(); closeMenu() }}>Cerrar sesión</button></li>
          </>
        ) : (
          <li><button className="nav-link-btn" onClick={() => { onOpenLogin(); closeMenu() }}>Iniciar sesión</button></li>
        )}
      </ul>

      <div className="nav-actions">
        {user ? (
          <>
            <Link to="/mi-cuenta" className={`btn btn-sm btn-outline${location.pathname === '/mi-cuenta' ? ' btn-outline-active' : ''}`}>
              Mi cuenta
            </Link>
            <button className="btn btn-sm btn-ghost" onClick={logout}>Salir</button>
          </>
        ) : (
          <>
            <button className="btn btn-sm btn-ghost" onClick={onOpenLogin}>Iniciar sesión</button>
            <Link to="/suscripcion" className="btn btn-sm">Prueba gratuita</Link>
          </>
        )}
      </div>

      <button
        className="nav-toggle"
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        onClick={() => setMenuOpen(o => !o)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>
    </nav>
  )
}
