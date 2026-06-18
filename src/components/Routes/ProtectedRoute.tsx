import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getStoredUser } from '../../services/auth.service'
import type { UserRole } from '../../services/auth.service'

type ProtectedRouteProps = {
  allowedRoles?: UserRole[]
  children: ReactNode
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const location = useLocation()
  const user = getStoredUser()

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate replace to="/forbidden" />
  }

  return <>{children}</>
}

export default ProtectedRoute
