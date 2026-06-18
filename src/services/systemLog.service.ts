import { apiRequest } from '../api/client'
import type { User } from './auth.service'

export type SystemLog = {
  id: number | string
  actor_user_id?: number | string | null
  action: string
  target_type?: string | null
  target_id?: number | string | null
  description?: string | null
  created_at: string
  actor?: Pick<User, 'id' | 'full_name' | 'email' | 'role'> | null
}

export type SystemLogsResult = {
  system_logs: SystemLog[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export const getSystemLogs = (query: { page?: number; limit?: number } = {}) => {
  const params = new URLSearchParams()

  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))

  const search = params.toString()
  return apiRequest<SystemLogsResult>(`/super-admin/system-logs${search ? `?${search}` : ''}`)
}
