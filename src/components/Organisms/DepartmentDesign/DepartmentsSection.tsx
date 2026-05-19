import { useEffect, useMemo, useState } from 'react'
import DepartmentCard from '../../Molecules/Home/DepartmentCard'
import Icon from '../../Atoms/Icon'
import { getDepartments } from '../../../services/department.service'
import type { Department } from '../../../services/department.service'

const DEPARTMENTS_PER_SLIDE = 4

const tones: Array<'primary' | 'secondary' | 'tertiary' | 'neutral'> = ['primary', 'secondary', 'tertiary', 'neutral']

const DepartmentsSection = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
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

  const goToPreviousSlide = () => {
    if (slideCount === 0) return

    setCurrentSlide((previousSlide) => {
      const safePreviousSlide = previousSlide < slideCount ? previousSlide : 0
      return safePreviousSlide === 0 ? slideCount - 1 : safePreviousSlide - 1
    })
  }

  const goToNextSlide = () => {
    if (slideCount === 0) return

    setCurrentSlide((previousSlide) => {
      const safePreviousSlide = previousSlide < slideCount ? previousSlide : 0
      return safePreviousSlide === slideCount - 1 ? 0 : safePreviousSlide + 1
    })
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex)
  }

  if (status === 'ready' && departments.length === 0) return null

  return (
    <section className="bg-surface-container-low px-lg py-xxxl md:px-xxl" id="departments">
      <div className="mx-auto max-w-7xl">
        <div className="mb-xxl text-center">
          <h2 className="mb-sm font-headline-lg text-headline-lg text-on-background">Khoa chuyên môn</h2>
          <p className="mx-auto max-w-2xl font-body-md text-body-md text-on-surface-variant">
            Danh mục khoa đang hoạt động trong hệ thống.
          </p>
        </div>
        {status === 'loading' && (
          <p className="rounded-lg border border-outline-variant/30 bg-surface px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
            Đang tải danh sách khoa...
          </p>
        )}
        {status === 'error' && (
          <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
            Chưa kết nối được backend nên chưa có dữ liệu khoa để hiển thị.
          </p>
        )}
        {departmentSlides.length > 0 && (
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <div
                className="flex transition-transform duration-500 ease-out"
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
                  aria-label="Xem slide khoa trước"
                  className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-outline-variant/40 bg-surface/95 text-on-surface shadow-md transition-all hover:border-primary/50 hover:text-primary hover:shadow-lg md:-left-5"
                  onClick={goToPreviousSlide}
                  type="button"
                >
                  <Icon name="chevron_left" className="text-3xl" />
                </button>
                <button
                  aria-label="Xem slide khoa tiếp theo"
                  className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-outline-variant/40 bg-surface/95 text-on-surface shadow-md transition-all hover:border-primary/50 hover:text-primary hover:shadow-lg md:-right-5"
                  onClick={goToNextSlide}
                  type="button"
                >
                  <Icon name="chevron_right" className="text-3xl" />
                </button>
              </>
            )}
          </div>
        )}

        {hasMultipleSlides && (
          <div className="mt-xl flex justify-center gap-sm">
            {departmentSlides.map((_, slideIndex) => (
              <button
                aria-label={`Đi tới slide khoa ${slideIndex + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  slideIndex === activeSlide
                    ? 'w-8 bg-primary'
                    : 'w-2.5 border border-outline-variant bg-surface-variant hover:bg-primary/30'
                }`}
                key={`department-dot-${slideIndex}`}
                onClick={() => goToSlide(slideIndex)}
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
