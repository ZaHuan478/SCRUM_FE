import React from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'

type SocialProvider = {
  label: string
  icon: string
}

const providers: SocialProvider[] = []

export const SocialLogin: React.FC = () => {
  if (providers.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-md">
      {providers.map((provider) => (
        <Button
          className="col-span-2 flex items-center justify-center gap-sm py-sm px-md border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors"
          key={provider.label}
          variant="ghost"
        >
          <Icon name={provider.icon} />
          <span>{provider.label}</span>
        </Button>
      ))}
    </div>
  )
}

export default SocialLogin
