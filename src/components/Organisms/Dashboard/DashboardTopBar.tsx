import { Link } from 'react-router-dom'
import AccountMenu from '../../Molecules/Common/AccountMenu'
import Button from '../../Atoms/Button'
import Logo from '../../Atoms/Logo'
import { getStoredUser } from '../../../services/auth.service'

type DashboardTopBarProps = {
  onLogout: () => void
}

const adminMobileLinks = [
  { label: 'Tổng quan', to: '/admin' },
  { label: 'Khoa', to: '/admin/departments' },
  { label: 'Bác sĩ', to: '/admin/doctors' },
  { label: 'Lịch hẹn', to: '/admin/appointments' },
  { label: 'Triệu chứng', to: '/admin/symptom-rules' },
  { label: 'Bệnh nhân', to: '/admin/patients' },
  { label: 'Tài liệu AI', to: '/admin/hospital-documents' },
  { label: 'Người dùng', to: '/admin/users' },
]

const DashboardTopBar = ({ onLogout }: DashboardTopBarProps) => {
  const user = getStoredUser()

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-[1366px] items-center justify-between gap-md px-lg md:px-xxl">
        <div className="flex min-w-0 items-center gap-xl">
          <Link aria-label="MedPrecision" className="shrink-0" to="/">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-lg lg:flex">
            <Link className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" to="/admin/doctors">
              Tìm bác sĩ
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" to="/symptoms">
              Kiểm tra triệu chứng
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-md">
          {user?.role === 'PATIENT' && (
            <Link className="hidden rounded bg-primary px-lg py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-primary transition-colors hover:bg-primary-container sm:inline-flex" to="/appointments">
              Đặt lịch hẹn
            </Link>
          )}
          {user ? (
            <AccountMenu onLogout={onLogout} user={user} />
          ) : (
            <Button className="hidden border-none p-0 text-primary shadow-none hover:bg-transparent lg:inline-flex" fullWidth={false} type="button" variant="ghost">
              <Link to="/login">Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
      <nav className="mx-auto flex max-w-[1366px] gap-sm overflow-x-auto border-t border-outline-variant px-lg py-sm md:hidden">
        {adminMobileLinks.map((item) => (
          <Link className="shrink-0 rounded border border-outline-variant bg-surface px-md py-sm font-label-sm text-label-sm text-on-surface-variant" key={item.to} to={item.to}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

export default DashboardTopBar
