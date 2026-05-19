import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Image from '../components/Atoms/Image'
import Icon from '../components/Atoms/Icon'
import Button from '../components/Atoms/Button'
import TopNavBar from '../components/Organisms/TopNavBar'
import DoctorRatingForm from '../components/DoctorRating/DoctorRatingForm'
import DoctorRatingList from '../components/DoctorRating/DoctorRatingList'
import DoctorRatingSummary from '../components/DoctorRating/DoctorRatingSummary'
import { getDoctorAssignments } from '../services/doctorAssignment.service'
import type { DoctorAssignment } from '../services/doctorAssignment.service'
import { getDoctorById } from '../services/doctor.service'
import type { Doctor } from '../services/doctor.service'
import { getMyAppointments } from '../services/appointment.service'
import { AUTH_USER_CHANGED_EVENT, getStoredUser } from '../services/auth.service'
import type { User } from '../services/auth.service'
import {
  createOrUpdateDoctorRating,
  deleteMyDoctorRating,
  getDoctorRatings,
  getDoctorRatingSummary,
  getMyDoctorRating,
} from '../services/doctorRating.api'
import type {
  DoctorRatingItem,
  DoctorRatingSummary as DoctorRatingSummaryData,
  MyDoctorRating,
} from '../services/doctorRating.api'

type DetailTab = 'biography' | 'education'

type EducationItem = {
  title: string
  description: string
}

const formatFee = (fee?: string | number | null) => {
  if (fee === undefined || fee === null || fee === '') return 'Chưa cập nhật'

  const amount = Number(fee)
  if (Number.isNaN(amount)) return String(fee)

  return new Intl.NumberFormat('vi-VN', {
    currency: 'VND',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(amount)
}

const buildFallbackBiography = (doctor?: Doctor, specialty?: string) => {
  const name = doctor?.user?.full_name || 'Bác sĩ'
  const experienceYears = Number(doctor?.experience_years || 0)
  const experienceText = experienceYears > 0
    ? `với ${experienceYears} năm kinh nghiệm lâm sàng`
    : 'với nền tảng chuyên môn vững chắc'
  const focus = doctor?.description || specialty || 'khám, tư vấn và điều trị theo tiêu chuẩn y khoa hiện đại'

  return `${name} là bác sĩ ${experienceText}, tập trung vào ${focus.toLowerCase()}. Bác sĩ theo đuổi phong cách chăm sóc dựa trên bằng chứng, giải thích rõ ràng cho người bệnh và xây dựng phác đồ phù hợp với từng hồ sơ sức khỏe. Trong quá trình thăm khám, bác sĩ ưu tiên lắng nghe triệu chứng, đánh giá nguy cơ toàn diện và phối hợp theo dõi sau điều trị để giúp người bệnh an tâm hơn trong từng bước chăm sóc.`
}

const buildEducation = (doctor?: Doctor, specialty?: string): EducationItem[] => {
  const specialtyLabel = specialty || doctor?.description || 'chuyên khoa liên quan'
  const experienceYears = Number(doctor?.experience_years || 0)

  return [
    {
      title: 'Đào tạo y khoa nền tảng',
      description: `Hoàn thành chương trình đào tạo bác sĩ và thực hành lâm sàng theo quy trình chuyên môn, tập trung vào đánh giá triệu chứng, chẩn đoán ban đầu và lập kế hoạch điều trị an toàn.`,
    },
    {
      title: `Định hướng chuyên môn ${specialtyLabel}`,
      description: `Duy trì cập nhật kiến thức trong lĩnh vực ${specialtyLabel.toLowerCase()}, ưu tiên chỉ định phù hợp, tư vấn rõ ràng và phối hợp theo dõi sau khám.`,
    },
    {
      title: 'Phát triển chuyên môn liên tục',
      description: experienceYears > 0
        ? `Tích lũy ${experienceYears} năm kinh nghiệm qua hoạt động khám chữa bệnh, trao đổi chuyên môn và cải tiến quy trình chăm sóc người bệnh.`
        : 'Thường xuyên cập nhật hướng dẫn điều trị và thực hành giao tiếp y khoa lấy người bệnh làm trung tâm.',
    },
  ]
}

const DoctorDetailPage = () => {
  const { doctorId } = useParams()
  const hasDoctorId = Boolean(doctorId)
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [assignments, setAssignments] = useState<DoctorAssignment[]>([])
  const [activeTab, setActiveTab] = useState<DetailTab>('biography')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredUser())
  const [ratingSummary, setRatingSummary] = useState<DoctorRatingSummaryData | null>(null)
  const [ratingList, setRatingList] = useState<DoctorRatingItem[]>([])
  const [ratingPage, setRatingPage] = useState(1)
  const [ratingHasMore, setRatingHasMore] = useState(false)
  const [ratingLoading, setRatingLoading] = useState(false)
  const [ratingListLoading, setRatingListLoading] = useState(false)
  const [ratingError, setRatingError] = useState('')
  const [ratingSuccess, setRatingSuccess] = useState('')
  const [isSubmittingRating, setIsSubmittingRating] = useState(false)
  const [myRating, setMyRating] = useState<MyDoctorRating | null>(null)
  const [canRate, setCanRate] = useState(false)
  const [appointmentId, setAppointmentId] = useState<number | string | null>(null)

  useEffect(() => {
    if (!doctorId) return

    let active = true

    Promise.all([
      getDoctorById(doctorId),
      getDoctorAssignments({ doctor_id: doctorId, limit: 20, status: 'ACTIVE' }),
    ])
      .then(([nextDoctor, assignmentResult]) => {
        if (!active) return

        setDoctor(nextDoctor)
        setAssignments(assignmentResult.doctor_assignments)
        setStatus('ready')
      })
      .catch(() => {
        if (!active) return

        setDoctor(null)
        setAssignments([])
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [doctorId])

  useEffect(() => {
    const handleUserChange = (event: Event) => {
      const nextUser = (event as CustomEvent<User | null>).detail
      setCurrentUser(nextUser ?? getStoredUser())
    }

    window.addEventListener(AUTH_USER_CHANGED_EVENT, handleUserChange)

    return () => {
      window.removeEventListener(AUTH_USER_CHANGED_EVENT, handleUserChange)
    }
  }, [])

  useEffect(() => {
    if (!doctorId) return

    let active = true
    setRatingLoading(true)
    setRatingPage(1)

    Promise.all([
      getDoctorRatingSummary(doctorId),
      getDoctorRatings(doctorId, { page: 1, limit: 6 }),
    ])
      .then(([summary, list]) => {
        if (!active) return

        setRatingSummary(summary)
        setRatingList(list.ratings)
        setRatingHasMore(list.pagination.page < list.pagination.total_pages)
      })
      .catch(() => {
        if (!active) return

        setRatingSummary(null)
        setRatingList([])
        setRatingHasMore(false)
      })
      .finally(() => {
        if (!active) return
        setRatingLoading(false)
      })

    return () => {
      active = false
    }
  }, [doctorId])

  useEffect(() => {
    if (!doctorId) return

    if (!currentUser || currentUser.role !== 'PATIENT') {
      setMyRating(null)
      setCanRate(false)
      setAppointmentId(null)
      return
    }

    let active = true

    Promise.all([
      getMyDoctorRating(doctorId),
      getMyAppointments({ doctor_id: doctorId, status: 'COMPLETED', limit: 1, page: 1 }),
    ])
      .then(([ratingData, appointmentResult]) => {
        if (!active) return

        setMyRating(ratingData)
        const latestAppointment = appointmentResult.appointments[0]
        const nextAppointmentId = ratingData?.appointment_id || latestAppointment?.id || null
        setAppointmentId(nextAppointmentId)
        setCanRate(Boolean(nextAppointmentId))
      })
      .catch(() => {
        if (!active) return

        setMyRating(null)
        setCanRate(false)
        setAppointmentId(null)
      })

    return () => {
      active = false
    }
  }, [currentUser, doctorId])

  const primarySpecialty = assignments[0]?.department?.name || doctor?.description || 'Chuyên khoa'
  const biography = doctor?.prof_biography || buildFallbackBiography(doctor || undefined, primarySpecialty)
  const educationItems = useMemo(() => buildEducation(doctor || undefined, primarySpecialty), [doctor, primarySpecialty])
  const bookingSearch = new URLSearchParams()

  if (doctor?.id) bookingSearch.set('doctor_id', String(doctor.id))
  if (doctor?.user?.full_name) bookingSearch.set('doctor_name', doctor.user.full_name)

  const handleLoadMoreRatings = async () => {
    if (!doctorId || ratingListLoading) return

    const nextPage = ratingPage + 1
    setRatingListLoading(true)

    try {
      const list = await getDoctorRatings(doctorId, { page: nextPage, limit: 6 })
      setRatingList((current) => [...current, ...list.ratings])
      setRatingHasMore(list.pagination.page < list.pagination.total_pages)
      setRatingPage(nextPage)
    } catch {
      setRatingHasMore(false)
    } finally {
      setRatingListLoading(false)
    }
  }

  const reloadRatings = async () => {
    if (!doctorId) return

    try {
      const [summary, list] = await Promise.all([
        getDoctorRatingSummary(doctorId),
        getDoctorRatings(doctorId, { page: 1, limit: 6 }),
      ])

      setRatingSummary(summary)
      setRatingList(list.ratings)
      setRatingHasMore(list.pagination.page < list.pagination.total_pages)
      setRatingPage(1)
    } catch {
      setRatingSummary(null)
      setRatingList([])
      setRatingHasMore(false)
    }
  }

  const handleSubmitRating = async ({ rating, comment }: { rating: number; comment?: string | null }) => {
    if (!doctorId) return

    setRatingError('')
    setRatingSuccess('')

    if (!rating || rating < 1) {
      setRatingError('Vui lòng chọn số sao trước khi gửi đánh giá.')
      return
    }

    if (!appointmentId) {
      setRatingError('Bạn cần hoàn thành lịch hẹn trước khi đánh giá.')
      return
    }

    setIsSubmittingRating(true)

    try {
      await createOrUpdateDoctorRating(doctorId, {
        appointmentId,
        rating,
        comment: comment || null,
      })
      setRatingSuccess('Đánh giá đã được gửi thành công.')
      await reloadRatings()
      const latestRating = await getMyDoctorRating(doctorId)
      setMyRating(latestRating)
      if (latestRating?.appointment_id) {
        setAppointmentId(latestRating.appointment_id)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể gửi đánh giá.'
      setRatingError(message)
    } finally {
      setIsSubmittingRating(false)
    }
  }

  const handleDeleteRating = async () => {
    if (!doctorId) return

    setRatingError('')
    setRatingSuccess('')
    setIsSubmittingRating(true)

    try {
      await deleteMyDoctorRating(doctorId)
      setRatingSuccess('Đánh giá đã được xóa.')
      setMyRating(null)
      await reloadRatings()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể xóa đánh giá.'
      setRatingError(message)
    } finally {
      setIsSubmittingRating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNavBar active="doctors" />
      <main className="mx-auto flex max-w-7xl flex-col gap-xl px-lg py-xxl md:px-xxl">
        <Link className="inline-flex items-center gap-xs self-start font-label-md text-label-md text-primary hover:underline" to="/doctors">
          <Icon name="arrow_back" className="text-[20px]" />
          Quay lại danh sách bác sĩ
        </Link>

        {status === 'loading' && (
          <section className="rounded-xl border border-outline-variant/30 bg-surface p-xl font-body-md text-body-md text-on-surface-variant">
            Đang tải thông tin bác sĩ...
          </section>
        )}

        {(!hasDoctorId || status === 'error') && (
          <section className="rounded-xl bg-error-container p-xl text-on-error-container">
            <p className="font-label-md text-label-md">Không thể tải thông tin chi tiết bác sĩ.</p>
            <p className="mt-xs font-body-sm text-body-sm">Vui lòng kiểm tra lại đường dẫn hoặc thử lại sau.</p>
          </section>
        )}

        {status === 'ready' && doctor && (
          <>
            <section className="grid gap-xl rounded-xl border bg-white border-outline-variant/30 bg-surface p-lg shadow-sm lg:grid-cols-[280px_minmax(0,1fr)] lg:p-xl">
              <div className="overflow-hidden rounded-xl bg-surface-variant">
                <Image
                  alt={doctor.user?.full_name || doctor.license_number}
                  className="aspect-[4/5] h-full w-full object-cover"
                  fallbackClassName="aspect-[4/5] h-full w-full"
                  src={doctor.image_url || undefined}
                />
              </div>
              <div className="flex flex-col gap-lg">
                <div>
                  <p className="font-label-md text-label-md text-primary">{primarySpecialty}</p>
                  <h1 className="mt-sm font-headline-lg text-headline-lg text-on-background">
                    {doctor.user?.full_name || doctor.license_number}
                  </h1>
                  <p className="mt-sm max-w-3xl font-body-md text-body-md text-on-surface-variant">
                    {doctor.description || 'Thông tin chuyên môn đang được cập nhật.'}
                  </p>
                </div>
                <div className="grid gap-md sm:grid-cols-4">
                  <div className="rounded-lg bg-surface-container-low p-md">
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Kinh nghiệm</p>
                    <p className="mt-xs font-label-md text-label-md text-on-surface">
                      {doctor.experience_years ? `${doctor.experience_years} năm` : 'Đang cập nhật'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface-container-low p-md">
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Phí tư vấn</p>
                    <p className="mt-xs font-label-md text-label-md text-on-surface">{formatFee(doctor.consultation_fee)}</p>
                  </div>
                  <div className="rounded-lg bg-surface-container-low p-md">
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Trạng thái</p>
                    <p className="mt-xs font-label-md text-label-md text-primary">
                      {doctor.status === 'ACTIVE' ? 'Đang nhận lịch' : 'Tạm ngưng'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface-container-low p-md">
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Đánh giá</p>
                    <p className="mt-xs font-label-md text-label-md text-on-surface">
                      {ratingSummary?.totalRatings
                        ? `${ratingSummary.averageRating.toFixed(1)}/5`
                        : 'Chưa có'}
                    </p>
                    <p className="mt-xxs font-body-sm text-body-sm text-on-surface-variant">
                      {ratingSummary?.totalRatings
                        ? `${ratingSummary.totalRatings} lượt đánh giá`
                        : 'Chưa có đánh giá'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-sm">
                  <Link
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-lg py-md font-label-md text-label-md text-on-primary shadow-sm transition-all hover:bg-primary-container"
                    to={`/appointments${bookingSearch.toString() ? `?${bookingSearch.toString()}` : ''}`}
                  >
                    Đặt lịch khám
                  </Link>
                  {doctor.user?.phone && (
                    <a className="inline-flex items-center justify-center rounded-lg border border-outline-variant px-lg py-md font-label-md text-label-md text-on-surface hover:border-primary hover:text-primary" href={`tel:${doctor.user.phone}`}>
                      {doctor.user.phone}
                    </a>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-xl border bg-white border-outline-variant/30 bg-surface p-lg shadow-sm lg:p-xl">
              <div className="mb-lg flex flex-wrap gap-sm border-b border-outline-variant/30 pb-md">
                {[
                  { id: 'biography', label: 'Tiểu sử' },
                  { id: 'education', label: 'Đào tạo' },
                ].map((tab) => (
                  <Button
                    className={`rounded-none border-x-0 border-t-0 bg-transparent px-md py-sm shadow-none hover:bg-transparent ${
                      activeTab === tab.id
                        ? 'border-b-2 border-primary text-primary'
                        : 'border-b-2 border-transparent text-on-surface-variant hover:border-primary/40 hover:text-primary'
                    }`}
                    fullWidth={false}
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as DetailTab)}
                    type="button"
                    variant="ghost"
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              {activeTab === 'biography' && (
                <article>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Tiểu sử chuyên môn</h2>
                  <p className="mt-md max-w-4xl whitespace-pre-line font-body-md text-body-md text-on-surface-variant">
                    {biography}
                  </p>
                </article>
              )}

              {activeTab === 'education' && (
                <article>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Đào tạo</h2>
                  <div className="mt-lg grid gap-md">
                    {educationItems.map((item) => (
                      <div className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md" key={item.title}>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">{item.title}</h3>
                        <p className="mt-sm font-body-md text-body-md text-on-surface-variant">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </article>
              )}
            </section>

            <section className="grid gap-lg lg:grid-cols-[320px_minmax(0,1fr)]">
              <DoctorRatingSummary isLoading={ratingLoading} summary={ratingSummary} />
              <div className="space-y-md">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-md text-headline-md text-on-surface">Đánh giá từ bệnh nhân</h2>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {ratingSummary?.totalRatings ?? 0} lượt đánh giá
                  </span>
                </div>
                <DoctorRatingList
                  hasMore={ratingHasMore}
                  isLoading={ratingLoading || ratingListLoading}
                  onLoadMore={handleLoadMoreRatings}
                  ratings={ratingList}
                />
              </div>
            </section>

            <section>
              {!currentUser && (
                <div className="rounded-xl border border-outline-variant/30 bg-surface p-lg shadow-sm">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Đăng nhập để đánh giá bác sĩ.
                  </p>
                </div>
              )}

              {currentUser && currentUser.role === 'PATIENT' && (canRate || myRating) && (
                <DoctorRatingForm
                  canDelete={Boolean(myRating)}
                  error={ratingError}
                  initialComment={myRating?.comment || ''}
                  initialRating={myRating?.rating || 0}
                  isSubmitting={isSubmittingRating}
                  onDelete={handleDeleteRating}
                  onSubmit={handleSubmitRating}
                  success={ratingSuccess}
                />
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default DoctorDetailPage
