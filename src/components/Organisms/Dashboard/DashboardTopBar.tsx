import { Link } from 'react-router-dom'
import AccountMenu from '../../Molecules/Common/AccountMenu'
import Button from '../../Atoms/Button'
import Logo from '../../Atoms/Logo'
import { getStoredUser } from '../../../services/auth.service'

type DashboardTopBarProps = {
  currentUserRole: 'ADMIN' | 'SUPER_ADMIN'
  onLogout: () => void
}

const adminMobileLinks = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Khoa', to: '/admin/departments' },
  { label: 'Bác sĩ', to: '/admin/doctors' },
  { label: 'Lịch hẹn', to: '/admin/appointments' },
  { label: 'Schedules', to: '/admin/symptom-rules' },
  { label: 'Bệnh nhân', to: '/admin/patients' },
  { label: 'Tài liệu AI', to: '/admin/hospital-documents' },
]

const superAdminMobileLinks = [
  { label: 'Users', to: '/admin/users' },
  { label: 'Admins', to: '/admin/admins' },
  { label: 'Logs', to: '/admin/system-logs' },
  { label: 'Settings', to: '/admin/system-settings' },
]

const DashboardTopBar = ({ currentUserRole, onLogout }: DashboardTopBarProps) => {
  const user = getStoredUser()
  const mobileLinks = currentUserRole === 'SUPER_ADMIN'
    ? [...adminMobileLinks, ...superAdminMobileLinks]
    : adminMobileLinks

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/65 shadow-[0_12px_32px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
      <div className="mx-auto flex h-16 w-full max-w-[1366px] items-center justify-between gap-md px-lg md:px-xxl">
        <div className="flex min-w-0 items-center gap-xl">
          <Link aria-label="MedPrecision" className="shrink-0" to="/">
            <Logo />
          </Link>
        </div>
        <div className="flex items-center gap-md">
          {user?.role === 'PATIENT' && (
            <Link className="hidden rounded-lg bg-primary px-lg py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-primary shadow-[0_12px_24px_rgba(2,132,199,0.20)] transition-all hover:-translate-y-0.5 hover:bg-primary-container sm:inline-flex" to="/appointments">
              Book appointment
            </Link>
          )}
          {user ? (
            <AccountMenu onLogout={onLogout} user={user} />
          ) : (
            <Button className="hidden border-none p-0 text-primary shadow-none hover:bg-transparent lg:inline-flex" fullWidth={false} type="button" variant="ghost">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
      <nav className="mx-auto flex max-w-[1366px] gap-sm overflow-x-auto border-t border-white/55 px-lg py-sm md:hidden">
        {mobileLinks.map((item) => (
          <Link className="shrink-0 rounded-full border border-outline-variant/50 bg-white/70 px-md py-sm font-label-sm text-label-sm text-on-surface-variant shadow-sm backdrop-blur transition-colors hover:border-primary/40 hover:text-primary" key={item.to} to={item.to}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

export default DashboardTopBar
