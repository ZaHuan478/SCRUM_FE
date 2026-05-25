import { Link } from 'react-router-dom'
import { useTranslation } from '../../../contexts/LanguageContext'
import Icon from '../../Atoms/Icon'
import Image from '../../Atoms/Image'
import { translateDepartmentName, translateDoctorDescription } from '../../../utils/contentTranslation'

export type SuggestedDoctor = {
  id?: number | string
  name?: string
  title?: string
  rating?: string
  reviews?: string
  tags?: string[]
  image?: string
  badge?: string
}

type SuggestedDoctorCardProps = {
  doctor: SuggestedDoctor
}

const SuggestedDoctorCard = ({ doctor }: SuggestedDoctorCardProps) => {
  const { language, t } = useTranslation()
  const tags = doctor.tags || []
  const title = doctor.title?.includes('Bác sĩ') ? translateDoctorDescription(doctor.title, language) : doctor.title || ''
  const bookingSearch = new URLSearchParams()

  if (doctor.id) bookingSearch.set('doctor_id', String(doctor.id))
  if (doctor.name) bookingSearch.set('doctor_name', doctor.name)

  const bookingPath = `/appointments${bookingSearch.toString() ? `?${bookingSearch.toString()}` : ''}`

  return (
    <article className="overflow-hidden rounded-xl bg-surface shadow-[0_2px_8px_rgba(26,26,26,0.08)] ring-1 ring-outline-variant transition-transform hover:-translate-y-1">
      <div className="relative h-48 w-full overflow-hidden bg-surface-variant">
        <Image alt={doctor.name || ''} className="h-full w-full object-cover" fallbackClassName="h-full w-full" src={doctor.image} />
        {doctor.badge && (
          <div className="absolute right-md top-md">
            <span className="rounded-lg bg-primary-fixed px-md py-xs font-label-sm text-label-sm text-on-primary-fixed">
              {doctor.badge}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-md p-lg">
        <div>
          <h4 className="min-h-7 font-headline-sm text-headline-sm text-on-surface">{doctor.name}</h4>
          {title && <p className="font-label-md text-label-md uppercase tracking-wide text-primary">{title}</p>}
        </div>
        {(doctor.rating || doctor.reviews) && (
          <div className="flex items-center gap-sm">
            {doctor.rating && (
              <>
                <Icon name="star" className="text-primary" />
                <span className="font-label-md text-label-md font-bold text-on-surface">{doctor.rating}</span>
              </>
            )}
            {doctor.reviews && <span className="font-body-sm text-body-sm text-on-surface-variant">({doctor.reviews})</span>}
          </div>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-sm">
            {tags.map((tag) => (
              <span className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-xs font-label-sm text-label-sm text-on-surface-variant" key={tag}>
                {translateDepartmentName(tag, language)}
              </span>
            ))}
          </div>
        )}
        <Link
          className="inline-flex min-h-11 w-full items-center justify-center rounded bg-primary px-md py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-primary transition-colors hover:bg-primary-container active:scale-[0.98]"
          to={bookingPath}
        >
          {t('common.bookNow')}
        </Link>
      </div>
    </article>
  )
}

export default SuggestedDoctorCard
