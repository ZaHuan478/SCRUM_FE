import React from 'react'
import type { DoctorRatingItem } from '../../services/doctorRating.api'
import Button from '../Atoms/Button'
import RatingCommentCard from './RatingCommentCard'

type DoctorRatingListProps = {
  ratings: DoctorRatingItem[]
  isLoading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
}

const DoctorRatingList: React.FC<DoctorRatingListProps> = ({
  ratings,
  isLoading = false,
  hasMore = false,
  onLoadMore,
}) => {
  if (isLoading && ratings.length === 0) {
    return (
      <div className="rounded-xl border border-outline-variant/30 bg-surface p-lg shadow-sm">
        <p className="font-body-md text-body-md text-on-surface-variant">Loading reviews...</p>
      </div>
    )
  }

  return (
    <div className="space-y-md">
      {ratings.length === 0 ? (
        <div className="rounded-xl border border-outline-variant/30 bg-surface p-lg shadow-sm">
          <p className="font-body-md text-body-md text-on-surface-variant">No reviews yet.</p>
        </div>
      ) : (
        ratings.map((rating) => (
          <RatingCommentCard
            comment={rating.comment}
            createdAt={rating.createdAt}
            key={rating.id}
            name={rating.patientName}
            rating={rating.rating}
          />
        ))
      )}

      {hasMore && (
        <Button
          className="mx-auto"
          fullWidth={false}
          onClick={onLoadMore}
          type="button"
          variant="ghost"
        >
          {isLoading ? 'Loading...' : 'Load more'}
        </Button>
      )}
    </div>
  )
}

export default DoctorRatingList
