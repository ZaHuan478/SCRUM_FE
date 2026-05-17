import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Appointment } from '../services/appointment.service'
import { cancelAppointment, createMyAppointment, getMyAppointments } from '../services/appointment.service'
import type { AppointmentSlot } from '../services/appointmentSlot.service'
import { getAppointmentSlots } from '../services/appointmentSlot.service'
import type { User } from '../services/auth.service'
import type { Department } from '../services/department.service'
import { getDepartments } from '../services/department.service'
import {
  buildAppointmentStats,
  buildUpcomingDays,
  getDateKey,
  isAuthFailure,
  sortAppointmentsByTime,
  sortSlotsByTime,
} from '../utils/patientAppointments'
import type { LoadStatus, PatientAppointmentStat } from '../utils/patientAppointments'

type UsePatientAppointmentsOptions = {
  storedUser: User
  onAuthFailure: () => void
}

export type PatientAppointmentsState = {
  appointmentActionId: number | string | null
  appointmentStatus: LoadStatus
  appointments: Appointment[]
  bookingError: string
  bookingSuccess: string
  departments: Department[]
  departmentStatus: LoadStatus
  reason: string
  selectedDate: string
  selectedDepartmentId: string
  selectedSlot: AppointmentSlot | null
  selectedSlotId: number | string | null
  slotStatus: LoadStatus
  slots: AppointmentSlot[]
  stats: PatientAppointmentStat[]
  upcomingDays: Date[]
  cancelMyAppointment: (appointment: Appointment) => Promise<void>
  loadAppointments: () => Promise<void>
  loadSlots: () => Promise<void>
  selectDate: (date: string) => void
  selectDepartment: (departmentId: string) => void
  selectSlot: (slot: AppointmentSlot) => void
  setReason: (reason: string) => void
  submitAppointment: () => Promise<void>
}

export const usePatientAppointments = ({
  storedUser,
  onAuthFailure,
}: UsePatientAppointmentsOptions): PatientAppointmentsState => {
  const todayKey = useMemo(() => getDateKey(new Date()), [])
  const upcomingDays = useMemo(() => buildUpcomingDays(), [])
  const [departments, setDepartments] = useState<Department[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [slots, setSlots] = useState<AppointmentSlot[]>([])
  const [selectedDate, setSelectedDate] = useState(todayKey)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('')
  const [selectedSlotId, setSelectedSlotId] = useState<number | string | null>(null)
  const [reason, setReason] = useState('')
  const [departmentStatus, setDepartmentStatus] = useState<LoadStatus>('loading')
  const [appointmentStatus, setAppointmentStatus] = useState<LoadStatus>('loading')
  const [slotStatus, setSlotStatus] = useState<LoadStatus>('loading')
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState('')
  const [appointmentActionId, setAppointmentActionId] = useState<number | string | null>(null)

  const handleRequestError = useCallback((requestError: unknown, fallback: string) => {
    if (isAuthFailure(requestError)) {
      onAuthFailure()
      return
    }

    setBookingError(requestError instanceof Error ? requestError.message : fallback)
  }, [onAuthFailure])

  const loadAppointments = useCallback(async () => {
    setAppointmentStatus('loading')

    try {
      const result = await getMyAppointments({ limit: 100 })
      setAppointments(sortAppointmentsByTime(result.appointments))
      setAppointmentStatus('ready')
    } catch (requestError) {
      if (isAuthFailure(requestError)) {
        onAuthFailure()
        return
      }

      setAppointmentStatus('error')
    }
  }, [onAuthFailure])

  const loadSlots = useCallback(async () => {
    setSlotStatus('loading')

    try {
      const result = await getAppointmentSlots({
        date: selectedDate,
        department_id: selectedDepartmentId || undefined,
        limit: 100,
        status: 'AVAILABLE',
      })

      setSlots(sortSlotsByTime(result.appointment_slots))
      setSlotStatus('ready')
    } catch (requestError) {
      if (isAuthFailure(requestError)) {
        onAuthFailure()
        return
      }

      setSlots([])
      setSlotStatus('error')
    }
  }, [onAuthFailure, selectedDate, selectedDepartmentId])

  useEffect(() => {
    let active = true

    getDepartments({ limit: 100, status: 'ACTIVE' })
      .then((result) => {
        if (!active) return

        setDepartments(result.departments)
        setDepartmentStatus('ready')
      })
      .catch(() => {
        if (!active) return

        setDepartments([])
        setDepartmentStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    getMyAppointments({ limit: 100 })
      .then((result) => {
        if (!active) return

        setAppointments(sortAppointmentsByTime(result.appointments))
        setAppointmentStatus('ready')
      })
      .catch((requestError: unknown) => {
        if (!active) return

        if (isAuthFailure(requestError)) {
          onAuthFailure()
          return
        }

        setAppointmentStatus('error')
      })

    return () => {
      active = false
    }
  }, [onAuthFailure])

  useEffect(() => {
    let active = true

    getAppointmentSlots({
      date: selectedDate,
      department_id: selectedDepartmentId || undefined,
      limit: 100,
      status: 'AVAILABLE',
    })
      .then((result) => {
        if (!active) return

        setSlots(sortSlotsByTime(result.appointment_slots))
        setSlotStatus('ready')
      })
      .catch((requestError: unknown) => {
        if (!active) return

        if (isAuthFailure(requestError)) {
          onAuthFailure()
          return
        }

        setSlots([])
        setSlotStatus('error')
      })

    return () => {
      active = false
    }
  }, [onAuthFailure, selectedDate, selectedDepartmentId])

  const selectedSlot = useMemo(() => (
    slots.find((slot) => String(slot.id) === String(selectedSlotId)) || null
  ), [selectedSlotId, slots])

  const stats = useMemo(() => buildAppointmentStats(appointments), [appointments])

  const selectDate = useCallback((date: string) => {
    setSelectedDate(date)
    setSelectedSlotId(null)
    setSlotStatus('loading')
  }, [])

  const selectDepartment = useCallback((departmentId: string) => {
    setSelectedDepartmentId(departmentId)
    setSelectedSlotId(null)
    setSlotStatus('loading')
  }, [])

  const selectSlot = useCallback((slot: AppointmentSlot) => {
    setSelectedSlotId(slot.id)
    setBookingError('')
    setBookingSuccess('')
  }, [])

  const submitAppointment = useCallback(async () => {
    setBookingError('')
    setBookingSuccess('')

    if (storedUser.role !== 'PATIENT') {
      setBookingError('Chỉ tài khoản bệnh nhân mới có thể đặt lịch hẹn.')
      return
    }

    if (!selectedSlot) {
      setBookingError('Vui lòng chọn một khung giờ còn trống.')
      return
    }

    try {
      await createMyAppointment({
        reason: reason.trim() || null,
        slot_id: selectedSlot.id,
      })
      setReason('')
      setSelectedSlotId(null)
      setBookingSuccess('Lịch hẹn đã được gửi, vui lòng chờ xác nhận.')
      await Promise.all([loadSlots(), loadAppointments()])
    } catch (requestError) {
      handleRequestError(requestError, 'Không thể đặt lịch hẹn.')
    }
  }, [handleRequestError, loadAppointments, loadSlots, reason, selectedSlot, storedUser.role])

  const cancelMyAppointment = useCallback(async (appointment: Appointment) => {
    if (!['PENDING', 'CONFIRMED'].includes(appointment.status)) return

    if (!window.confirm('Bạn muốn hủy lịch hẹn này?')) return

    setAppointmentActionId(appointment.id)
    setBookingError('')
    setBookingSuccess('')

    try {
      await cancelAppointment(appointment.id, { cancel_reason: 'Bệnh nhân hủy lịch hẹn' })
      setBookingSuccess('Lịch hẹn đã được hủy.')
      await Promise.all([loadAppointments(), loadSlots()])
    } catch (requestError) {
      handleRequestError(requestError, 'Không thể hủy lịch hẹn.')
    } finally {
      setAppointmentActionId(null)
    }
  }, [handleRequestError, loadAppointments, loadSlots])

  return {
    appointmentActionId,
    appointmentStatus,
    appointments,
    bookingError,
    bookingSuccess,
    cancelMyAppointment,
    departmentStatus,
    departments,
    loadAppointments,
    loadSlots,
    reason,
    selectedDate,
    selectedDepartmentId,
    selectedSlot,
    selectedSlotId,
    selectDate,
    selectDepartment,
    selectSlot,
    setReason,
    slotStatus,
    slots,
    stats,
    submitAppointment,
    upcomingDays,
  }
}
