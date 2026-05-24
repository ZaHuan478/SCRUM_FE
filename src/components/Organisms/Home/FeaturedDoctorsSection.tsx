import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DoctorCard from '../../Molecules/Home/DoctorCard'
import type { DoctorCardData } from '../../Molecules/Home/DoctorCard'
import Icon from '../../Atoms/Icon'
import { useTranslation } from '../../../contexts/LanguageContext'
import { getDoctors } from '../../../services/doctor.service'
import type { Doctor } from '../../../services/doctor.service'

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
  id: doctor.id,
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
  const { t } = useTranslation()
  const [doctors, setDoctors] = useState<DoctorCardData[]>([])
  const [apiStatus, setApiStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true
    const keyword = query.trim()

    setApiStatus('loading')

    getDoctors({
      limit: keyword ? 12 : 4,
      keyword: keyword || undefined,
      status: 'ACTIVE',
    })
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
  }, [query])

  return (
    <section className="mx-auto max-w-[1366px] bg-white px-lg py-[80px] md:px-xxl" id="featured-doctors">
      <div className="mb-xxl flex flex-col justify-between gap-md md:flex-row md:items-end">
        <div>
          <h2 className="mb-sm font-headline-lg text-[44px] font-medium leading-none tracking-normal text-[#1a1a1a]">{t('home.featuredDoctors.title')}</h2>
          <p className="font-body-md text-body-md text-[#3d3d3d]"></p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-xs self-start rounded-[4px] border border-[#024ad8] bg-white px-xl py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-[#024ad8] transition-colors hover:bg-[#f7f7f7]"
          to="/doctors"
        >
          {t('common.viewAll')} <Icon name="arrow_forward" />
        </Link>
      </div>
      {apiStatus === 'error' && (
        <p className="mb-md rounded-[8px] bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
          {t('home.featuredDoctors.backendError')}
        </p>
      )}
      {apiStatus === 'loading' && (
        <p className="mb-md font-body-sm text-body-sm text-[#636363]">{t('home.featuredDoctors.loading')}</p>
      )}
      {doctors.length > 0 ? (
        <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doctor, index) => (
            <DoctorCard doctor={doctor} key={doctor.id ? String(doctor.id) : `${doctor.name || 'doctor'}-${index}`} variant="hp" />
          ))}
        </div>
      ) : (
        apiStatus !== 'loading' && (
          <p className="rounded-[8px] border border-[#e8e8e8] bg-white p-lg text-center font-body-md text-body-md text-[#3d3d3d]">
            {t('home.featuredDoctors.empty')}
          </p>
        )
      )}
    </section>
  )
}

export default FeaturedDoctorsSection
