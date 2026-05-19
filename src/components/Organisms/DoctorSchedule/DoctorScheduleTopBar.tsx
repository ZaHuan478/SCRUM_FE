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
  <header className="sticky top-0 z-50 bg-surface/90 shadow-sm backdrop-blur-md">
    <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-md px-lg py-md md:px-xxl">
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
  </header>
)

export default DoctorScheduleTopBar
