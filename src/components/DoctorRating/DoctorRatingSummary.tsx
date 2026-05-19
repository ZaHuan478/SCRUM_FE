import React from 'react'
import DoctorRatingStars from './DoctorRatingStars'
import type { DoctorRatingSummary as DoctorRatingSummaryType } from '../../services/doctorRating.api'

type DoctorRatingSummaryProps = {
  summary: DoctorRatingSummaryType | null
  isLoading?: boolean
}

const DoctorRatingSummary: React.FC<DoctorRatingSummaryProps> = ({ summary, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-outline-variant/30 bg-surface p-lg shadow-sm">
        <p className="font-body-md text-body-md text-on-surface-variant">Loading rating summary...</p>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="rounded-xl border border-outline-variant/30 bg-surface p-lg shadow-sm">
        <p className="font-body-md text-body-md text-on-surface-variant">No ratings yet.</p>
      </div>
    )
  }

  const averageLabel = summary.totalRatings ? summary.averageRating.toFixed(1) : '0.0'
  const displayStars = Math.round(summary.averageRating)
  const total = summary.totalRatings || 0
  const distribution = summary.ratingDistribution
  const rows = [5, 4, 3, 2, 1]

  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface p-lg shadow-sm">
      <div className="flex flex-col gap-lg lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display-md text-display-md text-on-surface">{averageLabel}/5</p>
          <div className="mt-xs">
            <DoctorRatingStars rating={displayStars} sizeClassName="text-2xl" />
          </div>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{summary.totalRatings} reviews</p>
        </div>
        <div className="flex-1 space-y-xs">
          {rows.map((value) => {
            const count = distribution[value as keyof typeof distribution] || 0
            const percentage = total ? Math.round((count / total) * 100) : 0

            return (
              <div className="flex items-center gap-sm" key={value}>
                <span className="w-10 font-body-sm text-body-sm text-on-surface-variant">{value} star</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-low">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right font-body-sm text-body-sm text-on-surface-variant">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DoctorRatingSummary
