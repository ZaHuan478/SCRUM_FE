import { useCallback, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import DoctorScheduleTemplate from '../components/Templates/DoctorScheduleTemplate'
import { useDoctorSchedule } from '../hooks/useDoctorSchedule'
import { clearAuthSession, getStoredUser } from '../services/auth.service'
import type { User } from '../services/auth.service'

type DoctorScheduleContentProps = {
  storedUser: User
  onLogout: () => void
}

const DoctorScheduleContent = ({ storedUser, onLogout }: DoctorScheduleContentProps) => {
  const schedule = useDoctorSchedule({
    storedUser,
    onAuthFailure: onLogout,
  })

  return (
    <DoctorScheduleTemplate
      {...schedule}
      onLogout={onLogout}
      storedUser={storedUser}
    />
  )
}

const DoctorSchedulePage = () => {
  const navigate = useNavigate()
  const [storedUser] = useState(() => getStoredUser())

  const handleLogout = useCallback(() => {
    clearAuthSession()
    navigate('/login', { replace: true })
  }, [navigate])

  if (!storedUser) return <Navigate replace to="/login" />
  if (storedUser.role !== 'DOCTOR') return <Navigate replace to="/" />

  return <DoctorScheduleContent onLogout={handleLogout} storedUser={storedUser} />
}

export default DoctorSchedulePage
