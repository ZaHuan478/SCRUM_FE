import type { DoctorStat } from '../../data/doctorDetail'

type DoctorStatItemProps = {
  stat: DoctorStat
}

const DoctorStatItem = ({ stat }: DoctorStatItemProps) => {
  return (
    <div>
      <p className="font-label-sm text-label-sm uppercase text-outline">{stat.label}</p>
      <p className="font-headline-sm text-headline-sm text-on-surface">{stat.value}</p>
    </div>
  )
}

export default DoctorStatItem
