import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onOpenLogin }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, isSubscribed, logout } = useAuth()
  const location = useLocation()
  const dropdownRef = useRef(null)

  const isActive = (path) => location.pathname === path ? 'nav-active' : ''

  useEffect(() => {
    if (!dropdownOpen) return
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [dropdownOpen])

  function closeMenu() { setMenuOpen(false) }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">Yoga Tierra Viva</Link>

      <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
        <li><a href="/#inicio" onClick={closeMenu}>Inicio</a></li>
        <li><Link to="/clases-online" className={isActive('/clases-online')} onClick={closeMenu}>Clases Online</Link></li>
        <li><a href="/#sobre-mi" onClick={closeMenu}>Qué es Yoga Tierra</a></li>
        <li><a href="/#contacto" onClick={closeMenu}>Contacto</a></li>
        <li><Link to="/suscripcion" className={isActive('/suscripcion')} onClick={closeMenu}>Suscripción</Link></li>
      </ul>

      <div className="nav-actions">
        {user ? (
          <div className="mi-cuenta-wrap" ref={dropdownRef}>
            <button className="btn btn-sm btn-outline" onClick={() => setDropdownOpen(o => !o)}>
              Mi cuenta <span className="dropdown-arrow">▾</span>
            </button>
            {dropdownOpen && (
              <div className="mi-cuenta-dropdown open">
                <p className="dropdown-name">Hola, <strong>{user.nombre.split(' ')[0]}</strong></p>
                {isSubscribed && <span className="dropdown-tag">Activa ✓</span>}
                <Link to="/mi-cuenta" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Mi cuenta</Link>
                <button className="dropdown-item dropdown-item-danger" onClick={logout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="btn btn-sm btn-ghost" onClick={onOpenLogin}>Iniciar sesión</button>
            <Link to="/suscripcion" className="btn btn-sm">Prueba gratuita</Link>
          </>
        )}
      </div>

      <button className="nav-toggle" aria-label="Abrir menú" onClick={() => setMenuOpen(o => !o)}>
        &#9776;
      </button>
    </nav>
  )
}
