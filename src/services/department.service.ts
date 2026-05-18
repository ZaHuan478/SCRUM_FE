import { apiRequest } from '../api/client'

export type Department = {
  id: number | string
  name: string
  description?: string | null
  status: 'ACTIVE' | 'INACTIVE'
}

export type DepartmentsResult = {
  departments: Department[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export type DepartmentPayload = {
  name: string
  description?: string | null
  status?: 'ACTIVE' | 'INACTIVE'
}

type DepartmentQuery = {
  page?: number
  limit?: number
  keyword?: string
  status?: 'ACTIVE' | 'INACTIVE'
}

export const getDepartments = (query: DepartmentQuery = {}) => {
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.keyword) params.set('keyword', query.keyword)
  if (query.status) params.set('status', query.status)

  const search = params.toString()

  return apiRequest<DepartmentsResult>(`/departments${search ? `?${search}` : ''}`)
}

export const getDepartmentById = (id: number | string) =>
  apiRequest<Department>(`/departments/${id}`)

export const createDepartment = (payload: DepartmentPayload) =>
  apiRequest<Department>('/departments', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateDepartment = (id: number | string, payload: DepartmentPayload) =>
  apiRequest<Department>(`/departments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
