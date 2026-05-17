import Icon from '../Atoms/Icon'
import type { PatientAppointmentStat } from '../../utils/patientAppointments'

type PatientAppointmentStatCardProps = {
  stat: PatientAppointmentStat
}

const PatientAppointmentStatCard = ({ stat }: PatientAppointmentStatCardProps) => (
  <article className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
    <div className="mb-md flex items-center justify-between gap-md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
        <Icon name={stat.icon} />
      </div>
      <span className="truncate font-body-sm text-body-sm text-on-surface-variant">{stat.helper}</span>
    </div>
    <p className="font-body-sm text-body-sm text-on-surface-variant">{stat.label}</p>
    <p className="mt-xs truncate font-headline-md text-headline-md text-on-surface">{stat.value}</p>
  </article>
)

export default PatientAppointmentStatCard
