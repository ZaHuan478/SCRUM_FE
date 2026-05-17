import React from 'react'
import Icon from './Icon'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  icon?: string
}

const Input: React.FC<InputProps> = ({ label, icon, className = '', ...rest }) => {
  return (
    <div className="space-y-xs">
      {label && <label className="font-label-md text-label-md text-on-surface">{label}</label>}
      <div className="relative">
        {icon && <Icon name={icon} className="absolute left-md top-1/2 -translate-y-1/2 text-outline" />}
        <input
          className={`w-full pl-xxl pr-md py-md border border-outline-variant rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body-md text-body-md ${className}`}
          {...rest}
        />
      </div>
    </div>
  )
}

export default Input
