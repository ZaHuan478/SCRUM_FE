import Button from '../Atoms/Button'
import Card from '../Atoms/Card'
import Icon from '../Atoms/Icon'
import type { BookingDoctor } from '../../data/appointment'

type BookingSummaryProps = {
  doctor: BookingDoctor
  title: string
  selectedDate: Date
  selectedTime: string
  cancelPolicy: string
  privacyTitle: string
  privacyText: string
  submitLabel: string
}

const formatAppointmentDate = (date: Date) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)

const BookingSummary = ({
  doctor,
  title,
  selectedDate,
  selectedTime,
  cancelPolicy,
  privacyTitle,
  privacyText,
  submitLabel,
}: BookingSummaryProps) => {
  const details = [
    { icon: 'calendar_today', label: 'Ngày', value: formatAppointmentDate(selectedDate) },
    { icon: 'schedule', label: 'Thời gian', value: selectedTime },
    { icon: 'payments', label: 'Phí tư vấn', value: doctor.fee },
  ]

  return (
    <aside className="space-y-lg lg:sticky lg:top-28">
      <Card className="overflow-hidden shadow-[0px_10px_30px_rgba(15,23,42,0.08)]">
        <div className="border-b border-outline-variant/50 bg-surface-container-low p-lg">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">{title}</h3>
        </div>
        <div className="space-y-lg p-lg">
          <div className="flex items-center gap-md">
            <img alt={doctor.name} className="h-16 w-16 rounded-lg object-cover" src={doctor.image} />
            <div>
              <h4 className="font-label-md text-label-md text-on-surface">{doctor.name}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{doctor.specialty}</p>
              <div className="mt-xs flex items-center gap-xs">
                <Icon name="star" className="text-[16px] text-secondary" />
                <span className="font-label-sm text-label-sm text-on-surface">{doctor.rating} ({doctor.reviewCount} đánh giá)</span>
              </div>
            </div>
          </div>
          <div className="space-y-md border-t border-outline-variant/40 pt-md">
            {details.map((detail) => (
              <div className="flex items-center justify-between gap-md" key={detail.label}>
                <div className="flex items-center gap-sm text-on-surface-variant">
                  <Icon name={detail.icon} className="text-[20px]" />
                  <span className="font-body-sm text-body-sm">{detail.label}</span>
                </div>
                <span className="text-right font-label-md text-label-md text-on-surface">{detail.value}</span>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-md rounded-lg border border-secondary-container/20 bg-secondary-container/10 p-md">
            <Icon name="info" className="text-secondary" />
            <p className="font-body-sm text-body-sm text-secondary">{cancelPolicy}</p>
          </div>
          <Button className="hidden lg:inline-flex" type="button">{submitLabel}</Button>
        </div>
      </Card>
      <Card className="flex items-center gap-md border-primary/10 bg-primary/5 p-lg">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest shadow-sm">
          <Icon name="verified_user" className="text-primary" />
        </div>
        <div>
          <p className="font-label-md text-label-md text-on-surface">{privacyTitle}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{privacyText}</p>
        </div>
      </Card>
    </aside>
  )
}

export default BookingSummary
