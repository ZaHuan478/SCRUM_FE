import Logo from '../../Atoms/Logo'
import DashboardNavItem from '../../Molecules/Common/DashboardNavItem'

type NavItem = {
  end?: boolean
  icon: string
  label: string
  to: string
}

const adminNavItems: NavItem[] = [
  { icon: 'dashboard', label: 'Dashboard', to: '/admin', end: true },
  { icon: 'clinical_notes', label: 'Departments', to: '/admin/departments' },
  { icon: 'medical_services', label: 'Doctors', to: '/admin/doctors' },
  { icon: 'event_note', label: 'Appointments', to: '/admin/appointments' },
  { icon: 'diagnosis', label: 'Schedules', to: '/admin/symptom-rules' },
  { icon: 'groups', label: 'Patients', to: '/admin/patients' },
  { icon: 'description', label: 'AI Knowledge', to: '/admin/hospital-documents' },
]

const superAdminNavItems: NavItem[] = [
  { icon: 'manage_accounts', label: 'User Management', to: '/admin/users' },
  { icon: 'admin_panel_settings', label: 'Admin Management', to: '/admin/admins' },
  { icon: 'receipt_long', label: 'System Logs', to: '/admin/system-logs' },
  { icon: 'settings', label: 'System Settings', to: '/admin/system-settings' },
]

type DashboardSideNavProps = {
  currentUserRole: 'ADMIN' | 'SUPER_ADMIN'
  onLogout: () => void
}

const DashboardSideNav = ({ currentUserRole, onLogout }: DashboardSideNavProps) => {
  const visibleNavItems = currentUserRole === 'SUPER_ADMIN'
    ? [...adminNavItems, ...superAdminNavItems]
    : adminNavItems

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col gap-lg border-r border-white/60 bg-white/60 px-md py-xl shadow-[12px_0_40px_rgba(15,23,42,0.06)] backdrop-blur-2xl md:flex">
      <div className="px-md">
        <Logo compact />
      </div>
      <nav className="mt-xl flex flex-grow flex-col gap-sm">
        {visibleNavItems.map((item) => (
          <DashboardNavItem end={item.end} icon={item.icon} key={item.label} label={item.label} to={item.to} />
        ))}
      </nav>
      <div className="flex flex-col gap-md px-md">
        <div className="flex flex-col gap-xs border-t border-outline-variant/40 pt-md">
          <DashboardNavItem icon="home" label="Home" to="/" />
          <DashboardNavItem icon="logout" label="Logout" onClick={onLogout} />
        </div>
      </div>
    </aside>
  )
}

export default DashboardSideNav
