import ToastMessage from '../../Molecules/Common/ToastMessage'
import type { ToastItem } from '../../../contexts/ToastContext'

type ToastViewportProps = {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

const ToastViewport = ({ toasts, onDismiss }: ToastViewportProps) => {
  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-relevant="additions removals"
      className="pointer-events-none fixed right-md top-md z-[120] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-sm md:right-xl md:top-xl"
    >
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} onDismiss={onDismiss} toast={toast} />
      ))}
    </div>
  )
}

export default ToastViewport
