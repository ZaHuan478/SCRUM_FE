import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'
import DoctorScheduleDayButton from '../../Molecules/DoctorScheduleDayButton'
import { getDateKey } from '../../../utils/doctorSchedule'
import type { DaySummary, LoadStatus } from '../../../utils/doctorSchedule'

type DayAction = 'busy' | 'free' | null

type DoctorScheduleDayPickerProps = {
  dayAction: DayAction
  daySummaryMap: Map<string, DaySummary>
  selectedDate: string
  selectedDateLabel: string
  status: LoadStatus
  todayKey: string
  upcomingDays: Date[]
  onDateChange: (date: string) => void
  onMarkDayBusy: () => void
  onMarkDayFree: () => void
  onRefresh: () => void
}

const DoctorScheduleDayPicker = ({
  dayAction,
  daySummaryMap,
  selectedDate,
  selectedDateLabel,
  status,
  todayKey,
  upcomingDays,
  onDateChange,
  onMarkDayBusy,
  onMarkDayFree,
  onRefresh,
}: DoctorScheduleDayPickerProps) => (
  <section className="flex flex-col gap-lg rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
    <div className="flex flex-col gap-md md:flex-row md:items-end md:justify-between">
      <div>
        <div className="flex items-center gap-sm">
          <Icon className="text-primary" name="calendar_month" />
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Chọn ngày</h2>
        </div>
        <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{selectedDateLabel}</p>
      </div>
      <Input
        label="Ngày"
        min={todayKey}
        onChange={(event) => onDateChange(event.target.value)}
        type="date"
        value={selectedDate}
        wrapperClassName="w-full md:w-56"
      />
    </div>

    <div className="grid grid-cols-2 gap-sm md:grid-cols-7">
      {upcomingDays.map((date) => {
        const key = getDateKey(date)

        return (
          <DoctorScheduleDayButton
            active={selectedDate === key}
            date={date}
            key={key}
            onSelect={onDateChange}
            summary={daySummaryMap.get(key)}
          />
        )
      })}
    </div>

    <div className="flex flex-col gap-sm sm:flex-row sm:flex-wrap">
      <Button
        className="inline-flex items-center justify-center gap-xs px-md py-sm"
        disabled={status === 'loading' || dayAction === 'free'}
        fullWidth={false}
        isLoading={dayAction === 'busy'}
        onClick={onMarkDayBusy}
        type="button"
        variant="ghost"
      >
        <Icon className="text-lg" name="event_busy" />
        Đánh dấu bận cả ngày
      </Button>
      <Button
        className="inline-flex items-center justify-center gap-xs px-md py-sm"
        disabled={status === 'loading' || dayAction === 'busy'}
        fullWidth={false}
        isLoading={dayAction === 'free'}
        onClick={onMarkDayFree}
        type="button"
        variant="ghost"
      >
        <Icon className="text-lg" name="event_available" />
        Mở lại ngày
      </Button>
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
  </section>
)

export default DoctorScheduleDayPicker
