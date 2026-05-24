import type { HTMLAttributes } from 'react'
import Select from './Select'
import type { UserGender } from '../../../services/auth.service'

type GenderSelectValue = UserGender | ''

type GenderSelectProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  disabled?: boolean
  label?: string
  name?: string
  placeholder?: string
  required?: boolean
  title?: string
  value: GenderSelectValue
  wrapperClassName?: string
  onChange: (value: GenderSelectValue) => void
}

const genderOptions: Array<{ label: string; value: GenderSelectValue }> = [
  { label: 'Chưa cập nhật', value: '' },
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
  { label: 'Khác', value: 'OTHER' },
]

const GenderSelect = ({
  className = '',
  disabled,
  id,
  label = 'Giới tính',
  name,
  placeholder = 'Chưa cập nhật',
  required,
  title,
  value,
  wrapperClassName = '',
  onChange,
}: GenderSelectProps) => {
  const options = genderOptions.map((option) => ({
    ...option,
    label: option.value ? option.label : placeholder,
  }))

  return (
    <Select
      className={className}
      disabled={disabled}
      id={id}
      label={label}
      name={name}
      onChange={(nextValue) => onChange(nextValue as GenderSelectValue)}
      options={options}
      required={required}
      title={title}
      value={value}
      wrapperClassName={wrapperClassName}
    />
  )
}

export default GenderSelect
