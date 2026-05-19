import DashboardStatCard from '../../Molecules/Dashboard/DashboardStatCard'
import type { DashboardStat } from '../../Molecules/Dashboard/DashboardStatCard'

type DashboardStatsGridProps = {
  stats: DashboardStat[]
  status: 'loading' | 'ready' | 'error'
}

const DashboardStatsGrid = ({ stats, status }: DashboardStatsGridProps) => {
  if (status === 'loading') {
    return (
      <section className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="h-36 animate-pulse rounded-xl bg-surface-container-lowest shadow-sm" key={index} />
        ))}
      </section>
    )
  }

  if (status === 'error' && stats.length === 0) {
    return (
      <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg text-center font-body-md text-body-md text-on-surface-variant">
        Chưa tải được số liệu tổng quan từ backend.
      </section>
    )
  }

  return (
    <section className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <DashboardStatCard key={stat.label} stat={stat} />
      ))}
    </section>
  )
}

export default DashboardStatsGrid
