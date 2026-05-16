import AdminChartBar from '../Molecules/AdminChartBar'
import Card from '../Atoms/Card'
import { adminDashboardCopy, appointmentChartBars } from '../../data/adminDashboard'

const AdminAnalyticsChart = () => {
  return (
    <Card as="section" className="p-lg md:p-xl" id="analytics">
      <div className="mb-xl flex flex-col items-start justify-between gap-md md:flex-row md:items-center">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            {adminDashboardCopy.analyticsTitle}
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {adminDashboardCopy.analyticsDescription}
          </p>
        </div>
        <div className="flex gap-sm">
          <button
            className="rounded-lg bg-surface-container px-md py-xs font-label-md text-label-md text-on-surface-variant"
            type="button"
          >
            {adminDashboardCopy.weekly}
          </button>
          <button className="rounded-lg bg-primary px-md py-xs font-label-md text-label-md text-on-primary" type="button">
            {adminDashboardCopy.monthly}
          </button>
        </div>
      </div>
      <div className="group relative h-[320px] w-full overflow-hidden rounded-lg bg-surface-container-low">
        <div className="absolute inset-0 flex items-end justify-between gap-md p-lg">
          {appointmentChartBars.map((bar) => (
            <AdminChartBar bar={bar} key={bar.id} />
          ))}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(115,118,134,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(115,118,134,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
    </Card>
  )
}

export default AdminAnalyticsChart
