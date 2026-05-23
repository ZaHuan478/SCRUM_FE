import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'
import type { User } from '../../../services/auth.service'
import type { DashboardPagination } from '../../../utils/adminDashboard'

type UserManagementTableProps = {
  users: User[]
  pagination: DashboardPagination
  status: 'loading' | 'ready' | 'error'
  totalUsers: number
  onCreateUser: () => void
  onDeleteUser: (user: User) => void
  onEditUser: (user: User) => void
  onPageChange: (page: number) => void
  onSearchQueryChange: (query: string) => void
  onViewUser: (user: User) => void
  searchQuery: string
}

const roleLabels: Record<User['role'], string> = {
  ADMIN: 'Admin',
  DOCTOR: 'Bac si',
  PATIENT: 'Benh nhan',
}

const genderLabels: Record<NonNullable<User['gender']>, string> = {
  MALE: 'Nam',
  FEMALE: 'Nu',
  OTHER: 'Khac',
}

const statusConfig: Record<User['status'], { label: string; className: string; dotClassName: string }> = {
  ACTIVE: {
    label: 'Dang hoat dong',
    className: 'bg-emerald-50 text-emerald-700',
    dotClassName: 'bg-emerald-500',
  },
  INACTIVE: {
    label: 'Tam ngung',
    className: 'bg-slate-100 text-slate-600',
    dotClassName: 'bg-slate-400',
  },
}

const UserManagementTable = ({
  users,
  pagination,
  status,
  totalUsers,
  onCreateUser,
  onDeleteUser,
  onEditUser,
  onPageChange,
  onSearchQueryChange,
  onViewUser,
  searchQuery,
}: UserManagementTableProps) => {
  const firstItem = totalUsers === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const lastItem = Math.min(pagination.page * pagination.limit, totalUsers)
  const hasPreviousPage = pagination.page > 1
  const hasNextPage = pagination.page < pagination.totalPages

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(15,23,42,0.05)]" id="user-management">
      <div className="flex flex-col items-start justify-between gap-lg border-b border-outline-variant/20 p-lg md:flex-row md:items-center md:p-xl">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Quan ly user</h2>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Tao, cap nhat, khoa va xoa tai khoan trong he thong.</p>
        </div>
        <div className="flex w-full flex-col gap-md sm:flex-row md:w-auto md:items-center">
          <Input
            aria-label="Tim kiem user"
            className="py-sm text-body-sm"
            icon="search"
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Tim kiem user..."
            type="search"
            value={searchQuery}
            wrapperClassName="w-full sm:w-64"
          />
          <Button className="flex items-center gap-xs px-lg py-sm" fullWidth={false} onClick={onCreateUser} type="button">
            <Icon name="person_add" />
            Them user
          </Button>
        </div>
      </div>

      {status === 'loading' && <div className="p-xl font-body-sm text-body-sm text-on-surface-variant">Dang tai danh sach user...</div>}
      {status === 'error' && (
        <div className="m-lg rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
          Chua tai duoc danh sach user.
        </div>
      )}
      {status === 'ready' && users.length === 0 && (
        <div className="p-xl text-center font-body-md text-body-md text-on-surface-variant">Chua co user nao.</div>
      )}
      {users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant/20 bg-surface-container-low">
              <tr>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">User</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Vai tro</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Ngay sinh</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Gioi tinh</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">CCCD</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Trang thai</th>
                <th className="px-xl py-md text-right font-label-md text-label-md text-on-surface-variant">Hanh dong</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {users.map((user) => {
                const displayStatus = statusConfig[user.status]

                return (
                  <tr className="transition-colors hover:bg-surface-container-low" key={user.id}>
                    <td className="px-xl py-lg">
                      <div className="min-w-64">
                        <p className="font-label-md text-label-md text-on-surface">{user.full_name || 'Chua cap nhat ten'}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{user.email}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{user.phone || 'Chua co so dien thoai'}</p>
                      </div>
                    </td>
                    <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">{roleLabels[user.role]}</td>
                    <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">{user.date_of_birth || 'Chua cap nhat'}</td>
                    <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">{user.gender ? genderLabels[user.gender] : 'Chua cap nhat'}</td>
                    <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">{user.cccd_number || 'Chua cap nhat'}</td>
                    <td className="px-xl py-lg">
                      <span className={`inline-flex w-fit items-center gap-xs rounded-full px-sm py-xs font-label-sm text-label-sm ${displayStatus.className}`}>
                        <span className={`h-2 w-2 rounded-full ${displayStatus.dotClassName}`} />
                        {displayStatus.label}
                      </span>
                    </td>
                    <td className="px-xl py-lg text-right">
                      <Button
                        aria-label={`Xem ${user.email}`}
                        className="mr-xs rounded-full border-none p-sm text-primary shadow-none hover:bg-primary/5"
                        fullWidth={false}
                        onClick={() => onViewUser(user)}
                        type="button"
                        variant="ghost"
                      >
                        <Icon name="visibility" />
                      </Button>
                      <Button
                        aria-label={`Sua ${user.email}`}
                        className="mr-xs rounded-full border-none p-sm text-primary shadow-none hover:bg-primary/5"
                        fullWidth={false}
                        onClick={() => onEditUser(user)}
                        type="button"
                        variant="ghost"
                      >
                        <Icon name="edit" />
                      </Button>
                      <Button
                        aria-label={`Xoa ${user.email}`}
                        className="rounded-full border-none p-sm text-error shadow-none hover:bg-error-container"
                        fullWidth={false}
                        onClick={() => onDeleteUser(user)}
                        type="button"
                        variant="ghost"
                      >
                        <Icon name="delete" />
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
          Dang hien thi {firstItem}-{lastItem} tren {totalUsers} user
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
            Truoc
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
            Tiep theo
          </Button>
        </div>
      </div>
    </section>
  )
}

export default UserManagementTable
