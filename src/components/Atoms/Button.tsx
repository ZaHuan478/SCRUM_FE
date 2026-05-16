import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  fullWidth?: boolean
  isLoading?: boolean
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary text-on-primary shadow-sm hover:bg-primary-container hover:shadow-lg',
  secondary: 'bg-surface-container-low text-primary hover:bg-primary-fixed/60',
  ghost: 'border border-outline-variant bg-transparent text-on-surface-variant hover:bg-surface-container-low',
  outline: 'border border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary hover:text-primary',
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = true,
  isLoading = false,
  className = '',
  disabled,
  ...rest
}) => {
  const widthClass = fullWidth ? 'w-full' : 'inline-flex'
  const classes = `${widthClass} items-center justify-center gap-sm rounded-lg px-lg py-md font-label-md text-label-md transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]}`

  return (
    <button className={`${classes} ${className}`} disabled={disabled || isLoading} {...rest}>
      {isLoading ? 'Đang xử lý...' : children}
    </button>
  )
}

export default Button
