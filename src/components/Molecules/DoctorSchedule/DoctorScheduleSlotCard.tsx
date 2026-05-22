import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import type { AppointmentSlot, AppointmentSlotStatus } from '../../../services/appointmentSlot.service'
import { formatSlotRange, isSlotExpired, slotStatusMeta } from '../../../utils/doctorSchedule'

type DoctorScheduleSlotCardProps = {
  isActing: boolean
  slot: AppointmentSlot
  currentTime: number
  onDelete: (slot: AppointmentSlot) => void
  onEdit: (slot: AppointmentSlot) => void
  onStatusChange: (slot: AppointmentSlot, nextStatus: AppointmentSlotStatus) => void
}

const DoctorScheduleSlotCard = ({
  isActing,
  slot,
  currentTime,
  onDelete,
  onEdit,
  onStatusChange,
}: DoctorScheduleSlotCardProps) => {
  const meta = slotStatusMeta[slot.status]
  const bookedCount = Number(slot.booked_count || 0)
  const canDelete = bookedCount === 0
  const nextStatus = slot.status === 'CANCELLED' ? 'AVAILABLE' : 'CANCELLED'
  const expired = isSlotExpired(slot, currentTime)
  const actionsDisabled = isActing || expired

  return (
    <article className={`flex flex-col gap-md rounded-lg border px-md py-md md:flex-row md:items-center md:justify-between ${
      expired
        ? 'border-outline-variant/20 bg-surface-container text-on-surface-variant opacity-70'
        : 'border-outline-variant/30 bg-surface'
    }`}>
      <div className="flex min-w-0 items-center gap-md">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary">
          <Icon name={meta.icon} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-sm">
            <p className="font-headline-sm text-headline-sm text-on-surface">{formatSlotRange(slot)}</p>
            <span className={`rounded-full px-md py-xs font-body-sm text-body-sm ${meta.className}`}>
              {meta.label}
            </span>
            {expired && (
              <span className="rounded-full bg-surface-container-high px-md py-xs font-body-sm text-body-sm text-on-surface-variant">
                Đã quá giờ
              </span>
            )}
          </div>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
            {bookedCount}/{slot.max_patients} bệnh nhân
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-sm md:justify-end">
        <Button
          className="inline-flex items-center justify-center gap-xs px-md py-sm"
          disabled={actionsDisabled}
          fullWidth={false}
          onClick={() => onEdit(slot)}
          type="button"
          variant="ghost"
        >
          <Icon className="text-lg" name="edit" />
          Sửa
        </Button>
        <Button
          className="inline-flex items-center justify-center gap-xs px-md py-sm"
          disabled={actionsDisabled}
          fullWidth={false}
          isLoading={isActing}
          onClick={() => onStatusChange(slot, nextStatus)}
          type="button"
          variant="ghost"
        >
          <Icon className="text-lg" name={slot.status === 'CANCELLED' ? 'event_available' : 'event_busy'} />
          {slot.status === 'CANCELLED' ? 'Mở lại' : 'Bận'}
        </Button>
        <Button
          className="border-none px-md py-sm text-error"
          disabled={!canDelete || actionsDisabled}
          fullWidth={false}
          onClick={() => onDelete(slot)}
          title={canDelete ? 'Xóa khung giờ' : 'Không thể xóa khung đã có bệnh nhân'}
          type="button"
          variant="ghost"
        >
          Xóa
        </Button>
      </div>
    </article>
  )
}

export default DoctorScheduleSlotCard
