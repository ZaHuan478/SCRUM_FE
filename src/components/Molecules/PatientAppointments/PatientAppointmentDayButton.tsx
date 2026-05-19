import { getDateKey, shortDateFormatter } from '../../../utils/patientAppointments'

type PatientAppointmentDayButtonProps = {
  active: boolean
  date: Date
  onSelect: (dateKey: string) => void
}

const PatientAppointmentDayButton = ({ active, date, onSelect }: PatientAppointmentDayButtonProps) => {
  const dateKey = getDateKey(date)

  return (
    <button
      className={`min-h-20 rounded-lg border px-sm py-md text-left transition-all ${
        active
          ? 'border-primary bg-primary-fixed text-on-primary-fixed shadow-sm'
          : 'border-outline-variant/30 bg-surface hover:border-primary/40 hover:bg-surface-container'
      }`}
      onClick={() => onSelect(dateKey)}
      type="button"
    >
      <span className="block font-label-md text-label-md">{shortDateFormatter.format(date)}</span>
    </button>
  )
}

export default PatientAppointmentDayButton
