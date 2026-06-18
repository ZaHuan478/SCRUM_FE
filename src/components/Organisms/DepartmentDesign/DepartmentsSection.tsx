import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DepartmentCard from '../../Molecules/Home/DepartmentCard'
import Icon from '../../Atoms/Icon'
import { useTranslation } from '../../../contexts/LanguageContext'
import { getDepartments } from '../../../services/department.service'
import type { Department } from '../../../services/department.service'
import { translateDepartmentName } from '../../../utils/contentTranslation'

const DEPARTMENTS_PER_SLIDE = 3
const AUTO_SLIDE_INTERVAL = 4500

const DepartmentsSection = () => {
  const { language, t } = useTranslation()
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
  const quickDepartmentPills = useMemo(() => departments.slice(0, 4), [departments])

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
    <section className="px-lg py-[64px] md:px-xxl md:py-[96px]" id="departments">
      <div className="mx-auto max-w-[1366px]">
        <div className="mb-xl grid gap-lg lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <span className="mb-sm inline-flex items-center gap-sm font-label-sm text-label-sm uppercase tracking-[0.35em] text-on-surface-variant">
              <span className="h-1 w-10 rounded-full bg-primary" />
              The care collection
            </span>
            <h2 className="max-w-3xl font-headline-lg text-[44px] font-semibold uppercase leading-[0.9] tracking-normal text-on-background sm:text-[60px] md:text-[76px]">
              {t('home.departments.title')}
              <span className="block text-primary">Nổi bật</span>
            </h2>
          </div>
          <Link
            className="inline-flex min-h-12 items-center justify-center gap-sm rounded-2xl border border-outline-variant/45 bg-surface/74 px-xl py-sm font-label-md text-label-md uppercase tracking-[0.12em] text-on-surface shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:text-primary"
            to="/departments"
          >
            <Icon name="filter_list" />
            {t('common.viewAll')}
          </Link>
        </div>

        <div className="mb-xl flex gap-md overflow-x-auto pb-sm">
          <button
            className="shrink-0 rounded-2xl bg-primary px-xl py-md font-label-md text-label-md uppercase tracking-[0.08em] text-on-primary shadow-[0_18px_36px_rgba(2,132,199,0.20)] transition-all hover:-translate-y-0.5 hover:bg-primary-container"
            onClick={() => setCurrentSlide(0)}
            type="button"
          >
            Tất cả chuyên khoa
          </button>
          {quickDepartmentPills.map((department, index) => (
            <button
              className="shrink-0 rounded-2xl border border-outline-variant/45 bg-surface/78 px-xl py-md font-label-md text-label-md uppercase tracking-[0.08em] text-on-surface-variant shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary-fixed/35 hover:text-primary"
              key={department.id}
              onClick={() => setCurrentSlide(Math.floor(index / DEPARTMENTS_PER_SLIDE))}
              type="button"
            >
              {translateDepartmentName(department.name, language)}
            </button>
          ))}
        </div>
        {status === 'loading' && (
          <p className="rounded-2xl border border-outline-variant/40 bg-surface/72 px-md py-sm text-center font-body-sm text-body-sm text-on-surface-variant shadow-sm backdrop-blur-xl">
            {t('home.departments.loading')}
          </p>
        )}
        {status === 'error' && (
          <p className="rounded-2xl border border-primary/20 bg-primary-fixed/35 px-md py-sm text-center font-body-sm text-body-sm text-primary">
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
                    <div className="grid grid-cols-1 gap-xl md:grid-cols-2 xl:grid-cols-3">
                      {slideDepartments.map((department, departmentIndex) => (
                        <DepartmentCard
                          description={department.description}
                          key={department.id}
                          label={department.name}
                          className="department-card-motion"
                          style={{ animationDelay: `${departmentIndex * 90}ms` }}
                          to={`/departments/${department.id}`}
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
                  className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/70 bg-surface/82 text-on-surface shadow-[0_18px_42px_rgba(15,23,42,0.14)] backdrop-blur-xl transition-all hover:-translate-y-[55%] hover:border-primary/40 hover:text-primary md:-left-6"
                  onClick={goToPreviousSlide}
                  type="button"
                >
                  <Icon className="text-3xl" name="chevron_left" />
                </button>
                <button
                  aria-label={t('home.departments.nextSlide')}
                  className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/70 bg-surface/82 text-on-surface shadow-[0_18px_42px_rgba(15,23,42,0.14)] backdrop-blur-xl transition-all hover:-translate-y-[55%] hover:border-primary/40 hover:text-primary md:-right-6"
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
