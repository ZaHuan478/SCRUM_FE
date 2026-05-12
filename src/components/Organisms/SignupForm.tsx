import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Atoms/Logo'
import Input from '../Atoms/Input'
import Button from '../Atoms/Button'
import SocialLogin from '../Molecules/SocialLogin'
import Divider from '../Molecules/Divider'

const SignupForm: React.FC = () => {
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

      <Divider />

      <form className="space-y-lg" onSubmit={(e) => e.preventDefault()}>
        <Input label="Địa chỉ Email" id="signup-email" name="email" type="email" placeholder="ten@vidu.com" icon="mail" />
        <Input label="Mật khẩu" id="signup-password" name="password" type="password" placeholder="••••••••" icon="lock" />
        <Input label="Xác nhận mật khẩu" id="signup-confirm" name="confirmPassword" type="password" placeholder="••••••••" icon="lock" />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-sm cursor-pointer group">
            <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all" type="checkbox" />
            <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface">Tôi đồng ý với điều khoản</span>
          </label>
        </div>

        <Button type="submit">Đăng ký</Button>
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
