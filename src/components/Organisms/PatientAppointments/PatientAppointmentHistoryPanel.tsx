import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import PatientAppointmentCard from '../../Molecules/PatientAppointments/PatientAppointmentCard'
import type { Appointment } from '../../../services/appointment.service'
import type { LoadStatus, PatientAppointmentPagination } from '../../../utils/patientAppointments'

type PatientAppointmentHistoryPanelProps = {
  actionId: number | string | null
  appointments: Appointment[]
  pagination: PatientAppointmentPagination
  status: LoadStatus
  onCancel: (appointment: Appointment) => void
  onPageChange: (page: number) => void
  onRefresh: () => void
}

const PatientAppointmentHistoryPanel = ({
  actionId,
  appointments,
  pagination,
  status,
  onCancel,
  onPageChange,
  onRefresh,
}: PatientAppointmentHistoryPanelProps) => {
  const firstItem = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const lastItem = Math.min(pagination.page * pagination.limit, pagination.total)
  const hasPreviousPage = pagination.page > 1
  const hasNextPage = pagination.page < pagination.totalPages

  return (
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
              isActing={String(actionId || '') === String(appointment.id)}
              key={appointment.id}
              onCancel={onCancel}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col justify-between gap-md rounded-lg border border-outline-variant/20 bg-surface-container-low px-md py-sm sm:flex-row sm:items-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Đang hiển thị {firstItem}-{lastItem} trên {pagination.total} lịch hẹn
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

export default PatientAppointmentHistoryPanel
