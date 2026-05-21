/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../api/notificationApi'
import { AUTH_USER_CHANGED_EVENT, getStoredUser } from '../services/auth.service'
import { connectSocket, disconnectSocket, onNewNotification } from '../services/socket'
import type { Notification } from '../types/notification'
import type { User } from '../services/auth.service'
import { useToast } from './ToastContext'

type NotificationContextValue = {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  fetchNotifications: (page?: number, limit?: number) => Promise<void>
  fetchUnreadCount: () => Promise<void>
  markAsRead: (id: number | string) => Promise<void>
  markAllAsRead: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

const getStoredToken = () => localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(() => getStoredUser())
  const { info } = useToast()

  const fetchNotifications = useCallback(async (page = 1, limit = 10) => {
    if (!getStoredToken()) {
      setNotifications([])
      return
    }

    setLoading(true)
    try {
      const result = await getNotifications(page, limit)
      setNotifications(result.notifications)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUnreadCount = useCallback(async () => {
    if (!getStoredToken()) {
      setUnreadCount(0)
      return
    }

    const count = await getUnreadCount()
    setUnreadCount(count)
  }, [])

  const markAsRead = useCallback(async (id: number | string) => {
    const wasUnread = notifications.some((notification) => String(notification.id) === String(id) && !notification.is_read)
    await markNotificationAsRead(id)

    setNotifications((current) =>
      current.map((notification) =>
        String(notification.id) === String(id) ? { ...notification, is_read: true } : notification
      )
    )

    if (wasUnread) {
      setUnreadCount((current) => Math.max(current - 1, 0))
    }
  }, [notifications])

  const markAllAsRead = useCallback(async () => {
    await markAllNotificationsAsRead()
    setNotifications((current) => current.map((notification) => ({ ...notification, is_read: true })))
    setUnreadCount(0)
  }, [])

  useEffect(() => {
    const handleUserChange = (event: Event) => {
      const nextUser = (event as CustomEvent<User | null>).detail
      setUser(nextUser ?? getStoredUser())
    }

    window.addEventListener(AUTH_USER_CHANGED_EVENT, handleUserChange)

    return () => {
      window.removeEventListener(AUTH_USER_CHANGED_EVENT, handleUserChange)
    }
  }, [])

  useEffect(() => {
    const token = getStoredToken()

    if (!user || !token) {
      disconnectSocket()
      const timeoutId = window.setTimeout(() => {
        setNotifications([])
        setUnreadCount(0)
      }, 0)

      return () => {
        window.clearTimeout(timeoutId)
      }
    }

    connectSocket(token)
    const timeoutId = window.setTimeout(() => {
      void fetchNotifications()
      void fetchUnreadCount()
    }, 0)

    const unsubscribe = onNewNotification((notification) => {
      setNotifications((current) => [notification, ...current.filter((item) => String(item.id) !== String(notification.id))])
      setUnreadCount((current) => current + 1)
      info(notification.message, { title: notification.title })
    })

    return () => {
      window.clearTimeout(timeoutId)
      unsubscribe()
    }
  }, [fetchNotifications, fetchUnreadCount, info, user])

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      fetchNotifications,
      fetchUnreadCount,
      markAsRead,
      markAllAsRead,
    }),
    [fetchNotifications, fetchUnreadCount, loading, markAllAsRead, markAsRead, notifications, unreadCount]
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }

  return context
}
