import { apiRequest } from '../api/client'
import type { AppointmentSlot } from './appointmentSlot.service'
import type { Doctor } from './doctor.service'
import type { Patient } from './patient.service'

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export type Appointment = {
  id: number | string
  patient_id: number | string
  doctor_id: number | string
  slot_id: number | string
  reason?: string | null
  cancel_reason?: string | null
  status: AppointmentStatus
  patient?: Patient
  doctor?: Doctor
  slot?: AppointmentSlot
  created_at?: string
  updated_at?: string
}

export type AppointmentsResult = {
  appointments: Appointment[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

type AppointmentQuery = {
  page?: number
  limit?: number
  patient_id?: number | string
  doctor_id?: number | string
  slot_id?: number | string
  status?: AppointmentStatus
  date?: string
}

export const getAppointments = (query: AppointmentQuery = {}) => {
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.patient_id) params.set('patient_id', String(query.patient_id))
  if (query.doctor_id) params.set('doctor_id', String(query.doctor_id))
  if (query.slot_id) params.set('slot_id', String(query.slot_id))
  if (query.status) params.set('status', query.status)
  if (query.date) params.set('date', query.date)

  const search = params.toString()

  return apiRequest<AppointmentsResult>(`/appointments${search ? `?${search}` : ''}`)
}
