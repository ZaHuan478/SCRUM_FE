import DoctorScheduleStatCard from '../../Molecules/DoctorScheduleStatCard'
import type { DoctorScheduleStat } from '../../../utils/doctorSchedule'

type DoctorScheduleStatsGridProps = {
  stats: DoctorScheduleStat[]
}

const DoctorScheduleStatsGrid = ({ stats }: DoctorScheduleStatsGridProps) => (
  <section className="grid grid-cols-1 gap-md md:grid-cols-2 xl:grid-cols-4">
    {stats.map((stat) => (
      <DoctorScheduleStatCard key={stat.label} stat={stat} />
    ))}
  </section>
)

export default DoctorScheduleStatsGrid
