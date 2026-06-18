import { apiRequest } from '../api/client'
import type { User, UserGender, UserRole } from './auth.service'
import type { CreateDoctorPayload } from './doctor.service'

export type UsersResult = {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

type UserQuery = {
  page?: number
  limit?: number
  keyword?: string
}

const normalizeUsersResult = (data: UsersResult | User[], query: UserQuery): UsersResult => {
  if (Array.isArray(data)) {
    const page = query.page || 1
    const limit = query.limit || data.length || 1

    return {
      users: data,
      pagination: {
        page,
        limit,
        total: data.length,
        total_pages: Math.max(Math.ceil(data.length / limit), 1),
      },
    }
  }

  return data
}

export type CreateUserPayload = {
  full_name?: string | null
  email: string
  password: string
  phone?: string | null
  avatar_url?: string | null
  date_of_birth?: string | null
  gender?: UserGender | null
  cccd_number?: string | null
  cccd_front_image?: string | null
  cccd_back_image?: string | null
  role?: UserRole
  status?: User['status']
  doctor_profile?: Omit<CreateDoctorPayload, 'user_id'>
}

export type ChangePasswordPayload = {
  current_password: string
  new_password: string
  confirm_password: string
}

export type UpdateUserPayload = {
  full_name?: string | null
  email?: string
  phone?: string | null
  avatar_url?: string | null
  date_of_birth?: string | null
  gender?: UserGender | null
  cccd_number?: string | null
  cccd_front_image?: string | null
  cccd_back_image?: string | null
  role?: User['role']
}

export const getUsers = async (query: UserQuery = {}) => {
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.keyword) params.set('keyword', query.keyword)

  const search = params.toString()
  const data = await apiRequest<UsersResult | User[]>(`/admin/users${search ? `?${search}` : ''}`)

  return normalizeUsersResult(data, query)
}

export const getCurrentUser = () => apiRequest<User>('/users/me')

export const createUser = (payload: CreateUserPayload) =>
  apiRequest<User>('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateUser = (id: number | string, payload: UpdateUserPayload) =>
  apiRequest<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const updateCurrentUser = (payload: UpdateUserPayload) =>
  apiRequest<User>('/users/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const uploadCurrentUserAvatar = (imageData: string) =>
  apiRequest<User>('/users/me/avatar', {
    method: 'POST',
    body: JSON.stringify({ image_data: imageData }),
  })

export const uploadCurrentUserCccdImage = (field: 'front' | 'back', imageData: string) =>
  apiRequest<User>('/users/me/cccd-image', {
    method: 'POST',
    body: JSON.stringify({
      field,
      image_data: imageData,
    }),
  })

export const changeCurrentUserPassword = (payload: ChangePasswordPayload) =>
  apiRequest<User>('/users/me/password', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })

export const changeUserStatus = (id: number | string, status: User['status']) =>
  apiRequest<User>(`/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })

export const changeUserRole = (id: number | string, role: User['role']) =>
  apiRequest<User>(`/admin/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  })

export const deleteUser = (id: number | string) =>
  apiRequest(`/users/${id}`, {
    method: 'DELETE',
  })

export const deleteCurrentUser = () =>
  apiRequest('/users/me', {
    method: 'DELETE',
  })
