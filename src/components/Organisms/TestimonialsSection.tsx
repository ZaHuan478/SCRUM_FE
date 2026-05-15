import Icon from '../Atoms/Icon'

const TESTIMONIAL_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHsG5xlnlFWuY_gnUEImrdZUiPq6O-wZwb3lkoGpBCDY9fzsy1D6wLmvMrLF-zUaLIWdaaVdUoo0_1RSPXGbxH3pj1QBhEJVwaj9Ddeynz49Kvv4UWaXRzBJnUF4S1mDK2-CrLNqRbkbuuqZqjJjdacAeYPmXvBOAjogLzPFUqWZOolm3xx4xYmqTR7EQiMipwYnBAwKXAXIf3SRc3lgoT9ydo-JnJcNdwm-GSo6hJsm6KNb3OFtwtCkQep7JFuNUqCwP8Ctc-6gXY'

const TestimonialsSection = () => {
  return (
    <section className="bg-surface-container px-lg py-xxxl md:px-xxl">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-xxl md:grid-cols-2">
        <div>
          <Icon name="format_quote" className="mb-lg text-xxxl text-primary" />
          <h2 className="mb-lg max-w-xl font-display-lg text-4xl font-bold leading-tight text-on-background md:text-display-lg">
            Ý kiến khách hàng về chúng tôi.
          </h2>
          <p className="mb-xl font-body-lg text-body-lg text-on-surface-variant">
            Gia nhập cộng đồng bệnh nhân đã tìm thấy bác sĩ phù hợp thông qua MedPrecision.
          </p>
          <div className="flex gap-md">
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant transition-all hover:bg-primary hover:text-on-primary" type="button">
              <Icon name="arrow_back" />
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant transition-all hover:bg-primary hover:text-on-primary" type="button">
              <Icon name="arrow_forward" />
            </button>
          </div>
        </div>
        <article className="relative overflow-hidden rounded-xl bg-surface p-xxl shadow-xl">
          <div className="mb-lg flex items-center gap-md">
            <img alt="Katherine Miller" className="h-16 w-16 rounded-full object-cover" src={TESTIMONIAL_IMAGE} />
            <div>
              <h4 className="font-label-md text-label-md text-on-background">Katherine Miller</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Bệnh nhân từ năm 2022</p>
            </div>
          </div>
          <p className="font-body-lg text-body-lg italic leading-relaxed text-on-surface">
            "Hệ thống so khớp chính xác tại MedPrecision giúp tôi tiết kiệm rất nhiều thời gian. Quy trình đặt lịch rõ ràng và hồ sơ bác sĩ dễ so sánh."
          </p>
          <div className="mt-lg flex gap-xs">
            {[1, 2, 3, 4, 5].map((item) => (
              <Icon className="text-tertiary" key={item} name="star" />
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

export default TestimonialsSection
