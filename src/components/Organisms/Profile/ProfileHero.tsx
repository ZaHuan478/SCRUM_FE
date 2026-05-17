import Image from '../../Atoms/Image'
import type { User } from '../../../services/auth.service'
import { getProfileRoleLabel } from '../../../utils/profile'

type ProfileHeroProps = {
  avatarUrl: string
  user: User
}

const ProfileHero = ({ avatarUrl, user }: ProfileHeroProps) => (
  <section className="flex flex-col gap-md border-b border-outline-variant/30 pb-lg md:flex-row md:items-end md:justify-between">
    <div className="flex items-center gap-md">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-outline-variant/30 bg-surface-variant">
        <Image alt="Ảnh đại diện" className="h-full w-full object-cover" fallbackClassName="h-full w-full" src={avatarUrl || undefined} />
      </div>
      <div>
        <p className="font-label-md text-label-md text-primary">{getProfileRoleLabel(user)}</p>
        <h1 className="mt-xs font-headline-lg text-headline-lg text-on-background">Hồ sơ cá nhân</h1>
      </div>
    </div>
  </section>
)

export default ProfileHero
