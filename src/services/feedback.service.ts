import { apiRequest } from '../api/client'
import type { Appointment } from './appointment.service'
import type { Doctor } from './doctor.service'
import type { Patient } from './patient.service'

export type Feedback = {
  id: number | string
  appointment_id: number | string
  patient_id: number | string
  doctor_id: number | string
  rating: number
  comment?: string | null
  appointment?: Appointment
  patient?: Patient
  doctor?: Doctor
  created_at?: string
  updated_at?: string
}

export type FeedbackResult = {
  feedback: Feedback[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

type FeedbackQuery = {
  page?: number
  limit?: number
}

export type CreateFeedbackPayload = {
  appointmentId: number | string
  rating: number
  comment?: string | null
}

const buildFeedbackQuery = (query: FeedbackQuery = {}) => {
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))

  const search = params.toString()

  return search ? `?${search}` : ''
}

export const createFeedback = (payload: CreateFeedbackPayload) =>
  apiRequest<Feedback>('/feedback', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const getMyFeedback = (query: FeedbackQuery = {}) =>
  apiRequest<FeedbackResult>(`/feedback/my-feedback${buildFeedbackQuery(query)}`)

export const getDoctorFeedback = (doctorId: number | string, query: FeedbackQuery = {}) =>
  apiRequest<FeedbackResult>(`/feedback/doctor/${doctorId}${buildFeedbackQuery(query)}`)

export const getFeedback = (query: FeedbackQuery = {}) =>
  apiRequest<FeedbackResult>(`/feedback${buildFeedbackQuery(query)}`)
