import Icon from '../../Atoms/Icon'

export type DashboardStatTone = 'primary' | 'secondary' | 'tertiary' | 'success' | 'neutral'

export type DashboardStat = {
  icon: string
  label: string
  value: string
  helper?: string
  tone: DashboardStatTone
}

type DashboardStatCardProps = {
  stat: DashboardStat
}

const toneClasses: Record<DashboardStatTone, { icon: string; helper: string }> = {
  primary: {
    icon: 'bg-primary/10 text-primary',
    helper: 'bg-primary/10 text-primary',
  },
  secondary: {
    icon: 'bg-secondary/10 text-secondary',
    helper: 'bg-secondary/10 text-secondary',
  },
  tertiary: {
    icon: 'bg-tertiary/10 text-tertiary',
    helper: 'bg-tertiary/10 text-tertiary',
  },
  success: {
    icon: 'bg-emerald-50 text-emerald-700',
    helper: 'bg-emerald-50 text-emerald-700',
  },
  neutral: {
    icon: 'bg-surface-container-high text-on-surface-variant',
    helper: 'bg-surface-variant text-on-surface-variant',
  },
}

const DashboardStatCard = ({ stat }: DashboardStatCardProps) => {
  const tone = toneClasses[stat.tone]

  return (
    <article className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
      <div className="mb-md flex items-start justify-between gap-md">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${tone.icon}`}>
          <Icon name={stat.icon} />
        </div>
        {stat.helper && (
          <span className={`rounded-full px-sm py-xs font-label-sm text-label-sm ${tone.helper}`}>
            {stat.helper}
          </span>
        )}
      </div>
      <h3 className="mb-xs font-label-md text-label-md text-on-surface-variant">{stat.label}</h3>
      <p className="font-headline-md text-headline-md text-on-surface">{stat.value}</p>
    </article>
  )
}

export default DashboardStatCard
