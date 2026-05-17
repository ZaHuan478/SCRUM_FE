import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../Atoms/Logo'
import Input from '../Atoms/Input'
import Button from '../Atoms/Button'
import Checkbox from '../Atoms/Checkbox'
import SocialLogin from '../Molecules/SocialLogin'
import { login, saveAuthSession } from '../../services/auth.service'

const AuthForm = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu.')
      return
    }

    setIsSubmitting(true)

    try {
      const session = await login({ email, password })
      saveAuthSession(session, remember)
      navigate(session.user.role === 'ADMIN' ? '/admin' : '/profile')
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Đăng nhập không thành công.'
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
        <h3 className="font-headline-lg text-headline-lg text-on-surface">Chào mừng trở lại</h3>
        <p className="font-body-md text-body-md text-on-surface-variant">Nhập thông tin để truy cập cổng thông tin MedPrecision.</p>
      </header>

      <SocialLogin />

      {/* <Divider /> */}

      <form className="space-y-lg" onSubmit={handleSubmit}>
        {error && <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">{error}</p>}
        <Input
          autoComplete="email"
          icon="mail"
          id="email"
          label="Địa chỉ email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder=""
          type="email"
          value={email}
        />
        <Input
          autoComplete="current-password"
          icon="lock"
          id="password"
          label="Mật khẩu"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder=""
          type="password"
          value={password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-sm cursor-pointer group">
            <Checkbox
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
            <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface">Ghi nhớ đăng nhập</span>
          </label>
          <a className="font-label-md text-label-md text-primary hover:underline decoration-2 underline-offset-4" href="#">Quên mật khẩu?</a>
        </div>

        <Button isLoading={isSubmitting} type="submit">Đăng nhập</Button>
      </form>

      <footer className="pt-lg text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Chưa có tài khoản? <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4" to="/signup">Đăng ký ngay</Link>
        </p>
      </footer>
    </div>
  )
}

export default AuthForm
