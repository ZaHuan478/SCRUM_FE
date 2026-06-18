import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from '../contexts/LanguageContext'
import Image from '../components/Atoms/Image'
import Icon from '../components/Atoms/Icon'
import Button from '../components/Atoms/Button'
import TopNavBar from '../components/Organisms/TopNavBar'
import DoctorRatingForm from '../components/DoctorRating/DoctorRatingForm'
import DoctorRatingList from '../components/DoctorRating/DoctorRatingList'
import DoctorRatingSummary from '../components/DoctorRating/DoctorRatingSummary'
import { useDoctorDetail } from '../hooks/useDoctorDetail'
import { formatFee } from '../utils/doctorDetail'
import { translateDoctorDescription } from '../utils/contentTranslation'
import type { DetailTab } from '../utils/doctorDetail'

const DoctorDetailPage = () => {
  const { language, t } = useTranslation()
  const { doctorId } = useParams()
  const [activeTab, setActiveTab] = useState<DetailTab>('biography')
  const {
    biography,
    bookingPath,
    canRate,
    currentUser,
    doctor,
    educationItems,
    handleDeleteRating,
    handleLoadMoreRatings,
    handleSubmitRating,
    hasDoctorId,
    isSubmittingRating,
    myRating,
    primarySpecialty,
    ratingError,
    ratingHasMore,
    ratingList,
    ratingListLoading,
    ratingLoading,
    ratingSuccess,
    ratingSummary,
    status,
  } = useDoctorDetail(doctorId)

  return (
    <div className="hp-home hp-soft-home min-h-screen text-on-background">
      <TopNavBar active="doctors" variant="softHome" />
      <main className="mx-auto flex max-w-[1366px] flex-col gap-xl px-lg pb-[72px] pt-[132px] md:px-xxl md:pb-[96px] md:pt-[152px]">
        <Link className="inline-flex items-center gap-xs self-start rounded-full border border-outline-variant/45 bg-surface/74 px-md py-sm font-label-md text-label-md text-primary shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-primary/45" to="/doctors">
          <Icon name="arrow_back" className="text-[20px]" />
          {t('doctorDetail.back')}
        </Link>

        {status === 'loading' && (
          <section className="rounded-2xl border border-outline-variant/45 bg-surface/78 p-xl font-body-md text-body-md text-on-surface-variant shadow-sm backdrop-blur-xl">
            {t('doctorDetail.loading')}
          </section>
        )}

        {(!hasDoctorId || status === 'error') && (
          <section className="rounded-xl bg-error-container p-xl text-on-error-container">
            <p className="font-label-md text-label-md">{t('doctorDetail.errorTitle')}</p>
            <p className="mt-xs font-body-sm text-body-sm">{t('doctorDetail.errorDescription')}</p>
          </section>
        )}

        {status === 'ready' && doctor && (
          <>
            <section className="grid gap-xl rounded-[2rem] border border-white/70 bg-surface/78 p-lg shadow-[0_26px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl lg:grid-cols-[320px_minmax(0,1fr)] lg:p-xl">
              <div className="relative overflow-hidden rounded-[1.75rem] bg-surface-variant shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                <Image
                  alt={doctor.user?.full_name || doctor.license_number}
                  className="aspect-[4/5] h-full w-full object-cover"
                  fallbackClassName="aspect-[4/5] h-full w-full"
                  src={doctor.image_url || undefined}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-background/42 via-transparent to-transparent" />
                <div className="absolute left-md top-md rounded-full bg-surface/88 px-md py-xs font-label-sm text-label-sm text-primary shadow-sm backdrop-blur-xl">
                  {doctor.status === 'ACTIVE' ? t('doctorDetail.acceptingAppointments') : t('doctorDetail.paused')}
                </div>
              </div>
              <div className="flex flex-col gap-lg">
                <div>
                  <p className="inline-flex items-center gap-sm font-label-sm text-label-sm uppercase tracking-[0.24em] text-primary">
                    <span className="h-1 w-10 rounded-full bg-primary" />
                    {primarySpecialty}
                  </p>
                  <h1 className="mt-md font-headline-lg text-[42px] font-semibold uppercase leading-[0.92] text-on-background sm:text-[56px] md:text-[72px]">
                    {doctor.user?.full_name || doctor.license_number}
                  </h1>
                  <p className="mt-md max-w-3xl font-body-md text-body-md leading-7 text-on-surface-variant">
                    {doctor.description ? translateDoctorDescription(doctor.description, language) : t('doctorDetail.fallbackDescription')}
                  </p>
                </div>
                <div className="grid gap-md sm:grid-cols-4">
                  <div className="rounded-2xl border border-outline-variant/35 bg-primary-fixed/28 p-md shadow-inner">
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{t('doctorDetail.experience')}</p>
                    <p className="mt-xs font-label-md text-label-md text-on-surface">
                      {doctor.experience_years ? t('doctorDetail.yearsShort', { years: doctor.experience_years }) : t('doctorDetail.updating')}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-outline-variant/35 bg-primary-fixed/28 p-md shadow-inner">
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{t('doctorDetail.fee')}</p>
                    <p className="mt-xs font-label-md text-label-md text-on-surface">
                      {doctor.consultation_fee === undefined || doctor.consultation_fee === null || doctor.consultation_fee === ''
                        ? t('doctorDetail.updating')
                        : formatFee(doctor.consultation_fee)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-outline-variant/35 bg-primary-fixed/28 p-md shadow-inner">
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{t('doctorDetail.status')}</p>
                    <p className="mt-xs font-label-md text-label-md text-primary">
                      {doctor.status === 'ACTIVE' ? t('doctorDetail.acceptingAppointments') : t('doctorDetail.paused')}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-outline-variant/35 bg-primary-fixed/28 p-md shadow-inner">
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{t('doctorDetail.reviews')}</p>
                    <p className="mt-xs font-label-md text-label-md text-on-surface">
                      {ratingSummary?.totalRatings
                        ? `${ratingSummary.averageRating.toFixed(1)}/5`
                        : t('doctorDetail.noReviews')}
                    </p>
                    <p className="mt-xxs font-body-sm text-body-sm text-on-surface-variant">
                      {ratingSummary?.totalRatings
                        ? t('doctorDetail.reviewCount', { count: ratingSummary.totalRatings })
                        : t('doctorDetail.noReviews')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-sm">
                  <Link
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-primary px-lg py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-primary shadow-[0_16px_32px_rgba(2,132,199,0.22)] transition-all hover:-translate-y-0.5 hover:bg-primary-container"
                    to={bookingPath}
                  >
                    {t('doctorDetail.bookAppointment')}
                  </Link>
                  {doctor.user?.phone && (
                    <a className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-outline-variant/45 bg-surface/76 px-lg py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-surface shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:text-primary" href={`tel:${doctor.user.phone}`}>
                      {doctor.user.phone}
                    </a>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/70 bg-surface/78 p-lg shadow-[0_22px_58px_rgba(15,23,42,0.10)] backdrop-blur-2xl lg:p-xl">
              <div className="mb-lg flex flex-wrap gap-sm border-b border-outline-variant/35 pb-md">
                {[
                  { id: 'biography', label: t('doctorDetail.biographyTab') },
                  { id: 'education', label: t('doctorDetail.educationTab') },
                ].map((tab) => (
                  <Button
                    className={`rounded-2xl px-md py-sm shadow-none ${
                      activeTab === tab.id
                        ? 'border-primary/35 bg-primary-fixed/35 text-primary'
                        : 'border-transparent text-on-surface-variant hover:bg-primary-fixed/25 hover:text-primary'
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
                  <h2 className="font-headline-md text-headline-md text-on-surface">{t('doctorDetail.biographyTitle')}</h2>
                  <p className="mt-md max-w-4xl whitespace-pre-line font-body-md text-body-md text-on-surface-variant">
                    {biography}
                  </p>
                </article>
              )}

              {activeTab === 'education' && (
                <article>
                  <h2 className="font-headline-md text-headline-md text-on-surface">{t('doctorDetail.educationTitle')}</h2>
                  <div className="mt-lg grid gap-md">
                    {educationItems.map((item) => (
                      <div className="rounded-2xl border border-outline-variant/35 bg-surface/70 p-md shadow-sm backdrop-blur-xl" key={item.title}>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">{item.title}</h3>
                        <p className="mt-sm font-body-md text-body-md text-on-surface-variant">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </article>
              )}
            </section>

            <section className="rounded-[2rem] border border-white/70 bg-surface/78 p-lg shadow-[0_22px_58px_rgba(15,23,42,0.10)] backdrop-blur-2xl lg:p-xl">
              <div className="mb-lg flex items-center justify-between gap-md">
                <h2 className="font-headline-md text-headline-md text-on-surface">{t('doctorDetail.patientReviews')}</h2>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {t('doctorDetail.reviewCount', { count: ratingSummary?.totalRatings ?? 0 })}
                </span>
              </div>
              <div className="grid gap-lg lg:grid-cols-[320px_minmax(0,1fr)]">
                <DoctorRatingSummary framed={false} isLoading={ratingLoading} summary={ratingSummary} />
                <DoctorRatingList
                  framed={false}
                  hasMore={ratingHasMore}
                  isLoading={ratingLoading || ratingListLoading}
                  onLoadMore={handleLoadMoreRatings}
                  ratings={ratingList}
                />
              </div>
            </section>

            <section>
              {!currentUser && (
                <div className="rounded-[2rem] border border-white/70 bg-surface/78 p-lg shadow-[0_22px_58px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {t('doctorDetail.loginToReview')}
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
