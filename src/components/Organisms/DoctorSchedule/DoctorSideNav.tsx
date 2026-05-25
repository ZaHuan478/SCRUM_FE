import Logo from '../../Atoms/Logo'
import DashboardNavItem from '../../Molecules/Common/DashboardNavItem'

type DoctorSideNavProps = {
  onLogout: () => void
}

const doctorNavItems: Array<{ end?: boolean; icon: string; label: string; to: string }> = [
  { end: true, icon: 'event_available', label: 'Lịch khám', to: '/doctor/schedule' },
  { icon: 'account_circle', label: 'Hồ sơ', to: '/profile' },
  { end: true, icon: 'home', label: 'Trang chủ', to: '/' },
]

const DoctorSideNav = ({ onLogout }: DoctorSideNavProps) => (
  <aside className="sticky top-0 hidden h-screen w-64 flex-col gap-lg border-r border-outline-variant bg-surface px-md py-xl md:flex">
    <div className="px-md">
      <Logo compact />
    </div>
    <nav className="mt-xl flex flex-grow flex-col gap-sm">
      {doctorNavItems.map((item) => (
        <DashboardNavItem end={item.end} icon={item.icon} key={item.label} label={item.label} to={item.to} />
      ))}
    </nav>
    <div className="flex flex-col gap-xs border-t border-outline-variant px-md pt-md">
      <DashboardNavItem icon="logout" label="Đăng xuất" onClick={onLogout} />
    </div>
  </aside>
)

export default DoctorSideNav
