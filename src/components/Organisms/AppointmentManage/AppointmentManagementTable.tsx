import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Select from '../../Molecules/Common/Select'
import type { Appointment, AppointmentStatus } from '../../../services/appointment.service'
import type { DashboardPagination } from '../../../utils/adminDashboard'
import { formatSlotRange, getSlotDepartmentName, getSlotDoctorName } from '../../../utils/patientAppointments'

type AppointmentManagementTableProps = {
  appointments: Appointment[]
  pagination: DashboardPagination
  status: 'loading' | 'ready' | 'error'
  statusFilter: AppointmentStatus | 'all'
  totalAppointments: number
  onCancelAppointment: (appointment: Appointment) => void
  onCompleteAppointment: (appointment: Appointment) => void
  onConfirmAppointment: (appointment: Appointment) => void
  onPageChange: (page: number) => void
  onStatusFilterChange: (status: AppointmentStatus | 'all') => void
}

const statusLabels: Record<AppointmentStatus, string> = {
  CANCELLED: 'Đã hủy',
  COMPLETED: 'Hoàn tất',
  CONFIRMED: 'Đã xác nhận',
  PENDING: 'Chờ xác nhận',
  PENDING_PAYMENT: 'Chờ thanh toán',
}

const statusClasses: Record<AppointmentStatus, string> = {
  CANCELLED: 'bg-error-container text-on-error-container',
  COMPLETED: 'bg-secondary-fixed text-on-secondary-fixed',
  CONFIRMED: 'bg-primary-fixed text-on-primary-fixed',
  PENDING: 'bg-tertiary-fixed text-on-tertiary-fixed',
  PENDING_PAYMENT: 'bg-surface-container-high text-on-surface',
}

const appointmentStatusOptions: Array<{ label: string; value: AppointmentStatus | 'all' }> = [
  { label: 'Tất cả trạng thái', value: 'all' },
  { label: statusLabels.PENDING_PAYMENT, value: 'PENDING_PAYMENT' },
  { label: statusLabels.PENDING, value: 'PENDING' },
  { label: statusLabels.CONFIRMED, value: 'CONFIRMED' },
  { label: statusLabels.COMPLETED, value: 'COMPLETED' },
  { label: statusLabels.CANCELLED, value: 'CANCELLED' },
]

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const moneyFormatter = new Intl.NumberFormat('vi-VN', {
  currency: 'VND',
  maximumFractionDigits: 0,
  style: 'currency',
})

const getPatientName = (appointment: Appointment) => (
  appointment.patient?.user?.full_name || `Bệnh nhân #${appointment.patient_id}`
)

const getPaymentText = (appointment: Appointment) => {
  const payment = appointment.payments?.[0]
  if (!payment) return 'Chưa có thanh toán'

  return `${moneyFormatter.format(Number(payment.amount || 0))} - ${payment.status}`
}

const AppointmentManagementTable = ({
  appointments,
  pagination,
  status,
  statusFilter,
  totalAppointments,
  onCancelAppointment,
  onCompleteAppointment,
  onConfirmAppointment,
  onPageChange,
  onStatusFilterChange,
}: AppointmentManagementTableProps) => {
  const firstItem = totalAppointments === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const lastItem = Math.min(pagination.page * pagination.limit, totalAppointments)
  const hasPreviousPage = pagination.page > 1
  const hasNextPage = pagination.page < pagination.totalPages

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(15,23,42,0.05)]" id="appointment-management">
      <div className="flex flex-col items-start justify-between gap-lg border-b border-outline-variant/20 p-lg md:flex-row md:items-center md:p-xl">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Quản lý lịch hẹn</h2>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Theo dõi, xác nhận, hoàn tất hoặc hủy lịch hẹn trong hệ thống.</p>
        </div>
        <div className="flex w-full items-center gap-md md:w-auto">
          <Select
            className="py-sm text-body-sm"
            onChange={(value) => onStatusFilterChange(value as AppointmentStatus | 'all')}
            options={appointmentStatusOptions}
            value={statusFilter}
            wrapperClassName="w-full md:w-56"
          />
          <Icon className="hidden text-primary sm:block" name="event_note" />
        </div>
      </div>

      {status === 'loading' && <div className="p-xl font-body-sm text-body-sm text-on-surface-variant">Đang tải danh sách lịch hẹn...</div>}
      {status === 'error' && (
        <div className="m-lg rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
          Chưa tải được danh sách lịch hẹn.
        </div>
      )}
      {status === 'ready' && appointments.length === 0 && (
        <div className="p-xl text-center font-body-md text-body-md text-on-surface-variant">Chưa có lịch hẹn phù hợp.</div>
      )}
      {appointments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant/20 bg-surface-container-low">
              <tr>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Bệnh nhân</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Bác sĩ / khoa</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Thời gian</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Thanh toán</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Trạng thái</th>
                <th className="px-xl py-md text-right font-label-md text-label-md text-on-surface-variant">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {appointments.map((appointment) => (
                <tr className="transition-colors hover:bg-surface-container-low" key={appointment.id}>
                  <td className="px-xl py-lg">
                    <div className="min-w-56">
                      <p className="font-label-md text-label-md text-on-surface">{getPatientName(appointment)}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{appointment.reason || 'Chưa có lý do khám'}</p>
                    </div>
                  </td>
                  <td className="px-xl py-lg">
                    <p className="font-body-sm text-body-sm text-on-surface">{appointment.slot ? getSlotDoctorName(appointment.slot) : appointment.doctor?.user?.full_name || `Bác sĩ #${appointment.doctor_id}`}</p>
                    <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{appointment.slot ? getSlotDepartmentName(appointment.slot) : 'Chưa có khoa'}</p>
                  </td>
                  <td className="px-xl py-lg">
                    <p className="font-body-sm text-body-sm text-on-surface">
                      {appointment.slot?.start_time ? dateTimeFormatter.format(new Date(appointment.slot.start_time)) : 'Chưa có giờ'}
                    </p>
                    <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{appointment.slot ? formatSlotRange(appointment.slot) : 'Chưa có khung giờ'}</p>
                  </td>
                  <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">{getPaymentText(appointment)}</td>
                  <td className="px-xl py-lg">
                    <span className={`inline-flex w-fit rounded-full px-sm py-xs font-label-sm text-label-sm ${statusClasses[appointment.status]}`}>
                      {statusLabels[appointment.status]}
                    </span>
                  </td>
                  <td className="px-xl py-lg text-right">
                    <div className="flex justify-end gap-sm">
                      {appointment.status === 'PENDING' && (
                        <Button className="px-md py-sm" fullWidth={false} onClick={() => onConfirmAppointment(appointment)} type="button" variant="ghost">
                          Xác nhận
                        </Button>
                      )}
                      {appointment.status === 'CONFIRMED' && (
                        <Button className="px-md py-sm" fullWidth={false} onClick={() => onCompleteAppointment(appointment)} type="button" variant="ghost">
                          Hoàn tất
                        </Button>
                      )}
                      {!['CANCELLED', 'COMPLETED'].includes(appointment.status) && (
                        <Button className="border-error/30 px-md py-sm text-error hover:bg-error-container" fullWidth={false} onClick={() => onCancelAppointment(appointment)} type="button" variant="ghost">
                          Hủy
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex flex-col justify-between gap-md border-t border-outline-variant/20 bg-surface-container-low p-lg sm:flex-row sm:items-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Đang hiển thị {firstItem}-{lastItem} trên {totalAppointments} lịch hẹn
        </p>
        <div className="flex items-center gap-sm">
          <button
            className="rounded-lg border border-outline-variant px-md py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!hasPreviousPage || status === 'loading'}
            onClick={() => onPageChange(pagination.page - 1)}
            type="button"
          >
            Trước
          </button>
          <span className="min-w-20 text-center font-label-md text-label-md text-on-surface-variant">
            Trang {pagination.page}/{Math.max(pagination.totalPages, 1)}
          </span>
          <button
            className="rounded-lg border border-outline-variant px-md py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!hasNextPage || status === 'loading'}
            onClick={() => onPageChange(pagination.page + 1)}
            type="button"
          >
            Tiếp theo
          </button>
        </div>
      </div>
    </section>
  )
}

export default AppointmentManagementTable
