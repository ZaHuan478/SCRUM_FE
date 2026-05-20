import React from 'react'
import DoctorRatingStars from './DoctorRatingStars'

type RatingCommentCardProps = {
  name: string
  rating: number
  comment?: string | null
  createdAt: string
}

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('vi-VN')
}

const RatingCommentCard: React.FC<RatingCommentCardProps> = ({ name, rating, comment, createdAt }) => {
  return (
    <div className="rounded-xl border border-outline-variant/30 bg-white p-md shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-sm">
        <div>
          <p className="font-label-md text-label-md text-on-surface">{name}</p>
          <p className="mt-xxs font-body-sm text-body-sm text-on-surface-variant">{formatDate(createdAt)}</p>
        </div>
        <DoctorRatingStars rating={rating} sizeClassName="text-lg" />
      </div>
      <p className="mt-sm font-body-md text-body-md text-on-surface-variant">
        {comment || 'No comment provided.'}
      </p>
    </div>
  )
}

export default RatingCommentCard
