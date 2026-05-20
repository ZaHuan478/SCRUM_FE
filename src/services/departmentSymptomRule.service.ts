import { apiRequest } from '../api/client'

export type RecommendedDepartment = {
  department_id: number | string
  department_name: string
  total_score: number
  matched_symptoms: string[]
  pre_visit_note?: string | null
  pre_visit_notes?: RecommendedPreVisitNote[]
}

export type RecommendedPreVisitNote = {
  symptom_id: number | string
  symptom_name?: string
  note: string
  score?: number
}

export const recommendDepartmentsBySymptoms = (symptomIds: Array<number | string>) => (
  apiRequest<RecommendedDepartment[]>('/department-symptom-rules/recommend', {
    method: 'POST',
    body: JSON.stringify({ symptom_ids: symptomIds }),
  })
)
