import { Link } from 'react-router-dom'

export default function ProximamentePage() {
  return (
    <div className="prox-page">
      <div className="prox-bg" />
      <div className="prox-content">
        <p className="prox-eyebrow">Aula Online</p>
        <h1 className="prox-titulo">Llegamos <em>muy pronto</em></h1>
        <p className="prox-desc">
          Estamos ultimando los últimos detalles para ofrecerte la mejor experiencia.<br />
          En unos días podrás acceder a todas las clases y seguir tu camino de práctica.
        </p>
        <div className="prox-sep" aria-hidden="true">✦</div>
        <Link to="/" className="prox-cta">Volver al inicio</Link>
      </div>
    </div>
  )
}
