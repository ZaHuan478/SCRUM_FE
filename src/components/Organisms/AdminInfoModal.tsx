import Button from '../Atoms/Button'
import Icon from '../Atoms/Icon'

export type AdminInfoField = {
  label: string
  value?: string | number | null
}

type AdminInfoModalProps = {
  fields: AdminInfoField[]
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
}

const AdminInfoModal = ({ fields, open, title, subtitle, onClose }: AdminInfoModalProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 px-lg py-xl backdrop-blur-sm" role="presentation">
      <button aria-label="Đóng hộp thoại" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <section
        aria-modal="true"
        className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-surface-container-lowest p-xl shadow-[0px_20px_50px_rgba(15,23,42,0.12)]"
        role="dialog"
      >
        <div className="mb-xl flex items-start justify-between gap-lg border-b border-outline-variant/30 pb-lg">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">{title}</h2>
            {subtitle && <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{subtitle}</p>}
          </div>
          <Button
            aria-label="Đóng"
            className="rounded-full border-none p-sm text-on-surface-variant shadow-none hover:bg-surface-container-high"
            fullWidth={false}
            onClick={onClose}
            type="button"
            variant="ghost"
          >
            <Icon name="close" />
          </Button>
        </div>
        <dl className="grid grid-cols-1 gap-md sm:grid-cols-2">
          {fields.map((field) => (
            <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-md" key={field.label}>
              <dt className="font-label-sm text-label-sm text-on-surface-variant">{field.label}</dt>
              <dd className="mt-xs break-words font-body-md text-body-md text-on-surface">{field.value || 'Chưa cập nhật'}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

export default AdminInfoModal
