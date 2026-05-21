import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPaymentStatus, type Payment } from '../../../api/payment.api'
import { connectPaymentSocket, onPaymentSuccess } from '../../../api/payment.socket'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import PaymentQR from '../../Molecules/Payment/PaymentQR'
import PaymentStatus from '../../Molecules/Payment/PaymentStatus'
import { useToast } from '../../../contexts/ToastContext'

type PaymentModalProps = {
  initialPayment: Payment
  onClose: () => void
}

const PaymentModal = ({ initialPayment, onClose }: PaymentModalProps) => {
  const navigate = useNavigate()
  const [payment, setPayment] = useState(initialPayment)
  const [error, setError] = useState('')
  const { success: toastSuccess, error: toastError } = useToast()
  const reportedErrorRef = useRef('')
  const reportedPaidRef = useRef(false)

  useEffect(() => {
    let active = true

    const loadStatus = async () => {
      try {
        const nextPayment = await getPaymentStatus(initialPayment.id)
        if (!active) return

        setPayment(nextPayment)
        setError('')
        if (nextPayment.status === 'PAID') {
          if (!reportedPaidRef.current) {
            reportedPaidRef.current = true
            toastSuccess('Thanh toán thành công. Lịch khám đã được xác nhận.')
          }
          navigate(`/payment-success/${nextPayment.appointment_id}`, { replace: true })
        }
      } catch (requestError) {
        if (!active) return
        const message = requestError instanceof Error ? requestError.message : 'Không thể tải trạng thái thanh toán.'
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
      if (String(payload.payment_id) === String(initialPayment.id)) {
        if (!reportedPaidRef.current) {
          reportedPaidRef.current = true
          toastSuccess('Thanh toán thành công. Lịch khám đã được xác nhận.')
        }
        navigate(`/payment-success/${payload.appointment_id}`, { replace: true, state: payload })
      }
    }) : undefined

    return () => {
      active = false
      window.clearInterval(intervalId)
      offPaymentSuccess?.()
      socket?.disconnect()
    }
  }, [initialPayment.id, navigate, toastError, toastSuccess])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/50 px-md py-lg backdrop-blur-sm" role="presentation">
      <div
        aria-labelledby="payment-modal-title"
        aria-modal="true"
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-background p-md shadow-xl"
        role="dialog"
      >
        <div className="mb-md flex items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            <Icon className="text-primary" name="payments" />
            <h2 className="font-headline-sm text-headline-sm text-on-background" id="payment-modal-title">
              Thanh toán lịch khám
            </h2>
          </div>
          <div className="flex items-center gap-sm">
            <PaymentStatus status={payment.status} />
            <Button
              aria-label="Đóng"
              className="inline-flex h-10 w-10 items-center justify-center border-none p-0"
              fullWidth={false}
              onClick={onClose}
              type="button"
              variant="ghost"
            >
              <Icon className="text-xl" name="close" />
            </Button>
          </div>
        </div>

        {error && (
          <p className="mb-md rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
            {error}
          </p>
        )}

        <PaymentQR payment={payment} />
      </div>
    </div>
  )
}

export default PaymentModal
