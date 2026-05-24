import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import Icon from '../../Atoms/Icon'

export type SelectOption = {
  label: ReactNode
  value: string
  disabled?: boolean
}

type SelectProps = {
  className?: string
  disabled?: boolean
  id?: string
  label?: string
  menuClassName?: string
  name?: string
  options: SelectOption[]
  required?: boolean
  title?: string
  value: string
  wrapperClassName?: string
  onChange: (value: string) => void
}

const Select = ({
  className = '',
  disabled = false,
  id,
  label,
  menuClassName = '',
  name,
  options,
  required = false,
  title,
  value,
  wrapperClassName = '',
  onChange,
}: SelectProps) => {
  const generatedId = useId()
  const selectId = id || generatedId
  const menuId = `${selectId}-menu`
  const selectedOption = options.find((option) => option.value === value) || options[0]
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState({ left: 0, top: 0, width: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return undefined

    const updateMenuPosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return

      setMenuStyle({
        left: rect.left,
        top: rect.bottom + 4,
        width: rect.width,
      })
    }

    updateMenuPosition()
    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)

    return () => {
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  const selectValue = (nextValue: string) => {
    const nextOption = options.find((option) => option.value === nextValue)
    if (!nextOption || nextOption.disabled) return

    onChange(nextValue)
    setOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (event.key === 'Escape') {
      setOpen(false)
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen((current) => !current)
      return
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

    event.preventDefault()
    const enabledOptions = options.filter((option) => !option.disabled)
    const currentIndex = enabledOptions.findIndex((option) => option.value === value)
    const offset = event.key === 'ArrowDown' ? 1 : -1
    const nextIndex = currentIndex < 0
      ? 0
      : (currentIndex + offset + enabledOptions.length) % enabledOptions.length

    selectValue(enabledOptions[nextIndex].value)
  }

  return (
    <div className={`relative space-y-xs ${wrapperClassName}`} ref={rootRef}>
      {label && (
        <label className="font-label-md text-label-md text-on-surface" htmlFor={selectId}>
          {label}
        </label>
      )}
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex w-full items-center justify-between gap-sm rounded-xl border border-outline-variant bg-surface-container-lowest px-md py-md font-body-md text-body-md text-on-surface shadow-sm outline-none transition-all hover:bg-surface-container-high focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-surface-container-low disabled:text-on-surface-variant ${className}`}
        disabled={disabled}
        id={selectId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        ref={buttonRef}
        title={title}
        type="button"
      >
        <span className="min-w-0 truncate text-left">{selectedOption?.label}</span>
        <Icon className={`shrink-0 text-xl text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`} name="keyboard_arrow_down" />
      </button>
      {name && <input name={name} type="hidden" value={value} />}
      {open && (
        <div
          className={`fixed z-[120] max-h-64 overflow-y-auto rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-xs shadow-[0_18px_40px_rgba(15,23,42,0.18)] ${menuClassName}`}
          id={menuId}
          role="listbox"
          style={menuStyle}
        >
          {options.map((option) => {
            const selected = option.value === value

            return (
              <button
                aria-selected={selected}
                className={`flex w-full items-center rounded-lg px-sm py-sm text-left font-body-md text-body-md transition-colors ${
                  selected
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface hover:bg-surface-container-high'
                } disabled:cursor-not-allowed disabled:opacity-50`}
                disabled={option.disabled}
                key={option.value}
                onClick={() => selectValue(option.value)}
                role="option"
                type="button"
              >
                <span className="min-w-0 truncate">{option.label}</span>
              </button>
            )
          })}
        </div>
      )}
      {required && !value && <input className="sr-only" readOnly required tabIndex={-1} value="" />}
    </div>
  )
}

export default Select
