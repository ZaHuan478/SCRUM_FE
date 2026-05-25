import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  className?: string
}

const Badge = ({ children, className = '' }: BadgeProps) => {
  return (
    <span className={`inline-flex items-center rounded-lg border border-on-surface bg-surface px-md py-xs font-label-md text-label-md text-on-surface ${className}`}>
      {children}
    </span>
  )
}

export default Badge
