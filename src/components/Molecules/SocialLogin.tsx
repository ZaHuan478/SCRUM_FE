import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import type { CredentialResponse } from '@react-oauth/google'

type SocialLoginProps = {
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

const API_URL = import.meta.env.VITE_API_URL;

export const SocialLogin: React.FC<SocialLoginProps> = ({ onSuccess, onError }) => {
  const handleGoogleLogin = async (credential?: string) => {
    if (!credential) {
      onError('Google credential is missing')
      return
    }

    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      })

      const result = await response.json().catch(() => ({
        success: false,
        message: `Backend returned ${response.status}`,
      }))
      if (!result.success) {
        onError(result.message || 'Google login failed')
        return
      }

      localStorage.setItem('token', result.data.token)
      localStorage.setItem('user', JSON.stringify(result.data.user))
      onSuccess(`Logged in as ${result.data.user.email}`)
    } catch {
      onError('Cannot connect to backend')
    }
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={(credentialResponse: CredentialResponse) => handleGoogleLogin(credentialResponse.credential)}
        onError={() => onError('Google login failed')}
      />
    </div>
  )
}

export default SocialLogin
