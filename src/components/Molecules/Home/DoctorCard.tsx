import { Link } from 'react-router-dom'
import { useTranslation } from '../../../contexts/LanguageContext'
import Icon from '../../Atoms/Icon'
import Image from '../../Atoms/Image'
import { translateDepartmentName, translateDoctorDescription } from '../../../utils/contentTranslation'

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

const DoctorCard = ({ doctor, variant = 'hp' }: DoctorCardProps) => {
  const { language, t } = useTranslation()
  const bookingSearch = new URLSearchParams()
  const experienceText =
    doctor.experienceYears !== undefined && doctor.experienceYears !== null
      ? t('common.yearsExperience', { years: doctor.experienceYears })
      : ''
  const specialtyText = doctor.specialty ? translateDepartmentName(doctor.specialty, language) : ''
  const descriptionText = doctor.description ? translateDoctorDescription(doctor.description, language) : ''

  if (doctor.id) bookingSearch.set('doctor_id', String(doctor.id))
  if (doctor.name) bookingSearch.set('doctor_name', doctor.name)

  const bookingPath = `/appointments${bookingSearch.toString() ? `?${bookingSearch.toString()}` : ''}`

  if (variant === 'hp') {
    return (
      <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-surface p-md shadow-[0_2px_8px_rgba(26,26,26,0.08)] ring-1 ring-outline-variant">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-container-low">
          <Image
            alt={doctor.name || ''}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            fallbackClassName="h-full w-full"
            src={doctor.image}
          />
          {doctor.rating && (
            <div className="absolute right-sm top-sm flex items-center gap-xs rounded-lg bg-surface px-sm py-xs shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
              <Icon name="star" className="text-primary" />
              <span className="font-label-md text-label-md text-on-surface">{doctor.rating}</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col px-sm pt-md">
          <h3 className="mb-sm min-h-7 font-headline-sm text-headline-sm font-medium leading-tight tracking-normal text-on-surface">{doctor.name}</h3>
          {specialtyText && (
            <p className="mb-md inline-flex w-fit rounded-lg bg-primary-fixed px-sm py-xs font-body-sm text-body-sm font-medium text-on-primary-fixed">
              {specialtyText}
            </p>
          )}
          {descriptionText && (
            <p className="line-clamp-3 font-body-sm text-body-sm text-on-surface-variant">{descriptionText}</p>
          )}
          {(doctor.email || doctor.phone) && (
            <div className="mt-md space-y-xs font-body-sm text-body-sm text-on-surface-variant">
              {doctor.email && <p>{doctor.email}</p>}
              {doctor.phone && <p>{doctor.phone}</p>}
            </div>
          )}
          <div className="mt-auto border-t border-outline-variant pt-md">
            <div className="mb-md flex flex-col gap-xs font-body-sm text-body-sm text-on-surface-variant">
              <span>
                {experienceText}
              </span>
              {doctor.fee && <span>{t('common.consultationFee', { fee: doctor.fee })}</span>}
            </div>
            <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
              {doctor.id && (
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded border border-on-surface bg-surface px-md py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-surface transition-colors hover:bg-surface-container-low"
                  to={`/doctors/${doctor.id}`}
                >
                  {t('common.details')}
                </Link>
              )}
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-xs rounded bg-primary px-md py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-primary transition-colors hover:bg-primary-container"
                to={bookingPath}
              >
                <Icon className="text-lg" name="event_available" />
                {t('common.book')}
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
        {specialtyText && (
          <p className="mb-md inline-block rounded-lg bg-secondary-container/10 px-sm py-xs font-body-sm text-body-sm font-medium text-secondary">
            {specialtyText}
          </p>
        )}
        {descriptionText && (
          <p className="line-clamp-3 font-body-sm text-body-sm text-on-surface-variant">{descriptionText}</p>
        )}
        {(doctor.email || doctor.phone) && (
          <div className="mt-md space-y-xs font-body-sm text-body-sm text-on-surface-variant">
            {doctor.email && <p>{doctor.email}</p>}
            {doctor.phone && <p>{doctor.phone}</p>}
          </div>
        )}
        <div className="mt-md flex flex-col gap-md border-t border-outline-variant/30 pt-md">
          <span className="font-label-md text-label-md text-on-surface-variant">
            {experienceText}
          </span>
          <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
            {doctor.id && (
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-outline-variant px-md py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                to={`/doctors/${doctor.id}`}
              >
                {t('common.details')}
              </Link>
            )}
            <Link
              className="inline-flex items-center justify-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition-all hover:bg-primary-container hover:shadow-lg active:scale-[0.98]"
              to={bookingPath}
            >
              <Icon className="text-lg" name="event_available" />
              {t('common.book')}
            </Link>
          </div>
        </div>
        {doctor.fee && <p className="mt-sm font-body-sm text-body-sm text-on-surface-variant">{t('common.consultationFee', { fee: doctor.fee })}</p>}
      </div>
    </article>
  )
}

export default DoctorCard
