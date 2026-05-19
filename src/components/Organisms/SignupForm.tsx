import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Atoms/Logo'
import Input from '../Atoms/Input'
import Button from '../Atoms/Button'
import SocialLogin from '../Molecules/SocialLogin'
import Divider from '../Molecules/Common/Divider'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const SignupForm: React.FC = () => {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') || '')
    const password = String(formData.get('password') || '')
    const confirmPassword = String(formData.get('confirmPassword') || '')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json().catch(() => ({
        success: false,
        message: `Backend returned ${response.status}`,
      }))
      if (!result.success) {
        setMessage(result.message || 'Signup failed')
        return
      }

      setMessage('Signup successfully. You can login now.')
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
        <h3 className="font-headline-lg text-headline-lg text-on-surface">Tạo tài khoản</h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Tạo tài khoản mới để bắt đầu sử dụng nền tảng.
        </p>
      </header>

      <SocialLogin onSuccess={setMessage} onError={setMessage} />

      <Divider />

      <form className="space-y-lg" onSubmit={handleSubmit}>
        <Input label="Địa chỉ Email" id="signup-email" name="email" type="email" placeholder="ten@vidu.com" icon="mail" />
        <Input label="Mật khẩu" id="signup-password" name="password" type="password" placeholder="********" icon="lock" />
        <Input label="Xác nhận mật khẩu" id="signup-confirm" name="confirmPassword" type="password" placeholder="********" icon="lock" />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-sm cursor-pointer group">
            <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all" type="checkbox" />
            <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface">Tôi đồng ý với điều khoản</span>
          </label>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Loading...' : 'Đăng ký'}
        </Button>
        {message && <p className="font-body-sm text-body-sm text-center text-on-surface-variant">{message}</p>}
      </form>

      <footer className="pt-lg text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Đã có tài khoản? <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4" to="/">Đăng nhập</Link>
        </p>
      </footer>
    </div>
  )
}

export default SignupForm
