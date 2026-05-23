import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Image from '../../Atoms/Image'
import Input from '../../Atoms/Input'
import type { User, UserGender, UserRole } from '../../../services/auth.service'

export type UserFormValues = {
  fullName: string
  email: string
  password: string
  phone: string
  dateOfBirth: string
  gender: UserGender | ''
  cccdNumber: string
  cccdFrontImage: string
  cccdBackImage: string
  role: UserRole
  status: User['status']
}

type UserEditModalProps = {
  error?: string
  isSaving: boolean
  onClose: () => void
  onSubmit: (payload: UserFormValues) => void
  open: boolean
  user: User | null
}

const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  if (!file.type.startsWith('image/')) {
    reject(new Error('Chi ho tro file anh.'))
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    reject(new Error('Anh CCCD khong duoc vuot qua 2MB.'))
    return
  }

  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result || ''))
  reader.onerror = () => reject(new Error('Khong the doc file anh.'))
  reader.readAsDataURL(file)
})

const UserEditModal = ({
  error,
  isSaving,
  onClose,
  onSubmit,
  open,
  user,
}: UserEditModalProps) => {
  const [fullName, setFullName] = useState(() => user?.full_name || '')
  const [email, setEmail] = useState(() => user?.email || '')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState(() => user?.phone || '')
  const [dateOfBirth, setDateOfBirth] = useState(() => user?.date_of_birth || '')
  const [gender, setGender] = useState<UserGender | ''>(() => user?.gender || '')
  const [cccdNumber, setCccdNumber] = useState(() => user?.cccd_number || '')
  const [cccdFrontImage, setCccdFrontImage] = useState(() => user?.cccd_front_image || '')
  const [cccdBackImage, setCccdBackImage] = useState(() => user?.cccd_back_image || '')
  const [role, setRole] = useState<UserRole>(() => user?.role || 'PATIENT')
  const [status, setStatus] = useState<User['status']>(() => user?.status || 'ACTIVE')
  const [fileError, setFileError] = useState('')
  const isEditing = Boolean(user)

  if (!open) return null

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileError('')

    try {
      setter(await fileToDataUrl(file))
    } catch (uploadError) {
      setFileError(uploadError instanceof Error ? uploadError.message : 'Khong the tai anh CCCD.')
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      phone: phone.trim(),
      dateOfBirth,
      gender,
      cccdNumber: cccdNumber.trim(),
      cccdFrontImage,
      cccdBackImage,
      role,
      status,
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 px-lg py-xl backdrop-blur-sm" role="presentation">
      <button aria-label="Dong hop thoai" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <form
        aria-modal="true"
        className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-xl shadow-[0px_20px_50px_rgba(15,23,42,0.12)]"
        onSubmit={handleSubmit}
        role="dialog"
      >
        <div className="mb-xl flex items-start justify-between gap-lg border-b border-outline-variant/30 pb-lg">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">{isEditing ? 'Cập nhật người dùng' : 'Thêm người dùng'}</h2>
            <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{email || 'Tạo tài khoản mới'}</p>
          </div>
          <Button
            aria-label="Dong"
            className="rounded-full border-none p-sm text-on-surface-variant shadow-none hover:bg-surface-container-high"
            fullWidth={false}
            onClick={onClose}
            type="button"
            variant="ghost"
          >
            <Icon name="close" />
          </Button>
        </div>

        <div className="space-y-lg">
          {(error || fileError) && (
            <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
              {error || fileError}
            </p>
          )}

          <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
            <Input id="user-full-name" label="Ho ten" onChange={(event) => setFullName(event.target.value)} type="text" value={fullName} />
            <Input id="user-email" label="Email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
            {!isEditing && (
              <Input id="user-password" label="Mat khau" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
            )}
            <Input id="user-phone" label="So dien thoai" onChange={(event) => setPhone(event.target.value)} type="tel" value={phone} />
            <Input id="user-date-of-birth" label="Ngay sinh" onChange={(event) => setDateOfBirth(event.target.value)} type="date" value={dateOfBirth} />
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="user-gender">Gioi tinh</label>
              <select
                className="w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                id="user-gender"
                onChange={(event) => setGender(event.target.value as UserGender | '')}
                value={gender}
              >
                <option value="">Chua cap nhat</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nu</option>
                <option value="OTHER">Khac</option>
              </select>
            </div>
            <Input id="user-cccd-number" label="So CCCD" onChange={(event) => setCccdNumber(event.target.value)} type="text" value={cccdNumber} />
          </div>

          <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="user-role">Vai tro</label>
              <select
                className="w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                id="user-role"
                onChange={(event) => setRole(event.target.value as UserRole)}
                value={role}
              >
                <option value="PATIENT">Bệnh nhân</option>
                <option value="DOCTOR">Bác sĩ</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
            </div>
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="user-status">Trang thai</label>
              <select
                className="w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                id="user-status"
                onChange={(event) => setStatus(event.target.value as User['status'])}
                value={status}
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Tạm ngưng</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
            <div className="space-y-sm">
              <p className="font-label-md text-label-md text-on-surface">CCCD mặt trước</p>
              <div className="aspect-[16/10] overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-variant">
                <Image alt="CCCD mặt trước" className="h-full w-full object-cover" fallbackClassName="h-full w-full" src={cccdFrontImage || undefined} />
              </div>
              <input accept="image/*" className="w-full font-body-sm text-body-sm text-on-surface-variant" onChange={(event) => void handleImageChange(event, setCccdFrontImage)} type="file" />
              {cccdFrontImage && (
                <Button className="px-md py-sm text-error" fullWidth={false} onClick={() => setCccdFrontImage('')} type="button" variant="ghost">
                  Xoa anh
                </Button>
              )}
            </div>
            <div className="space-y-sm">
              <p className="font-label-md text-label-md text-on-surface">CCCD mặt sau</p>
              <div className="aspect-[16/10] overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-variant">
                <Image alt="CCCD mặt sau" className="h-full w-full object-cover" fallbackClassName="h-full w-full" src={cccdBackImage || undefined} />
              </div>
              <input accept="image/*" className="w-full font-body-sm text-body-sm text-on-surface-variant" onChange={(event) => void handleImageChange(event, setCccdBackImage)} type="file" />
              {cccdBackImage && (
                <Button className="px-md py-sm text-error" fullWidth={false} onClick={() => setCccdBackImage('')} type="button" variant="ghost">
                  Xoa anh
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-xl flex justify-end gap-md border-t border-outline-variant/30 pt-lg">
          <Button className="px-lg py-sm" fullWidth={false} onClick={onClose} type="button" variant="ghost">
            ủy
          </Button>
          <Button className="px-lg py-sm" fullWidth={false} isLoading={isSaving} type="submit">
            Lưu
          </Button>
        </div>
      </form>
    </div>
  )
}

export default UserEditModal
