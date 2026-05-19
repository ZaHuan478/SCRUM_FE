import { useEffect, useMemo, useState } from 'react'
import DoctorCard from '../Molecules/DoctorCard'
import type { DoctorCardData } from '../Molecules/DoctorCard'
import Icon from '../Atoms/Icon'
import { getDoctors } from '../../services/doctor.service'
import type { Doctor } from '../../services/doctor.service'

const fallbackImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBEVXyiMFJUfxmt4utBOThBJEdmWZ64wCeOCQnddA_hN7dPRhnXTJnHqTySMLgMY6bNmJQ7O4LlsAvTayn7owEgXJMSgfnBd6omXn_TTLYfIb3Yx4UGiw_UJ3HO9WIsb54RuO19n607fu0EbX0PP5wZr0k_9k0uUs_kdxQEld478SaLHJ-FBYygXeiwvcrTyTQifmOIN5Ly53mPir9bSkPwzJpRxquQ_Grppz8Wn1ao4e4cViGxCLOsiKEvrel3mJDAGr9KfE6FjIjm',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBGAxzOy2fpCOjX-Un8vcBgdnG5MJ5gBG606aYgYEsyyIDAku7fXBzBL1r2hM_DIqiXWLDW9Rh-G2Tib_4l8NXN3u7MmLVrqTMluIH46GBzWrD__eom8ud8HAgQStmzywXq9FePfG8ZE1fKCiSdNE9A4_K6eJqDNa2-TA6tfIXmOeavXRE_R7joeXENeZtWxDjIzX5Q2wZauBHT_ec2qp4AGRbpw8Sd8Th5iE9SyZC_UPC4CCksf8QsTYJ5kNHNUAyYpx_9r7PVXp7A',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB0Ae3VvbhQzJAPtqZwcTiNvVV8R5FfK9jMdqop1gbDWzdwKIR2zYyebCJM_O3JnVEnpMOPGjeJviyePdATQJ7_-Qiv_t0YQL65YGJH-pvU709LfyyOCkE8-0pC9htNA7RCoVfVw_BaqBRBG1a5Sf-ADOSdCiuyebUSl_t66s7xmIxzd0LyWRhaIv_wGrA0A_TWy76tHY_rmziYAvMj0i30o6NXQKHyZ4uLU4D5iUi3fwSpU6rxcN8d9QGi0-JZzp6tqsSk9CetRm1BLb03vz',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBre7hYtkoPN4ti7LTqdvpSQuv74u-7ucX6qBWmcGUIxuyVx8zmsBvZNGHusIInD8HQppvBNkte2gXOQddzYlgJ_kuM5NmygNyM7Jrk0A9rhSk9UfhUzLoBj6IqPv5QHpEg786ehbTrQfB0f6wL9SqH6MCSV0A28SJa64YUpnTnFCx3YCqWfDrALGn1fGgvXD2kn3xO63aKkcq8WXTdMW-MHqd57meObOw9G_IO0eWRR1kKGeKrSdwLM6feRtT5BVGJP1VIyxMqDwWl',
]

const fallbackDoctors: DoctorCardData[] = [
  {
    id: 'sarah-jenkins',
    name: 'BS. Sarah Jenkins',
    specialty: 'Tim mạch',
    experienceYears: 12,
    rating: '4.9',
    image: fallbackImages[0],
  },
  {
    id: 'michael-chen',
    name: 'BS. Michael Chen',
    specialty: 'Thần kinh',
    experienceYears: 8,
    rating: '4.8',
    image: fallbackImages[1],
  },
  {
    id: 'elena-rodriguez',
    name: 'BS. Elena Rodriguez',
    specialty: 'Nhi khoa',
    experienceYears: 15,
    rating: '5.0',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0Ae3VvbhQzJAPtqZwcTiNvVV8R5FfK9jMdqop1gbDWzdwKIR2zYyebCJM_O3JnVEnpMOPGjeJviyePdATQJ7_-Qiv_t0YQL65YGJH-pvU709LfyyRhCkBZnGfyj9jyO1IF4BQp4BchCDYi8Sk1i9O7C-IyZHsP10xGgo6ux-alXT83OXkHIXoBlgou_xaMr_cvg020HgFqQKn5tj3UrFNl0giOs3F5fIwKzer-XWPt5peedkbP-jvpQW7yBSfClDz-i42Gt9ItS60',
  },
  {
    id: 'james-wilson',
    name: 'BS. James Wilson',
    specialty: 'Chấn thương chỉnh hình',
    experienceYears: 10,
    rating: '4.7',
    image: fallbackImages[3],
  },
]

const specialtyFromDescription = (doctor: Doctor) => {
  const description = doctor.description?.trim()
  if (!description) return 'Chuyên khoa tổng quát'

  return description.split(/[,.]/)[0].slice(0, 42)
}

const formatFee = (fee?: string | number | null) => {
  if (fee === undefined || fee === null || fee === '') return undefined

  const amount = Number(fee)
  if (Number.isNaN(amount)) return String(fee)

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

const mapDoctor = (doctor: Doctor, index: number): DoctorCardData => ({
  id: doctor.id,
  name: doctor.user?.full_name || `Bác sĩ #${doctor.id}`,
  specialty: specialtyFromDescription(doctor),
  experienceYears: Number(doctor.experience_years || 0),
  rating: (4.7 + (index % 3) / 10).toFixed(1),
  image: fallbackImages[index % fallbackImages.length],
  fee: formatFee(doctor.consultation_fee),
})

type FeaturedDoctorsSectionProps = {
  query: string
}

const FeaturedDoctorsSection = ({ query }: FeaturedDoctorsSectionProps) => {
  const [doctors, setDoctors] = useState<DoctorCardData[]>(fallbackDoctors)
  const [apiStatus, setApiStatus] = useState<'loading' | 'ready' | 'fallback'>('loading')

  useEffect(() => {
    let active = true

    getDoctors({ limit: 4, status: 'ACTIVE' })
      .then((result) => {
        if (!active) return

        const mappedDoctors = result.doctors.map(mapDoctor)
        setDoctors(mappedDoctors.length > 0 ? mappedDoctors : fallbackDoctors)
        setApiStatus('ready')
      })
      .catch(() => {
        if (!active) return

        setDoctors(fallbackDoctors)
        setApiStatus('fallback')
      })

    return () => {
      active = false
    }
  }, [])

  const visibleDoctors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return doctors

    return doctors.filter((doctor) =>
      `${doctor.name} ${doctor.specialty}`.toLowerCase().includes(normalizedQuery)
    )
  }, [doctors, query])

  return (
    <section className="mx-auto max-w-7xl px-lg py-xxxl md:px-xxl" id="featured-doctors">
      <div className="mb-xxl flex flex-col justify-between gap-md md:flex-row md:items-end">
        <div>
          <h2 className="mb-sm font-headline-lg text-headline-lg text-on-background">Chuyên gia nổi bật</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Danh sách được lấy từ backend và hiển thị theo hồ sơ đang hoạt động.</p>
        </div>
        <button className="flex items-center gap-xs self-start font-label-md text-label-md text-primary transition-all hover:gap-sm" type="button">
          Xem tất cả <Icon name="arrow_forward" />
        </button>
      </div>
      {apiStatus === 'fallback' && (
        <p className="mb-md rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
          Chưa kết nối được backend, đang hiển thị dữ liệu dự phòng.
        </p>
      )}
      {apiStatus === 'loading' && (
        <p className="mb-md font-body-sm text-body-sm text-on-surface-variant">Đang tải danh sách bác sĩ...</p>
      )}
      <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4">
        {visibleDoctors.map((doctor) => (
          <DoctorCard doctor={doctor} key={`${doctor.name}-${doctor.specialty}`} />
        ))}
      </div>
      {visibleDoctors.length === 0 && (
        <p className="mt-lg rounded-lg border border-outline-variant/30 bg-surface p-lg text-center font-body-md text-body-md text-on-surface-variant">
          Không tìm thấy bác sĩ phù hợp với từ khóa hiện tại.
        </p>
      )}
    </section>
  )
}

export default FeaturedDoctorsSection
