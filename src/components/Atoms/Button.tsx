import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
  isLoading?: boolean
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading = false, className = '', disabled, ...rest }) => {
  const classes =
    variant === 'primary'
      ? 'w-full bg-primary text-on-primary py-md rounded-lg font-label-md text-label-md shadow-sm hover:shadow-lg hover:bg-primary-container active:scale-[0.98] transition-all disabled:cursor-not-allowed disabled:opacity-60'
      : 'w-full border border-outline-variant rounded-lg py-sm px-md text-label-md disabled:cursor-not-allowed disabled:opacity-60'

  return (
    <button className={`${classes} ${className}`} disabled={disabled || isLoading} {...rest}>
      {isLoading ? 'Đang xử lý...' : children}
    </button>
  )
}

export default Button
