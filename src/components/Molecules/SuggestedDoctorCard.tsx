import Button from '../Atoms/Button'
import Icon from '../Atoms/Icon'
import Image from '../Atoms/Image'

export type SuggestedDoctor = {
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
  const tags = doctor.tags || []

  return (
    <article className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden bg-surface-variant">
        <Image alt={doctor.name || ''} className="h-full w-full object-cover" fallbackClassName="h-full w-full" src={doctor.image} />
        {doctor.badge && (
          <div className="absolute right-md top-md">
            <span className="rounded-full bg-secondary-container px-md py-xs font-label-sm text-label-sm text-on-secondary-container shadow-sm">
              {doctor.badge}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-md p-lg">
        <div>
          <h4 className="min-h-7 font-headline-sm text-headline-sm text-on-surface">{doctor.name}</h4>
          {doctor.title && <p className="font-label-md text-label-md uppercase tracking-wide text-secondary">{doctor.title}</p>}
        </div>
        {(doctor.rating || doctor.reviews) && (
          <div className="flex items-center gap-sm">
            {doctor.rating && (
              <>
                <Icon name="star" className="text-tertiary" />
                <span className="font-label-md text-label-md font-bold text-on-surface">{doctor.rating}</span>
              </>
            )}
            {doctor.reviews && <span className="font-body-sm text-body-sm text-on-surface-variant">({doctor.reviews})</span>}
          </div>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-sm">
            {tags.map((tag) => (
              <span className="rounded border border-primary/10 bg-primary/5 px-sm py-xs font-label-sm text-label-sm text-primary" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
        <Button type="button">Đặt lịch ngay</Button>
      </div>
    </article>
  )
}

export default SuggestedDoctorCard
