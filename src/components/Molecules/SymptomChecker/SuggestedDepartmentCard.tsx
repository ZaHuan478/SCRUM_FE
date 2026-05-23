import { ArrowRight, Info } from 'lucide-react'
import { getDepartmentIconMeta } from '../../../constants/departmentIcons'

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
  const notes = (department.preVisitNotes || []).filter((item) => item.note)
  const fallbackNote = department.preVisitNote?.trim()
  const hasPreVisitNote = notes.length > 0 || Boolean(fallbackNote)
  const { Icon, backgroundClassName, colorClassName, hoverClassName } = getDepartmentIconMeta(department.title)

  return (
    <article className="group cursor-pointer rounded-xl border border-outline-variant/40 bg-surface-container-lowest/95 p-lg shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg">
      <div className="flex items-start gap-md">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-white/70 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md ${backgroundClassName} ${colorClassName} ${hoverClassName}`}>
          <Icon aria-hidden="true" className="h-7 w-7 stroke-[2.2]" />
        </div>
        <div className="min-w-0 flex-1 space-y-xs">
          <div className="flex items-start justify-between gap-md">
            <h3 className="font-headline-sm text-headline-sm leading-snug text-on-surface">{department.title}</h3>
            <ArrowRight aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-secondary transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{department.description}</p>
        </div>
      </div>
      {hasPreVisitNote && (
        <div className="mt-md rounded-lg border border-secondary-fixed/40 bg-secondary-fixed/20 p-md">
          <div className="flex items-center gap-xs">
            <Info aria-hidden="true" className="h-4 w-4 text-secondary" />
            <p className="font-label-sm text-label-sm text-on-surface">Lưu ý trước khi khám</p>
          </div>
          {notes.length > 0 ? (
            <div className="mt-sm space-y-sm">
              {notes.map((item) => (
                <div className="font-body-sm text-body-sm text-on-surface-variant" key={`${item.symptomName || 'note'}-${item.note}`}>
                  {item.symptomName && <span className="font-label-sm text-label-sm text-secondary">{item.symptomName}: </span>}
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
