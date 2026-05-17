import Logo from '../../Atoms/Logo'

const DashboardFooter = () => {
  return (
    <footer className="mt-auto bg-surface-container-highest">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-xl px-lg py-xxl md:flex-row md:px-xxl">
        <div className="flex max-w-sm flex-col gap-md">
          <Logo compact />
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Kết nối bệnh nhân với chuyên môn y tế tập trung vào độ chính xác và hệ thống quản lý sức khỏe hiện đại.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-xl">
          <div className="flex flex-col gap-sm">
            <h4 className="font-label-md text-label-md text-on-surface">Tài nguyên</h4>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary" href="#doctor-management">Cổng thông tin bác sĩ</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary" href="#">Hỗ trợ</a>
          </div>
          <div className="flex flex-col gap-sm">
            <h4 className="font-label-md text-label-md text-on-surface">Pháp lý</h4>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary" href="#">Chính sách bảo mật</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary" href="#">Điều khoản dịch vụ</a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-outline-variant/20 px-lg py-lg md:px-xxl">
        <p className="font-body-sm text-body-sm text-on-surface-variant">© 2026 MedPrecision Health Systems. Bảo lưu mọi quyền.</p>
      </div>
    </footer>
  )
}

export default DashboardFooter
