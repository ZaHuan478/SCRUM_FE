import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Atoms/Logo'
import Input from '../Atoms/Input'
import Button from '../Atoms/Button'
import SocialLogin from '../Molecules/SocialLogin'
import Divider from '../Molecules/Common/Divider'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const AuthForm: React.FC = () => {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') || '')
    const password = String(formData.get('password') || '')

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json().catch(() => ({
        success: false,
        message: `Backend returned ${response.status}`,
      }))
      if (!result.success) {
        setMessage(result.message || 'Login failed')
        return
      }

      localStorage.setItem('token', result.data.token)
      localStorage.setItem('user', JSON.stringify(result.data.user))
      setMessage(`Logged in as ${result.data.user.email}`)
    } catch {
      setMessage('Cannot connect to backend')
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
        <p className="font-body-md text-body-md text-on-surface-variant">
          Vui lòng nhập thông tin để truy cập cổng thông tin của bạn.
        </p>
      </header>

      <SocialLogin onSuccess={setMessage} onError={setMessage} />

      <Divider />

      <form className="space-y-lg" onSubmit={handleSubmit}>
        <Input label="Địa chỉ Email" id="email" name="email" type="email" placeholder="ten@vidu.com" icon="mail" />
        <Input label="Mật khẩu" id="password" name="password" type="password" placeholder="********" icon="lock" />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-sm cursor-pointer group">
            <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all" type="checkbox" />
            <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface">Ghi nhớ đăng nhập</span>
          </label>
          <a className="font-label-md text-label-md text-primary hover:underline decoration-2 underline-offset-4" href="#">Quên mật khẩu?</a>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Loading...' : 'Đăng nhập'}
        </Button>
        {message && <p className="font-body-sm text-body-sm text-center text-on-surface-variant">{message}</p>}
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
