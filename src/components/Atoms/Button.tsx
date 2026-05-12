import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...rest }) => {
  const classes =
    variant === 'primary'
      ? 'w-full bg-primary text-on-primary py-md rounded-lg font-label-md text-label-md shadow-sm hover:shadow-lg hover:bg-primary-container active:scale-[0.98] transition-all'
      : 'w-full border border-outline-variant rounded-lg py-sm px-md text-label-md'

  return (
    <button className={`${classes} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export default Button
