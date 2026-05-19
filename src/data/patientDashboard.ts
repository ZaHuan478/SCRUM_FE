export type PatientSummary = {
  displayName: string
  fullName: string
  patientCode: string
  avatar: string
  avatarAlt: string
}

export type DashboardNavItem = {
  id: string
  label: string
  icon: string
  active?: boolean
}

export type UpcomingAppointment = {
  status: string
  title: string
  doctorName: string
  doctorSpecialty: string
  doctorImage: string
  dateLabel: string
  timeLabel: string
}

export type MedicalRecord = {
  id: string
  title: string
  meta: string
  icon: string
  status: string
  statusClassName: string
}

export type QuickAction = {
  id: string
  title: string
  description: string
  icon: string
  tone: 'primary' | 'secondary' | 'neutral'
}

export type DashboardNotification = {
  id: string
  title: string
  description: string
  timeAgo: string
  icon: string
  toneClassName: string
}

export const patientDashboardCopy = {
  portalTitle: 'Cổng bệnh nhân',
  portalSubtitle: 'Quản lý sức khỏe của bạn',
  greetingPrefix: 'Chào mừng trở lại',
  summary:
    'Dưới đây là tóm tắt về sức khỏe và các dịch vụ chăm sóc sắp tới của bạn.',
  upcomingTitle: 'Lịch hẹn đã xác nhận',
  onlineCheckin: 'Làm thủ tục trực tuyến',
  viewDetail: 'Xem chi tiết',
  recordsTitle: 'Hồ sơ y tế gần đây',
  viewAll: 'Xem tất cả',
  quickActionsTitle: 'Hành động nhanh',
  notificationsTitle: 'Thông báo',
  emergencySupport: 'Hỗ trợ khẩn cấp',
  helpCenter: 'Trung tâm trợ giúp',
  logout: 'Đăng xuất',
  footerBrand: 'MedPrecision',
  footerDescription: '© 2026 Hệ thống Y tế MedPrecision. Bảo lưu mọi quyền.',
}

export const fallbackPatient: PatientSummary = {
  displayName: 'Alexander',
  fullName: 'Alexander Thompson',
  patientCode: 'MP-99283',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDD_wXbDR7r32jQgN3WvM14W5mwf7J5PuBa-BrGhjWun30F_WFHcrKPLA-ENRK_Mj1cCwlGNfxKWWOCYsQKKHEemVRZgoxsUCaZ5mj8c9rWXjJhiACxhaCnbpyuQIoDkAJys6fskKd1906ncaUNqkt6bVw3V-aLcZo8cwHF9_hBzTkleYDJyZesz06Hsz6iav4ePoSr_gE0BcYenECgNW2M8TkvFE84wr9sLcGypVfoRKi1oKlfIz8QUdE8S0rU9b2Cv-LVYepDTD_R',
  avatarAlt: 'Ảnh đại diện bệnh nhân',
}

export const patientDashboardNavItems: DashboardNavItem[] = [
  { id: 'overview', label: 'Tổng quan', icon: 'dashboard', active: true },
  { id: 'appointments', label: 'Lịch hẹn', icon: 'calendar_today' },
  { id: 'records', label: 'Hồ sơ y tế', icon: 'folder_shared' },
  { id: 'medication', label: 'Đơn thuốc', icon: 'medication' },
  { id: 'settings', label: 'Cài đặt', icon: 'settings' },
]

export const upcomingAppointment: UpcomingAppointment = {
  status: 'Lịch hẹn đã xác nhận',
  title: 'Khám tư vấn tim mạch',
  doctorName: 'BS. Sarah Jenkins',
  doctorSpecialty: 'Chuyên gia tim mạch cao cấp',
  doctorImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAbdPC8SY2TciJ7WY94rUkn-F61LgKVdu_u-EDCx0SPhK1xkCzbgoUKFczhchbtBloJQapj_n4LhTxaVEoqYPv44Nea_hhUdyv8SSe2z3F23fpK94OZd6XFncvgSDbsLit4mqqB1kOOM00TnI9xxPbjaM8lYFLc8I0zi-FF121nOjZayVlDpntTY6qJY8LpC15q-od1ePGjE63h10rrFP21VDVj_tIKHF2XTRXIRsOR_bA6XdZqbDTrD2s4jR2TOxKlAlfdOXIsnKVk',
  dateLabel: 'Ngày mai, 24 tháng 10',
  timeLabel: '10:30 SA (45 phút)',
}

export const recentMedicalRecords: MedicalRecord[] = [
  {
    id: 'annual-blood-test',
    title: 'Kết quả xét nghiệm máu hàng năm',
    meta: '12 thg 10, 2024 • Dịch vụ LabCorp',
    icon: 'description',
    status: 'Bình thường',
    statusClassName: 'bg-green-100 text-green-700',
  },
  {
    id: 'chest-xray',
    title: 'Chụp X-quang ngực',
    meta: '28 thg 9, 2024 • Bệnh viện Đa khoa',
    icon: 'radiology',
    status: 'Cần xem xét',
    statusClassName: 'bg-on-tertiary-container/40 text-tertiary',
  },
  {
    id: 'flu-shot',
    title: 'Tiêm phòng cúm',
    meta: '15 thg 9, 2024 • Phòng khám Walgreens',
    icon: 'vaccines',
    status: 'Đã hoàn thành',
    statusClassName: 'bg-primary/10 text-primary',
  },
]

export const quickActions: QuickAction[] = [
  {
    id: 'find-doctor',
    title: 'Tìm bác sĩ',
    description: 'Tìm kiếm theo chuyên khoa',
    icon: 'search',
    tone: 'primary',
  },
  {
    id: 'symptom-check',
    title: 'Kiểm tra triệu chứng',
    description: 'Phân tích các lo ngại về sức khỏe',
    icon: 'health_and_safety',
    tone: 'secondary',
  },
  {
    id: 'new-request',
    title: 'Yêu cầu mới',
    description: 'Cấp lại đơn thuốc',
    icon: 'add_box',
    tone: 'neutral',
  },
]

export const dashboardNotifications: DashboardNotification[] = [
  {
    id: 'prescription-ready',
    title: 'Đơn thuốc đã sẵn sàng',
    description: 'Lisinopril 10mg đã sẵn sàng để lấy tại Nhà thuốc CVS.',
    timeAgo: '2 giờ trước',
    icon: 'medication',
    toneClassName: 'bg-primary-container text-on-primary-container',
  },
  {
    id: 'billing-statement',
    title: 'Bản kê khai thanh toán',
    description: 'Hóa đơn mới cho lần xét nghiệm cuối cùng của bạn đã có để xem xét.',
    timeAgo: 'Hôm qua',
    icon: 'priority_high',
    toneClassName: 'bg-tertiary/10 text-tertiary',
  },
  {
    id: 'doctor-message',
    title: 'Tin nhắn mới',
    description:
      'BS. Jenkins đã gửi cho bạn một tin nhắn theo dõi về các chỉ số sinh tồn của bạn.',
    timeAgo: '2 ngày trước',
    icon: 'mail',
    toneClassName: 'bg-secondary/10 text-secondary',
  },
]

export const patientFooterLinks = [
  {
    title: 'Tài nguyên',
    links: ['Chính sách bảo mật', 'Điều khoản dịch vụ'],
  },
  {
    title: 'Truy cập',
    links: ['Cổng bác sĩ', 'Liên hệ hỗ trợ'],
  },
]
