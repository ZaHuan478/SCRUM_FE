import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'
import type { Department } from '../../../services/department.service'
import type { DashboardPagination } from '../../../utils/adminDashboard'

type LoadStatus = 'loading' | 'ready' | 'error'

type DepartmentManagementTableProps = {
  departments: Department[]
  pagination: DashboardPagination
  status: LoadStatus
  totalDepartments: number
  onCreateDepartment: () => void
  onEditDepartment: (department: Department) => void
  onPageChange: (page: number) => void
  onSearchQueryChange: (query: string) => void
  searchQuery: string
}

const statusConfig = {
  ACTIVE: {
    label: 'Đang hoạt động',
    className: 'bg-emerald-50 text-emerald-700',
    dotClassName: 'bg-emerald-500',
  },
  INACTIVE: {
    label: 'Tạm ngưng',
    className: 'bg-slate-100 text-slate-600',
    dotClassName: 'bg-slate-400',
  },
}

const DepartmentManagementTable = ({
  departments,
  pagination,
  status,
  totalDepartments,
  onCreateDepartment,
  onEditDepartment,
  onPageChange,
  onSearchQueryChange,
  searchQuery,
}: DepartmentManagementTableProps) => {
  const firstItem = totalDepartments === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const lastItem = Math.min(pagination.page * pagination.limit, totalDepartments)
  const hasPreviousPage = pagination.page > 1
  const hasNextPage = pagination.page < pagination.totalPages

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(15,23,42,0.05)]" id="department-management">
      <div className="flex flex-col items-start justify-between gap-lg border-b border-outline-variant/20 p-lg md:flex-row md:items-center md:p-xl">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Quản lý khoa</h2>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Thêm khoa mới và cập nhật trạng thái chuyên khoa.</p>
        </div>
        <div className="flex w-full flex-col gap-md sm:flex-row md:w-auto md:items-center">
          <Input
            aria-label="Tìm kiếm khoa"
            className="py-sm text-body-sm"
            icon="search"
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Tìm kiếm khoa..."
            type="search"
            value={searchQuery}
            wrapperClassName="w-full sm:w-64"
          />
          <Button
            className="flex items-center gap-xs px-lg py-sm"
            fullWidth={false}
            onClick={onCreateDepartment}
            type="button"
          >
            <Icon name="add" />
            Thêm khoa
          </Button>
        </div>
      </div>

      {status === 'loading' && <div className="p-xl font-body-sm text-body-sm text-on-surface-variant">Đang tải danh sách khoa...</div>}
      {status === 'error' && (
        <div className="m-lg rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
          Chưa tải được danh sách khoa từ backend.
        </div>
      )}
      {status === 'ready' && departments.length === 0 && (
        <div className="p-xl text-center font-body-md text-body-md text-on-surface-variant">Chưa có khoa nào.</div>
      )}
      {departments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant/20 bg-surface-container-low">
              <tr>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Khoa</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Mô tả</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Trạng thái</th>
                <th className="px-xl py-md text-right font-label-md text-label-md text-on-surface-variant">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {departments.map((department) => {
                const displayStatus = statusConfig[department.status]

                return (
                  <tr className="transition-colors hover:bg-surface-container-low" key={department.id}>
                    <td className="px-xl py-lg">
                      <p className="min-w-48 font-label-md text-label-md text-on-surface">{department.name}</p>
                    </td>
                    <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">
                      <p className="line-clamp-2 min-w-64">{department.description || 'Chưa cập nhật'}</p>
                    </td>
                    <td className="px-xl py-lg">
                      <span className={`inline-flex w-fit items-center gap-xs rounded-full px-sm py-xs font-label-sm text-label-sm ${displayStatus.className}`}>
                        <span className={`h-2 w-2 rounded-full ${displayStatus.dotClassName}`} />
                        {displayStatus.label}
                      </span>
                    </td>
                    <td className="px-xl py-lg text-right">
                      <Button
                        aria-label={`Sửa ${department.name}`}
                        className="rounded-full border-none p-sm text-primary shadow-none hover:bg-primary/5"
                        fullWidth={false}
                        onClick={() => onEditDepartment(department)}
                        type="button"
                        variant="ghost"
                      >
                        <Icon name="edit" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex flex-col justify-between gap-md border-t border-outline-variant/20 bg-surface-container-low p-lg sm:flex-row sm:items-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Đang hiển thị {firstItem}-{lastItem} trên {totalDepartments} khoa
        </p>
        <div className="flex items-center gap-sm">
          <Button
            className="px-md py-sm"
            disabled={!hasPreviousPage || status === 'loading'}
            fullWidth={false}
            onClick={() => onPageChange(pagination.page - 1)}
            type="button"
            variant="ghost"
          >
            Trước
          </Button>
          <span className="min-w-20 text-center font-label-md text-label-md text-on-surface-variant">
            Trang {pagination.page}/{Math.max(pagination.totalPages, 1)}
          </span>
          <Button
            className="px-md py-sm"
            disabled={!hasNextPage || status === 'loading'}
            fullWidth={false}
            onClick={() => onPageChange(pagination.page + 1)}
            type="button"
            variant="ghost"
          >
            Tiếp theo
          </Button>
        </div>
      </div>
    </section>
  )
}

export default DepartmentManagementTable
