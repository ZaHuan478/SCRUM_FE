import type { FormEvent } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'

type ForgotPasswordModalProps = {
  email: string
  error: string
  success: string
  isLoading: boolean
  open: boolean
  onClose: () => void
  onEmailChange: (email: string) => void
  onSubmit: (email: string) => void
}

const ForgotPasswordModal = ({
  email,
  error,
  success,
  isLoading,
  open,
  onClose,
  onEmailChange,
  onSubmit,
}: ForgotPasswordModalProps) => {
  if (!open) return null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(email)
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
            <Icon name="mail" />
          </div>
          <p className="font-label-md text-label-md uppercase tracking-[0.12em]">Quên mật khẩu</p>
          <h2 className="mt-sm font-headline-sm text-headline-sm text-on-primary-container">Nhận mã xác thực</h2>
        </div>

        <div className="p-xl space-y-lg">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Nhập email bạn đã dùng để đăng ký. Hệ thống sẽ gửi mã xác thực 6 chữ số vào địa chỉ này để đặt lại mật khẩu.
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
            icon="mail"
            id="forgot-email"
            label="Email nhận liên kết"
            name="email"
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="name@email.com"
            required
            type="email"
            value={email}
          />

          <div className="rounded-xl border border-outline-variant bg-surface-container p-md">
            <p className="font-label-sm text-label-sm text-on-surface-variant">Lưu ý:</p>
            <ul className="mt-sm space-y-2 text-body-sm text-body-sm text-on-surface-variant list-disc pl-md">
              <li>Link sẽ được gửi vào email cá nhân của bạn.</li>
              <li>Link chỉ có giá trị trong thời gian giới hạn.</li>
              <li>Kiểm tra hộp thư đến hoặc mục spam nếu không nhận được.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-sm sm:flex-row sm:justify-end">
            <Button fullWidth={false} onClick={onClose} type="button" variant="ghost">
              Hủy
            </Button>
            <Button fullWidth={false} isLoading={isLoading} type="submit">
              Gửi mã xác thực
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ForgotPasswordModal
