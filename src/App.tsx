import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './page/HomePage'
import AuthPage from './page/AuthPage'
import SignupPage from './page/SignupPage'
import SymptomCheckerPage from './page/SymptomCheckerPage'
import AdminDashboardPage from './page/AdminDashboardPage'
import ProfilePage from './page/ProfilePage'
import DoctorSchedulePage from './page/DoctorSchedulePage'
import PatientAppointmentsPage from './page/PatientAppointmentsPage'
import DoctorsPage from './page/DoctorsPage'
import DepartmentsPage from './page/DepartmentsPage'
import DepartmentDetailPage from './page/DepartmentDetailPage'
import DoctorDetailPage from './page/DoctorDetailPage'
import { NotificationProvider } from './contexts/NotificationContext'

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/departments" element={<AdminDashboardPage />} />
          <Route path="/admin/doctors" element={<AdminDashboardPage />} />
          <Route path="/admin/patients" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminDashboardPage />} />
          <Route path="/doctor" element={<DoctorSchedulePage />} />
          <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:doctorId" element={<DoctorDetailPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/departments/:id" element={<DepartmentDetailPage />} />
          <Route path="/appointments" element={<PatientAppointmentsPage />} />
          <Route path="/patient/appointments" element={<PatientAppointmentsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/symptoms" element={<SymptomCheckerPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  )
}

export default App
