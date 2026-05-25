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
    <div className="min-h-screen bg-background text-on-background">
      <TopNavBar active="doctors" />
      <main className="mx-auto flex max-w-[1366px] flex-col gap-xl px-lg py-[48px] md:px-xxl md:py-[64px]">
        <Link className="inline-flex items-center gap-xs self-start font-label-md text-label-md text-primary hover:underline" to="/doctors">
          <Icon name="arrow_back" className="text-[20px]" />
          {t('doctorDetail.back')}
        </Link>

        {status === 'loading' && (
          <section className="rounded-xl border border-outline-variant bg-surface p-xl font-body-md text-body-md text-on-surface-variant">
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
            <section className="grid gap-xl rounded-xl border border-outline-variant bg-surface p-lg shadow-[0_2px_8px_rgba(26,26,26,0.08)] lg:grid-cols-[280px_minmax(0,1fr)] lg:p-xl">
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
                  <h1 className="mt-sm font-headline-lg text-[32px] font-medium leading-none text-on-background sm:text-[40px] md:text-[44px]">
                    {doctor.user?.full_name || doctor.license_number}
                  </h1>
                  <p className="mt-sm max-w-3xl font-body-md text-body-md text-on-surface-variant">
                    {doctor.description ? translateDoctorDescription(doctor.description, language) : t('doctorDetail.fallbackDescription')}
                  </p>
                </div>
                <div className="grid gap-md sm:grid-cols-4">
                  <div className="rounded-lg border border-outline-variant bg-surface-container-low p-md">
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{t('doctorDetail.experience')}</p>
                    <p className="mt-xs font-label-md text-label-md text-on-surface">
                      {doctor.experience_years ? t('doctorDetail.yearsShort', { years: doctor.experience_years }) : t('doctorDetail.updating')}
                    </p>
                  </div>
                  <div className="rounded-lg border border-outline-variant bg-surface-container-low p-md">
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{t('doctorDetail.fee')}</p>
                    <p className="mt-xs font-label-md text-label-md text-on-surface">
                      {doctor.consultation_fee === undefined || doctor.consultation_fee === null || doctor.consultation_fee === ''
                        ? t('doctorDetail.updating')
                        : formatFee(doctor.consultation_fee)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-outline-variant bg-surface-container-low p-md">
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{t('doctorDetail.status')}</p>
                    <p className="mt-xs font-label-md text-label-md text-primary">
                      {doctor.status === 'ACTIVE' ? t('doctorDetail.acceptingAppointments') : t('doctorDetail.paused')}
                    </p>
                  </div>
                  <div className="rounded-lg border border-outline-variant bg-surface-container-low p-md">
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
                    className="inline-flex min-h-11 items-center justify-center rounded bg-primary px-lg py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-primary transition-colors hover:bg-primary-container"
                    to={bookingPath}
                  >
                    {t('doctorDetail.bookAppointment')}
                  </Link>
                  {doctor.user?.phone && (
                    <a className="inline-flex min-h-11 items-center justify-center rounded border border-outline-variant bg-surface px-lg py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-surface hover:border-primary hover:text-primary" href={`tel:${doctor.user.phone}`}>
                      {doctor.user.phone}
                    </a>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-outline-variant bg-surface p-lg shadow-[0_2px_8px_rgba(26,26,26,0.08)] lg:p-xl">
              <div className="mb-lg flex flex-wrap gap-sm border-b border-outline-variant pb-md">
                {[
                  { id: 'biography', label: t('doctorDetail.biographyTab') },
                  { id: 'education', label: t('doctorDetail.educationTab') },
                ].map((tab) => (
                  <Button
                    className={`rounded-none border-x-0 border-t-0 px-md py-sm shadow-none ${
                      activeTab === tab.id
                        ? 'border-b-2 border-primary text-primary'
                        : 'border-b-2 border-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
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
                      <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md" key={item.title}>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">{item.title}</h3>
                        <p className="mt-sm font-body-md text-body-md text-on-surface-variant">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </article>
              )}
            </section>

            <section className="rounded-xl border border-outline-variant bg-surface p-lg shadow-[0_2px_8px_rgba(26,26,26,0.08)] lg:p-xl">
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
                <div className="rounded-xl border border-outline-variant bg-surface p-lg shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
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
