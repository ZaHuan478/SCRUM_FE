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
      ? `${widthClass} min-h-11 rounded bg-primary px-lg py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-primary transition-colors hover:bg-primary-container active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60`
      : `${widthClass} min-h-11 rounded border border-outline-variant bg-surface px-md py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-surface transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60`

  return (
    <button className={`${classes} ${className}`} disabled={disabled || isLoading} {...rest}>
      {isLoading ? t('common.processing') : children}
    </button>
  )
}

export default Button
