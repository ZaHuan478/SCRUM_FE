import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Button from '../components/Atoms/Button'
import Icon from '../components/Atoms/Icon'
import Image from '../components/Atoms/Image'
import Input from '../components/Atoms/Input'
import TopNavBar from '../components/Organisms/TopNavBar'
import { clearAuthSession, getStoredUser, updateStoredUser } from '../services/auth.service'
import type { User } from '../services/auth.service'
import { getCurrentUser, updateCurrentUser, uploadCurrentUserAvatar } from '../services/user.service'

type LoadStatus = 'loading' | 'ready' | 'error'

const SUPPORTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']

type ProfileFormState = {
  fullName: string
  email: string
  emailConfirmation: string
  phone: string
  avatarUrl: string
  dateOfBirth: string
  cccdNumber: string
  cccdFrontImage: string
  cccdBackImage: string
}

const emptyProfileForm: ProfileFormState = {
  fullName: '',
  email: '',
  emailConfirmation: '',
  phone: '',
  avatarUrl: '',
  dateOfBirth: '',
  cccdNumber: '',
  cccdFrontImage: '',
  cccdBackImage: '',
}

const buildProfileForm = (user: User): ProfileFormState => ({
  fullName: user.full_name || '',
  email: user.email || '',
  emailConfirmation: user.email || '',
  phone: user.phone || '',
  avatarUrl: user.avatar_url || '',
  dateOfBirth: user.date_of_birth || '',
  cccdNumber: user.cccd_number || '',
  cccdFrontImage: user.cccd_front_image || '',
  cccdBackImage: user.cccd_back_image || '',
})

const fileToDataUrl = (file: File, imageLabel = 'Ảnh') => new Promise<string>((resolve, reject) => {
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
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

const isImageDataUrl = (value: string) => /^data:image\/(png|jpe?g|webp);base64,/i.test(value)

const normalizePhone = (value: string) => value.trim().replace(/[\s.-]/g, '')

const isValidPhone = (value: string) => {
  const phone = normalizePhone(value)

  return !phone || /^\+?\d{9,15}$/.test(phone)
}

const isValidCccd = (value: string) => {
  const cccd = value.trim()

  return !cccd || /^\d{12}$/.test(cccd)
}

const isAuthFailure = (error: unknown) => {
  const status = error instanceof Error ? (error as { status?: number }).status : undefined

  return status === 401 || status === 403
}

const ProfilePage = () => {
  const navigate = useNavigate()
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [storedUser] = useState(() => getStoredUser())
  const [user, setUser] = useState<User | null>(storedUser)
  const [form, setForm] = useState<ProfileFormState>(() => storedUser ? buildProfileForm(storedUser) : emptyProfileForm)
  const [status, setStatus] = useState<LoadStatus>(storedUser ? 'ready' : 'loading')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const redirectToLogin = useCallback(() => {
    clearAuthSession()
    navigate('/login', { replace: true })
  }, [navigate])

  useEffect(() => {
    if (!storedUser) return

    let active = true

    getCurrentUser()
      .then((currentUser) => {
        if (!active) return

        setUser(currentUser)
        setForm(buildProfileForm(currentUser))
        updateStoredUser(currentUser)
        setStatus('ready')
      })
      .catch((requestError) => {
        if (!active) return

        if (isAuthFailure(requestError)) {
          redirectToLogin()
          return
        }

        setStatus('error')
        setError(requestError instanceof Error ? requestError.message : 'Không thể tải hồ sơ.')
      })

    return () => {
      active = false
    }
  }, [storedUser, redirectToLogin])

  const emailMatches = useMemo(() => (
    Boolean(form.email.trim())
    && form.email.trim().toLowerCase() === form.emailConfirmation.trim().toLowerCase()
  ), [form.email, form.emailConfirmation])

  const phoneValid = useMemo(() => isValidPhone(form.phone), [form.phone])
  const cccdValid = useMemo(() => isValidCccd(form.cccdNumber), [form.cccdNumber])

  if (!storedUser) return <Navigate replace to="/login" />

  const updateField = (field: keyof ProfileFormState, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
    field: 'avatarUrl' | 'cccdFrontImage' | 'cccdBackImage',
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
  }

  const clearAvatar = () => {
    updateField('avatarUrl', '')
    if (avatarInputRef.current) avatarInputRef.current.value = ''
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
        avatar_url: hasPendingAvatarUpload ? user?.avatar_url || null : form.avatarUrl || null,
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
        redirectToLogin()
        return
      }

      setError(requestError instanceof Error ? requestError.message : 'Không thể cập nhật hồ sơ.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNavBar active="about" />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-xl px-lg py-xl md:px-xxl md:py-xxl">
        <section className="flex flex-col gap-md border-b border-outline-variant/30 pb-lg md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-md">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-outline-variant/30 bg-surface-variant">
              <Image alt="Ảnh đại diện" className="h-full w-full object-cover" fallbackClassName="h-full w-full" src={form.avatarUrl || undefined} />
            </div>
            <div>
              <p className="font-label-md text-label-md text-primary">{user?.role === 'PATIENT' ? 'Bệnh nhân' : user?.role || 'User'}</p>
              <h1 className="mt-xs font-headline-lg text-headline-lg text-on-background">Hồ sơ cá nhân</h1>
            </div>
          </div>
        </section>

        <form className="grid grid-cols-1 items-start gap-xl lg:grid-cols-3" onSubmit={handleSubmit}>
          <section className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm lg:col-span-3">
            <div className="mb-lg flex items-center gap-sm">
              <Icon className="text-primary" name="badge" />
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Thông tin định danh</h2>
            </div>

            {status === 'loading' && (
              <p className="rounded-lg bg-surface-container px-md py-sm font-body-sm text-body-sm text-on-surface-variant">Đang tải hồ sơ...</p>
            )}
            {(error || success) && (
              <p className={`mb-lg rounded-lg px-md py-sm font-body-sm text-body-sm ${error ? 'bg-error-container text-on-error-container' : 'bg-secondary-fixed text-on-secondary-fixed'}`}>
                {error || success}
              </p>
            )}

            <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
              <Input
                autoComplete="name"
                id="profile-full-name"
                label="Họ và tên"
                onChange={(event) => updateField('fullName', event.target.value)}
                type="text"
                value={form.fullName}
              />
              <Input
                autoComplete="bday"
                id="profile-date-of-birth"
                label="Ngày sinh"
                onChange={(event) => updateField('dateOfBirth', event.target.value)}
                type="date"
                value={form.dateOfBirth}
              />
              <Input
                autoComplete="email"
                error={!emailMatches && form.emailConfirmation ? 'Email xác nhận không khớp.' : undefined}
                id="profile-email"
                label="Email"
                onChange={(event) => updateField('email', event.target.value)}
                required
                type="email"
                value={form.email}
              />
              <Input
                autoComplete="email"
                error={!emailMatches && form.emailConfirmation ? 'Nhập lại đúng email.' : undefined}
                id="profile-email-confirmation"
                label="Xác nhận email"
                onChange={(event) => updateField('emailConfirmation', event.target.value)}
                required
                type="email"
                value={form.emailConfirmation}
              />
              <Input
                autoComplete="tel"
                error={!phoneValid ? 'SĐT cần có 9 đến 15 chữ số.' : undefined}
                id="profile-phone"
                label="Số điện thoại"
                onChange={(event) => updateField('phone', event.target.value)}
                type="tel"
                value={form.phone}
              />
              <Input
                error={!cccdValid ? 'CCCD phải gồm đúng 12 chữ số.' : undefined}
                id="profile-cccd-number"
                inputMode="numeric"
                label="Số CCCD"
                maxLength={12}
                onChange={(event) => updateField('cccdNumber', event.target.value.replace(/\D/g, '').slice(0, 12))}
                type="text"
                value={form.cccdNumber}
              />
            </div>

            <div className="mt-xl flex flex-col gap-md border-t border-outline-variant/30 pt-lg sm:flex-row sm:justify-between">
              <Button className="px-lg py-sm" disabled={status === 'loading'} fullWidth={false} isLoading={isSaving} type="submit">
                Lưu hồ sơ
              </Button>
            </div>
          </section>

          <section className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <div className="mb-lg flex items-center gap-sm">
              <Icon className="text-secondary" name="account_circle" />
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Ảnh đại diện</h2>
            </div>

            <div className="space-y-md">
              <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border border-outline-variant/30 bg-surface-variant">
                <Image alt="Ảnh đại diện" className="h-full w-full object-cover" fallbackClassName="h-full w-full" src={form.avatarUrl || undefined} />
              </div>
              <input
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                id="profile-avatar"
                onChange={(event) => void handleImageChange(event, 'avatarUrl', 'Ảnh đại diện')}
                ref={avatarInputRef}
                type="file"
              />
              <div className="flex flex-wrap justify-center gap-sm">
                <Button
                  className="inline-flex items-center justify-center gap-xs px-md py-sm"
                  disabled={isSaving}
                  fullWidth={false}
                  onClick={() => avatarInputRef.current?.click()}
                  type="button"
                  variant="ghost"
                >
                  <Icon className="text-lg" name="upload" />
                  Chọn ảnh
                </Button>
                {form.avatarUrl && (
                  <Button className="border-none px-md py-sm text-error" fullWidth={false} onClick={clearAvatar} type="button" variant="ghost">
                    Xóa ảnh
                  </Button>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <div className="mb-lg flex items-center gap-sm">
              <Icon className="text-secondary" name="badge" />
              <h2 className="font-headline-sm text-headline-sm text-on-surface">CCCD mặt trước</h2>
            </div>

            <div className="space-y-md">
              <div className="aspect-[16/10] overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-variant">
                <Image alt="CCCD mặt trước" className="h-full w-full object-cover" fallbackClassName="h-full w-full" src={form.cccdFrontImage || undefined} />
              </div>
              <input
                accept="image/png,image/jpeg,image/webp"
                className="w-full rounded-lg border border-outline-variant px-md py-sm font-body-sm text-body-sm text-on-surface-variant"
                id="profile-cccd-front"
                onChange={(event) => void handleImageChange(event, 'cccdFrontImage', 'Ảnh CCCD')}
                type="file"
              />
              {form.cccdFrontImage && (
                <Button className="border-none p-0 text-error" fullWidth={false} onClick={() => updateField('cccdFrontImage', '')} type="button" variant="ghost">
                  Xóa ảnh
                </Button>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <div className="mb-lg flex items-center gap-sm">
              <Icon className="text-secondary" name="badge" />
              <h2 className="font-headline-sm text-headline-sm text-on-surface">CCCD mặt sau</h2>
            </div>

            <div className="space-y-md">
              <div className="aspect-[16/10] overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-variant">
                <Image alt="CCCD mặt sau" className="h-full w-full object-cover" fallbackClassName="h-full w-full" src={form.cccdBackImage || undefined} />
              </div>
              <input
                accept="image/png,image/jpeg,image/webp"
                className="w-full rounded-lg border border-outline-variant px-md py-sm font-body-sm text-body-sm text-on-surface-variant"
                id="profile-cccd-back"
                onChange={(event) => void handleImageChange(event, 'cccdBackImage', 'Ảnh CCCD')}
                type="file"
              />
              {form.cccdBackImage && (
                <Button className="border-none p-0 text-error" fullWidth={false} onClick={() => updateField('cccdBackImage', '')} type="button" variant="ghost">
                  Xóa ảnh
                </Button>
              )}
            </div>
          </section>
        </form>
      </main>
    </div>
  )
}

export default ProfilePage
