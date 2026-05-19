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
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0px_24px_60px_rgba(15,23,42,0.16)]"
        onSubmit={handleSubmit}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-md border-b border-outline-variant/20 px-xl py-lg">
          <div className="flex items-center gap-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
              <Icon className="text-3xl" name="password" />
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-primary">Đặt lại mật khẩu</p>
              <h2 className="mt-xs font-headline-sm text-headline-sm text-on-surface">Tạo mật khẩu mới</h2>
            </div>
          </div>
          <button
            aria-label="Đóng"
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="space-y-lg p-xl">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Nhập mã xác thực đã gửi đến email của bạn và tạo mật khẩu mới để hoàn tất khôi phục tài khoản.
          </p>

          {error && (
            <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg bg-secondary-fixed px-md py-sm font-body-sm text-body-sm text-on-secondary-fixed">
              {success}
            </p>
          )}

          <Input
            autoComplete="email"
            className="bg-surface-container-low text-on-surface-variant"
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
            icon="pin"
            id="reset-code"
            inputMode="numeric"
            label="Mã xác thực"
            maxLength={6}
            name="code"
            onChange={(event) => onCodeChange(event.target.value)}
            placeholder="Nhập mã 6 chữ số"
            type="text"
            value={code}
          />

          <div className="grid gap-md sm:grid-cols-2">
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
              placeholder="Nhập lại mật khẩu"
              type="password"
              value={confirmPassword}
            />
          </div>

          <div className="flex flex-col-reverse gap-sm sm:flex-row sm:justify-end">
            <Button className="px-lg" fullWidth={false} onClick={onClose} type="button" variant="ghost">
              Hủy
            </Button>
            <Button className="px-lg" fullWidth={false} isLoading={isLoading} type="submit">
              Xác nhận
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ResetPasswordModal
