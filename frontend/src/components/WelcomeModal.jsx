import { useAuth } from '../context/AuthContext'
import { formatWelcomeMessage } from '../data/welcomeMessages'

export default function WelcomeModal() {
  const { user, welcomeMessageIndex, clearWelcomeMessage } = useAuth()

  if (!user || welcomeMessageIndex === null) return null

  const mensaje = formatWelcomeMessage(welcomeMessageIndex, user.nombre)

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) clearWelcomeMessage() }}>
      <div className="modal-content welcome-modal">
        <button className="modal-close" onClick={clearWelcomeMessage} aria-label="Cerrar">&times;</button>
        <div className="welcome-modal-icon-wrap">
          <svg className="welcome-modal-icon" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 26 Q18 23 30 26" opacity="0.7"/>
            <line x1="18" y1="26" x2="18" y2="16"/>
            <path d="M18 21 C14 17 9 19 11 23" fill="rgba(212,160,96,0.12)"/>
            <path d="M18 19 C22 15 27 17 25 21" fill="rgba(212,160,96,0.12)"/>
            <path d="M18 16 C17 13 15 11 18 10 C21 11 19 13 18 16"/>
          </svg>
        </div>
        <p className="welcome-modal-eyebrow">Yoga Tierra Viva</p>
        <p className="welcome-modal-text">{mensaje}</p>
      </div>
    </div>
  )
}
