import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-social">
        <a href="#">Instagram</a>
        <a href="#">WhatsApp</a>
      </div>
      <div className="footer-legal">
        <Link to="/politica-cookies">Política de cookies</Link>
        <span className="footer-sep">·</span>
        <Link to="/politica-privacidad">Política de privacidad</Link>
        <span className="footer-sep">·</span>
        <Link to="/aviso-legal">Aviso legal</Link>
      </div>
      <p className="footer-copy">&copy; 2026 Yoga Tierra Viva</p>
    </footer>
  )
}
