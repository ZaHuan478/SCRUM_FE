import { useEffect, useMemo, useState } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'
import PatientAppointmentDayButton from '../../Molecules/PatientAppointments/PatientAppointmentDayButton'
import PatientAppointmentSlotCard from '../../Molecules/PatientAppointments/PatientAppointmentSlotCard'
import type { AppointmentSlot } from '../../../services/appointmentSlot.service'
import type { RecommendedDepartment } from '../../../services/departmentSymptomRule.service'
import type { Department } from '../../../services/department.service'
import type { Symptom } from '../../../services/symptom.service'
import { getDateKey, longDateFormatter } from '../../../utils/patientAppointments'
import type { LoadStatus } from '../../../utils/patientAppointments'

type PatientAppointmentBookingPanelProps = {
  bookingError: string
  bookingSuccess: string
  departmentStatus: LoadStatus
  departments: Department[]
  matchedSymptoms: Symptom[]
  reason: string
  recommendedDepartments: RecommendedDepartment[]
  recommendationStatus: LoadStatus
  selectedDate: string
  selectedDepartmentId: string
  selectedDoctorId: string
  selectedDoctorName: string
  selectedSlot: AppointmentSlot | null
  selectedSlotId: number | string | null
  slotStatus: LoadStatus
  slots: AppointmentSlot[]
  upcomingDays: Date[]
  onClearDoctor: () => void
  onDateChange: (date: string) => void
  onDepartmentChange: (departmentId: string) => void
  onReasonChange: (reason: string) => void
  onSelectSlot: (slot: AppointmentSlot) => void
  onSubmit: () => void
}

const SLOT_PAGE_SIZE = 6

const PatientAppointmentBookingPanel = ({
  bookingError,
  bookingSuccess,
  departmentStatus,
  departments,
  matchedSymptoms,
  reason,
  recommendedDepartments,
  recommendationStatus,
  selectedDate,
  selectedDepartmentId,
  selectedDoctorId,
  selectedDoctorName,
  selectedSlot,
  selectedSlotId,
  slotStatus,
  slots,
  upcomingDays,
  onClearDoctor,
  onDateChange,
  onDepartmentChange,
  onReasonChange,
  onSelectSlot,
  onSubmit,
}: PatientAppointmentBookingPanelProps) => {
  const [slotPage, setSlotPage] = useState(1)
  const slotTotalPages = Math.max(Math.ceil(slots.length / SLOT_PAGE_SIZE), 1)
  const slotFirstItem = slots.length === 0 ? 0 : (slotPage - 1) * SLOT_PAGE_SIZE + 1
  const slotLastItem = Math.min(slotPage * SLOT_PAGE_SIZE, slots.length)
  const hasPreviousSlotPage = slotPage > 1
  const hasNextSlotPage = slotPage < slotTotalPages
  const paginatedSlots = useMemo(() => {
    const startIndex = (slotPage - 1) * SLOT_PAGE_SIZE
    return slots.slice(startIndex, startIndex + SLOT_PAGE_SIZE)
  }, [slotPage, slots])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSlotPage(1)
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [selectedDate, selectedDepartmentId, selectedDoctorId, slots.length])

  return (
    <section className="flex flex-col gap-lg rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm lg:col-span-7">
      <div className="flex flex-col gap-md md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-sm">
            <Icon className="text-primary" name="event_available" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Đặt lịch hẹn</h2>
          </div>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
            {selectedDate ? longDateFormatter.format(new Date(selectedDate)) : 'Hiển thị lịch khám trống gần nhất của các bác sĩ'}
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
              disabled={departmentStatus === 'loading' || Boolean(selectedDoctorId)}
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

      {selectedDoctorId && (
        <div className="flex flex-col gap-sm rounded-lg border border-primary/20 bg-primary-fixed px-md py-sm text-on-primary-fixed sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-sm">
            <Icon className="text-lg" name="person_search" />
            <p className="font-body-sm text-body-sm">
              Đang chỉ hiển thị lịch của <span className="font-label-md text-label-md">{selectedDoctorName || `bác sĩ #${selectedDoctorId}`}</span>.
            </p>
          </div>
          <Button
            className="border-on-primary-fixed/20 px-sm py-xs text-on-primary-fixed hover:bg-on-primary-fixed/10"
            fullWidth={false}
            onClick={onClearDoctor}
            type="button"
            variant="ghost"
          >
            Bỏ lọc bác sĩ
          </Button>
        </div>
      )}

      <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-md">
        <label className="space-y-xs">
          <span className="font-label-md text-label-md text-on-surface">Triệu chứng / lý do khám</span>
          <textarea
            className="min-h-24 w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder="Ví dụ: đau ngực, khó thở, tim đập nhanh..."
            value={reason}
          />
        </label>

        {(matchedSymptoms.length > 0 || recommendedDepartments.length > 0 || recommendationStatus === 'loading') && (
          <div className="mt-md flex flex-col gap-sm">
            {matchedSymptoms.length > 0 && (
              <div className="flex flex-wrap gap-xs">
                {matchedSymptoms.map((symptom) => (
                  <span
                    className="rounded-full bg-primary-fixed px-sm py-xs font-label-sm text-label-sm text-on-primary-fixed"
                    key={symptom.id}
                  >
                    {symptom.name}
                  </span>
                ))}
              </div>
            )}

            {recommendationStatus === 'loading' && (
              <p className="font-body-sm text-body-sm text-on-surface-variant">Đang tìm khoa phù hợp...</p>
            )}

            {recommendedDepartments.length > 0 && (
              <div className="flex flex-wrap gap-xs">
                {recommendedDepartments.map((department) => (
                  <button
                    className={`rounded-full border px-sm py-xs font-label-sm text-label-sm transition-colors ${
                      String(selectedDepartmentId) === String(department.department_id)
                        ? 'border-primary bg-primary text-on-primary'
                        : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary'
                    }`}
                    key={department.department_id}
                    onClick={() => onDepartmentChange(String(department.department_id))}
                    type="button"
                  >
                    {department.department_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-sm md:grid-cols-4 xl:grid-cols-8">
        <button
          className={`rounded-lg border px-md py-sm text-left transition-all ${
            selectedDate === ''
              ? 'border-primary bg-primary text-on-primary shadow-sm'
              : 'border-outline-variant/30 bg-surface hover:border-primary/40'
          }`}
          onClick={() => onDateChange('')}
          type="button"
        >
          <span className="block font-label-md text-label-md">Gần nhất</span>
          <span className={`mt-xs block font-label-sm text-label-sm ${selectedDate === '' ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>
            Sắp tới
          </span>
        </button>
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
          Đang tải lịch khám trống gần nhất...
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
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
            {selectedDoctorId ? 'Hãy thử chọn ngày khác hoặc bỏ lọc bác sĩ.' : 'Hãy thử chọn ngày khác, bỏ lọc khoa hoặc quay về Gần nhất.'}
          </p>
        </div>
      )}

      {slots.length > 0 && (
        <div className="flex flex-col gap-md">
          <div className="grid grid-cols-1 gap-md xl:grid-cols-2">
            {paginatedSlots.map((slot) => (
              <PatientAppointmentSlotCard
                active={String(selectedSlotId || '') === String(slot.id)}
                key={slot.id}
                onSelect={onSelectSlot}
                slot={slot}
              />
            ))}
          </div>

          <div className="flex flex-col justify-between gap-md rounded-lg border border-outline-variant/20 bg-surface-container-low px-md py-sm sm:flex-row sm:items-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Đang hiển thị {slotFirstItem}-{slotLastItem} trên {slots.length} khung giờ
            </p>
            <div className="flex items-center gap-sm">
              <Button
                className="px-md py-sm"
                disabled={!hasPreviousSlotPage || slotStatus === 'loading'}
                fullWidth={false}
                onClick={() => setSlotPage((currentPage) => Math.max(currentPage - 1, 1))}
                type="button"
                variant="ghost"
              >
                Trước
              </Button>
              <span className="min-w-20 text-center font-label-md text-label-md text-on-surface-variant">
                Trang {slotPage}/{slotTotalPages}
              </span>
              <Button
                className="px-md py-sm"
                disabled={!hasNextSlotPage || slotStatus === 'loading'}
                fullWidth={false}
                onClick={() => setSlotPage((currentPage) => Math.min(currentPage + 1, slotTotalPages))}
                type="button"
                variant="ghost"
              >
                Tiếp theo
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg p-md">
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
}

export default PatientAppointmentBookingPanel
