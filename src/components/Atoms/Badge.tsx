import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  className?: string
}

const Badge = ({ children, className = '' }: BadgeProps) => {
  return (
    <span className={`inline-flex items-center rounded-full bg-secondary-container/10 px-md py-xs font-label-md text-label-md text-secondary ${className}`}>
      {children}
    </span>
  )
}

export default Badge
