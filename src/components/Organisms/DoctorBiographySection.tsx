import Card from '../Atoms/Card'
import { doctorDetailCopy } from '../../data/doctorDetail'

type DoctorBiographySectionProps = {
  paragraphs: string[]
}

const DoctorBiographySection = ({ paragraphs }: DoctorBiographySectionProps) => {
  return (
    <Card as="section" className="p-lg md:col-span-2">
      <h2 className="mb-md font-headline-sm text-headline-sm text-on-surface">
        {doctorDetailCopy.biographyTitle}
      </h2>
      <div className="space-y-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </Card>
  )
}

export default DoctorBiographySection
