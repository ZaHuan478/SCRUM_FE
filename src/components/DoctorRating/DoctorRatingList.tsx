import React from 'react'
import type { DoctorRatingItem } from '../../api/doctorRating.api'
import Button from '../Atoms/Button'
import RatingCommentCard from './RatingCommentCard'

type DoctorRatingListProps = {
  ratings: DoctorRatingItem[]
  isLoading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  framed?: boolean
}

const DoctorRatingList: React.FC<DoctorRatingListProps> = ({
  ratings,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  framed = true,
}) => {
  const emptyStateClassName = framed
    ? 'rounded-xl border border-outline-variant/30 bg-surface p-lg shadow-sm'
    : 'rounded-lg bg-surface-container-lowest p-lg'

  if (isLoading && ratings.length === 0) {
    return (
      <div className={emptyStateClassName}>
        <p className="font-body-md text-body-md text-on-surface-variant">Đang tải đánh giá...</p>
      </div>
    )
  }

  return (
    <div className="space-y-md">
      {ratings.length === 0 ? (
        <div className={emptyStateClassName}>
          <p className="font-body-md text-body-md text-on-surface-variant">Chưa có đánh giá nào.</p>
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
          {isLoading ? 'Đang tải...' : 'Tải thêm'}
        </Button>
      )}
    </div>
  )
}

export default DoctorRatingList
