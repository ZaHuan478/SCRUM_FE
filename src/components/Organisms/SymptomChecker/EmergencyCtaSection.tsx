import { useState } from 'react'
import Button from '../../Atoms/Button'
import AiChatPanel from './AiChatPanel'

const EmergencyCtaSection = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <section className="mt-xxl bg-primary py-xxl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-xl px-lg md:flex-row md:px-xxl">
          <div className="space-y-sm text-on-primary">
            <h2 className="font-headline-lg text-headline-lg">Cần hỗ trợ ngay lập tức?</h2>
            <p className="font-body-lg text-body-lg opacity-90">
              Các điều phối viên khẩn cấp của chúng tôi luôn sẵn sàng 24/7 để giúp bạn xử lý các tình huống cấp bách.
            </p>
          </div>
          <div className="flex w-full flex-col gap-md sm:flex-row md:w-auto">
            <Button
              className="bg-on-primary px-xxl py-md text-primary hover:bg-surface-bright"
              onClick={() => {
                window.location.href = 'tel:115'
              }}
              type="button"
            >
              Gọi tổng đài
            </Button>
            <Button
              className="border-on-primary px-xxl py-md text-on-primary hover:bg-white/10"
              onClick={() => setIsChatOpen(true)}
              type="button"
              variant="ghost"
            >
              Chat với AI
            </Button>
          </div>
        </div>
      </section>
      {isChatOpen && <AiChatPanel onClose={() => setIsChatOpen(false)} />}
    </>
  )
}

export default EmergencyCtaSection
