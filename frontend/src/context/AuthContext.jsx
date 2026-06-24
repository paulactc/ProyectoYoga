import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)
const AUTH_KEY = 'ytv_auth'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY)) } catch { return null }
  })

  const user = auth?.user || null
  const token = auth?.token || null
  const isSubscribed = !!user?.subscribed || user?.rol === 'admin'

  function saveAuth(token, user) {
    const data = { token, user }
    localStorage.setItem(AUTH_KEY, JSON.stringify(data))
    setAuth(data)
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
  }

  const refreshSubscription = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch('/api/suscripcion/estado', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setAuth(prev => {
          if (!prev) return prev
          const updated = { ...prev, user: { ...prev.user, subscribed: data.data.subscribed } }
          localStorage.setItem(AUTH_KEY, JSON.stringify(updated))
          return updated
        })
      }
    } catch { /* sin conexión */ }
  }, [token])

  useEffect(() => {
    refreshSubscription()
  }, [refreshSubscription])

  return (
    <AuthContext.Provider value={{ user, token, isSubscribed, saveAuth, updateUser, logout, refreshSubscription }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
