import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const doctorRatingApi = axios.create({
  baseURL: API_BASE_URL,
})

doctorRatingApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

type ApiEnvelope<T> = {
  success: boolean
  message?: string
  data: T
}

export type DoctorRatingItem = {
  id: number | string
  rating: number
  comment?: string | null
  patientName: string
  createdAt: string
}

export type RatingDistribution = {
  1: number
  2: number
  3: number
  4: number
  5: number
}

export type DoctorRatingSummary = {
  doctorId: number
  averageRating: number
  totalRatings: number
  ratingDistribution: RatingDistribution
}

export type DoctorRatingListResponse = {
  doctorId: number
  ratings: DoctorRatingItem[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export type MyDoctorRating = {
  rating: number
  comment?: string | null
  appointment_id?: number | string
}

export type CreateOrUpdateDoctorRatingPayload = {
  appointmentId: number | string
  rating: number
  comment?: string | null
}

export const createOrUpdateDoctorRating = async (
  doctorId: number | string,
  payload: CreateOrUpdateDoctorRatingPayload
) => {
  const response = await doctorRatingApi.post<ApiEnvelope<null>>(`/doctors/${doctorId}/ratings`, payload)
  return response.data
}

export const getDoctorRatings = async (
  doctorId: number | string,
  query: { page?: number; limit?: number } = {}
) => {
  const params = new URLSearchParams()
  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))

  const response = await doctorRatingApi.get<ApiEnvelope<DoctorRatingListResponse>>(
    `/doctors/${doctorId}/ratings${params.toString() ? `?${params.toString()}` : ''}`
  )
  return response.data.data
}

export const getDoctorRatingSummary = async (doctorId: number | string) => {
  const response = await doctorRatingApi.get<ApiEnvelope<DoctorRatingSummary>>(
    `/doctors/${doctorId}/ratings/summary`
  )
  return response.data.data
}

export const getMyDoctorRating = async (doctorId: number | string) => {
  try {
    const response = await doctorRatingApi.get<ApiEnvelope<MyDoctorRating>>(
      `/doctors/${doctorId}/ratings/me`
    )
    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }

    throw error
  }
}

export const deleteMyDoctorRating = async (doctorId: number | string) => {
  const response = await doctorRatingApi.delete<ApiEnvelope<null>>(`/doctors/${doctorId}/ratings/me`)
  return response.data
}
