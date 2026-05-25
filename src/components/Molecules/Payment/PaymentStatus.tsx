import type { PaymentStatus as PaymentStatusValue } from '../../../api/payment.api'
import { useTranslation } from '../../../contexts/LanguageContext'
import Icon from '../../Atoms/Icon'

type PaymentStatusProps = {
  status: PaymentStatusValue
}

const statusConfig = {
  PENDING: {
    icon: 'hourglass_top',
    className: 'bg-tertiary-container text-on-tertiary-container',
    labelKey: 'payment.pending',
  },
  PAID: {
    icon: 'check_circle',
    className: 'bg-secondary-fixed text-on-secondary-fixed',
    labelKey: 'payment.paid',
  },
  FAILED: {
    icon: 'error',
    className: 'bg-error-container text-on-error-container',
    labelKey: 'payment.failed',
  },
  CANCELLED: {
    icon: 'cancel',
    className: 'bg-surface-container text-on-surface-variant',
    labelKey: 'payment.cancelled',
  },
}

const PaymentStatus = ({ status }: PaymentStatusProps) => {
  const { t } = useTranslation()
  const config = statusConfig[status]

  return (
    <div className={`inline-flex items-center gap-xs rounded-lg px-md py-sm font-label-md text-label-md ${config.className}`}>
      <Icon className="text-lg" name={config.icon} />
      {t(config.labelKey)}
    </div>
  )
}

export default PaymentStatus
