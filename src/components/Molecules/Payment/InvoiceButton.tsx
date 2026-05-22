import { useState } from 'react'
import { downloadInvoicePdf } from '../../../api/payment.api'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'

type InvoiceButtonProps = {
  appointmentId?: number | string | null
  invoiceCode?: string | null
  pdfUrl?: string | null
}

const InvoiceButton = ({ appointmentId, invoiceCode, pdfUrl }: InvoiceButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (appointmentId) {
      setIsDownloading(true)
      try {
        const blob = await downloadInvoicePdf(appointmentId)
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${invoiceCode || `invoice-${appointmentId}`}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      } finally {
        setIsDownloading(false)
      }
      return
    }

    if (pdfUrl) window.open(pdfUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Button
      className="inline-flex items-center justify-center gap-xs px-lg py-sm"
      disabled={isDownloading || (!appointmentId && !pdfUrl)}
      fullWidth={false}
      onClick={handleDownload}
      type="button"
    >
      <Icon className="text-lg" name="download" />
      {isDownloading ? 'Đang tải...' : 'Tải hóa đơn PDF'}
    </Button>
  )
}

export default InvoiceButton
