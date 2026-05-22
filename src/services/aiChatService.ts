import { apiRequest, getApiUrl, getAuthToken } from '../api/client'
import type { AIChatHistoryItem, AIChatResponse } from '../types/aiChat.types'

export type SendAIChatPayload = {
  message: string
  conversationHistory?: AIChatHistoryItem[]
}

export const sendAIChatMessage = (payload: SendAIChatPayload) =>
  apiRequest<AIChatResponse>('/ai/chat', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

type StreamEvent = {
  event: string
  data: unknown
}

type StreamHandlers = {
  onStart?: () => void
  onChunk?: (text: string) => void
  onDone?: (data: AIChatResponse) => void
}

export type AIChatStreamError = Error & {
  status?: number
  partialReply?: string
}

const parseSseEvent = (block: string): StreamEvent | null => {
  const lines = block.split(/\r?\n/)
  const event = lines
    .find((line) => line.startsWith('event:'))
    ?.replace(/^event:\s*/, '')
    .trim() || 'message'
  const data = lines
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.replace(/^data:\s*/, ''))
    .join('\n')

  if (!data) return null

  try {
    return {
      event,
      data: JSON.parse(data),
    }
  } catch {
    return null
  }
}

export const sendAIChatMessageStream = async (
  payload: SendAIChatPayload,
  handlers: StreamHandlers = {},
) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
  })
  const token = getAuthToken()

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(getApiUrl('/ai/chat/stream'), {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok || !response.body) {
    const error = new Error(`Request failed with status ${response.status}`) as Error & { status?: number }
    error.status = response.status
    throw error
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let doneData: AIChatResponse | null = null
  let partialReply = ''

  const createStreamError = (message: string, status?: number) => {
    const error = new Error(message) as AIChatStreamError
    error.status = status
    error.partialReply = partialReply
    return error
  }

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const blocks = buffer.split(/\r?\n\r?\n/)
    buffer = blocks.pop() || ''

    blocks.forEach((block) => {
      const parsed = parseSseEvent(block)
      if (!parsed) return

      if (parsed.event === 'start') {
        handlers.onStart?.()
      }

      if (parsed.event === 'chunk') {
        const text = (parsed.data as { text?: string }).text || ''
        if (text) {
          partialReply += text
          handlers.onChunk?.(text)
        }
      }

      if (parsed.event === 'done') {
        doneData = parsed.data as AIChatResponse
        handlers.onDone?.(doneData)
      }

      if (parsed.event === 'error') {
        const payloadError = parsed.data as { message?: string; statusCode?: number }
        throw createStreamError(payloadError.message || 'AI stream failed', payloadError.statusCode)
      }
    })
  }

  if (buffer.trim()) {
    const parsed = parseSseEvent(buffer)
    if (parsed?.event === 'done') {
      doneData = parsed.data as AIChatResponse
      handlers.onDone?.(doneData)
    }
  }

  if (!doneData) {
    throw createStreamError('AI stream ended before completion')
  }

  return doneData
}
