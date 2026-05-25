import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, RefObject } from 'react'
import type { User } from '../services/auth.service'
import { updateStoredUser } from '../services/auth.service'
import { getDoctorAssignments } from '../services/doctorAssignment.service'
import { getDoctorByUserId } from '../services/doctor.service'
import { getCurrentUser, updateCurrentUser, uploadCurrentUserAvatar, uploadCurrentUserCccdImage } from '../services/user.service'
import { scanCccdImages } from '../services/cccdScan.service'
import {
  buildProfileForm,
  emptyDoctorReadonlyInfo,
  fileToDataUrl,
  isAuthFailure,
  isImageDataUrl,
  isValidCccd,
  isValidPhone,
  normalizePhone,
} from '../utils/profile'
import type { DoctorReadonlyInfo, LoadStatus, ProfileFormState } from '../utils/profile'
import { useToast } from '../contexts/ToastContext'

export type ProfileImageField = 'avatarUrl' | 'cccdFrontImage' | 'cccdBackImage'

type UseProfileOptions = {
  storedUser: User
  onAuthFailure: () => void
}

export type ProfileState = {
  avatarInputRef: RefObject<HTMLInputElement | null>
  cccdValid: boolean
  doctorDepartmentValue: string
  doctorDescriptionValue: string
  doctorInfo: DoctorReadonlyInfo
  emailMatches: boolean
  error: string
  form: ProfileFormState
  isSaving: boolean
  isScanningCccd: boolean
  phoneValid: boolean
  status: LoadStatus
  success: string
  user: User
  clearAvatar: () => void
  clearImage: (field: ProfileImageField) => void
  handleImageChange: (
    event: ChangeEvent<HTMLInputElement>,
    field: ProfileImageField,
    imageLabel?: string
  ) => Promise<void>
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  scanCccd: () => Promise<void>
  updateField: (field: keyof ProfileFormState, value: string) => void
}

const loadDoctorReadonlyInfo = async (userId: User['id']): Promise<DoctorReadonlyInfo> => {
  const doctor = await getDoctorByUserId(userId)
  const assignments = await getDoctorAssignments({
    doctor_id: doctor.id,
    limit: 100,
    status: 'ACTIVE',
  })
  const departmentNames = Array.from(new Set(
    assignments.doctor_assignments
      .map((assignment) => assignment.department?.name)
      .filter((name): name is string => Boolean(name))
  )).join(', ')

  return {
    departmentNames: departmentNames || 'Chưa phân khoa',
    description: doctor.description?.trim() || 'Chưa cập nhật',
    status: 'ready',
  }
}

export const useProfile = ({ storedUser, onAuthFailure }: UseProfileOptions): ProfileState => {
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<User>(storedUser)
  const [form, setForm] = useState<ProfileFormState>(() => buildProfileForm(storedUser))
  const [status, setStatus] = useState<LoadStatus>('ready')
  const [doctorInfo, setDoctorInfo] = useState<DoctorReadonlyInfo>(emptyDoctorReadonlyInfo)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isScanningCccd, setIsScanningCccd] = useState(false)
  const { success: toastSuccess, error: toastError, warning: toastWarning } = useToast()

  const showError = useCallback((message: string) => {
    setError(message)
    toastError(message)
  }, [toastError])

  const showSuccess = useCallback((message: string) => {
    setSuccess(message)
    toastSuccess(message)
  }, [toastSuccess])

  const showWarning = useCallback((message: string) => {
    setError(message)
    toastWarning(message)
  }, [toastWarning])

  useEffect(() => {
    let active = true

    getCurrentUser()
      .then(async (currentUser) => {
        if (!active) return

        setUser(currentUser)
        setForm(buildProfileForm(currentUser))
        updateStoredUser(currentUser)
        setStatus('ready')

        if (currentUser.role !== 'DOCTOR') {
          setDoctorInfo(emptyDoctorReadonlyInfo)
          return
        }

        setDoctorInfo({ ...emptyDoctorReadonlyInfo, status: 'loading' })

        try {
          const nextDoctorInfo = await loadDoctorReadonlyInfo(currentUser.id)
          if (!active) return

          setDoctorInfo(nextDoctorInfo)
        } catch {
          if (!active) return

          setDoctorInfo({
            departmentNames: 'Không thể tải khoa',
            description: 'Không thể tải description',
            status: 'error',
          })
        }
      })
      .catch((requestError: unknown) => {
        if (!active) return

        if (isAuthFailure(requestError)) {
          onAuthFailure()
          return
        }

        setStatus('error')
        showError(requestError instanceof Error ? requestError.message : 'Không thể tải hồ sơ.')
      })

    return () => {
      active = false
    }
  }, [onAuthFailure, showError])

  const emailMatches = useMemo(() => (
    Boolean(form.email.trim())
    && form.email.trim().toLowerCase() === form.emailConfirmation.trim().toLowerCase()
  ), [form.email, form.emailConfirmation])

  const phoneValid = useMemo(() => isValidPhone(form.phone), [form.phone])
  const cccdValid = useMemo(() => isValidCccd(form.cccdNumber), [form.cccdNumber])
  const doctorDepartmentValue = doctorInfo.status === 'loading' ? 'Đang tải...' : doctorInfo.departmentNames
  const doctorDescriptionValue = doctorInfo.status === 'loading' ? 'Đang tải...' : doctorInfo.description

  const updateField = useCallback((field: keyof ProfileFormState, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }, [])

  const handleImageChange = useCallback(async (
    event: ChangeEvent<HTMLInputElement>,
    field: ProfileImageField,
    imageLabel = 'Ảnh'
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setSuccess('')

    try {
      const imageData = await fileToDataUrl(file, imageLabel)

      if (field === 'cccdFrontImage' || field === 'cccdBackImage') {
        const updatedUser = await uploadCurrentUserCccdImage(field === 'cccdFrontImage' ? 'front' : 'back', imageData)
        setUser(updatedUser)
        setForm((currentForm) => ({
          ...currentForm,
          cccdBackImage: updatedUser.cccd_back_image || currentForm.cccdBackImage,
          cccdFrontImage: updatedUser.cccd_front_image || currentForm.cccdFrontImage,
        }))
        updateStoredUser(updatedUser)
        showSuccess(`${imageLabel} đã được tải lên.`)
        return
      }

      updateField(field, imageData)
    } catch (uploadError) {
      showWarning(uploadError instanceof Error ? uploadError.message : `Không thể tải ${imageLabel.toLowerCase()}.`)
    }
  }, [showSuccess, showWarning, updateField])

  const clearImage = useCallback((field: ProfileImageField) => {
    updateField(field, '')
  }, [updateField])

  const clearAvatar = useCallback(() => {
    clearImage('avatarUrl')
    if (avatarInputRef.current) avatarInputRef.current.value = ''
  }, [clearImage])

  const scanCccd = useCallback(async () => {
    setError('')
    setSuccess('')

    if (!form.cccdFrontImage || !form.cccdBackImage) {
      showWarning('Vui lòng tải ảnh CCCD mặt trước và mặt sau trước khi quét.')
      return
    }

    setIsScanningCccd(true)

    try {
      const result = await scanCccdImages({
        backImage: form.cccdBackImage,
        frontImage: form.cccdFrontImage,
      })

      if (!result.cccdNumber) {
        showWarning('Đã quét ảnh nhưng chưa nhận diện được số CCCD.')
        return
      }

      updateField('cccdNumber', result.cccdNumber)
      if (result.dateOfBirth) updateField('dateOfBirth', result.dateOfBirth)
      if (result.fullName) updateField('fullName', result.fullName)
      if (result.gender) updateField('gender', result.gender)
      showSuccess('Đã quét và điền số CCCD.')
    } catch (scanError) {
      showError(scanError instanceof Error ? scanError.message : 'Không thể quét CCCD.')
    } finally {
      setIsScanningCccd(false)
    }
  }, [form.cccdBackImage, form.cccdFrontImage, showError, showSuccess, showWarning, updateField])

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.email.trim()) {
      showWarning('Email không được để trống.')
      return
    }

    if (!emailMatches) {
      showWarning('Email xác nhận không khớp.')
      return
    }

    if (!phoneValid) {
      showWarning('Số điện thoại cần có 9 đến 15 chữ số.')
      return
    }

    if (!cccdValid) {
      showWarning('CCCD phải gồm đúng 12 chữ số.')
      return
    }

    setIsSaving(true)

    try {
      const hasPendingAvatarUpload = isImageDataUrl(form.avatarUrl)
      let updatedUser = await updateCurrentUser({
        full_name: form.fullName.trim() || null,
        email: form.email.trim(),
        phone: normalizePhone(form.phone) || null,
        avatar_url: hasPendingAvatarUpload ? user.avatar_url || null : form.avatarUrl || null,
        date_of_birth: form.dateOfBirth || null,
        gender: form.gender ? form.gender as User['gender'] : null,
        cccd_number: form.cccdNumber.trim() || null,
        cccd_front_image: form.cccdFrontImage || null,
        cccd_back_image: form.cccdBackImage || null,
      })

      if (hasPendingAvatarUpload) {
        updatedUser = await uploadCurrentUserAvatar(form.avatarUrl)
      }

      setUser(updatedUser)
      setForm(buildProfileForm(updatedUser))
      updateStoredUser(updatedUser)
      showSuccess('Hồ sơ đã được cập nhật.')
    } catch (requestError) {
      if (isAuthFailure(requestError)) {
        onAuthFailure()
        return
      }

      showError(requestError instanceof Error ? requestError.message : 'Không thể cập nhật hồ sơ.')
    } finally {
      setIsSaving(false)
    }
  }, [cccdValid, emailMatches, form, onAuthFailure, phoneValid, showError, showSuccess, showWarning, user.avatar_url])

  return {
    avatarInputRef,
    cccdValid,
    clearAvatar,
    clearImage,
    doctorDepartmentValue,
    doctorDescriptionValue,
    doctorInfo,
    emailMatches,
    error,
    form,
    handleImageChange,
    handleSubmit,
    isSaving,
    isScanningCccd,
    phoneValid,
    status,
    success,
    scanCccd,
    updateField,
    user,
  }
}
