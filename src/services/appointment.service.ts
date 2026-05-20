import { apiRequest } from '../api/client'
import type { Payment } from '../types/payment'
import type { AppointmentSlot } from './appointmentSlot.service'
import type { Doctor } from './doctor.service'
import type { Patient } from './patient.service'

export type AppointmentStatus = 'PENDING_PAYMENT' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

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
  payments?: Payment[]
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

export type CreateAppointmentPayload = {
  patient_id: number | string
  doctor_id: number | string
  slot_id: number | string
  reason?: string | null
}

export type CreateMyAppointmentPayload = {
  slot_id: number | string
  reason?: string | null
}

export type CreateAppointmentResult = {
  appointment: Appointment
  payment: Payment
}

export type CancelAppointmentPayload = {
  cancel_reason?: string | null
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

export const getMyAppointments = (query: Omit<AppointmentQuery, 'patient_id'> = {}) => {
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.doctor_id) params.set('doctor_id', String(query.doctor_id))
  if (query.slot_id) params.set('slot_id', String(query.slot_id))
  if (query.status) params.set('status', query.status)
  if (query.date) params.set('date', query.date)

  const search = params.toString()

  return apiRequest<AppointmentsResult>(`/appointments/me${search ? `?${search}` : ''}`)
}

export const createAppointment = (payload: CreateAppointmentPayload) =>
  apiRequest<CreateAppointmentResult>('/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const createMyAppointment = (payload: CreateMyAppointmentPayload) =>
  apiRequest<CreateAppointmentResult>('/appointments/me', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateAppointmentReason = (id: number | string, reason: string | null) =>
  apiRequest<Appointment>(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  })

export const cancelAppointment = (id: number | string, payload: CancelAppointmentPayload = {}) =>
  apiRequest<Appointment>(`/appointments/${id}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })

export const confirmAppointment = (id: number | string) =>
  apiRequest<Appointment>(`/appointments/${id}/confirm`, {
    method: 'PATCH',
  })

export const completeAppointment = (id: number | string) =>
  apiRequest<Appointment>(`/appointments/${id}/complete`, {
    method: 'PATCH',
  })
