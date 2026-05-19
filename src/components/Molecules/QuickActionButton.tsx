import Icon from '../Atoms/Icon'
import type { QuickAction } from '../../data/patientDashboard'

type QuickActionButtonProps = {
  action: QuickAction
}

const toneClasses: Record<QuickAction['tone'], string> = {
  primary:
    'bg-primary/5 hover:bg-primary [&_.quick-icon]:bg-primary [&_.quick-icon]:text-on-primary hover:[&_.quick-icon]:bg-on-primary hover:[&_.quick-icon]:text-primary hover:[&_.quick-title]:text-on-primary hover:[&_.quick-desc]:text-primary-fixed',
  secondary:
    'bg-secondary/5 hover:bg-secondary [&_.quick-icon]:bg-secondary [&_.quick-icon]:text-on-secondary hover:[&_.quick-icon]:bg-on-secondary hover:[&_.quick-icon]:text-secondary hover:[&_.quick-title]:text-on-secondary hover:[&_.quick-desc]:text-secondary-fixed',
  neutral:
    'bg-surface-container-high hover:bg-on-surface [&_.quick-icon]:bg-on-surface-variant [&_.quick-icon]:text-surface hover:[&_.quick-icon]:bg-surface hover:[&_.quick-icon]:text-on-background hover:[&_.quick-title]:text-surface hover:[&_.quick-desc]:text-surface-variant',
}

const QuickActionButton = ({ action }: QuickActionButtonProps) => {
  return (
    <button
      className={`group flex min-h-20 items-center gap-md rounded-xl p-md text-left transition-all ${toneClasses[action.tone]}`}
      type="button"
    >
      <span className="quick-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors">
        <Icon name={action.icon} />
      </span>
      <span className="min-w-0">
        <span className="quick-title block font-label-md text-label-md text-on-surface transition-colors">
          {action.title}
        </span>
        <span className="quick-desc block font-body-sm text-body-sm text-on-surface-variant transition-colors">
          {action.description}
        </span>
      </span>
    </button>
  )
}

export default QuickActionButton
