import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getInvoiceByAppointment, type Invoice } from '../api/payment.api'
import InvoiceButton from '../components/Molecules/Payment/InvoiceButton'
import TopNavBar from '../components/Organisms/TopNavBar'
import { useToast } from '../contexts/ToastContext'
import { useTranslation } from '../contexts/LanguageContext'

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const PaymentSuccessPage = () => {
  const { appointmentId } = useParams()
  const { t } = useTranslation()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [error, setError] = useState('')
  const { error: toastError } = useToast()

  useEffect(() => {
    if (!appointmentId) return

    getInvoiceByAppointment(appointmentId)
      .then(setInvoice)
      .catch((requestError: unknown) => {
        const message = requestError instanceof Error ? requestError.message : t('payment.invoiceError')
        setError(message)
        toastError(message)
      })
  }, [appointmentId, t, toastError])

  const payment = invoice?.payment
  const appointment = payment?.appointment
  const doctorName = appointment?.doctor?.user?.full_name || t('payment.fallbackDoctor')
  const startTime = appointment?.slot?.start_time
  const endTime = appointment?.slot?.end_time

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNavBar active="doctors" />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-lg px-lg py-xl md:px-xxl">
        <section className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-xl shadow-sm">
          <p className="font-label-md text-label-md text-primary">{t('payment.successEyebrow')}</p>
          <h1 className="mt-xs font-headline-lg text-headline-lg text-on-surface">{t('payment.successTitle')}</h1>

          <div className="mt-lg grid gap-md sm:grid-cols-2">
            <div className="rounded-lg bg-surface-container p-md">
              <p className="font-label-sm text-label-sm text-on-surface-variant">{t('payment.doctorLabel')}</p>
              <p className="mt-xs font-label-lg text-label-lg text-on-surface">{doctorName}</p>
            </div>
            <div className="rounded-lg bg-surface-container p-md">
              <p className="font-label-sm text-label-sm text-on-surface-variant">{t('payment.timeLabel')}</p>
              <p className="mt-xs font-label-lg text-label-lg text-on-surface">
                {startTime ? dateFormatter.format(new Date(startTime)) : t('payment.updating')}
                {endTime ? ` - ${dateFormatter.format(new Date(endTime))}` : ''}
              </p>
            </div>
          </div>

          {error && (
            <p className="mt-lg rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
              {error}
            </p>
          )}

          <div className="mt-lg">
            <InvoiceButton
              appointmentId={appointmentId}
              invoiceCode={invoice?.invoice_code}
              pdfUrl={invoice?.pdf_url}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

export default PaymentSuccessPage
