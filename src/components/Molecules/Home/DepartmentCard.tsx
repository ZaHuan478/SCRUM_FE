import Icon from '../../Atoms/Icon'

type DepartmentCardProps = {
  icon: string
  label: string
  tone: 'primary' | 'secondary' | 'tertiary' | 'neutral'
}

const toneClasses: Record<DepartmentCardProps['tone'], string> = {
  primary: 'bg-primary-fixed/30 text-primary',
  secondary: 'bg-secondary-fixed/30 text-secondary',
  tertiary: 'bg-tertiary-fixed/30 text-tertiary',
  neutral: 'bg-surface-variant text-outline',
}

const DepartmentCard = ({ icon, label, tone }: DepartmentCardProps) => {
  return (
    <article className="rounded-xl border border-outline-variant/20 bg-surface p-xl text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40">
      <div className={`mx-auto mb-md flex h-16 w-16 items-center justify-center rounded-full ${toneClasses[tone]}`}>
        <Icon name={icon} className="text-3xl" />
      </div>
      <p className="font-label-md text-label-md text-on-background">{label}</p>
    </article>
  )
}

export default DepartmentCard
