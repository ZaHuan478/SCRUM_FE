import Badge from '../Atoms/Badge'
import Card from '../Atoms/Card'
import Icon from '../Atoms/Icon'
import DoctorStatItem from '../Molecules/DoctorStatItem'
import type { DoctorDetail } from '../../data/doctorDetail'

type DoctorProfileHeroProps = {
  doctor: DoctorDetail
}

const DoctorProfileHero = ({ doctor }: DoctorProfileHeroProps) => {
  return (
    <Card as="section" className="overflow-hidden p-lg md:p-xl">
      <div className="flex flex-col items-start gap-xl md:flex-row md:items-center">
        <div className="relative">
          <img
            alt={doctor.imageAlt}
            className="h-32 w-32 rounded-xl object-cover shadow-md md:h-48 md:w-48"
            src={doctor.image}
          />
          <div className="absolute -bottom-2 -right-2 flex items-center justify-center rounded-full border-4 border-surface-container-lowest bg-primary-container p-sm text-on-primary-container">
            <Icon name="verified" className="text-sm [font-variation-settings:'FILL'_1]" />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-sm">
          <div className="flex flex-wrap items-center gap-sm">
            <Badge className="bg-secondary-container/10 text-secondary">{doctor.title}</Badge>
            <div className="flex items-center gap-xs text-secondary-container">
              <Icon name="star" className="text-[16px] [font-variation-settings:'FILL'_1]" />
              <span className="font-label-md text-label-md text-on-surface">
                {doctor.rating} ({doctor.reviewCount} đánh giá)
              </span>
            </div>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">{doctor.name}</h1>
          <p className="max-w-xl font-body-md text-body-md text-on-surface-variant">{doctor.summary}</p>
          <div className="mt-md grid grid-cols-3 gap-md border-t border-outline-variant/30 pt-md">
            {doctor.stats.map((stat) => (
              <DoctorStatItem key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default DoctorProfileHero
