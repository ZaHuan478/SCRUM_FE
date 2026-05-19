import { io, type Socket } from 'socket.io-client'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export type PaymentSuccessPayload = {
  payment_id: number | string
  appointment_id: number | string
  invoice_id: number | string
  pdf_url: string
}

const getSocketUrl = () => {
  if (BACKEND_URL) return BACKEND_URL.replace(/\/$/, '')
  if (!API_BASE_URL.startsWith('http')) return window.location.origin

  return new URL(API_BASE_URL).origin
}

export const connectPaymentSocket = () => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  if (!token) return null

  return io(getSocketUrl(), {
    auth: { token },
    transports: ['websocket', 'polling'],
  })
}

export const onPaymentSuccess = (
  socket: Socket,
  callback: (payload: PaymentSuccessPayload) => void
) => {
  socket.on('payment_success', callback)

  return () => {
    socket.off('payment_success', callback)
  }
}
