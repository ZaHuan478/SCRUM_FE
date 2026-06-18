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
import {
  translateDepartmentDescription,
  translateDepartmentName,
  translateDoctorDescription,
} from '../utils/contentTranslation'
import type { Language } from '../contexts/LanguageContext'

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

const mapDoctor = (assignment: DoctorAssignment, language: Language): DoctorCardData | null => {
  const doctor = assignment.doctor as Doctor | undefined
  if (!doctor) return null

  return {
    description: translateDoctorDescription(doctor.description, language),
    email: doctor.user?.email,
    experienceYears: doctor.experience_years,
    fee: formatFee(doctor.consultation_fee),
    id: doctor.id,
    image: doctor.image_url || '',
    name: doctor.user?.full_name || doctor.license_number,
    phone: doctor.user?.phone,
    specialty: assignment.department?.name ? translateDepartmentName(assignment.department.name, language) : '',
  }
}

const DepartmentDetailPage = () => {
  const { id } = useParams()
  const { language, t } = useTranslation()
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
          .map((assignment) => mapDoctor(assignment, language))
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
  }, [id, language])

  const departmentName = department ? translateDepartmentName(department.name, language) : ''
  const departmentDescription = department?.description
    ? translateDepartmentDescription(department.description, language)
    : ''

  const biography = useMemo(() => (
    department
      ? [
        {
          icon: 'clinical_notes',
          title: t('departmentDetail.overviewTitle'),
          text: departmentDescription || t('departmentDetail.overviewFallback'),
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
  ), [department, departmentDescription, t])

  if (!id) return <Navigate replace to="/departments" />

  return (
    <div className="hp-home hp-soft-home min-h-screen text-on-background">
      <TopNavBar active="departments" variant="softHome" />
      <main className="mx-auto flex max-w-[1366px] flex-col gap-xxl px-lg pb-[72px] pt-[132px] md:px-xxl md:pb-[96px] md:pt-[152px]">
        <Link className="inline-flex items-center gap-xs self-start rounded-full border border-outline-variant/45 bg-surface/74 px-md py-sm font-label-md text-label-md text-primary shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-primary/45" to="/departments">
          <Icon name="arrow_back" /> {t('departmentDetail.back')}
        </Link>

        {status === 'loading' && (
          <p className="rounded-2xl border border-outline-variant/45 bg-surface/78 p-md font-body-md text-body-md text-on-surface-variant shadow-sm backdrop-blur-xl">
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
            <section className="grid gap-xl rounded-[2rem] border border-white/70 bg-surface/78 p-lg shadow-[0_26px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl lg:grid-cols-[minmax(0,1fr)_340px] md:p-xl">
              <div>
                <p className="inline-flex items-center gap-sm font-label-sm text-label-sm uppercase tracking-[0.32em] text-on-surface-variant">
                  <span className="h-1 w-10 rounded-full bg-primary" />
                  {t('departmentDetail.infoEyebrow')}
                </p>
                <h1 className="mt-md font-headline-lg text-[42px] font-semibold uppercase leading-[0.92] text-on-background sm:text-[56px] md:text-[72px]">{departmentName}</h1>
                <p className="mt-md max-w-3xl font-body-lg text-body-lg leading-8 text-on-surface-variant">
                  {departmentDescription || t('departmentDetail.fallbackDescription')}
                </p>
              </div>

              <aside className="rounded-[1.75rem] border border-white/70 bg-primary-fixed/30 p-lg shadow-inner backdrop-blur-xl">
                <div className="flex items-center gap-sm">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface/80 text-primary shadow-sm">
                    <Icon name="verified" />
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">{t('departmentDetail.statusTitle')}</h2>
                </div>
                <p className="mt-md font-body-md text-body-md text-on-surface-variant">
                  {department.status === 'ACTIVE' ? t('departmentDetail.activeStatus') : t('departmentDetail.inactiveStatus')}
                </p>
                <div className="mt-lg rounded-2xl bg-surface/76 px-md py-sm text-primary shadow-sm backdrop-blur-xl">
                  <p className="font-label-md text-label-md">{t('departmentDetail.doctorCount', { count: doctors.length })}</p>
                </div>
              </aside>
            </section>

            <section className="grid grid-cols-1 gap-lg md:grid-cols-3">
              {biography.map((item) => (
                <article className="rounded-[1.75rem] border border-white/70 bg-surface/78 p-lg shadow-[0_22px_58px_rgba(15,23,42,0.10)] backdrop-blur-2xl transition-all hover:-translate-y-1 hover:border-primary/25" key={item.title}>
                  <div className="mb-md flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-fixed/55 text-primary shadow-sm">
                    <Icon className="text-2xl" name={item.icon} />
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">{item.title}</h2>
                  <p className="mt-sm font-body-sm text-body-sm text-on-surface-variant">{item.text}</p>
                </article>
              ))}
            </section>

            <section className="space-y-lg">
              <div className="flex flex-col justify-between gap-sm rounded-[1.75rem] border border-white/70 bg-surface/72 p-lg shadow-sm backdrop-blur-xl sm:flex-row sm:items-end">
                <div>
                  <p className="font-label-md text-label-md text-primary">{t('departmentDetail.doctorsEyebrow')}</p>
                  <h2 className="mt-xs font-headline-md text-headline-md text-on-background">{departmentName}</h2>
                </div>
                <Link
                  className="inline-flex items-center gap-xs rounded-full border border-outline-variant/45 bg-surface/74 px-md py-sm font-label-md text-label-md text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/45"
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
                <div className="rounded-[2rem] border border-dashed border-outline-variant/55 bg-surface/78 p-xl text-center shadow-[0_20px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl">
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
