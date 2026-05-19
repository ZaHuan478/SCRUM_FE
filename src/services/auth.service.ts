import { apiRequest } from '../api/client'

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN'

export type User = {
  id: number | string
  full_name?: string | null
  email: string
  phone?: string | null
  avatar_url?: string | null
  date_of_birth?: string | null
  cccd_number?: string | null
  cccd_front_image?: string | null
  cccd_back_image?: string | null
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
  avatar_url?: string
  date_of_birth?: string
  cccd_number?: string
  cccd_front_image?: string
  cccd_back_image?: string
}

export const AUTH_USER_CHANGED_EVENT = 'auth-user-changed'

const notifyAuthUserChange = (user: User | null) => {
  window.dispatchEvent(new CustomEvent<User | null>(AUTH_USER_CHANGED_EVENT, { detail: user }))
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
  clearAuthSession()

  const storage = remember ? localStorage : sessionStorage

  storage.setItem('auth_token', session.token)
  storage.setItem('auth_user', JSON.stringify(session.user))
  notifyAuthUserChange(session.user)
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

export const updateStoredUser = (user: User) => {
  const storage = localStorage.getItem('auth_token') ? localStorage : sessionStorage.getItem('auth_token') ? sessionStorage : null

  storage?.setItem('auth_user', JSON.stringify(user))
  notifyAuthUserChange(user)
}

export const clearAuthSession = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
  sessionStorage.removeItem('auth_token')
  sessionStorage.removeItem('auth_user')
  notifyAuthUserChange(null)
}
