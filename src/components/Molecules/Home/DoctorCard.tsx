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
  variant?: 'default' | 'hp'
}

const DoctorCard = ({ doctor, variant = 'default' }: DoctorCardProps) => {
  const bookingSearch = new URLSearchParams()

  if (doctor.id) bookingSearch.set('doctor_id', String(doctor.id))
  if (doctor.name) bookingSearch.set('doctor_name', doctor.name)

  const bookingPath = `/appointments${bookingSearch.toString() ? `?${bookingSearch.toString()}` : ''}`

  if (variant === 'hp') {
    return (
      <article className="group flex h-full flex-col overflow-hidden rounded-[16px] bg-white p-md shadow-[0_2px_8px_rgba(26,26,26,0.08)] ring-1 ring-[#e8e8e8]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-[#f7f7f7]">
          <Image
            alt={doctor.name || ''}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            fallbackClassName="h-full w-full"
            src={doctor.image}
          />
          {doctor.rating && (
            <div className="absolute right-sm top-sm flex items-center gap-xs rounded-[8px] bg-white px-sm py-xs shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
              <Icon name="star" className="text-[#024ad8]" />
              <span className="font-label-md text-label-md text-[#1a1a1a]">{doctor.rating}</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col px-sm pt-md">
          <h3 className="mb-sm min-h-7 font-headline-sm text-[20px] font-medium leading-none tracking-normal text-[#1a1a1a]">{doctor.name}</h3>
          {doctor.specialty && (
            <p className="mb-md inline-flex w-fit rounded-[8px] bg-[#c9e0fc] px-sm py-xs font-body-sm text-body-sm font-medium text-[#1a1a1a]">
              {doctor.specialty}
            </p>
          )}
          {doctor.description && (
            <p className="line-clamp-3 font-body-sm text-body-sm text-[#3d3d3d]">{doctor.description}</p>
          )}
          {(doctor.email || doctor.phone) && (
            <div className="mt-md space-y-xs font-body-sm text-body-sm text-[#636363]">
              {doctor.email && <p>{doctor.email}</p>}
              {doctor.phone && <p>{doctor.phone}</p>}
            </div>
          )}
          <div className="mt-auto border-t border-[#e8e8e8] pt-md">
            <div className="mb-md flex flex-col gap-xs font-body-sm text-body-sm text-[#636363]">
              <span>
                {doctor.experienceYears !== undefined && doctor.experienceYears !== null ? `${doctor.experienceYears} năm kinh nghiệm` : ''}
              </span>
              {doctor.fee && <span>Phí tư vấn: {doctor.fee}</span>}
            </div>
            <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
              {doctor.id && (
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-[4px] border border-[#1a1a1a] bg-white px-md py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-[#1a1a1a] transition-colors hover:bg-[#f7f7f7]"
                  to={`/doctors/${doctor.id}`}
                >
                  Chi tiết
                </Link>
              )}
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-xs rounded-[4px] bg-[#024ad8] px-md py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-white transition-colors hover:bg-[#0e3191]"
                to={bookingPath}
              >
                <Icon className="text-lg" name="event_available" />
                Đặt lịch
              </Link>
            </div>
          </div>
        </div>
      </article>
    )
  }

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
        <div className="mt-md flex flex-col gap-md border-t border-outline-variant/30 pt-md">
          <span className="font-label-md text-label-md text-on-surface-variant">
            {doctor.experienceYears !== undefined && doctor.experienceYears !== null ? `${doctor.experienceYears} năm kinh nghiệm` : ''}
          </span>
          <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
            {doctor.id && (
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-outline-variant px-md py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                to={`/doctors/${doctor.id}`}
              >
                Chi tiết
              </Link>
            )}
            <Link
              className="inline-flex items-center justify-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition-all hover:bg-primary-container hover:shadow-lg active:scale-[0.98]"
              to={bookingPath}
            >
              <Icon className="text-lg" name="event_available" />
              Đặt lịch
            </Link>
          </div>
        </div>
        {doctor.fee && <p className="mt-sm font-body-sm text-body-sm text-on-surface-variant">Phí tư vấn: {doctor.fee}</p>}
      </div>
    </article>
  )
}

export default DoctorCard
