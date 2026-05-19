import Card from '../Atoms/Card'
import MedicalRecordItem from '../Molecules/MedicalRecordItem'
import { patientDashboardCopy } from '../../data/patientDashboard'
import type { MedicalRecord } from '../../data/patientDashboard'

type MedicalRecordsPanelProps = {
  records: MedicalRecord[]
}

const MedicalRecordsPanel = ({ records }: MedicalRecordsPanelProps) => {
  return (
    <Card as="section" className="p-xl">
      <div className="mb-xl flex items-center justify-between gap-md">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          {patientDashboardCopy.recordsTitle}
        </h3>
        <button className="font-label-md text-label-md text-primary hover:underline" type="button">
          {patientDashboardCopy.viewAll}
        </button>
      </div>
      <div className="space-y-sm">
        {records.map((record) => (
          <MedicalRecordItem key={record.id} record={record} />
        ))}
      </div>
    </Card>
  )
}

export default MedicalRecordsPanel
