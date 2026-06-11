import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2026 Yoga Tierra Viva</p>
      <div className="footer-links">
        <a href="#">Instagram</a>
        <a href="#">WhatsApp</a>
        <Link to="/politica-cookies">Política de cookies</Link>
        <Link to="/politica-privacidad">Política de privacidad</Link>
        <Link to="/aviso-legal">Aviso legal</Link>
      </div>
    </footer>
  )
}
