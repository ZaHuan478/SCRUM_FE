import Icon from '../../Atoms/Icon'

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

  return (
    <article className="group cursor-pointer rounded-xl border border-outline-variant bg-surface-container-lowest p-lg transition-all hover:border-primary hover:shadow-lg">
      <div className="flex items-start justify-between gap-md">
        <div className="min-w-0 flex-1 space-y-xs">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">{department.title}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{department.description}</p>
        </div>
        <Icon name="arrow_forward" className="text-secondary transition-transform group-hover:translate-x-1" />
      </div>
      {hasPreVisitNote && (
        <div className="mt-md rounded-lg border border-secondary-fixed/40 bg-secondary-fixed/20 p-md">
          <div className="flex items-center gap-xs">
            <Icon name="info" className="text-secondary" />
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
