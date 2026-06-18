import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../Atoms/Icon'
import Image from '../../Atoms/Image'
import SearchPanel from '../../Molecules/Home/SearchPanel'
import { useTranslation } from '../../../contexts/LanguageContext'
import { getDoctors } from '../../../services/doctor.service'
import type { Doctor } from '../../../services/doctor.service'

const fallbackDoctorImages = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
]

type HeroDoctorPhoto = {
  id: string
  image: string
  name: string
}

const fallbackDoctorPhotos: HeroDoctorPhoto[] = fallbackDoctorImages.map((image, index) => ({
  id: `fallback-${index}`,
  image,
  name: '',
}))

const getDoctorPhoto = (doctor: Doctor): HeroDoctorPhoto | null => {
  const image = doctor.image_url?.trim()
  if (!image) return null

  return {
    id: String(doctor.id),
    image,
    name: doctor.user?.full_name?.trim() || '',
  }
}

const getSequentialDoctorPhotos = (doctors: Doctor[]) => {
  const seenImages = new Set<string>()

  return doctors.reduce<HeroDoctorPhoto[]>((photos, doctor) => {
    const photo = getDoctorPhoto(doctor)
    if (!photo || seenImages.has(photo.image)) return photos

    seenImages.add(photo.image)
    photos.push(photo)
    return photos
  }, [])
}

type HeroSectionProps = {
  onSearch: (query: string) => void
}

const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const { t } = useTranslation()
  const [doctorPhotos, setDoctorPhotos] = useState<HeroDoctorPhoto[]>(fallbackDoctorPhotos)
  const [selectedDoctorIndex, setSelectedDoctorIndex] = useState(0)

  useEffect(() => {
    let active = true

    getDoctors({ limit: 100, status: 'ACTIVE' })
      .then((result) => {
        if (!active) return

        const backendPhotos = getSequentialDoctorPhotos(result.doctors)
        const nextPhotos = backendPhotos.length > 0 ? backendPhotos : fallbackDoctorPhotos

        setDoctorPhotos(nextPhotos)
        setSelectedDoctorIndex(0)
      })
      .catch(() => {
        if (!active) return

        setDoctorPhotos(fallbackDoctorPhotos)
        setSelectedDoctorIndex(0)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (doctorPhotos.length < 2) return undefined

    const timer = window.setInterval(() => {
      setSelectedDoctorIndex((currentIndex) => (currentIndex + 1) % doctorPhotos.length)
    }, 2800)

    return () => window.clearInterval(timer)
  }, [doctorPhotos.length])

  const animatedDoctorPhotos = useMemo(() => [...doctorPhotos, ...doctorPhotos], [doctorPhotos])
  const selectedDoctorPhoto = doctorPhotos[selectedDoctorIndex % doctorPhotos.length] || fallbackDoctorPhotos[0]

  return (
    <section className="hp-soft-hero relative overflow-hidden px-lg pb-[64px] pt-[132px] md:px-xxl md:pb-[88px] md:pt-[152px]">
      <div className="relative mx-auto flex max-w-[1366px] flex-col items-center text-center">
        <span className="mb-md inline-flex items-center gap-xs rounded-full border border-outline-variant/45 bg-surface/74 px-md py-xs font-label-sm text-label-sm uppercase text-on-surface-variant shadow-sm backdrop-blur-xl">
          <Icon className="text-primary" name="verified" />
          {t('home.hero.badge')}
        </span>

        <h1 className="max-w-4xl font-display-lg text-[42px] font-semibold leading-[0.96] tracking-normal text-on-background sm:text-[56px] md:text-[72px] lg:text-[88px]">
          {t('home.hero.titleStart')}
          <span className="block text-primary">{t('home.hero.titleHighlight')}</span>
        </h1>

        <p className="mt-lg max-w-2xl font-body-lg text-body-lg leading-[1.55] text-on-surface-variant">
          {t('home.hero.description')}
        </p>

        <div className="mt-xl w-full max-w-3xl">
          <SearchPanel onSearch={onSearch} />
        </div>

        <div className="mt-lg flex flex-col items-center justify-center gap-md sm:flex-row">
          <Link
            className="inline-flex min-h-12 items-center justify-center gap-sm rounded-2xl bg-primary px-xl py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-primary shadow-[0_18px_36px_rgba(2,132,199,0.22)] transition-all hover:-translate-y-0.5 hover:bg-primary-container"
            to="/appointments"
          >
            <Icon name="event_available" />
            {t('common.appointments')}
          </Link>
          <Link
            className="inline-flex min-h-12 items-center justify-center gap-sm rounded-2xl border border-outline-variant/45 bg-surface/72 px-xl py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-surface shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:text-primary"
            to="/departments"
          >
            <Icon name="clinical_notes" />
            {t('nav.departments')}
          </Link>
        </div>

        <div className="mt-xxl grid w-full max-w-xl grid-cols-3 divide-x divide-outline-variant/40 rounded-2xl border border-white/60 bg-surface/58 px-md py-md shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          {[
            { value: '24/7', label: t('common.appointments') },
            { value: 'AI', label: t('nav.symptoms') },
            { value: '1K+', label: t('common.doctors') },
          ].map((item) => (
            <div className="px-sm" key={item.value}>
              <p className="font-headline-sm text-headline-sm text-primary">{item.value}</p>
              <p className="mt-xs truncate font-label-sm text-label-sm uppercase text-on-surface-variant">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-xxl grid w-full gap-lg lg:grid-cols-[minmax(300px,380px)_minmax(340px,500px)_minmax(0,1fr)] lg:items-end">
          <div className="hidden justify-self-end rounded-2xl border border-white/60 bg-surface/64 p-sm shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl lg:block">
            <div className="relative h-40 w-80 overflow-hidden rounded-xl bg-surface-container-low xl:h-44 xl:w-[352px]">
              <Image
                alt={selectedDoctorPhoto.name || t('home.hero.imageAlt')}
                className="hero-featured-doctor-image h-full w-full object-contain"
                fallbackClassName="h-full w-full"
                key={selectedDoctorPhoto.id}
                src={selectedDoctorPhoto.image}
              />
            </div>
          </div>

          <div className="w-full max-w-[500px] justify-self-center rounded-3xl border border-white/65 bg-surface/72 p-md shadow-[0_22px_60px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
            <div className="flex items-center justify-center gap-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-on-background text-inverse-on-surface shadow-[0_14px_28px_rgba(15,23,42,0.18)]">
                <Icon name="verified" />
              </div>
              <div className="min-w-0 text-left">
                <p className="font-label-md text-label-md text-on-surface">{t('home.hero.verified')}</p>
                <div className="mt-sm w-[min(62vw,400px)] overflow-hidden sm:w-[360px] lg:w-[400px]">
                  <div className="hero-doctor-rail flex w-max items-center gap-sm">
                    {animatedDoctorPhotos.map((photo, index) => (
                      <Image
                        alt={photo.name || t('home.hero.doctorImageAlt')}
                        className="h-12 w-12 shrink-0 rounded-xl border border-white/70 object-cover shadow-sm"
                        fallbackClassName="h-12 w-12 shrink-0 rounded-xl border border-white/70"
                        key={`${photo.id}-${index}`}
                        src={photo.image}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden justify-self-start rounded-2xl border border-white/60 bg-surface/64 p-md text-left shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl lg:block">
            <p className="font-label-sm text-label-sm uppercase text-on-surface-variant">{t('nav.symptoms')}</p>
            <p className="mt-xs max-w-52 font-body-sm text-body-sm text-on-surface">{t('home.hero.description')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
