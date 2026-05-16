import Logo from '../Atoms/Logo'
import { adminDashboardCopy, adminFooterGroups } from '../../data/adminDashboard'

const AdminFooter = () => {
  return (
    <footer className="mt-auto bg-surface-container-highest">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-xl px-lg py-xxl md:flex-row md:px-xxl">
        <div className="flex max-w-xs flex-col gap-md">
          <Logo />
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {adminDashboardCopy.footerDescription}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-xl">
          {adminFooterGroups.map((group) => (
            <div className="flex flex-col gap-sm" key={group.title}>
              <h4 className="font-label-md text-label-md text-on-surface">{group.title}</h4>
              {group.links.map((link) => (
                <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary" href="#footer" key={link}>
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-outline-variant/20 px-lg py-lg md:px-xxl">
        <p className="font-body-sm text-body-sm text-on-surface-variant">{adminDashboardCopy.copyright}</p>
      </div>
    </footer>
  )
}

export default AdminFooter
