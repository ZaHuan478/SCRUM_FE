import Badge from '../Atoms/Badge'
import Button from '../Atoms/Button'
import Card from '../Atoms/Card'
import Icon from '../Atoms/Icon'
import { patientDashboardCopy } from '../../data/patientDashboard'
import type { UpcomingAppointment } from '../../data/patientDashboard'

type UpcomingAppointmentCardProps = {
  appointment: UpcomingAppointment
}

const UpcomingAppointmentCard = ({ appointment }: UpcomingAppointmentCardProps) => {
  return (
    <Card as="section" className="relative overflow-hidden p-xl">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/5" />
      <div className="relative flex items-start justify-between gap-md">
        <div>
          <Badge className="mb-md bg-primary/10 text-primary">{appointment.status}</Badge>
          <h3 className="font-headline-md text-headline-md text-on-surface">{appointment.title}</h3>
        </div>
        <button
          aria-label="Tùy chọn lịch hẹn"
          className="rounded-full p-sm transition-colors hover:bg-surface-container-high"
          type="button"
        >
          <Icon name="more_vert" />
        </button>
      </div>
      <div className="relative mt-lg flex flex-col gap-lg md:flex-row md:items-center md:gap-xl">
        <div className="flex items-center gap-md">
          <div className="h-16 w-16 overflow-hidden rounded-xl shadow-sm">
            <img
              alt={appointment.doctorName}
              className="h-full w-full object-cover"
              src={appointment.doctorImage}
            />
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface">{appointment.doctorName}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {appointment.doctorSpecialty}
            </p>
          </div>
        </div>
        <div className="hidden h-12 w-px bg-outline-variant md:block" />
        <div>
          <div className="mb-xs flex items-center gap-sm text-primary">
            <Icon name="calendar_month" className="text-[18px]" />
            <span className="font-label-md text-label-md">{appointment.dateLabel}</span>
          </div>
          <div className="flex items-center gap-sm text-on-surface-variant">
            <Icon name="schedule" className="text-[18px]" />
            <span className="font-body-sm text-body-sm">{appointment.timeLabel}</span>
          </div>
        </div>
      </div>
      <div className="relative mt-xl flex flex-col gap-md sm:flex-row">
        <Button fullWidth={false}>{patientDashboardCopy.onlineCheckin}</Button>
        <Button fullWidth={false} variant="secondary">
          {patientDashboardCopy.viewDetail}
        </Button>
      </div>
    </Card>
  )
}

export default UpcomingAppointmentCard
