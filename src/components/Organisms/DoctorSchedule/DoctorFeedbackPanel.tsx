import Icon from '../../Atoms/Icon'
import type { Feedback } from '../../../services/feedback.service'

type DoctorFeedbackPanelProps = {
  feedback: Feedback[]
}

const ratingValues = [1, 2, 3, 4, 5]

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const getPatientName = (feedback: Feedback) => (
  feedback.patient?.user?.full_name
  || feedback.patient?.user?.email
  || `Bệnh nhân #${feedback.patient_id}`
)

const getFeedbackDate = (feedback: Feedback) => {
  const dateValue = feedback.appointment?.slot?.start_time || feedback.created_at

  return dateValue ? dateFormatter.format(new Date(dateValue)) : 'Chưa có ngày'
}

const DoctorFeedbackPanel = ({ feedback }: DoctorFeedbackPanelProps) => {
  const averageRating = feedback.length
    ? (feedback.reduce((total, item) => total + Number(item.rating || 0), 0) / feedback.length).toFixed(1)
    : '0.0'

  return (
    <section className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
      <div className="mb-lg flex flex-col gap-md md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-sm">
            <Icon className="text-primary" name="reviews" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Đánh giá từ bệnh nhân</h2>
          </div>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
            {feedback.length} đánh giá đã nhận
          </p>
        </div>
        <div className="inline-flex items-center gap-xs rounded-full bg-primary-fixed px-md py-xs text-on-primary-fixed">
          <Icon className="text-lg text-primary" name="star" />
          <span className="font-label-md text-label-md">{averageRating}</span>
        </div>
      </div>

      {feedback.length === 0 ? (
        <div className="rounded-lg border border-dashed border-outline-variant px-md py-xl text-center">
          <Icon className="text-4xl text-outline" name="rate_review" />
          <p className="mt-sm font-label-md text-label-md text-on-surface">Chưa có đánh giá</p>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
            Đánh giá sẽ xuất hiện sau khi bệnh nhân gửi phản hồi cho lịch hẹn đã hoàn tất.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-sm lg:grid-cols-2">
          {feedback.map((item) => (
            <article className="rounded-lg border border-outline-variant/30 bg-surface p-md" key={item.id}>
              <div className="flex flex-col gap-sm sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface">{getPatientName(item)}</h3>
                  <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{getFeedbackDate(item)}</p>
                </div>
                <div className="flex items-center gap-xs">
                  {ratingValues.map((value) => (
                    <Icon
                      className={value <= item.rating ? 'text-lg text-primary' : 'text-lg text-outline'}
                      key={value}
                      name="star"
                    />
                  ))}
                </div>
              </div>

              {item.comment && (
                <p className="mt-md rounded-lg bg-surface-container px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
                  {item.comment}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default DoctorFeedbackPanel
