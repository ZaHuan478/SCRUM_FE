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
    icon: 'bg-primary-fixed text-primary',
    helper: 'bg-primary-fixed text-primary',
  },
  secondary: {
    icon: 'bg-surface-container-low text-on-surface',
    helper: 'bg-surface-container-low text-on-surface',
  },
  tertiary: {
    icon: 'bg-tertiary-fixed text-tertiary',
    helper: 'bg-tertiary-fixed text-tertiary',
  },
  success: {
    icon: 'bg-primary-fixed text-primary',
    helper: 'bg-primary-fixed text-primary',
  },
  neutral: {
    icon: 'bg-surface-variant text-on-surface-variant',
    helper: 'bg-surface-variant text-on-surface-variant',
  },
}

const DashboardStatCard = ({ stat }: DashboardStatCardProps) => {
  const tone = toneClasses[stat.tone]

  return (
    <article className="rounded-xl bg-surface p-lg shadow-[0_2px_8px_rgba(26,26,26,0.08)] ring-1 ring-outline-variant">
      <div className="mb-md flex items-start justify-between gap-md">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${tone.icon}`}>
          <Icon name={stat.icon} />
        </div>
        {stat.helper && (
          <span className={`rounded-lg px-sm py-xs font-label-sm text-label-sm ${tone.helper}`}>
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
