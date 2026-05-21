import { useEffect, useMemo, useState } from 'react'
import Badge from '../../Atoms/Badge'
import Icon from '../../Atoms/Icon'
import Image from '../../Atoms/Image'
import SearchPanel from '../../Molecules/Home/SearchPanel'
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
    <section className="mx-auto max-w-7xl overflow-hidden px-lg pb-xxxl pt-xxxl md:px-xxl">
      <div className="grid grid-cols-1 items-center gap-xxl md:grid-cols-12">
        <div className="z-10 md:col-span-7">
          <Badge className="mb-md">Y khoa chính xác và tin cậy</Badge>
          <h1 className="mb-lg max-w-3xl font-display-lg text-4xl font-bold leading-tight text-on-background md:text-display-lg">
            Tìm đúng bác sĩ, <span className="text-primary">đúng lúc.</span>
          </h1>
          <p className="mb-xxl max-w-xl font-body-lg text-body-lg text-on-surface-variant">
            Kết nối với chuyên gia phù hợp dựa trên triệu chứng, chuyên khoa và nhu cầu thăm khám cụ thể của bạn.
          </p>
          <SearchPanel onSearch={onSearch} />
        </div>
        <div className="relative md:col-span-5">
          <div className="relative overflow-hidden rounded-xl bg-surface-variant shadow-2xl">
            <Image
              alt="Bác sĩ chuyên nghiệp tại MedPrecision"
              className="aspect-[4/5] h-auto w-full object-cover"
              fallbackClassName="aspect-[4/5] w-full"
              src={heroImage}
            />
            <div className="absolute bottom-md left-md right-md rounded-xl border border-outline-variant/20 bg-surface/90 p-md shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container">
                  <Icon name="verified" className="text-on-secondary-container" />
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">Chuyên gia đã xác thực</p>
                  <div className="mt-sm w-48 overflow-hidden sm:w-64">
                    <div className="hero-doctor-rail flex w-max items-center gap-sm">
                      {animatedDoctorImages.map((image, index) => (
                        <Image
                          alt="Ảnh bác sĩ"
                          className="h-10 w-10 shrink-0 rounded-full border-2 border-surface object-cover shadow-sm"
                          fallbackClassName="h-10 w-10 shrink-0 rounded-full border-2 border-surface"
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
        </div>
      </div>
    </section>
  )
}

export default HeroSection
