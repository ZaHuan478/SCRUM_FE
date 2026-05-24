import { Link } from 'react-router-dom'
import Icon from '../../Atoms/Icon'
import type { CSSProperties } from 'react'

type DepartmentCardProps = {
  icon: string
  label: string
  tone: 'primary' | 'secondary' | 'tertiary' | 'neutral'
  className?: string
  description?: string | null
  style?: CSSProperties
  to?: string
}

const toneClasses: Record<DepartmentCardProps['tone'], string> = {
  primary: 'bg-[#c9e0fc] text-[#024ad8]',
  secondary: 'bg-[#f7f7f7] text-[#1a1a1a]',
  tertiary: 'bg-[#e8e8e8] text-[#1a1a1a]',
  neutral: 'bg-white text-[#636363] ring-1 ring-[#e8e8e8]',
}

const DepartmentCard = ({ className = '', description, icon, label, style, tone, to }: DepartmentCardProps) => {
  const cardDescription = description || 'Khoa đang tiếp nhận lịch khám trong hệ thống.'
  const cardClasses = `group flex h-full flex-col rounded-[16px] bg-white p-xl text-left shadow-[0_2px_8px_rgba(26,26,26,0.08)] ring-1 ring-[#e8e8e8] transition-transform duration-300 hover:-translate-y-1 ${className}`
  const content = (
    <>
      <div className={`mb-md flex h-14 w-14 items-center justify-center rounded-[8px] transition-transform duration-300 group-hover:scale-105 ${toneClasses[tone]}`}>
        <Icon className="text-3xl" name={icon} />
      </div>
      <h3 className="font-headline-sm text-[20px] font-medium leading-none tracking-normal text-[#1a1a1a]">{label}</h3>
      <p className="mt-sm min-h-20 font-body-sm text-body-sm text-[#3d3d3d]">
        {cardDescription}
      </p>
      <span className="mt-auto inline-flex items-center gap-xs pt-md font-label-md text-label-md text-[#024ad8] transition-all duration-300 group-hover:gap-sm group-hover:underline">
        Xem chi tiết <Icon className="text-lg" name="arrow_forward" />
      </span>
    </>
  )

  if (to) {
    return (
      <Link className={cardClasses} style={style} to={to}>
        {content}
      </Link>
    )
  }

  return <article className={cardClasses} style={style}>{content}</article>
}

export default DepartmentCard
