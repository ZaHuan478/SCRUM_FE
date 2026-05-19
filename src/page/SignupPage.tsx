import SignupForm from '../components/Organisms/Auth/SignupForm'
import Image from '../components/Atoms/Image'
import Logo from '../components/Atoms/Logo'

const signupImage = ''

const SignupPage = () => {
  return (
    <main className="flex min-h-screen">
      <section className="hidden lg:flex lg:w-1/2 relative bg-surface-container-low overflow-hidden items-center justify-center p-xxxl">
        <div className="relative z-10 max-w-xl text-center">
          <div className="mb-xxl inline-flex items-center gap-sm">
            <Logo />
          </div>
          <div className="space-y-lg mb-xxxl">
            <h2 className="font-display-lg text-display-lg text-on-surface">Bắt đầu hành trình chăm sóc sức khỏe chủ động.</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">Tạo tài khoản để lưu lịch hẹn, quản lý hồ sơ và theo dõi các chuyên gia phù hợp.</p>
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
