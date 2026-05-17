import Button from '../Atoms/Button'
import Icon from '../Atoms/Icon'
import Image from '../Atoms/Image'

export type DoctorManagementRowData = {
  id: number | string
  userId?: number | string
  name: string
  email?: string | null
  phone?: string | null
  licenseNumber?: string | null
  cccd?: string | null
  activeAssignmentId?: number | string | null
  departmentId?: number | string | null
  specialty?: string | null
  status: 'ACTIVE' | 'INACTIVE'
  experienceYears?: number | null
  consultationFee?: string | null
  description?: string | null
  appointmentsThisWeek: number
  image?: string | null
}

type DoctorManagementRowProps = {
  doctor: DoctorManagementRowData
  onView: (doctor: DoctorManagementRowData) => void
  onEdit: (doctor: DoctorManagementRowData) => void
}

const statusConfig: Record<DoctorManagementRowData['status'], { label: string; className: string; dotClassName: string }> = {
  ACTIVE: {
    label: 'Đang hoạt động',
    className: 'bg-emerald-50 text-emerald-700',
    dotClassName: 'bg-emerald-500',
  },
  INACTIVE: {
    label: 'Ngoại tuyến',
    className: 'bg-slate-100 text-slate-600',
    dotClassName: 'bg-slate-400',
  },
}

const DoctorManagementRow = ({ doctor, onView, onEdit }: DoctorManagementRowProps) => {
  const status = statusConfig[doctor.status]

  return (
    <tr className="transition-colors hover:bg-surface-container-low">
      <td className="px-xl py-lg">
        <div className="flex min-w-64 items-center gap-md">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-primary/10">
            <Image alt={doctor.name} className="h-full w-full object-cover" fallbackClassName="h-full w-full" src={doctor.image || undefined} />
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface">{doctor.name}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{doctor.email || 'Chưa có email'}</p>
          </div>
        </div>
      </td>
      <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">{doctor.specialty || 'Chưa cập nhật'}</td>
      <td className="px-xl py-lg">
        <span className={`inline-flex w-fit items-center gap-xs rounded-full px-sm py-xs font-label-sm text-label-sm ${status.className}`}>
          <span className={`h-2 w-2 rounded-full ${status.dotClassName}`} />
          {status.label}
        </span>
      </td>
      <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">{doctor.appointmentsThisWeek} tuần này</td>
      <td className="px-xl py-lg text-right">
        <Button
          aria-label={`Sửa ${doctor.name}`}
          className="mr-xs rounded-full border-none p-sm text-primary shadow-none hover:bg-primary/5"
          fullWidth={false}
          onClick={() => onEdit(doctor)}
          type="button"
          variant="ghost"
        >
          <Icon name="edit" />
        </Button>
        <Button
          aria-label={`Xem chi tiết ${doctor.name}`}
          className="rounded-full border-none p-sm text-primary shadow-none hover:bg-primary/5"
          fullWidth={false}
          onClick={() => onView(doctor)}
          type="button"
          variant="ghost"
        >
          <Icon name="visibility" />
        </Button>
      </td>
    </tr>
  )
}

export default DoctorManagementRow
