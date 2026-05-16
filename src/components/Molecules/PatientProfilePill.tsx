import type { PatientSummary } from '../../data/patientDashboard'

type PatientProfilePillProps = {
  patient: PatientSummary
}

const PatientProfilePill = ({ patient }: PatientProfilePillProps) => {
  return (
    <div className="flex items-center gap-md rounded-full bg-surface-container-lowest p-sm pr-lg shadow-sm">
      <img
        alt={patient.avatarAlt}
        className="h-12 w-12 rounded-full object-cover"
        src={patient.avatar}
      />
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-label-md text-label-md text-on-surface">{patient.fullName}</span>
        <span className="truncate font-label-sm text-label-sm text-on-surface-variant">
          Mã bệnh nhân: {patient.patientCode}
        </span>
      </div>
    </div>
  )
}

export default PatientProfilePill
