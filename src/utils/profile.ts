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

export const fileToDataUrl = (file: File, imageLabel = 'Ảnh') => new Promise<string>((resolve, reject) => {
  if (!supportedImageTypes.includes(file.type)) {
    reject(new Error('Chỉ hỗ trợ file PNG, JPG hoặc WEBP.'))
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    reject(new Error(`${imageLabel} không được vượt quá 2MB.`))
    return
  }

  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result || ''))
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
