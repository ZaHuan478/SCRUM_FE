import type { HTMLAttributes, ReactNode } from 'react'

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  as?: 'article' | 'aside' | 'section' | 'div'
}

const Card = ({ as: Component = 'article', children, className = '', ...rest }: CardProps) => {
  return (
    <Component
      className={`rounded-xl border border-outline-variant/40 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(15,23,42,0.05)] ${className}`}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default Card
