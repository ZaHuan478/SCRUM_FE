import { useEffect, useRef, useState } from 'react'
import Icon from '../../Atoms/Icon'

export type ActionMenuItem = {
  icon: string
  label: string
  tone?: 'default' | 'danger'
  onClick: () => void
}

type ActionMenuProps = {
  ariaLabel: string
  items: ActionMenuItem[]
}

const ActionMenu = ({ ariaLabel, items }: ActionMenuProps) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className="relative inline-flex justify-end" ref={wrapperRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={ariaLabel}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/45 bg-white/75 text-on-surface shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary-fixed/35 focus:outline-none focus:ring-2 focus:ring-primary/40"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <Icon className="text-xl" name="more_vert" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+0.35rem)] z-[80] min-w-44 overflow-hidden rounded-2xl border border-white/60 bg-white/90 p-xs text-left shadow-[0_22px_55px_rgba(15,23,42,0.16)] backdrop-blur-2xl"
          role="menu"
        >
          {items.map((item) => {
            const danger = item.tone === 'danger'

            return (
              <button
                className={`flex w-full items-center gap-sm rounded-lg px-md py-sm font-label-md text-label-md transition-colors ${
                  danger
                    ? 'text-error hover:bg-error-container'
                    : 'text-on-surface hover:bg-primary-fixed/35'
                }`}
                key={item.label}
                onClick={() => {
                  setOpen(false)
                  item.onClick()
                }}
                role="menuitem"
                type="button"
              >
                <Icon className="text-lg" name={item.icon} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ActionMenu
