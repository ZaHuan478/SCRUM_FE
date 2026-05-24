import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../Atoms/Icon'
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
  variant?: 'default' | 'hp'
}

const navItems: Array<{ key: NavKey; labelKey: string; to: string }> = [
  { key: 'homepage', labelKey: 'nav.home', to: '/' },
  { key: 'doctors', labelKey: 'nav.doctors', to: '/doctors' },
  { key: 'departments', labelKey: 'nav.departments', to: '/departments' },
  { key: 'symptoms', labelKey: 'nav.symptoms', to: '/symptoms' },
]

const TopNavBar = ({ active = 'homepage', variant = 'default' }: TopNavBarProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [user, setUser] = useState(() => getStoredUser())
  const isHp = variant === 'hp'

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
    <header className={isHp ? 'sticky top-0 z-50 border-b border-[#e8e8e8] bg-white' : 'sticky top-0 z-50 bg-surface/90 shadow-sm backdrop-blur-md'}>
      <nav className={isHp ? 'mx-auto grid h-16 w-full max-w-[1366px] grid-cols-[auto_1fr_auto] items-center gap-lg px-lg md:px-xxl' : 'mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-lg px-lg py-md md:px-xxl'}>
        <Link aria-label="MedPrecision" className="justify-self-start" to="/">
          <Logo />
        </Link>
        <div className="hidden min-w-0 items-center justify-center gap-lg justify-self-center md:flex xl:gap-xl">
          {navItems.map((item) => (
            <Link
              className={
                isHp
                  ? item.key === active
                    ? 'whitespace-nowrap border-b-2 border-[#024ad8] pb-1 font-body-md text-body-md font-medium text-[#1a1a1a]'
                    : 'whitespace-nowrap font-body-md text-body-md text-[#3d3d3d] transition-colors hover:text-[#024ad8]'
                  : item.key === active
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
          {user?.role === 'ADMIN' && (
            <Link
              aria-label="Điều hành"
              className={isHp ? 'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-[#024ad8] text-white transition-all hover:bg-[#0e3191] active:scale-[0.98]' : 'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm transition-all hover:opacity-90 hover:shadow-md active:scale-95'}
              to="/admin"
            >
              <Icon name="admin_panel_settings" />
            </Link>
          )}
          {user?.role === 'PATIENT' && (
            <Link className={isHp ? 'whitespace-nowrap rounded-[4px] bg-[#024ad8] px-md py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-white transition-all hover:bg-[#0e3191] active:scale-[0.98] lg:px-lg' : 'whitespace-nowrap rounded-lg bg-primary-container px-md py-sm font-label-md text-label-md text-on-primary-container shadow-sm transition-all hover:opacity-90 active:scale-95 lg:px-lg'} to="/appointments">
              {t('common.appointments')}
            </Link>
          )}
          {user ? (
            <>
              <NotificationBell />
              <AccountMenu onLogout={handleLogout} user={user} />
            </>
          ) : (
            <Link className={isHp ? 'hidden font-body-md text-body-md font-medium text-[#024ad8] transition-colors hover:text-[#0e3191] lg:block' : 'hidden font-label-md text-label-md text-primary transition-colors hover:opacity-80 lg:block'} to="/login">
              {t('common.login')}
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

export default TopNavBar
