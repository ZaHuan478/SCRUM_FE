export type AppointmentStep = {
  id: string
  label: string
  state: 'complete' | 'current' | 'upcoming'
}

export type TimeSlot = {
  id: string
  label: string
  period: 'morning' | 'afternoon'
}

export type SelectOption = {
  value: string
  label: string
}

export type BookingDoctor = {
  name: string
  specialty: string
  rating: string
  reviewCount: number
  image: string
  fee: string
}

export const appointmentSteps: AppointmentStep[] = [
  { id: 'schedule', label: 'Chọn giờ', state: 'complete' },
  { id: 'patient', label: 'Thông tin bệnh nhân', state: 'current' },
  { id: 'confirm', label: 'Xác nhận', state: 'upcoming' },
]

export const timeSlots: TimeSlot[] = [
  { id: '09-00', label: '09:00', period: 'morning' },
  { id: '10-30', label: '10:30', period: 'morning' },
  { id: '11-15', label: '11:15', period: 'morning' },
  { id: '13-45', label: '13:45', period: 'afternoon' },
  { id: '15-00', label: '15:00', period: 'afternoon' },
  { id: '16-30', label: '16:30', period: 'afternoon' },
]

export const insuranceProviders: SelectOption[] = [
  { value: '', label: 'Chọn nhà cung cấp' },
  { value: 'bao-viet', label: 'Bảo Việt' },
  { value: 'pvi', label: 'PVI Insurance' },
  { value: 'prudential', label: 'Prudential' },
]

export const defaultBookingDoctor: BookingDoctor = {
  name: 'BS. Julianne Rhodes',
  specialty: 'Chuyên gia Tim mạch',
  rating: '4.9',
  reviewCount: 120,
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCidJD-AcL98fNHSTBHvD5NBtokldB_5n2GN3dbp-yy-i3Ki6zZLegSQkI2NKjFTUXnQOaOep0YutHMbhw_UZeZHk_VegaKxcpwIB5SJ-9LZcHMNPFp4N4ce55E7m32MP6B_-8XV53sVg1IsGsUatZ1sLw8YbcX2w9nhhdPGeuZHIl3H5fWrEKbjn1NK_3piS4J_dQSqbPCj2qtfcqPX9C8YDX2vjHPsjKnh8L2fpqdpiRFXb_rqQDuTiIy-oCtf_-K1LtXEhe-jZFb',
  fee: '150.000 VNĐ',
}

export const bookingCopy = {
  title: 'Đặt lịch khám',
  description: 'Vui lòng xác nhận ngày khám và cung cấp thông tin y tế để hoàn tất đặt lịch.',
  summaryTitle: 'Tóm tắt đặt lịch',
  cancelPolicy: 'Miễn phí hủy lịch trước 24 giờ so với giờ hẹn đã định.',
  privacyTitle: 'Bảo mật',
  privacyText: 'Dữ liệu của bạn được mã hóa và chỉ dùng cho quy trình chăm sóc y tế.',
  submitLabel: 'Xác nhận đặt lịch',
}
