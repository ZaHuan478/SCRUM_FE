export type NotificationType =
  | 'APPOINTMENT_CONFIRMED'
  | 'APPOINTMENT_CANCELLED'
  | 'APPOINTMENT_COMPLETED'
  | 'APPOINTMENT_REMINDER'
  | 'DOCTOR_APPROVED'
  | 'SYSTEM'
  | string

export type Notification = {
  id: number | string
  user_id: number | string
  title: string
  message: string
  type: NotificationType
  related_id?: number | string | null
  related_type?: string | null
  is_read: boolean
  created_at: string
}

export type NotificationsResult = {
  notifications: Notification[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}
