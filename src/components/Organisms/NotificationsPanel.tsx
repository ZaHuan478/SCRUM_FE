import Card from '../Atoms/Card'
import NotificationTimelineItem from '../Molecules/NotificationTimelineItem'
import { patientDashboardCopy } from '../../data/patientDashboard'
import type { DashboardNotification } from '../../data/patientDashboard'

type NotificationsPanelProps = {
  notifications: DashboardNotification[]
}

const NotificationsPanel = ({ notifications }: NotificationsPanelProps) => {
  return (
    <Card as="section" className="p-xl lg:flex-1">
      <div className="mb-xl flex items-center justify-between gap-md">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          {patientDashboardCopy.notificationsTitle}
        </h3>
        <div className="h-2 w-2 rounded-full bg-error" />
      </div>
      <div className="relative space-y-lg">
        <div className="absolute bottom-4 left-[19px] top-4 w-px bg-outline-variant" />
        {notifications.map((notification) => (
          <NotificationTimelineItem key={notification.id} notification={notification} />
        ))}
      </div>
    </Card>
  )
}

export default NotificationsPanel
