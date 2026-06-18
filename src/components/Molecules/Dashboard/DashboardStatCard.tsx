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
    icon: 'bg-sky-50 text-primary ring-1 ring-sky-100',
    helper: 'bg-sky-50 text-primary ring-1 ring-sky-100',
  },
  secondary: {
    icon: 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100',
    helper: 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100',
  },
  tertiary: {
    icon: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
    helper: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
  },
  success: {
    icon: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
    helper: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  },
  neutral: {
    icon: 'bg-slate-50 text-slate-600 ring-1 ring-slate-100',
    helper: 'bg-slate-50 text-slate-600 ring-1 ring-slate-100',
  },
}

const DashboardStatCard = ({ stat }: DashboardStatCardProps) => {
  const tone = toneClasses[stat.tone]

  return (
    <article className="rounded-2xl border border-white/65 bg-white/78 p-lg shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.11)]">
      <div className="mb-md flex items-start justify-between gap-md">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone.icon}`}>
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
