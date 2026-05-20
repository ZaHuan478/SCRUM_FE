import React from 'react'
import Icon from '../Atoms/Icon'

type DoctorRatingStarsProps = {
  rating: number
  max?: number
  readOnly?: boolean
  onSelect?: (value: number) => void
  onHover?: (value: number | null) => void
  className?: string
  sizeClassName?: string
}

const DoctorRatingStars: React.FC<DoctorRatingStarsProps> = ({
  rating,
  max = 5,
  readOnly = true,
  onSelect,
  onHover,
  className = '',
  sizeClassName = 'text-xl',
}) => {
  const stars = Array.from({ length: max }, (_, index) => index + 1)

  return (
    <div className={`flex items-center gap-xs ${className}`}>
      {stars.map((value) => {
        const isActive = value <= rating
        const iconName = isActive ? 'star' : 'star_border'

        return (
          <button
            className={`transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer'} ${isActive ? 'text-yellow-400' : 'text-outline'} ${sizeClassName}`}
            disabled={readOnly}
            key={value}
            onClick={() => onSelect?.(value)}
            onMouseEnter={() => onHover?.(value)}
            onMouseLeave={() => onHover?.(null)}
            type="button"
          >
            <Icon name={iconName} />
          </button>
        )
      })}
    </div>
  )
}

export default DoctorRatingStars
