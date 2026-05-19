import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { Appointment } from '../services/appointment.service'
import { cancelAppointment, createMyAppointment, getMyAppointments } from '../services/appointment.service'
import type { AppointmentSlot } from '../services/appointmentSlot.service'
import { getAppointmentSlots } from '../services/appointmentSlot.service'
import type { User } from '../services/auth.service'
import type { Department } from '../services/department.service'
import { getDepartments } from '../services/department.service'
import { recommendDepartmentsBySymptoms } from '../services/departmentSymptomRule.service'
import type { RecommendedDepartment } from '../services/departmentSymptomRule.service'
import type { Feedback } from '../services/feedback.service'
import { createFeedback, getMyFeedback } from '../services/feedback.service'
import type { Symptom } from '../services/symptom.service'
import { getSymptoms } from '../services/symptom.service'
import {
  buildAppointmentStats,
  buildUpcomingDays,
  findMatchingSymptoms,
  isAuthFailure,
  sortAppointmentsByTime,
  sortSlotsByTime,
} from '../utils/patientAppointments'
import type { LoadStatus, PatientAppointmentStat } from '../utils/patientAppointments'

type UsePatientAppointmentsOptions = {
  storedUser: User | null
  onAuthFailure: () => void
}

const loadActiveSymptoms = async () => {
  const firstPage = await getSymptoms({ limit: 100, status: 'ACTIVE' })
  if (firstPage.pagination.total_pages <= 1) return firstPage.symptoms

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.pagination.total_pages - 1 }, (_, index) => (
      getSymptoms({ limit: 100, page: index + 2, status: 'ACTIVE' })
    ))
  )

  return [
    ...firstPage.symptoms,
    ...remainingPages.flatMap((result) => result.symptoms),
  ]
}

export type PatientAppointmentsState = {
  appointmentActionId: number | string | null
  appointmentStatus: LoadStatus
  appointments: Appointment[]
  bookingError: string
  bookingSuccess: string
  departments: Department[]
  departmentStatus: LoadStatus
  feedback: Feedback[]
  feedbackActionId: number | string | null
  feedbackError: string
  feedbackStatus: LoadStatus
  feedbackSuccess: string
  matchedSymptoms: Symptom[]
  reason: string
  recommendedDepartments: RecommendedDepartment[]
  recommendationStatus: LoadStatus
  selectedDate: string
  selectedDepartmentId: string
  selectedDoctorId: string
  selectedDoctorName: string
  selectedSlot: AppointmentSlot | null
  selectedSlotId: number | string | null
  slotStatus: LoadStatus
  slots: AppointmentSlot[]
  stats: PatientAppointmentStat[]
  upcomingDays: Date[]
  cancelMyAppointment: (appointment: Appointment) => Promise<void>
  clearSelectedDoctor: () => void
  loadAppointments: () => Promise<void>
  loadFeedback: () => Promise<void>
  loadSlots: () => Promise<void>
  selectDate: (date: string) => void
  selectDepartment: (departmentId: string) => void
  selectSlot: (slot: AppointmentSlot) => void
  setReason: (reason: string) => void
  submitAppointment: () => Promise<void>
  submitAppointmentFeedback: (
    appointment: Appointment,
    payload: { rating: number; comment?: string | null }
  ) => Promise<boolean>
}

export const usePatientAppointments = ({
  storedUser,
  onAuthFailure,
}: UsePatientAppointmentsOptions): PatientAppointmentsState => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialDoctorId = searchParams.get('doctor_id') || ''
  const initialDoctorName = searchParams.get('doctor_name') || ''
  const upcomingDays = useMemo(() => buildUpcomingDays(), [])
  const [departments, setDepartments] = useState<Department[]>([])
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [recommendedDepartments, setRecommendedDepartments] = useState<RecommendedDepartment[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [slots, setSlots] = useState<AppointmentSlot[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('')
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctorId)
  const [selectedDoctorName, setSelectedDoctorName] = useState(initialDoctorName)
  const [selectedSlotId, setSelectedSlotId] = useState<number | string | null>(null)
  const [reason, setReason] = useState('')
  const [departmentStatus, setDepartmentStatus] = useState<LoadStatus>('loading')
  const [recommendationStatus, setRecommendationStatus] = useState<LoadStatus>('ready')
  const [appointmentStatus, setAppointmentStatus] = useState<LoadStatus>('loading')
  const [feedbackStatus, setFeedbackStatus] = useState<LoadStatus>('loading')
  const [slotStatus, setSlotStatus] = useState<LoadStatus>('loading')
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState('')
  const [feedbackError, setFeedbackError] = useState('')
  const [feedbackSuccess, setFeedbackSuccess] = useState('')
  const [appointmentActionId, setAppointmentActionId] = useState<number | string | null>(null)
  const [feedbackActionId, setFeedbackActionId] = useState<number | string | null>(null)

  const handleRequestError = useCallback((requestError: unknown, fallback: string) => {
    if (isAuthFailure(requestError)) {
      onAuthFailure()
      return
    }

    setBookingError(requestError instanceof Error ? requestError.message : fallback)
  }, [onAuthFailure])

  const handleFeedbackError = useCallback((requestError: unknown, fallback: string) => {
    if (isAuthFailure(requestError)) {
      onAuthFailure()
      return
    }

    setFeedbackError(requestError instanceof Error ? requestError.message : fallback)
  }, [onAuthFailure])

  const loadAppointments = useCallback(async () => {
    if (storedUser?.role !== 'PATIENT') {
      setAppointments([])
      setAppointmentStatus('ready')
      return
    }

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
  }, [onAuthFailure, storedUser?.role])

  const loadFeedback = useCallback(async () => {
    if (storedUser?.role !== 'PATIENT') {
      setFeedback([])
      setFeedbackStatus('ready')
      return
    }

    setFeedbackStatus('loading')

    try {
      const result = await getMyFeedback({ limit: 100 })
      setFeedback(result.feedback)
      setFeedbackStatus('ready')
    } catch (requestError) {
      if (isAuthFailure(requestError)) {
        onAuthFailure()
        return
      }

      setFeedback([])
      setFeedbackStatus('error')
    }
  }, [onAuthFailure, storedUser?.role])

  const loadSlots = useCallback(async () => {
    setSlotStatus('loading')

    try {
      const result = await getAppointmentSlots({
        date: selectedDate || undefined,
        department_id: selectedDoctorId ? undefined : selectedDepartmentId || undefined,
        doctor_id: selectedDoctorId || undefined,
        limit: 100,
        start_from: selectedDate ? undefined : new Date().toISOString(),
        status: 'AVAILABLE',
      })

      setSlots(sortSlotsByTime(result.appointment_slots).filter((slot) => (
        selectedDate || new Date(slot.start_time).getTime() >= Date.now()
      )))
      setSlotStatus('ready')
    } catch (requestError) {
      if (isAuthFailure(requestError)) {
        onAuthFailure()
        return
      }

      setSlots([])
      setSlotStatus('error')
    }
  }, [onAuthFailure, selectedDate, selectedDepartmentId, selectedDoctorId])

  const matchedSymptoms = useMemo(() => (
    findMatchingSymptoms(reason, symptoms).slice(0, 8)
  ), [reason, symptoms])

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

    if (reason.trim().length < 2 || symptoms.length > 0) {
      return () => {
        active = false
      }
    }

    loadActiveSymptoms()
      .then((nextSymptoms) => {
        if (!active) return
        setSymptoms(nextSymptoms)
      })
      .catch(() => {
        if (!active) return
        setSymptoms([])
      })

    return () => {
      active = false
    }
  }, [reason, symptoms.length])

  useEffect(() => {
    let active = true

    if (matchedSymptoms.length === 0) {
      const timeoutId = window.setTimeout(() => {
        if (!active) return

        setRecommendedDepartments([])
        setRecommendationStatus('ready')
      }, 0)

      return () => {
        active = false
        window.clearTimeout(timeoutId)
      }
    }

    const timeoutId = window.setTimeout(() => {
      if (!active) return

      setRecommendationStatus('loading')

      recommendDepartmentsBySymptoms(matchedSymptoms.map((symptom) => symptom.id))
        .then((recommendations) => {
          if (!active) return

          const nextRecommendations = recommendations.slice(0, 3)
          setRecommendedDepartments(nextRecommendations)
          setRecommendationStatus('ready')

          const topDepartmentId = nextRecommendations[0]?.department_id
          if (!topDepartmentId || selectedDoctorId) return

          setSelectedDepartmentId((currentDepartmentId) => {
            if (currentDepartmentId === String(topDepartmentId)) return currentDepartmentId

            setSelectedSlotId(null)
            setSlotStatus('loading')
            return String(topDepartmentId)
          })
        })
        .catch(() => {
          if (!active) return

          setRecommendedDepartments([])
          setRecommendationStatus('error')
        })
    }, 250)

    return () => {
      active = false
      window.clearTimeout(timeoutId)
    }
  }, [matchedSymptoms, selectedDoctorId])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAppointments()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [loadAppointments])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadFeedback()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [loadFeedback])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadSlots()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [loadSlots])

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
    setSelectedDoctorId('')
    setSelectedDoctorName('')
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)
      nextParams.delete('doctor_id')
      nextParams.delete('doctor_name')
      return nextParams
    }, { replace: true })
    setSelectedDepartmentId(departmentId)
    setSelectedSlotId(null)
    setSlotStatus('loading')
  }, [setSearchParams])

  const clearSelectedDoctor = useCallback(() => {
    setSelectedDoctorId('')
    setSelectedDoctorName('')
    setSelectedSlotId(null)
    setSlotStatus('loading')
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)
      nextParams.delete('doctor_id')
      nextParams.delete('doctor_name')
      return nextParams
    }, { replace: true })
  }, [setSearchParams])

  const selectSlot = useCallback((slot: AppointmentSlot) => {
    setSelectedSlotId(slot.id)
    setBookingError('')
    setBookingSuccess('')
  }, [])

  const submitAppointment = useCallback(async () => {
    setBookingError('')
    setBookingSuccess('')

    if (!storedUser) {
      setBookingError('Vui lòng đăng nhập bằng tài khoản bệnh nhân để gửi đặt lịch.')
      return
    }

    if (storedUser.role !== 'PATIENT') {
      setBookingError('Chỉ tài khoản bệnh nhân mới có thể gửi đặt lịch hẹn.')
      return
    }

    if (!selectedSlot) {
      setBookingError('Vui lòng chọn một khung giờ còn trống.')
      return
    }

    try {
      const result = await createMyAppointment({
        reason: reason.trim() || null,
        slot_id: selectedSlot.id,
      })
      setReason('')
      setSelectedSlotId(null)
      setBookingSuccess('Lịch hẹn đã được tạo, vui lòng quét QR để thanh toán.')
      await Promise.all([loadSlots(), loadAppointments()])

      const paymentId = result.payment?.id
      if (!paymentId) {
        throw new Error('Lịch hẹn đã tạo nhưng chưa nhận được mã thanh toán. Vui lòng kiểm tra API tạo payment.')
      }

      navigate(`/payments/${paymentId}`)
    } catch (requestError) {
      handleRequestError(requestError, 'Không thể đặt lịch hẹn.')
    }
  }, [handleRequestError, loadAppointments, loadSlots, navigate, reason, selectedSlot, storedUser])

  const cancelMyAppointment = useCallback(async (appointment: Appointment) => {
    if (!['PENDING_PAYMENT', 'PENDING', 'CONFIRMED'].includes(appointment.status)) return

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

  const submitAppointmentFeedback = useCallback(async (
    appointment: Appointment,
    payload: { rating: number; comment?: string | null }
  ) => {
    setFeedbackError('')
    setFeedbackSuccess('')

    if (!storedUser) {
      setFeedbackError('Vui lòng đăng nhập bằng tài khoản bệnh nhân để gửi đánh giá.')
      return false
    }

    if (storedUser.role !== 'PATIENT') {
      setFeedbackError('Chỉ tài khoản bệnh nhân mới có thể gửi đánh giá.')
      return false
    }

    if (appointment.status !== 'COMPLETED') {
      setFeedbackError('Chỉ có thể đánh giá lịch hẹn đã hoàn tất.')
      return false
    }

    if (!Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5) {
      setFeedbackError('Vui lòng chọn số sao từ 1 đến 5.')
      return false
    }

    setFeedbackActionId(appointment.id)

    try {
      await createFeedback({
        appointmentId: appointment.id,
        comment: payload.comment?.trim() || null,
        rating: payload.rating,
      })
      setFeedbackSuccess('Đánh giá của bạn đã được gửi.')
      await loadFeedback()
      return true
    } catch (requestError) {
      handleFeedbackError(requestError, 'Không thể gửi đánh giá.')
      return false
    } finally {
      setFeedbackActionId(null)
    }
  }, [handleFeedbackError, loadFeedback, storedUser])

  return {
    appointmentActionId,
    appointmentStatus,
    appointments,
    bookingError,
    bookingSuccess,
    cancelMyAppointment,
    clearSelectedDoctor,
    departmentStatus,
    departments,
    feedback,
    feedbackActionId,
    feedbackError,
    feedbackStatus,
    feedbackSuccess,
    loadAppointments,
    loadFeedback,
    loadSlots,
    matchedSymptoms,
    reason,
    recommendedDepartments,
    recommendationStatus,
    selectedDate,
    selectedDepartmentId,
    selectedDoctorId,
    selectedDoctorName,
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
    submitAppointmentFeedback,
    upcomingDays,
  }
}
