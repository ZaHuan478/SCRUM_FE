import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import PatientAppointmentCard from '../../Molecules/PatientAppointments/PatientAppointmentCard'
import type { Appointment } from '../../../services/appointment.service'
import type { Feedback } from '../../../services/feedback.service'
import type { LoadStatus } from '../../../utils/patientAppointments'

type PatientAppointmentHistoryPanelProps = {
  actionId: number | string | null
  appointments: Appointment[]
  feedback: Feedback[]
  feedbackActionId: number | string | null
  feedbackError: string
  feedbackStatus: LoadStatus
  feedbackSuccess: string
  status: LoadStatus
  onCancel: (appointment: Appointment) => void
  onRefresh: () => void
  onSubmitFeedback: (
    appointment: Appointment,
    payload: { rating: number; comment?: string | null }
  ) => Promise<boolean>
}

const PatientAppointmentHistoryPanel = ({
  actionId,
  appointments,
  feedback,
  feedbackActionId,
  feedbackError,
  feedbackStatus,
  feedbackSuccess,
  status,
  onCancel,
  onRefresh,
  onSubmitFeedback,
}: PatientAppointmentHistoryPanelProps) => (
  <section className="flex flex-col gap-md rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm lg:col-span-5">
    <div className="flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-sm">
          <Icon className="text-primary" name="event_note" />
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Lịch hẹn đã đặt</h2>
        </div>
        <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Theo dõi lịch đang chờ, đã xác nhận và đã khám.</p>
      </div>
      <Button
        className="inline-flex items-center justify-center gap-xs px-md py-sm"
        disabled={status === 'loading' || feedbackStatus === 'loading'}
        fullWidth={false}
        onClick={onRefresh}
        type="button"
        variant="ghost"
      >
        <Icon className="text-lg" name="refresh" />
        Làm mới
      </Button>
    </div>

    {status === 'loading' && (
      <p className="rounded-lg bg-surface-container px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
        Đang tải lịch hẹn...
      </p>
    )}

    {status === 'error' && (
      <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
        Không thể tải lịch hẹn của bạn.
      </p>
    )}

    {feedbackStatus === 'error' && (
      <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
        Không thể tải đánh giá của bạn.
      </p>
    )}

    {feedbackError && (
      <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
        {feedbackError}
      </p>
    )}

    {feedbackSuccess && (
      <p className="rounded-lg bg-secondary-fixed px-md py-sm font-body-sm text-body-sm text-on-secondary-fixed">
        {feedbackSuccess}
      </p>
    )}

    {status !== 'loading' && appointments.length === 0 && (
      <div className="rounded-lg border border-dashed border-outline-variant px-md py-xl text-center">
        <Icon className="text-4xl text-outline" name="calendar_add_on" />
        <p className="mt-sm font-label-md text-label-md text-on-surface">Bạn chưa có lịch hẹn</p>
        <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Chọn khung giờ bên cạnh để gửi đặt lịch đầu tiên.</p>
      </div>
    )}

    {appointments.length > 0 && (
      <div className="flex flex-col gap-sm">
        {appointments.map((appointment) => (
          <PatientAppointmentCard
            appointment={appointment}
            feedback={feedback.find((item) => String(item.appointment_id) === String(appointment.id))}
            feedbackActionId={feedbackActionId}
            isActing={String(actionId || '') === String(appointment.id)}
            isFeedbackLoading={feedbackStatus === 'loading'}
            key={appointment.id}
            onCancel={onCancel}
            onSubmitFeedback={onSubmitFeedback}
          />
        ))}
      </div>
    )}
  </section>
)

export default PatientAppointmentHistoryPanel
