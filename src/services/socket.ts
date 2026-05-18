import { io, type Socket } from 'socket.io-client'
import type { Notification } from '../types/notification'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

let socket: Socket | null = null
let activeToken: string | null = null

const getSocketUrl = () => {
  if (BACKEND_URL) return BACKEND_URL.replace(/\/$/, '')
  if (!API_BASE_URL.startsWith('http')) return window.location.origin

  const url = new URL(API_BASE_URL)
  return url.origin
}

export const connectSocket = (token: string) => {
  if (!token) return null

  if (socket?.connected && activeToken === token) {
    return socket
  }

  disconnectSocket()

  activeToken = token
  socket = io(getSocketUrl(), {
    auth: { token },
    transports: ['websocket', 'polling'],
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
  }

  socket = null
  activeToken = null
}

export const onNewNotification = (callback: (notification: Notification) => void) => {
  if (!socket) return () => undefined

  socket.on('notification:new', callback)

  return () => {
    socket?.off('notification:new', callback)
  }
}
