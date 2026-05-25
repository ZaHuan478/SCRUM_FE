import { Link } from 'react-router-dom'
import Icon from '../../Atoms/Icon'
import { useTranslation } from '../../../contexts/LanguageContext'
import { translateDepartmentDescription, translateDepartmentName } from '../../../utils/contentTranslation'
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
  primary: 'bg-primary-fixed text-primary',
  secondary: 'bg-surface-container-low text-on-surface',
  tertiary: 'bg-surface-variant text-on-surface',
  neutral: 'bg-surface text-outline ring-1 ring-outline-variant',
}

const DepartmentCard = ({ className = '', description, icon, label, style, tone, to }: DepartmentCardProps) => {
  const { language, t } = useTranslation()
  const cardLabel = translateDepartmentName(label, language)
  const cardDescription = description
    ? translateDepartmentDescription(description, language)
    : t('departmentsPage.fallbackDescription')
  const cardClasses = `group flex h-full flex-col rounded-xl bg-surface p-xl text-left shadow-[0_2px_8px_rgba(26,26,26,0.08)] ring-1 ring-outline-variant transition-transform duration-300 hover:-translate-y-1 ${className}`
  const content = (
    <>
      <div className={`mb-md flex h-14 w-14 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105 ${toneClasses[tone]}`}>
        <Icon className="text-3xl" name={icon} />
      </div>
      <h3 className="font-headline-sm text-headline-sm font-medium leading-tight tracking-normal text-on-surface">{cardLabel}</h3>
      <p className="mt-sm min-h-20 font-body-sm text-body-sm text-on-surface-variant">
        {cardDescription}
      </p>
      <span className="mt-auto inline-flex items-center gap-xs pt-md font-label-md text-label-md text-primary transition-all duration-300 group-hover:gap-sm group-hover:underline">
        {t('departmentsPage.viewDetails')} <Icon className="text-lg" name="arrow_forward" />
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
