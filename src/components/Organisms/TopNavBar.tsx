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

const TopNavBar = ({ active = 'homepage', variant = 'hp' }: TopNavBarProps) => {
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
    <header className={isHp ? 'sticky top-0 z-50 border-b border-outline-variant bg-surface' : 'sticky top-0 z-50 bg-surface/90 shadow-sm backdrop-blur-md'}>
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
                    ? 'whitespace-nowrap border-b-2 border-primary pb-1 font-body-md text-body-md font-medium text-on-surface'
                    : 'whitespace-nowrap font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary'
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
              className={isHp ? 'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary text-on-primary transition-all hover:bg-primary-container active:scale-[0.98]' : 'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm transition-all hover:opacity-90 hover:shadow-md active:scale-95'}
              to="/admin"
            >
              <Icon name="admin_panel_settings" />
            </Link>
          )}
          {user?.role === 'PATIENT' && (
            <Link className={isHp ? 'hidden whitespace-nowrap rounded bg-primary px-md py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-primary transition-all hover:bg-primary-container active:scale-[0.98] sm:inline-flex lg:px-lg' : 'hidden whitespace-nowrap rounded-lg bg-primary-container px-md py-sm font-label-md text-label-md text-on-primary-container shadow-sm transition-all hover:opacity-90 active:scale-95 sm:inline-flex lg:px-lg'} to="/appointments">
              {t('common.appointments')}
            </Link>
          )}
          {user ? (
            <>
              <NotificationBell />
              <AccountMenu onLogout={handleLogout} user={user} />
            </>
          ) : (
            <Link className={isHp ? 'hidden font-body-md text-body-md font-medium text-primary transition-colors hover:text-primary-container lg:block' : 'hidden font-label-md text-label-md text-primary transition-colors hover:opacity-80 lg:block'} to="/login">
              {t('common.login')}
            </Link>
          )}
        </div>
      </nav>
      <div className="border-t border-outline-variant bg-surface md:hidden">
        <nav className="mx-auto flex max-w-[1366px] gap-sm overflow-x-auto px-lg py-sm">
          {user?.role === 'ADMIN' && (
            <Link className="shrink-0 rounded border border-outline-variant bg-surface px-md py-sm font-label-sm text-label-sm text-on-surface-variant" to="/admin">
              Admin
            </Link>
          )}
          {user?.role === 'PATIENT' && (
            <Link className="shrink-0 rounded border border-outline-variant bg-surface px-md py-sm font-label-sm text-label-sm text-on-surface-variant" to="/appointments">
              {t('common.appointments')}
            </Link>
          )}
          {navItems.map((item) => (
            <Link
              className={
                item.key === active
                  ? 'shrink-0 rounded bg-primary px-md py-sm font-label-sm text-label-sm text-on-primary'
                  : 'shrink-0 rounded border border-outline-variant bg-surface px-md py-sm font-label-sm text-label-sm text-on-surface-variant'
              }
              key={`mobile-${item.key}`}
              to={item.to}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default TopNavBar
