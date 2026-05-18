import { apiRequest } from '../api/client'

export type RecommendedDepartment = {
  department_id: number | string
  department_name: string
  total_score: number
  matched_symptoms: string[]
}

export const recommendDepartmentsBySymptoms = (symptomIds: Array<number | string>) => (
  apiRequest<RecommendedDepartment[]>('/department-symptom-rules/recommend', {
    method: 'POST',
    body: JSON.stringify({ symptom_ids: symptomIds }),
  })
)
