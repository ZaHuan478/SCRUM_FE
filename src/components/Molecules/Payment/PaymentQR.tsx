import type { Payment } from '../../../api/payment.api'
import { paymentRuleNote } from '../../../utils/paymentPolicy'
import Icon from '../../Atoms/Icon'

type PaymentQRProps = {
  payment: Payment
}

const moneyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})

const getTransferContent = (payment: Payment) => {
  if (!payment.qr_payload) return ''

  try {
    const parsedPayload = JSON.parse(payment.qr_payload)
    return parsedPayload.content || payment.qr_payload
  } catch {
    return payment.qr_payload
  }
}

const getCheckoutUrl = (payment: Payment) => {
  if (!payment.qr_payload) return ''

  try {
    const parsedPayload = JSON.parse(payment.qr_payload)
    return parsedPayload.checkoutUrl || ''
  } catch {
    return ''
  }
}

const PaymentQR = ({ payment }: PaymentQRProps) => {
  const transferContent = getTransferContent(payment)
  const checkoutUrl = getCheckoutUrl(payment)

  return (
    <section className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
      <div className="flex items-center gap-sm">
        <Icon className="text-primary" name="qr_code_2" />
        <h1 className="font-headline-md text-headline-md text-on-surface">Thanh toán lịch khám</h1>
      </div>

      <div className="mt-lg grid gap-lg md:grid-cols-[320px_1fr] md:items-center">
        <div className="flex aspect-square items-center justify-center rounded-lg border border-outline-variant bg-white p-md">
          {payment.qr_code_url ? (
            <img alt="Payment QR" className="h-full w-full object-contain" src={payment.qr_code_url} />
          ) : (
            <Icon className="text-6xl text-outline" name="qr_code" />
          )}
        </div>

        <div className="space-y-md">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">Số tiền</p>
            <p className="mt-xs font-headline-md text-headline-md text-primary">
              {moneyFormatter.format(Number(payment.amount || 0))}
            </p>
          </div>
          <div className="grid gap-sm sm:grid-cols-2">
            <div className="rounded-lg bg-surface-container p-md">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Mã payment</p>
              <p className="mt-xs font-label-lg text-label-lg text-on-surface">#{payment.id}</p>
            </div>
            <div className="rounded-lg bg-surface-container p-md">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Mã lịch hẹn</p>
              <p className="mt-xs font-label-lg text-label-lg text-on-surface">#{payment.appointment_id}</p>
            </div>
          </div>
          {transferContent && (
            <div className="rounded-lg bg-surface-container p-md">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Nội dung chuyển khoản</p>
              <p className="mt-xs break-words font-label-lg text-label-lg text-on-surface">{transferContent}</p>
            </div>
          )}
          {checkoutUrl && (
            <a
              className="inline-flex rounded-lg bg-primary px-md py-sm font-label-md text-label-md text-on-primary"
              href={checkoutUrl}
              rel="noreferrer"
              target="_blank"
            >
              Mo trang thanh toan PayOS
            </a>
          )}
        </div>
      </div>

      <div className="mt-lg rounded-lg border border-outline-variant/30 bg-surface-container px-md py-sm">
        <div className="flex items-start gap-sm">
          <Icon className="mt-0.5 text-lg text-primary" name="info" />
          <p className="font-body-sm text-body-sm text-on-surface-variant">{paymentRuleNote}</p>
        </div>
      </div>
    </section>
  )
}

export default PaymentQR
