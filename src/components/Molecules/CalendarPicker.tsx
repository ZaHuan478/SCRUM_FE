import { useMemo } from 'react'
import Card from '../Atoms/Card'
import Icon from '../Atoms/Icon'

type CalendarPickerProps = {
  visibleMonth: Date
  selectedDate: Date
  onMonthChange: (date: Date) => void
  onDateSelect: (date: Date) => void
}

const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

const isSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate()

const buildMonthDays = (month: Date) => {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstDay = new Date(year, monthIndex, 1)
  const dayCount = new Date(year, monthIndex + 1, 0).getDate()

  return [
    ...Array.from({ length: firstDay.getDay() }, () => null),
    ...Array.from({ length: dayCount }, (_, index) => new Date(year, monthIndex, index + 1)),
  ]
}

const CalendarPicker = ({ visibleMonth, selectedDate, onMonthChange, onDateSelect }: CalendarPickerProps) => {
  const days = useMemo(() => buildMonthDays(visibleMonth), [visibleMonth])
  const monthLabel = new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' }).format(visibleMonth)

  const moveMonth = (offset: number) => {
    onMonthChange(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1))
  }

  return (
    <Card className="p-lg">
      <div className="mb-lg flex items-center justify-between gap-md">
        <h3 className="font-headline-sm text-headline-sm capitalize text-on-surface">{monthLabel}</h3>
        <div className="flex gap-sm">
          <button
            aria-label="Tháng trước"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high"
            onClick={() => moveMonth(-1)}
            type="button"
          >
            <Icon name="chevron_left" />
          </button>
          <button
            aria-label="Tháng sau"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high"
            onClick={() => moveMonth(1)}
            type="button"
          >
            <Icon name="chevron_right" />
          </button>
        </div>
      </div>
      <div className="mb-sm grid grid-cols-7 gap-xs text-center">
        {weekDays.map((day) => (
          <span className="font-label-sm text-label-sm text-outline" key={day}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-xs text-center">
        {days.map((day, index) => {
          if (!day) return <span aria-hidden className="min-h-10" key={`empty-${index}`} />

          const selected = isSameDay(day, selectedDate)

          return (
            <button
              className={`min-h-10 rounded-lg p-sm font-body-sm text-body-sm transition-all ${
                selected
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface hover:bg-surface-container-high hover:text-primary'
              }`}
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              type="button"
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

export default CalendarPicker
