import PatientAppointmentStatCard from '../../Molecules/PatientAppointmentStatCard'
import type { PatientAppointmentStat } from '../../../utils/patientAppointments'

type PatientAppointmentStatsGridProps = {
  stats: PatientAppointmentStat[]
}

const PatientAppointmentStatsGrid = ({ stats }: PatientAppointmentStatsGridProps) => (
  <section className="grid grid-cols-1 gap-md md:grid-cols-3">
    {stats.map((stat) => (
      <PatientAppointmentStatCard key={stat.label} stat={stat} />
    ))}
  </section>
)

export default PatientAppointmentStatsGrid
