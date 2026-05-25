import type { Payment } from '../../../api/payment.api'
import { useTranslation } from '../../../contexts/LanguageContext'
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

const PaymentQR = ({ payment }: PaymentQRProps) => {
  const { t } = useTranslation()
  const transferContent = getTransferContent(payment)

  return (
    <section className="rounded-xl border border-outline-variant bg-surface p-lg shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
      <div className="flex items-center gap-sm">
        <Icon className="text-primary" name="qr_code_2" />
        <h1 className="font-headline-md text-headline-md text-on-surface">{t('payment.title')}</h1>
      </div>

      <div className="mt-lg grid gap-lg md:grid-cols-[320px_1fr] md:items-center">
        <div className="flex aspect-square items-center justify-center rounded-xl border border-outline-variant bg-surface p-md">
          {payment.qr_code_url ? (
            <img alt="Payment QR" className="h-full w-full object-contain" src={payment.qr_code_url} />
          ) : (
            <Icon className="text-6xl text-outline" name="qr_code" />
          )}
        </div>

        <div className="space-y-md">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">{t('payment.amount')}</p>
            <p className="mt-xs font-headline-md text-headline-md text-primary">
              {moneyFormatter.format(Number(payment.amount || 0))}
            </p>
          </div>
          <div className="grid gap-sm sm:grid-cols-2">
            <div className="rounded-lg border border-outline-variant bg-surface-container p-md">
              <p className="font-label-sm text-label-sm text-on-surface-variant">{t('payment.paymentCode')}</p>
              <p className="mt-xs font-label-lg text-label-lg text-on-surface">#{payment.id}</p>
            </div>
            <div className="rounded-lg border border-outline-variant bg-surface-container p-md">
              <p className="font-label-sm text-label-sm text-on-surface-variant">{t('payment.appointmentCode')}</p>
              <p className="mt-xs font-label-lg text-label-lg text-on-surface">#{payment.appointment_id}</p>
            </div>
          </div>
          {transferContent && (
            <div className="rounded-lg border border-outline-variant bg-surface-container p-md">
              <p className="font-label-sm text-label-sm text-on-surface-variant">{t('payment.transferContent')}</p>
              <p className="mt-xs break-words font-label-lg text-label-lg text-on-surface">{transferContent}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-lg rounded-lg border border-outline-variant bg-surface-container px-md py-sm">
        <div className="flex items-start gap-sm">
          <Icon className="mt-0.5 text-lg text-primary" name="info" />
          <p className="font-body-sm text-body-sm text-on-surface-variant">{paymentRuleNote}</p>
        </div>
      </div>
    </section>
  )
}

export default PaymentQR
