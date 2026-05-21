import Icon from '../../Atoms/Icon'
import type { ToastItem, ToastVariant } from '../../../contexts/ToastContext'

type ToastMessageProps = {
  toast: ToastItem
  onDismiss: (id: string) => void
}

const variantConfig: Record<ToastVariant, { icon: string; className: string; iconClassName: string }> = {
  error: {
    icon: 'error',
    className: 'border-error bg-error-container text-on-error-container',
    iconClassName: 'text-error',
  },
  info: {
    icon: 'info',
    className: 'border-primary/20 bg-primary-fixed text-on-primary-fixed',
    iconClassName: 'text-primary',
  },
  success: {
    icon: 'check_circle',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    iconClassName: 'text-emerald-600',
  },
  warning: {
    icon: 'warning',
    className: 'border-amber-200 bg-amber-50 text-amber-950',
    iconClassName: 'text-amber-600',
  },
}

const ToastMessage = ({ toast, onDismiss }: ToastMessageProps) => {
  const config = variantConfig[toast.variant]

  return (
    <article
      className={`pointer-events-auto flex w-full items-start gap-sm rounded-lg border px-md py-sm shadow-[0_16px_40px_rgba(15,23,42,0.16)] ${config.className}`}
      role={toast.variant === 'error' ? 'alert' : 'status'}
    >
      <Icon className={`mt-0.5 shrink-0 text-xl ${config.iconClassName}`} name={config.icon} />
      <div className="min-w-0 flex-1">
        {toast.title && <p className="font-label-md text-label-md">{toast.title}</p>}
        <p className={`${toast.title ? 'mt-xs' : ''} break-words font-body-sm text-body-sm`}>{toast.message}</p>
      </div>
      <button
        aria-label="Đóng thông báo"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-surface-container-high/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
        onClick={() => onDismiss(toast.id)}
        type="button"
      >
        <Icon className="text-lg" name="close" />
      </button>
    </article>
  )
}

export default ToastMessage
