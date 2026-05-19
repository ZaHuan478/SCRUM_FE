import Card from '../Atoms/Card'
import DoctorReviewCard from '../Molecules/DoctorReviewCard'
import { doctorDetailCopy } from '../../data/doctorDetail'
import type { DoctorReview } from '../../data/doctorDetail'

type DoctorReviewsPanelProps = {
  reviews: DoctorReview[]
}

const DoctorReviewsPanel = ({ reviews }: DoctorReviewsPanelProps) => {
  return (
    <Card as="section" className="p-lg md:col-span-2">
      <div className="mb-lg flex items-center justify-between gap-md">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">
          {doctorDetailCopy.reviewsTitle}
        </h2>
        <button className="font-label-md text-label-md text-primary hover:underline" type="button">
          {doctorDetailCopy.writeReview}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
        {reviews.map((review) => (
          <DoctorReviewCard key={review.id} review={review} />
        ))}
      </div>
    </Card>
  )
}

export default DoctorReviewsPanel
