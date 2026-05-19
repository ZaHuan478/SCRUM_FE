import type { Appointment, AppointmentStatus } from '../services/appointment.service'
import type { AppointmentSlot } from '../services/appointmentSlot.service'
import type { Symptom } from '../services/symptom.service'

export type LoadStatus = 'loading' | 'ready' | 'error'

export type PatientAppointmentStat = {
  icon: string
  label: string
  value: string
  helper: string
}

export const appointmentStatusMeta: Record<AppointmentStatus, { label: string; className: string; icon: string }> = {
  PENDING_PAYMENT: {
    className: 'bg-tertiary-container text-on-tertiary-container',
    icon: 'qr_code_2',
    label: 'Chờ thanh toán',
  },
  PENDING: {
    className: 'bg-tertiary-container text-on-tertiary-container',
    icon: 'pending_actions',
    label: 'Đang chờ',
  },
  CONFIRMED: {
    className: 'bg-secondary-fixed text-on-secondary-fixed',
    icon: 'event_available',
    label: 'Đã xác nhận',
  },
  COMPLETED: {
    className: 'bg-primary-fixed text-on-primary-fixed',
    icon: 'task_alt',
    label: 'Đã khám',
  },
  CANCELLED: {
    className: 'bg-error-container text-on-error-container',
    icon: 'event_busy',
    label: 'Đã hủy',
  },
}

const pad = (value: number) => String(value).padStart(2, '0')

export const getDateKey = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value)

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export const buildUpcomingDays = (length = 14) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Array.from({ length }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)

    return date
  })
}

export const shortDateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  weekday: 'short',
})

export const longDateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  weekday: 'long',
  year: 'numeric',
})

export const getTimeInputValue = (value: string) => {
  const date = new Date(value)

  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export const formatSlotRange = (slot: AppointmentSlot) => (
  `${getTimeInputValue(slot.start_time)} - ${getTimeInputValue(slot.end_time)}`
)

export const formatAppointmentDate = (appointment: Appointment) => {
  const startTime = appointment.slot?.start_time || appointment.created_at

  return startTime ? longDateFormatter.format(new Date(startTime)) : 'Chưa có ngày'
}

export const formatAppointmentTime = (appointment: Appointment) => (
  appointment.slot ? formatSlotRange(appointment.slot) : 'Chưa có khung giờ'
)

export const getSlotDoctorName = (slot: AppointmentSlot) => (
  slot.doctor_assignment?.doctor?.user?.full_name
  || slot.doctor_assignment?.doctor?.license_number
  || 'Bác sĩ'
)

export const getSlotDepartmentName = (slot: AppointmentSlot) => (
  slot.doctor_assignment?.department?.name || 'Chưa phân khoa'
)

export const getAppointmentDoctorName = (appointment: Appointment) => (
  appointment.doctor?.user?.full_name
  || appointment.doctor?.license_number
  || (appointment.slot ? getSlotDoctorName(appointment.slot) : 'Bác sĩ')
)

export const getAppointmentDepartmentName = (appointment: Appointment) => (
  appointment.slot ? getSlotDepartmentName(appointment.slot) : 'Chưa phân khoa'
)

export const getSlotRemaining = (slot: AppointmentSlot) => (
  Math.max(Number(slot.max_patients || 0) - Number(slot.booked_count || 0), 0)
)

export const sortSlotsByTime = (slots: AppointmentSlot[]) => (
  [...slots].sort((firstSlot, secondSlot) => (
    new Date(firstSlot.start_time).getTime() - new Date(secondSlot.start_time).getTime()
  ))
)

export const sortAppointmentsByTime = (appointments: Appointment[]) => (
  [...appointments].sort((firstAppointment, secondAppointment) => {
    const firstTime = firstAppointment.slot?.start_time || firstAppointment.created_at || ''
    const secondTime = secondAppointment.slot?.start_time || secondAppointment.created_at || ''

    return new Date(secondTime).getTime() - new Date(firstTime).getTime()
  })
)

const normalizeVietnameseText = (value: string) => (
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
)

export const findMatchingSymptoms = (query: string, symptoms: Symptom[]) => {
  const normalizedQuery = normalizeVietnameseText(query)
  if (normalizedQuery.trim().length < 2) return []

  return symptoms.filter((symptom) => {
    const symptomName = normalizeVietnameseText(symptom.name)

    return normalizedQuery.includes(symptomName) || symptomName.includes(normalizedQuery)
  })
}

export const buildAppointmentStats = (appointments: Appointment[]): PatientAppointmentStat[] => {
  const upcoming = appointments.filter((appointment) => (
    ['PENDING_PAYMENT', 'PENDING', 'CONFIRMED'].includes(appointment.status)
    && appointment.slot?.start_time
    && new Date(appointment.slot.start_time).getTime() >= Date.now()
  )).length
  const pending = appointments.filter((appointment) => ['PENDING_PAYMENT', 'PENDING'].includes(appointment.status)).length
  const completed = appointments.filter((appointment) => appointment.status === 'COMPLETED').length

  return [
    {
      helper: 'lịch sắp tới',
      icon: 'event_available',
      label: 'Sắp khám',
      value: String(upcoming),
    },
    {
      helper: 'chờ xác nhận',
      icon: 'pending_actions',
      label: 'Đang chờ',
      value: String(pending),
    },
    {
      helper: 'lịch đã hoàn tất',
      icon: 'task_alt',
      label: 'Đã khám',
      value: String(completed),
    },
  ]
}

export const isAuthFailure = (error: unknown) => {
  const status = error instanceof Error ? (error as { status?: number }).status : undefined

  return status === 401 || status === 403
}
