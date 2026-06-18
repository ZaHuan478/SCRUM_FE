import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import Icon from '../../Atoms/Icon'

export type SelectOption = {
  label: ReactNode
  value: string
  disabled?: boolean
}

const normalizeSearchText = (value: string) => (
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
)

type SelectProps = {
  className?: string
  disabled?: boolean
  id?: string
  label?: string
  menuClassName?: string
  name?: string
  options: SelectOption[]
  required?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  emptySearchMessage?: string
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
  searchable = false,
  searchPlaceholder = 'Search...',
  emptySearchMessage = 'No matching options',
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
  const [searchTerm, setSearchTerm] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return options

    const normalizedSearchTerm = normalizeSearchText(searchTerm.trim())

    return options.filter((option) => (
      normalizeSearchText(String(option.label)).includes(normalizedSearchTerm)
    ))
  }, [options, searchable, searchTerm])

  useEffect(() => {
    if (!open) {
      setSearchTerm('')
      return undefined
    }

    if (searchable) {
      window.setTimeout(() => searchInputRef.current?.focus(), 0)
    }

    return undefined
  }, [open, searchable])

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
    setSearchTerm('')
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
    <div className={`relative space-y-xs ${open ? 'z-[600]' : 'z-0'} ${wrapperClassName}`} ref={rootRef}>
      {label && (
        <label className="font-label-md text-label-md text-on-surface" htmlFor={selectId}>
          {label}
        </label>
      )}
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex w-full items-center justify-between gap-sm rounded-xl border border-outline-variant/70 bg-surface/85 px-md py-md font-body-md text-body-md text-on-surface shadow-sm backdrop-blur outline-none transition-all hover:border-primary/40 hover:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-surface-container-low disabled:text-on-surface-variant ${className}`}
        disabled={disabled}
        id={selectId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        title={title}
        type="button"
      >
        <span className="min-w-0 truncate text-left">{selectedOption?.label}</span>
        <Icon className={`shrink-0 text-xl text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`} name="keyboard_arrow_down" />
      </button>
      {name && <input name={name} type="hidden" value={value} />}
      {open && (
        <div
          className={`absolute left-0 top-[calc(100%+0.35rem)] z-[700] w-full rounded-xl border border-white/60 bg-surface/95 p-xs shadow-[0_22px_55px_rgba(15,23,42,0.16)] backdrop-blur-2xl ${menuClassName}`}
          id={menuId}
        >
          {searchable && (
            <div className="sticky top-0 z-10 bg-surface/90 p-xs backdrop-blur">
              <div className="relative">
                <Icon className="absolute left-sm top-1/2 -translate-y-1/2 text-lg text-outline" name="search" />
                <input
                  className="h-10 w-full rounded-lg border border-outline-variant/70 bg-surface/90 py-xs pl-xl pr-sm font-body-sm text-body-sm text-on-surface outline-none placeholder:text-outline focus:border-primary focus:ring-4 focus:ring-primary/10"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={searchPlaceholder}
                  ref={searchInputRef}
                  type="search"
                  value={searchTerm}
                />
              </div>
            </div>
          )}
          <div className="max-h-64 overflow-y-auto" role="listbox">
            {filteredOptions.length === 0 && (
              <p className="px-sm py-md text-center font-body-sm text-body-sm text-on-surface-variant">
                {emptySearchMessage}
              </p>
            )}
            {filteredOptions.map((option) => {
              const selected = option.value === value

              return (
                <button
                  aria-selected={selected}
                  className={`flex w-full items-center rounded-lg px-sm py-sm text-left font-body-md text-body-md transition-colors ${
                    selected
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface hover:bg-primary-fixed/35'
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
        </div>
      )}
      {required && !value && <input className="sr-only" readOnly required tabIndex={-1} value="" />}
    </div>
  )
}

export default Select
