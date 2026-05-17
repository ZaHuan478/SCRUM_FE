import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../Atoms/Logo'
import AccountMenu from '../Molecules/AccountMenu'
import { AUTH_USER_CHANGED_EVENT, clearAuthSession, getStoredUser } from '../../services/auth.service'
import type { User } from '../../services/auth.service'

type NavKey = 'doctors' | 'departments' | 'symptoms' | 'about'

type TopNavBarProps = {
  active?: NavKey
}

const navItems: Array<{ key: NavKey; label: string; to: string }> = [
  { key: 'doctors', label: 'Tìm bác sĩ', to: '/#featured-doctors' },
  { key: 'departments', label: 'Khoa', to: '/#departments' },
  { key: 'symptoms', label: 'Kiểm tra triệu chứng', to: '/symptoms' },
]

const TopNavBar = ({ active = 'doctors' }: TopNavBarProps) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => getStoredUser())

  useEffect(() => {
    const handleUserChange = (event: Event) => {
      const nextUser = (event as CustomEvent<User | null>).detail
      setUser(nextUser ?? getStoredUser())
    }

    window.addEventListener(AUTH_USER_CHANGED_EVENT, handleUserChange)

    return () => {
      window.removeEventListener(AUTH_USER_CHANGED_EVENT, handleUserChange)
    }
  }, [])

  const handleLogout = () => {
    clearAuthSession()
    setUser(null)
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 bg-surface/90 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-md px-lg py-md md:px-xxl">
        <Link aria-label="MedPrecision" to="/">
          <Logo />
        </Link>
        <div className="hidden items-center gap-xl md:flex">
          {navItems.map((item) => (
            <Link
              className={
                item.key === active
                  ? 'border-b-2 border-primary pb-1 font-label-md text-label-md font-bold text-primary'
                  : 'font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary'
              }
              key={item.key}
              to={item.to}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-md">
          {user ? (
            <AccountMenu onLogout={handleLogout} user={user} />
          ) : (
            <Link className="hidden font-label-md text-label-md text-primary transition-colors hover:opacity-80 lg:block" to="/login">
              Đăng nhập
            </Link>
          )}
          <Link className="rounded-lg bg-primary-container px-lg py-sm font-label-md text-label-md text-on-primary-container shadow-sm transition-all hover:opacity-90 active:scale-95" to="/#featured-doctors">
            Đặt lịch hẹn
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default TopNavBar
