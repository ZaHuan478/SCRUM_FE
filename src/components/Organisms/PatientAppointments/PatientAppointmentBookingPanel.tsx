import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'
import PatientAppointmentDayButton from '../../Molecules/PatientAppointmentDayButton'
import PatientAppointmentSlotCard from '../../Molecules/PatientAppointmentSlotCard'
import type { AppointmentSlot } from '../../../services/appointmentSlot.service'
import type { Department } from '../../../services/department.service'
import { getDateKey, longDateFormatter } from '../../../utils/patientAppointments'
import type { LoadStatus } from '../../../utils/patientAppointments'

type PatientAppointmentBookingPanelProps = {
  bookingError: string
  bookingSuccess: string
  departmentStatus: LoadStatus
  departments: Department[]
  reason: string
  selectedDate: string
  selectedDepartmentId: string
  selectedSlot: AppointmentSlot | null
  selectedSlotId: number | string | null
  slotStatus: LoadStatus
  slots: AppointmentSlot[]
  upcomingDays: Date[]
  onDateChange: (date: string) => void
  onDepartmentChange: (departmentId: string) => void
  onReasonChange: (reason: string) => void
  onSelectSlot: (slot: AppointmentSlot) => void
  onSubmit: () => void
}

const PatientAppointmentBookingPanel = ({
  bookingError,
  bookingSuccess,
  departmentStatus,
  departments,
  reason,
  selectedDate,
  selectedDepartmentId,
  selectedSlot,
  selectedSlotId,
  slotStatus,
  slots,
  upcomingDays,
  onDateChange,
  onDepartmentChange,
  onReasonChange,
  onSelectSlot,
  onSubmit,
}: PatientAppointmentBookingPanelProps) => (
  <section className="flex flex-col gap-lg rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm lg:col-span-7">
    <div className="flex flex-col gap-md md:flex-row md:items-end md:justify-between">
      <div>
        <div className="flex items-center gap-sm">
          <Icon className="text-primary" name="event_available" />
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Đặt lịch hẹn</h2>
        </div>
        <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
          {longDateFormatter.format(new Date(selectedDate))}
        </p>
      </div>
      <div className="grid w-full grid-cols-1 gap-md md:w-auto md:grid-cols-2">
        <Input
          label="Ngày khám"
          min={getDateKey(new Date())}
          onChange={(event) => onDateChange(event.target.value)}
          type="date"
          value={selectedDate}
          wrapperClassName="md:w-48"
        />
        <label className="space-y-xs md:w-56">
          <span className="font-label-md text-label-md text-on-surface">Khoa</span>
          <select
            className="w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            disabled={departmentStatus === 'loading'}
            onChange={(event) => onDepartmentChange(event.target.value)}
            value={selectedDepartmentId}
          >
            <option value="">Tất cả khoa</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </select>
        </label>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-sm md:grid-cols-7">
      {upcomingDays.slice(0, 7).map((date) => {
        const dateKey = getDateKey(date)

        return (
          <PatientAppointmentDayButton
            active={selectedDate === dateKey}
            date={date}
            key={dateKey}
            onSelect={onDateChange}
          />
        )
      })}
    </div>

    {(bookingError || bookingSuccess) && (
      <p className={`rounded-lg px-md py-sm font-body-sm text-body-sm ${bookingError ? 'bg-error-container text-on-error-container' : 'bg-secondary-fixed text-on-secondary-fixed'}`}>
        {bookingError || bookingSuccess}
      </p>
    )}

    {slotStatus === 'loading' && (
      <p className="rounded-lg bg-surface-container px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
        Đang tải khung giờ trống...
      </p>
    )}

    {slotStatus === 'error' && (
      <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
        Không thể tải khung giờ trống.
      </p>
    )}

    {slotStatus !== 'loading' && slots.length === 0 && (
      <div className="rounded-lg border border-dashed border-outline-variant px-md py-xl text-center">
        <Icon className="text-4xl text-outline" name="event_busy" />
        <p className="mt-sm font-label-md text-label-md text-on-surface">Chưa có khung giờ phù hợp</p>
        <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Hãy thử chọn ngày khác hoặc bỏ lọc khoa.</p>
      </div>
    )}

    {slots.length > 0 && (
      <div className="grid grid-cols-1 gap-md xl:grid-cols-2">
        {slots.map((slot) => (
          <PatientAppointmentSlotCard
            active={String(selectedSlotId || '') === String(slot.id)}
            key={slot.id}
            onSelect={onSelectSlot}
            slot={slot}
          />
        ))}
      </div>
    )}

    <div className="rounded-lg border border-outline-variant/30 bg-surface p-md">
      <label className="space-y-xs">
        <span className="font-label-md text-label-md text-on-surface">Lý do khám</span>
        <textarea
          className="min-h-28 w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
          onChange={(event) => onReasonChange(event.target.value)}
          placeholder="Mô tả ngắn triệu chứng hoặc nhu cầu khám..."
          value={reason}
        />
      </label>
      <div className="mt-md flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {selectedSlot ? 'Khung giờ đã sẵn sàng để gửi đặt lịch.' : 'Chọn một khung giờ trước khi gửi.'}
        </p>
        <Button
          className="inline-flex items-center justify-center gap-xs px-lg py-sm"
          disabled={!selectedSlot}
          fullWidth={false}
          onClick={onSubmit}
          type="button"
        >
          <Icon className="text-lg" name="send" />
          Gửi đặt lịch
        </Button>
      </div>
    </div>
  </section>
)

export default PatientAppointmentBookingPanel
