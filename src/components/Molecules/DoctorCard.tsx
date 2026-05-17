import Button from '../Atoms/Button'
import Icon from '../Atoms/Icon'
import Image from '../Atoms/Image'

export type DoctorCardData = {
  name?: string
  specialty?: string
  experienceYears?: number | null
  rating?: string
  image?: string
  fee?: string
}

type DoctorCardProps = {
  doctor: DoctorCardData
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
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
        <div className="mt-md flex items-center justify-between gap-sm border-t border-outline-variant/30 pt-md">
          <span className="font-label-md text-label-md text-on-surface-variant">
            {doctor.experienceYears !== undefined && doctor.experienceYears !== null ? `${doctor.experienceYears} năm kinh nghiệm` : ''}
          </span>
          <Button className="border-none p-0 text-primary shadow-none hover:bg-transparent hover:underline" fullWidth={false} type="button" variant="ghost">Đặt lịch</Button>
        </div>
        {doctor.fee && <p className="mt-sm font-body-sm text-body-sm text-on-surface-variant">Phí tư vấn: {doctor.fee}</p>}
      </div>
    </article>
  )
}

export default DoctorCard
