import AdminMetricCard from '../Molecules/AdminMetricCard'
import { adminMetrics } from '../../data/adminDashboard'

const AdminMetricsSection = () => {
  return (
    <section className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4" id="overview">
      {adminMetrics.map((metric) => (
        <AdminMetricCard key={metric.id} metric={metric} />
      ))}
    </section>
  )
}

export default AdminMetricsSection
