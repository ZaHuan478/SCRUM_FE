import { useEffect, useMemo, useState } from 'react'
import TopNavBar from '../components/Organisms/TopNavBar'
import ProgressStepper from '../components/Molecules/ProgressStepper'
import CalendarPicker from '../components/Molecules/CalendarPicker'
import TimeSlotPicker from '../components/Molecules/TimeSlotPicker'
import AppointmentForm from '../components/Organisms/AppointmentForm'
import BookingSummary from '../components/Organisms/BookingSummary'
import AppFooter from '../components/Organisms/AppFooter'
import {
  appointmentSteps,
  bookingCopy,
  defaultBookingDoctor,
  insuranceProviders,
  timeSlots,
} from '../data/appointment'
import type { BookingDoctor } from '../data/appointment'
import { getDoctors } from '../services/doctor.service'
import type { Doctor } from '../services/doctor.service'

const fallbackImages = [defaultBookingDoctor.image]

const formatFee = (fee?: string | number | null) => {
  if (fee === undefined || fee === null || fee === '') return defaultBookingDoctor.fee

  const amount = Number(fee)
  if (Number.isNaN(amount)) return String(fee)

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

const specialtyFromDescription = (doctor: Doctor) => {
  const description = doctor.description?.trim()
  if (!description) return defaultBookingDoctor.specialty

  return description.split(/[,.]/)[0].slice(0, 48)
}

const mapDoctor = (doctor: Doctor, index: number): BookingDoctor => ({
  name: doctor.user?.full_name || `Bác sĩ #${doctor.id}`,
  specialty: specialtyFromDescription(doctor),
  rating: (4.8 + (index % 2) / 10).toFixed(1),
  reviewCount: 96 + index * 12,
  image: fallbackImages[index % fallbackImages.length],
  fee: formatFee(doctor.consultation_fee),
})

const AppointmentPage = () => {
  const today = useMemo(() => new Date(), [])
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedSlotId, setSelectedSlotId] = useState(timeSlots[1]?.id || timeSlots[0].id)
  const [doctor, setDoctor] = useState<BookingDoctor>(defaultBookingDoctor)

  useEffect(() => {
    let active = true

    getDoctors({ limit: 1, status: 'ACTIVE' })
      .then((result) => {
        if (!active || result.doctors.length === 0) return

        setDoctor(mapDoctor(result.doctors[0], 0))
      })
      .catch(() => {
        if (!active) return

        setDoctor(defaultBookingDoctor)
      })

    return () => {
      active = false
    }
  }, [])

  const selectedTime = timeSlots.find((slot) => slot.id === selectedSlotId)?.label || timeSlots[0].label

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNavBar />
      <main className="mx-auto max-w-7xl px-lg py-xl md:px-xxl">
        <ProgressStepper steps={appointmentSteps} />
        <div className="grid grid-cols-1 items-start gap-xxl lg:grid-cols-12">
          <div className="space-y-xl lg:col-span-8">
            <section>
              <h1 className="mb-sm font-headline-lg text-headline-lg text-on-surface">{bookingCopy.title}</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">{bookingCopy.description}</p>
            </section>
            <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
              <CalendarPicker
                onDateSelect={setSelectedDate}
                onMonthChange={setVisibleMonth}
                selectedDate={selectedDate}
                visibleMonth={visibleMonth}
              />
              <TimeSlotPicker onSelect={setSelectedSlotId} selectedSlotId={selectedSlotId} slots={timeSlots} />
            </div>
            <AppointmentForm insuranceProviders={insuranceProviders} submitLabel={bookingCopy.submitLabel} />
          </div>
          <div className="lg:col-span-4">
            <BookingSummary
              cancelPolicy={bookingCopy.cancelPolicy}
              doctor={doctor}
              privacyText={bookingCopy.privacyText}
              privacyTitle={bookingCopy.privacyTitle}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              submitLabel={bookingCopy.submitLabel}
              title={bookingCopy.summaryTitle}
            />
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

export default AppointmentPage
