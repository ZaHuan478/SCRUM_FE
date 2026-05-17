import { apiRequest } from '../api/client'
import type { Department } from './department.service'
import type { Doctor } from './doctor.service'

export type DoctorAssignmentStatus = 'ACTIVE' | 'INACTIVE'

export type DoctorAssignment = {
  id: number | string
  doctor_id: number | string
  department_id: number | string
  position?: string | null
  status: DoctorAssignmentStatus
  doctor?: Doctor
  department?: Department
}

export type DoctorAssignmentsResult = {
  doctor_assignments: DoctorAssignment[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

type DoctorAssignmentQuery = {
  page?: number
  limit?: number
  doctor_id?: number | string
  department_id?: number | string
  status?: DoctorAssignmentStatus
}

export type CreateDoctorAssignmentPayload = {
  doctor_id: number | string
  department_id: number | string
  position?: string | null
  status?: DoctorAssignmentStatus
}

export type UpdateDoctorAssignmentPayload = {
  position?: string | null
  status?: DoctorAssignmentStatus
}

export const getDoctorAssignments = (query: DoctorAssignmentQuery = {}) => {
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.doctor_id) params.set('doctor_id', String(query.doctor_id))
  if (query.department_id) params.set('department_id', String(query.department_id))
  if (query.status) params.set('status', query.status)

  const search = params.toString()

  return apiRequest<DoctorAssignmentsResult>(`/doctor-assignments${search ? `?${search}` : ''}`)
}

export const createDoctorAssignment = (payload: CreateDoctorAssignmentPayload) =>
  apiRequest<DoctorAssignment>('/doctor-assignments', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateDoctorAssignment = (id: number | string, payload: UpdateDoctorAssignmentPayload) =>
  apiRequest<DoctorAssignment>(`/doctor-assignments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
