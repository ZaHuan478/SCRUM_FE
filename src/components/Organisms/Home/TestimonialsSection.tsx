import { useEffect, useState } from 'react'
import { getDoctorRatings } from '../../../api/doctorRating.api'
import type { DoctorRatingItem } from '../../../api/doctorRating.api'
import { getDoctors } from '../../../services/doctor.service'
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
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true

    getDoctors({ limit: 8, status: 'ACTIVE' })
      .then(async (doctorResult) => {
        const doctors = doctorResult.doctors
        const ratingResults = await Promise.allSettled(
          doctors.map((doctor) => getDoctorRatings(doctor.id, { limit: 3 }))
        )

        if (!active) return

        const nextTestimonials = ratingResults
          .flatMap((result, index) => {
            if (result.status !== 'fulfilled') return []

            const doctor = doctors[index]
            const doctorName = doctor.user?.full_name || doctor.license_number || 'bác sĩ'

            return result.value.ratings.filter(hasComment).map((rating) => ({
              id: `${doctor.id}-${rating.id}`,
              name: rating.patientName,
              meta: `Đánh giá cho ${doctorName}`,
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
  }, [])

  return (
    <section className="bg-surface-container px-lg py-xxxl md:px-xxl">
      <div className="mx-auto max-w-7xl">
        <div className="mb-xxl max-w-3xl">
          <Icon name="format_quote" className="mb-lg text-xxxl text-primary" />
          <h2 className="mb-md font-headline-lg text-headline-lg text-on-background">
            Đánh giá từ bệnh nhân
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Những chia sẻ sau khi tìm bác sĩ, đặt lịch và theo dõi tư vấn trên hệ thống.
          </p>
        </div>
        {status === 'loading' && (
          <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="h-64 animate-pulse rounded-xl bg-surface-container-lowest shadow-lg" key={index} />
            ))}
          </div>
        )}
        {status === 'error' && (
          <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
            Chưa tải được đánh giá từ backend.
          </p>
        )}
        {status === 'ready' && testimonials.length === 0 && (
          <p className="rounded-lg border border-outline-variant/30 bg-surface p-lg text-center font-body-md text-body-md text-on-surface-variant">
            Chưa có đánh giá bệnh nhân để hiển thị.
          </p>
        )}
        <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              className="testimonial-card-motion relative overflow-hidden rounded-xl bg-surface p-xl shadow-lg"
              key={testimonial.id}
              style={{ animationDelay: `${index * 180}ms, ${900 + index * 180}ms` }}
            >
              <div className="mb-lg flex items-center gap-md">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-fixed font-label-md text-label-md text-on-primary-fixed">
                  {getInitials(testimonial.name)}
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-on-background">{testimonial.name}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{testimonial.meta}</p>
                </div>
              </div>
              <p className="font-body-md text-body-md leading-relaxed text-on-surface">{testimonial.quote}</p>
              <div className="mt-lg flex gap-xs">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Icon className="text-tertiary" key={index} name="star" />
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
