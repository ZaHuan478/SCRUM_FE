import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import ActionMenu from '../../Molecules/Common/ActionMenu'
import type { DepartmentSymptomRule } from '../../../services/departmentSymptomRule.service'
import type { DashboardPagination } from '../../../utils/adminDashboard'

type SymptomRuleManagementTableProps = {
  pagination: DashboardPagination
  rules: DepartmentSymptomRule[]
  status: 'loading' | 'ready' | 'error'
  totalRules: number
  onCreateRule: () => void
  onDeleteRule: (rule: DepartmentSymptomRule) => void
  onEditRule: (rule: DepartmentSymptomRule) => void
  onPageChange: (page: number) => void
}

const SymptomRuleManagementTable = ({
  pagination,
  rules,
  status,
  totalRules,
  onCreateRule,
  onDeleteRule,
  onEditRule,
  onPageChange,
}: SymptomRuleManagementTableProps) => {
  const firstItem = totalRules === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const lastItem = Math.min(pagination.page * pagination.limit, totalRules)
  const hasPreviousPage = pagination.page > 1
  const hasNextPage = pagination.page < pagination.totalPages

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(15,23,42,0.05)]" id="symptom-rule-management">
      <div className="flex flex-col items-start justify-between gap-lg border-b border-outline-variant/20 p-lg md:flex-row md:items-center md:p-xl">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Quản lý ghi chú triệu chứng</h2>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Cấu hình khoa gợi ý, điểm ưu tiên và lưu ý trước khi khám theo từng triệu chứng.</p>
        </div>
        <Button className="flex items-center gap-xs px-lg py-sm" fullWidth={false} onClick={onCreateRule} type="button">
          <Icon name="add" />
          Thêm ghi chú
        </Button>
      </div>

      {status === 'loading' && <div className="p-xl font-body-sm text-body-sm text-on-surface-variant">Đang tải danh sách ghi chú...</div>}
      {status === 'error' && (
        <div className="m-lg rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
          Chưa tải được danh sách ghi chú triệu chứng.
        </div>
      )}
      {status === 'ready' && rules.length === 0 && (
        <div className="p-xl text-center font-body-md text-body-md text-on-surface-variant">Chưa có ghi chú triệu chứng nào.</div>
      )}
      {rules.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant/20 bg-surface-container-low">
              <tr>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Triệu chứng</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Khoa</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Điểm</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Lưu ý trước khi khám</th>
                <th className="px-xl py-md text-right font-label-md text-label-md text-on-surface-variant">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {rules.map((rule) => (
                <tr className="transition-colors hover:bg-surface-container-low" key={rule.id}>
                  <td className="px-xl py-lg">
                    <p className="min-w-48 font-label-md text-label-md text-on-surface">{rule.symptom?.name || `Triệu chứng #${rule.symptom_id}`}</p>
                    {rule.symptom?.body_part && <p className="font-body-sm text-body-sm text-on-surface-variant">{rule.symptom.body_part}</p>}
                  </td>
                  <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">
                    <p className="min-w-48">{rule.department?.name || `Khoa #${rule.department_id}`}</p>
                  </td>
                  <td className="px-xl py-lg">
                    <span className="inline-flex rounded-full bg-primary-fixed px-sm py-xs font-label-sm text-label-sm text-on-primary-fixed">
                      {rule.score}/10
                    </span>
                  </td>
                  <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">
                    <p className="line-clamp-3 min-w-80">{rule.pre_visit_note || 'Chưa có lưu ý'}</p>
                  </td>
                  <td className="px-xl py-lg text-right">
                    <ActionMenu
                      ariaLabel={`Hành động cho ghi chú ${rule.id}`}
                      items={[
                        {
                          icon: 'edit',
                          label: 'Sửa',
                          onClick: () => onEditRule(rule),
                        },
                        {
                          icon: 'delete',
                          label: 'Xóa',
                          tone: 'danger',
                          onClick: () => onDeleteRule(rule),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex flex-col justify-between gap-md border-t border-outline-variant/20 bg-surface-container-low p-lg sm:flex-row sm:items-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Đang hiển thị {firstItem}-{lastItem} trên {totalRules} ghi chú
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

export default SymptomRuleManagementTable
