import axios from 'axios'
import type { Invoice, Payment, } from '../types/payment'

export type { Invoice, Payment } from '../types/payment'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api'

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


export const getPaymentStatus = async (paymentId: number | string) => (
  unwrap<Payment>(await paymentClient.get(`/payments/${paymentId}/status`))
)

export const getInvoiceByAppointment = async (appointmentId: number | string) => (
  unwrap<Invoice>(await paymentClient.get(`/invoices/${appointmentId}`))
)

export const resendInvoiceEmail = async (invoiceId: number | string) => (
  unwrap<Invoice>(await paymentClient.post(`/invoices/${invoiceId}/resend-email`))
)
