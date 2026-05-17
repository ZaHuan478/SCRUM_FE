import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../Atoms/Logo'
import Input from '../Atoms/Input'
import Button from '../Atoms/Button'
import Checkbox from '../Atoms/Checkbox'
import SocialLogin from '../Molecules/SocialLogin'
import { register } from '../../services/auth.service'

const SignupForm = () => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
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
      setError('Email và mật khẩu là bắt buộc.')
      return
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    if (!acceptedTerms) {
      setError('Bạn cần đồng ý với điều khoản trước khi đăng ký.')
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        full_name: fullName.trim() || undefined,
        email,
        password,
        phone: phone.trim() || undefined,
      })
      setSuccess('Đăng ký thành công. Bạn có thể đăng nhập ngay.')
      window.setTimeout(() => navigate('/login'), 700)
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Đăng ký không thành công.'
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
        <h3 className="font-headline-lg text-headline-lg text-on-surface">Tạo tài khoản</h3>
        <p className="font-body-md text-body-md text-on-surface-variant">Tạo tài khoản mới để bắt đầu sử dụng nền tảng.</p>
      </header>

      <SocialLogin />

      {/* <Divider /> */}

      <form className="space-y-lg" onSubmit={handleSubmit}>
        {error && <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">{error}</p>}
        {success && <p className="rounded-lg bg-secondary-fixed px-md py-sm font-body-sm text-body-sm text-on-secondary-fixed">{success}</p>}
        <Input
          autoComplete="name"
          icon="person"
          id="signup-full-name"
          label="Họ và tên"
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
          label="Số điện thoại"
          name="phone"
          onChange={(event) => setPhone(event.target.value)}
          placeholder=""
          type="tel"
          value={phone}
        />
        <Input
          autoComplete="email"
          icon="mail"
          id="signup-email"
          label="Địa chỉ email"
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
          label="Mật khẩu"
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
          label="Xác nhận mật khẩu"
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
            <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface">Tôi đồng ý với điều khoản</span>
          </label>
        </div>

        <Button isLoading={isSubmitting} type="submit">Đăng ký</Button>
      </form>

      <footer className="pt-lg text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Đã có tài khoản? <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4" to="/login">Đăng nhập</Link>
        </p>
      </footer>
    </div>
  )
}

export default SignupForm
