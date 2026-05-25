import { useState } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import PatientAppointmentCard from '../../Molecules/PatientAppointments/PatientAppointmentCard'
import type { Appointment } from '../../../services/appointment.service'
import type { Payment } from '../../../types/payment'
import type { LoadStatus } from '../../../utils/patientAppointments'

type PatientAppointmentHistoryPanelProps = {
  actionId: number | string | null
  appointments: Appointment[]
  status: LoadStatus
  onCancel: (appointment: Appointment) => void
  onPay: (payment: Payment) => void
  onRefresh: () => void
}

const archiveStatuses = ['COMPLETED', 'CANCELLED']

const PatientAppointmentHistoryPanel = ({
  actionId,
  appointments,
  status,
  onCancel,
  onPay,
  onRefresh,
}: PatientAppointmentHistoryPanelProps) => {
  const [showArchive, setShowArchive] = useState(false)
  const activeAppointments = appointments.filter((appointment) => !archiveStatuses.includes(appointment.status))
  const archivedAppointments = appointments.filter((appointment) => archiveStatuses.includes(appointment.status))
  const hasNoAppointments = status !== 'loading' && appointments.length === 0

  return (
    <section className="flex flex-col gap-md rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm lg:col-span-5">
      <div className="flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-sm">
            <Icon className="text-primary" name="event_note" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Lịch hẹn đang theo dõi</h2>
          </div>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
            Lịch chờ thanh toán, đang chờ và đã xác nhận.
          </p>
        </div>
        <Button
          className="inline-flex items-center justify-center gap-xs px-md py-sm"
          disabled={status === 'loading'}
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

      {hasNoAppointments && (
        <div className="rounded-lg border border-dashed border-outline-variant px-md py-xl text-center">
          <Icon className="text-4xl text-outline" name="calendar_add_on" />
          <p className="mt-sm font-label-md text-label-md text-on-surface">Bạn chưa có lịch hẹn</p>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
            Chọn khung giờ bên cạnh để gửi đặt lịch đầu tiên.
          </p>
        </div>
      )}

      {status !== 'loading' && appointments.length > 0 && activeAppointments.length === 0 && (
        <div className="rounded-lg border border-dashed border-outline-variant px-md py-lg text-center">
          <Icon className="text-4xl text-outline" name="inventory_2" />
          <p className="mt-sm font-label-md text-label-md text-on-surface">Không có lịch đang theo dõi</p>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
            Lịch đã khám hoặc đã hủy được đưa vào lưu trữ bên dưới.
          </p>
        </div>
      )}

      {activeAppointments.length > 0 && (
        <div className="flex flex-col gap-sm">
          {activeAppointments.map((appointment) => (
            <PatientAppointmentCard
              appointment={appointment}
              isActing={String(actionId || '') === String(appointment.id)}
              key={appointment.id}
              onCancel={onCancel}
              onPay={onPay}
            />
          ))}
        </div>
      )}

      {archivedAppointments.length > 0 && (
        <div className="border-t border-outline-variant/30 pt-md">
          <Button
            className="inline-flex items-center justify-between gap-sm px-md py-sm"
            fullWidth
            onClick={() => setShowArchive((currentValue) => !currentValue)}
            type="button"
            variant="ghost"
          >
            <span className="inline-flex items-center gap-xs">
              <Icon className="text-lg" name="inventory_2" />
              Lưu trữ ({archivedAppointments.length})
            </span>
            <Icon className="text-lg" name={showArchive ? 'expand_less' : 'expand_more'} />
          </Button>

          {showArchive && (
            <div className="mt-sm flex flex-col gap-sm">
              {archivedAppointments.map((appointment) => (
                <PatientAppointmentCard
                  appointment={appointment}
                  isActing={String(actionId || '') === String(appointment.id)}
                  key={appointment.id}
                  onCancel={onCancel}
                  onPay={onPay}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default PatientAppointmentHistoryPanel
