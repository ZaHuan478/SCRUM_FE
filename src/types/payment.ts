import type { Appointment } from '../services/appointment.service'
import type { PaymentStatus } from '../api/payment.api'

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