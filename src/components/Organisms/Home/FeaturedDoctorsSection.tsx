import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DoctorCard from '../../Molecules/Home/DoctorCard'
import type { DoctorCardData } from '../../Molecules/Home/DoctorCard'
import Icon from '../../Atoms/Icon'
import { useTranslation } from '../../../contexts/LanguageContext'
import { getDoctors } from '../../../services/doctor.service'
import type { Doctor } from '../../../services/doctor.service'
import { translateDoctorDescription } from '../../../utils/contentTranslation'
import type { Language } from '../../../contexts/LanguageContext'

const specialtyFromDescription = (doctor: Doctor, language: Language) => {
  const description = translateDoctorDescription(doctor.description, language).trim()

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

const mapDoctor = (doctor: Doctor, language: Language): DoctorCardData => ({
  description: translateDoctorDescription(doctor.description, language),
  id: doctor.id,
  name: doctor.user?.full_name || '',
  specialty: specialtyFromDescription(doctor, language),
  experienceYears: doctor.experience_years,
  image: doctor.image_url || '',
  fee: formatFee(doctor.consultation_fee),
})

type FeaturedDoctorsSectionProps = {
  query: string
}

const FeaturedDoctorsSection = ({ query }: FeaturedDoctorsSectionProps) => {
  const { language, t } = useTranslation()
  const [doctors, setDoctors] = useState<DoctorCardData[]>([])
  const [apiStatus, setApiStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true
    const keyword = query.trim()

    setApiStatus('loading')

    getDoctors({
      limit: keyword ? 12 : 3,
      keyword: keyword || undefined,
      status: 'ACTIVE',
    })
      .then((result) => {
        if (!active) return

        setDoctors(result.doctors.map((doctor) => mapDoctor(doctor, language)))
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
  }, [language, query])

  return (
    <section className="mx-auto max-w-[1366px] px-lg py-[56px] md:px-xxl md:py-[88px]" id="featured-doctors">
      <div className="mb-xxl flex flex-col items-start justify-between gap-md md:flex-row md:items-end">
        <div className="max-w-2xl">
          <span className="mb-md inline-flex items-center gap-xs rounded-full border border-outline-variant/45 bg-surface/72 px-md py-xs font-label-sm text-label-sm uppercase text-primary shadow-sm backdrop-blur-xl">
            <Icon name="verified" />
            {t('home.hero.verified')}
          </span>
          <h2 className="font-headline-lg text-[32px] font-semibold leading-none tracking-normal text-on-background sm:text-[40px] md:text-[48px]">{t('home.featuredDoctors.title')}</h2>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-xs self-start rounded-2xl border border-outline-variant/45 bg-surface/72 px-xl py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-primary shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary-fixed/35"
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
        <p className="mb-md rounded-2xl border border-outline-variant/40 bg-surface/72 px-md py-sm font-body-sm text-body-sm text-on-surface-variant shadow-sm backdrop-blur-xl">{t('home.featuredDoctors.loading')}</p>
      )}
      {doctors.length > 0 ? (
        <div className="grid grid-cols-1 gap-xl md:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor, index) => (
            <DoctorCard doctor={doctor} key={doctor.id ? String(doctor.id) : `${doctor.name || 'doctor'}-${index}`} variant="hp" />
          ))}
        </div>
      ) : (
        apiStatus !== 'loading' && (
          <p className="rounded-lg border border-outline-variant bg-surface p-lg text-center font-body-md text-body-md text-on-surface-variant">
            {t('home.featuredDoctors.empty')}
          </p>
        )
      )}
    </section>
  )
}

export default FeaturedDoctorsSection
