import type { InputHTMLAttributes } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

const Checkbox = ({ className = '', ...rest }: CheckboxProps) => {
  return (
    <input
      className={`h-5 w-5 rounded border-outline-variant text-primary transition-colors focus:ring-primary ${className}`}
      type="checkbox"
      {...rest}
    />
  )
}

export default Checkbox
