export type DoctorStat = {
  label: string
  value: string
}

export type DoctorEducation = {
  id: string
  title: string
  description: string
  icon: string
}

export type DoctorPractice = {
  name: string
  address: string
  mapImage: string
  mapAlt: string
}

export type DoctorReview = {
  id: string
  author: string
  initials: string
  rating: number
  text: string
  toneClassName: string
}

export type DoctorTimeSlot = {
  id: string
  label: string
  disabled?: boolean
}

export type DoctorDetail = {
  id: string
  name: string
  title: string
  specialty: string
  rating: string
  reviewCount: number
  image: string
  imageAlt: string
  summary: string
  biography: string[]
  stats: DoctorStat[]
  education: DoctorEducation[]
  practice: DoctorPractice
  reviews: DoctorReview[]
}

export const doctorDetailTabs = ['Tiểu sử', 'Đào tạo', 'Bệnh viện', 'Đánh giá']

export const doctorDetailCopy = {
  bookTitle: 'Đặt lịch khám',
  earliestLabel: 'Lịch trống sớm nhất',
  earliestValue: 'Ngày mai, 9:00 AM',
  dateLabel: 'Chọn ngày',
  timeLabel: 'Giờ trống',
  confirmLabel: 'Xác nhận đặt lịch',
  bookingNote: 'Không tính phí cho đến sau buổi hẹn',
  secureTitle: 'Đặt lịch an toàn',
  secureDescription: 'Dữ liệu sức khỏe của bạn được bảo vệ theo tiêu chuẩn y tế.',
  biographyTitle: 'Tiểu sử chuyên môn',
  educationTitle: 'Đào tạo & Chứng chỉ',
  practiceTitle: 'Cơ sở hành nghề chính',
  reviewsTitle: 'Đánh giá từ bệnh nhân',
  writeReview: 'Viết đánh giá',
  footerDescription:
    'Kết nối bệnh nhân với các chuyên gia y tế chính xác nhất thông qua công nghệ tiên tiến.',
}

export const doctorDetail: DoctorDetail = {
  id: 'julianne-rivers',
  name: 'Bác sĩ Julianne Rivers, MD, PhD',
  title: 'Bác sĩ chuyên khoa Tim mạch cấp cao',
  specialty: 'Tim mạch can thiệp',
  rating: '4.9',
  reviewCount: 284,
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB-S1uXTeb5Ej_Ks99o6te8AXU5E5a05ak_9FwRlgshGzwWiAkqFxEYQHFZ9ogOlo8Hy-XYk3WUgL2a9M8L1bAqLWsuxP8_AewXKu5iXwYiJH-yCrKz5IZMBw3uye2ojBiku_yrVbeqITq2Ohr71g5GEhvMw2rNRW24vNdoMeD0Q4zJXWaDxnjbCae_qD4a3ZgiWvQoQhLRc0ORc2ianOdoYt2jJoJ30GsrOWOt0Z_2yeTKwJesO17F7sl-chhZ-Qe7T1JzGzwoWjhK',
  imageAlt: 'Bác sĩ Julianne Rivers',
  summary:
    'Chuyên gia về tim mạch can thiệp và bệnh tim cấu trúc với hơn 15 năm kinh nghiệm xuất sắc trong lâm sàng.',
  biography: [
    'Bác sĩ Julianne Rivers là một nhà lãnh đạo được công nhận trong lĩnh vực y học tim mạch. Bà hiện là Trưởng khoa Tim mạch can thiệp tại MedPrecision Central.',
    'Công việc của bà tập trung vào thay van tim xâm lấn tối thiểu và phẫu thuật bắc cầu động mạch vành, giúp rút ngắn thời gian hồi phục cho bệnh nhân.',
  ],
  stats: [
    { label: 'Kinh nghiệm', value: '15+ Năm' },
    { label: 'Bệnh nhân', value: '4.2k+' },
    { label: 'Tỉ lệ thành công', value: '98%' },
  ],
  education: [
    {
      id: 'johns-hopkins',
      title: 'Đại học Johns Hopkins',
      description: 'Tiến sĩ Khoa học Tim mạch, 2012',
      icon: 'school',
    },
    {
      id: 'harvard',
      title: 'Trường Y Harvard',
      description: 'Bằng Y khoa (MD), 2008',
      icon: 'school',
    },
  ],
  practice: {
    name: 'Bệnh viện Trung ương MedPrecision',
    address: '1200 Healthcare Plaza, Suite 400',
    mapImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDQOr7ovfMkFt8C9Z7bCeVpc_h_XhR9PpLxIap5L9KY3YG2Ad58IzR4N0VWgwx3LECcedumt8crN89popvOGy_zT_tuphw4xKvnKEC-w209W87NHU6jZxm43Kq4_8tlTBN9k_15bQUzESaKYHT-9iruzGTM12bGdpKc9-7ZM3Xwc9WmrQHJnlT2nO9HOFdTlgE-EtfmjYvY1DS9lL4kfNmN5L5ZuISfjeBexBrUIaBpU6r4wMaHSQJJGEoJK6eWHPzfBAOTp-lgqJO-',
    mapAlt: 'Bản đồ vị trí bệnh viện',
  },
  reviews: [
    {
      id: 'sarah-m',
      author: 'Sarah M.',
      initials: 'SM',
      rating: 5,
      text: 'Bác sĩ Rivers cực kỳ kỹ lưỡng và giải thích quy trình theo cách rất dễ hiểu.',
      toneClassName: 'bg-primary-container text-on-primary-container',
    },
    {
      id: 'james-w',
      author: 'James W.',
      initials: 'JW',
      rating: 5,
      text: 'Quá trình hồi phục nhanh hơn mong đợi. Đội ngũ chuyên nghiệp và cơ sở vật chất hiện đại.',
      toneClassName: 'bg-tertiary-container text-on-tertiary-container',
    },
  ],
}

export const doctorBookingDays = [
  { label: 'T2', day: '28', disabled: true },
  { label: 'T3', day: '29', disabled: true },
  { label: 'T4', day: '1', selected: true },
  { label: 'T5', day: '2' },
  { label: 'T6', day: '3' },
  { label: 'T7', day: '4', disabled: true },
  { label: 'CN', day: '5', disabled: true },
]

export const doctorTimeSlots: DoctorTimeSlot[] = [
  { id: '09-00', label: '09:00 AM' },
  { id: '10-30', label: '10:30 AM' },
  { id: '13-00', label: '01:00 PM' },
  { id: '14-30', label: '02:30 PM' },
  { id: '16-00', label: '04:00 PM' },
  { id: '17-30', label: '05:30 PM', disabled: true },
]
