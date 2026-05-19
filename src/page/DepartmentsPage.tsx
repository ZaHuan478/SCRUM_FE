import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import TopNavBar from '../components/Organisms/TopNavBar'
import Icon from '../components/Atoms/Icon'
import Input from '../components/Atoms/Input'
import PaginationControls from '../components/Molecules/Common/PaginationControls'
import { getDepartments } from '../services/department.service'
import type { Department, DepartmentsResult } from '../services/department.service'

const DEPARTMENTS_PAGE_SIZE = 6

const tones = [
  'bg-primary-fixed/30 text-primary',
  'bg-secondary-fixed/30 text-secondary',
  'bg-tertiary-fixed/30 text-tertiary',
  'bg-surface-variant text-outline',
]

const emptyPagination: DepartmentsResult['pagination'] = {
  page: 1,
  limit: DEPARTMENTS_PAGE_SIZE,
  total: 0,
  total_pages: 1,
}

const DepartmentsPage = () => {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [departments, setDepartments] = useState<Department[]>([])
  const [pagination, setPagination] = useState<DepartmentsResult['pagination']>(emptyPagination)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true
    const normalizedQuery = query.trim()

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

    return () => {
      active = false
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
    <div className="min-h-screen  text-on-background">
      <TopNavBar active="departments" />
      <main className="mx-auto flex max-w-7xl flex-col gap-xxl px-lg py-xxl md:px-xxl">
        <section className="flex flex-col gap-lg border-b border-outline-variant/30 pb-xl">
          <div className="max-w-3xl">
            <p className="font-label-md text-label-md text-primary">Khoa chuyên môn</p>
            <h1 className="mt-sm font-headline-lg text-headline-lg text-on-background">Danh sách khoa</h1>
            <p className="mt-sm font-body-md text-body-md text-on-surface-variant">
              Xem toàn bộ khoa đang hoạt động và chọn bác sĩ phù hợp theo nhu cầu khám.
            </p>
          </div>

          <div className="grid gap-md md:grid-cols-[minmax(240px,420px)_auto] md:items-end">
            <Input
              icon="search"
              label="Tìm khoa"
              onChange={handleQueryChange}
              placeholder="Ví dụ: Tim mạch, Da liễu, Hô hấp..."
              type="search"
              value={query}
            />


          </div>
        </section>

        {status === 'loading' && (
          <p className="rounded-lg border border-outline-variant/30 bg-surface p-md font-body-md text-body-md text-on-surface-variant">
            Đang tải danh sách khoa...
          </p>
        )}

        {status === 'error' && (
          <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
            Không thể tải danh sách khoa.
          </p>
        )}

        {status !== 'loading' && departments.length === 0 && (
          <div className="rounded-lg border border-dashed border-outline-variant p-xl text-center">
            <Icon className="text-4xl text-outline" name="clinical_notes" />
            <p className="mt-sm font-label-md text-label-md text-on-surface">Không tìm thấy khoa phù hợp</p>
            <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
              Thử nhập từ khóa khác hoặc xóa nội dung tìm kiếm.
            </p>
          </div>
        )}

        {status === 'ready' && departments.length > 0 && (
          <>

            <section className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((department, index) => (
                <Link
                  className="group rounded-lg border border-outline-variant/30 bg-surface p-lg shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                  key={department.id}
                  to={`/departments/${department.id}`}
                >
                  <div className={`mb-md flex h-14 w-14 items-center justify-center rounded-full ${tones[index % tones.length]}`}>
                    <Icon className="text-3xl" name="clinical_notes" />
                  </div>

                  <h2 className="font-headline-sm text-headline-sm text-on-surface">
                    {department.name}
                  </h2>

                  <p className="mt-sm min-h-20 font-body-sm text-body-sm text-on-surface-variant">
                    {department.description || 'Khoa đang tiếp nhận lịch khám trong hệ thống.'}
                  </p>

                  <span className="mt-lg inline-flex items-center gap-xs font-label-md text-label-md text-primary transition-all group-hover:gap-sm group-hover:underline">
                    Xem chi tiết khoa <Icon name="arrow_forward" />
                  </span>
                </Link>
              ))}
            </section>
            <PaginationControls
              itemLabel="khoa"
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