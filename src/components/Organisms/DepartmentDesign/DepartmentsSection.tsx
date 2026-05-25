import { useCallback, useEffect, useMemo, useState } from 'react'
import DepartmentCard from '../../Molecules/Home/DepartmentCard'
import Icon from '../../Atoms/Icon'
import { useTranslation } from '../../../contexts/LanguageContext'
import { getDepartments } from '../../../services/department.service'
import type { Department } from '../../../services/department.service'

const DEPARTMENTS_PER_SLIDE = 4
const AUTO_SLIDE_INTERVAL = 4500

const tones: Array<'primary' | 'secondary' | 'tertiary' | 'neutral'> = ['primary', 'secondary', 'tertiary', 'neutral']

const DepartmentsSection = () => {
  const { t } = useTranslation()
  const [departments, setDepartments] = useState<Department[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isCarouselPaused, setIsCarouselPaused] = useState(false)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true

    getDepartments({ limit: 16, status: 'ACTIVE' })
      .then((result) => {
        if (!active) return
        setDepartments(result.departments)
        setStatus('ready')
      })
      .catch(() => {
        if (!active) return
        setDepartments([])
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  const departmentSlides = useMemo(() => {
    const slides: Department[][] = []

    for (let index = 0; index < departments.length; index += DEPARTMENTS_PER_SLIDE) {
      slides.push(departments.slice(index, index + DEPARTMENTS_PER_SLIDE))
    }

    return slides
  }, [departments])

  const slideCount = departmentSlides.length
  const activeSlide = slideCount > 0 && currentSlide < slideCount ? currentSlide : 0
  const hasMultipleSlides = slideCount > 1

  const goToPreviousSlide = useCallback(() => {
    if (slideCount === 0) return

    setCurrentSlide((previousSlide) => {
      const safePreviousSlide = previousSlide < slideCount ? previousSlide : 0
      return safePreviousSlide === 0 ? slideCount - 1 : safePreviousSlide - 1
    })
  }, [slideCount])

  const goToNextSlide = useCallback(() => {
    if (slideCount === 0) return

    setCurrentSlide((previousSlide) => {
      const safePreviousSlide = previousSlide < slideCount ? previousSlide : 0
      return safePreviousSlide === slideCount - 1 ? 0 : safePreviousSlide + 1
    })
  }, [slideCount])

  useEffect(() => {
    if (!hasMultipleSlides || isCarouselPaused) return undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return undefined

    const intervalId = window.setInterval(goToNextSlide, AUTO_SLIDE_INTERVAL)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [goToNextSlide, hasMultipleSlides, isCarouselPaused])

  if (status === 'ready' && departments.length === 0) return null

  return (
    <section className="bg-surface-container-low px-lg py-[56px] md:px-xxl md:py-[80px]" id="departments">
      <div className="mx-auto max-w-[1366px]">
        <div className="mb-xxl text-center">
          <h2 className="mb-sm font-headline-lg text-[32px] font-medium leading-none tracking-normal text-on-background sm:text-[40px] md:text-[44px]">{t('home.departments.title')}</h2>
          <p className="mx-auto max-w-2xl font-body-md text-body-md text-on-surface-variant">
            {t('home.departments.description')}
          </p>
        </div>
        {status === 'loading' && (
          <p className="rounded-lg border border-outline-variant bg-surface px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
            {t('home.departments.loading')}
          </p>
        )}
        {status === 'error' && (
          <p className="rounded-[8px] bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
            {t('home.departments.backendError')}
          </p>
        )}
        {departmentSlides.length > 0 && (
          <div
            className="relative"
            onBlur={(event) => {
              if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
              setIsCarouselPaused(false)
            }}
            onFocus={() => setIsCarouselPaused(true)}
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
          >
            <div className="overflow-hidden">
              <div
                className="department-carousel-track flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {departmentSlides.map((slideDepartments, slideIndex) => (
                  <div className="min-w-full px-1" key={`department-slide-${slideIndex}`}>
                    <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4">
                      {slideDepartments.map((department, departmentIndex) => (
                        <DepartmentCard
                          description={department.description}
                          icon="clinical_notes"
                          key={department.id}
                          label={department.name}
                          className="department-card-motion"
                          style={{ animationDelay: `${departmentIndex * 90}ms` }}
                          to={`/departments/${department.id}`}
                          tone={tones[(slideIndex * DEPARTMENTS_PER_SLIDE + departmentIndex) % tones.length]}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {hasMultipleSlides && (
              <>
                <button
                  aria-label={t('home.departments.previousSlide')}
                  className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded border border-outline-variant bg-surface text-on-surface shadow-[0_2px_8px_rgba(26,26,26,0.08)] transition-colors hover:border-primary hover:text-primary md:-left-5"
                  onClick={goToPreviousSlide}
                  type="button"
                >
                  <Icon className="text-3xl" name="chevron_left" />
                </button>
                <button
                  aria-label={t('home.departments.nextSlide')}
                  className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded border border-outline-variant bg-surface text-on-surface shadow-[0_2px_8px_rgba(26,26,26,0.08)] transition-colors hover:border-primary hover:text-primary md:-right-5"
                  onClick={goToNextSlide}
                  type="button"
                >
                  <Icon className="text-3xl" name="chevron_right" />
                </button>
              </>
            )}
          </div>
        )}

        {hasMultipleSlides && (
          <div className="mt-xl flex justify-center gap-sm">
            {departmentSlides.map((_, slideIndex) => (
              <button
                aria-label={t('home.departments.goToSlide', { number: slideIndex + 1 })}
                className={`h-2.5 rounded-full transition-all ${
                  slideIndex === activeSlide
                    ? 'w-8 bg-primary'
                    : 'w-2.5 border border-outline-variant bg-surface hover:bg-primary-fixed'
                }`}
                key={`department-dot-${slideIndex}`}
                onClick={() => setCurrentSlide(slideIndex)}
                type="button"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default DepartmentsSection
