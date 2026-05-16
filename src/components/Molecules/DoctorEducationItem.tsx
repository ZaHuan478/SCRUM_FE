import Icon from '../Atoms/Icon'
import type { DoctorEducation } from '../../data/doctorDetail'

type DoctorEducationItemProps = {
  item: DoctorEducation
}

const DoctorEducationItem = ({ item }: DoctorEducationItemProps) => {
  return (
    <li className="flex gap-md">
      <Icon name={item.icon} className="text-primary" />
      <div>
        <p className="font-label-md text-label-md text-on-surface">{item.title}</p>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{item.description}</p>
      </div>
    </li>
  )
}

export default DoctorEducationItem
