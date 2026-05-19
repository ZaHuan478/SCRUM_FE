import Icon from '../Atoms/Icon'
import type { DoctorReview } from '../../data/doctorDetail'

type DoctorReviewCardProps = {
  review: DoctorReview
}

const DoctorReviewCard = ({ review }: DoctorReviewCardProps) => {
  return (
    <article className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-md">
      <div className="mb-sm flex items-center gap-md">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${review.toneClassName}`}>
          {review.initials}
        </div>
        <div>
          <p className="font-label-md text-label-md text-on-surface">{review.author}</p>
          <div className="flex text-secondary-container">
            {Array.from({ length: review.rating }).map((_, index) => (
              <Icon key={`${review.id}-${index}`} name="star" className="text-xs [font-variation-settings:'FILL'_1]" />
            ))}
          </div>
        </div>
      </div>
      <p className="font-body-sm text-body-sm italic text-on-surface-variant">"{review.text}"</p>
    </article>
  )
}

export default DoctorReviewCard
