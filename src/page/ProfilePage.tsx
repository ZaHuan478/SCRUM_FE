import { useCallback, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import ProfileTemplate from '../components/Templates/ProfileTemplate'
import { useProfile } from '../hooks/useProfile'
import { clearAuthSession, getStoredUser } from '../services/auth.service'
import type { User } from '../services/auth.service'

type ProfileContentProps = {
  storedUser: User
  onLogout: () => void
}

const ProfileContent = ({ storedUser, onLogout }: ProfileContentProps) => {
  const profile = useProfile({
    storedUser,
    onAuthFailure: onLogout,
  })

  return (
    <ProfileTemplate
      {...profile}
      onLogout={onLogout}
    />
  )
}

const ProfilePage = () => {
  const navigate = useNavigate()
  const [storedUser] = useState(() => getStoredUser())

  const handleLogout = useCallback(() => {
    clearAuthSession()
    navigate('/login', { replace: true })
  }, [navigate])

  if (!storedUser) return <Navigate replace to="/login" />

  return <ProfileContent onLogout={handleLogout} storedUser={storedUser} />
}

export default ProfilePage
