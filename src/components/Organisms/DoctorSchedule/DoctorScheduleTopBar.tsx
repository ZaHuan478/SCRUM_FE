import { Link } from 'react-router-dom'
import Logo from '../../Atoms/Logo'
import AccountMenu from '../../Molecules/Common/AccountMenu'
import type { User } from '../../../services/auth.service'
import type { Doctor } from '../../../services/doctor.service'

type DoctorScheduleTopBarProps = {
  doctor: Doctor | null
  user: User
  onLogout: () => void
}

const DoctorScheduleTopBar = ({ doctor, user, onLogout }: DoctorScheduleTopBarProps) => (
  <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface">
    <div className="mx-auto flex h-16 w-full max-w-[1366px] items-center justify-between gap-md px-lg md:px-xxl">
      <Link aria-label="MedPrecision" className="shrink-0 md:hidden" to="/">
        <Logo compact />
      </Link>
      <div className="min-w-0 flex-grow">
        <p className="truncate font-label-md text-label-md text-primary">
          {doctor?.user?.full_name || user.full_name || user.email}
        </p>
        <h1 className="truncate font-headline-sm text-headline-sm text-on-surface">Lịch khám của tôi</h1>
      </div>
      <AccountMenu onLogout={onLogout} user={user} />
    </div>
    <nav className="mx-auto flex max-w-[1366px] gap-sm overflow-x-auto border-t border-outline-variant px-lg py-sm md:hidden">
      <Link className="shrink-0 rounded bg-primary px-md py-sm font-label-sm text-label-sm text-on-primary" to="/doctor/schedule">
        Lịch khám
      </Link>
      <Link className="shrink-0 rounded border border-outline-variant bg-surface px-md py-sm font-label-sm text-label-sm text-on-surface-variant" to="/profile">
        Hồ sơ
      </Link>
      <Link className="shrink-0 rounded border border-outline-variant bg-surface px-md py-sm font-label-sm text-label-sm text-on-surface-variant" to="/">
        Trang chủ
      </Link>
    </nav>
  </header>
)

export default DoctorScheduleTopBar
