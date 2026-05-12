import React from 'react'

const Divider: React.FC<{ text?: string }> = ({ text = 'HOẶC TIẾP TỤC VỚI EMAIL' }) => {
  return (
    <div className="relative flex items-center py-sm">
      <div className="flex-grow border-t border-outline-variant"></div>
      <span className="flex-shrink mx-md font-label-sm text-label-sm text-outline">{text}</span>
      <div className="flex-grow border-t border-outline-variant"></div>
    </div>
  )
}

export default Divider
