import PatientProfilePill from '../Molecules/PatientProfilePill'
import { patientDashboardCopy } from '../../data/patientDashboard'
import type { PatientSummary } from '../../data/patientDashboard'

type PatientDashboardHeaderProps = {
  patient: PatientSummary
}

const PatientDashboardHeader = ({ patient }: PatientDashboardHeaderProps) => {
  return (
    <header className="mb-xxl flex flex-col gap-lg lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h2 className="mb-xs font-headline-lg text-headline-lg text-on-background">
          {patientDashboardCopy.greetingPrefix}, {patient.displayName}
        </h2>
        <p className="max-w-3xl font-body-lg text-body-lg text-on-surface-variant">
          {patientDashboardCopy.summary}
        </p>
      </div>
      <PatientProfilePill patient={patient} />
    </header>
  )
}

export default PatientDashboardHeader
