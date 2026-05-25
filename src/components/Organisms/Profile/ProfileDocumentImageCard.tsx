import type { ChangeEvent } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Image from '../../Atoms/Image'

type ProfileDocumentImageCardProps = {
  imageAlt: string
  imageLabel: string
  imageUrl: string
  title: string
  actionDisabled?: boolean
  actionLabel?: string
  actionLoading?: boolean
  onAction?: () => void
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
}

const ProfileDocumentImageCard = ({
  actionDisabled = false,
  actionLabel,
  actionLoading = false,
  imageAlt,
  imageLabel,
  imageUrl,
  title,
  onAction,
  onChange,
  onClear,
}: ProfileDocumentImageCardProps) => (
  <section className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
    <div className="mb-lg flex items-center gap-sm">
      <Icon className="text-secondary" name="badge" />
      <h2 className="font-headline-sm text-headline-sm text-on-surface">{title}</h2>
    </div>

    <div className="space-y-md">
      <div className="aspect-[16/10] overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-variant">
        <Image alt={imageAlt} className="h-full w-full object-cover" fallbackClassName="h-full w-full" src={imageUrl || undefined} />
      </div>
      <input
        accept="image/png,image/jpeg,image/webp"
        aria-label={imageLabel}
        className="w-full rounded-lg border border-outline-variant px-md py-sm font-body-sm text-body-sm text-on-surface-variant"
        onChange={onChange}
        type="file"
      />
      <div className="flex flex-wrap items-center gap-sm">
        {imageUrl && (
          <Button className="border-none p-0 text-error" fullWidth={false} onClick={onClear} type="button" variant="ghost">
            Xóa ảnh
          </Button>
        )}
        {onAction && actionLabel && (
          <Button
            className="inline-flex items-center justify-center gap-xs px-md py-sm"
            disabled={actionDisabled || actionLoading}
            fullWidth={false}
            isLoading={actionLoading}
            onClick={onAction}
            type="button"
            variant="ghost"
          >
            <Icon className="text-lg" name="document_scanner" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  </section>
)

export default ProfileDocumentImageCard
