import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './page/HomePage'
import AuthPage from './page/AuthPage'
import SignupPage from './page/SignupPage'
import SymptomCheckerPage from './page/SymptomCheckerPage'
import AdminDashboardPage from './page/AdminDashboardPage'
import ProfilePage from './page/ProfilePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/departments" element={<AdminDashboardPage />} />
        <Route path="/admin/doctors" element={<AdminDashboardPage />} />
        <Route path="/admin/patients" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminDashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/symptoms" element={<SymptomCheckerPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
