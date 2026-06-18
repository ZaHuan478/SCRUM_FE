import { Link } from 'react-router-dom'
import Icon from '../../Atoms/Icon'
import { useTranslation } from '../../../contexts/LanguageContext'
import { getDepartmentIconMeta } from '../../../constants/departmentIcons'
import { translateDepartmentDescription, translateDepartmentName } from '../../../utils/contentTranslation'
import type { CSSProperties } from 'react'

type DepartmentCardProps = {
  label: string
  className?: string
  description?: string | null
  style?: CSSProperties
  to?: string
}

const DepartmentCard = ({ className = '', description, label, style, to }: DepartmentCardProps) => {
  const { language, t } = useTranslation()
  const { Icon: DepartmentIcon, colorClassName } = getDepartmentIconMeta(label)
  const cardLabel = translateDepartmentName(label, language)
  const cardDescription = description
    ? translateDepartmentDescription(description, language)
    : t('departmentsPage.fallbackDescription')
  const cardClasses = `group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-surface/84 p-sm text-left shadow-[0_26px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_34px_82px_rgba(15,23,42,0.14)] ${className}`
  const content = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-primary-fixed/70 via-surface to-secondary-fixed/55">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(15,23,42,0.06)_50%,rgba(15,23,42,0.46)_100%)]" />
        <div className="absolute right-md top-md inline-flex items-center gap-xs rounded-full bg-surface/88 px-sm py-xs font-label-sm text-label-sm text-on-surface shadow-[0_12px_26px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <Icon className="text-primary" name="star" />
          <span>Top</span>
        </div>
        <div className={`absolute left-1/2 top-[44%] flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] border border-white/70 bg-surface/82 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-300 group-hover:scale-105 ${colorClassName}`}>
          <DepartmentIcon className="h-14 w-14" />
        </div>
        <div className="absolute bottom-lg left-lg right-lg">
          <p className="mb-xs font-label-sm text-label-sm uppercase tracking-[0.18em] text-primary-fixed">Khoa chuyên môn</p>
          <h3 className="font-headline-sm text-[25px] font-semibold uppercase leading-[1.06] tracking-normal text-inverse-on-surface">
            {cardLabel}
          </h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-md pb-md pt-lg">
        <p className="line-clamp-2 min-h-12 font-body-sm text-body-sm text-on-surface-variant">
          {cardDescription}
        </p>
        <div className="mt-lg flex min-h-16 items-center gap-md rounded-[1.35rem] bg-primary-fixed/42 p-sm pr-md shadow-inner">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface shadow-[0_12px_24px_rgba(15,23,42,0.10)] ${colorClassName}`}>
            <DepartmentIcon className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-label-sm text-label-sm uppercase text-on-surface-variant">{t('departmentsPage.viewDetails')}</span>
            <span className="mt-xs block truncate font-label-md text-label-md text-on-surface">{cardLabel}</span>
          </span>
          <Icon className="text-outline transition-transform group-hover:translate-x-1" name="chevron_right" />
        </div>
      </div>
      <span className="mb-md inline-flex justify-center gap-xs font-label-sm text-label-sm uppercase tracking-[0.18em] text-on-surface-variant transition-colors group-hover:text-primary">
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
