import { useTranslation } from '../../../contexts/LanguageContext'
import Icon from '../../Atoms/Icon'
import SuggestedDepartmentCard from '../../Molecules/SymptomChecker/SuggestedDepartmentCard'
import type { SuggestedDepartment } from '../../Molecules/SymptomChecker/SuggestedDepartmentCard'

type SuggestedDepartmentsPanelProps = {
  departments: SuggestedDepartment[]
}

const SuggestedDepartmentsPanel = ({ departments }: SuggestedDepartmentsPanelProps) => {
  const { t } = useTranslation()

  return (
    <aside className="space-y-xl lg:col-span-4">
      <div className="flex items-center gap-md">
        <Icon name="clinical_notes" className="text-primary" />
        <h2 className="font-headline-sm text-headline-sm text-on-background">{t('symptomChecker.suggestedDepartments')}</h2>
      </div>
      <div className="space-y-md">
        {departments.length > 0 ? (
          departments.map((department) => (
            <SuggestedDepartmentCard department={department} key={department.title} />
          ))
        ) : (
          <p className="rounded-lg border border-outline-variant bg-surface p-lg font-body-md text-body-md text-on-surface-variant">
            {t('symptomChecker.noDepartmentData')}
          </p>
        )}
      </div>
    </aside>
  )
}

export default SuggestedDepartmentsPanel
