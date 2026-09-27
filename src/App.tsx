import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { Signup } from '@/pages/Signup'
import { Dashboard } from '@/pages/Dashboard'
import { ReportPage } from '@/pages/ReportPage'
import { Missions } from '@/pages/Missions'
import { Leaderboard } from '@/pages/Leaderboard'
import { Community } from '@/pages/Community'
import { Profile } from '@/pages/Profile'
import { MunicipalDashboard } from '@/pages/MunicipalDashboard'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
        <Route path="/missions" element={<ProtectedRoute><Missions /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/municipal" element={<ProtectedRoute><MunicipalDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
