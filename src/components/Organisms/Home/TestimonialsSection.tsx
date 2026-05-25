import { useEffect, useState } from 'react'
import { getDoctorRatings } from '../../../api/doctorRating.api'
import type { DoctorRatingItem } from '../../../api/doctorRating.api'
import { getDoctors } from '../../../services/doctor.service'
import { useTranslation } from '../../../contexts/LanguageContext'
import Icon from '../../Atoms/Icon'

type TestimonialData = {
  id: number | string
  name: string
  meta: string
  quote: string
  rating: number
  createdAt: string
}

const getInitials = (name: string) => name
  .split(' ')
  .filter(Boolean)
  .slice(-2)
  .map((part) => part[0])
  .join('')
  .toUpperCase()

const hasComment = (rating: DoctorRatingItem) => Boolean(rating.comment?.trim())

const TestimonialsSection = () => {
  const { t } = useTranslation()
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true

    getDoctors({ limit: 8, status: 'ACTIVE' })
      .then(async (doctorResult) => {
        const doctors = doctorResult.doctors
        const ratingResults = await Promise.allSettled(
          doctors.map((doctor) => getDoctorRatings(doctor.id, { limit: 3 })),
        )

        if (!active) return

        const nextTestimonials = ratingResults
          .flatMap((result, index) => {
            if (result.status !== 'fulfilled') return []

            const doctor = doctors[index]
            const doctorName = doctor.user?.full_name || doctor.license_number || t('home.testimonials.fallbackDoctor')

            return result.value.ratings.filter(hasComment).map((rating) => ({
              id: `${doctor.id}-${rating.id}`,
              name: rating.patientName,
              meta: t('home.testimonials.meta', { doctorName }),
              quote: rating.comment?.trim() || '',
              rating: rating.rating,
              createdAt: rating.createdAt,
            }))
          })
          .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
          .slice(0, 3)

        setTestimonials(nextTestimonials)
        setStatus('ready')
      })
      .catch(() => {
        if (!active) return

        setTestimonials([])
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [t])

  return (
    <section className="bg-surface px-lg py-[56px] md:px-xxl md:py-[80px]">
      <div className="mx-auto max-w-[1366px]">
        <div className="mb-xxl max-w-3xl">
          <Icon name="format_quote" className="mb-lg text-[40px] text-primary md:text-[44px]" />
          <h2 className="mb-md font-headline-lg text-[32px] font-medium leading-none tracking-normal text-on-background sm:text-[40px] md:text-[44px]">
            {t('home.testimonials.title')}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {t('home.testimonials.description')}
          </p>
        </div>
        {status === 'loading' && (
          <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="h-64 animate-pulse rounded-xl bg-surface/10" key={index} />
            ))}
          </div>
        )}
        {status === 'error' && (
          <p className="rounded-[8px] bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
            {t('home.testimonials.backendError')}
          </p>
        )}
        {status === 'ready' && testimonials.length === 0 && (
          <p className="rounded-lg border border-outline-variant bg-surface p-lg text-center font-body-md text-body-md text-on-surface-variant">
            {t('home.testimonials.empty')}
          </p>
        )}
        <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              className="testimonial-card-motion relative overflow-hidden rounded-xl bg-surface p-xl shadow-[0_2px_8px_rgba(26,26,26,0.08)]"
              key={testimonial.id}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="mb-lg flex items-center gap-md">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-on-background font-label-md text-label-md text-inverse-on-surface">
                  {getInitials(testimonial.name)}
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface">{testimonial.name}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{testimonial.meta}</p>
                </div>
              </div>
              <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">{testimonial.quote}</p>
              <div className="mt-lg flex gap-xs">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Icon className="text-primary" key={index} name="star" />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
