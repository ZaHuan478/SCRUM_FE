import Image from '../../Atoms/Image'
import type { User } from '../../../services/auth.service'
import { getProfileRoleLabel } from '../../../utils/profile'

type ProfileHeroProps = {
  avatarUrl: string
  user: User
}

const ProfileHero = ({ avatarUrl, user }: ProfileHeroProps) => (
  <section className="flex flex-col gap-md rounded-[2rem] border border-white/70 bg-surface/78 p-lg shadow-[0_26px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl md:flex-row md:items-end md:justify-between md:p-xl">
    <div className="flex items-center gap-md">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-3xl border border-white/70 bg-surface-variant shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
        <Image alt="Ảnh đại diện" className="h-full w-full object-cover" fallbackClassName="h-full w-full" src={avatarUrl || undefined} />
      </div>
      <div>
        <p className="font-label-sm text-label-sm uppercase tracking-[0.24em] text-primary">{getProfileRoleLabel(user)}</p>
        <h1 className="mt-xs font-headline-lg text-[42px] font-semibold uppercase leading-[0.92] text-on-background sm:text-[56px]">Hồ sơ cá nhân</h1>
      </div>
    </div>
  </section>
)

export default ProfileHero
