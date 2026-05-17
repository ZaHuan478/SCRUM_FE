import { apiRequest } from '../api/client'
import type { Department } from './department.service'
import type { Doctor } from './doctor.service'

export type AppointmentSlotStatus = 'AVAILABLE' | 'FULL' | 'CANCELLED'

export type AppointmentSlot = {
  id: number | string
  doctor_assignment_id: number | string
  start_time: string
  end_time: string
  max_patients: number
  booked_count: number
  status: AppointmentSlotStatus
  doctor_assignment?: {
    id: number | string
    doctor_id: number | string
    doctor?: Doctor
    department?: Department
  }
}

export type AppointmentSlotsResult = {
  appointment_slots: AppointmentSlot[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

type AppointmentSlotQuery = {
  page?: number
  limit?: number
  doctor_assignment_id?: number | string
  doctor_id?: number | string
  department_id?: number | string
  date?: string
  status?: AppointmentSlotStatus
}

export const getAppointmentSlots = (query: AppointmentSlotQuery = {}) => {
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.doctor_assignment_id) params.set('doctor_assignment_id', String(query.doctor_assignment_id))
  if (query.doctor_id) params.set('doctor_id', String(query.doctor_id))
  if (query.department_id) params.set('department_id', String(query.department_id))
  if (query.date) params.set('date', query.date)
  if (query.status) params.set('status', query.status)

  const search = params.toString()

  return apiRequest<AppointmentSlotsResult>(`/appointment-slots${search ? `?${search}` : ''}`)
}
