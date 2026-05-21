import { Link } from 'react-router-dom'
import Icon from '../../Atoms/Icon'
import type { CSSProperties } from 'react'

type DepartmentCardProps = {
  icon: string
  label: string
  tone: 'primary' | 'secondary' | 'tertiary' | 'neutral'
  className?: string
  description?: string | null
  style?: CSSProperties
  to?: string
}

const toneClasses: Record<DepartmentCardProps['tone'], string> = {
  primary: 'bg-primary-fixed/30 text-primary',
  secondary: 'bg-secondary-fixed/30 text-secondary',
  tertiary: 'bg-tertiary-fixed/30 text-tertiary',
  neutral: 'bg-surface-variant text-outline',
}

const DepartmentCard = ({ className = '', description, icon, label, style, tone, to }: DepartmentCardProps) => {
  const cardDescription = description || 'Khoa đang tiếp nhận lịch khám trong hệ thống.'
  const cardClasses = `group flex h-full flex-col rounded-2xl border border-outline-variant/30 bg-surface p-lg text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg ${className}`
  const content = (
    <>
      <div className={`mb-md flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${toneClasses[tone]}`}>
        <Icon className="text-3xl" name={icon} />
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-background">{label}</h3>
      <p className="mt-sm min-h-20 font-body-sm text-body-sm text-on-surface-variant">
        {cardDescription}
      </p>
      <span className="mt-auto inline-flex items-center gap-xs pt-md font-label-md text-label-md text-primary transition-all duration-300 group-hover:gap-sm group-hover:underline">
        Xem chi tiết <Icon className="text-lg" name="arrow_forward" />
      </span>
    </>
  )

  if (to) {
    return (
      <Link className={cardClasses} style={style} to={to}>
        {content}
      </Link>
    )
  }

  return <article className={cardClasses} style={style}>{content}</article>
}

export default DepartmentCard
