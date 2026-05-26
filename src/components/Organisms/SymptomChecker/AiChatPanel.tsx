import { useRef, useState } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import { sendAiChatMessage } from '../../../services/aiChat.service'
import type { AiChatMessage, AiChatResponse } from '../../../services/aiChat.service'

type AiChatPanelProps = {
  onClose: () => void
}

const quickPrompts = [
  'Tôi bị đau ngực và khó thở, nên khám khoa nào?',
  'Tôi sốt nhẹ và đau đầu 2 ngày nay, nên đặt lịch khoa nào?',
  'Tài liệu nói gì về quy trình đặt lịch và tiếp nhận bệnh nhân?',
]

const AiChatPanel = ({ onClose }: AiChatPanelProps) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: 'assistant',
      content: 'Xin chào, tôi có thể hỗ trợ gợi ý khoa, bác sĩ hoặc tra cứu tài liệu bệnh viện.',
    },
  ])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [lastResult, setLastResult] = useState<AiChatResponse | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const submitMessage = async (nextInput = input) => {
    const content = nextInput.trim()
    if (!content || isSending) return

    const userMessage: AiChatMessage = { role: 'user', content }
    const history = messages.slice(-8)
    setMessages((current) => [...current, userMessage])
    setInput('')
    setError('')
    setIsSending(true)

    try {
      const result = await sendAiChatMessage(content, history)
      setLastResult(result)
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: result.reply,
        },
      ])
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Không thể gọi AI chatbot.'
      setError(message)
    } finally {
      setIsSending(false)
      window.setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-end bg-black/40 px-md py-md backdrop-blur-sm md:items-center md:justify-center">
      <section className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-2xl">
        <header className="flex items-center justify-between gap-md border-b border-outline-variant/20 px-lg py-md">
          <div className="flex items-center gap-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed text-primary">
              <Icon name="smart_toy" />
            </span>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">AI Chatbot</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Gợi ý khoa, bác sĩ và tra cứu tài liệu</p>
            </div>
          </div>
          <button
            aria-label="Đóng chatbot"
            className="rounded-full p-sm text-on-surface-variant transition-colors hover:bg-surface-container-high"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-md overflow-y-auto px-lg py-md">
          {messages.map((message, index) => (
            <article
              className={`max-w-[92%] rounded-lg px-md py-sm font-body-sm text-body-sm leading-relaxed ${
                message.role === 'user'
                  ? 'ml-auto bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface'
              }`}
              key={`${message.role}-${index}`}
            >
              {message.content}
            </article>
          ))}

          {isSending && (
            <p className="self-start rounded-lg bg-surface-container px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
              AI đang xử lý...
            </p>
          )}

          {error && (
            <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
              {error}
            </p>
          )}

          {lastResult && (
            <aside className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-md py-sm">
              <p className="font-label-md text-label-md text-on-surface">Kết quả kỹ thuật</p>
              <div className="mt-xs grid gap-xs font-body-sm text-body-sm text-on-surface-variant sm:grid-cols-2">
                <span>Intent: {lastResult.intent}</span>
                <span>Cảnh báo: {lastResult.warningLevel}</span>
                <span>Khoa top: {lastResult.recommendations[0]?.departmentName || 'Không có'}</span>
                <span>Bác sĩ top: {lastResult.doctorRecommendations[0]?.doctorName || 'Không có'}</span>
              </div>
            </aside>
          )}
        </div>

        <footer className="border-t border-outline-variant/20 px-lg py-md">
          <div className="mb-sm flex flex-wrap gap-xs">
            {quickPrompts.map((prompt) => (
              <button
                className="rounded-full border border-outline-variant bg-surface px-sm py-xs font-label-sm text-label-sm text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSending}
                key={prompt}
                onClick={() => {
                  void submitMessage(prompt)
                }}
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-sm sm:flex-row">
            <textarea
              className="min-h-20 flex-1 rounded-lg border border-outline-variant px-md py-sm font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  void submitMessage()
                }
              }}
              placeholder="Nhập câu hỏi cho AI..."
              ref={inputRef}
              value={input}
            />
            <Button
              className="inline-flex min-w-32 items-center justify-center gap-xs px-lg py-sm"
              disabled={!input.trim()}
              fullWidth={false}
              isLoading={isSending}
              onClick={() => {
                void submitMessage()
              }}
              type="button"
            >
              <Icon className="text-lg" name="send" />
              Gửi
            </Button>
          </div>
        </footer>
      </section>
    </div>
  )
}

export default AiChatPanel
