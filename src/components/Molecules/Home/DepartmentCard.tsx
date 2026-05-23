import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getDepartmentIconMeta } from '../../../constants/departmentIcons'
import type { CSSProperties } from 'react'

type DepartmentCardProps = {
  label: string
  className?: string
  description?: string | null
  style?: CSSProperties
  to?: string
}

const DepartmentCard = ({ className = '', description, label, style, to }: DepartmentCardProps) => {
  const { Icon, backgroundClassName, colorClassName, hoverClassName } = getDepartmentIconMeta(label)
  const cardDescription = description || 'Khoa đang tiếp nhận lịch khám trong hệ thống.'
  const cardClasses = `group flex h-full min-h-64 flex-col rounded-2xl border border-outline-variant/40 bg-surface/90 p-lg text-left shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/60 hover:bg-surface hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 sm:p-xl ${className}`
  const content = (
    <>
      <div className={`mb-lg flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-white/70 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg ${backgroundClassName} ${colorClassName} ${hoverClassName}`}>
        <Icon aria-hidden="true" className="h-7 w-7 stroke-[2.2]" />
      </div>
      <h3 className="font-headline-sm text-headline-sm leading-snug text-on-background">{label}</h3>
      <p className="mt-sm line-clamp-4 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
        {cardDescription}
      </p>
      <span className="mt-auto inline-flex items-center gap-xs pt-lg font-label-md text-label-md text-primary underline-offset-4 transition-all duration-300 group-hover:gap-sm group-hover:underline">
        Xem chi tiết
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
