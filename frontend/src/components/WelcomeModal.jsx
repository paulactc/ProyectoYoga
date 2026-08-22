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
        <p className="welcome-modal-text">{mensaje}</p>
      </div>
    </div>
  )
}
