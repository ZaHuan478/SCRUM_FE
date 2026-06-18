import AuthForm from '../components/Organisms/Auth/AuthForm'
import Image from '../components/Atoms/Image'
import Logo from '../components/Atoms/Logo'
import { useTranslation } from '../contexts/LanguageContext'

const authImage = ''

const AuthPage = () => {
  const { t } = useTranslation()

  return (
    <main className="hp-home hp-soft-home grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)]">
      <section className="relative hidden overflow-hidden p-xxxl lg:flex lg:items-center lg:justify-center">
        <div className="relative z-10 max-w-xl text-center">
          <div className="mb-xxl inline-flex items-center gap-sm">
            <Logo />
          </div>
          <div className="mb-xxxl space-y-lg">
            <p className="inline-flex items-center gap-sm font-label-sm text-label-sm uppercase tracking-[0.32em] text-on-surface-variant">
              <span className="h-1 w-10 rounded-full bg-primary" />
              Welcome back
            </p>
            <h2 className="font-display-lg text-[48px] font-semibold uppercase leading-[0.92] text-on-surface xl:text-[72px]">{t('auth.loginHeroTitle')}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto leading-8">{t('auth.loginHeroDescription')}</p>
          </div>
          {authImage && (
            <div className="group relative overflow-hidden rounded-xl bg-surface p-sm shadow-[0_2px_8px_rgba(26,26,26,0.08)] transition-all duration-500 hover:shadow-[0_8px_24px_rgba(26,26,26,0.12)]">
              <Image alt="" className="rounded-lg w-full aspect-video object-cover" src={authImage} />
            </div>
          )}
        </div>
      </section>

      <section className="flex w-full items-center justify-center p-lg md:p-xxxl">
        <div className="w-full max-w-lg rounded-[2rem] border border-white/70 bg-surface/82 p-lg shadow-[0_28px_78px_rgba(15,23,42,0.12)] backdrop-blur-2xl md:p-xl">
          <AuthForm />
        </div>
      </section>
    </main>
  )
}

export default AuthPage
