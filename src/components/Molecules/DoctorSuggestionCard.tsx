import { Link } from 'react-router-dom'
import Icon from '../Atoms/Icon'
import Image from '../Atoms/Image'
import type { AIChatDoctorRecommendation } from '../../types/aiChat.types'

type DoctorSuggestionCardProps = {
  doctor: AIChatDoctorRecommendation
}

const formatSlotTime = (value?: string) => {
  if (!value) return ''

  const date = new Date(value)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
  }).format(date)
}

const DoctorSuggestionCard = ({ doctor }: DoctorSuggestionCardProps) => {
  const params = new URLSearchParams()
  params.set('doctor_id', String(doctor.doctorId))
  params.set('doctor_name', doctor.doctorName)

  return (
    <article className="rounded-lg border border-primary/20 bg-surface-container-lowest p-md">
      <div className="flex items-start justify-between gap-md">
        <div className="flex min-w-0 items-start gap-sm">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-outline-variant/30 bg-surface-container">
            <Image
              alt={doctor.doctorName}
              className="h-full w-full object-cover"
              fallbackClassName="h-full w-full"
              src={doctor.imageUrl || undefined}
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-label-md text-label-md text-on-surface">{doctor.doctorName}</h4>
            <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
              {doctor.departmentName}
              {doctor.experienceYears ? ` - ${doctor.experienceYears} năm kinh nghiệm` : ''}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-primary-fixed px-sm py-xs font-label-sm text-label-sm text-on-primary-fixed">
          {doctor.score}%
        </span>
      </div>

      <p className="mt-sm font-body-sm text-body-sm text-on-surface-variant">{doctor.reason}</p>

      {doctor.nextAvailableSlot && (
        <p className="mt-sm inline-flex items-center gap-xs rounded-full bg-secondary-fixed/60 px-sm py-xs font-body-sm text-body-sm text-on-secondary-fixed">
          <Icon className="text-lg" name="schedule" />
          Gần nhất: {formatSlotTime(doctor.nextAvailableSlot.startTime)}
        </p>
      )}

      <Link
        className="mt-md inline-flex w-full items-center justify-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition-all hover:bg-primary-container"
        to={`/appointments?${params.toString()}`}
      >
        <Icon className="text-lg" name="event_available" />
        Đặt lịch bác sĩ này
      </Link>
    </article>
  )
}

export default DoctorSuggestionCard
