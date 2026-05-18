import { Link } from 'react-router-dom'
import Icon from '../../Atoms/Icon'
import Image from '../../Atoms/Image'

export type DoctorCardData = {
  id?: number | string
  name?: string
  specialty?: string
  experienceYears?: number | null
  rating?: string
  image?: string
  fee?: string
  email?: string
  phone?: string | null
  description?: string | null
}

type DoctorCardProps = {
  doctor: DoctorCardData
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const bookingSearch = new URLSearchParams()

  if (doctor.id) bookingSearch.set('doctor_id', String(doctor.id))
  if (doctor.name) bookingSearch.set('doctor_name', doctor.name)

  const bookingPath = `/appointments${bookingSearch.toString() ? `?${bookingSearch.toString()}` : ''}`

  return (
    <article className="group overflow-hidden rounded-xl border border-outline-variant/30 bg-surface shadow-sm transition-all hover:shadow-xl">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-variant">
        <Image
          alt={doctor.name || ''}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          fallbackClassName="h-full w-full"
          src={doctor.image}
        />
        {doctor.rating && (
          <div className="absolute right-sm top-sm flex items-center gap-xs rounded-lg bg-surface/90 px-sm py-xs backdrop-blur">
            <Icon name="star" className="text-tertiary" />
            <span className="font-label-md text-label-md text-on-surface">{doctor.rating}</span>
          </div>
        )}
      </div>
      <div className="p-md">
        <h3 className="mb-xs min-h-7 font-headline-sm text-headline-sm text-on-background">{doctor.name}</h3>
        {doctor.specialty && (
          <p className="mb-md inline-block rounded-lg bg-secondary-container/10 px-sm py-xs font-body-sm text-body-sm font-medium text-secondary">
            {doctor.specialty}
          </p>
        )}
        {doctor.description && (
          <p className="line-clamp-3 font-body-sm text-body-sm text-on-surface-variant">{doctor.description}</p>
        )}
        {(doctor.email || doctor.phone) && (
          <div className="mt-md space-y-xs font-body-sm text-body-sm text-on-surface-variant">
            {doctor.email && <p>{doctor.email}</p>}
            {doctor.phone && <p>{doctor.phone}</p>}
          </div>
        )}
        <div className="mt-md flex items-center justify-between gap-sm border-t border-outline-variant/30 pt-md">
          <span className="font-label-md text-label-md text-on-surface-variant">
            {doctor.experienceYears !== undefined && doctor.experienceYears !== null ? `${doctor.experienceYears} năm kinh nghiệm` : ''}
          </span>
          <Link className="font-label-md text-label-md text-primary transition-colors hover:underline" to={bookingPath}>
            Đặt lịch
          </Link>
        </div>
        {doctor.fee && <p className="mt-sm font-body-sm text-body-sm text-on-surface-variant">Phí tư vấn: {doctor.fee}</p>}
      </div>
    </article>
  )
}

export default DoctorCard
