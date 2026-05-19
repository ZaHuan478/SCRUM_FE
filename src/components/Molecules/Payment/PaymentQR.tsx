import type { Payment } from '../../../api/payment.api'
import Icon from '../../Atoms/Icon'

type PaymentQRProps = {
  payment: Payment
}

const moneyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})

const PaymentQR = ({ payment }: PaymentQRProps) => (
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
      </div>
    </div>
  </section>
)

export default PaymentQR
