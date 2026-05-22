import SignupForm from '../components/Organisms/Auth/SignupForm'
import Image from '../components/Atoms/Image'
import Logo from '../components/Atoms/Logo'
import { useTranslation } from '../contexts/LanguageContext'

const signupImage = ''

const SignupPage = () => {
  const { t } = useTranslation()

  return (
    <main className="flex min-h-screen">
      <section className="hidden lg:flex lg:w-1/2 relative bg-surface-container-low overflow-hidden items-center justify-center p-xxxl">
        <div className="relative z-10 max-w-xl text-center">
          <div className="mb-xxl inline-flex items-center gap-sm">
            <Logo />
          </div>
          <div className="space-y-lg mb-xxxl">
            <h2 className="font-display-lg text-display-lg text-on-surface">{t('auth.signupHeroTitle')}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">{t('auth.signupHeroDescription')}</p>
          </div>
          {signupImage && (
            <div className="relative rounded-xl overflow-hidden shadow-md bg-white p-sm group transition-all duration-500 hover:shadow-xl">
              <Image alt="" className="rounded-lg w-full aspect-video object-cover" src={signupImage} />
            </div>
          )}
        </div>
      </section>

      <section className="w-full lg:w-1/2 flex items-center justify-center p-lg md:p-xxxl bg-surface-container-lowest">
        <SignupForm />
      </section>
    </main>
  )
}

export default SignupPage
