import type { ChangeEvent, RefObject } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Image from '../../Atoms/Image'

type ProfileAvatarCardProps = {
  avatarInputRef: RefObject<HTMLInputElement | null>
  avatarUrl: string
  isSaving: boolean
  onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClearAvatar: () => void
}

const ProfileAvatarCard = ({
  avatarInputRef,
  avatarUrl,
  isSaving,
  onAvatarChange,
  onClearAvatar,
}: ProfileAvatarCardProps) => (
  <section className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
    <div className="mb-lg flex items-center gap-sm">
      <Icon className="text-secondary" name="account_circle" />
      <h2 className="font-headline-sm text-headline-sm text-on-surface">Ảnh đại diện</h2>
    </div>

    <div className="space-y-md">
      <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border border-outline-variant/30 bg-surface-variant">
        <Image alt="Ảnh đại diện" className="h-full w-full object-cover" fallbackClassName="h-full w-full" src={avatarUrl || undefined} />
      </div>
      <input
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        id="profile-avatar"
        onChange={onAvatarChange}
        ref={avatarInputRef}
        type="file"
      />
      <div className="flex flex-wrap justify-center gap-sm">
        <Button
          className="inline-flex items-center justify-center gap-xs px-md py-sm"
          disabled={isSaving}
          fullWidth={false}
          onClick={() => avatarInputRef.current?.click()}
          type="button"
          variant="ghost"
        >
          <Icon className="text-lg" name="upload" />
          Chọn ảnh
        </Button>
        {avatarUrl && (
          <Button className="border-none px-md py-sm text-error" fullWidth={false} onClick={onClearAvatar} type="button" variant="ghost">
            Xóa ảnh
          </Button>
        )}
      </div>
    </div>
  </section>
)

export default ProfileAvatarCard
