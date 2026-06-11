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
import ResetPasswordPage from './pages/ResetPasswordPage'
import PoliticaCookiesPage from './pages/PoliticaCookiesPage'
import AvisoLegalPage from './pages/AvisoLegalPage'
import PoliticaPrivacidadPage from './pages/PoliticaPrivacidadPage'

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <AuthProvider>
      <Navbar onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aula-online" element={<ClasesOnlinePage />} />
        <Route path="/suscripcion" element={<SuscripcionPage />} />
        <Route path="/mi-cuenta" element={<MiCuentaPage onOpenLogin={() => setLoginOpen(true)} />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/politica-cookies" element={<PoliticaCookiesPage />} />
        <Route path="/aviso-legal" element={<AvisoLegalPage />} />
        <Route path="/politica-privacidad" element={<PoliticaPrivacidadPage />} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}
