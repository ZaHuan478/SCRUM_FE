import AdminNavItem from '../Molecules/AdminNavItem'
import Icon from '../Atoms/Icon'
import { adminDashboardCopy, adminNavItems } from '../../data/adminDashboard'

const AdminSidebar = () => {
  return (
    <aside className="hidden h-screen w-64 flex-col gap-lg bg-surface-container-low px-md py-xl shadow-md md:sticky md:top-0 md:flex">
      <div className="px-md">
        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          {adminDashboardCopy.portalTitle}
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {adminDashboardCopy.portalSubtitle}
        </p>
      </div>
      <nav className="mt-xl flex flex-grow flex-col gap-sm">
        {adminNavItems.map((item) => (
          <AdminNavItem item={item} key={item.id} />
        ))}
      </nav>
      <div className="flex flex-col gap-md px-md">
        <button
          className="w-full rounded-lg bg-error py-sm font-label-md text-label-md text-on-error transition-opacity hover:opacity-90"
          type="button"
        >
          {adminDashboardCopy.emergencySupport}
        </button>
        <div className="flex flex-col gap-xs border-t border-outline-variant pt-md">
          <a
            className="flex items-center gap-md rounded-lg px-md py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
            href="#help"
          >
            <Icon name="help" />
            <span>{adminDashboardCopy.helpCenter}</span>
          </a>
          <a
            className="flex items-center gap-md rounded-lg px-md py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
            href="#logout"
          >
            <Icon name="logout" />
            <span>{adminDashboardCopy.logout}</span>
          </a>
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar
