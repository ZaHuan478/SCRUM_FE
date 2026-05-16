import AdminAnalyticsChart from '../components/Organisms/AdminAnalyticsChart'
import AdminDoctorTable from '../components/Organisms/AdminDoctorTable'
import AdminFooter from '../components/Organisms/AdminFooter'
import AdminMetricsSection from '../components/Organisms/AdminMetricsSection'
import AdminSidebar from '../components/Organisms/AdminSidebar'
import AdminTopBar from '../components/Organisms/AdminTopBar'

const AdminDashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-background text-on-background">
      <AdminSidebar />
      <div className="flex min-w-0 flex-grow flex-col">
        <AdminTopBar />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-xxl p-lg md:p-xxl">
          <AdminMetricsSection />
          <AdminAnalyticsChart />
          <AdminDoctorTable />
        </main>
        <AdminFooter />
      </div>
    </div>
  )
}

export default AdminDashboardPage
