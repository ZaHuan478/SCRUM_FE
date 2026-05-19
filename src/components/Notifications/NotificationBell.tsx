import { useEffect, useRef, useState } from 'react'
import Icon from '../Atoms/Icon'
import NotificationDropdown from './NotificationDropdown'
import { useNotifications } from '../../contexts/NotificationContext'

const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications()

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
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

  const handleMarkAsRead = async (id: number | string) => {
    await markAsRead(id)
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        aria-expanded={open}
        aria-label="Thông báo"
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container-lowest text-on-surface shadow-sm transition-colors hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/40"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <Icon className="text-xl" name="notifications" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-error px-1 font-label-sm text-[11px] leading-none text-on-error">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          loading={loading}
          notifications={notifications}
          onMarkAllAsRead={markAllAsRead}
          onMarkAsRead={handleMarkAsRead}
          unreadCount={unreadCount}
        />
      )}
    </div>
  )
}

export default NotificationBell
