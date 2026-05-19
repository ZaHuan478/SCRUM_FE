import Card from '../Atoms/Card'
import Icon from '../Atoms/Icon'
import { doctorDetailCopy } from '../../data/doctorDetail'
import type { DoctorPractice } from '../../data/doctorDetail'

type DoctorPracticePanelProps = {
  practice: DoctorPractice
}

const DoctorPracticePanel = ({ practice }: DoctorPracticePanelProps) => {
  return (
    <Card as="section" className="p-lg">
      <h3 className="mb-md font-label-md text-label-md uppercase text-primary">
        {doctorDetailCopy.practiceTitle}
      </h3>
      <div className="flex flex-col gap-sm">
        <p className="font-label-md text-label-md text-on-surface">{practice.name}</p>
        <p className="flex items-center gap-xs font-body-sm text-body-sm text-on-surface-variant">
          <Icon name="location_on" className="text-xs" />
          {practice.address}
        </p>
        <div className="mt-sm h-24 w-full overflow-hidden rounded-lg bg-surface-container">
          <img alt={practice.mapAlt} className="h-full w-full object-cover" src={practice.mapImage} />
        </div>
      </div>
    </Card>
  )
}

export default DoctorPracticePanel
