import { Link } from 'react-router-dom'
import Icon from '../Atoms/Icon'

export type DoctorCardData = {
  id?: number | string
  name: string
  specialty: string
  experienceYears: number
  rating: string
  image: string
  fee?: string
}

type DoctorCardProps = {
  doctor: DoctorCardData
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const detailPath = `/doctors/${doctor.id || 'julianne-rivers'}`

  return (
    <article className="group overflow-hidden rounded-xl border border-outline-variant/30 bg-surface shadow-sm transition-all hover:shadow-xl">
      <Link className="relative block aspect-[4/5] overflow-hidden" to={detailPath}>
        <img
          alt={doctor.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={doctor.image}
        />
        <div className="absolute right-sm top-sm flex items-center gap-xs rounded-lg bg-surface/90 px-sm py-xs backdrop-blur">
          <Icon name="star" className="text-tertiary" />
          <span className="font-label-md text-label-md text-on-surface">{doctor.rating}</span>
        </div>
      </Link>
      <div className="p-md">
        <Link className="mb-xs block font-headline-sm text-headline-sm text-on-background hover:text-primary" to={detailPath}>
          {doctor.name}
        </Link>
        <p className="mb-md inline-block rounded-lg bg-secondary-container/10 px-sm py-xs font-body-sm text-body-sm font-medium text-secondary">
          {doctor.specialty}
        </p>
        <div className="mt-md flex items-center justify-between gap-sm border-t border-outline-variant/30 pt-md">
          <span className="font-label-md text-label-md text-on-surface-variant">{doctor.experienceYears} năm kinh nghiệm</span>
          <Link className="font-label-md text-label-md text-primary hover:underline" to="/appointments/new">Đặt lịch</Link>
        </div>
        {doctor.fee && <p className="mt-sm font-body-sm text-body-sm text-on-surface-variant">Phí tư vấn: {doctor.fee}</p>}
      </div>
    </article>
  )
}

export default DoctorCard
