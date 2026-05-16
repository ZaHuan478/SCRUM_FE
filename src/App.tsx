import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './page/HomePage'
import AuthPage from './page/AuthPage'
import SignupPage from './page/SignupPage'
import AppointmentPage from './page/AppointmentPage'
import PatientDashboardPage from './page/PatientDashboardPage'
import DoctorDetailPage from './page/DoctorDetailPage'
import AdminDashboardPage from './page/AdminDashboardPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/appointments/new" element={<AppointmentPage />} />
        <Route path="/patient-dashboard" element={<PatientDashboardPage />} />
        <Route path="/doctors/:doctorId" element={<DoctorDetailPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
