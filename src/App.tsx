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
import PaymentPage from './page/PaymentPage'
import PaymentSuccessPage from './page/PaymentSuccessPage'
import { NotificationProvider } from './contexts/NotificationContext'
import { ToastProvider } from './contexts/ToastContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import AIChatBox from './components/Organisms/AIChatBox'

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/departments" element={<AdminDashboardPage />} />
                <Route path="/admin/doctors" element={<AdminDashboardPage />} />
                <Route path="/admin/appointments" element={<AdminDashboardPage />} />
                <Route path="/admin/symptom-rules" element={<AdminDashboardPage />} />
                <Route path="/admin/hospital-documents" element={<AdminDashboardPage />} />
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
                <Route path="/payments/:paymentId" element={<PaymentPage />} />
                <Route path="/payment-success/:appointmentId" element={<PaymentSuccessPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/symptoms" element={<SymptomCheckerPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/reset-password" element={<AuthPage />} />
              </Routes>
              <AIChatBox />
            </BrowserRouter>
          </NotificationProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
