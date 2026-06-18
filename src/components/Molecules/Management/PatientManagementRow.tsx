import ActionMenu from '../Common/ActionMenu'

export type PatientManagementRowData = {
  id: number | string
  userId?: number | string
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
  onDelete: (patient: PatientManagementRowData) => void
  onEdit: (patient: PatientManagementRowData) => void
  onView: (patient: PatientManagementRowData) => void
}

const genderLabels: Record<NonNullable<PatientManagementRowData['gender']>, string> = {
  FEMALE: 'Nu',
  MALE: 'Nam',
  OTHER: 'Khac',
}

const PatientManagementRow = ({ patient, onDelete, onEdit, onView }: PatientManagementRowProps) => (
  <tr className="transition-colors hover:bg-surface-container-low">
    <td className="px-xl py-lg">
      <div className="min-w-56">
        <p className="font-label-md text-label-md text-on-surface">{patient.name}</p>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{patient.email || 'Chua co email'}</p>
      </div>
    </td>
    <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">{patient.phone || 'Chua cap nhat'}</td>
    <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">
      {patient.gender ? genderLabels[patient.gender] : 'Chua cap nhat'}
    </td>
    <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">{patient.insuranceNumber || 'Chua cap nhat'}</td>
    <td className="px-xl py-lg text-right">
      <ActionMenu
        ariaLabel={`Hanh dong cho ${patient.name}`}
        items={[
          {
            icon: 'visibility',
            label: 'Xem chi tiet',
            onClick: () => onView(patient),
          },
          {
            icon: 'edit',
            label: 'Sua',
            onClick: () => onEdit(patient),
          },
          {
            icon: 'delete',
            label: 'Xoa',
            tone: 'danger',
            onClick: () => onDelete(patient),
          },
        ]}
      />
    </td>
  </tr>
)

export default PatientManagementRow
