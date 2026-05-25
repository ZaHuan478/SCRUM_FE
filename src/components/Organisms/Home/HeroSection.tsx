import { useEffect, useMemo, useState } from 'react'
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

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5)

const getDoctorImage = (doctor: Doctor) => doctor.image_url?.trim() || ''

type HeroSectionProps = {
  onSearch: (query: string) => void
}

const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const { t } = useTranslation()
  const [doctorImages, setDoctorImages] = useState<string[]>(() => shuffle(fallbackDoctorImages).slice(0, 4))

  useEffect(() => {
    let active = true

    getDoctors({ limit: 12, status: 'ACTIVE' })
      .then((result) => {
        if (!active) return

        const backendImages = result.doctors.map(getDoctorImage).filter(Boolean)
        const nextImages = shuffle(backendImages.length > 0 ? backendImages : fallbackDoctorImages).slice(0, 5)

        setDoctorImages(nextImages)
      })
      .catch(() => {
        if (!active) return

        setDoctorImages(shuffle(fallbackDoctorImages).slice(0, 4))
      })

    return () => {
      active = false
    }
  }, [])

  const animatedDoctorImages = useMemo(() => [...doctorImages, ...doctorImages], [doctorImages])
  const heroImage = doctorImages[0] || ''

  return (
    <section className="relative overflow-hidden bg-background px-lg py-[48px] md:px-xxl md:py-[80px]">
      <div className="relative mx-auto max-w-[1366px]">
        {/* <div aria-hidden="true" className="absolute -left-8 top-12 hidden h-[calc(100%-96px)] w-16 -skew-x-[28deg] bg-[#024ad8] md:block" />
        <div aria-hidden="true" className="absolute -right-8 top-12 hidden h-[calc(100%-96px)] w-16 -skew-x-[28deg] bg-[#024ad8] md:block" /> */}
        <div className="relative grid overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-[0_2px_8px_rgba(26,26,26,0.08)] md:grid-cols-2">
          <div className="relative min-h-[300px] bg-surface-container-low sm:min-h-[360px] md:min-h-[520px]">
            <Image
              alt={t('home.hero.imageAlt')}
              className="absolute inset-0 h-full w-full object-cover"
              fallbackClassName="absolute inset-0 h-full w-full"
              src={heroImage}
            />
            <div className="absolute bottom-md left-md right-md rounded-xl border border-outline-variant bg-surface/95 p-md shadow-[0_2px_8px_rgba(26,26,26,0.08)] backdrop-blur-sm">
              <div className="flex items-center gap-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-on-background text-inverse-on-surface">
                  <Icon name="verified" />
                </div>
                <div className="min-w-0">
                  <p className="font-label-md text-label-md text-on-surface">{t('home.hero.verified')}</p>
                  <div className="mt-sm w-48 overflow-hidden sm:w-64">
                    <div className="hero-doctor-rail flex w-max items-center gap-sm">
                      {animatedDoctorImages.map((image, index) => (
                        <Image
                          alt={t('home.hero.doctorImageAlt')}
                          className="h-10 w-10 shrink-0 rounded border border-outline-variant object-cover"
                          fallbackClassName="h-10 w-10 shrink-0 rounded border border-outline-variant"
                          key={`${image}-${index}`}
                          src={image}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center p-lg sm:p-xl md:p-[64px]">
            <span className="mb-md inline-flex w-fit rounded-lg border border-on-surface bg-surface px-md py-xs font-label-md text-label-md text-on-surface">
              {t('home.hero.badge')}
            </span>
            <h1 className="mb-lg max-w-3xl font-display-lg text-[36px] font-medium leading-none tracking-normal text-on-background sm:text-[44px] md:text-[64px] lg:text-[72px]">
              {t('home.hero.titleStart')} <span>{t('home.hero.titleHighlight')}</span>
            </h1>
            <p className="mb-xxl max-w-xl font-body-lg text-body-lg leading-[1.33] text-on-surface-variant">
              {t('home.hero.description')}
            </p>
            <SearchPanel onSearch={onSearch} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
