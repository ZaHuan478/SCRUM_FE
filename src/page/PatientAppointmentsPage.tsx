import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PatientAppointmentsTemplate from '../components/Templates/PatientAppointmentsTemplate'
import { usePatientAppointments } from '../hooks/usePatientAppointments'
import { clearAuthSession, getStoredUser } from '../services/auth.service'
import type { User } from '../services/auth.service'

type PatientAppointmentsContentProps = {
  storedUser: User | null
  onLogout: () => void
}

const PatientAppointmentsContent = ({ storedUser, onLogout }: PatientAppointmentsContentProps) => {
  const appointments = usePatientAppointments({
    storedUser,
    onAuthFailure: onLogout,
  })

  return (
    <PatientAppointmentsTemplate
      {...appointments}
      user={storedUser}
    />
  )
}

const PatientAppointmentsPage = () => {
  const navigate = useNavigate()
  const [storedUser] = useState(() => getStoredUser())

  const handleLogout = useCallback(() => {
    clearAuthSession()
    navigate('/login', { replace: true })
  }, [navigate])

  return <PatientAppointmentsContent onLogout={handleLogout} storedUser={storedUser} />
}

export default PatientAppointmentsPage
