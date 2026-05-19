import { apiRequest } from '../api/client'

export type Symptom = {
  id: number | string
  name: string
  body_part?: string | null
  description?: string | null
  status: 'ACTIVE' | 'INACTIVE'
}

export type SymptomsResult = {
  symptoms: Symptom[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

type SymptomQuery = {
  page?: number
  limit?: number
  keyword?: string
  body_part?: string
  status?: Symptom['status']
}

export const getSymptoms = (query: SymptomQuery = {}) => {
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.keyword) params.set('keyword', query.keyword)
  if (query.body_part) params.set('body_part', query.body_part)
  if (query.status) params.set('status', query.status)

  const search = params.toString()

  return apiRequest<SymptomsResult>(`/symptoms${search ? `?${search}` : ''}`)
}
