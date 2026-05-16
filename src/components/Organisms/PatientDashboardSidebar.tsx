import Icon from '../Atoms/Icon'
import PatientNavItem from '../Molecules/PatientNavItem'
import {
  patientDashboardCopy,
  patientDashboardNavItems,
} from '../../data/patientDashboard'

const PatientDashboardSidebar = () => {
  return (
    <aside className="flex flex-col gap-lg bg-surface-container-low px-md py-xl lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64">
      <div className="flex flex-col gap-xs px-md">
        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          {patientDashboardCopy.portalTitle}
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {patientDashboardCopy.portalSubtitle}
        </p>
      </div>
      <nav className="flex flex-col gap-sm lg:flex-1">
        {patientDashboardNavItems.map((item) => (
          <PatientNavItem item={item} key={item.id} />
        ))}
      </nav>
      <div className="flex flex-col gap-sm border-t border-outline-variant pt-lg">
        <button
          className="flex items-center justify-center gap-sm rounded-lg bg-tertiary py-sm font-label-md text-label-md text-on-tertiary transition-opacity hover:opacity-90"
          type="button"
        >
          <Icon name="emergency" />
          {patientDashboardCopy.emergencySupport}
        </button>
        <a
          className="flex items-center gap-md rounded-lg px-md py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
          href="#help"
        >
          <Icon name="help" />
          <span>{patientDashboardCopy.helpCenter}</span>
        </a>
        <a
          className="flex items-center gap-md rounded-lg px-md py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
          href="#logout"
        >
          <Icon name="logout" />
          <span>{patientDashboardCopy.logout}</span>
        </a>
      </div>
    </aside>
  )
}

export default PatientDashboardSidebar
