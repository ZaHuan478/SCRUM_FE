import { GoogleLogin } from '@react-oauth/google'
import type { CredentialResponse } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../../../contexts/LanguageContext'
import { loginWithGoogle, saveAuthSession } from '../../../services/auth.service'

type SocialLoginProps = {
  remember?: boolean
  onError?: (message: string) => void
}

export const SocialLogin = ({ remember = true, onError }: SocialLoginProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleGoogleLogin = async (credential?: string) => {
    if (!credential) {
      onError?.(t('auth.googleMissingCredential'))
      return
    }

    try {
      const session = await loginWithGoogle({ credential })
      saveAuthSession(session, remember)
      navigate(session.user.role === 'ADMIN' ? '/admin' : '/')
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : t('auth.googleLoginFailed')
      onError?.(message)
    }
  }

  return (
    <div className="flex w-full justify-center [&>div]:w-full [&_iframe]:w-full">
      <GoogleLogin
        onSuccess={(credentialResponse: CredentialResponse) => handleGoogleLogin(credentialResponse.credential)}
        onError={() => onError?.(t('auth.googleLoginFailed'))}
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
