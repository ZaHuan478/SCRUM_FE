import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'

type InvoiceButtonProps = {
  pdfUrl?: string | null
}

const InvoiceButton = ({ pdfUrl }: InvoiceButtonProps) => (
  <Button
    className="inline-flex items-center justify-center gap-xs px-lg py-sm"
    disabled={!pdfUrl}
    fullWidth={false}
    onClick={() => {
      if (pdfUrl) window.open(pdfUrl, '_blank', 'noopener,noreferrer')
    }}
    type="button"
  >
    <Icon className="text-lg" name="download" />
    Tải hóa đơn PDF
  </Button>
)

export default InvoiceButton
