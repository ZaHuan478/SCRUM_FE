import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import type { Appointment } from '../../../services/appointment.service'
import { getTimeInputValue } from '../../../utils/doctorSchedule'

type DoctorAppointmentRequestsPanelProps = {
  actionId: number | string | null
  appointments: Appointment[]
  selectedDateLabel: string
  onConfirm: (appointment: Appointment) => void
  onComplete: (appointment: Appointment) => void
}

const statusMeta: Record<Appointment['status'], { label: string; className: string }> = {
  CANCELLED: {
    className: 'bg-error-container text-on-error-container',
    label: 'Đã hủy',
  },
  COMPLETED: {
    className: 'bg-primary-fixed text-on-primary-fixed',
    label: 'Đã khám',
  },
  CONFIRMED: {
    className: 'bg-secondary-fixed text-on-secondary-fixed',
    label: 'Đã xác nhận',
  },
  PENDING: {
    className: 'bg-tertiary-container text-on-tertiary-container',
    label: 'Chờ xác nhận',
  },
}

const formatAppointmentTime = (appointment: Appointment) => {
  if (!appointment.slot) return 'Chưa có khung giờ'

  return `${getTimeInputValue(appointment.slot.start_time)} - ${getTimeInputValue(appointment.slot.end_time)}`
}

const getPatientName = (appointment: Appointment) => (
  appointment.patient?.user?.full_name
  || appointment.patient?.user?.email
  || `Bệnh nhân #${appointment.patient_id}`
)

const DoctorAppointmentRequestsPanel = ({
  actionId,
  appointments,
  selectedDateLabel,
  onConfirm,
  onComplete,
}: DoctorAppointmentRequestsPanelProps) => {
  const activeAppointments = appointments.filter((appointment) => appointment.status !== 'CANCELLED')

  return (
    <section className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
      <div className="mb-lg flex flex-col gap-md md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-sm">
            <Icon className="text-primary" name="fact_check" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Lịch bệnh nhân</h2>
          </div>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{selectedDateLabel}</p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <span className="rounded-full bg-tertiary-container px-md py-xs font-body-sm text-body-sm text-on-tertiary-container">
            {appointments.filter((appointment) => appointment.status === 'PENDING').length} chờ xác nhận
          </span>
          <span className="rounded-full bg-secondary-fixed px-md py-xs font-body-sm text-body-sm text-on-secondary-fixed">
            {appointments.filter((appointment) => appointment.status === 'CONFIRMED').length} đã xác nhận
          </span>
        </div>
      </div>

      {activeAppointments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-outline-variant px-md py-xl text-center">
          <Icon className="text-4xl text-outline" name="event_available" />
          <p className="mt-sm font-label-md text-label-md text-on-surface">Chưa có bệnh nhân đặt lịch trong ngày này</p>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Khi bệnh nhân đặt lịch, yêu cầu xác nhận sẽ xuất hiện tại đây.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-sm lg:grid-cols-2">
          {activeAppointments.map((appointment) => {
            const meta = statusMeta[appointment.status]
            const isActing = String(actionId || '') === String(appointment.id)

            return (
              <article className="rounded-lg border border-outline-variant/30 bg-surface p-md" key={appointment.id}>
                <div className="flex flex-col gap-sm sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-sm">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">{getPatientName(appointment)}</h3>
                      <span className={`rounded-full px-sm py-xs font-label-sm text-label-sm ${meta.className}`}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{formatAppointmentTime(appointment)}</p>
                  </div>
                  <Icon className="text-primary" name="person" />
                </div>

                {appointment.reason && (
                  <p className="mt-md rounded-lg bg-surface-container px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
                    {appointment.reason}
                  </p>
                )}

                <div className="mt-md flex flex-wrap gap-sm">
                  {appointment.status === 'PENDING' && (
                    <Button
                      className="inline-flex items-center justify-center gap-xs px-md py-sm"
                      disabled={isActing}
                      fullWidth={false}
                      isLoading={isActing}
                      onClick={() => onConfirm(appointment)}
                      type="button"
                    >
                      <Icon className="text-lg" name="check_circle" />
                      Xác nhận khám
                    </Button>
                  )}
                  {appointment.status === 'CONFIRMED' && (
                    <Button
                      className="inline-flex items-center justify-center gap-xs px-md py-sm"
                      disabled={isActing}
                      fullWidth={false}
                      isLoading={isActing}
                      onClick={() => onComplete(appointment)}
                      type="button"
                      variant="ghost"
                    >
                      <Icon className="text-lg" name="task_alt" />
                      Hoàn tất khám
                    </Button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default DoctorAppointmentRequestsPanel
