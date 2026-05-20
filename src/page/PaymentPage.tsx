import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPaymentStatus, type Payment } from '../api/payment.api'
import { connectPaymentSocket, onPaymentSuccess } from '../api/payment.socket'
import PaymentQR from '../components/Molecules/Payment/PaymentQR'
import PaymentStatus from '../components/Molecules/Payment/PaymentStatus'
import TopNavBar from '../components/Organisms/TopNavBar'

const PaymentPage = () => {
  const { paymentId } = useParams()
  const navigate = useNavigate()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!paymentId) return undefined

    let active = true

    const loadStatus = async () => {
      try {
        const nextPayment = await getPaymentStatus(paymentId)
        if (!active) return

        setPayment(nextPayment)
        if (nextPayment.status === 'PAID') {
          navigate(`/payment-success/${nextPayment.appointment_id}`, { replace: true })
        }
      } catch (requestError) {
        if (!active) return
        setError(requestError instanceof Error ? requestError.message : 'Không thể tải trạng thái thanh toán.')
      }
    }

    void loadStatus()
    const intervalId = window.setInterval(loadStatus, 5000)
    const socket = connectPaymentSocket()
    const offPaymentSuccess = socket ? onPaymentSuccess(socket, (payload) => {
      if (String(payload.payment_id) === String(paymentId)) {
        navigate(`/payment-success/${payload.appointment_id}`, { replace: true, state: payload })
      }
    }) : undefined

    return () => {
      active = false
      window.clearInterval(intervalId)
      offPaymentSuccess?.()
      socket?.disconnect()
    }
  }, [navigate, paymentId])

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNavBar active="doctors" />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-lg px-lg py-xl md:px-xxl">
        {error && (
          <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
            {error}
          </p>
        )}

        {!payment && !error && (
          <p className="rounded-lg bg-surface-container px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
            Đang tải mã QR thanh toán...
          </p>
        )}

        {payment && (
          <>
            <div className="flex justify-end">
              <PaymentStatus status={payment.status} />
            </div>
            <PaymentQR payment={payment} />
          </>
        )}
      </main>
    </div>
  )
}

export default PaymentPage
