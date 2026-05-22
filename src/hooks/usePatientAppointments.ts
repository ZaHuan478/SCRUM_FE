import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Appointment } from '../services/appointment.service'
import { cancelAppointment, createMyAppointment, getMyAppointments } from '../services/appointment.service'
import type { AppointmentSlot } from '../services/appointmentSlot.service'
import { getAppointmentSlots } from '../services/appointmentSlot.service'
import type { User } from '../services/auth.service'
import type { Department } from '../services/department.service'
import { getDepartments } from '../services/department.service'
import { recommendDepartmentsBySymptoms } from '../services/departmentSymptomRule.service'
import type { RecommendedDepartment } from '../services/departmentSymptomRule.service'
import type { Symptom } from '../services/symptom.service'
import { getSymptoms } from '../services/symptom.service'
import {
  buildAppointmentStats,
  buildUpcomingDays,
  emptyPatientAppointmentPagination,
  findMatchingSymptoms,
  isAuthFailure,
  isSlotUpcoming,
  patientAppointmentPageLimit,
  sortAppointmentsByTime,
  sortSlotsByTime,
  toPatientAppointmentPagination,
} from '../utils/patientAppointments'
import type { LoadStatus, PatientAppointmentStat } from '../utils/patientAppointments'
import type { PatientAppointmentPagination } from '../utils/patientAppointments'
import { getPaymentPolicyForSlot } from '../utils/paymentPolicy'
import type { PaymentPolicy } from '../utils/paymentPolicy'
import type { Payment } from '../types/payment'
import { useToast } from '../contexts/ToastContext'

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
  appointmentPagination: PatientAppointmentPagination
  appointmentStatus: LoadStatus
  appointments: Appointment[]
  bookingError: string
  bookingSuccess: string
  departments: Department[]
  departmentStatus: LoadStatus
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
  selectedPaymentPolicy: PaymentPolicy
  paymentModalPayment: Payment | null
  slotStatus: LoadStatus
  slots: AppointmentSlot[]
  stats: PatientAppointmentStat[]
  upcomingDays: Date[]
  cancelMyAppointment: (appointment: Appointment) => Promise<void>
  clearSelectedDoctor: () => void
  closePaymentModal: () => void
  loadAppointments: (page?: number) => Promise<void>
  loadSlots: () => Promise<void>
  openPaymentModal: (payment: Payment) => void
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
  const [searchParams, setSearchParams] = useSearchParams()
  const initialDoctorId = searchParams.get('doctor_id') || ''
  const initialDoctorName = searchParams.get('doctor_name') || ''
  const initialDepartmentId = searchParams.get('department_id') || ''
  const upcomingDays = useMemo(() => buildUpcomingDays(), [])
  const [departments, setDepartments] = useState<Department[]>([])
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [recommendedDepartments, setRecommendedDepartments] = useState<RecommendedDepartment[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [statAppointments, setStatAppointments] = useState<Appointment[]>([])
  const [appointmentPagination, setAppointmentPagination] = useState<PatientAppointmentPagination>(emptyPatientAppointmentPagination)
  const [slots, setSlots] = useState<AppointmentSlot[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(initialDepartmentId)
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctorId)
  const [selectedDoctorName, setSelectedDoctorName] = useState(initialDoctorName)
  const [selectedSlotId, setSelectedSlotId] = useState<number | string | null>(null)
  const [reason, setReason] = useState('')
  const [departmentStatus, setDepartmentStatus] = useState<LoadStatus>('loading')
  const [recommendationStatus, setRecommendationStatus] = useState<LoadStatus>('ready')
  const [appointmentStatus, setAppointmentStatus] = useState<LoadStatus>('loading')
  const [slotStatus, setSlotStatus] = useState<LoadStatus>('loading')
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState('')
  const [appointmentActionId, setAppointmentActionId] = useState<number | string | null>(null)
  const [paymentModalPayment, setPaymentModalPayment] = useState<Payment | null>(null)
  const { success: toastSuccess, error: toastError, warning: toastWarning } = useToast()

  const showBookingError = useCallback((message: string) => {
    setBookingError(message)
    toastError(message)
  }, [toastError])

  const showBookingSuccess = useCallback((message: string) => {
    setBookingSuccess(message)
    toastSuccess(message)
  }, [toastSuccess])

  const showBookingWarning = useCallback((message: string) => {
    setBookingError(message)
    toastWarning(message)
  }, [toastWarning])

  const handleRequestError = useCallback((requestError: unknown, fallback: string) => {
    if (isAuthFailure(requestError)) {
      onAuthFailure()
      return
    }

    showBookingError(requestError instanceof Error ? requestError.message : fallback)
  }, [onAuthFailure, showBookingError])

  const loadAppointments = useCallback(async (page = 1) => {
    if (storedUser?.role !== 'PATIENT') {
      setAppointments([])
      setStatAppointments([])
      setAppointmentPagination(emptyPatientAppointmentPagination)
      setAppointmentStatus('ready')
      return
    }

    setAppointmentStatus('loading')

    try {
      const [result, statsResult] = await Promise.all([
        getMyAppointments({ page, limit: patientAppointmentPageLimit }),
        getMyAppointments({ limit: 100 }),
      ])
      setAppointments(sortAppointmentsByTime(result.appointments))
      setStatAppointments(sortAppointmentsByTime(statsResult.appointments))
      setAppointmentPagination(toPatientAppointmentPagination(result.pagination))
      setAppointmentStatus('ready')
    } catch (requestError) {
      if (isAuthFailure(requestError)) {
        onAuthFailure()
        return
      }

      setAppointmentStatus('error')
      toastError('Không thể tải lịch hẹn.')
    }
  }, [onAuthFailure, storedUser?.role, toastError])

  const loadSlots = useCallback(async () => {
    setSlotStatus('loading')

    try {
      const now = new Date().toISOString()
      const result = await getAppointmentSlots({
        date: selectedDate || undefined,
        department_id: selectedDoctorId ? undefined : selectedDepartmentId || undefined,
        doctor_id: selectedDoctorId || undefined,
        limit: 100,
        start_from: now,
        status: 'AVAILABLE',
      })

      setSlots(sortSlotsByTime(result.appointment_slots).filter((slot) => isSlotUpcoming(slot)))
      setSlotStatus('ready')
    } catch (requestError) {
      if (isAuthFailure(requestError)) {
        onAuthFailure()
        return
      }

      setSlots([])
      setSlotStatus('error')
      toastError('Không thể tải khung giờ khám.')
    }
  }, [onAuthFailure, selectedDate, selectedDepartmentId, selectedDoctorId, toastError])

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
        toastError('Không thể tải danh sách khoa.')
      })

    return () => {
      active = false
    }
  }, [toastError])

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
      void loadSlots()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [loadSlots])

  const selectedSlot = useMemo(() => (
    slots.find((slot) => String(slot.id) === String(selectedSlotId)) || null
  ), [selectedSlotId, slots])
  const selectedPaymentPolicy = useMemo(() => getPaymentPolicyForSlot(selectedSlot), [selectedSlot])

  const stats = useMemo(() => buildAppointmentStats(statAppointments), [statAppointments])

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
    if (!isSlotUpcoming(slot)) {
      showBookingWarning('Khung giờ này đã quá giờ. Vui lòng chọn khung giờ khác.')
      void loadSlots()
      return
    }

    setSelectedSlotId(slot.id)
    setBookingError('')
    setBookingSuccess('')
  }, [loadSlots, showBookingWarning])

  const openPaymentModal = useCallback((payment: Payment) => {
    setPaymentModalPayment(payment)
  }, [])

  const closePaymentModal = useCallback(() => {
    setPaymentModalPayment(null)
  }, [])

  const submitAppointment = useCallback(async () => {
    setBookingError('')
    setBookingSuccess('')

    if (!storedUser) {
      showBookingWarning('Vui lòng đăng nhập bằng tài khoản bệnh nhân để gửi đặt lịch.')
      return
    }

    if (storedUser.role !== 'PATIENT') {
      showBookingWarning('Chỉ tài khoản bệnh nhân mới có thể gửi đặt lịch hẹn.')
      return
    }

    if (!selectedSlot) {
      showBookingWarning('Vui lòng chọn một khung giờ còn trống.')
      return
    }

    if (!isSlotUpcoming(selectedSlot)) {
      setSelectedSlotId(null)
      showBookingWarning('Khung giờ đã quá giờ. Vui lòng chọn khung giờ khác.')
      await loadSlots()
      return
    }

    try {
      const result = await createMyAppointment({
        reason: reason.trim() || null,
        slot_id: selectedSlot.id,
      })
      setReason('')
      setSelectedSlotId(null)
      const paymentId = result.payment?.id
      if (!paymentId) {
        throw new Error('Lịch hẹn đã tạo nhưng chưa nhận được mã thanh toán. Vui lòng kiểm tra API tạo payment.')
      }

      showBookingSuccess('Lịch hẹn đã được tạo. Vui lòng hoàn tất thanh toán để xác nhận lịch khám.')
      await Promise.all([loadSlots(), loadAppointments()])
      setPaymentModalPayment(result.payment)
    } catch (requestError) {
      handleRequestError(requestError, 'Không thể đặt lịch hẹn.')
    }
  }, [handleRequestError, loadAppointments, loadSlots, reason, selectedSlot, showBookingSuccess, showBookingWarning, storedUser])

  const cancelMyAppointment = useCallback(async (appointment: Appointment) => {
    if (!['PENDING_PAYMENT', 'PENDING', 'CONFIRMED'].includes(appointment.status)) return

    if (!window.confirm('Bạn muốn hủy lịch hẹn này?')) return

    setAppointmentActionId(appointment.id)
    setBookingError('')
    setBookingSuccess('')

    try {
      await cancelAppointment(appointment.id, { cancel_reason: 'Bệnh nhân hủy lịch hẹn' })
      showBookingSuccess('Lịch hẹn đã được hủy.')
      const nextPage = appointments.length === 1 && appointmentPagination.page > 1
        ? appointmentPagination.page - 1
        : appointmentPagination.page
      await Promise.all([loadAppointments(nextPage), loadSlots()])
    } catch (requestError) {
      handleRequestError(requestError, 'Không thể hủy lịch hẹn.')
    } finally {
      setAppointmentActionId(null)
    }
  }, [appointmentPagination.page, appointments.length, handleRequestError, loadAppointments, loadSlots, showBookingSuccess])

  return {
    appointmentActionId,
    appointmentPagination,
    appointmentStatus,
    appointments,
    bookingError,
    bookingSuccess,
    cancelMyAppointment,
    clearSelectedDoctor,
    closePaymentModal,
    departmentStatus,
    departments,
    loadAppointments,
    loadSlots,
    matchedSymptoms,
    openPaymentModal,
    paymentModalPayment,
    reason,
    recommendedDepartments,
    recommendationStatus,
    selectedDate,
    selectedDepartmentId,
    selectedDoctorId,
    selectedDoctorName,
    selectedSlot,
    selectedSlotId,
    selectedPaymentPolicy,
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
