import type { User } from '../services/auth.service'

export type LoadStatus = 'loading' | 'ready' | 'error'
export type DoctorInfoStatus = 'idle' | LoadStatus

export type ProfileFormState = {
  fullName: string
  email: string
  emailConfirmation: string
  phone: string
  avatarUrl: string
  dateOfBirth: string
  gender: string
  cccdNumber: string
  cccdFrontImage: string
  cccdBackImage: string
}

export type DoctorReadonlyInfo = {
  departmentNames: string
  description: string
  status: DoctorInfoStatus
}

export const emptyProfileForm: ProfileFormState = {
  fullName: '',
  email: '',
  emailConfirmation: '',
  phone: '',
  avatarUrl: '',
  dateOfBirth: '',
  gender: '',
  cccdNumber: '',
  cccdFrontImage: '',
  cccdBackImage: '',
}

export const emptyDoctorReadonlyInfo: DoctorReadonlyInfo = {
  departmentNames: '',
  description: '',
  status: 'idle',
}

const supportedImageTypes = ['image/png', 'image/jpeg', 'image/webp']
const MAX_PROFILE_IMAGE_WIDTH = 1280
const PROFILE_IMAGE_QUALITY = 0.78

export const buildProfileForm = (user: User): ProfileFormState => ({
  fullName: user.full_name || '',
  email: user.email || '',
  emailConfirmation: user.email || '',
  phone: user.phone || '',
  avatarUrl: user.avatar_url || '',
  dateOfBirth: user.date_of_birth || '',
  gender: user.gender || '',
  cccdNumber: user.cccd_number || '',
  cccdFrontImage: user.cccd_front_image || '',
  cccdBackImage: user.cccd_back_image || '',
})

const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const image = new Image()
  image.onload = () => resolve(image)
  image.onerror = () => reject(new Error('Không thể xử lý ảnh.'))
  image.src = src
})

const resizeImageDataUrl = async (dataUrl: string) => {
  const image = await loadImage(dataUrl)
  const scale = Math.min(MAX_PROFILE_IMAGE_WIDTH / image.width, 1)
  const width = Math.max(Math.round(image.width * scale), 1)
  const height = Math.max(Math.round(image.height * scale), 1)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) return dataUrl

  canvas.width = width
  canvas.height = height
  context.drawImage(image, 0, 0, width, height)

  return canvas.toDataURL('image/jpeg', PROFILE_IMAGE_QUALITY)
}

export const fileToDataUrl = (file: File, imageLabel = 'Ảnh') => new Promise<string>((resolve, reject) => {
  if (!supportedImageTypes.includes(file.type)) {
    reject(new Error('Chỉ hỗ trợ file PNG, JPG hoặc WEBP.'))
    return
  }

  if (file.size > 8 * 1024 * 1024) {
    reject(new Error(`${imageLabel} không được vượt quá 8MB.`))
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = String(reader.result || '')
    resizeImageDataUrl(dataUrl).then(resolve).catch(reject)
  }
  reader.onerror = () => reject(new Error('Không thể đọc file ảnh.'))
  reader.readAsDataURL(file)
})

export const isImageDataUrl = (value: string) => /^data:image\/(png|jpe?g|webp);base64,/i.test(value)

export const normalizePhone = (value: string) => value.trim().replace(/[\s.-]/g, '')

export const isValidPhone = (value: string) => {
  const phone = normalizePhone(value)

  return !phone || /^\+?\d{9,15}$/.test(phone)
}

export const isValidCccd = (value: string) => {
  const cccd = value.trim()

  return !cccd || /^\d{12}$/.test(cccd)
}

export const isAuthFailure = (error: unknown) => {
  const status = error instanceof Error ? (error as { status?: number }).status : undefined

  return status === 401 || status === 403
}

export const getProfileRoleLabel = (user?: User | null) => {
  if (!user) return 'Người dùng'
  if (user.role === 'PATIENT') return 'Bệnh nhân'
  if (user.role === 'DOCTOR') return 'Bác sĩ'
  if (user.role === 'ADMIN') return 'Quản trị viên'

  return user.role
}
