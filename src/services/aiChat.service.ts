import { apiRequest } from '../api/client'

export type AiChatRole = 'user' | 'assistant'

export type AiChatMessage = {
  role: AiChatRole
  content: string
}

export type AiChatResponse = {
  reply: string
  intent: 'DOCTOR_SEARCH' | 'DOCUMENT_KNOWLEDGE' | 'OUT_OF_SCOPE'
  warningLevel: string
  recommendations: Array<{
    departmentId: number | string
    departmentName: string
    score: number
    reason: string
    matchedSymptoms: string[]
  }>
  doctorRecommendations: Array<{
    doctorId: number | string
    doctorName: string
    departmentName?: string
    availableSlotCount?: number
    nextAvailableSlot?: {
      id: number | string
      startTime: string
      endTime: string
      remaining: number
    } | null
    reason?: string
  }>
  documentMatches: Array<{
    title: string
    similarity: number
  }>
}

export const sendAiChatMessage = (message: string, conversationHistory: AiChatMessage[]) =>
  apiRequest<AiChatResponse>('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      conversationHistory,
    }),
  })
