import type { Notification } from '../../types/notification'

type NotificationDropdownProps = {
  notifications: Notification[]
  loading: boolean
  unreadCount: number
  onMarkAsRead: (id: number | string) => void
  onMarkAllAsRead: () => void
}

const formatTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

const NotificationDropdown = ({
  notifications,
  loading,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDropdownProps) => (
  <div className="absolute right-0 top-[calc(100%+0.5rem)] z-[90] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-lowest shadow-[0px_16px_40px_rgba(15,23,42,0.16)]">
    <div className="flex items-center justify-between gap-md border-b border-outline-variant/30 px-lg py-md">
      <div>
        <p className="font-label-md text-label-md text-on-surface">Thông báo</p>
        <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{unreadCount} chưa đọc</p>
      </div>
      <button
        className="rounded-lg px-sm py-xs font-label-md text-label-md text-primary transition-colors hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-50"
        disabled={unreadCount === 0}
        onClick={onMarkAllAsRead}
        type="button"
      >
        Đánh dấu tất cả đã đọc
      </button>
    </div>

    <div className="max-h-[26rem] overflow-y-auto py-sm">
      {loading && <p className="px-lg py-md font-body-sm text-body-sm text-on-surface-variant">Đang tải...</p>}

      {!loading && notifications.length === 0 && (
        <p className="px-lg py-xl text-center font-body-sm text-body-sm text-on-surface-variant">Chưa có thông báo</p>
      )}

      {!loading &&
        notifications.map((notification) => (
          <button
            className={`flex w-full gap-sm px-lg py-md text-left transition-colors hover:bg-surface-container-high ${
              notification.is_read ? 'bg-surface-container-lowest' : 'bg-primary-fixed/70'
            }`}
            key={notification.id}
            onClick={() => onMarkAsRead(notification.id)}
            type="button"
          >
            <span
              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                notification.is_read ? 'bg-outline-variant' : 'bg-primary'
              }`}
            />
            <span className="min-w-0 flex-1">
              <span className="block font-label-md text-label-md text-on-surface">{notification.title}</span>
              <span className="mt-xs block font-body-sm text-body-sm text-on-surface-variant">{notification.message}</span>
              <span className="mt-sm block font-body-sm text-xs text-outline">{formatTime(notification.created_at)}</span>
            </span>
          </button>
        ))}
    </div>
  </div>
)

export default NotificationDropdown
