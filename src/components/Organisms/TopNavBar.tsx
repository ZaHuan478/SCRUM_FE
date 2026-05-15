import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Atoms/Logo'
import { clearAuthSession, getStoredUser } from '../../services/auth.service'

const TopNavBar = () => {
  const [user, setUser] = useState(() => getStoredUser())

  const handleLogout = () => {
    clearAuthSession()
    setUser(null)
  }

  return (
    <header className="sticky top-0 z-50 bg-surface/90 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-md px-lg py-md md:px-xxl">
        <Link aria-label="MedPrecision" to="/">
          <Logo />
        </Link>
        <div className="hidden items-center gap-xl md:flex">
          <a className="border-b-2 border-primary pb-1 font-label-md text-label-md font-bold text-primary" href="#featured-doctors">Tìm bác sĩ</a>
          <a className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="#departments">Chuyên khoa</a>
          <a className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="#how-it-works">Quy trình</a>
        </div>
        <div className="flex items-center gap-md">
          {user ? (
            <>
              <span className="hidden max-w-40 truncate font-label-md text-label-md text-on-surface-variant sm:inline">
                {user.full_name || user.email}
              </span>
              <button className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" onClick={handleLogout} type="button">
                Đăng xuất
              </button>
            </>
          ) : (
            <Link className="hidden font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary md:block" to="/login">
              Đăng nhập
            </Link>
          )}
          <a className="rounded-lg bg-primary-container px-lg py-sm font-label-md text-label-md text-on-primary-container transition-all hover:shadow-lg active:scale-95" href="#featured-doctors">
            Đặt lịch ngay
          </a>
        </div>
      </nav>
    </header>
  )
}

export default TopNavBar
