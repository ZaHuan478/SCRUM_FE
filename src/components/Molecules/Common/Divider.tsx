import React from 'react'
import { useTranslation } from '../../../contexts/LanguageContext'

const Divider: React.FC<{ text?: string }> = ({ text }) => {
  const { t } = useTranslation()

  return (
    <div className="relative flex items-center py-sm">
      <div className="flex-grow border-t border-outline-variant"></div>
      <span className="flex-shrink mx-md font-label-sm text-label-sm text-outline">{text ?? t('auth.emailDivider')}</span>
      <div className="flex-grow border-t border-outline-variant"></div>
    </div>
  )
}

export default Divider
