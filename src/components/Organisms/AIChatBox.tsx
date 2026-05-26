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
import { useTranslation } from '../../contexts/LanguageContext'
import { OPEN_AI_CHAT_EVENT } from '../../constants/aiChatEvents'

const CHATBOT_ALLOWED_ROLES: Array<User['role']> = ['PATIENT', 'DOCTOR', 'ADMIN']

const buildMessage = (message: Omit<AIChatMessage, 'id'>): AIChatMessage => ({
  ...message,
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
})

const buildDefaultMessages = (content: string): AIChatMessage[] => [
  buildMessage({
    role: 'assistant',
    content,
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

const loadStoredMessages = (userKey: string, defaultMessage: string) => {
  if (userKey === 'guest') return buildDefaultMessages(defaultMessage)

  const rawMessages = localStorage.getItem(getStorageKey(userKey))
  if (!rawMessages) return buildDefaultMessages(defaultMessage)

  try {
    const parsedMessages = JSON.parse(rawMessages) as AIChatMessage[]

    if (!Array.isArray(parsedMessages) || parsedMessages.length === 0) {
      return buildDefaultMessages(defaultMessage)
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
    return buildDefaultMessages(defaultMessage)
  }
}

const AIChatBox = () => {
  const { t } = useTranslation()
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredUser())
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isWaitingForChunk, setIsWaitingForChunk] = useState(false)
  const [error, setError] = useState('')
  const [messages, setMessages] = useState<AIChatMessage[]>(() => buildDefaultMessages(t('aiChat.defaultMessage')))
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
    setMessages(loadStoredMessages(userKey, t('aiChat.defaultMessage')))
    setInput('')
    setError('')
    setIsLoading(false)
    setIsWaitingForChunk(false)
    setIsOpen(false)
    setIsExpanded(false)
  }, [t, userKey])

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

  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true)
    }

    window.addEventListener(OPEN_AI_CHAT_EVENT, handleOpenChat)

    return () => {
      window.removeEventListener(OPEN_AI_CHAT_EVENT, handleOpenChat)
    }
  }, [])

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
      setError(status === 401 ? t('aiChat.sessionExpired') : t('aiChat.unavailable'))
    } finally {
      setIsLoading(false)
      setIsWaitingForChunk(false)
    }
  }, [conversationHistory, input, isLoading, t])

  if (!canUseChatbot) return null

  return (
    <>
      {isOpen && (
        <section
          className={`fixed z-40 flex flex-col overflow-hidden border border-outline-variant/30 bg-surface-container-lowest shadow-2xl transition-all ${
            isExpanded
              ? 'bottom-4 left-4 right-4 top-20 rounded-xl sm:left-auto sm:right-5 sm:top-24 sm:w-[min(860px,calc(100vw-2.5rem))]'
              : 'bottom-24 left-4 right-4 h-[min(640px,calc(100dvh-7rem))] rounded-xl sm:left-auto sm:right-5 sm:w-[min(28rem,calc(100vw-2.5rem))]'
          }`}
        >
          <header className="flex items-center justify-between gap-sm border-b border-outline-variant/30 bg-primary px-md py-sm text-on-primary">
            <div className="flex min-w-0 items-center gap-sm">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded bg-on-primary/10">
                <Icon name="smart_toy" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate font-label-md text-label-md">{t('aiChat.title')}</h2>
                <p className="truncate font-body-sm text-body-sm text-on-primary/80">{t('aiChat.subtitle')}</p>
              </div>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-xs">
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
