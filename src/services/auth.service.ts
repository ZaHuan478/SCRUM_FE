import { apiRequest } from '../api/client'

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN'

export type User = {
  id: number | string
  full_name?: string | null
  email: string
  phone?: string | null
  role: UserRole
  status: 'ACTIVE' | 'INACTIVE'
}

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  user: User
}

export type RegisterPayload = {
  full_name?: string
  email: string
  password: string
  phone?: string
}

export const login = (payload: LoginPayload) =>
  apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const register = (payload: RegisterPayload) =>
  apiRequest<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const saveAuthSession = (session: LoginResponse, remember: boolean) => {
  const storage = remember ? localStorage : sessionStorage

  storage.setItem('auth_token', session.token)
  storage.setItem('auth_user', JSON.stringify(session.user))
}

export const getStoredUser = (): User | null => {
  const rawUser = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user')

  if (!rawUser) return null

  try {
    return JSON.parse(rawUser) as User
  } catch {
    return null
  }
}

export const clearAuthSession = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
  sessionStorage.removeItem('auth_token')
  sessionStorage.removeItem('auth_user')
}
