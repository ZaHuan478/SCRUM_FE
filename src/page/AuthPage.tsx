import AuthForm from '../components/Organisms/Auth/AuthForm'
import Image from '../components/Atoms/Image'
import Logo from '../components/Atoms/Logo'
import { useTranslation } from '../contexts/LanguageContext'

const authImage = ''

const AuthPage = () => {
  const { t } = useTranslation()

  return (
    <main className="flex min-h-screen">
      <section className="relative hidden overflow-hidden bg-surface-container-low p-xxxl lg:flex lg:w-1/2 lg:items-center lg:justify-center">
        <div className="relative z-10 max-w-xl text-center">
          <div className="mb-xxl inline-flex items-center gap-sm">
            <Logo />
          </div>
          <div className="mb-xxxl space-y-lg">
            <h2 className="font-display-lg text-[44px] font-medium leading-none text-on-surface xl:text-[56px]">{t('auth.loginHeroTitle')}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">{t('auth.loginHeroDescription')}</p>
          </div>
          {authImage && (
            <div className="group relative overflow-hidden rounded-xl bg-surface p-sm shadow-[0_2px_8px_rgba(26,26,26,0.08)] transition-all duration-500 hover:shadow-[0_8px_24px_rgba(26,26,26,0.12)]">
              <Image alt="" className="rounded-lg w-full aspect-video object-cover" src={authImage} />
            </div>
          )}
        </div>
      </section>

      <section className="flex w-full items-center justify-center bg-surface-container-lowest p-lg md:p-xxxl lg:w-1/2">
        <div className="w-full max-w-lg rounded-xl border border-outline-variant bg-surface p-xl shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
          <AuthForm />
        </div>
      </section>
    </main>
  )
}

export default AuthPage
