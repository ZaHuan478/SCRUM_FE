import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Image from '../../Atoms/Image'
import type { AppointmentSlot } from '../../../services/appointmentSlot.service'
import {
  formatSlotRange,
  getSlotDepartmentName,
  getSlotDoctorName,
  getSlotRemaining,
  longDateFormatter,
} from '../../../utils/patientAppointments'
import { useTranslation } from '../../../contexts/LanguageContext'
import { translateDepartmentName } from '../../../utils/contentTranslation'

type PatientAppointmentSlotCardProps = {
  active: boolean
  slot: AppointmentSlot
  onSelect: (slot: AppointmentSlot) => void
}

const PatientAppointmentSlotCard = ({ active, slot, onSelect }: PatientAppointmentSlotCardProps) => {
  const { language } = useTranslation()
  const doctor = slot.doctor_assignment?.doctor
  const remaining = getSlotRemaining(slot)

  return (
    <article
      className={`flex flex-col gap-md rounded-lg border p-md transition-all ${
        active
          ? 'border-primary bg-primary-fixed/40 shadow-sm'
          : 'border-outline-variant/30 bg-surface hover:border-primary/40 hover:bg-surface-container'
      }`}
    >
      <div className="flex items-center gap-md">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-variant">
          <Image
            alt={getSlotDoctorName(slot)}
            className="h-full w-full object-cover"
            fallbackClassName="h-full w-full"
            src={doctor?.image_url || undefined}
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-label-md text-label-md text-on-surface">{getSlotDoctorName(slot)}</h3>
          <p className="truncate font-body-sm text-body-sm text-on-surface-variant">{translateDepartmentName(getSlotDepartmentName(slot), language)}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-sm">
        <span className="inline-flex items-center gap-xs rounded-full bg-surface-container px-md py-xs font-body-sm text-body-sm text-on-surface">
          <Icon className="text-lg text-primary" name="calendar_today" />
          {longDateFormatter.format(new Date(slot.start_time))}
        </span>
        <span className="inline-flex items-center gap-xs rounded-full bg-surface-container px-md py-xs font-body-sm text-body-sm text-on-surface">
          <Icon className="text-lg text-primary" name="schedule" />
          {formatSlotRange(slot)}
        </span>
        <span className="rounded-full bg-secondary-fixed px-md py-xs font-body-sm text-body-sm text-on-secondary-fixed">
          Còn {remaining} chỗ
        </span>
      </div>

      <Button
        className="inline-flex items-center justify-center gap-xs px-md py-sm"
        fullWidth={false}
        onClick={() => onSelect(slot)}
        type="button"
        variant={active ? 'primary' : 'ghost'}
      >
        <Icon className="text-lg" name={active ? 'check_circle' : 'add_circle'} />
        {active ? 'Đã chọn' : 'Chọn lịch'}
      </Button>
    </article>
  )
}

export default PatientAppointmentSlotCard
