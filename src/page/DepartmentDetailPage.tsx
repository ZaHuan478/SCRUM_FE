import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import TopNavBar from '../components/Organisms/TopNavBar'
import DoctorCard from '../components/Molecules/Home/DoctorCard'
import type { DoctorCardData } from '../components/Molecules/Home/DoctorCard'
import Icon from '../components/Atoms/Icon'
import { useTranslation } from '../contexts/LanguageContext'
import { getDepartmentById } from '../services/department.service'
import type { Department } from '../services/department.service'
import { getDoctorAssignments } from '../services/doctorAssignment.service'
import type { DoctorAssignment } from '../services/doctorAssignment.service'
import type { Doctor } from '../services/doctor.service'

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

const mapDoctor = (assignment: DoctorAssignment): DoctorCardData | null => {
  const doctor = assignment.doctor as Doctor | undefined
  if (!doctor) return null

  return {
    description: doctor.description,
    email: doctor.user?.email,
    experienceYears: doctor.experience_years,
    fee: formatFee(doctor.consultation_fee),
    id: doctor.id,
    image: doctor.image_url || '',
    name: doctor.user?.full_name || doctor.license_number,
    phone: doctor.user?.phone,
    specialty: assignment.department?.name || '',
  }
}

const DepartmentDetailPage = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const [department, setDepartment] = useState<Department | null>(null)
  const [doctors, setDoctors] = useState<DoctorCardData[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true

    if (!id) return undefined

    Promise.all([
      getDepartmentById(id),
      getDoctorAssignments({ department_id: id, limit: 100, status: 'ACTIVE' }),
    ])
      .then(([nextDepartment, assignmentResult]) => {
        if (!active) return

        setDepartment(nextDepartment)
        setDoctors(assignmentResult.doctor_assignments
          .map(mapDoctor)
          .filter((doctor): doctor is DoctorCardData => Boolean(doctor)))
        setStatus('ready')
      })
      .catch(() => {
        if (!active) return

        setDepartment(null)
        setDoctors([])
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [id])

  const biography = useMemo(() => (
    department
      ? [
        {
          icon: 'clinical_notes',
          title: t('departmentDetail.overviewTitle'),
          text: department.description || t('departmentDetail.overviewFallback'),
        },
        {
          icon: 'groups',
          title: t('departmentDetail.teamTitle'),
          text: t('departmentDetail.teamText'),
        },
        {
          icon: 'event_available',
          title: t('departmentDetail.bookingTitle'),
          text: t('departmentDetail.bookingText'),
        },
      ]
      : []
  ), [department, t])

  if (!id) return <Navigate replace to="/departments" />

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNavBar active="departments" />
      <main className="mx-auto flex max-w-[1366px] flex-col gap-xxl px-lg py-[48px] md:px-xxl md:py-[64px]">
        <Link className="inline-flex items-center gap-xs self-start font-label-md text-label-md text-primary transition-all hover:gap-sm hover:underline" to="/departments">
          <Icon name="arrow_back" /> {t('departmentDetail.back')}
        </Link>

        {status === 'loading' && (
          <p className="rounded-lg border border-outline-variant bg-surface p-md font-body-md text-body-md text-on-surface-variant">
            {t('departmentDetail.loading')}
          </p>
        )}

        {status === 'error' && (
          <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
            {t('departmentDetail.error')}
          </p>
        )}

        {department && (
          <>
            <section className="grid gap-xl rounded-xl border border-outline-variant bg-surface p-xl shadow-[0_2px_8px_rgba(26,26,26,0.08)] lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <p className="font-label-md text-label-md text-primary">{t('departmentDetail.infoEyebrow')}</p>
                <h1 className="mt-sm font-headline-lg text-[32px] font-medium leading-none text-on-background sm:text-[40px] md:text-[44px]">{department.name}</h1>
                <p className="mt-md max-w-3xl font-body-lg text-body-lg text-on-surface-variant">
                  {department.description || t('departmentDetail.fallbackDescription')}
                </p>
              </div>

              <aside className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
                <div className="flex items-center gap-sm">
                  <Icon className="text-primary" name="verified" />
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">{t('departmentDetail.statusTitle')}</h2>
                </div>
                <p className="mt-md font-body-md text-body-md text-on-surface-variant">
                  {department.status === 'ACTIVE' ? t('departmentDetail.activeStatus') : t('departmentDetail.inactiveStatus')}
                </p>
                <div className="mt-lg rounded-lg bg-primary-fixed px-md py-sm text-on-primary-fixed">
                  <p className="font-label-md text-label-md">{t('departmentDetail.doctorCount', { count: doctors.length })}</p>
                </div>
              </aside>
            </section>

            <section className="grid grid-cols-1 gap-lg md:grid-cols-3">
              {biography.map((item) => (
                <article className="rounded-xl bg-surface p-lg shadow-[0_2px_8px_rgba(26,26,26,0.08)] ring-1 ring-outline-variant" key={item.title}>
                  <div className="mb-md flex h-12 w-12 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                    <Icon className="text-2xl" name={item.icon} />
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">{item.title}</h2>
                  <p className="mt-sm font-body-sm text-body-sm text-on-surface-variant">{item.text}</p>
                </article>
              ))}
            </section>

            <section className="space-y-lg">
              <div className="flex flex-col justify-between gap-sm border-b border-outline-variant pb-md sm:flex-row sm:items-end">
                <div>
                  <p className="font-label-md text-label-md text-primary">{t('departmentDetail.doctorsEyebrow')}</p>
                  <h2 className="mt-xs font-headline-md text-headline-md text-on-background">{department.name}</h2>
                </div>
                <Link
                  className="inline-flex items-center gap-xs font-label-md text-label-md text-primary transition-all hover:gap-sm hover:underline"
                  to={`/doctors?department_id=${department.id}`}
                >
                  {t('departmentDetail.viewDirectory')} <Icon name="arrow_forward" />
                </Link>
              </div>

              {doctors.length > 0 ? (
                <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {doctors.map((doctor) => (
                    <DoctorCard doctor={doctor} key={doctor.id} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-outline-variant bg-surface p-xl text-center">
                  <Icon className="text-4xl text-outline" name="person_off" />
                  <p className="mt-sm font-label-md text-label-md text-on-surface">{t('departmentDetail.emptyTitle')}</p>
                  <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{t('departmentDetail.emptyDescription')}</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default DepartmentDetailPage
