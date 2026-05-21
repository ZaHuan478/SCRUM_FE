import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createOrUpdateDoctorRating,
  deleteMyDoctorRating,
  getDoctorRatings,
  getDoctorRatingSummary,
  getMyDoctorRating,
} from '../api/doctorRating.api'
import type {
  DoctorRatingItem,
  DoctorRatingSummary as DoctorRatingSummaryData,
  MyDoctorRating,
} from '../api/doctorRating.api'
import { getMyAppointments } from '../services/appointment.service'
import { AUTH_USER_CHANGED_EVENT, getStoredUser } from '../services/auth.service'
import type { User } from '../services/auth.service'
import { getDoctorAssignments } from '../services/doctorAssignment.service'
import type { DoctorAssignment } from '../services/doctorAssignment.service'
import { getDoctorById } from '../services/doctor.service'
import type { Doctor } from '../services/doctor.service'
import {
  buildDoctorBookingPath,
  buildEducation,
  buildFallbackBiography,
} from '../utils/doctorDetail'
import type { EducationItem } from '../utils/doctorDetail'
import { useToast } from '../contexts/ToastContext'

type LoadStatus = 'loading' | 'ready' | 'error'

type SubmitRatingPayload = {
  rating: number
  comment?: string | null
}

export type DoctorDetailState = {
  appointmentId: number | string | null
  assignments: DoctorAssignment[]
  biography: string
  bookingPath: string
  canRate: boolean
  currentUser: User | null
  doctor: Doctor | null
  educationItems: EducationItem[]
  hasDoctorId: boolean
  isSubmittingRating: boolean
  myRating: MyDoctorRating | null
  primarySpecialty: string
  ratingError: string
  ratingHasMore: boolean
  ratingList: DoctorRatingItem[]
  ratingListLoading: boolean
  ratingLoading: boolean
  ratingSuccess: string
  ratingSummary: DoctorRatingSummaryData | null
  status: LoadStatus
  handleDeleteRating: () => Promise<void>
  handleLoadMoreRatings: () => Promise<void>
  handleSubmitRating: (payload: SubmitRatingPayload) => Promise<void>
}

export const useDoctorDetail = (doctorId?: string): DoctorDetailState => {
  const hasDoctorId = Boolean(doctorId)
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [assignments, setAssignments] = useState<DoctorAssignment[]>([])
  const [status, setStatus] = useState<LoadStatus>(() => (doctorId ? 'loading' : 'error'))
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredUser())
  const [ratingSummary, setRatingSummary] = useState<DoctorRatingSummaryData | null>(null)
  const [ratingList, setRatingList] = useState<DoctorRatingItem[]>([])
  const [ratingPage, setRatingPage] = useState(1)
  const [ratingHasMore, setRatingHasMore] = useState(false)
  const [ratingLoading, setRatingLoading] = useState(false)
  const [ratingListLoading, setRatingListLoading] = useState(false)
  const [ratingError, setRatingError] = useState('')
  const [ratingSuccess, setRatingSuccess] = useState('')
  const [isSubmittingRating, setIsSubmittingRating] = useState(false)
  const [myRating, setMyRating] = useState<MyDoctorRating | null>(null)
  const [canRate, setCanRate] = useState(false)
  const [appointmentId, setAppointmentId] = useState<number | string | null>(null)
  const { success: toastSuccess, error: toastError, warning: toastWarning } = useToast()

  const showRatingError = useCallback((message: string) => {
    setRatingError(message)
    toastError(message)
  }, [toastError])

  const showRatingSuccess = useCallback((message: string) => {
    setRatingSuccess(message)
    toastSuccess(message)
  }, [toastSuccess])

  const showRatingWarning = useCallback((message: string) => {
    setRatingError(message)
    toastWarning(message)
  }, [toastWarning])

  useEffect(() => {
    if (!doctorId) return

    let active = true
    const timeoutId = window.setTimeout(() => {
      if (!active) return

      setStatus('loading')

      Promise.all([
        getDoctorById(doctorId),
        getDoctorAssignments({ doctor_id: doctorId, limit: 20, status: 'ACTIVE' }),
      ])
        .then(([nextDoctor, assignmentResult]) => {
          if (!active) return

          setDoctor(nextDoctor)
          setAssignments(assignmentResult.doctor_assignments)
          setStatus('ready')
        })
        .catch(() => {
          if (!active) return

          setDoctor(null)
          setAssignments([])
          setStatus('error')
        })
    }, 0)

    return () => {
      active = false
      window.clearTimeout(timeoutId)
    }
  }, [doctorId])

  useEffect(() => {
    const handleUserChange = (event: Event) => {
      const nextUser = (event as CustomEvent<User | null>).detail
      setCurrentUser(nextUser ?? getStoredUser())
    }

    window.addEventListener(AUTH_USER_CHANGED_EVENT, handleUserChange)

    return () => {
      window.removeEventListener(AUTH_USER_CHANGED_EVENT, handleUserChange)
    }
  }, [])

  const reloadRatings = useCallback(async () => {
    if (!doctorId) return

    try {
      const [summary, list] = await Promise.all([
        getDoctorRatingSummary(doctorId),
        getDoctorRatings(doctorId, { page: 1, limit: 6 }),
      ])

      setRatingSummary(summary)
      setRatingList(list.ratings)
      setRatingHasMore(list.pagination.page < list.pagination.total_pages)
      setRatingPage(1)
    } catch {
      setRatingSummary(null)
      setRatingList([])
      setRatingHasMore(false)
    }
  }, [doctorId])

  useEffect(() => {
    if (!doctorId) return

    let active = true
    const timeoutId = window.setTimeout(() => {
      if (!active) return

      setRatingLoading(true)
      setRatingPage(1)

      Promise.all([
        getDoctorRatingSummary(doctorId),
        getDoctorRatings(doctorId, { page: 1, limit: 6 }),
      ])
        .then(([summary, list]) => {
          if (!active) return

          setRatingSummary(summary)
          setRatingList(list.ratings)
          setRatingHasMore(list.pagination.page < list.pagination.total_pages)
        })
        .catch(() => {
          if (!active) return

          setRatingSummary(null)
          setRatingList([])
          setRatingHasMore(false)
        })
        .finally(() => {
          if (!active) return
          setRatingLoading(false)
        })
    }, 0)

    return () => {
      active = false
      window.clearTimeout(timeoutId)
    }
  }, [doctorId])

  useEffect(() => {
    if (!doctorId) return

    if (!currentUser || currentUser.role !== 'PATIENT') {
      const timeoutId = window.setTimeout(() => {
        setMyRating(null)
        setCanRate(false)
        setAppointmentId(null)
      }, 0)

      return () => {
        window.clearTimeout(timeoutId)
      }
    }

    let active = true

    Promise.all([
      getMyDoctorRating(doctorId),
      getMyAppointments({ doctor_id: doctorId, status: 'COMPLETED', limit: 1, page: 1 }),
    ])
      .then(([ratingData, appointmentResult]) => {
        if (!active) return

        setMyRating(ratingData)
        const latestAppointment = appointmentResult.appointments[0]
        const nextAppointmentId = ratingData?.appointment_id || latestAppointment?.id || null
        setAppointmentId(nextAppointmentId)
        setCanRate(Boolean(nextAppointmentId))
      })
      .catch(() => {
        if (!active) return

        setMyRating(null)
        setCanRate(false)
        setAppointmentId(null)
      })

    return () => {
      active = false
    }
  }, [currentUser, doctorId])

  const handleLoadMoreRatings = useCallback(async () => {
    if (!doctorId || ratingListLoading) return

    const nextPage = ratingPage + 1
    setRatingListLoading(true)

    try {
      const list = await getDoctorRatings(doctorId, { page: nextPage, limit: 6 })
      setRatingList((current) => [...current, ...list.ratings])
      setRatingHasMore(list.pagination.page < list.pagination.total_pages)
      setRatingPage(nextPage)
    } catch {
      setRatingHasMore(false)
    } finally {
      setRatingListLoading(false)
    }
  }, [doctorId, ratingListLoading, ratingPage])

  const handleSubmitRating = useCallback(async ({ rating, comment }: SubmitRatingPayload) => {
    if (!doctorId) return

    setRatingError('')
    setRatingSuccess('')

    if (!rating || rating < 1) {
      showRatingWarning('Vui lòng chọn số sao trước khi gửi đánh giá.')
      return
    }

    if (!appointmentId) {
      showRatingWarning('Bạn cần hoàn thành lịch hẹn trước khi đánh giá.')
      return
    }

    setIsSubmittingRating(true)

    try {
      await createOrUpdateDoctorRating(doctorId, {
        appointmentId,
        rating,
        comment: comment || null,
      })
      showRatingSuccess('Đánh giá đã được gửi thành công.')
      await reloadRatings()
      const latestRating = await getMyDoctorRating(doctorId)
      setMyRating(latestRating)
      if (latestRating?.appointment_id) {
        setAppointmentId(latestRating.appointment_id)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể gửi đánh giá.'
      showRatingError(message)
    } finally {
      setIsSubmittingRating(false)
    }
  }, [appointmentId, doctorId, reloadRatings, showRatingError, showRatingSuccess, showRatingWarning])

  const handleDeleteRating = useCallback(async () => {
    if (!doctorId) return

    setRatingError('')
    setRatingSuccess('')
    setIsSubmittingRating(true)

    try {
      await deleteMyDoctorRating(doctorId)
      showRatingSuccess('Đánh giá đã được xóa.')
      setMyRating(null)
      await reloadRatings()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể xóa đánh giá.'
      showRatingError(message)
    } finally {
      setIsSubmittingRating(false)
    }
  }, [doctorId, reloadRatings, showRatingError, showRatingSuccess])

  const primarySpecialty = assignments[0]?.department?.name || doctor?.description || 'Chuyên khoa'
  const biography = doctor?.prof_biography || buildFallbackBiography(doctor || undefined, primarySpecialty)
  const educationItems = useMemo(() => buildEducation(doctor || undefined, primarySpecialty), [doctor, primarySpecialty])
  const bookingPath = useMemo(() => buildDoctorBookingPath(doctor), [doctor])

  return {
    appointmentId,
    assignments,
    biography,
    bookingPath,
    canRate,
    currentUser,
    doctor,
    educationItems,
    handleDeleteRating,
    handleLoadMoreRatings,
    handleSubmitRating,
    hasDoctorId,
    isSubmittingRating,
    myRating,
    primarySpecialty,
    ratingError,
    ratingHasMore,
    ratingList,
    ratingListLoading,
    ratingLoading,
    ratingSuccess,
    ratingSummary,
    status,
  }
}
