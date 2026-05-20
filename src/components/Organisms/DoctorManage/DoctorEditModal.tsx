import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Image from '../../Atoms/Image'
import Input from '../../Atoms/Input'
import type { DoctorManagementRowData } from '../../Molecules/Management/DoctorManagementRow'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export type DoctorDepartmentOption = {
  departmentId: number | string
  label: string
}

export type DoctorEditFormValues = {
  fullName: string
  email?: string
  password?: string
  phone?: string
  licenseNumber: string
  cccd?: string
  experienceYears?: string
  consultationFee?: string
  description?: string
  profBiography?: string
  status: 'ACTIVE' | 'INACTIVE'
  departmentId?: string
  imageUrl?: string
  imageData?: string
}

type DoctorEditModalProps = {
  doctor: DoctorManagementRowData | null
  departmentOptions: DoctorDepartmentOption[]
  error?: string
  isSaving: boolean
  onClose: () => void
  onSubmit: (payload: DoctorEditFormValues) => void
  open?: boolean
}

const DoctorEditModal = ({
  doctor,
  departmentOptions,
  error,
  isSaving,
  onClose,
  onSubmit,
  open,
}: DoctorEditModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isCreating = !doctor
  const shouldOpen = open ?? Boolean(doctor)
  const [fullName, setFullName] = useState(() => doctor?.name || '')
  const [email, setEmail] = useState(() => doctor?.email || '')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState(() => doctor?.phone || '')
  const [licenseNumber, setLicenseNumber] = useState(() => doctor?.licenseNumber || '')
  const [cccd, setCccd] = useState(() => doctor?.cccd || '')
  const [experienceYears, setExperienceYears] = useState(() => (
    doctor?.experienceYears === undefined || doctor?.experienceYears === null ? '' : String(doctor.experienceYears)
  ))
  const [consultationFee, setConsultationFee] = useState(() => doctor?.consultationFee || '')
  const [description, setDescription] = useState(() => doctor?.description || '')
  const [profBiography, setProfBiography] = useState(() => doctor?.profBiography || '')
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>(() => doctor?.status || 'ACTIVE')
  const [departmentId, setDepartmentId] = useState(() => (
    doctor?.departmentId ? String(doctor.departmentId) : ''
  ))
  const [imageUrl, setImageUrl] = useState(() => doctor?.image || '')
  const [imageData, setImageData] = useState('')
  const [imageError, setImageError] = useState('')

  if (!shouldOpen) return null

  const imagePreview = imageData || imageUrl
  const displayName = fullName || doctor?.name || 'Bác sĩ'

  const resetFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleImageUrlChange = (value: string) => {
    setImageUrl(value)
    setImageData('')
    setImageError('')
    resetFileInput()
  }

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageError('Vui lòng chọn đúng file ảnh.')
      resetFileInput()
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError('Ảnh không được vượt quá 5MB.')
      resetFileInput()
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setImageError('Không thể đọc file ảnh.')
        return
      }

      setImageData(reader.result)
      setImageError('')
    }
    reader.onerror = () => setImageError('Không thể đọc file ảnh.')
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (imageError) return

    onSubmit({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      phone: phone.trim(),
      licenseNumber: licenseNumber.trim(),
      cccd: cccd.trim(),
      experienceYears: experienceYears.trim(),
      consultationFee: consultationFee.trim(),
      description: description.trim(),
      profBiography: profBiography.trim(),
      status,
      departmentId,
      imageUrl: imageUrl.trim(),
      imageData,
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 px-lg py-xl backdrop-blur-sm" role="presentation">
      <button aria-label="Đóng hộp thoại" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <form
        aria-modal="true"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-surface-container-lowest p-xl shadow-[0px_20px_50px_rgba(15,23,42,0.12)]"
        onSubmit={handleSubmit}
        role="dialog"
      >
        <div className="mb-xl flex items-start justify-between gap-lg border-b border-outline-variant/30 pb-lg">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">{isCreating ? 'Thêm bác sĩ' : 'Cập nhật bác sĩ'}</h2>
            <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{email || doctor?.licenseNumber || 'Tạo tài khoản bác sĩ mới'}</p>
          </div>
          <Button
            aria-label="Đóng"
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
          {error && <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">{error}</p>}
          <Input
            id="doctor-full-name"
            label="Tên bác sĩ"
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Nhập tên bác sĩ"
            required
            type="text"
            value={fullName}
          />

          {isCreating && (
            <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
              <Input
                id="doctor-email"
                label="Email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="doctor@example.com"
                required
                type="email"
                value={email}
              />
              <Input
                id="doctor-password"
                label="Mật khẩu"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
              <Input
                id="doctor-phone"
                label="Số điện thoại"
                onChange={(event) => setPhone(event.target.value)}
                placeholder="090..."
                type="tel"
                value={phone}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
            <Input
              id="doctor-license-number"
              label="Mã giấy phép"
              onChange={(event) => setLicenseNumber(event.target.value)}
              placeholder="Nhập mã giấy phép"
              required
              type="text"
              value={licenseNumber}
            />
            <Input
              id="doctor-cccd"
              label="CCCD"
              maxLength={12}
              onChange={(event) => setCccd(event.target.value.replace(/\D/g, '').slice(0, 12))}
              pattern="\d{12}"
              placeholder="Nhập 12 số CCCD"
              type="text"
              value={cccd}
            />
          </div>

          <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
            <Input
              id="doctor-experience-years"
              label="Năm kinh nghiệm"
              min={0}
              onChange={(event) => setExperienceYears(event.target.value)}
              placeholder="0"
              type="number"
              value={experienceYears}
            />
            <Input
              id="doctor-consultation-fee"
              label="Phí tư vấn"
              min={0}
              onChange={(event) => setConsultationFee(event.target.value)}
              placeholder="0"
              type="number"
              value={consultationFee}
            />
          </div>

          <div className="grid grid-cols-1 gap-md sm:grid-cols-[112px_1fr] sm:items-end">
            <div className="h-28 w-28 overflow-hidden rounded-lg bg-surface-variant">
              <Image alt={displayName} className="h-full w-full object-cover" fallbackClassName="h-full w-full" src={imagePreview} />
            </div>
            <div className="space-y-md">
              <Input
                id="doctor-image-url"
                label="URL ảnh bác sĩ"
                onChange={(event) => handleImageUrlChange(event.target.value)}
                placeholder="https://example.com/doctor.jpg"
                type="url"
                value={imageUrl}
              />
              <div className="flex flex-wrap items-center gap-sm">
                <input
                  accept="image/*"
                  className="sr-only"
                  id="doctor-image-file"
                  onChange={handleImageFileChange}
                  ref={fileInputRef}
                  type="file"
                />
                <Button
                  className="inline-flex items-center justify-center gap-xs px-md py-sm"
                  disabled={isSaving}
                  fullWidth={false}
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  variant="ghost"
                >
                  <Icon className="text-lg" name="upload" />
                  Chọn ảnh từ máy
                </Button>
                {imageData && (
                  <Button
                    className="px-md py-sm"
                    disabled={isSaving}
                    fullWidth={false}
                    onClick={() => {
                      setImageData('')
                      resetFileInput()
                    }}
                    type="button"
                    variant="ghost"
                  >
                    Bỏ chọn ảnh
                  </Button>
                )}
              </div>
              {imageError && <p className="font-body-sm text-body-sm text-error">{imageError}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="doctor-department">
                Khoa
              </label>
              <select
                className="w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                disabled={departmentOptions.length === 0}
                id="doctor-department"
                onChange={(event) => setDepartmentId(event.target.value)}
                value={departmentId}
              >
                <option value="">Chưa chọn khoa</option>
                {departmentOptions.map((option) => (
                  <option key={option.departmentId} value={option.departmentId}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="doctor-status">
                Trạng thái
              </label>
              <select
                className="w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                id="doctor-status"
                onChange={(event) => setStatus(event.target.value as 'ACTIVE' | 'INACTIVE')}
                value={status}
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Ngoại tuyến</option>
              </select>
            </div>
          </div>

          <div className="space-y-xs">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="doctor-description">
              Mô tả
            </label>
            <textarea
              className="min-h-28 w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              id="doctor-description"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Nhập mô tả chuyên môn"
              value={description}
            />
          </div>

          <div className="space-y-xs">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="doctor-prof-biography">
              Tiểu sử chuyên môn
            </label>
            <textarea
              className="min-h-36 w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              id="doctor-prof-biography"
              onChange={(event) => setProfBiography(event.target.value)}
              placeholder="Nhập tiểu sử chuyên môn của bác sĩ"
              value={profBiography}
            />
          </div>
        </div>

        <div className="mt-xl flex justify-end gap-md border-t border-outline-variant/30 pt-lg">
          <Button className="px-lg py-sm" fullWidth={false} onClick={onClose} type="button" variant="ghost">
            Hủy
          </Button>
          <Button className="px-lg py-sm" fullWidth={false} isLoading={isSaving} type="submit">
            {isCreating ? 'Tạo bác sĩ' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default DoctorEditModal
