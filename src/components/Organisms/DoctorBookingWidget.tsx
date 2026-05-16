import { Link } from 'react-router-dom'
import { useState } from 'react'
import Button from '../Atoms/Button'
import Card from '../Atoms/Card'
import Icon from '../Atoms/Icon'
import {
  doctorBookingDays,
  doctorDetailCopy,
  doctorTimeSlots,
} from '../../data/doctorDetail'

const DoctorBookingWidget = () => {
  const firstAvailable = doctorTimeSlots.find((slot) => !slot.disabled)
  const [selectedSlotId, setSelectedSlotId] = useState(firstAvailable?.id || '')

  return (
    <aside className="lg:col-span-4">
      <div className="sticky top-24 flex flex-col gap-lg">
        <Card as="section" className="border-outline-variant/40 p-lg shadow-[0px_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-primary/5">
          <div className="mb-lg flex items-center justify-between gap-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              {doctorDetailCopy.bookTitle}
            </h3>
            <div className="text-right">
              <p className="font-label-sm text-label-sm uppercase text-outline">
                {doctorDetailCopy.earliestLabel}
              </p>
              <p className="font-label-md text-label-md text-secondary">
                {doctorDetailCopy.earliestValue}
              </p>
            </div>
          </div>
          <div className="mb-lg">
            <label className="mb-sm block font-label-md text-label-md text-on-surface-variant">
              {doctorDetailCopy.dateLabel}
            </label>
            <div className="grid grid-cols-7 gap-xs rounded-lg border border-outline-variant/30 p-sm text-center">
              {doctorBookingDays.map((day) => (
                <div key={day.label}>
                  <p className="py-xs text-[10px] font-bold uppercase text-outline">{day.label}</p>
                  <button
                    className={`w-full rounded-md py-sm font-label-sm text-label-sm transition-colors ${
                      day.selected
                        ? 'bg-primary/10 font-bold text-on-surface'
                        : day.disabled
                          ? 'cursor-not-allowed text-outline-variant'
                          : 'text-on-surface hover:bg-surface-container'
                    }`}
                    disabled={day.disabled}
                    type="button"
                  >
                    {day.day}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-xxl">
            <label className="mb-sm block font-label-md text-label-md text-on-surface-variant">
              {doctorDetailCopy.timeLabel}
            </label>
            <div className="grid grid-cols-2 gap-sm sm:grid-cols-3">
              {doctorTimeSlots.map((slot) => {
                const selected = slot.id === selectedSlotId

                return (
                  <button
                    className={`rounded-lg border py-sm font-label-sm text-label-sm transition-all ${
                      slot.disabled
                        ? 'cursor-not-allowed border-outline-variant text-outline-variant line-through'
                        : selected
                          ? 'border-primary bg-primary text-on-primary shadow-md'
                          : 'border-outline-variant text-on-surface hover:bg-surface-container-high'
                    }`}
                    disabled={slot.disabled}
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    type="button"
                  >
                    {slot.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex flex-col gap-md">
            <Link to="/appointments/new">
              <Button className="gap-sm" fullWidth>
                <Icon name="calendar_add_on" className="text-[20px]" />
                {doctorDetailCopy.confirmLabel}
              </Button>
            </Link>
            <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
              {doctorDetailCopy.bookingNote}
            </p>
          </div>
        </Card>
        <Card as="section" className="flex items-center gap-md bg-surface-container-low p-md">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-on-primary-fixed text-primary-fixed">
            <Icon name="security" />
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface">{doctorDetailCopy.secureTitle}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {doctorDetailCopy.secureDescription}
            </p>
          </div>
        </Card>
      </div>
    </aside>
  )
}

export default DoctorBookingWidget
