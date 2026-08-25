import { useEffect } from 'react'

// Cloudflare Web Analytics: gratis, sin límite de eventos, sin cookies ni
// huella digital. No requiere banner de consentimiento (no procesa datos
// personales ni usa almacenamiento en el dispositivo). El token no es
// secreto: va público en el HTML de cualquier visitante.
const CF_BEACON_TOKEN = 'f6578a11db584182aaff075cf030d997'

export default function Analytics() {
  useEffect(() => {
    const token = CF_BEACON_TOKEN
    if (!token) return

    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
    script.setAttribute('data-cf-beacon', JSON.stringify({ token }))
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return null
}
