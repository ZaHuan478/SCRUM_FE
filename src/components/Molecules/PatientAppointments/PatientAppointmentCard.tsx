import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import type { Appointment } from '../../../services/appointment.service'
import type { Payment } from '../../../types/payment'
import {
  appointmentStatusMeta,
  formatAppointmentDate,
  formatAppointmentTime,
  getAppointmentDepartmentName,
  getAppointmentDoctorName,
} from '../../../utils/patientAppointments'

type PatientAppointmentCardProps = {
  appointment: Appointment
  isActing: boolean
  onCancel: (appointment: Appointment) => void
  onPay: (payment: Payment) => void
}

const PatientAppointmentCard = ({ appointment, isActing, onCancel, onPay }: PatientAppointmentCardProps) => {
  const meta = appointmentStatusMeta[appointment.status]
  const canCancel = ['PENDING_PAYMENT', 'PENDING', 'CONFIRMED'].includes(appointment.status)
  const pendingPayment = appointment.payments?.find((payment) => payment.status === 'PENDING')

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

        {(pendingPayment || canCancel) && (
          <div className="flex flex-wrap gap-sm sm:justify-end">
            {pendingPayment && (
              <Button
                className="inline-flex items-center justify-center gap-xs px-md py-sm"
                fullWidth={false}
                onClick={() => onPay(pendingPayment)}
                type="button"
                variant="primary"
              >
                <Icon className="text-lg" name="qr_code_2" />
                Thanh toán
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
                Hủy lịch
              </Button>
            )}
          </div>
        )}
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
    </article>
  )
}

export default PatientAppointmentCard
