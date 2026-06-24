import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 26 Q18 23 30 26" opacity="0.6"/>
          <line x1="18" y1="26" x2="18" y2="16"/>
          <path d="M18 21 C14 17 9 19 11 23" fill="rgba(212,160,96,0.12)"/>
          <path d="M18 19 C22 15 27 17 25 21" fill="rgba(212,160,96,0.12)"/>
          <path d="M18 16 C17 13 15 11 18 10 C21 11 19 13 18 16"/>
        </svg>
        <span>Yoga Tierra Viva</span>
      </div>

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
