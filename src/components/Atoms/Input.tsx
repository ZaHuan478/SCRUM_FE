import React from 'react'
import Icon from './Icon'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  icon?: string
  error?: string
  wrapperClassName?: string
}

const Input: React.FC<InputProps> = ({ label, icon, error, wrapperClassName = '', className = '', id, name, ...rest }) => {
  const inputId = id || name
  const errorId = error && inputId ? `${inputId}-error` : undefined

  return (
    <div className={`space-y-xs ${wrapperClassName}`}>
      {label && <label className="font-label-md text-label-md text-on-surface" htmlFor={inputId}>{label}</label>}
      <div className="relative">
        {icon && <Icon name={icon} className="absolute left-md top-1/2 -translate-y-1/2 text-outline" />}
        <input
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          className={`w-full ${icon ? 'pl-xxl' : 'pl-md'} min-h-11 rounded-lg border bg-surface/85 pr-md py-sm shadow-sm backdrop-blur ${error ? 'border-error' : 'border-outline-variant/70'} font-body-md text-body-md text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-4 focus:ring-primary/10 ${className}`}
          id={inputId}
          name={name}
          {...rest}
        />
      </div>
      {error && <p className="font-body-sm text-body-sm text-error" id={errorId}>{error}</p>}
    </div>
  )
}

export default Input
