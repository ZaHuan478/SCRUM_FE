import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import TopNavBar from '../components/Organisms/TopNavBar'
import DoctorCard from '../components/Molecules/Home/DoctorCard'
import type { DoctorCardData } from '../components/Molecules/Home/DoctorCard'
import Icon from '../components/Atoms/Icon'
import Input from '../components/Atoms/Input'
import PaginationControls from '../components/Molecules/Common/PaginationControls'
import Select from '../components/Molecules/Common/Select'
import { useTranslation } from '../contexts/LanguageContext'
import { getDoctorAssignments } from '../services/doctorAssignment.service'
import type { DoctorAssignment } from '../services/doctorAssignment.service'
import type { Doctor } from '../services/doctor.service'
import { recommendDepartmentsBySymptoms } from '../services/departmentSymptomRule.service'
import { getSymptoms } from '../services/symptom.service'
import type { Symptom } from '../services/symptom.service'
import { translateDepartmentName, translateDoctorDescription } from '../utils/contentTranslation'
import { findMatchingSymptoms } from '../utils/patientAppointments'

type DoctorDirectoryItem = DoctorCardData & {
  departmentId?: number | string
  departmentName: string
  feeValue?: number
  licenseNumber?: string
}

const DOCTORS_PER_PAGE = 4
const filterSelectClassName = 'h-11 min-h-11 rounded-xl border-outline-variant/60 bg-surface/80 py-sm shadow-sm backdrop-blur hover:border-primary/40 hover:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10'

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
    )),
  )

  return [
    ...firstPage.symptoms,
    ...remainingPages.flatMap((result) => result.symptoms),
  ]
}

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
  const { language, t } = useTranslation()
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

  const experienceOptions = useMemo(() => [
    { label: t('doctorsPage.experience.all'), value: 'all' },
    { label: t('doctorsPage.experience.from5'), value: '5' },
    { label: t('doctorsPage.experience.from10'), value: '10' },
    { label: t('doctorsPage.experience.from15'), value: '15' },
  ], [t])

  const feeOptions = useMemo(() => [
    { label: t('doctorsPage.fee.all'), value: 'all' },
    { label: t('doctorsPage.fee.under300'), value: 'under-300000' },
    { label: t('doctorsPage.fee.between300And350'), value: '300000-350000' },
    { label: t('doctorsPage.fee.over350'), value: 'over-350000' },
  ], [t])

  const mapAssignment = useCallback((assignment: DoctorAssignment): DoctorDirectoryItem | null => {
    const doctor = assignment.doctor as Doctor | undefined
    if (!doctor) return null

    return {
      departmentId: assignment.department_id,
      departmentName: assignment.department?.name
        ? translateDepartmentName(assignment.department.name, language)
        : t('doctorsPage.unassignedDepartment'),
      description: translateDoctorDescription(doctor.description, language),
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
      specialty: assignment.department?.name ? translateDepartmentName(assignment.department.name, language) : '',
    }
  }, [language, t])

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
  }, [mapAssignment])

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
            recommendations.map((recommendation) => String(recommendation.department_id)),
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
      currentPage * DOCTORS_PER_PAGE,
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
      .map(([departmentId, departmentName]) => ({
        label: departmentName,
        value: departmentId,
      }))
  ), [doctors])

  const resetFilters = () => {
    setSelectedDepartmentId('all')
    setSelectedExperience('all')
    setSelectedFee('all')
    setQuery('')
    setCurrentPage(1)
  }

  return (
    <div className="hp-home hp-soft-home min-h-screen text-on-background">
      <TopNavBar active="doctors" variant="softHome" />
      <main className="mx-auto flex max-w-[1366px] flex-col gap-xxl px-lg pb-[72px] pt-[132px] md:px-xxl md:pb-[96px] md:pt-[152px]">
        <section className="relative z-40 rounded-[2rem] border border-white/70 bg-surface/78 p-lg shadow-[0_26px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl md:p-xl">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-sm font-label-sm text-label-sm uppercase tracking-[0.32em] text-on-surface-variant">
              <span className="h-1 w-10 rounded-full bg-primary" />
              {t('doctorsPage.eyebrow')}
            </p>
            <h1 className="mt-md font-headline-lg text-[42px] font-semibold uppercase leading-[0.92] text-on-background sm:text-[56px] md:text-[72px]">{t('doctorsPage.title')}</h1>
            <p className="mt-md max-w-2xl font-body-md text-body-md leading-7 text-on-surface-variant">
              {t('doctorsPage.description')}
            </p>
          </div>
          <div className="mt-lg grid gap-md lg:grid-cols-[minmax(260px,420px)_minmax(0,1fr)_auto] lg:items-end">
            <Input
              icon="search"
              label={t('doctorsPage.searchLabel')}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('doctorsPage.searchPlaceholder')}
              type="search"
              value={query}
            />
            <div className="grid gap-md md:grid-cols-3">
              <Select
                className={filterSelectClassName}
                label={t('doctorsPage.departmentLabel')}
                onChange={setSelectedDepartmentId}
                options={[
                  { label: t('doctorsPage.allDepartments'), value: 'all' },
                  ...departmentOptions,
                ]}
                value={selectedDepartmentId}
              />
              <Select
                className={filterSelectClassName}
                label={t('doctorsPage.feeLabel')}
                onChange={setSelectedFee}
                options={feeOptions}
                value={selectedFee}
              />
              <Select
                className={filterSelectClassName}
                label={t('doctorsPage.experienceLabel')}
                onChange={setSelectedExperience}
                options={experienceOptions}
                value={selectedExperience}
              />
            </div>
            <div className="w-full rounded-2xl border border-outline-variant/45 bg-primary-fixed/35 px-md py-sm font-label-md text-label-md text-primary shadow-inner lg:w-fit">
              {t('doctorsPage.resultCount', { visible: visibleDoctors.length, total: doctors.length })}
            </div>
          </div>
          <button className="self-start font-label-sm text-label-sm text-primary hover:underline" onClick={resetFilters} type="button">
            {t('doctorsPage.clearFilters')}
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

        <section className="relative z-0 space-y-xl">
          {status === 'loading' && (
            <p className="rounded-2xl border border-outline-variant/45 bg-surface/78 p-md font-body-md text-body-md text-on-surface-variant shadow-sm backdrop-blur-xl">
              {t('doctorsPage.loading')}
            </p>
          )}

          {status === 'error' && (
            <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
              {t('doctorsPage.error')}
            </p>
          )}

          {status !== 'loading' && visibleDoctors.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-outline-variant/55 bg-surface/78 p-xl text-center shadow-[0_20px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <Icon className="text-4xl text-outline" name="person_off" />
              <p className="mt-sm font-label-md text-label-md text-on-surface">{t('doctorsPage.emptyTitle')}</p>
              <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{t('doctorsPage.emptyDescription')}</p>
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
                itemLabel={t('common.doctors')}
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
