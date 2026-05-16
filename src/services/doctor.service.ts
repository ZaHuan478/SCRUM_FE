import { apiRequest } from '../api/client'
import type { User } from './auth.service'

export type Doctor = {
  id: number | string
  license_number: string
  experience_years?: number | null
  description?: string | null
  consultation_fee?: string | number | null
  status: 'ACTIVE' | 'INACTIVE'
  user?: User
}

export type DoctorsResult = {
  doctors: Doctor[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

type DoctorQuery = {
  page?: number
  limit?: number
  status?: 'ACTIVE' | 'INACTIVE'
}

export const getDoctors = (query: DoctorQuery = {}) => {
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.status) params.set('status', query.status)

  const search = params.toString()

  return apiRequest<DoctorsResult>(`/doctors${search ? `?${search}` : ''}`)
}
