import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import TopNavBar from '../components/Organisms/TopNavBar'
import Icon from '../components/Atoms/Icon'
import Input from '../components/Atoms/Input'
import DepartmentCard from '../components/Molecules/Home/DepartmentCard'
import PaginationControls from '../components/Molecules/Common/PaginationControls'
import { useTranslation } from '../contexts/LanguageContext'
import { getDepartments } from '../services/department.service'
import type { Department, DepartmentsResult } from '../services/department.service'

const DEPARTMENTS_PAGE_SIZE = 9

const emptyPagination: DepartmentsResult['pagination'] = {
  page: 1,
  limit: DEPARTMENTS_PAGE_SIZE,
  total: 0,
  total_pages: 1,
}

const DepartmentsPage = () => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [departments, setDepartments] = useState<Department[]>([])
  const [pagination, setPagination] = useState<DepartmentsResult['pagination']>(emptyPagination)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true
    const normalizedQuery = query.trim()

    const timeoutId = window.setTimeout(() => {
      if (!active) return

      setStatus('loading')

      getDepartments({
        keyword: normalizedQuery || undefined,
        limit: DEPARTMENTS_PAGE_SIZE,
        page,
        status: 'ACTIVE',
      })
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
  }, [page, query])

  const totalPages = useMemo(() => (
    Math.max(pagination.total_pages, 1)
  ), [pagination.total_pages])

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    setPage(1)
  }

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen text-on-background">
      <TopNavBar active="departments" />
      <main className="mx-auto flex max-w-7xl flex-col gap-xxl px-lg py-xxl md:px-xxl">
        <section className="flex flex-col gap-lg border-b border-outline-variant/30 pb-xl">
          <div className="max-w-3xl">
            <p className="font-label-md text-label-md text-primary">{t('departmentsPage.eyebrow')}</p>
            <h1 className="mt-sm font-headline-lg text-headline-lg text-on-background">{t('departmentsPage.title')}</h1>
            <p className="mt-sm font-body-md text-body-md text-on-surface-variant">
              {t('departmentsPage.description')}
            </p>
          </div>
          <div className="grid gap-md md:grid-cols-[minmax(240px,420px)_auto] md:items-end">
            <Input
              icon="search"
              label={t('departmentsPage.searchLabel')}
              onChange={handleQueryChange}
              placeholder={t('departmentsPage.searchPlaceholder')}
              type="search"
              value={query}
            />
          </div>
        </section>

        {status === 'loading' && (
          <p className="rounded-lg border border-outline-variant/30 bg-surface p-md font-body-md text-body-md text-on-surface-variant">
            {t('departmentsPage.loading')}
          </p>
        )}

        {status === 'error' && (
          <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
            {t('departmentsPage.error')}
          </p>
        )}

        {status !== 'loading' && departments.length === 0 && (
          <div className="rounded-lg border border-dashed border-outline-variant p-xl text-center">
            <Icon className="text-4xl text-outline" name="clinical_notes" />
            <p className="mt-sm font-label-md text-label-md text-on-surface">{t('departmentsPage.emptyTitle')}</p>
            <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
              {t('departmentsPage.emptyDescription')}
            </p>
          </div>
        )}

        {status === 'ready' && departments.length > 0 && (
          <>
            <section className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((department, index) => (
                <DepartmentCard
                  description={department.description || t('departmentsPage.fallbackDescription')}
                  key={department.id}
                  label={department.name}
                  style={{ animationDelay: `${index * 60}ms` }}
                  to={`/departments/${department.id}`}
                />
              ))}
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
