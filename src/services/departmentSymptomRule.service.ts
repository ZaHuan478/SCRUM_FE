import { apiRequest } from '../api/client'
import type { Department } from './department.service'
import type { Symptom } from './symptom.service'

export type DepartmentSymptomRule = {
  id: number | string
  symptom_id: number | string
  department_id: number | string
  score: number
  pre_visit_note?: string | null
  symptom?: Symptom
  department?: Department
}

export type DepartmentSymptomRulesResult = {
  department_symptom_rules: DepartmentSymptomRule[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export type DepartmentSymptomRulePayload = {
  symptom_id?: number | string
  department_id?: number | string
  score?: number | string
  pre_visit_note?: string | null
}

type DepartmentSymptomRuleQuery = {
  page?: number
  limit?: number
  symptom_id?: number | string
  department_id?: number | string
  min_score?: number | string
  max_score?: number | string
}

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

export const getDepartmentSymptomRules = (query: DepartmentSymptomRuleQuery = {}) => {
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.symptom_id) params.set('symptom_id', String(query.symptom_id))
  if (query.department_id) params.set('department_id', String(query.department_id))
  if (query.min_score) params.set('min_score', String(query.min_score))
  if (query.max_score) params.set('max_score', String(query.max_score))

  const search = params.toString()

  return apiRequest<DepartmentSymptomRulesResult>(`/department-symptom-rules${search ? `?${search}` : ''}`)
}

export const createDepartmentSymptomRule = (payload: DepartmentSymptomRulePayload) =>
  apiRequest<DepartmentSymptomRule>('/department-symptom-rules', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateDepartmentSymptomRule = (
  id: number | string,
  payload: Pick<DepartmentSymptomRulePayload, 'pre_visit_note' | 'score'>
) =>
  apiRequest<DepartmentSymptomRule>(`/department-symptom-rules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const deleteDepartmentSymptomRule = (id: number | string) =>
  apiRequest<null>(`/department-symptom-rules/${id}`, {
    method: 'DELETE',
  })
