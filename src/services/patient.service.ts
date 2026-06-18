import { apiRequest } from '../api/client'
import type { User } from './auth.service'

export type Patient = {
  id: number | string
  user_id: number | string
  date_of_birth?: string | null
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null
  address?: string | null
  insurance_number?: string | null
  user?: User
}

export type PatientsResult = {
  patients: Patient[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

type PatientQuery = {
  page?: number
  limit?: number
  keyword?: string
}

export type CreatePatientPayload = {
  user_id: number | string
  date_of_birth?: string | null
  gender?: Patient['gender']
  address?: string | null
  insurance_number?: string | null
}

export type UpdatePatientPayload = {
  date_of_birth?: string | null
  gender?: Patient['gender']
  address?: string | null
  insurance_number?: string | null
}

export const getPatients = (query: PatientQuery = {}) => {
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.keyword) params.set('keyword', query.keyword)

  const search = params.toString()

  return apiRequest<PatientsResult>(`/patients${search ? `?${search}` : ''}`)
}

export const createPatient = (payload: CreatePatientPayload) =>
  apiRequest<Patient>('/patients', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updatePatient = (id: number | string, payload: UpdatePatientPayload) =>
  apiRequest<Patient>(`/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const deletePatient = (id: number | string) =>
  apiRequest<Record<string, never>>(`/patients/${id}`, {
    method: 'DELETE',
  })
