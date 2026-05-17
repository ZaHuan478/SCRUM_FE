import Icon from '../../Atoms/Icon'
import Image from '../../Atoms/Image'

type TestimonialData = {
  name: string
  meta: string
  quote: string
  image?: string
  rating?: number
}

const testimonials: TestimonialData[] = []

const TestimonialsSection = () => {
  const testimonial = testimonials[0]

  if (!testimonial) return null

  return (
    <section className="bg-surface-container px-lg py-xxxl md:px-xxl">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-xxl md:grid-cols-2">
        <div>
          <Icon name="format_quote" className="mb-lg text-xxxl text-primary" />
          <h2 className="mb-lg max-w-xl font-display-lg text-4xl font-bold leading-tight text-on-background md:text-display-lg">
            Ý kiến khách hàng về chúng tôi.
          </h2>
        </div>
        <article className="relative overflow-hidden rounded-xl bg-surface p-xxl shadow-xl">
          <div className="mb-lg flex items-center gap-md">
            {testimonial.image && <Image alt={testimonial.name} className="h-16 w-16 rounded-full object-cover" src={testimonial.image} />}
            <div>
              <h4 className="font-label-md text-label-md text-on-background">{testimonial.name}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{testimonial.meta}</p>
            </div>
          </div>
          <p className="font-body-lg text-body-lg italic leading-relaxed text-on-surface">{testimonial.quote}</p>
          {testimonial.rating && (
            <div className="mt-lg flex gap-xs">
              {Array.from({ length: testimonial.rating }).map((_, index) => (
                <Icon className="text-tertiary" key={index} name="star" />
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  )
}

export default TestimonialsSection
