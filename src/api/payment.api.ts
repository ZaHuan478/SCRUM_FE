import axios from 'axios'
import type { Appointment } from '../services/appointment.service'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const paymentClient = axios.create({
  baseURL: API_BASE_URL.replace(/\/$/, ''),
})

paymentClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

const unwrap = <T>(response: { data: { data?: T } }) => response.data.data as T

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED'

export type Payment = {
  id: number | string
  appointment_id: number | string
  amount: string | number
  currency: string
  method: string
  provider?: string | null
  status: PaymentStatus
  transaction_code?: string | null
  qr_payload?: string | null
  qr_code_url?: string | null
  paid_at?: string | null
  appointment?: Appointment & {
    invoice?: Invoice | null
  }
}

export type Invoice = {
  id: number | string
  appointment_id: number | string
  payment_id: number | string
  invoice_code: string
  pdf_url: string
  cloudinary_public_id?: string | null
  email_sent: boolean
  sent_at?: string | null
  payment?: Payment
}

export const getPaymentStatus = async (paymentId: number | string) => (
  unwrap<Payment>(await paymentClient.get(`/payments/${paymentId}/status`))
)

export const getInvoiceByAppointment = async (appointmentId: number | string) => (
  unwrap<Invoice>(await paymentClient.get(`/invoices/${appointmentId}`))
)

export const resendInvoiceEmail = async (invoiceId: number | string) => (
  unwrap<Invoice>(await paymentClient.post(`/invoices/${invoiceId}/resend-email`))
)
