import React, { useEffect, useState } from 'react'
import Button from '../Atoms/Button'
import DoctorRatingStars from './DoctorRatingStars'

type DoctorRatingFormProps = {
  initialRating?: number
  initialComment?: string | null
  isSubmitting?: boolean
  error?: string
  success?: string
  submitLabel?: string
  updateLabel?: string
  onSubmit: (payload: { rating: number; comment?: string | null }) => void
  onDelete?: () => void
  canDelete?: boolean
}

const DoctorRatingForm: React.FC<DoctorRatingFormProps> = ({
  initialRating = 0,
  initialComment = '',
  isSubmitting = false,
  error,
  success,
  submitLabel = 'Submit Review',
  updateLabel = 'Update Review',
  onSubmit,
  onDelete,
  canDelete = false,
}) => {
  const [rating, setRating] = useState(initialRating)
  const [comment, setComment] = useState(initialComment || '')
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  useEffect(() => {
    setRating(initialRating)
  }, [initialRating])

  useEffect(() => {
    setComment(initialComment || '')
  }, [initialComment])

  const displayRating = hoverRating ?? rating

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({ rating, comment: comment.trim() || null })
  }

  return (
    <form className="rounded-xl border border-outline-variant/30 bg-surface p-lg shadow-sm" onSubmit={handleSubmit}>
      <h3 className="font-headline-md text-headline-md text-on-surface">Your review</h3>

      <div className="mt-md">
        <DoctorRatingStars
          className="gap-sm"
          onHover={setHoverRating}
          onSelect={setRating}
          rating={displayRating}
          readOnly={false}
          sizeClassName="text-2xl"
        />
        <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
          {rating ? `${rating} / 5` : 'Select a rating'}
        </p>
      </div>

      <div className="mt-md">
        <textarea
          className="min-h-[120px] w-full rounded-lg border border-outline-variant/40 bg-white px-md py-sm font-body-md text-body-md text-on-surface outline-none transition focus:border-primary"
          maxLength={2000}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Share your experience (optional)"
          value={comment}
        />
      </div>

      {error && (
        <p className="mt-md rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-md rounded-lg bg-secondary-fixed px-md py-sm font-body-sm text-body-sm text-on-secondary-fixed">
          {success}
        </p>
      )}

      <div className="mt-lg flex flex-wrap gap-sm">
        <Button isLoading={isSubmitting} type="submit">
          {initialRating ? updateLabel : submitLabel}
        </Button>
        {canDelete && onDelete && (
          <Button
            className="border-error text-error hover:border-error"
            fullWidth={false}
            onClick={onDelete}
            type="button"
            variant="ghost"
          >
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}

export default DoctorRatingForm
