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
      <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-surface/82 shadow-[0_26px_70px_rgba(15,23,42,0.11)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_34px_82px_rgba(15,23,42,0.15)]">
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-container-low">
          <Image
            alt={doctor.name || ''}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            fallbackClassName="h-full w-full"
            src={doctor.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-background/58 via-on-background/10 to-transparent" />
          <div className="absolute left-md top-md inline-flex max-w-[calc(100%-7rem)] items-center gap-xs rounded-full bg-on-background/68 px-md py-xs font-label-sm text-label-sm uppercase text-inverse-on-surface shadow-[0_12px_26px_rgba(15,23,42,0.20)] backdrop-blur-xl">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.18)]" />
            <span className="truncate">{t('home.hero.verified')}</span>
          </div>
          <div className="absolute right-md top-md inline-flex items-center gap-xs rounded-full bg-surface/88 px-md py-xs font-label-md text-label-md text-on-surface shadow-[0_12px_26px_rgba(15,23,42,0.14)] backdrop-blur-xl">
            <Icon name="star" className="text-primary" />
            <span>{doctor.rating || (doctor.experienceYears ? `${doctor.experienceYears}+` : 'Top')}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-lg sm:p-xl">
          <div className="min-h-[6.75rem]">
            <h3 className="font-headline-sm text-[26px] font-semibold uppercase leading-[1.05] tracking-normal text-on-surface sm:text-[28px]">
              {doctor.name}
            </h3>
            <div className="mt-sm flex min-w-0 items-center gap-xs font-label-sm text-label-sm uppercase text-on-surface-variant">
              <Icon className="text-primary" name="clinical_notes" />
              <span className="truncate">
                {specialtyText || experienceText || t('common.doctors')}
              </span>
            </div>
            {descriptionText && (
              <p className="mt-md line-clamp-2 font-body-sm text-body-sm text-on-surface-variant">{descriptionText}</p>
            )}
          </div>

          <Link
            className="mt-lg flex min-h-20 items-center gap-md rounded-[1.5rem] bg-primary-fixed/45 p-sm pr-md text-left shadow-inner transition-all hover:bg-primary-fixed/65"
            to={bookingPath}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface text-primary shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
              <Icon name="event_available" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-label-sm text-label-sm uppercase text-on-surface-variant">{t('common.book')}</span>
              <span className="mt-xs block truncate font-label-md text-label-md text-on-surface">
                {doctor.fee ? t('common.consultationFee', { fee: doctor.fee }) : t('common.appointments')}
              </span>
            </span>
            <Icon className="text-outline transition-transform group-hover:translate-x-1" name="chevron_right" />
          </Link>

          <div className="mt-md flex items-center justify-center">
            {doctor.id && (
              <Link
                className="inline-flex items-center gap-xs rounded-full px-md py-sm font-label-sm text-label-sm uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:text-primary"
                to={`/doctors/${doctor.id}`}
              >
                {t('common.details')}
                <Icon name="arrow_forward" />
              </Link>
            )}
          </div>

          {(doctor.email || doctor.phone) && (
            <div className="mt-auto grid gap-xs pt-md font-body-sm text-body-sm text-on-surface-variant">
              {doctor.email && <p className="truncate">{doctor.email}</p>}
              {doctor.phone && <p className="truncate">{doctor.phone}</p>}
            </div>
          )}
        </div>
      </article>
    )
  }

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/70 bg-surface/78 shadow-[0_22px_58px_rgba(15,23,42,0.10)] backdrop-blur-2xl transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_30px_72px_rgba(15,23,42,0.14)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-variant">
        <Image
          alt={doctor.name || ''}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          fallbackClassName="h-full w-full"
          src={doctor.image}
        />
        {doctor.rating && (
          <div className="absolute right-sm top-sm flex items-center gap-xs rounded-full bg-surface/90 px-sm py-xs shadow-sm backdrop-blur">
            <Icon name="star" className="text-tertiary" />
            <span className="font-label-md text-label-md text-on-surface">{doctor.rating}</span>
          </div>
        )}
      </div>
      <div className="p-md">
        <h3 className="mb-xs min-h-7 font-headline-sm text-headline-sm text-on-background">{doctor.name}</h3>
        {specialtyText && (
          <p className="mb-md inline-block rounded-full bg-primary-fixed/40 px-sm py-xs font-body-sm text-body-sm font-medium text-primary">
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
                className="inline-flex items-center justify-center rounded-2xl border border-outline-variant/45 bg-surface/76 px-md py-sm font-label-md text-label-md text-on-surface-variant shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:text-primary"
                to={`/doctors/${doctor.id}`}
              >
                {t('common.details')}
              </Link>
            )}
            <Link
              className="inline-flex items-center justify-center gap-xs rounded-2xl bg-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-[0_14px_28px_rgba(2,132,199,0.20)] transition-all hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-lg active:scale-[0.98]"
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
