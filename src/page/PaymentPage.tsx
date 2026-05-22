import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPaymentStatus, type Payment } from '../api/payment.api'
import { connectPaymentSocket, onPaymentSuccess } from '../api/payment.socket'
import PaymentQR from '../components/Molecules/Payment/PaymentQR'
import PaymentStatus from '../components/Molecules/Payment/PaymentStatus'
import TopNavBar from '../components/Organisms/TopNavBar'
import { useToast } from '../contexts/ToastContext'
import { useTranslation } from '../contexts/LanguageContext'

const PaymentPage = () => {
  const { paymentId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [error, setError] = useState('')
  const { success: toastSuccess, error: toastError } = useToast()
  const reportedErrorRef = useRef('')
  const reportedPaidRef = useRef(false)

  useEffect(() => {
    if (!paymentId) return undefined

    let active = true

    const reportSuccess = () => {
      if (reportedPaidRef.current) return

      reportedPaidRef.current = true
      toastSuccess(t('payment.successToast'))
    }

    const loadStatus = async () => {
      try {
        const nextPayment = await getPaymentStatus(paymentId)
        if (!active) return

        setPayment(nextPayment)
        if (nextPayment.status === 'PAID') {
          reportSuccess()
          navigate(`/payment-success/${nextPayment.appointment_id}`, { replace: true })
        }
      } catch (requestError) {
        if (!active) return
        const message = requestError instanceof Error ? requestError.message : t('payment.statusError')
        setError(message)
        if (reportedErrorRef.current !== message) {
          reportedErrorRef.current = message
          toastError(message)
        }
      }
    }

    void loadStatus()
    const intervalId = window.setInterval(loadStatus, 5000)
    const socket = connectPaymentSocket()
    const offPaymentSuccess = socket ? onPaymentSuccess(socket, (payload) => {
      if (String(payload.payment_id) === String(paymentId)) {
        reportSuccess()
        navigate(`/payment-success/${payload.appointment_id}`, { replace: true, state: payload })
      }
    }) : undefined

    return () => {
      active = false
      window.clearInterval(intervalId)
      offPaymentSuccess?.()
      socket?.disconnect()
    }
  }, [navigate, paymentId, t, toastError, toastSuccess])

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
            {t('payment.loadingQr')}
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
