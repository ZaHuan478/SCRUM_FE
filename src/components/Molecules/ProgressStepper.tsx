import Icon from '../Atoms/Icon'
import type { AppointmentStep } from '../../data/appointment'

type ProgressStepperProps = {
  steps: AppointmentStep[]
}

const stepStateClasses: Record<AppointmentStep['state'], string> = {
  complete: 'bg-primary-container text-on-primary-container shadow-sm',
  current: 'bg-primary-container text-on-primary-container shadow-sm ring-4 ring-primary-fixed',
  upcoming: 'bg-surface-container-highest text-on-surface-variant',
}

const labelStateClasses: Record<AppointmentStep['state'], string> = {
  complete: 'text-primary',
  current: 'text-primary',
  upcoming: 'text-on-surface-variant',
}

const ProgressStepper = ({ steps }: ProgressStepperProps) => {
  const completedSegments = steps.filter((step) => step.state === 'complete').length
  const progress = steps.length > 1 ? (completedSegments / (steps.length - 1)) * 100 : 0

  return (
    <div className="mx-auto mb-xxl max-w-2xl">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-5 -z-10 h-0.5 w-full bg-surface-container-highest" />
        <div className="absolute left-0 top-5 -z-10 h-0.5 bg-primary-container" style={{ width: `${progress}%` }} />
        {steps.map((step, index) => (
          <div className="flex max-w-32 flex-col items-center gap-sm text-center" key={step.id}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full font-label-md text-label-md ${stepStateClasses[step.state]}`}>
              {step.state === 'complete' ? <Icon name="check" className="text-[20px]" /> : index + 1}
            </div>
            <span className={`font-label-sm text-label-sm ${labelStateClasses[step.state]}`}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressStepper
