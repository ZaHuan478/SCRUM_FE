import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../Atoms/Logo'
import Input from '../../Atoms/Input'
import Button from '../../Atoms/Button'
import Checkbox from '../../Atoms/Checkbox'
import SocialLogin from '../../Molecules/Auth/SocialLogin'
import Divider from '../../Molecules/Common/Divider'
import { useTranslation } from '../../../contexts/LanguageContext'
import { register } from '../../../services/auth.service'
import type { UserGender } from '../../../services/auth.service'

const SignupForm = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [fullName, setFullName] = useState('')
  const [gender, setGender] = useState<UserGender | ''>('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!email || !password) {
      setError(t('auth.signupEmailPasswordRequired'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'))
      return
    }

    if (!acceptedTerms) {
      setError(t('auth.termsRequired'))
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        full_name: fullName.trim() || undefined,
        email,
        password,
        gender: gender || undefined,
        phone: phone.trim() || undefined,
      })
      setSuccess(t('auth.signupSuccess'))
      window.setTimeout(() => navigate('/login'), 700)
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : t('auth.signupFailed')
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
        <h3 className="font-headline-lg text-headline-lg text-on-surface">{t('auth.createAccount')}</h3>
        <p className="font-body-md text-body-md text-on-surface-variant">{t('auth.signupDescription')}</p>
      </header>

      <SocialLogin onError={setError} />

      <Divider />

      <form className="space-y-lg" onSubmit={handleSubmit}>
        {error && <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">{error}</p>}
        {success && <p className="rounded-lg bg-secondary-fixed px-md py-sm font-body-sm text-body-sm text-on-secondary-fixed">{success}</p>}
        <Input
          autoComplete="name"
          icon="person"
          id="signup-full-name"
          label={t('auth.fullNameLabel')}
          name="fullName"
          onChange={(event) => setFullName(event.target.value)}
          placeholder=""
          type="text"
          value={fullName}
        />
        <Input
          autoComplete="tel"
          icon="call"
          id="signup-phone"
          label={t('auth.phoneLabel')}
          name="phone"
          onChange={(event) => setPhone(event.target.value)}
          placeholder=""
          type="tel"
          value={phone}
        />
        <div className="space-y-xs">
          <label className="font-label-md text-label-md text-on-surface" htmlFor="signup-gender">Gioi tinh</label>
          <select
            className="w-full rounded-lg border border-outline-variant px-md py-md font-body-md text-body-md outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            id="signup-gender"
            name="gender"
            onChange={(event) => setGender(event.target.value as UserGender | '')}
            value={gender}
          >
            <option value="">Chua cap nhat</option>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nu</option>
            <option value="OTHER">Khac</option>
          </select>
        </div>
        <Input
          autoComplete="email"
          icon="mail"
          id="signup-email"
          label={t('auth.emailLabel')}
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder=""
          type="email"
          value={email}
        />
        <Input
          autoComplete="new-password"
          icon="lock"
          id="signup-password"
          label={t('auth.passwordLabel')}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder=""
          type="password"
          value={password}
        />
        <Input
          autoComplete="new-password"
          icon="lock"
          id="signup-confirm"
          label={t('auth.confirmPasswordLabel')}
          name="confirmPassword"
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder=""
          type="password"
          value={confirmPassword}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-sm cursor-pointer group">
            <Checkbox
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
            />
            <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface">{t('auth.acceptTerms')}</span>
          </label>
        </div>

        <Button isLoading={isSubmitting} type="submit">{t('auth.signupButton')}</Button>
      </form>

      <footer className="pt-lg text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {t('auth.hasAccount')} <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4" to="/login">{t('auth.loginButton')}</Link>
        </p>
      </footer>
    </div>
  )
}

export default SignupForm
