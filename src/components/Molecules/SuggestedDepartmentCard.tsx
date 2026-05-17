import Icon from '../Atoms/Icon'

export type SuggestedDepartment = {
  title: string
  description: string
}

type SuggestedDepartmentCardProps = {
  department: SuggestedDepartment
}

const SuggestedDepartmentCard = ({ department }: SuggestedDepartmentCardProps) => {
  return (
    <article className="group cursor-pointer rounded-xl border border-outline-variant bg-surface-container-lowest p-lg transition-all hover:border-primary hover:shadow-lg">
      <div className="flex items-start justify-between gap-md">
        <div className="space-y-xs">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">{department.title}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{department.description}</p>
        </div>
        <Icon name="arrow_forward" className="text-secondary transition-transform group-hover:translate-x-1" />
      </div>
    </article>
  )
}

export default SuggestedDepartmentCard
