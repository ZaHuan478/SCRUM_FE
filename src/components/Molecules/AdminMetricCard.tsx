import Card from '../Atoms/Card'
import Icon from '../Atoms/Icon'
import type { AdminMetric } from '../../data/adminDashboard'

type AdminMetricCardProps = {
  metric: AdminMetric
}

const AdminMetricCard = ({ metric }: AdminMetricCardProps) => {
  return (
    <Card className="p-lg">
      <div className="mb-md flex items-start justify-between gap-md">
        <div className={`rounded-lg p-sm ${metric.iconClassName}`}>
          <Icon name={metric.icon} />
        </div>
        <span className={`rounded-full px-sm py-xs font-label-sm text-label-sm ${metric.trendClassName}`}>
          {metric.trend}
        </span>
      </div>
      <h3 className="mb-xs font-label-md text-label-md text-on-surface-variant">{metric.label}</h3>
      <p className="font-headline-md text-headline-md text-on-surface">{metric.value}</p>
    </Card>
  )
}

export default AdminMetricCard
