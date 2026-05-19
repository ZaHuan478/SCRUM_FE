import {
  dayMonthFormatter,
  emptySummary,
  getDateKey,
  weekdayFormatter,
} from '../../../utils/doctorSchedule'
import type { DaySummary } from '../../../utils/doctorSchedule'

type DoctorScheduleDayButtonProps = {
  active: boolean
  date: Date
  summary?: DaySummary
  onSelect: (dateKey: string) => void
}

const DoctorScheduleDayButton = ({
  active,
  date,
  summary = emptySummary(),
  onSelect,
}: DoctorScheduleDayButtonProps) => {
  const dateKey = getDateKey(date)

  return (
    <button
      className={`min-h-28 rounded-lg border px-sm py-md text-left transition-all ${
        active
          ? 'border-primary bg-primary-fixed text-on-primary-fixed shadow-sm'
          : 'border-outline-variant/30 bg-surface hover:border-primary/40 hover:bg-surface-container'
      }`}
      onClick={() => onSelect(dateKey)}
      type="button"
    >
      <span className="block font-label-md text-label-md">{weekdayFormatter.format(date)}</span>
      <span className="mt-xs block font-headline-sm text-headline-sm">{dayMonthFormatter.format(date)}</span>
      <span className="mt-sm block font-body-sm text-body-sm">
        {summary.available} rảnh / {summary.cancelled} bận
      </span>
      <span className="mt-xs block font-body-sm text-body-sm text-on-surface-variant">
        {summary.booked} đã đặt
      </span>
    </button>
  )
}

export default DoctorScheduleDayButton
