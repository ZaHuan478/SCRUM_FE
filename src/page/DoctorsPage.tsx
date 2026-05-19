import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import TopNavBar from '../components/Organisms/TopNavBar'
import DoctorCard from '../components/Molecules/Home/DoctorCard'
import type { DoctorCardData } from '../components/Molecules/Home/DoctorCard'
import Icon from '../components/Atoms/Icon'
import Input from '../components/Atoms/Input'
import PaginationControls from '../components/Molecules/Common/PaginationControls'
import { getDoctorAssignments } from '../services/doctorAssignment.service'
import type { DoctorAssignment } from '../services/doctorAssignment.service'
import type { Doctor } from '../services/doctor.service'
import { recommendDepartmentsBySymptoms } from '../services/departmentSymptomRule.service'
import { getSymptoms } from '../services/symptom.service'
import type { Symptom } from '../services/symptom.service'
import { findMatchingSymptoms } from '../utils/patientAppointments'

type DoctorDirectoryItem = DoctorCardData & {
  departmentId?: number | string
  departmentName: string
  feeValue?: number
  licenseNumber?: string
}

const DOCTORS_PER_PAGE = 4

const formatFee = (fee?: string | number | null) => {
  if (fee === undefined || fee === null || fee === '') return undefined

  const amount = Number(fee)
  if (Number.isNaN(amount)) return String(fee)

  return new Intl.NumberFormat('vi-VN', {
    currency: 'VND',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(amount)
}

const normalizeSearchText = (value: string) => (
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
)

const loadActiveSymptoms = async () => {
  const firstPage = await getSymptoms({ limit: 100, status: 'ACTIVE' })
  if (firstPage.pagination.total_pages <= 1) return firstPage.symptoms

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.pagination.total_pages - 1 }, (_, index) => (
      getSymptoms({ limit: 100, page: index + 2, status: 'ACTIVE' })
    ))
  )

  return [
    ...firstPage.symptoms,
    ...remainingPages.flatMap((result) => result.symptoms),
  ]
}

const mapAssignment = (assignment: DoctorAssignment): DoctorDirectoryItem | null => {
  const doctor = assignment.doctor as Doctor | undefined
  if (!doctor) return null

  return {
    departmentId: assignment.department_id,
    departmentName: assignment.department?.name || 'Chưa phân khoa',
    description: doctor.description,
    email: doctor.user?.email,
    experienceYears: doctor.experience_years,
    fee: formatFee(doctor.consultation_fee),
    feeValue: doctor.consultation_fee === undefined || doctor.consultation_fee === null
      ? undefined
      : Number(doctor.consultation_fee),
    id: doctor.id,
    image: doctor.image_url || '',
    licenseNumber: doctor.license_number,
    name: doctor.user?.full_name || doctor.license_number,
    phone: doctor.user?.phone,
    specialty: assignment.department?.name || '',
  }
}

const experienceOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Từ 5 năm', value: '5' },
  { label: 'Từ 10 năm', value: '10' },
  { label: 'Từ 15 năm', value: '15' },
]

const feeOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Dưới 300.000đ', value: 'under-300000' },
  { label: '300.000đ - 350.000đ', value: '300000-350000' },
  { label: 'Trên 350.000đ', value: 'over-350000' },
]

const matchesFeeFilter = (doctor: DoctorDirectoryItem, feeFilter: string) => {
  if (feeFilter === 'all') return true
  const fee = doctor.feeValue
  if (fee === undefined || Number.isNaN(fee)) return false

  if (feeFilter === 'under-300000') return fee < 300000
  if (feeFilter === '300000-350000') return fee >= 300000 && fee <= 350000
  if (feeFilter === 'over-350000') return fee > 350000

  return true
}

const DoctorsPage = () => {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [doctors, setDoctors] = useState<DoctorDirectoryItem[]>([])
  const [recommendedDepartmentIds, setRecommendedDepartmentIds] = useState<Set<string>>(new Set())
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(searchParams.get('department_id') || 'all')
  const [selectedExperience, setSelectedExperience] = useState('all')
  const [selectedFee, setSelectedFee] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true

    Promise.all([
      getDoctorAssignments({ limit: 100, status: 'ACTIVE' }),
      loadActiveSymptoms(),
    ])
      .then(([assignmentResult, nextSymptoms]) => {
        if (!active) return

        setDoctors(assignmentResult.doctor_assignments
          .map(mapAssignment)
          .filter((doctor): doctor is DoctorDirectoryItem => Boolean(doctor)))
        setSymptoms(nextSymptoms)
        setStatus('ready')
      })
      .catch(() => {
        if (!active) return

        setDoctors([])
        setSymptoms([])
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  const matchedSymptoms = useMemo(() => (
    findMatchingSymptoms(query, symptoms).slice(0, 8)
  ), [query, symptoms])

  useEffect(() => {
    let active = true
    const timeoutId = window.setTimeout(() => {
      if (!active) return

      if (matchedSymptoms.length === 0) {
        setRecommendedDepartmentIds(new Set())
        return
      }

      recommendDepartmentsBySymptoms(matchedSymptoms.map((symptom) => symptom.id))
        .then((recommendations) => {
          if (!active) return

          setRecommendedDepartmentIds(new Set(
            recommendations.map((recommendation) => String(recommendation.department_id))
          ))
        })
        .catch(() => {
          if (!active) return
          setRecommendedDepartmentIds(new Set())
        })
    }, 250)

    return () => {
      active = false
      window.clearTimeout(timeoutId)
    }
  }, [matchedSymptoms])

  const visibleDoctors = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query.trim())
    const hasRecommendedDepartments = recommendedDepartmentIds.size > 0

    return doctors.filter((doctor) => {
      const selectedDepartmentMatches = selectedDepartmentId === 'all'
        || String(doctor.departmentId) === selectedDepartmentId
      const experienceMatches = selectedExperience === 'all'
        || Number(doctor.experienceYears || 0) >= Number(selectedExperience)
      const feeMatches = matchesFeeFilter(doctor, selectedFee)
      const departmentMatches = hasRecommendedDepartments
        ? recommendedDepartmentIds.has(String(doctor.departmentId))
        : false
      const textMatches = normalizedQuery
        ? normalizeSearchText([
          doctor.name,
          doctor.departmentName,
          doctor.specialty,
          doctor.description,
          doctor.email,
          doctor.phone,
          doctor.licenseNumber,
        ].filter(Boolean).join(' ')).includes(normalizedQuery)
        : true
      const queryMatches = normalizedQuery
        ? textMatches || departmentMatches
        : true

      return selectedDepartmentMatches
        && experienceMatches
        && feeMatches
        && queryMatches
    })
  }, [doctors, query, recommendedDepartmentIds, selectedDepartmentId, selectedExperience, selectedFee])

  const totalPages = useMemo(() => (
    Math.max(Math.ceil(visibleDoctors.length / DOCTORS_PER_PAGE), 1)
  ), [visibleDoctors.length])

  const paginatedDoctors = useMemo(() => (
    visibleDoctors.slice(
      (currentPage - 1) * DOCTORS_PER_PAGE,
      currentPage * DOCTORS_PER_PAGE
    )
  ), [currentPage, visibleDoctors])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setCurrentPage(1)
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [query, selectedDepartmentId, selectedExperience, selectedFee, recommendedDepartmentIds])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (currentPage > totalPages) {
        setCurrentPage(totalPages)
      }
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [currentPage, totalPages])

  const departmentOptions = useMemo(() => (
    [...new Map(doctors.map((doctor) => [String(doctor.departmentId), doctor.departmentName])).entries()]
      .filter(([departmentId]) => departmentId !== 'undefined')
      .sort(([, firstName], [, secondName]) => firstName.localeCompare(secondName))
  ), [doctors])

  const resetFilters = () => {
    setSelectedDepartmentId('all')
    setSelectedExperience('all')
    setSelectedFee('all')
    setQuery('')
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen text-on-background">
      <TopNavBar active="doctors" />
      <main className="mx-auto flex max-w-7xl flex-col gap-xxl px-lg py-xxl md:px-xxl">
        <section className="flex flex-col gap-lg border-b border-outline-variant/30 pb-xl">
          <div className="max-w-3xl">
            <p className="font-label-md text-label-md text-primary">Danh bạ chuyên gia</p>
            <h1 className="mt-sm font-headline-lg text-headline-lg text-on-background">Tất cả bác sĩ</h1>
            <p className="mt-sm font-body-md text-body-md text-on-surface-variant">
              Tìm bác sĩ theo triệu chứng, tên bác sĩ hoặc khoa. Dùng bộ lọc nhanh để thu hẹp theo chuyên khoa, phí tư vấn và kinh nghiệm.
            </p>
          </div>
          <div className="grid gap-md lg:grid-cols-[minmax(260px,420px)_minmax(0,1fr)_auto] lg:items-end">
            <Input
              icon="search"
              label="Tìm kiếm bác sĩ"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nhập tên bác sĩ, khoa hoặc chuyên môn..."
              type="search"
              value={query}
            />
            <div className="grid gap-md md:grid-cols-3">
              <label className="space-y-xs">
                <span className="font-label-md text-label-md text-on-surface">Khoa</span>
                <select
                  className="w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  onChange={(event) => setSelectedDepartmentId(event.target.value)}
                  value={selectedDepartmentId}
                >
                  <option value="all">Tất cả khoa</option>
                  {departmentOptions.map(([departmentId, departmentName]) => (
                    <option key={departmentId} value={departmentId}>{departmentName}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-xs">
                <span className="font-label-md text-label-md text-on-surface">Phí tư vấn</span>
                <select
                  className="w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  onChange={(event) => setSelectedFee(event.target.value)}
                  value={selectedFee}
                >
                  {feeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-xs">
                <span className="font-label-md text-label-md text-on-surface">Kinh nghiệm</span>
                <select
                  className="w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  onChange={(event) => setSelectedExperience(event.target.value)}
                  value={selectedExperience}
                >
                  {experienceOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="w-fit whitespace-nowrap rounded-lg bg-surface-container-low px-md py-sm font-label-md text-label-md text-on-surface-variant">
              {visibleDoctors.length}/{doctors.length} bác sĩ
            </div>
          </div>
          <button className="self-start font-label-sm text-label-sm text-primary hover:underline" onClick={resetFilters} type="button">
            Xóa bộ lọc
          </button>
          {matchedSymptoms.length > 0 && (
            <div className="flex flex-wrap gap-xs">
              {matchedSymptoms.map((symptom) => (
                <span className="rounded-full bg-primary-fixed px-sm py-xs font-label-sm text-label-sm text-on-primary-fixed" key={symptom.id}>
                  {symptom.name}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-xl">
          {status === 'loading' && (
            <p className="rounded-lg border border-outline-variant/30 bg-surface p-md font-body-md text-body-md text-on-surface-variant">
              Đang tải danh sách bác sĩ...
            </p>
          )}

          {status === 'error' && (
            <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
              Không thể tải danh sách bác sĩ.
            </p>
          )}

          {status !== 'loading' && visibleDoctors.length === 0 && (
            <div className="rounded-lg border border-dashed border-outline-variant p-xl text-center">
              <Icon className="text-4xl text-outline" name="person_off" />
              <p className="mt-sm font-label-md text-label-md text-on-surface">Không tìm thấy bác sĩ phù hợp</p>
              <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Thử nhập triệu chứng khác hoặc xóa bộ lọc tìm kiếm.</p>
            </div>
          )}

          {visibleDoctors.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedDoctors.map((doctor) => (
                  <DoctorCard doctor={doctor} key={`${doctor.departmentId}-${doctor.id}`} />
                ))}
              </div>

              <PaginationControls
                itemLabel="bác sĩ"
                limit={DOCTORS_PER_PAGE}
                onPageChange={setCurrentPage}
                page={currentPage}
                totalItems={visibleDoctors.length}
                totalPages={totalPages}
              />
            </>
          )}
        </section>
      </main>
    </div>
  )
}

export default DoctorsPage
