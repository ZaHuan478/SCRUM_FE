import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import TopNavBar from '../components/Organisms/TopNavBar'
import Icon from '../components/Atoms/Icon'
import Input from '../components/Atoms/Input'
import PaginationControls from '../components/Molecules/Common/PaginationControls'
import Select from '../components/Molecules/Common/Select'
import { useTranslation } from '../contexts/LanguageContext'
import { getDepartmentIconMeta } from '../constants/departmentIcons'
import { recommendDepartmentsBySymptoms } from '../services/departmentSymptomRule.service'
import { getDepartments } from '../services/department.service'
import type { Department, DepartmentsResult } from '../services/department.service'
import { getSymptoms } from '../services/symptom.service'
import type { Symptom } from '../services/symptom.service'
import { translateDepartmentDescription, translateDepartmentName } from '../utils/contentTranslation'

const DEPARTMENTS_PAGE_SIZE = 9
const FILTER_FETCH_LIMIT = 100
const filterSelectClassName = 'h-11 min-h-11 rounded-xl border-outline-variant/60 bg-surface/80 py-sm shadow-sm backdrop-blur hover:border-primary/40 hover:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10'

const emptyPagination: DepartmentsResult['pagination'] = {
  page: 1,
  limit: DEPARTMENTS_PAGE_SIZE,
  total: 0,
  total_pages: 1,
}

const loadActiveSymptoms = async () => {
  const firstPage = await getSymptoms({ limit: FILTER_FETCH_LIMIT, status: 'ACTIVE' })
  if (firstPage.pagination.total_pages <= 1) return firstPage.symptoms

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.pagination.total_pages - 1 }, (_, index) => (
      getSymptoms({ limit: FILTER_FETCH_LIMIT, page: index + 2, status: 'ACTIVE' })
    )),
  )

  return [
    ...firstPage.symptoms,
    ...remainingPages.flatMap((result) => result.symptoms),
  ]
}

const loadActiveDepartments = async (keyword: string) => {
  const firstPage = await getDepartments({
    keyword: keyword || undefined,
    limit: FILTER_FETCH_LIMIT,
    status: 'ACTIVE',
  })

  if (firstPage.pagination.total_pages <= 1) return firstPage.departments

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.pagination.total_pages - 1 }, (_, index) => (
      getDepartments({
        keyword: keyword || undefined,
        limit: FILTER_FETCH_LIMIT,
        page: index + 2,
        status: 'ACTIVE',
      })
    )),
  )

  return [
    ...firstPage.departments,
    ...remainingPages.flatMap((result) => result.departments),
  ]
}

const buildPagination = (total: number, page: number): DepartmentsResult['pagination'] => ({
  page,
  limit: DEPARTMENTS_PAGE_SIZE,
  total,
  total_pages: Math.max(Math.ceil(total / DEPARTMENTS_PAGE_SIZE), 1),
})

const DepartmentsPage = () => {
  const { language, t } = useTranslation()
  const [query, setQuery] = useState('')
  const [selectedSymptomId, setSelectedSymptomId] = useState('all')
  const [page, setPage] = useState(1)
  const [departments, setDepartments] = useState<Department[]>([])
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [pagination, setPagination] = useState<DepartmentsResult['pagination']>(emptyPagination)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true

    loadActiveSymptoms()
      .then((nextSymptoms) => {
        if (!active) return

        setSymptoms(nextSymptoms)
      })
      .catch(() => {
        if (!active) return

        setSymptoms([])
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true
    const normalizedQuery = query.trim()

    const timeoutId = window.setTimeout(() => {
      if (!active) return

      setStatus('loading')

      const request = selectedSymptomId === 'all'
        ? getDepartments({
          keyword: normalizedQuery || undefined,
          limit: DEPARTMENTS_PAGE_SIZE,
          page,
          status: 'ACTIVE',
        })
        : Promise.all([
          loadActiveDepartments(normalizedQuery),
          recommendDepartmentsBySymptoms([selectedSymptomId]),
        ]).then(([activeDepartments, recommendations]) => {
          const recommendationRank = new Map(
            recommendations.map((recommendation, index) => [String(recommendation.department_id), index]),
          )
          const filteredDepartments = activeDepartments
            .filter((department) => recommendationRank.has(String(department.id)))
            .sort((firstDepartment, secondDepartment) => (
              (recommendationRank.get(String(firstDepartment.id)) || 0)
              - (recommendationRank.get(String(secondDepartment.id)) || 0)
            ))
          const startIndex = (page - 1) * DEPARTMENTS_PAGE_SIZE

          return {
            departments: filteredDepartments.slice(startIndex, startIndex + DEPARTMENTS_PAGE_SIZE),
            pagination: buildPagination(filteredDepartments.length, page),
          }
        })

      request
        .then((result) => {
          if (!active) return

          setDepartments(result.departments)
          setPagination({
            page: result.pagination.page || page,
            limit: result.pagination.limit || DEPARTMENTS_PAGE_SIZE,
            total: result.pagination.total || result.departments.length,
            total_pages: Math.max(result.pagination.total_pages || 1, 1),
          })
          setStatus('ready')
        })
        .catch(() => {
          if (!active) return

          setDepartments([])
          setPagination({ ...emptyPagination, page })
          setStatus('error')
        })
    }, 0)

    return () => {
      active = false
      window.clearTimeout(timeoutId)
    }
  }, [page, query, selectedSymptomId])

  const totalPages = useMemo(() => (
    Math.max(pagination.total_pages, 1)
  ), [pagination.total_pages])

  const symptomOptions = useMemo(() => [
    { label: t('departmentsPage.allSymptoms'), value: 'all' },
    ...symptoms
      .map((symptom) => ({
        label: symptom.name,
        value: String(symptom.id),
      }))
      .sort((firstOption, secondOption) => firstOption.label.localeCompare(secondOption.label)),
  ], [symptoms, t])

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    setPage(1)
  }

  const handleSymptomChange = (nextSymptomId: string) => {
    setSelectedSymptomId(nextSymptomId)
    setPage(1)
  }

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="hp-home hp-soft-home min-h-screen text-on-background">
      <TopNavBar active="departments" variant="softHome" />
      <main className="mx-auto flex max-w-[1366px] flex-col gap-xxl px-lg pb-[72px] pt-[132px] md:px-xxl md:pb-[96px] md:pt-[152px]">
        <section className="relative z-30 rounded-[2rem] border border-white/70 bg-surface/78 p-lg shadow-[0_26px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl md:p-xl">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-sm font-label-sm text-label-sm uppercase tracking-[0.32em] text-on-surface-variant">
              <span className="h-1 w-10 rounded-full bg-primary" />
              {t('departmentsPage.eyebrow')}
            </p>
            <h1 className="mt-md font-headline-lg text-[42px] font-semibold uppercase leading-[0.92] text-on-background sm:text-[56px] md:text-[72px]">{t('departmentsPage.title')}</h1>
            <p className="mt-md max-w-2xl font-body-md text-body-md leading-7 text-on-surface-variant">
              {t('departmentsPage.description')}
            </p>
          </div>
          <div className="mt-lg grid gap-md md:grid-cols-2 lg:grid-cols-[minmax(240px,420px)_minmax(240px,320px)] md:items-end">
            <Input
              icon="search"
              label={t('departmentsPage.searchLabel')}
              onChange={handleQueryChange}
              placeholder={t('departmentsPage.searchPlaceholder')}
              type="search"
              value={query}
            />
            <Select
              className={filterSelectClassName}
              disabled={symptomOptions.length <= 1}
              label={t('departmentsPage.symptomLabel')}
              onChange={handleSymptomChange}
              options={symptomOptions}
              searchable
              searchPlaceholder={t('departmentsPage.symptomSearchPlaceholder')}
              emptySearchMessage={t('departmentsPage.noMatchingSymptoms')}
              value={selectedSymptomId}
            />
          </div>
        </section>

        {status === 'loading' && (
          <p className="rounded-2xl border border-outline-variant/45 bg-surface/78 p-md font-body-md text-body-md text-on-surface-variant shadow-sm backdrop-blur-xl">
            {t('departmentsPage.loading')}
          </p>
        )}

        {status === 'error' && (
          <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
            {t('departmentsPage.error')}
          </p>
        )}

        {status !== 'loading' && departments.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-outline-variant/55 bg-surface/78 p-xl text-center shadow-[0_20px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <Icon className="text-4xl text-outline" name="clinical_notes" />
            <p className="mt-sm font-label-md text-label-md text-on-surface">{t('departmentsPage.emptyTitle')}</p>
            <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
              {t('departmentsPage.emptyDescription')}
            </p>
          </div>
        )}

        {status === 'ready' && departments.length > 0 && (
          <>
            <section className="relative z-0 grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((department, index) => {
                const { Icon: DepartmentIcon, backgroundClassName, colorClassName, hoverClassName } = getDepartmentIconMeta(department.name)

                return (
                  <Link
                    className="group rounded-[2rem] border border-white/70 bg-surface/78 p-xl shadow-[0_24px_60px_rgba(15,23,42,0.10)] backdrop-blur-2xl transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_32px_78px_rgba(15,23,42,0.14)]"
                    key={department.id}
                    style={{ animationDelay: `${index * 60}ms` }}
                    to={`/departments/${department.id}`}
                  >
                    <div className={`mb-md flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-colors ${backgroundClassName} ${colorClassName} ${hoverClassName}`}>
                      <DepartmentIcon className="h-7 w-7" />
                    </div>

                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                      {translateDepartmentName(department.name, language)}
                    </h2>

                    <p className="mt-sm min-h-20 font-body-sm text-body-sm text-on-surface-variant">
                      {department.description
                        ? translateDepartmentDescription(department.description, language)
                        : t('departmentsPage.fallbackDescription')}
                    </p>

                    <span className="mt-lg inline-flex items-center gap-xs font-label-md text-label-md text-primary transition-all group-hover:gap-sm group-hover:underline">
                      {t('departmentsPage.viewDetails')} <Icon name="arrow_forward" />
                    </span>
                  </Link>
                )
              })}
            </section>
            <PaginationControls
              itemLabel={t('departmentsPage.itemLabel')}
              limit={pagination.limit}
              onPageChange={handlePageChange}
              page={pagination.page}
              totalItems={pagination.total}
              totalPages={totalPages}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default DepartmentsPage
