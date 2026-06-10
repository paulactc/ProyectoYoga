import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoginModal from './components/LoginModal'
import HomePage from './pages/HomePage'
import ClasesOnlinePage from './pages/ClasesOnlinePage'
import SuscripcionPage from './pages/SuscripcionPage'
import MiCuentaPage from './pages/MiCuentaPage'
import VerifyEmailPage from './pages/VerifyEmailPage'

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <AuthProvider>
      <Navbar onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/clases-online" element={<ClasesOnlinePage />} />
        <Route path="/suscripcion" element={<SuscripcionPage />} />
        <Route path="/mi-cuenta" element={<MiCuentaPage onOpenLogin={() => setLoginOpen(true)} />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}
