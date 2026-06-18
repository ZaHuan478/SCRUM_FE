import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Logo from '../../Atoms/Logo'
import Input from '../../Atoms/Input'
import Button from '../../Atoms/Button'
import Checkbox from '../../Atoms/Checkbox'
import SocialLogin from '../../Molecules/Auth/SocialLogin'
import Divider from '../../Molecules/Common/Divider'
import ForgotPasswordModal from './ForgotPasswordModal'
import ResetPasswordModal from './ResetPasswordModal'
import { useTranslation } from '../../../contexts/LanguageContext'
import { forgotPassword, login, resetPassword, saveAuthSession } from '../../../services/auth.service'

const AuthForm = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [forgotModalOpen, setForgotModalOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotMessage, setForgotMessage] = useState('')
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false)
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [resetPasswordValue, setResetPasswordValue] = useState('')
  const [resetConfirmPassword, setResetConfirmPassword] = useState('')
  const [resetError, setResetError] = useState('')
  const [resetSuccess, setResetSuccess] = useState('')
  const [isResetSubmitting, setIsResetSubmitting] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setResetEmail(emailParam)
      setResetModalOpen(true)
    }
  }, [searchParams])

  const openForgotPasswordModal = () => {
    setForgotError('')
    setForgotMessage('')
    setForgotEmail(email)
    setForgotModalOpen(true)
  }

  const closeForgotPasswordModal = () => {
    setForgotModalOpen(false)
    setForgotError('')
  }

  const handleConfirmForgotPassword = async (submittedEmail: string) => {
    setForgotError('')
    setForgotMessage('')

    if (!submittedEmail) {
      setForgotError(t('auth.forgotMissingEmail'))
      return
    }

    setIsForgotSubmitting(true)
    try {
      await forgotPassword({ email: submittedEmail })
      setForgotMessage(t('auth.forgotSent'))
      setEmail(submittedEmail)
      setResetEmail(submittedEmail)
      setForgotModalOpen(false)
      setResetModalOpen(true)
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : t('auth.requestFailed')
      setForgotError(message)
    } finally {
      setIsForgotSubmitting(false)
    }
  }

  const handleConfirmResetPassword = async () => {
    setResetError('')
    setResetSuccess('')

    if (!resetEmail) {
      setResetError(t('auth.resetInvalidEmail'))
      return
    }

    if (!resetCode) {
      setResetError(t('auth.resetMissingCode'))
      return
    }

    if (!resetPasswordValue || !resetConfirmPassword) {
      setResetError(t('auth.resetMissingPassword'))
      return
    }

    if (resetPasswordValue !== resetConfirmPassword) {
      setResetError(t('auth.passwordMismatch'))
      return
    }

    setIsResetSubmitting(true)
    try {
      await resetPassword({ email: resetEmail, code: resetCode, password: resetPasswordValue })
      setResetSuccess(t('auth.resetSuccess'))
      setResetModalOpen(false)
      setResetCode('')
      setResetPasswordValue('')
      setResetConfirmPassword('')
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : t('auth.resetFailed')
      setResetError(message)
    } finally {
      setIsResetSubmitting(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email || !password) {
      setError(t('auth.validationEmailPassword'))
      return
    }

    setIsSubmitting(true)

    try {
      const session = await login({ email, password })
      saveAuthSession(session, remember)
      navigate(session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN' ? '/admin' : '/')
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : t('auth.loginFailed')
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-xl">
      <div className="lg:hidden flex items-center gap-sm mb-xl">
        <Logo compact />
      </div>

      <header className="space-y-sm">
        <h3 className="font-headline-lg text-headline-lg text-on-surface">{t('auth.welcomeBack')}</h3>
        <p className="font-body-md text-body-md text-on-surface-variant">{t('auth.loginDescription')}</p>
      </header>

      <SocialLogin remember={remember} onError={setError} />

      <Divider />

      <form className="space-y-lg" onSubmit={handleSubmit}>
        {error && <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">{error}</p>}
        {forgotMessage && <p className="rounded-lg bg-surface-2 px-md py-sm font-body-sm text-body-sm text-on-surface">{forgotMessage}</p>}
        <Input
          autoComplete="email"
          icon="mail"
          id="email"
          label={t('auth.emailLabel')}
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t('auth.emailPlaceholder')}
          type="email"
          value={email}
        />
        <Input
          autoComplete="current-password"
          icon="lock"
          id="password"
          label={t('auth.passwordLabel')}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder={t('auth.passwordPlaceholder')}
          type="password"
          value={password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-sm cursor-pointer group">
            <Checkbox
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
            <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface">{t('auth.rememberMe')}</span>
          </label>
          <button
            type="button"
            disabled={isSubmitting || isForgotSubmitting}
            onClick={openForgotPasswordModal}
            className="font-label-md text-label-md text-primary hover:underline decoration-2 underline-offset-4"
          >
            {t('auth.forgotPassword')}
          </button>
        </div>

        <Button isLoading={isSubmitting} type="submit">{t('auth.loginButton')}</Button>
      </form>

      <ForgotPasswordModal
        email={forgotEmail}
        error={forgotError}
        success={forgotMessage}
        isLoading={isForgotSubmitting}
        open={forgotModalOpen}
        onClose={closeForgotPasswordModal}
        onEmailChange={setForgotEmail}
        onSubmit={handleConfirmForgotPassword}
      />

      <ResetPasswordModal
        open={resetModalOpen}
        email={resetEmail}
        code={resetCode}
        password={resetPasswordValue}
        confirmPassword={resetConfirmPassword}
        error={resetError}
        success={resetSuccess}
        isLoading={isResetSubmitting}
        onClose={() => setResetModalOpen(false)}
        onCodeChange={setResetCode}
        onPasswordChange={setResetPasswordValue}
        onConfirmPasswordChange={setResetConfirmPassword}
        onSubmit={handleConfirmResetPassword}
      />

      <footer className="pt-lg text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {t('auth.noAccount')} <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4" to="/signup">{t('auth.signupNow')}</Link>
        </p>
      </footer>
    </div>
  )
}

export default AuthForm
