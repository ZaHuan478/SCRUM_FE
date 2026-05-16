import AuthForm from '../components/Organisms/AuthForm'
import Logo from '../components/Atoms/Logo'

const AuthPage = () => {
  return (
    <main className="flex min-h-screen">
      <section className="hidden lg:flex lg:w-1/2 relative bg-surface-container-low overflow-hidden items-center justify-center p-xxxl">
        <div className="relative z-10 max-w-xl text-center">
          <div className="mb-xxl inline-flex items-center gap-sm">
            <Logo />
          </div>
          <div className="space-y-lg mb-xxxl">
            <h2 className="font-display-lg text-display-lg text-on-surface">Quản lý chăm sóc sức khỏe trên một nền tảng an toàn.</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">Truy cập hồ sơ cá nhân, đặt lịch và kết nối với chuyên gia y tế đã xác thực.</p>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-md bg-white p-sm group transition-all duration-500 hover:shadow-xl">
            <img alt="Chuyên gia y tế sử dụng máy tính bảng" className="rounded-lg w-full aspect-video object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDijD02HRM7VXecjG1XDoZ__Je8ILVaEpaZSv-kgurpN8vfWQcpqMPAnZiF6evycX9W2TSELvFjK_QkXuif6pUOEgW2qSfbKuZ6Kyj0-VbQKObXP4mpFyY0X7Xta8r6bN0ZQT-ezFgzmzCaYqzf7myQz6lu7v7tdg7NKgW53XQ4I3dmyy_4LvKVyngHHtTtuZM2rfov1dGppRJyUGYQoSc02VPere7h1GeWpG6hGOoesKNGXext7xDxrZaedJT4YnFZNpyfh9b9ocOr" />
          </div>
        </div>
      </section>

      <section className="w-full lg:w-1/2 flex items-center justify-center p-lg md:p-xxxl bg-surface-container-lowest">
        <AuthForm />
      </section>
    </main>
  )
}

export default AuthPage
