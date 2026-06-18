import { useTranslation } from '../../../contexts/LanguageContext'
import Icon from '../../Atoms/Icon'
import { getDepartmentIconMeta } from '../../../constants/departmentIcons'
import { translateDepartmentDescription, translateDepartmentName } from '../../../utils/contentTranslation'

export type SuggestedDepartment = {
  title: string
  description: string
  preVisitNote?: string | null
  preVisitNotes?: Array<{
    note: string
    symptomName?: string
  }>
}

type SuggestedDepartmentCardProps = {
  department: SuggestedDepartment
}

const SuggestedDepartmentCard = ({ department }: SuggestedDepartmentCardProps) => {
  const { language, t } = useTranslation()
  const notes = (department.preVisitNotes || []).filter((item) => item.note)
  const fallbackNote = department.preVisitNote?.trim()
  const hasPreVisitNote = notes.length > 0 || Boolean(fallbackNote)
  const { Icon: DepartmentIcon, backgroundClassName, colorClassName, hoverClassName } = getDepartmentIconMeta(department.title)

  return (
    <article className="group cursor-pointer rounded-[1.75rem] border border-white/70 bg-surface/78 p-lg shadow-[0_22px_58px_rgba(15,23,42,0.10)] backdrop-blur-2xl transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_30px_72px_rgba(15,23,42,0.14)]">
      <div className="flex items-start justify-between gap-md">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-colors ${backgroundClassName} ${colorClassName} ${hoverClassName}`}>
          <DepartmentIcon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1 space-y-xs">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">{translateDepartmentName(department.title, language)}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{translateDepartmentDescription(department.description, language)}</p>
        </div>
        <Icon name="arrow_forward" className="text-primary transition-transform group-hover:translate-x-1" />
      </div>
      {hasPreVisitNote && (
        <div className="mt-md rounded-2xl border border-outline-variant/35 bg-primary-fixed/30 p-md shadow-inner">
          <div className="flex items-center gap-xs">
            <Icon name="info" className="text-primary" />
            <p className="font-label-sm text-label-sm text-on-surface">{t('symptomChecker.preVisitNote')}</p>
          </div>
          {notes.length > 0 ? (
            <div className="mt-sm space-y-sm">
              {notes.map((item) => (
                <div className="font-body-sm text-body-sm text-on-surface-variant" key={`${item.symptomName || 'note'}-${item.note}`}>
                  {item.symptomName && <span className="font-label-sm text-label-sm text-primary">{item.symptomName}: </span>}
                  <span>{item.note}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-sm font-body-sm text-body-sm text-on-surface-variant">{fallbackNote}</p>
          )}
        </div>
      )}
    </article>
  )
}

export default SuggestedDepartmentCard
