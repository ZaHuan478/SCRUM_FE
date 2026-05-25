import Logo from '../../Atoms/Logo'
import DashboardNavItem from '../../Molecules/Common/DashboardNavItem'

const primaryNavItems = [
  { icon: 'dashboard', label: 'Tổng quan', to: '/admin', end: true },
  { icon: 'clinical_notes', label: 'Khoa', to: '/admin/departments' },
  { icon: 'medical_services', label: 'Bác sĩ', to: '/admin/doctors' },
  { icon: 'diagnosis', label: 'Ghi chú triệu chứng', to: '/admin/symptom-rules' },
  { icon: 'groups', label: 'Bệnh nhân', to: '/admin/patients' },
  { icon: 'description', label: 'Tài liệu AI', to: '/admin/hospital-documents' },
  { icon: 'manage_accounts', label: 'Người dùng', to: '/admin/users' },
]

type DashboardSideNavProps = {
  onLogout: () => void
}

const DashboardSideNav = ({ onLogout }: DashboardSideNavProps) => {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col gap-lg border-r border-outline-variant bg-surface px-md py-xl md:flex">
      <div className="px-md">
        <Logo compact />
      </div>
      <nav className="mt-xl flex flex-grow flex-col gap-sm">
        {primaryNavItems.map((item) => (
          <DashboardNavItem end={item.end} icon={item.icon} key={item.label} label={item.label} to={item.to} />
        ))}
      </nav>
      <div className="flex flex-col gap-md px-md">
        <div className="flex flex-col gap-xs border-t border-outline-variant pt-md">
          <DashboardNavItem icon="home" label="Trang chủ" to="/" />
          <DashboardNavItem icon="logout" label="Đăng xuất" onClick={onLogout} />
        </div>
      </div>
    </aside>
  )
}

export default DashboardSideNav
