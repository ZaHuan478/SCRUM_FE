import { Link } from 'react-router-dom'
import Button from '../Atoms/Button'
import Icon from '../Atoms/Icon'
import Logo from '../Atoms/Logo'
import { adminDashboardCopy, adminProfile } from '../../data/adminDashboard'

const AdminTopBar = () => {
  return (
    <header className="sticky top-0 z-50 bg-surface/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-md px-lg py-md md:px-xxl">
        <div className="flex items-center gap-xl">
          <Link aria-label="MedPrecision" to="/">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-lg lg:flex">
            <a className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="#doctors">
              Tìm bác sĩ
            </a>
            <a className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="#analytics">
              Kiểm tra triệu chứng
            </a>
            <a className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="#about">
              Về chúng tôi
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-md">
          <div className="relative hidden sm:block">
            <input
              className="w-64 rounded-full border-none bg-surface-container py-xs pl-xl pr-md font-body-sm text-body-sm focus:ring-2 focus:ring-primary"
              placeholder={adminDashboardCopy.searchPlaceholder}
              type="text"
            />
            <Icon name="search" className="absolute left-md top-1/2 -translate-y-1/2 text-sm text-outline" />
          </div>
          <Link to="/appointments/new">
            <Button className="px-lg py-sm" fullWidth={false}>
              {adminDashboardCopy.primaryAction}
            </Button>
          </Link>
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary-container bg-secondary-container">
            <img alt={adminProfile.name} className="h-full w-full object-cover" src={adminProfile.avatar} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminTopBar
