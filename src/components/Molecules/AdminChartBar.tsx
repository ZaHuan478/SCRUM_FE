import type { ChartBar } from '../../data/adminDashboard'

type AdminChartBarProps = {
  bar: ChartBar
}

const AdminChartBar = ({ bar }: AdminChartBarProps) => {
  return (
    <div className={`relative w-full rounded-t-lg ${bar.heightClassName} ${bar.toneClassName}`}>
      <span className="absolute bottom-full left-1/2 mb-xs -translate-x-1/2 font-label-sm text-label-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
        {bar.label}
      </span>
    </div>
  )
}

export default AdminChartBar
