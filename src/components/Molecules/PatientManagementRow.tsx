import Button from '../Atoms/Button'
import Icon from '../Atoms/Icon'

export type PatientManagementRowData = {
  id: number | string
  name: string
  email?: string | null
  phone?: string | null
  dateOfBirth?: string | null
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null
  address?: string | null
  insuranceNumber?: string | null
}

type PatientManagementRowProps = {
  patient: PatientManagementRowData
  onView: (patient: PatientManagementRowData) => void
}

const genderLabels: Record<NonNullable<PatientManagementRowData['gender']>, string> = {
  FEMALE: 'Nữ',
  MALE: 'Nam',
  OTHER: 'Khác',
}

const PatientManagementRow = ({ patient, onView }: PatientManagementRowProps) => {
  return (
    <tr className="transition-colors hover:bg-surface-container-low">
      <td className="px-xl py-lg">
        <div className="min-w-56">
          <p className="font-label-md text-label-md text-on-surface">{patient.name}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{patient.email || 'Chưa có email'}</p>
        </div>
      </td>
      <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">{patient.phone || 'Chưa cập nhật'}</td>
      <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">
        {patient.gender ? genderLabels[patient.gender] : 'Chưa cập nhật'}
      </td>
      <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">{patient.insuranceNumber || 'Chưa cập nhật'}</td>
      <td className="px-xl py-lg text-right">
        <Button
          aria-label={`Xem chi tiết ${patient.name}`}
          className="rounded-full border-none p-sm text-primary shadow-none hover:bg-primary/5"
          fullWidth={false}
          onClick={() => onView(patient)}
          type="button"
          variant="ghost"
        >
          <Icon name="visibility" />
        </Button>
      </td>
    </tr>
  )
}

export default PatientManagementRow
