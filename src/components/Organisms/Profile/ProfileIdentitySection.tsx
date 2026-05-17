import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'
import type { User } from '../../../services/auth.service'
import type { LoadStatus, ProfileFormState } from '../../../utils/profile'

type ProfileIdentitySectionProps = {
  cccdValid: boolean
  doctorDepartmentValue: string
  doctorDescriptionValue: string
  emailMatches: boolean
  error: string
  form: ProfileFormState
  isSaving: boolean
  phoneValid: boolean
  status: LoadStatus
  success: string
  userRole: User['role']
  onFieldChange: (field: keyof ProfileFormState, value: string) => void
}

const ProfileIdentitySection = ({
  cccdValid,
  doctorDepartmentValue,
  doctorDescriptionValue,
  emailMatches,
  error,
  form,
  isSaving,
  phoneValid,
  status,
  success,
  userRole,
  onFieldChange,
}: ProfileIdentitySectionProps) => (
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
        onChange={(event) => onFieldChange('fullName', event.target.value)}
        type="text"
        value={form.fullName}
      />
      <Input
        autoComplete="bday"
        id="profile-date-of-birth"
        label="Ngày sinh"
        onChange={(event) => onFieldChange('dateOfBirth', event.target.value)}
        type="date"
        value={form.dateOfBirth}
      />
      <Input
        autoComplete="email"
        error={!emailMatches && form.emailConfirmation ? 'Email xác nhận không khớp.' : undefined}
        id="profile-email"
        label="Email"
        onChange={(event) => onFieldChange('email', event.target.value)}
        required
        type="email"
        value={form.email}
      />
      <Input
        autoComplete="email"
        error={!emailMatches && form.emailConfirmation ? 'Nhập lại đúng email.' : undefined}
        id="profile-email-confirmation"
        label="Xác nhận email"
        onChange={(event) => onFieldChange('emailConfirmation', event.target.value)}
        required
        type="email"
        value={form.emailConfirmation}
      />
      <Input
        autoComplete="tel"
        error={!phoneValid ? 'SĐT cần có 9 đến 15 chữ số.' : undefined}
        id="profile-phone"
        label="Số điện thoại"
        onChange={(event) => onFieldChange('phone', event.target.value)}
        type="tel"
        value={form.phone}
      />
      <Input
        error={!cccdValid ? 'CCCD phải gồm đúng 12 chữ số.' : undefined}
        id="profile-cccd-number"
        inputMode="numeric"
        label="Số CCCD"
        maxLength={12}
        onChange={(event) => onFieldChange('cccdNumber', event.target.value.replace(/\D/g, '').slice(0, 12))}
        type="text"
        value={form.cccdNumber}
      />
    </div>

    {userRole === 'DOCTOR' && (
      <div className="mt-lg grid grid-cols-1 gap-lg border-t border-outline-variant/30 pt-lg md:grid-cols-2">
        <Input
          className="cursor-not-allowed bg-surface-container text-on-surface-variant"
          disabled
          id="profile-doctor-department"
          label="Khoa"
          readOnly
          type="text"
          value={doctorDepartmentValue || 'Chưa phân khoa'}
        />
        <div className="space-y-xs md:col-span-2">
          <label className="font-label-md text-label-md text-on-surface" htmlFor="profile-doctor-description">
            Description
          </label>
          <textarea
            className="min-h-28 w-full cursor-not-allowed rounded-lg border border-outline-variant bg-surface-container px-md py-md font-body-md text-body-md text-on-surface-variant outline-none"
            disabled
            id="profile-doctor-description"
            readOnly
            value={doctorDescriptionValue || 'Chưa cập nhật'}
          />
        </div>
      </div>
    )}

    <div className="mt-xl flex flex-col gap-md border-t border-outline-variant/30 pt-lg sm:flex-row sm:justify-between">
      <Button className="px-lg py-sm" disabled={status === 'loading'} fullWidth={false} isLoading={isSaving} type="submit">
        Lưu hồ sơ
      </Button>
    </div>
  </section>
)

export default ProfileIdentitySection
