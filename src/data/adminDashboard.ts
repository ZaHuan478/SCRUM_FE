export type AdminNavItem = {
  id: string
  label: string
  icon: string
  active?: boolean
}

export type AdminMetric = {
  id: string
  label: string
  value: string
  icon: string
  trend: string
  trendClassName: string
  iconClassName: string
}

export type AdminDoctorRow = {
  id: string
  name: string
  email: string
  specialty: string
  status: 'active' | 'offline'
  appointments: string
  avatar: string
}

export type ChartBar = {
  id: string
  label: string
  heightClassName: string
  toneClassName: string
}

export const adminDashboardCopy = {
  portalTitle: 'Cổng quản trị',
  portalSubtitle: 'Điều phối hệ thống y tế',
  searchPlaceholder: 'Tìm kiếm...',
  primaryAction: 'Đặt lịch hẹn',
  metricsTitle: 'Tổng quan vận hành',
  analyticsTitle: 'Phân tích lịch hẹn',
  analyticsDescription: 'Tổng quan hàng tuần về các lượt thăm khám và đặt lịch của bệnh nhân.',
  weekly: 'Hàng tuần',
  monthly: 'Hàng tháng',
  doctorsTitle: 'Quản lý bác sĩ',
  doctorSearchPlaceholder: 'Tìm kiếm bác sĩ...',
  showingDoctors: 'Đang hiển thị 3 trên 84 bác sĩ',
  previous: 'Trước',
  next: 'Tiếp theo',
  emergencySupport: 'Hỗ trợ khẩn cấp',
  helpCenter: 'Trung tâm trợ giúp',
  logout: 'Đăng xuất',
  footerDescription:
    'Kết nối bệnh nhân với chuyên môn y tế tập trung vào độ chính xác và các hệ thống quản lý sức khỏe tiên tiến.',
  copyright: '© 2026 MedPrecision Health Systems. Bảo lưu mọi quyền.',
}

export const adminProfile = {
  name: 'Quản trị viên',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD66Xilhllc0LTYsIayhp3Xr7M2LmZ800BlZ0M7Lelk7I7-jkAplcy1vjlTPltSmyyAdx-GzEJzbE_JcgEwPHJnwUmbaJyeCikdzJn-3okle1p9Gk6SuM1C1S0COQ_g7CGpDc77p-ZJRybseQR2rBceMOlRAfeHE0CbpLmrB_HQGeiZTuNRzQf6tyMNHBXqSr9jqHZQmzeKUKntB9qR7UOMy-13Hdg3mzRE3H-ifoUGZkLhg_8AJDGWwXVoLTYZ0ADYq8blwTpmsvRu',
}

export const adminNavItems: AdminNavItem[] = [
  { id: 'overview', label: 'Tổng quan', icon: 'dashboard', active: true },
  { id: 'appointments', label: 'Lịch hẹn', icon: 'calendar_today' },
  { id: 'doctors', label: 'Bác sĩ', icon: 'medical_services' },
  { id: 'patients', label: 'Bệnh nhân', icon: 'groups' },
  { id: 'settings', label: 'Cài đặt', icon: 'settings' },
]

export const adminMetrics: AdminMetric[] = [
  {
    id: 'appointments',
    label: 'Tổng số lịch hẹn',
    value: '1.284',
    icon: 'event_available',
    trend: '+12%',
    trendClassName: 'bg-secondary/10 text-secondary',
    iconClassName: 'bg-primary/10 text-primary',
  },
  {
    id: 'active-doctors',
    label: 'Bác sĩ đang hoạt động',
    value: '84',
    icon: 'medical_services',
    trend: 'Ổn định',
    trendClassName: 'bg-surface-variant text-on-surface-variant',
    iconClassName: 'bg-secondary-container/10 text-secondary',
  },
  {
    id: 'patient-growth',
    label: 'Tăng trưởng bệnh nhân',
    value: '2.450',
    icon: 'trending_up',
    trend: '+5.4%',
    trendClassName: 'bg-tertiary/10 text-tertiary',
    iconClassName: 'bg-tertiary-container/10 text-tertiary',
  },
  {
    id: 'revenue',
    label: 'Doanh thu',
    value: '142.5tr',
    icon: 'payments',
    trend: '+18%',
    trendClassName: 'bg-secondary/10 text-secondary',
    iconClassName: 'bg-primary-container/10 text-primary-container',
  },
]

export const appointmentChartBars: ChartBar[] = [
  { id: 'mon', label: 'T2', heightClassName: 'h-2/3', toneClassName: 'bg-primary/20' },
  { id: 'tue', label: 'T3', heightClassName: 'h-1/2', toneClassName: 'bg-primary/30' },
  { id: 'wed', label: 'T4', heightClassName: 'h-3/4', toneClassName: 'bg-primary/40' },
  { id: 'thu', label: 'T5', heightClassName: 'h-full', toneClassName: 'bg-primary' },
  { id: 'fri', label: 'T6', heightClassName: 'h-4/5', toneClassName: 'bg-primary/60' },
  { id: 'sat', label: 'T7', heightClassName: 'h-3/5', toneClassName: 'bg-primary/40' },
  { id: 'sun', label: 'CN', heightClassName: 'h-2/3', toneClassName: 'bg-primary/20' },
]

export const adminDoctorRows: AdminDoctorRow[] = [
  {
    id: 'sarah-smith',
    name: 'BS. Sarah Smith',
    email: 'smith.s@medprecision.com',
    specialty: 'Tim mạch',
    status: 'active',
    appointments: '42 tuần này',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBI-DTrnnWarkaXHR0GtN5Xl61M1tbhzT8QYdbR9GfnMKm9wQ4W4j7SS1PEZsUW_evZ_FXUUlGvfR0IeXQAsgWdg3geX_kF5QosOLHziz5rfRhgvJCIjlDGdBtMXDU87VXKuntTUjBHRpYo36lq2MBxXyTvAb_wr21WXFc7stWr-gBiimJaH1AVNeu3_ommbM1J4Xc5IG2i8mOO41EuQmWklwlEcin3trdsagAJvt5QFCdzUDPI1QAJGDMoBGzkF1gtvAZj3_O5NdjE',
  },
  {
    id: 'michael-chen',
    name: 'BS. Michael Chen',
    email: 'chen.m@medprecision.com',
    specialty: 'Thần kinh',
    status: 'offline',
    appointments: '28 tuần này',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCKF5yB8yQoZrX4kILGGd6dc_aQ1dwekg4xt_pJuaOYpEwgHLpeUhpSCIXMalSRgyX6XBv0WyK_J5GV81LDOmVMrpksA_Uk5YfEL8KB6CkDy6bk5VqLTTAZK-iJCbrfikPaMDtX6JwbmYJeqEdYHpDlfbLPtY50ouzdXtOpIQkpkqdqm2GViofjseINmNDYquRx3K4IzO0_Z42bYAk-rFsmN4_2LDcH7NzQD58PGXpiS-rCCRnZhkbvEy2YLjOCA8yi06Yg06ifCw9U',
  },
  {
    id: 'elena-kumar',
    name: 'BS. Elena Kumar',
    email: 'kumar.e@medprecision.com',
    specialty: 'Nhi khoa',
    status: 'active',
    appointments: '56 tuần này',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCkPjusEkfdc0EMMPyTQUkzfNFsI91ypdjORJgl3vVoxLKp-Sm8fqxjtfb0TC0kyhCH_k7mV_qRwnj1aA_wI3MrNHkSfGx_sbUBUe-amqCftljS7fatfSEB_OyPFnB0mUX6x2-F4M66hw8E-H6-aZ6tbSyn8h4gy5Q8C-0mrAE9bI45E46YSclt3yc-Coc3bC4Ein7Gc_xAZInHrH09KhY852Trdw-KRG0lnLHXzfSfIq5J55mf0tKj9rt-jRClVcH5XvOR_iahfWap',
  },
]

export const adminFooterGroups = [
  {
    title: 'Tài nguyên',
    links: ['Cổng thông tin bác sĩ', 'Hỗ trợ'],
  },
  {
    title: 'Pháp lý',
    links: ['Chính sách bảo mật', 'Điều khoản dịch vụ'],
  },
]
