import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../Atoms/Logo'
import AccountMenu from '../Molecules/Common/AccountMenu'
import AppPreferences from '../Molecules/Common/AppPreferences'
import NotificationBell from '../Notifications/NotificationBell'
import { AUTH_USER_CHANGED_EVENT, clearAuthSession, getStoredUser } from '../../services/auth.service'
import { useTranslation } from '../../contexts/LanguageContext'
import type { User } from '../../services/auth.service'

type NavKey = 'homepage' | 'doctors' | 'departments' | 'symptoms'

type TopNavBarProps = {
  active?: NavKey
}

const navItems: Array<{ key: NavKey; labelKey: string; to: string }> = [
  { key: 'homepage', labelKey: 'nav.home', to: '/' },
  { key: 'doctors', labelKey: 'nav.doctors', to: '/doctors' },
  { key: 'departments', labelKey: 'nav.departments', to: '/departments' },
  { key: 'symptoms', labelKey: 'nav.symptoms', to: '/symptoms' },
]

const TopNavBar = ({ active = 'homepage' }: TopNavBarProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
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
      <nav className="mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-lg px-lg py-md md:px-xxl">
        <Link aria-label="MedPrecision" className="justify-self-start" to="/">
          <Logo />
        </Link>
        <div className="hidden min-w-0 items-center justify-center gap-lg justify-self-center md:flex xl:gap-xl">
          {navItems.map((item) => (
            <Link
              className={
                item.key === active
                  ? 'whitespace-nowrap border-b-2 border-primary pb-1 font-label-md text-label-md font-bold text-primary'
                  : 'whitespace-nowrap font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary'
              }
              key={item.key}
              to={item.to}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-end gap-sm justify-self-end lg:gap-md">
          <AppPreferences />
          {user?.role === 'PATIENT' && (
            <Link className="whitespace-nowrap rounded-lg bg-primary-container px-md py-sm font-label-md text-label-md text-on-primary-container shadow-sm transition-all hover:opacity-90 active:scale-95 lg:px-lg" to="/appointments">
              {t('common.appointments')}
            </Link>
          )}
          {user ? (
            <>
              <NotificationBell />
              <AccountMenu onLogout={handleLogout} user={user} />
            </>
          ) : (
            <Link className="hidden font-label-md text-label-md text-primary transition-colors hover:opacity-80 lg:block" to="/login">
              {t('common.login')}
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

export default TopNavBar
