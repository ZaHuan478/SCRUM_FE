import Icon from '../Atoms/Icon'
import type { AdminDoctorRow } from '../../data/adminDashboard'

type AdminDoctorTableRowProps = {
  doctor: AdminDoctorRow
}

const statusConfig: Record<AdminDoctorRow['status'], { label: string; className: string; dotClassName: string }> = {
  active: {
    label: 'Đang hoạt động',
    className: 'bg-emerald-100 text-emerald-700',
    dotClassName: 'bg-emerald-500',
  },
  offline: {
    label: 'Ngoại tuyến',
    className: 'bg-slate-100 text-slate-600',
    dotClassName: 'bg-slate-400',
  },
}

const AdminDoctorTableRow = ({ doctor }: AdminDoctorTableRowProps) => {
  const status = statusConfig[doctor.status]

  return (
    <tr className="transition-colors hover:bg-surface-container-low">
      <td className="px-xl py-lg">
        <div className="flex items-center gap-md">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-primary/10">
            <img alt={doctor.name} className="h-full w-full object-cover" src={doctor.avatar} />
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface">{doctor.name}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{doctor.email}</p>
          </div>
        </div>
      </td>
      <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">{doctor.specialty}</td>
      <td className="px-xl py-lg">
        <span className={`flex w-fit items-center gap-xs rounded-full px-sm py-xs font-label-sm text-label-sm ${status.className}`}>
          <span className={`h-2 w-2 rounded-full ${status.dotClassName}`} />
          {status.label}
        </span>
      </td>
      <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">{doctor.appointments}</td>
      <td className="px-xl py-lg text-right">
        <button
          aria-label={`Chỉnh sửa ${doctor.name}`}
          className="rounded-full p-sm text-primary transition-all hover:bg-primary/5 hover:text-primary-container"
          type="button"
        >
          <Icon name="edit" />
        </button>
      </td>
    </tr>
  )
}

export default AdminDoctorTableRow
