import type { FormEvent } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'

type ResetPasswordModalProps = {
  email: string
  code: string
  password: string
  confirmPassword: string
  error: string
  success: string
  isLoading: boolean
  open: boolean
  onClose: () => void
  onCodeChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onSubmit: () => void
}

const ResetPasswordModal = ({
  email,
  code,
  password,
  confirmPassword,
  error,
  success,
  isLoading,
  open,
  onClose,
  onCodeChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: ResetPasswordModalProps) => {
  if (!open) return null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 px-lg py-xl backdrop-blur-sm">
      <button aria-label="Đóng popup" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <form
        aria-modal="true"
        className="relative w-full max-w-lg overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_20px_50px_rgba(15,23,42,0.12)]"
        onSubmit={handleSubmit}
        role="dialog"
      >
        <div className="bg-primary-container px-lg py-lg text-center text-on-primary-container">
          <div className="mx-auto mb-md flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-4xl">
            <Icon name="lock_reset" />
          </div>
          <p className="font-label-md text-label-md uppercase tracking-[0.12em]">Đặt lại mật khẩu</p>
          <h2 className="mt-sm font-headline-sm text-headline-sm text-on-primary-container">Nhập mật khẩu mới</h2>
        </div>

        <div className="p-xl space-y-lg">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Nhập mã xác thực và mật khẩu mới để hoàn tất việc khôi phục tài khoản.
          </p>

          {error && (
            <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg bg-surface-2 px-md py-sm font-body-sm text-body-sm text-on-surface">
              {success}
            </p>
          )}

          <Input
            autoComplete="email"
            disabled
            icon="mail"
            id="reset-email"
            label="Email"
            name="email"
            placeholder="Email của bạn"
            type="email"
            value={email}
          />

          <Input
            autoComplete="one-time-code"
            icon="key"
            id="reset-code"
            label="Mã xác thực"
            name="code"
            onChange={(event) => onCodeChange(event.target.value)}
            placeholder="Nhập mã 6 chữ số"
            type="text"
            value={code}
          />

          <Input
            autoComplete="new-password"
            icon="lock"
            id="reset-password"
            label="Mật khẩu mới"
            name="password"
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="Nhập mật khẩu mới"
            type="password"
            value={password}
          />

          <Input
            autoComplete="new-password"
            icon="lock"
            id="reset-password-confirm"
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            onChange={(event) => onConfirmPasswordChange(event.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            type="password"
            value={confirmPassword}
          />

        

          <div className="flex flex-col gap-sm sm:flex-row sm:justify-end">
            <Button fullWidth={false} variant="ghost" onClick={onClose} type="button">
              Hủy
            </Button>
            <Button fullWidth={false} isLoading={isLoading} type="submit">
              Xác nhận đặt lại
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ResetPasswordModal
