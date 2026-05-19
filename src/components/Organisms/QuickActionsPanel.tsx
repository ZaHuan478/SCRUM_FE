import Card from '../Atoms/Card'
import QuickActionButton from '../Molecules/QuickActionButton'
import { patientDashboardCopy } from '../../data/patientDashboard'
import type { QuickAction } from '../../data/patientDashboard'

type QuickActionsPanelProps = {
  actions: QuickAction[]
}

const QuickActionsPanel = ({ actions }: QuickActionsPanelProps) => {
  return (
    <Card as="section" className="p-xl">
      <h3 className="mb-xl font-headline-sm text-headline-sm text-on-surface">
        {patientDashboardCopy.quickActionsTitle}
      </h3>
      <div className="grid grid-cols-1 gap-md">
        {actions.map((action) => (
          <QuickActionButton action={action} key={action.id} />
        ))}
      </div>
    </Card>
  )
}

export default QuickActionsPanel
