import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)
const AUTH_KEY = 'ytv_auth'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY)) } catch { return null }
  })
  const [welcomeMessageIndex, setWelcomeMessageIndex] = useState(null)

  const user = auth?.user || null
  const token = auth?.token || null
  const isSubscribed = !!user?.subscribed || user?.rol === 'admin'
  const ownsPack = !!user?.ownsPack || user?.rol === 'admin'

  async function fetchWelcomeMessage(tok) {
    try {
      const res = await fetch('/api/cuenta/bienvenida', {
        headers: { Authorization: `Bearer ${tok}` }
      })
      const data = await res.json()
      if (data.success) setWelcomeMessageIndex(data.data.index)
    } catch { /* sin conexión: no bloquea el login */ }
  }

  function clearWelcomeMessage() {
    setWelcomeMessageIndex(null)
  }

  function saveAuth(token, user) {
    const data = { token, user }
    localStorage.setItem(AUTH_KEY, JSON.stringify(data))
    setAuth(data)
    fetchWelcomeMessage(token)
  }

  function updateUser(fields) {
    setAuth(prev => {
      if (!prev) return prev
      const updated = { ...prev, user: { ...prev.user, ...fields } }
      localStorage.setItem(AUTH_KEY, JSON.stringify(updated))
      return updated
    })
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY)
    setAuth(null)
    setWelcomeMessageIndex(null)
  }

  const refreshSubscription = useCallback(async () => {
    if (!token) return
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch('/api/suscripcion/estado', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.status === 401) {
          localStorage.removeItem(AUTH_KEY)
          setAuth(null)
          return
        }
        const data = await res.json()
        if (data.success) {
          setAuth(prev => {
            if (!prev) return prev
            if (prev.user?.subscribed === data.data.subscribed) return prev
            const updated = { ...prev, user: { ...prev.user, subscribed: data.data.subscribed } }
            localStorage.setItem(AUTH_KEY, JSON.stringify(updated))
            return updated
          })
          return
        }
      } catch { /* sin conexión */ }
      if (attempt < 2) await new Promise(r => setTimeout(r, 1500))
    }
  }, [token])

  const refreshPack = useCallback(async () => {
    if (!token) return
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch('/api/pack/estado', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.status === 401) {
          localStorage.removeItem(AUTH_KEY)
          setAuth(null)
          return
        }
        const data = await res.json()
        if (data.success) {
          setAuth(prev => {
            if (!prev) return prev
            if (prev.user?.ownsPack === data.data.owns) return prev
            const updated = { ...prev, user: { ...prev.user, ownsPack: data.data.owns } }
            localStorage.setItem(AUTH_KEY, JSON.stringify(updated))
            return updated
          })
          return
        }
      } catch { /* sin conexión */ }
      if (attempt < 2) await new Promise(r => setTimeout(r, 1500))
    }
  }, [token])

  useEffect(() => {
    refreshSubscription()
    refreshPack()
  }, [refreshSubscription, refreshPack])

  return (
    <AuthContext.Provider value={{
      user, token, isSubscribed, ownsPack, saveAuth, updateUser, logout, refreshSubscription, refreshPack,
      welcomeMessageIndex, clearWelcomeMessage,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
