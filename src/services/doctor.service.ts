import { apiRequest } from '../api/client'
import type { User } from './auth.service'

export type Doctor = {
  id: number | string
  user_id: number | string
  license_number: string
  cccd?: string | null
  experience_years?: number | null
  description?: string | null
  prof_biography?: string | null
  image_url?: string | null
  consultation_fee?: string | number | null
  status: 'ACTIVE' | 'INACTIVE'
  user?: User
  created_at?: string
  updated_at?: string
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
  keyword?: string
  status?: 'ACTIVE' | 'INACTIVE'
}

export type UpdateDoctorPayload = {
  license_number?: string
  cccd?: string | null
  experience_years?: number | string | null
  description?: string | null
  prof_biography?: string | null
  image_url?: string | null
  consultation_fee?: number | string | null
  status?: 'ACTIVE' | 'INACTIVE'
}

export type CreateDoctorPayload = {
  user_id: number | string
  license_number: string
  cccd?: string | null
  experience_years?: number | string | null
  description?: string | null
  prof_biography?: string | null
  image_url?: string | null
  consultation_fee?: number | string | null
  status?: 'ACTIVE' | 'INACTIVE'
}

export const getDoctors = (query: DoctorQuery = {}) => {
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.keyword) params.set('keyword', query.keyword)
  if (query.status) params.set('status', query.status)

  const search = params.toString()

  return apiRequest<DoctorsResult>(`/doctors${search ? `?${search}` : ''}`)
}

export const getDoctorByUserId = (userId: number | string) =>
  apiRequest<Doctor>(`/doctors/user/${userId}`)

export const getDoctorById = (id: number | string) =>
  apiRequest<Doctor>(`/doctors/${id}`)

export const createDoctor = (payload: CreateDoctorPayload) =>
  apiRequest<Doctor>('/doctors', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateDoctor = (id: number | string, payload: UpdateDoctorPayload) =>
  apiRequest<Doctor>(`/doctors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const deleteDoctor = (id: number | string) =>
  apiRequest<Record<string, never>>(`/doctors/${id}`, {
    method: 'DELETE',
  })

export const uploadDoctorImage = (id: number | string, imageData: string) =>
  apiRequest<Doctor>(`/doctors/${id}/image`, {
    method: 'POST',
    body: JSON.stringify({ image_data: imageData }),
  })
