import Icon from '../Atoms/Icon'
import type { DashboardNotification } from '../../data/patientDashboard'

type NotificationTimelineItemProps = {
  notification: DashboardNotification
}

const NotificationTimelineItem = ({ notification }: NotificationTimelineItemProps) => {
  return (
    <article className="relative flex gap-md">
      <div
        className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-surface-container-lowest ${notification.toneClassName}`}
      >
        <Icon name={notification.icon} className="text-[20px]" />
      </div>
      <div className="flex-1 pt-1">
        <h4 className="font-label-md text-label-md leading-tight text-on-surface">{notification.title}</h4>
        <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{notification.description}</p>
        <p className="mt-sm font-label-sm text-label-sm text-outline">{notification.timeAgo}</p>
      </div>
    </article>
  )
}

export default NotificationTimelineItem
