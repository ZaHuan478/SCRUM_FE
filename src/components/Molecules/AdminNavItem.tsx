import Icon from '../Atoms/Icon'
import type { AdminNavItem as AdminNavItemType } from '../../data/adminDashboard'

type AdminNavItemProps = {
  item: AdminNavItemType
}

const AdminNavItem = ({ item }: AdminNavItemProps) => {
  const activeClasses = item.active
    ? 'translate-x-1 bg-primary-container text-on-primary-container'
    : 'text-on-surface-variant hover:bg-surface-container-high'

  return (
    <a
      className={`flex items-center gap-md rounded-lg px-md py-sm font-label-md text-label-md transition-all ${activeClasses}`}
      href={`#${item.id}`}
    >
      <Icon name={item.icon} />
      <span>{item.label}</span>
    </a>
  )
}

export default AdminNavItem
