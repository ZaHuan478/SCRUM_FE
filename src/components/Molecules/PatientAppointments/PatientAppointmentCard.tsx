import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import type { Appointment } from '../../../services/appointment.service'
import type { Feedback } from '../../../services/feedback.service'
import {
  appointmentStatusMeta,
  formatAppointmentDate,
  formatAppointmentTime,
  getAppointmentDepartmentName,
  getAppointmentDoctorName,
} from '../../../utils/patientAppointments'

type PatientAppointmentCardProps = {
  appointment: Appointment
  feedback?: Feedback
  feedbackActionId: number | string | null
  isFeedbackLoading: boolean
  isActing: boolean
  onCancel: (appointment: Appointment) => void
  onSubmitFeedback: (
    appointment: Appointment,
    payload: { rating: number; comment?: string | null }
  ) => Promise<boolean>
}

const ratingValues = [1, 2, 3, 4, 5]

const feedbackDateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const PatientAppointmentCard = ({
  appointment,
  feedback,
  feedbackActionId,
  isFeedbackLoading,
  isActing,
  onCancel,
  onSubmitFeedback,
}: PatientAppointmentCardProps) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [localError, setLocalError] = useState('')
  const meta = appointmentStatusMeta[appointment.status]
  const canCancel = appointment.status === 'PENDING' || appointment.status === 'CONFIRMED'
  const canSubmitFeedback = appointment.status === 'COMPLETED' && !feedback && !isFeedbackLoading
  const isFeedbackActing = String(feedbackActionId || '') === String(appointment.id)

  const handleSubmitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError('')

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setLocalError('Vui lòng chọn số sao từ 1 đến 5.')
      return
    }

    const submitted = await onSubmitFeedback(appointment, {
      comment: comment.trim() || null,
      rating,
    })

    if (!submitted) return

    setComment('')
    setRating(5)
    setIsFeedbackOpen(false)
  }

  return (
    <article className="rounded-lg border border-outline-variant/30 bg-surface p-md">
      <div className="flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-sm">
            <h3 className="font-label-md text-label-md text-on-surface">{getAppointmentDoctorName(appointment)}</h3>
            <span className={`inline-flex items-center gap-xs rounded-full px-md py-xs font-body-sm text-body-sm ${meta.className}`}>
              <Icon className="text-lg" name={meta.icon} />
              {meta.label}
            </span>
          </div>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{getAppointmentDepartmentName(appointment)}</p>
        </div>
        <div className="flex flex-wrap gap-sm">
          {canSubmitFeedback && (
            <Button
              className="px-md py-sm"
              disabled={isFeedbackActing}
              fullWidth={false}
              onClick={() => setIsFeedbackOpen((current) => !current)}
              type="button"
              variant="ghost"
            >
              Đánh giá
            </Button>
          )}
          {canCancel && (
            <Button
              className="border-none px-md py-sm text-error"
              disabled={isActing}
              fullWidth={false}
              isLoading={isActing}
              onClick={() => onCancel(appointment)}
              type="button"
              variant="ghost"
            >
              Há»§y lá»‹ch
            </Button>
          )}
        </div>
      </div>

      <div className="mt-md grid grid-cols-1 gap-sm border-t border-outline-variant/30 pt-md sm:grid-cols-2">
        <p className="inline-flex items-center gap-xs font-body-sm text-body-sm text-on-surface">
          <Icon className="text-lg text-primary" name="calendar_month" />
          {formatAppointmentDate(appointment)}
        </p>
        <p className="inline-flex items-center gap-xs font-body-sm text-body-sm text-on-surface">
          <Icon className="text-lg text-primary" name="schedule" />
          {formatAppointmentTime(appointment)}
        </p>
      </div>

      {appointment.reason && (
        <p className="mt-md rounded-lg bg-surface-container px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
          {appointment.reason}
        </p>
      )}

      {feedback && (
        <div className="mt-md border-t border-outline-variant/30 pt-md">
          <div className="flex flex-wrap items-center justify-between gap-sm">
            <p className="font-label-md text-label-md text-on-surface">Đánh giá đã gửi</p>
            {feedback.created_at && (
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {feedbackDateFormatter.format(new Date(feedback.created_at))}
              </span>
            )}
          </div>
          <div className="mt-xs flex items-center gap-xs text-primary">
            {ratingValues.map((value) => (
              <Icon
                className={value <= feedback.rating ? 'text-xl text-primary' : 'text-xl text-outline'}
                key={value}
                name="star"
              />
            ))}
          </div>
          {feedback.comment && (
            <p className="mt-sm rounded-lg bg-surface-container px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
              {feedback.comment}
            </p>
          )}
        </div>
      )}

      {canSubmitFeedback && isFeedbackOpen && (
        <form className="mt-md flex flex-col gap-md border-t border-outline-variant/30 pt-md" onSubmit={handleSubmitFeedback}>
          <div>
            <p className="font-label-md text-label-md text-on-surface">Chọn số sao</p>
            <div className="mt-xs flex gap-xs">
              {ratingValues.map((value) => (
                <button
                  aria-label={`${value} sao`}
                  className="rounded-full p-xs text-primary transition-colors hover:bg-primary-fixed"
                  key={value}
                  onClick={() => {
                    setRating(value)
                    setLocalError('')
                  }}
                  type="button"
                >
                  <Icon className={value <= rating ? 'text-2xl text-primary' : 'text-2xl text-outline'} name="star" />
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-xs font-body-sm text-body-sm text-on-surface">
            Nhận xét
            <textarea
              className="min-h-24 rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm font-body-md text-body-md text-on-surface outline-none transition-colors focus:border-primary"
              onChange={(event) => setComment(event.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn"
              value={comment}
            />
          </label>

          {localError && (
            <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
              {localError}
            </p>
          )}

          <div className="flex flex-wrap gap-sm">
            <Button
              className="px-md py-sm"
              disabled={isFeedbackActing}
              fullWidth={false}
              isLoading={isFeedbackActing}
              type="submit"
            >
              Gửi đánh giá
            </Button>
            <Button
              className="px-md py-sm"
              disabled={isFeedbackActing}
              fullWidth={false}
              onClick={() => setIsFeedbackOpen(false)}
              type="button"
              variant="ghost"
            >
              Đóng
            </Button>
          </div>
        </form>
      )}
    </article>
  )
}

export default PatientAppointmentCard
