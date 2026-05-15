import Logo from '../Atoms/Logo'
import Icon from '../Atoms/Icon'

const AppFooter = () => {
  return (
    <footer className="mx-auto flex w-full max-w-7xl flex-col items-start gap-xl bg-surface-container-highest px-lg py-xxl md:flex-row md:px-xxl">
      <div className="flex max-w-sm flex-col gap-md">
        <Logo />
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Cách mạng hóa việc tiếp cận y tế bằng hệ thống so khớp bác sĩ dựa trên dữ liệu và quy trình đặt lịch kỹ thuật số.
        </p>
        <div className="mt-sm flex gap-md">
          <a className="text-on-surface-variant hover:text-primary" href="#"><Icon name="public" /></a>
          <a className="text-on-surface-variant hover:text-primary" href="#"><Icon name="chat" /></a>
          <a className="text-on-surface-variant hover:text-primary" href="#"><Icon name="mail" /></a>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-xxl md:ml-auto">
        <div className="flex flex-col gap-md">
          <h5 className="font-label-md text-label-md uppercase text-on-surface">Công ty</h5>
          <a className="font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-primary" href="#">Về chúng tôi</a>
          <a className="font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-primary" href="#">Đội ngũ bác sĩ</a>
          <a className="font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-primary" href="#">Cổng bác sĩ</a>
          <a className="font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-primary" href="#">Hỗ trợ</a>
        </div>
        <div className="flex flex-col gap-md">
          <h5 className="font-label-md text-label-md uppercase text-on-surface">Pháp lý</h5>
          <a className="font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-primary" href="#">Chính sách bảo mật</a>
          <a className="font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-primary" href="#">Điều khoản dịch vụ</a>
          <a className="font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-primary" href="#">Cookie</a>
          <a className="font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-primary" href="#">An ninh</a>
        </div>
      </div>
      <div className="w-full border-t border-outline-variant/30 pt-lg md:hidden">
        <p className="font-label-sm text-label-sm text-on-surface-variant">© 2026 MedPrecision.</p>
      </div>
    </footer>
  )
}

export default AppFooter
