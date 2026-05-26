export type AIChatRole = 'user' | 'assistant'

export type AIChatHistoryItem = {
  role: AIChatRole
  content: string
}

export type AIChatRecommendation = {
  departmentId: number | string
  departmentName: string
  score: number
  reason: string
  matchedSymptoms: string[]
}

export type AIChatDoctorRecommendation = {
  doctorId: number | string
  doctorName: string
  imageUrl?: string | null
  departmentId: number | string
  departmentName: string
  position?: string | null
  experienceYears?: number | null
  availableSlotCount: number
  nextAvailableSlot?: {
    id: number | string
    startTime: string
    endTime: string
    remaining: number
  } | null
  score: number
  reason: string
}

export type AIChatWarningLevel = 'NORMAL' | 'EMERGENCY'
export type AIChatIntent = 'DOCUMENT_KNOWLEDGE' | 'DOCTOR_SEARCH' | 'OUT_OF_SCOPE' | 'HOSPITAL_DATA'

export type AIChatDocumentMatch = {
  rank: number
  documentId?: number | string | null
  chunkId: number | string
  title: string
  content: string
  similarity: number
}

export type AIChatResponse = {
  reply: string
  recommendations: AIChatRecommendation[]
  doctorRecommendations?: AIChatDoctorRecommendation[]
  documentMatches?: AIChatDocumentMatch[]
  hospitalData?: unknown
  intent?: AIChatIntent
  warningLevel: AIChatWarningLevel
  matchedSymptoms?: Array<{
    id: number | string
    name: string
    bodyPart?: string | null
    description?: string | null
    matchScore?: number
  }>
}

export type AIChatMessage = AIChatHistoryItem & {
  id: string
  recommendations?: AIChatRecommendation[]
  doctorRecommendations?: AIChatDoctorRecommendation[]
  documentMatches?: AIChatDocumentMatch[]
  hospitalData?: unknown
  intent?: AIChatIntent
  warningLevel?: AIChatWarningLevel
}
