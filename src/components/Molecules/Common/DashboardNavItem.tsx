import { NavLink } from 'react-router-dom'
import Icon from '../../Atoms/Icon'

type DashboardNavItemProps = {
  icon: string
  label: string
  active?: boolean
  end?: boolean
  onClick?: () => void
  to?: string
}

const getClassName = (active: boolean) => (
  active
    ? 'flex items-center gap-md rounded bg-primary px-md py-sm text-on-primary'
    : 'flex items-center gap-md rounded px-md py-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface'
)

const DashboardNavItem = ({ icon, label, active = false, end, onClick, to }: DashboardNavItemProps) => {
  if (onClick) {
    return (
      <button className={`${getClassName(active)} w-full text-left`} onClick={onClick} type="button">
        <Icon name={icon} />
        <span className="font-label-md text-label-md">{label}</span>
      </button>
    )
  }

  if (to) {
    return (
      <NavLink className={({ isActive }) => getClassName(isActive)} end={end} to={to}>
        <Icon name={icon} />
        <span className="font-label-md text-label-md">{label}</span>
      </NavLink>
    )
  }

  return (
    <span className={getClassName(active)}>
      <Icon name={icon} />
      <span className="font-label-md text-label-md">{label}</span>
    </span>
  )
}

export default DashboardNavItem
