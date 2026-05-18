import Icon from '../../Atoms/Icon'
import DoctorScheduleSlotCard from '../../Molecules/DoctorSchedule/DoctorScheduleSlotCard'
import type { AppointmentSlot, AppointmentSlotStatus } from '../../../services/appointmentSlot.service'
import type { DaySummary } from '../../../utils/doctorSchedule'

type DoctorScheduleSlotListProps = {
  selectedDateLabel: string
  selectedDaySlots: AppointmentSlot[]
  selectedSummary: DaySummary
  slotActionId: number | string | null
  onDeleteSlot: (slot: AppointmentSlot) => void
  onEditSlot: (slot: AppointmentSlot) => void
  onSlotStatusChange: (slot: AppointmentSlot, nextStatus: AppointmentSlotStatus) => void
}

const DoctorScheduleSlotList = ({
  selectedDateLabel,
  selectedDaySlots,
  selectedSummary,
  slotActionId,
  onDeleteSlot,
  onEditSlot,
  onSlotStatusChange,
}: DoctorScheduleSlotListProps) => (
  <section className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm lg:col-span-3">
    <div className="mb-lg flex flex-col gap-md md:flex-row md:items-start md:justify-between">
      <div>
        <div className="flex items-center gap-sm">
          <Icon className="text-primary" name="schedule" />
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Khung giờ trong ngày</h2>
        </div>
        <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{selectedDateLabel}</p>
      </div>
      <div className="flex flex-wrap gap-sm">
        <span className="rounded-full bg-secondary-fixed px-md py-xs font-body-sm text-body-sm text-on-secondary-fixed">
          {selectedSummary.available} rảnh
        </span>
        <span className="rounded-full bg-error-container px-md py-xs font-body-sm text-body-sm text-on-error-container">
          {selectedSummary.cancelled} bận
        </span>
        <span className="rounded-full bg-surface-container px-md py-xs font-body-sm text-body-sm text-on-surface-variant">
          {selectedSummary.booked} đã đặt
        </span>
      </div>
    </div>

    {selectedDaySlots.length === 0 ? (
      <div className="rounded-lg border border-dashed border-outline-variant px-md py-xl text-center">
        <Icon className="text-4xl text-outline" name="event_note" />
        <p className="mt-sm font-label-md text-label-md text-on-surface">Chưa có khung giờ</p>
        <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Thêm khung giờ hoặc đánh dấu bận cả ngày.</p>
      </div>
    ) : (
      <div className="flex flex-col gap-sm">
        {selectedDaySlots.map((slot) => (
          <DoctorScheduleSlotCard
            isActing={String(slotActionId || '') === String(slot.id)}
            key={slot.id}
            onDelete={onDeleteSlot}
            onEdit={onEditSlot}
            onStatusChange={onSlotStatusChange}
            slot={slot}
          />
        ))}
      </div>
    )}
  </section>
)

export default DoctorScheduleSlotList
