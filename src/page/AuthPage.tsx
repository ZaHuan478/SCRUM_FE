import React from 'react'
import AuthForm from '../components/Organisms/AuthForm'
import Logo from '../components/Atoms/Logo'

const AuthPage: React.FC = () => {
  return (
    <main className="flex min-h-screen">
      <section className="hidden lg:flex lg:w-1/2 relative bg-surface-container-low overflow-hidden items-center justify-center p-xxxl">
        <div className="relative z-10 max-w-xl text-center">
          <div className="mb-xxl inline-flex items-center gap-sm">
            <Logo />
          </div>
          <div className="space-y-lg mb-xxxl">
            <h2 className="font-display-lg text-display-lg text-on-surface">Trải nghiệm dịch vụ y tế xuất sắc ngay tại nhà.</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">Tiếp cận các chuyên gia hàng đầu thế giới và quản lý hồ sơ sức khỏe cá nhân của bạn với nền tảng kỹ thuật số an toàn, ưu tiên bệnh nhân.</p>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-md bg-white p-sm group transition-all duration-500 hover:shadow-xl">
            <img alt="Chuyên gia y tế sử dụng máy tính bảng" className="rounded-lg w-full aspect-video object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDijD02HRM7VXecjG1XDoZ__Je8ILVaEpaZSv-kgurpN8vfWQcpqMPAnZiF6evycX9W2TSELvFjK_QkXuif6pUOEgW2qSfbKuZ6Kyj0-VbQKObXP4mpFyY0X7Xta8r6bN0ZQT-ezFgzmzCaYqzf7myQz6lu7v7tdg7NKgW53XQ4I3dmyy_4LvKVyngHHtTtuZM2rfov1dGppRJyUGYQoSc02VPere7h1GeWpG6hGOoesKNGXext7xDxrZaedJT4YnFZNpyfh9b9ocOr" />
          </div>
        </div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl"></div>
      </section>

      <section className="w-full lg:w-1/2 flex items-center justify-center p-lg md:p-xxxl bg-surface-container-lowest">
        <AuthForm />
      </section>
    </main>
  )
}

export default AuthPage
