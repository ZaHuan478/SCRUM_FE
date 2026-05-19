import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { loginWithGoogle, saveAuthSession } from '../../../services/auth.service'

type SocialLoginProps = {
  remember?: boolean
  onError?: (message: string) => void
}

export const SocialLogin = ({ remember = true, onError }: SocialLoginProps) => {
  const navigate = useNavigate()

  const handleGoogleLogin = async (credential?: string) => {
    if (!credential) {
      onError?.('Google credential is missing.')
      return
    }

    try {
      const session = await loginWithGoogle({ credential })
      saveAuthSession(session, remember)
      navigate(session.user.role === 'ADMIN' ? '/admin' : '/')
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Google login failed.'
      onError?.(message)
    }
  }

  return (
    <div className="flex w-full justify-center [&>div]:w-full [&_iframe]:w-full">
      <GoogleLogin
        onSuccess={(credentialResponse) => handleGoogleLogin(credentialResponse.credential)}
        onError={() => onError?.('Google login failed.')}
        shape="rectangular"
        size="large"
        text="continue_with"
        logo_alignment="center"
        width="100%"
      />
    </div>
  )
}

export default SocialLogin
