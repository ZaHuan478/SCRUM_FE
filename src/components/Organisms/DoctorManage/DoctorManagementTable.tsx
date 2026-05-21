import Input from '../../Atoms/Input'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import DoctorManagementRow from '../../Molecules/Management/DoctorManagementRow'
import type { DoctorManagementRowData } from '../../Molecules/Management/DoctorManagementRow'
import type { DashboardPagination } from '../../../utils/adminDashboard'

type DoctorManagementTableProps = {
  doctors: DoctorManagementRowData[]
  pagination: DashboardPagination
  searchQuery: string
  status: 'loading' | 'ready' | 'error'
  totalDoctors: number
  onCreateDoctor: () => void
  onViewDoctor: (doctor: DoctorManagementRowData) => void
  onEditDoctor: (doctor: DoctorManagementRowData) => void
  onPageChange: (page: number) => void
  onSearchQueryChange: (query: string) => void
}

const DoctorManagementTable = ({
  doctors,
  pagination,
  searchQuery,
  status,
  totalDoctors,
  onCreateDoctor,
  onViewDoctor,
  onEditDoctor,
  onPageChange,
  onSearchQueryChange,
}: DoctorManagementTableProps) => {
  const firstItem = totalDoctors === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const lastItem = Math.min(pagination.page * pagination.limit, totalDoctors)
  const hasPreviousPage = pagination.page > 1
  const hasNextPage = pagination.page < pagination.totalPages

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(15,23,42,0.05)]" id="doctor-management">
      <div className="flex flex-col items-start justify-between gap-lg border-b border-outline-variant/20 p-lg md:flex-row md:items-center md:p-xl">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Quản lý bác sĩ</h2>
        <div className="flex w-full flex-col gap-md sm:flex-row md:w-auto md:items-center">
          <Input
            aria-label="Tìm kiếm bác sĩ trong bảng"
            className="py-sm text-body-sm"
            icon="search"
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Tìm kiếm bác sĩ..."
            type="search"
            value={searchQuery}
            wrapperClassName="w-full sm:w-64"
          />
          <Button
            className="flex items-center gap-xs px-lg py-sm"
            fullWidth={false}
            onClick={onCreateDoctor}
            type="button"
          >
            <Icon name="person_add" />
            Thêm bác sĩ
          </Button>
          <button className="rounded-lg bg-surface-container-high p-sm text-on-surface-variant transition-colors hover:bg-surface-variant" type="button">
            <Icon name="filter_list" />
          </button>
        </div>
      </div>

      {status === 'loading' && <div className="p-xl font-body-sm text-body-sm text-on-surface-variant">Đang tải danh sách bác sĩ...</div>}
      {status === 'error' && (
        <div className="m-lg rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
          Chưa tải được danh sách bác sĩ từ backend.
        </div>
      )}
      {status === 'ready' && doctors.length === 0 && (
        <div className="p-xl text-center font-body-md text-body-md text-on-surface-variant">Chưa có bác sĩ phù hợp.</div>
      )}
      {doctors.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant/20 bg-surface-container-low">
              <tr>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Bác sĩ</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Chuyên khoa</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Trạng thái</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Lịch hẹn</th>
                <th className="px-xl py-md text-right font-label-md text-label-md text-on-surface-variant">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {doctors.map((doctor) => (
                <DoctorManagementRow doctor={doctor} key={doctor.id} onEdit={onEditDoctor} onView={onViewDoctor} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex flex-col justify-between gap-md border-t border-outline-variant/20 bg-surface-container-low p-lg sm:flex-row sm:items-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Đang hiển thị {firstItem}-{lastItem} trên {totalDoctors} bác sĩ
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

export default DoctorManagementTable
