import { useEffect, useMemo, useState } from 'react'
import Button from '../Atoms/Button'
import DoctorCard from '../Molecules/DoctorCard'
import type { DoctorCardData } from '../Molecules/DoctorCard'
import Icon from '../Atoms/Icon'
import { getDoctors } from '../../services/doctor.service'
import type { Doctor } from '../../services/doctor.service'

const specialtyFromDescription = (doctor: Doctor) => {
  const description = doctor.description?.trim()

  return description ? description.split(/[,.]/)[0].slice(0, 42) : ''
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

const mapDoctor = (doctor: Doctor): DoctorCardData => ({
  name: doctor.user?.full_name || '',
  specialty: specialtyFromDescription(doctor),
  experienceYears: doctor.experience_years,
  image: doctor.image_url || '',
  fee: formatFee(doctor.consultation_fee),
})

type FeaturedDoctorsSectionProps = {
  query: string
}

const FeaturedDoctorsSection = ({ query }: FeaturedDoctorsSectionProps) => {
  const [doctors, setDoctors] = useState<DoctorCardData[]>([])
  const [apiStatus, setApiStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true

    getDoctors({ limit: 4, status: 'ACTIVE' })
      .then((result) => {
        if (!active) return

        setDoctors(result.doctors.map(mapDoctor))
        setApiStatus('ready')
      })
      .catch(() => {
        if (!active) return

        setDoctors([])
        setApiStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  const visibleDoctors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return doctors

    return doctors.filter((doctor) =>
      `${doctor.name || ''} ${doctor.specialty || ''}`.toLowerCase().includes(normalizedQuery)
    )
  }, [doctors, query])

  return (
    <section className="mx-auto max-w-7xl px-lg py-xxxl md:px-xxl" id="featured-doctors">
      <div className="mb-xxl flex flex-col justify-between gap-md md:flex-row md:items-end">
        <div>
          <h2 className="mb-sm font-headline-lg text-headline-lg text-on-background">Chuyên gia nổi bật</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Danh sách được lấy từ backend và hiển thị theo hồ sơ đang hoạt động.</p>
        </div>
        <Button className="flex items-center gap-xs self-start border-none p-0 text-primary shadow-none transition-all hover:gap-sm hover:bg-transparent" fullWidth={false} type="button" variant="ghost">
          Xem tất cả <Icon name="arrow_forward" />
        </Button>
      </div>
      {apiStatus === 'error' && (
        <p className="mb-md rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
          Chưa kết nối được backend nên chưa có dữ liệu bác sĩ để hiển thị.
        </p>
      )}
      {apiStatus === 'loading' && (
        <p className="mb-md font-body-sm text-body-sm text-on-surface-variant">Đang tải danh sách bác sĩ...</p>
      )}
      {visibleDoctors.length > 0 ? (
        <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4">
          {visibleDoctors.map((doctor, index) => (
            <DoctorCard doctor={doctor} key={`${doctor.name || 'doctor'}-${index}`} />
          ))}
        </div>
      ) : (
        apiStatus !== 'loading' && (
          <p className="rounded-lg border border-outline-variant/30 bg-surface p-lg text-center font-body-md text-body-md text-on-surface-variant">
            Chưa có dữ liệu bác sĩ.
          </p>
        )
      )}
    </section>
  )
}

export default FeaturedDoctorsSection
