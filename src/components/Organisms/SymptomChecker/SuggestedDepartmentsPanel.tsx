import Icon from '../../Atoms/Icon'
import SuggestedDepartmentCard from '../../Molecules/SuggestedDepartmentCard'
import type { SuggestedDepartment } from '../../Molecules/SuggestedDepartmentCard'

type SuggestedDepartmentsPanelProps = {
  departments: SuggestedDepartment[]
}

const SuggestedDepartmentsPanel = ({ departments }: SuggestedDepartmentsPanelProps) => {
  return (
    <aside className="space-y-xl lg:col-span-4">
      <div className="flex items-center gap-md">
        <Icon name="clinical_notes" className="text-primary" />
        <h2 className="font-headline-sm text-headline-sm text-on-background">Các khoa gợi ý</h2>
      </div>
      <div className="space-y-md">
        {departments.length > 0 ? (
          departments.map((department) => (
            <SuggestedDepartmentCard department={department} key={department.title} />
          ))
        ) : (
          <p className="rounded-lg border border-outline-variant/30 bg-surface p-lg font-body-md text-body-md text-on-surface-variant">
            Chưa có dữ liệu khoa gợi ý.
          </p>
        )}
      </div>
    </aside>
  )
}

export default SuggestedDepartmentsPanel
