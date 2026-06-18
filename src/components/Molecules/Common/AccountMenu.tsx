import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../Atoms/Icon'
import { useTranslation } from '../../../contexts/LanguageContext'
import type { User } from '../../../services/auth.service'

type AccountMenuProps = {
  user: User
  onLogout: () => void
}

const getInitials = (user: User) => {
  const source = user.full_name || user.email || 'U'
  const parts = source.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

const AccountMenu = ({ user, onLogout }: AccountMenuProps) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const displayName = user.full_name || user.email
  const { t } = useTranslation()
  const canAccessAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleLogoutClick = () => {
    setOpen(false)
    onLogout()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t('account.menu')}
        className="flex max-w-[11rem] items-center gap-sm rounded-xl border border-outline-variant/60 bg-white/70 py-xs pl-xs pr-sm text-left shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 sm:max-w-[13rem]"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {user.avatar_url ? (
          <img alt="" className="h-9 w-9 shrink-0 rounded-xl border border-outline-variant/60 object-cover" src={user.avatar_url} />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-label-md font-label-md text-on-primary shadow-[0_10px_20px_rgba(2,132,199,0.22)]">
            {getInitials(user)}
          </span>
        )}
        <span className="hidden min-w-0 flex-col sm:flex">
          <span className="truncate font-label-md text-label-md text-on-surface">{displayName}</span>
          <span className="truncate font-body-sm text-body-sm text-on-surface-variant">{user.role}</span>
        </span>
        <Icon className={`text-lg text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`} name="expand_more" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[80] w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/60 bg-white/88 shadow-[0_22px_55px_rgba(15,23,42,0.16)] backdrop-blur-2xl"
          role="menu"
        >
          <div className="border-b border-outline-variant/35 px-lg py-md">
            <p className="truncate font-label-md text-label-md text-on-surface">{displayName}</p>
            <p className="truncate font-body-sm text-body-sm text-on-surface-variant">{user.email}</p>
          </div>
          <div className="p-sm">
            {user.role === 'DOCTOR' && (
              <Link
                className="flex w-full items-center gap-sm rounded-xl px-md py-sm font-label-md text-label-md text-on-surface transition-colors hover:bg-primary-fixed/35"
                onClick={() => setOpen(false)}
                role="menuitem"
                to="/doctor/schedule"
              >
                <Icon className="text-xl text-primary" name="event_available" />
                {t('account.doctorSchedule')}
              </Link>
            )}
            {user.role === 'PATIENT' && (
              <Link
                className="flex w-full items-center gap-sm rounded-xl px-md py-sm font-label-md text-label-md text-on-surface transition-colors hover:bg-primary-fixed/35"
                onClick={() => setOpen(false)}
                role="menuitem"
                to="/appointments"
              >
                <Icon className="text-xl text-primary" name="event_note" />
                {t('account.patientAppointments')}
              </Link>
            )}
            {canAccessAdmin && (
              <Link
                className="flex w-full items-center gap-sm rounded-xl px-md py-sm font-label-md text-label-md text-on-surface transition-colors hover:bg-primary-fixed/35"
                onClick={() => setOpen(false)}
                role="menuitem"
                to="/admin"
              >
                <Icon className="text-xl text-primary" name="dashboard" />
                Quản trị hệ thống
              </Link>
            )}
            <Link
              className="flex w-full items-center gap-sm rounded-xl px-md py-sm font-label-md text-label-md text-on-surface transition-colors hover:bg-primary-fixed/35"
              onClick={() => setOpen(false)}
              role="menuitem"
              to="/profile"
            >
              <Icon className="text-xl text-primary" name="account_circle" />
              {t('account.profile')}
            </Link>
            <button
              className="mt-xs flex w-full items-center gap-sm rounded-xl px-md py-sm text-left font-label-md text-label-md text-error transition-colors hover:bg-error-container"
              onClick={handleLogoutClick}
              role="menuitem"
              type="button"
            >
              <Icon className="text-xl" name="logout" />
              {t('account.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountMenu
