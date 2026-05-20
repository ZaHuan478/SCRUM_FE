import type { Doctor } from '../services/doctor.service'

export type DetailTab = 'biography' | 'education'

export type EducationItem = {
  title: string
  description: string
}

export const formatFee = (fee?: string | number | null) => {
  if (fee === undefined || fee === null || fee === '') return 'Chưa cập nhật'

  const amount = Number(fee)
  if (Number.isNaN(amount)) return String(fee)

  return new Intl.NumberFormat('vi-VN', {
    currency: 'VND',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(amount)
}

export const buildFallbackBiography = (doctor?: Doctor, specialty?: string) => {
  const name = doctor?.user?.full_name || 'Bác sĩ'
  const experienceYears = Number(doctor?.experience_years || 0)
  const experienceText = experienceYears > 0
    ? `với ${experienceYears} năm kinh nghiệm lâm sàng`
    : 'với nền tảng chuyên môn vững chắc'
  const focus = doctor?.description || specialty || 'khám, tư vấn và điều trị theo tiêu chuẩn y khoa hiện đại'

  return `${name} là bác sĩ ${experienceText}, tập trung vào ${focus.toLowerCase()}. Bác sĩ theo đuổi phong cách chăm sóc dựa trên bằng chứng, giải thích rõ ràng cho người bệnh và xây dựng phác đồ phù hợp với từng hồ sơ sức khỏe. Trong quá trình thăm khám, bác sĩ ưu tiên lắng nghe triệu chứng, đánh giá nguy cơ toàn diện và phối hợp theo dõi sau điều trị để giúp người bệnh an tâm hơn trong từng bước chăm sóc.`
}

export const buildEducation = (doctor?: Doctor, specialty?: string): EducationItem[] => {
  const specialtyLabel = specialty || doctor?.description || 'chuyên khoa liên quan'
  const experienceYears = Number(doctor?.experience_years || 0)

  return [
    {
      title: 'Đào tạo y khoa nền tảng',
      description: 'Hoàn thành chương trình đào tạo bác sĩ và thực hành lâm sàng theo quy trình chuyên môn, tập trung vào đánh giá triệu chứng, chẩn đoán ban đầu và lập kế hoạch điều trị an toàn.',
    },
    {
      title: `Định hướng chuyên môn ${specialtyLabel}`,
      description: `Duy trì cập nhật kiến thức trong lĩnh vực ${specialtyLabel.toLowerCase()}, ưu tiên chỉ định phù hợp, tư vấn rõ ràng và phối hợp theo dõi sau khám.`,
    },
    {
      title: 'Phát triển chuyên môn liên tục',
      description: experienceYears > 0
        ? `Tích lũy ${experienceYears} năm kinh nghiệm qua hoạt động khám chữa bệnh, trao đổi chuyên môn và cải tiến quy trình chăm sóc người bệnh.`
        : 'Thường xuyên cập nhật hướng dẫn điều trị và thực hành giao tiếp y khoa lấy người bệnh làm trung tâm.',
    },
  ]
}

export const buildDoctorBookingPath = (doctor?: Doctor | null) => {
  const bookingSearch = new URLSearchParams()

  if (doctor?.id) bookingSearch.set('doctor_id', String(doctor.id))
  if (doctor?.user?.full_name) bookingSearch.set('doctor_name', doctor.user.full_name)

  return `/appointments${bookingSearch.toString() ? `?${bookingSearch.toString()}` : ''}`
}
