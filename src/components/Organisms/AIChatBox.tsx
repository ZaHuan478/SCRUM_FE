import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ChatButton from '../Atoms/ChatButton'
import ChatInput from '../Atoms/ChatInput'
import Icon from '../Atoms/Icon'
import ChatMessage from '../Molecules/ChatMessage'
import { sendAIChatMessage, sendAIChatMessageStream } from '../../services/aiChatService'
import { AUTH_USER_CHANGED_EVENT, getStoredUser } from '../../services/auth.service'
import type { User } from '../../services/auth.service'
import type { AIChatHistoryItem, AIChatMessage } from '../../types/aiChat.types'
import type { AIChatStreamError } from '../../services/aiChatService'

const CHATBOT_ALLOWED_ROLES: Array<User['role']> = ['PATIENT', 'DOCTOR', 'ADMIN']

const DEFAULT_MESSAGE = 'Xin chào, tôi là trợ lý AI. Bạn đang gặp triệu chứng gì? Tôi có thể gợi ý khoa phù hợp để bạn đặt lịch khám.'

const buildMessage = (message: Omit<AIChatMessage, 'id'>): AIChatMessage => ({
  ...message,
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
})

const buildDefaultMessages = (): AIChatMessage[] => [
  buildMessage({
    role: 'assistant',
    content: DEFAULT_MESSAGE,
    warningLevel: 'NORMAL',
  }),
]

const getStorageKey = (userKey: string) => `ai_chat_messages:${userKey}`

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div
      aria-label="AI dang phan tich"
      className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-surface-container px-md py-sm"
      role="status"
    >
      {[0, 1, 2].map((index) => (
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant"
          key={index}
          style={{ animationDelay: `${index * 140}ms` }}
        />
      ))}
    </div>
  </div>
)

const loadStoredMessages = (userKey: string) => {
  if (userKey === 'guest') return buildDefaultMessages()

  const rawMessages = localStorage.getItem(getStorageKey(userKey))
  if (!rawMessages) return buildDefaultMessages()

  try {
    const parsedMessages = JSON.parse(rawMessages) as AIChatMessage[]

    if (!Array.isArray(parsedMessages) || parsedMessages.length === 0) {
      return buildDefaultMessages()
    }

    return parsedMessages
      .filter((message) => (
        message
        && (message.role === 'user' || message.role === 'assistant')
        && typeof message.content === 'string'
      ))
      .map((message) => ({
        ...message,
        documentMatches: message.documentMatches?.slice(0, 1),
      }))
  } catch {
    return buildDefaultMessages()
  }
}

const AIChatBox = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredUser())
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isWaitingForChunk, setIsWaitingForChunk] = useState(false)
  const [error, setError] = useState('')
  const [messages, setMessages] = useState<AIChatMessage[]>(buildDefaultMessages)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const canUseChatbot = currentUser ? CHATBOT_ALLOWED_ROLES.includes(currentUser.role) : false
  const userKey = currentUser ? `${currentUser.role}:${currentUser.id}` : 'guest'

  useEffect(() => {
    const handleUserChange = (event: Event) => {
      setCurrentUser((event as CustomEvent<User | null>).detail ?? getStoredUser())
    }

    window.addEventListener(AUTH_USER_CHANGED_EVENT, handleUserChange)

    return () => {
      window.removeEventListener(AUTH_USER_CHANGED_EVENT, handleUserChange)
    }
  }, [])

  useEffect(() => {
    setMessages(loadStoredMessages(userKey))
    setInput('')
    setError('')
    setIsLoading(false)
    setIsWaitingForChunk(false)
    setIsOpen(false)
    setIsExpanded(false)
  }, [userKey])

  useEffect(() => {
    if (userKey === 'guest') return

    localStorage.setItem(getStorageKey(userKey), JSON.stringify(messages.slice(-40)))
  }, [messages, userKey])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isLoading, isOpen])

  useEffect(() => {
    if (!isOpen) {
      setIsExpanded(false)
    }
  }, [isOpen])

  const conversationHistory = useMemo<AIChatHistoryItem[]>(() => (
    messages.map((message) => ({
      role: message.role,
      content: message.content,
    }))
  ), [messages])

  const handleSubmit = useCallback(async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput || isLoading) return

    const userMessage = buildMessage({
      role: 'user',
      content: trimmedInput,
    })

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setInput('')
    setError('')
    setIsLoading(true)
    setIsWaitingForChunk(true)

    try {
      const assistantMessage = buildMessage({
        role: 'assistant',
        content: '',
      })
      let replyContent = ''

      const upsertAssistantMessage = (patch: Partial<AIChatMessage>) => {
        setMessages((currentMessages) => {
          const exists = currentMessages.some((message) => message.id === assistantMessage.id)
          const nextMessage = {
            ...assistantMessage,
            ...patch,
          }

          if (!exists) {
            return [...currentMessages, nextMessage]
          }

          return currentMessages.map((message) => (
            message.id === assistantMessage.id ? { ...message, ...nextMessage } : message
          ))
        })
      }

      await sendAIChatMessageStream(
        {
          message: trimmedInput,
          conversationHistory,
        },
        {
          onChunk: (text) => {
            replyContent += text
            setIsWaitingForChunk(false)
            upsertAssistantMessage({
              content: replyContent,
            })
          },
          onDone: (response) => {
            setIsWaitingForChunk(false)
            upsertAssistantMessage({
              content: response.reply || replyContent,
              documentMatches: response.documentMatches,
              doctorRecommendations: response.doctorRecommendations,
              recommendations: response.recommendations,
              warningLevel: response.warningLevel,
            })
          },
        },
      )
    } catch (requestError) {
      const status = requestError instanceof Error ? (requestError as { status?: number }).status : undefined
      const streamError = requestError as AIChatStreamError

      if (streamError.partialReply) {
        setError('')
        return
      }

      if (status !== 401) {
        try {
          const response = await sendAIChatMessage({
            message: trimmedInput,
            conversationHistory,
          })

          setMessages((currentMessages) => [
            ...currentMessages,
            buildMessage({
              role: 'assistant',
              content: response.reply,
              documentMatches: response.documentMatches?.slice(0, 1),
              doctorRecommendations: response.doctorRecommendations,
              recommendations: response.recommendations,
              warningLevel: response.warningLevel,
            }),
          ])
          return
        } catch {
          // Fall through to the user-facing error below.
        }
      }
      setError(status === 401 ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' : 'Không thể gọi trợ lý AI lúc này.')
    } finally {
      setIsLoading(false)
      setIsWaitingForChunk(false)
    }
  }, [conversationHistory, input, isLoading])

  if (!canUseChatbot) return null

  return (
    <>
      {isOpen && (
        <section
          className={`fixed z-40 flex flex-col overflow-hidden border border-outline-variant/30 bg-surface-container-lowest shadow-2xl transition-all ${
            isExpanded
              ? 'bottom-6 right-4 top-20 w-[calc(100vw-2rem)] rounded-2xl sm:right-5 sm:top-24 sm:w-[50vw] sm:min-w-[520px] sm:max-w-[860px]'
              : 'bottom-24 right-4 h-[min(640px,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-md rounded-2xl sm:right-5'
          }`}
        >
          <header className="flex items-center justify-between border-b border-outline-variant/30 bg-primary px-md py-sm text-on-primary">
            <div className="flex items-center gap-sm">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-on-primary/10">
                <Icon name="smart_toy" />
              </span>
              <div>
                <h2 className="font-label-md text-label-md">Trợ lý AI</h2>
                <p className="font-body-sm text-body-sm text-on-primary/80">Gợi ý khoa khám tham khảo</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-xs">
              <button
                aria-label={isExpanded ? 'Thu nho chat' : 'Phong to chat'}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-on-primary/10"
                onClick={() => setIsExpanded((current) => !current)}
                title={isExpanded ? 'Thu nho' : 'Phong to'}
                type="button"
              >
                <Icon name={isExpanded ? 'close_fullscreen' : 'open_in_full'} />
              </button>
              <button
                aria-label="Thu gon chat"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-on-primary/10"
                onClick={() => setIsOpen(false)}
                title="Thu gon"
                type="button"
              >
                <Icon name="remove" />
              </button>
            </div>
            <button
              aria-label="Đóng chat"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-on-primary/10"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <Icon name="close" />
            </button>
          </header>

          <div
            className="flex-1 space-y-md overflow-y-auto p-md"
            ref={scrollRef}
          >
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && isWaitingForChunk && (
              <TypingIndicator />
            )}

            {error && (
              <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
                {error}
              </p>
            )}
          </div>

          <ChatInput
            disabled={isLoading}
            onChange={setInput}
            onSubmit={handleSubmit}
            value={input}
          />
        </section>
      )}

      <ChatButton isOpen={isOpen} onClick={() => setIsOpen((current) => !current)} />
    </>
  )
}

export default AIChatBox
