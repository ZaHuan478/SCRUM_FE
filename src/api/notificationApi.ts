import { apiRequest } from '../api/client'
import type { Notification, NotificationsResult } from '../types/notification'

type UnreadCountResult = {
  unread_count: number
}

export const getNotifications = (page = 1, limit = 10) => {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))

  return apiRequest<NotificationsResult>(`/notifications?${params.toString()}`)
}

export const getUnreadCount = async () => {
  const result = await apiRequest<UnreadCountResult>('/notifications/unread-count')
  return result.unread_count
}

export const markNotificationAsRead = (id: number | string) =>
  apiRequest<Notification>(`/notifications/${id}/read`, {
    method: 'PATCH',
  })

export const markAllNotificationsAsRead = () =>
  apiRequest<{ updated_count: number }>('/notifications/read-all', {
    method: 'PATCH',
  })
