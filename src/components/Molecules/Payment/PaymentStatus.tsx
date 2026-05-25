import type { PaymentStatus as PaymentStatusValue } from '../../../api/payment.api'
import Icon from '../../Atoms/Icon'

type PaymentStatusProps = {
  status: PaymentStatusValue
}

const statusConfig = {
  PENDING: {
    icon: 'hourglass_top',
    className: 'bg-tertiary-container text-on-tertiary-container',
    label: 'Đang chờ thanh toán',
  },
  PAID: {
    icon: 'check_circle',
    className: 'bg-secondary-fixed text-on-secondary-fixed',
    label: 'Đã thanh toán',
  },
  FAILED: {
    icon: 'error',
    className: 'bg-error-container text-on-error-container',
    label: 'Thanh toán thất bại',
  },
  CANCELLED: {
    icon: 'cancel',
    className: 'bg-surface-container text-on-surface-variant',
    label: 'Đã hủy',
  },
}

const PaymentStatus = ({ status }: PaymentStatusProps) => {
  const config = statusConfig[status]

  return (
    <div className={`inline-flex items-center gap-xs rounded-lg px-md py-sm font-label-md text-label-md ${config.className}`}>
      <Icon className="text-lg" name={config.icon} />
      {config.label}
    </div>
  )
}

export default PaymentStatus
