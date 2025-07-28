import { Routes,Route,Navigate } from "react-router-dom"
import { Toaster } from 'sonner'
import { Loader } from 'lucide-react'
import { useEffect } from "react"
import useAuthStore from "./store/useAuthStore.js"
import LobbyPage from './pages/LobbyPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignUpPage.jsx'
import GameRoomPage from './pages/GameRoomPage.jsx'
import NavBar from './components/NavBar.jsx'



function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size 40 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <NavBar />
      <Routes>
        <Route path="/" element={authUser ? <LobbyPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/game/:roomId" element={authUser ? <GameRoomPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  </>
  )
}

export default App
