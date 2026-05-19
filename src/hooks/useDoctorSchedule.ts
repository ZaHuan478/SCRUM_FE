import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { Appointment } from '../services/appointment.service'
import { completeAppointment, confirmAppointment, getAppointments } from '../services/appointment.service'
import {
  changeAppointmentSlotStatus,
  createAppointmentSlot,
  deleteAppointmentSlot,
  getAppointmentSlots,
  updateAppointmentSlot,
} from '../services/appointmentSlot.service'
import type { AppointmentSlot, AppointmentSlotStatus } from '../services/appointmentSlot.service'
import type { User } from '../services/auth.service'
import { getDoctorAssignments } from '../services/doctorAssignment.service'
import type { DoctorAssignment } from '../services/doctorAssignment.service'
import { getDoctorByUserId } from '../services/doctor.service'
import type { Doctor } from '../services/doctor.service'
import type { Feedback } from '../services/feedback.service'
import { getDoctorFeedback } from '../services/feedback.service'
import {
  buildDaySummaryMap,
  buildEmptySlotForm,
  buildScheduleStats,
  buildUpcomingDays,
  dateFromKey,
  formatSlotRange,
  getDateKey,
  getErrorMessage,
  getTimeInputValue,
  getTimeMinutes,
  isAuthFailure,
  isFullDayBlock,
  longDateFormatter,
  sortSlots,
  summarizeSlots,
  toApiDateTime,
} from '../utils/doctorSchedule'
import type { DaySummary, DoctorScheduleStat, LoadStatus, SlotFormState } from '../utils/doctorSchedule'

type DayAction = 'busy' | 'free' | null

type UseDoctorScheduleOptions = {
  storedUser: User
  onAuthFailure: () => void
}

type DoctorScheduleData = {
  activeAssignment: DoctorAssignment | null
  appointments: Appointment[]
  doctor: Doctor
  feedback: Feedback[]
  slots: AppointmentSlot[]
}

export type DoctorScheduleState = {
  activeAssignment: DoctorAssignment | null
  appointmentActionId: number | string | null
  appointments: Appointment[]
  dayAction: DayAction
  daySummaryMap: Map<string, DaySummary>
  doctor: Doctor | null
  editingSlot: AppointmentSlot | null
  error: string
  feedback: Feedback[]
  form: SlotFormState
  isSaving: boolean
  loadSchedule: () => Promise<void>
  scheduleStats: DoctorScheduleStat[]
  selectedDate: string
  selectedDateLabel: string
  selectedDaySlots: AppointmentSlot[]
  selectedDayAppointments: Appointment[]
  selectedSummary: DaySummary
  slotActionId: number | string | null
  status: LoadStatus
  success: string
  todayKey: string
  upcomingDays: Date[]
  handleDateChange: (date: string) => void
  handleDeleteSlot: (slot: AppointmentSlot) => Promise<void>
  handleEditSlot: (slot: AppointmentSlot) => void
  handleMarkDayBusy: () => Promise<void>
  handleMarkDayFree: () => Promise<void>
  handleConfirmAppointment: (appointment: Appointment) => Promise<void>
  handleCompleteAppointment: (appointment: Appointment) => Promise<void>
  handleSlotStatusChange: (slot: AppointmentSlot, nextStatus: AppointmentSlotStatus) => Promise<void>
  handleSlotSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  resetForm: () => void
  updateField: (field: keyof SlotFormState, value: string) => void
}

export const useDoctorSchedule = ({ storedUser, onAuthFailure }: UseDoctorScheduleOptions): DoctorScheduleState => {
  const todayKey = useMemo(() => getDateKey(new Date()), [])
  const upcomingDays = useMemo(() => buildUpcomingDays(), [])
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [activeAssignment, setActiveAssignment] = useState<DoctorAssignment | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [slots, setSlots] = useState<AppointmentSlot[]>([])
  const [selectedDate, setSelectedDate] = useState(todayKey)
  const [form, setForm] = useState<SlotFormState>(() => buildEmptySlotForm(todayKey))
  const [editingSlot, setEditingSlot] = useState<AppointmentSlot | null>(null)
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [slotActionId, setSlotActionId] = useState<number | string | null>(null)
  const [appointmentActionId, setAppointmentActionId] = useState<number | string | null>(null)
  const [dayAction, setDayAction] = useState<DayAction>(null)

  const handleRequestError = useCallback((requestError: unknown, fallback: string) => {
    if (isAuthFailure(requestError)) {
      onAuthFailure()
      return
    }

    setError(getErrorMessage(requestError, fallback))
  }, [onAuthFailure])

  const fetchSchedule = useCallback(async (): Promise<DoctorScheduleData> => {
    const doctorProfile = await getDoctorByUserId(storedUser.id)
    const [assignmentsResult, feedbackResult] = await Promise.all([
      getDoctorAssignments({
        doctor_id: doctorProfile.id,
        limit: 10,
        status: 'ACTIVE',
      }),
      getDoctorFeedback(doctorProfile.id, { limit: 100 }),
    ])
    const assignment = assignmentsResult.doctor_assignments[0] || null
    const [slotsResult, appointmentsResult] = assignment
      ? await Promise.all([
        getAppointmentSlots({ doctor_id: doctorProfile.id, limit: 100 }),
        getAppointments({ doctor_id: doctorProfile.id, limit: 100 }),
      ])
      : [null, null]

    return {
      activeAssignment: assignment,
      appointments: appointmentsResult?.appointments || [],
      doctor: doctorProfile,
      feedback: feedbackResult.feedback,
      slots: sortSlots(slotsResult?.appointment_slots || []),
    }
  }, [storedUser.id])

  const applyScheduleData = useCallback((scheduleData: DoctorScheduleData) => {
    setDoctor(scheduleData.doctor)
    setActiveAssignment(scheduleData.activeAssignment)
    setAppointments(scheduleData.appointments)
    setFeedback(scheduleData.feedback)
    setSlots(scheduleData.slots)
    setStatus('ready')
  }, [])

  const loadSchedule = useCallback(async () => {
    setStatus('loading')
    setError('')

    try {
      applyScheduleData(await fetchSchedule())
    } catch (requestError) {
      if (isAuthFailure(requestError)) {
        onAuthFailure()
        return
      }

      setStatus('error')
      setError(getErrorMessage(requestError, 'Không thể tải lịch khám.'))
    }
  }, [applyScheduleData, fetchSchedule, onAuthFailure])

  useEffect(() => {
    let active = true

    fetchSchedule()
      .then((scheduleData) => {
        if (!active) return
        applyScheduleData(scheduleData)
      })
      .catch((requestError: unknown) => {
        if (!active) return

        if (isAuthFailure(requestError)) {
          onAuthFailure()
          return
        }

        setStatus('error')
        setError(getErrorMessage(requestError, 'Không thể tải lịch khám.'))
      })

    return () => {
      active = false
    }
  }, [applyScheduleData, fetchSchedule, onAuthFailure])

  const daySummaryMap = useMemo(() => (
    buildDaySummaryMap(upcomingDays, slots)
  ), [slots, upcomingDays])

  const selectedDaySlots = useMemo(() => (
    sortSlots(slots.filter((slot) => getDateKey(slot.start_time) === selectedDate))
  ), [selectedDate, slots])

  const selectedDayAppointments = useMemo(() => (
    appointments.filter((appointment) => (
      appointment.slot?.start_time && getDateKey(appointment.slot.start_time) === selectedDate
    ))
  ), [appointments, selectedDate])

  const selectedSummary = useMemo(() => summarizeSlots(selectedDaySlots), [selectedDaySlots])

  const scheduleStats = useMemo(() => (
    buildScheduleStats({ activeAssignment, slots, todayKey })
  ), [activeAssignment, slots, todayKey])

  const selectedDateLabel = useMemo(() => (
    longDateFormatter.format(dateFromKey(selectedDate))
  ), [selectedDate])

  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date)
    if (editingSlot) return

    setForm((currentForm) => ({
      ...currentForm,
      date,
    }))
  }, [editingSlot])

  const updateField = useCallback((field: keyof SlotFormState, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }, [])

  const resetForm = useCallback(() => {
    setEditingSlot(null)
    setForm(buildEmptySlotForm(selectedDate))
  }, [selectedDate])

  const handleSlotSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!activeAssignment) {
      setError('Bác sĩ cần được gán khoa đang hoạt động trước khi mở lịch khám.')
      return
    }

    if (getTimeMinutes(form.startTime) >= getTimeMinutes(form.endTime)) {
      setError('Giờ bắt đầu phải nhỏ hơn giờ kết thúc.')
      return
    }

    const maxPatients = Number(form.maxPatients)
    if (!Number.isInteger(maxPatients) || maxPatients <= 0) {
      setError('Sức chứa phải là số nguyên lớn hơn 0.')
      return
    }

    const payload = {
      end_time: toApiDateTime(form.date, form.endTime),
      max_patients: maxPatients,
      start_time: toApiDateTime(form.date, form.startTime),
      status: form.status,
    }

    setIsSaving(true)

    try {
      if (editingSlot) {
        await updateAppointmentSlot(editingSlot.id, payload)
        setSuccess('Khung giờ đã được cập nhật.')
      } else {
        await createAppointmentSlot({
          ...payload,
          doctor_assignment_id: activeAssignment.id,
        })
        setSuccess('Khung giờ đã được thêm.')
      }

      setSelectedDate(form.date)
      setEditingSlot(null)
      setForm(buildEmptySlotForm(form.date))
      await loadSchedule()
    } catch (requestError) {
      handleRequestError(requestError, 'Không thể lưu khung giờ.')
    } finally {
      setIsSaving(false)
    }
  }, [activeAssignment, editingSlot, form, handleRequestError, loadSchedule])

  const handleEditSlot = useCallback((slot: AppointmentSlot) => {
    const slotDate = getDateKey(slot.start_time)
    setSelectedDate(slotDate)
    setEditingSlot(slot)
    setError('')
    setSuccess('')
    setForm({
      date: slotDate,
      endTime: getTimeInputValue(slot.end_time),
      maxPatients: String(slot.max_patients || 1),
      startTime: getTimeInputValue(slot.start_time),
      status: slot.status === 'CANCELLED' ? 'CANCELLED' : 'AVAILABLE',
    })
  }, [])

  const handleSlotStatusChange = useCallback(async (slot: AppointmentSlot, nextStatus: AppointmentSlotStatus) => {
    setError('')
    setSuccess('')
    setSlotActionId(slot.id)

    try {
      await changeAppointmentSlotStatus(slot.id, nextStatus)
      setSuccess(nextStatus === 'CANCELLED' ? 'Khung giờ đã được đánh dấu bận.' : 'Khung giờ đã được mở lại.')
      await loadSchedule()
    } catch (requestError) {
      handleRequestError(requestError, 'Không thể cập nhật trạng thái khung giờ.')
    } finally {
      setSlotActionId(null)
    }
  }, [handleRequestError, loadSchedule])

  const handleDeleteSlot = useCallback(async (slot: AppointmentSlot) => {
    setError('')
    setSuccess('')

    if (Number(slot.booked_count || 0) > 0) {
      setError('Không thể xóa khung giờ đã có bệnh nhân đặt lịch.')
      return
    }

    if (!window.confirm(`Xóa khung giờ ${formatSlotRange(slot)}?`)) return

    setSlotActionId(slot.id)

    try {
      await deleteAppointmentSlot(slot.id)
      if (editingSlot && String(editingSlot.id) === String(slot.id)) resetForm()
      setSuccess('Khung giờ đã được xóa.')
      await loadSchedule()
    } catch (requestError) {
      handleRequestError(requestError, 'Không thể xóa khung giờ.')
    } finally {
      setSlotActionId(null)
    }
  }, [editingSlot, handleRequestError, loadSchedule, resetForm])

  const handleMarkDayBusy = useCallback(async () => {
    setError('')
    setSuccess('')

    if (!activeAssignment) {
      setError('Bác sĩ cần được gán khoa đang hoạt động trước khi khóa ngày.')
      return
    }

    setDayAction('busy')

    try {
      if (selectedDaySlots.length === 0) {
        await createAppointmentSlot({
          doctor_assignment_id: activeAssignment.id,
          end_time: toApiDateTime(selectedDate, '23:59'),
          max_patients: 1,
          start_time: toApiDateTime(selectedDate, '00:00'),
          status: 'CANCELLED',
        })
      } else {
        await Promise.all(
          selectedDaySlots
            .filter((slot) => slot.status !== 'CANCELLED')
            .map((slot) => changeAppointmentSlotStatus(slot.id, 'CANCELLED'))
        )
      }

      setSuccess('Ngày đã được đánh dấu bận.')
      await loadSchedule()
    } catch (requestError) {
      handleRequestError(requestError, 'Không thể đánh dấu ngày bận.')
    } finally {
      setDayAction(null)
    }
  }, [activeAssignment, handleRequestError, loadSchedule, selectedDate, selectedDaySlots])

  const handleMarkDayFree = useCallback(async () => {
    setError('')
    setSuccess('')

    const cancelledSlots = selectedDaySlots.filter((slot) => slot.status === 'CANCELLED')
    if (cancelledSlots.length === 0) {
      setSuccess('Ngày này hiện không có khung bận.')
      return
    }

    setDayAction('free')

    try {
      await Promise.all(
        cancelledSlots.map((slot) => (
          isFullDayBlock(slot) && Number(slot.booked_count || 0) === 0
            ? deleteAppointmentSlot(slot.id)
            : changeAppointmentSlotStatus(slot.id, 'AVAILABLE')
        ))
      )

      setSuccess('Ngày đã được mở lại.')
      await loadSchedule()
    } catch (requestError) {
      handleRequestError(requestError, 'Không thể mở lại ngày.')
    } finally {
      setDayAction(null)
    }
  }, [handleRequestError, loadSchedule, selectedDaySlots])

  const handleConfirmAppointment = useCallback(async (appointment: Appointment) => {
    if (appointment.status !== 'PENDING') return

    setError('')
    setSuccess('')
    setAppointmentActionId(appointment.id)

    try {
      await confirmAppointment(appointment.id)
      setSuccess('Lịch khám đã được xác nhận.')
      await loadSchedule()
    } catch (requestError) {
      handleRequestError(requestError, 'Không thể xác nhận lịch khám.')
    } finally {
      setAppointmentActionId(null)
    }
  }, [handleRequestError, loadSchedule])

  const handleCompleteAppointment = useCallback(async (appointment: Appointment) => {
    if (appointment.status !== 'CONFIRMED') return

    setError('')
    setSuccess('')
    setAppointmentActionId(appointment.id)

    try {
      await completeAppointment(appointment.id)
      setSuccess('Lịch khám đã được hoàn tất.')
      await loadSchedule()
    } catch (requestError) {
      handleRequestError(requestError, 'Không thể hoàn tất lịch khám.')
    } finally {
      setAppointmentActionId(null)
    }
  }, [handleRequestError, loadSchedule])

  return {
    activeAssignment,
    appointmentActionId,
    appointments,
    dayAction,
    daySummaryMap,
    doctor,
    editingSlot,
    error,
    feedback,
    form,
    handleDateChange,
    handleDeleteSlot,
    handleEditSlot,
    handleMarkDayBusy,
    handleMarkDayFree,
    handleConfirmAppointment,
    handleCompleteAppointment,
    handleSlotStatusChange,
    handleSlotSubmit,
    isSaving,
    loadSchedule,
    resetForm,
    scheduleStats,
    selectedDate,
    selectedDayAppointments,
    selectedDateLabel,
    selectedDaySlots,
    selectedSummary,
    slotActionId,
    status,
    success,
    todayKey,
    upcomingDays,
    updateField,
  }
}
