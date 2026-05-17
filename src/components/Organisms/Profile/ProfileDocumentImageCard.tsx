import type { ChangeEvent } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Image from '../../Atoms/Image'

type ProfileDocumentImageCardProps = {
  imageAlt: string
  imageLabel: string
  imageUrl: string
  title: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
}

const ProfileDocumentImageCard = ({
  imageAlt,
  imageLabel,
  imageUrl,
  title,
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
      {imageUrl && (
        <Button className="border-none p-0 text-error" fullWidth={false} onClick={onClear} type="button" variant="ghost">
          Xóa ảnh
        </Button>
      )}
    </div>
  </section>
)

export default ProfileDocumentImageCard
