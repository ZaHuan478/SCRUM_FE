import { useMemo, useState } from 'react'
import Icon from '../../Atoms/Icon'
import type { Appointment } from '../../../services/appointment.service'
import type { LoadStatus } from '../../../utils/doctorSchedule'
import {
  formatSlotRange,
  getDateKey,
  longDateFormatter,
} from '../../../utils/doctorSchedule'

type DoctorAppointmentHistoryPanelProps = {
  appointments: Appointment[]
  status: LoadStatus
}

const historyStatuses: Appointment['status'][] = ['COMPLETED', 'CANCELLED']
const visibleHistoryLimit = 6

const statusMeta: Record<Appointment['status'], { label: string; className: string; icon: string }> = {
  PENDING_PAYMENT: {
    className: 'bg-tertiary-container text-on-tertiary-container',
    icon: 'qr_code_2',
    label: 'Chờ thanh toán',
  },
  CANCELLED: {
    className: 'bg-error-container text-on-error-container',
    icon: 'event_busy',
    label: 'Đã hủy',
  },
  COMPLETED: {
    className: 'bg-primary-fixed text-on-primary-fixed',
    icon: 'task_alt',
    label: 'Đã khám',
  },
  CONFIRMED: {
    className: 'bg-secondary-fixed text-on-secondary-fixed',
    icon: 'event_available',
    label: 'Đã xác nhận',
  },
  PENDING: {
    className: 'bg-tertiary-container text-on-tertiary-container',
    icon: 'pending_actions',
    label: 'Chờ xác nhận',
  },
}

const getAppointmentTimeValue = (appointment: Appointment) => (
  appointment.slot?.start_time || appointment.created_at || ''
)

const getPatientName = (appointment: Appointment) => (
  appointment.patient?.user?.full_name
  || appointment.patient?.user?.email
  || `Bệnh nhân #${appointment.patient_id}`
)

const formatAppointmentDate = (appointment: Appointment) => {
  const timeValue = getAppointmentTimeValue(appointment)

  return timeValue ? longDateFormatter.format(new Date(timeValue)) : 'Chưa có ngày'
}

const formatAppointmentTime = (appointment: Appointment) => (
  appointment.slot ? formatSlotRange(appointment.slot) : 'Chưa có khung giờ'
)

const isHistoryAppointment = (appointment: Appointment, now = Date.now()) => {
  if (historyStatuses.includes(appointment.status)) return true

  const timeValue = getAppointmentTimeValue(appointment)
  if (!timeValue) return false

  return new Date(timeValue).getTime() < now
}

const sortHistoryAppointments = (appointments: Appointment[]) => (
  [...appointments].sort((firstAppointment, secondAppointment) => (
    new Date(getAppointmentTimeValue(secondAppointment)).getTime()
    - new Date(getAppointmentTimeValue(firstAppointment)).getTime()
  ))
)

const DoctorAppointmentHistoryPanel = ({ appointments, status }: DoctorAppointmentHistoryPanelProps) => {
  const [showAll, setShowAll] = useState(false)
  const historyAppointments = useMemo(() => (
    sortHistoryAppointments(appointments.filter((appointment) => isHistoryAppointment(appointment)))
  ), [appointments])
  const visibleAppointments = showAll
    ? historyAppointments
    : historyAppointments.slice(0, visibleHistoryLimit)
  const completedCount = historyAppointments.filter((appointment) => appointment.status === 'COMPLETED').length
  const cancelledCount = historyAppointments.filter((appointment) => appointment.status === 'CANCELLED').length
  const uniquePatientCount = new Set(historyAppointments.map((appointment) => String(appointment.patient_id))).size
  const hasMoreHistory = historyAppointments.length > visibleHistoryLimit

  return (
    <section className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
      <div className="mb-lg flex flex-col gap-md md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-sm">
            <Icon className="text-primary" name="manage_history" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Lịch sử lịch khám</h2>
          </div>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
            Các lịch đã khám, đã hủy hoặc đã qua giờ của bác sĩ.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <span className="rounded-full bg-primary-fixed px-md py-xs font-body-sm text-body-sm text-on-primary-fixed">
            {completedCount} đã khám
          </span>
          <span className="rounded-full bg-error-container px-md py-xs font-body-sm text-body-sm text-on-error-container">
            {cancelledCount} đã hủy
          </span>
          <span className="rounded-full bg-surface-container px-md py-xs font-body-sm text-body-sm text-on-surface-variant">
            {uniquePatientCount} bệnh nhân
          </span>
        </div>
      </div>

      {status === 'loading' && (
        <p className="rounded-lg bg-surface-container px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
          Đang tải lịch sử lịch khám...
        </p>
      )}

      {status === 'error' && (
        <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
          Không thể tải lịch sử lịch khám.
        </p>
      )}

      {status !== 'loading' && historyAppointments.length === 0 && (
        <div className="rounded-lg border border-dashed border-outline-variant px-md py-xl text-center">
          <Icon className="text-4xl text-outline" name="history" />
          <p className="mt-sm font-label-md text-label-md text-on-surface">Chưa có lịch sử lịch khám</p>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
            Khi lịch được hoàn tất, hủy hoặc qua giờ, lịch sử sẽ xuất hiện tại đây.
          </p>
        </div>
      )}

      {historyAppointments.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-outline-variant/30">
          <div className="hidden grid-cols-[minmax(180px,1.2fr)_minmax(150px,1fr)_minmax(120px,0.8fr)_minmax(120px,0.8fr)] gap-md bg-surface-container px-md py-sm font-label-sm text-label-sm text-on-surface-variant md:grid">
            <span>Bệnh nhân</span>
            <span>Ngày khám</span>
            <span>Khung giờ</span>
            <span>Trạng thái</span>
          </div>
          <div className="divide-y divide-outline-variant/30">
            {visibleAppointments.map((appointment) => {
              const meta = statusMeta[appointment.status]
              const dateKey = getAppointmentTimeValue(appointment)
                ? getDateKey(getAppointmentTimeValue(appointment))
                : ''

              return (
                <article
                  className="grid grid-cols-1 gap-sm bg-surface px-md py-md md:grid-cols-[minmax(180px,1.2fr)_minmax(150px,1fr)_minmax(120px,0.8fr)_minmax(120px,0.8fr)] md:items-center md:gap-md"
                  key={appointment.id}
                >
                  <div className="min-w-0">
                    <p className="truncate font-label-md text-label-md text-on-surface">{getPatientName(appointment)}</p>
                    {appointment.patient?.user?.phone && (
                      <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{appointment.patient.user.phone}</p>
                    )}
                  </div>

                  <p className="inline-flex items-center gap-xs font-body-sm text-body-sm text-on-surface-variant">
                    <Icon className="text-base text-primary" name="calendar_month" />
                    {formatAppointmentDate(appointment)}
                  </p>

                  <p className="inline-flex items-center gap-xs font-body-sm text-body-sm text-on-surface-variant">
                    <Icon className="text-base text-primary" name="schedule" />
                    {formatAppointmentTime(appointment)}
                  </p>

                  <span className={`inline-flex w-fit items-center gap-xs rounded-full px-sm py-xs font-label-sm text-label-sm ${meta.className}`}>
                    <Icon className="text-base" name={meta.icon} />
                    {meta.label}
                  </span>

                  {(appointment.reason || appointment.cancel_reason) && (
                    <p className="rounded-lg bg-surface-container px-md py-sm font-body-sm text-body-sm text-on-surface-variant md:col-span-4">
                      {appointment.cancel_reason || appointment.reason}
                    </p>
                  )}

                  {dateKey && (
                    <span className="sr-only">{dateKey}</span>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      )}

      {hasMoreHistory && (
        <button
          className="mt-md inline-flex items-center gap-xs self-start font-label-sm text-label-sm text-primary hover:underline"
          onClick={() => setShowAll((currentValue) => !currentValue)}
          type="button"
        >
          {showAll ? 'Thu gọn lịch sử' : `Xem thêm ${historyAppointments.length - visibleHistoryLimit} lịch`}
          <Icon className="text-base" name={showAll ? 'expand_less' : 'expand_more'} />
        </button>
      )}
    </section>
  )
}

export default DoctorAppointmentHistoryPanel
