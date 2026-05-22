import type { FormEvent } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'
import { useTranslation } from '../../../contexts/LanguageContext'

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
  const { t } = useTranslation()

  if (!open) return null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(email)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 px-lg py-xl backdrop-blur-sm">
      <button aria-label={t('auth.closePopup')} className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <form
        aria-modal="true"
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0px_24px_60px_rgba(15,23,42,0.16)]"
        onSubmit={handleSubmit}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-md border-b border-outline-variant/20 px-xl py-lg">
          <div className="flex items-center gap-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
              <Icon className="text-3xl" name="lock_reset" />
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-primary">{t('auth.forgotEyebrow')}</p>
              <h2 className="mt-xs font-headline-sm text-headline-sm text-on-surface">{t('auth.forgotTitle')}</h2>
            </div>
          </div>
          <button
            aria-label={t('auth.close')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="space-y-lg p-xl">
          <p className="font-body-md text-body-md text-on-surface-variant">
            {t('auth.forgotDescription')}
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
            icon="mail"
            id="forgot-email"
            label="Email"
            name="email"
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="name@email.com"
            required
            type="email"
            value={email}
          />

          <div className="flex flex-col-reverse gap-sm sm:flex-row sm:justify-end">
            <Button className="px-lg" fullWidth={false} onClick={onClose} type="button" variant="ghost">
              {t('auth.cancel')}
            </Button>
            <Button className="px-lg" fullWidth={false} isLoading={isLoading} type="submit">
              {t('auth.sendCode')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ForgotPasswordModal
