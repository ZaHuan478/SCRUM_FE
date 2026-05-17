import React from 'react'
import Button from '../Atoms/Button'

export const SocialLogin: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-md">
      <Button variant="ghost" className="col-span-2 flex items-center justify-center gap-sm py-sm px-md border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors">
        <img alt="Google Logo" className="w-5 h-5" src="https://www.svgrepo.com/show/355037/google.svg" />
        <span>Google</span>
      </Button>
    </div>
  )
}

export default SocialLogin
