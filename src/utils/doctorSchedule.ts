import type { AppointmentSlot, AppointmentSlotStatus } from '../services/appointmentSlot.service'
import type { DoctorAssignment } from '../services/doctorAssignment.service'

export type LoadStatus = 'loading' | 'ready' | 'error'
export type SlotFormStatus = Exclude<AppointmentSlotStatus, 'BOOKED' | 'FULL'>

export type SlotFormState = {
  date: string
  startTime: string
  endTime: string
  maxPatients: string
  status: SlotFormStatus
}

export type DaySummary = {
  available: number
  cancelled: number
  booked: number
  total: number
}

export type DoctorScheduleStat = {
  helper: string
  icon: string
  label: string
  value: string
}

export const slotStatusMeta: Record<AppointmentSlotStatus, { label: string; className: string; icon: string }> = {
  AVAILABLE: {
    className: 'bg-secondary-fixed text-on-secondary-fixed',
    icon: 'event_available',
    label: 'Đang nhận',
  },
  FULL: {
    className: 'bg-primary-fixed text-on-primary-fixed',
    icon: 'group',
    label: 'Đã đầy',
  },
  BOOKED: {
    className: 'bg-primary-fixed text-on-primary-fixed',
    icon: 'event_seat',
    label: 'Đã đặt',
  },
  CANCELLED: {
    className: 'bg-error-container text-on-error-container',
    icon: 'event_busy',
    label: 'Bận',
  },
}

export const slotStatusOptions: Array<{ label: string; value: SlotFormStatus }> = [
  { label: 'Rảnh - nhận bệnh nhân', value: 'AVAILABLE' },
  { label: 'Bận - không nhận lịch', value: 'CANCELLED' },
]

export const weekdayFormatter = new Intl.DateTimeFormat('vi-VN', { weekday: 'short' })
export const dayMonthFormatter = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' })
export const longDateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  weekday: 'long',
  year: 'numeric',
})

const pad = (value: number) => String(value).padStart(2, '0')

export const getDateKey = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value)

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export const dateFromKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number)

  return new Date(year, month - 1, day)
}

export const getTimeInputValue = (value: string) => {
  const date = new Date(value)

  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export const getTimeMinutes = (time: string) => {
  const [hour, minute] = time.split(':').map(Number)

  return hour * 60 + minute
}

export const toApiDateTime = (dateKey: string, time: string) => `${dateKey}T${time}:00`

export const buildEmptySlotForm = (dateKey: string): SlotFormState => ({
  date: dateKey,
  endTime: '08:30',
  maxPatients: '1',
  startTime: '08:00',
  status: 'AVAILABLE',
})

export const buildUpcomingDays = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)

    return date
  })
}

export const emptySummary = (): DaySummary => ({
  available: 0,
  booked: 0,
  cancelled: 0,
  total: 0,
})

export const sortSlots = (slots: AppointmentSlot[]) => (
  [...slots].sort((firstSlot, secondSlot) => (
    new Date(firstSlot.start_time).getTime() - new Date(secondSlot.start_time).getTime()
  ))
)

export const formatSlotRange = (slot: AppointmentSlot) => (
  `${getTimeInputValue(slot.start_time)} - ${getTimeInputValue(slot.end_time)}`
)

export const isSlotExpired = (slot: AppointmentSlot, now = Date.now()) => (
  new Date(slot.start_time).getTime() <= now
)

export const isFullDayBlock = (slot: AppointmentSlot) => {
  const start = new Date(slot.start_time)
  const end = new Date(slot.end_time)

  return (
    slot.status === 'CANCELLED'
    && getDateKey(start) === getDateKey(end)
    && start.getHours() === 0
    && start.getMinutes() === 0
    && end.getHours() === 23
    && end.getMinutes() >= 55
  )
}

export const isAuthFailure = (error: unknown) => {
  const status = error instanceof Error ? (error as { status?: number }).status : undefined

  return status === 401 || status === 403
}

export const getErrorMessage = (error: unknown, fallback: string) => (
  error instanceof Error ? error.message : fallback
)

const addSlotToSummary = (summary: DaySummary, slot: AppointmentSlot) => {
  summary.total += 1
  summary.booked += Number(slot.booked_count || 0)
  if (slot.status === 'AVAILABLE') summary.available += 1
  if (slot.status === 'CANCELLED') summary.cancelled += 1

  return summary
}

export const buildDaySummaryMap = (days: Date[], slots: AppointmentSlot[]) => {
  const summaries = new Map(days.map((date) => [getDateKey(date), emptySummary()]))

  slots.forEach((slot) => {
    const summary = summaries.get(getDateKey(slot.start_time))
    if (!summary) return

    addSlotToSummary(summary, slot)
  })

  return summaries
}

export const summarizeSlots = (slots: AppointmentSlot[]) => (
  slots.reduce<DaySummary>((summary, slot) => addSlotToSummary(summary, slot), emptySummary())
)

export const buildScheduleStats = ({
  activeAssignment,
  slots,
}: {
  activeAssignment: DoctorAssignment | null
  slots: AppointmentSlot[]
}): DoctorScheduleStat[] => {
  const futureSlots = slots.filter((slot) => !isSlotExpired(slot))
  const availableSlots = futureSlots.filter((slot) => slot.status === 'AVAILABLE').length
  const bookedTotal = futureSlots.reduce((total, slot) => total + Number(slot.booked_count || 0), 0)
  const busyDays = new Set(futureSlots.filter((slot) => slot.status === 'CANCELLED').map((slot) => getDateKey(slot.start_time))).size

  return [
    {
      helper: 'khung sắp tới',
      icon: 'event_available',
      label: 'Đang nhận',
      value: String(availableSlots),
    },
    {
      helper: 'lượt đã đặt',
      icon: 'groups',
      label: 'Bệnh nhân',
      value: String(bookedTotal),
    },
    {
      helper: 'ngày có lịch bận',
      icon: 'event_busy',
      label: 'Bận',
      value: String(busyDays),
    },
    {
      helper: activeAssignment?.department?.name || 'Chưa phân khoa',
      icon: 'clinical_notes',
      label: 'Khoa',
      value: activeAssignment ? 'Active' : 'N/A',
    },
  ]
}
