import Card from '../Atoms/Card'
import DoctorEducationItem from '../Molecules/DoctorEducationItem'
import { doctorDetailCopy } from '../../data/doctorDetail'
import type { DoctorEducation } from '../../data/doctorDetail'

type DoctorEducationPanelProps = {
  education: DoctorEducation[]
}

const DoctorEducationPanel = ({ education }: DoctorEducationPanelProps) => {
  return (
    <Card as="section" className="p-lg">
      <h3 className="mb-md font-label-md text-label-md uppercase text-primary">
        {doctorDetailCopy.educationTitle}
      </h3>
      <ul className="flex flex-col gap-md">
        {education.map((item) => (
          <DoctorEducationItem item={item} key={item.id} />
        ))}
      </ul>
    </Card>
  )
}

export default DoctorEducationPanel
