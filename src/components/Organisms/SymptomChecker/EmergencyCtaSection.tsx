import Button from '../../Atoms/Button'

const EmergencyCtaSection = () => {
  return (
    <section className="mt-xxl bg-inverse-surface py-xxl">
      <div className="mx-auto flex max-w-[1366px] flex-col items-center justify-between gap-xl px-lg md:flex-row md:px-xxl">
        <div className="space-y-sm text-inverse-on-surface">
          <h2 className="font-headline-lg text-headline-lg">Cần hỗ trợ ngay lập tức?</h2>
          <p className="font-body-lg text-body-lg opacity-90">
            Các điều phối viên khẩn cấp của chúng tôi luôn sẵn sàng 24/7 để giúp bạn xử lý các tình huống cấp bách.
          </p>
        </div>
        <div className="flex w-full flex-col gap-md sm:flex-row md:w-auto">
          <Button className="bg-surface px-xxl py-md text-primary hover:bg-surface-bright" type="button">
            Gọi tổng đài
          </Button>
          <Button className="border-inverse-on-surface px-xxl py-md text-inverse-on-surface hover:bg-surface/10" type="button" variant="ghost">
            Chat với AI
          </Button>
        </div>
      </div>
    </section>
  )
}

export default EmergencyCtaSection
