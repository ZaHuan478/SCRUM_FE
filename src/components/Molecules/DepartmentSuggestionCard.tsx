import { Link } from 'react-router-dom'
import Icon from '../Atoms/Icon'
import type { AIChatRecommendation } from '../../types/aiChat.types'

type DepartmentSuggestionCardProps = {
  recommendation: AIChatRecommendation
}

const DepartmentSuggestionCard = ({ recommendation }: DepartmentSuggestionCardProps) => {
  const params = new URLSearchParams()
  params.set('department_id', String(recommendation.departmentId))

  return (
    <article className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md">
      <div className="flex items-start justify-between gap-md">
        <div className="min-w-0">
          <h4 className="font-label-md text-label-md text-on-surface">{recommendation.departmentName}</h4>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{recommendation.reason}</p>
        </div>
        <span className="shrink-0 rounded-full bg-primary-fixed px-sm py-xs font-label-sm text-label-sm text-on-primary-fixed">
          {recommendation.score}%
        </span>
      </div>

      {recommendation.matchedSymptoms.length > 0 && (
        <div className="mt-sm flex flex-wrap gap-xs">
          {recommendation.matchedSymptoms.map((symptom) => (
            <span className="rounded-full bg-secondary-fixed/60 px-sm py-xs font-label-sm text-label-sm text-on-secondary-fixed" key={symptom}>
              {symptom}
            </span>
          ))}
        </div>
      )}

      <Link
        className="mt-md inline-flex w-full items-center justify-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition-all hover:bg-primary-container"
        to={`/appointments?${params.toString()}`}
      >
        <Icon className="text-lg" name="event_available" />
        Đặt lịch khoa này
      </Link>
    </article>
  )
}

export default DepartmentSuggestionCard
