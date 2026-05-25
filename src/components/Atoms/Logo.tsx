import React from 'react'
import Icon from './Icon'

const Logo: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div className={`inline-flex items-center gap-sm ${compact ? 'mb-xl' : ''}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded bg-primary text-on-primary">
        <Icon name="medical_services" className="text-xl" />
      </span>
      {!compact && <h1 className="font-headline-md text-headline-md font-medium text-on-background">MedPrecision</h1>}
      {compact && <span className="font-headline-sm text-headline-sm font-medium text-on-background">MedPrecision</span>}
    </div>
  )
}

export default Logo
