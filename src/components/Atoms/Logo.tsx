import React from 'react'
import Icon from './Icon'

const Logo: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div className={`inline-flex items-center gap-sm ${compact ? 'mb-xl' : ''}`}>
      <Icon name="medical_services" className="text-primary text-headline-lg" />
      {!compact && <h1 className="font-headline-md text-headline-md font-bold text-primary">MedPrecision</h1>}
      {compact && <span className="font-headline-sm text-headline-sm font-bold text-primary">MedPrecision</span>}
    </div>
  )
}

export default Logo
