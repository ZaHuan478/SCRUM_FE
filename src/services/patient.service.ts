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

export const getPatients = (query: PatientQuery = {}) => {
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.keyword) params.set('keyword', query.keyword)

  const search = params.toString()

  return apiRequest<PatientsResult>(`/patients${search ? `?${search}` : ''}`)
}
