import { apiRequest } from '../api/client'
import type { Department } from './department.service'
import type { Doctor } from './doctor.service'

export type AppointmentSlotStatus = 'AVAILABLE' | 'BOOKED' | 'FULL' | 'CANCELLED'

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
  start_from?: string
  status?: AppointmentSlotStatus
}

export type CreateAppointmentSlotPayload = {
  doctor_assignment_id: number | string
  start_time: string
  end_time: string
  max_patients?: number | string
  status?: AppointmentSlotStatus
}

export type UpdateAppointmentSlotPayload = {
  start_time?: string
  end_time?: string
  max_patients?: number | string
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
  if (query.start_from) params.set('start_from', query.start_from)
  if (query.status) params.set('status', query.status)

  const search = params.toString()

  return apiRequest<AppointmentSlotsResult>(`/appointment-slots${search ? `?${search}` : ''}`)
}

export const createAppointmentSlot = (payload: CreateAppointmentSlotPayload) =>
  apiRequest<AppointmentSlot>('/appointment-slots', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateAppointmentSlot = (id: number | string, payload: UpdateAppointmentSlotPayload) =>
  apiRequest<AppointmentSlot>(`/appointment-slots/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const deleteAppointmentSlot = (id: number | string) =>
  apiRequest<Record<string, never>>(`/appointment-slots/${id}`, {
    method: 'DELETE',
  })

export const cancelAppointmentSlot = (id: number | string) =>
  apiRequest<AppointmentSlot>(`/appointment-slots/${id}/cancel`, {
    method: 'PATCH',
  })

export const changeAppointmentSlotStatus = (id: number | string, status: AppointmentSlotStatus) =>
  apiRequest<AppointmentSlot>(`/appointment-slots/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
