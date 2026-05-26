import Button from '../../Atoms/Button'
import { OPEN_AI_CHAT_EVENT } from '../../../constants/aiChatEvents'

type EmergencyCtaSectionProps = {
  className?: string
}

const EmergencyCtaSection = ({ className = 'mt-xxl' }: EmergencyCtaSectionProps) => {
  const handleOpenAIChat = () => {
    window.dispatchEvent(new Event(OPEN_AI_CHAT_EVENT))
  }

  return (
    <section className={`${className} bg-primary py-xxl`}>
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-xl px-lg text-on-primary md:flex-row md:items-center md:px-xxl">
        <div className="max-w-3xl space-y-sm">
          <h2 className="font-headline-lg text-headline-lg text-on-primary">Cần hỗ trợ ngay lập tức?</h2>
          <p className="font-body-lg text-body-lg text-on-primary/90">
            Các điều phối viên khẩn cấp của chúng tôi luôn sẵn sàng 24/7 để giúp bạn xử lý các tình huống cấp bách.
          </p>
        </div>
        <div className="flex w-full flex-col gap-md sm:flex-row md:w-auto">
          <Button className="min-w-40 border-on-primary/70 px-xxl py-md text-on-primary hover:bg-on-primary/10" onClick={handleOpenAIChat} type="button" variant="ghost">
            Chat với AI
          </Button>
        </div>
      </div>
    </section>
  )
}

export default EmergencyCtaSection
