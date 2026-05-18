import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import TopNavBar from '../components/Organisms/TopNavBar'
import DoctorCard from '../components/Molecules/Home/DoctorCard'
import type { DoctorCardData } from '../components/Molecules/Home/DoctorCard'
import Icon from '../components/Atoms/Icon'
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

const buildDepartmentBiography = (department: Department) => {
  const description = department.description || 'Khoa đang tiếp nhận, thăm khám và điều trị các nhu cầu sức khỏe phù hợp trong hệ thống.'

  return [
    {
      icon: 'clinical_notes',
      title: 'Tổng quan',
      text: description,
    },
    {
      icon: 'groups',
      title: 'Đội ngũ chuyên môn',
      text: 'Khoa được vận hành bởi các bác sĩ đang hoạt động trong hệ thống, có hồ sơ chuyên môn và lịch khám được cập nhật để bệnh nhân dễ dàng lựa chọn.',
    },
    {
      icon: 'event_available',
      title: 'Đặt lịch',
      text: 'Bệnh nhân có thể chọn bác sĩ trực thuộc khoa, xem lịch trống theo ngày và gửi yêu cầu đặt lịch ngay trên hệ thống.',
    },
  ]
}

const DepartmentDetailPage = () => {
  const { id } = useParams()
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
    department ? buildDepartmentBiography(department) : []
  ), [department])

  if (!id) return <Navigate replace to="/departments" />

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNavBar active="departments" />
      <main className="mx-auto flex max-w-7xl flex-col gap-xxl px-lg py-xxl md:px-xxl">
        <Link className="inline-flex items-center gap-xs self-start font-label-md text-label-md text-primary transition-all hover:gap-sm hover:underline" to="/departments">
          <Icon name="arrow_back" /> Quay lại danh sách khoa
        </Link>

        {status === 'loading' && (
          <p className="rounded-lg border border-outline-variant/30 bg-surface p-md font-body-md text-body-md text-on-surface-variant">
            Đang tải thông tin khoa...
          </p>
        )}

        {status === 'error' && (
          <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
            Không thể tải thông tin khoa.
          </p>
        )}

        {department && (
          <>
            <section className="grid gap-xl border-b border-outline-variant/30 pb-xxl lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <p className="font-label-md text-label-md text-primary">Thông tin khoa</p>
                <h1 className="mt-sm font-headline-lg text-headline-lg text-on-background">{department.name}</h1>
                <p className="mt-md max-w-3xl font-body-lg text-body-lg text-on-surface-variant">
                  {department.description || 'Khoa đang tiếp nhận lịch khám và tư vấn trong hệ thống.'}
                </p>
              </div>

              <aside className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm">
                <div className="flex items-center gap-sm">
                  <Icon className="text-primary" name="verified" />
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Trạng thái</h2>
                </div>
                <p className="mt-md font-body-md text-body-md text-on-surface-variant">
                  {department.status === 'ACTIVE' ? 'Đang hoạt động và nhận lịch khám.' : 'Hiện chưa nhận lịch khám.'}
                </p>
                <div className="mt-lg rounded-lg bg-primary-fixed px-md py-sm text-on-primary-fixed">
                  <p className="font-label-md text-label-md">{doctors.length} bác sĩ trực thuộc</p>
                </div>
              </aside>
            </section>

            <section className="grid grid-cols-1 gap-lg md:grid-cols-3">
              {biography.map((item) => (
                <article className="rounded-lg border border-outline-variant/30 bg-surface p-lg shadow-sm" key={item.title}>
                  <div className="mb-md flex h-12 w-12 items-center justify-center rounded-full bg-primary-fixed/30 text-primary">
                    <Icon className="text-2xl" name={item.icon} />
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">{item.title}</h2>
                  <p className="mt-sm font-body-sm text-body-sm text-on-surface-variant">{item.text}</p>
                </article>
              ))}
            </section>

            <section className="space-y-lg">
              <div className="flex flex-col justify-between gap-sm border-b border-outline-variant/30 pb-md sm:flex-row sm:items-end">
                <div>
                  <p className="font-label-md text-label-md text-primary">Bác sĩ trực thuộc</p>
                  <h2 className="mt-xs font-headline-md text-headline-md text-on-background">{department.name}</h2>
                </div>
                <Link
                  className="inline-flex items-center gap-xs font-label-md text-label-md text-primary transition-all hover:gap-sm hover:underline"
                  to={`/doctors?department_id=${department.id}`}
                >
                  Xem trong danh bạ <Icon name="arrow_forward" />
                </Link>
              </div>

              {doctors.length > 0 ? (
                <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {doctors.map((doctor) => (
                    <DoctorCard doctor={doctor} key={doctor.id} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-outline-variant p-xl text-center">
                  <Icon className="text-4xl text-outline" name="person_off" />
                  <p className="mt-sm font-label-md text-label-md text-on-surface">Chưa có bác sĩ trực thuộc khoa này</p>
                  <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Bạn có thể quay lại sau khi hệ thống cập nhật thêm hồ sơ bác sĩ.</p>
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
