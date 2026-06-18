import React from 'react'
import { useTranslation } from '../../contexts/LanguageContext'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
  isLoading?: boolean
  fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading = false, fullWidth = true, className = '', disabled, ...rest }) => {
  const { t } = useTranslation()
  const widthClass = fullWidth ? 'w-full' : 'w-auto'
  const classes =
    variant === 'primary'
      ? `${widthClass} min-h-11 rounded-lg bg-primary px-lg py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-primary shadow-[0_12px_24px_rgba(2,132,199,0.20)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-[0_16px_30px_rgba(2,132,199,0.26)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0`
      : `${widthClass} min-h-11 rounded-lg border border-outline-variant/60 bg-surface/80 px-md py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-surface shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary-fixed/35 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0`

  return (
    <button className={`${classes} ${className}`} disabled={disabled || isLoading} {...rest}>
      {isLoading ? t('common.processing') : children}
    </button>
  )
}

export default Button
