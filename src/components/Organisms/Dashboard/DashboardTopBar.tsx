import { Link } from 'react-router-dom'
import AccountMenu from '../../Molecules/Common/AccountMenu'
import Button from '../../Atoms/Button'
import Logo from '../../Atoms/Logo'
import { getStoredUser } from '../../../services/auth.service'

type DashboardTopBarProps = {
  onLogout: () => void
}

const DashboardTopBar = ({ onLogout }: DashboardTopBarProps) => {
  const user = getStoredUser()

  return (
    <header className="sticky top-0 z-50 bg-surface/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-md px-lg py-md md:px-xxl">
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
            <Link className="hidden rounded-lg bg-primary px-lg py-sm font-label-md text-label-md text-on-primary shadow-sm transition-all hover:bg-primary-container sm:inline-flex" to="/appointments">
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
    </header>
  )
}

export default DashboardTopBar
