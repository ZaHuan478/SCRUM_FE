import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, RefObject } from 'react'
import type { User } from '../services/auth.service'
import { updateStoredUser } from '../services/auth.service'
import { getDoctorAssignments } from '../services/doctorAssignment.service'
import { getDoctorByUserId } from '../services/doctor.service'
import { getCurrentUser, updateCurrentUser, uploadCurrentUserAvatar } from '../services/user.service'
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
        setError(requestError instanceof Error ? requestError.message : 'Không thể tải hồ sơ.')
      })

    return () => {
      active = false
    }
  }, [onAuthFailure])

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
      updateField(field, await fileToDataUrl(file, imageLabel))
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : `Không thể tải ${imageLabel.toLowerCase()}.`)
    }
  }, [updateField])

  const clearImage = useCallback((field: ProfileImageField) => {
    updateField(field, '')
  }, [updateField])

  const clearAvatar = useCallback(() => {
    clearImage('avatarUrl')
    if (avatarInputRef.current) avatarInputRef.current.value = ''
  }, [clearImage])

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.email.trim()) {
      setError('Email không được để trống.')
      return
    }

    if (!emailMatches) {
      setError('Email xác nhận không khớp.')
      return
    }

    if (!phoneValid) {
      setError('Số điện thoại cần có 9 đến 15 chữ số.')
      return
    }

    if (!cccdValid) {
      setError('CCCD phải gồm đúng 12 chữ số.')
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
      setSuccess('Hồ sơ đã được cập nhật.')
    } catch (requestError) {
      if (isAuthFailure(requestError)) {
        onAuthFailure()
        return
      }

      setError(requestError instanceof Error ? requestError.message : 'Không thể cập nhật hồ sơ.')
    } finally {
      setIsSaving(false)
    }
  }, [cccdValid, emailMatches, form, onAuthFailure, phoneValid, user.avatar_url])

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
    phoneValid,
    status,
    success,
    updateField,
    user,
  }
}
