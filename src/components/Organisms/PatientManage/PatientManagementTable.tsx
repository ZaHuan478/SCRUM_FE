import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'
import PatientManagementRow from '../../Molecules/Management/PatientManagementRow'
import type { PatientManagementRowData } from '../../Molecules/Management/PatientManagementRow'
import type { DashboardPagination } from '../../../utils/adminDashboard'

type PatientManagementTableProps = {
  patients: PatientManagementRowData[]
  pagination: DashboardPagination
  status: 'loading' | 'ready' | 'error'
  totalPatients: number
  onPageChange: (page: number) => void
  onSearchQueryChange: (query: string) => void
  onDeletePatient: (patient: PatientManagementRowData) => void
  onEditPatient: (patient: PatientManagementRowData) => void
  onViewPatient: (patient: PatientManagementRowData) => void
  searchQuery: string
}

const PatientManagementTable = ({
  patients,
  pagination,
  status,
  totalPatients,
  onPageChange,
  onSearchQueryChange,
  onDeletePatient,
  onEditPatient,
  onViewPatient,
  searchQuery,
}: PatientManagementTableProps) => {
  const firstItem = totalPatients === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const lastItem = Math.min(pagination.page * pagination.limit, totalPatients)
  const hasPreviousPage = pagination.page > 1
  const hasNextPage = pagination.page < pagination.totalPages

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(15,23,42,0.05)]" id="patient-management">
      <div className="flex flex-col items-start justify-between gap-lg border-b border-outline-variant/20 p-lg md:flex-row md:items-center md:p-xl">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Quản lý bệnh nhân</h2>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Danh sách hồ sơ bệnh nhân từ hệ thống.</p>
        </div>
        <div className="flex w-full items-center gap-md md:w-auto">
          <Input
            aria-label="Tìm kiếm bệnh nhân"
            className="py-sm text-body-sm"
            icon="search"
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Tìm kiếm bệnh nhân..."
            type="search"
            value={searchQuery}
            wrapperClassName="flex-grow md:w-64"
          />
          <Icon className="hidden text-primary sm:block" name="personal_injury" />
        </div>
      </div>

      {status === 'loading' && <div className="p-xl font-body-sm text-body-sm text-on-surface-variant">Đang tải danh sách bệnh nhân...</div>}
      {status === 'error' && (
        <div className="m-lg rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
          Chưa tải được danh sách bệnh nhân.
        </div>
      )}
      {status === 'ready' && patients.length === 0 && (
        <div className="p-xl text-center font-body-md text-body-md text-on-surface-variant">Chưa có hồ sơ bệnh nhân.</div>
      )}
      {patients.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant/20 bg-surface-container-low">
              <tr>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Bệnh nhân</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Số điện thoại</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Giới tính</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Bảo hiểm</th>
                <th className="px-xl py-md text-right font-label-md text-label-md text-on-surface-variant">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {patients.map((patient) => (
                <PatientManagementRow
                  key={patient.id}
                  onDelete={onDeletePatient}
                  onEdit={onEditPatient}
                  onView={onViewPatient}
                  patient={patient}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex flex-col justify-between gap-md border-t border-outline-variant/20 bg-surface-container-low p-lg sm:flex-row sm:items-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Đang hiển thị {firstItem}-{lastItem} trên {totalPatients} bệnh nhân
        </p>
        <div className="flex items-center gap-sm">
          <button
            className="rounded-lg border border-outline-variant px-md py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!hasPreviousPage || status === 'loading'}
            onClick={() => onPageChange(pagination.page - 1)}
            type="button"
          >
            Trước
          </button>
          <span className="min-w-20 text-center font-label-md text-label-md text-on-surface-variant">
            Trang {pagination.page}/{Math.max(pagination.totalPages, 1)}
          </span>
          <button
            className="rounded-lg border border-outline-variant px-md py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!hasNextPage || status === 'loading'}
            onClick={() => onPageChange(pagination.page + 1)}
            type="button"
          >
            Tiếp theo
          </button>
        </div>
      </div>
    </section>
  )
}

export default PatientManagementTable
