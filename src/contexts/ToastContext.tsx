import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import ToastViewport from '../components/Organisms/Common/ToastViewport'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

type ToastOptions = {
  title?: string
  duration?: number
}

export type ToastInput = ToastOptions & {
  message: string
  variant?: ToastVariant
}

export type ToastItem = {
  id: string
  message: string
  title?: string
  variant: ToastVariant
  duration: number
}

type ToastContextValue = {
  showToast: (toast: ToastInput) => string
  dismissToast: (id: string) => void
  clearToasts: () => void
  success: (message: string, options?: ToastOptions) => string
  error: (message: string, options?: ToastOptions) => string
  warning: (message: string, options?: ToastOptions) => string
  info: (message: string, options?: ToastOptions) => string
}

const DEFAULT_DURATION = 4500
const MAX_TOASTS = 4

const ToastContext = createContext<ToastContextValue | null>(null)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counterRef = useRef(0)
  const timeoutRefs = useRef<Record<string, number>>({})

  const dismissToast = useCallback((id: string) => {
    window.clearTimeout(timeoutRefs.current[id])
    delete timeoutRefs.current[id]
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    Object.values(timeoutRefs.current).forEach((timeoutId) => window.clearTimeout(timeoutId))
    timeoutRefs.current = {}
    setToasts([])
  }, [])

  const showToast = useCallback((toast: ToastInput) => {
    const id = `${Date.now()}-${counterRef.current}`
    counterRef.current += 1

    const nextToast: ToastItem = {
      id,
      message: toast.message,
      title: toast.title,
      variant: toast.variant ?? 'info',
      duration: toast.duration ?? DEFAULT_DURATION,
    }

    setToasts((current) => {
      const nextToasts = [nextToast, ...current]
      const removedToasts = nextToasts.slice(MAX_TOASTS)

      removedToasts.forEach((removedToast) => {
        window.clearTimeout(timeoutRefs.current[removedToast.id])
        delete timeoutRefs.current[removedToast.id]
      })

      return nextToasts.slice(0, MAX_TOASTS)
    })

    if (nextToast.duration > 0) {
      timeoutRefs.current[id] = window.setTimeout(() => {
        dismissToast(id)
      }, nextToast.duration)
    }

    return id
  }, [dismissToast])

  useEffect(() => clearToasts, [clearToasts])

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      dismissToast,
      clearToasts,
      success: (message, options) => showToast({ ...options, message, variant: 'success' }),
      error: (message, options) => showToast({ ...options, message, variant: 'error' }),
      warning: (message, options) => showToast({ ...options, message, variant: 'warning' }),
      info: (message, options) => showToast({ ...options, message, variant: 'info' }),
    }),
    [clearToasts, dismissToast, showToast]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport onDismiss={dismissToast} toasts={toasts} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return context
}
