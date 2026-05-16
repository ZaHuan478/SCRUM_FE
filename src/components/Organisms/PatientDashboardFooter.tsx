import { patientDashboardCopy, patientFooterLinks } from '../../data/patientDashboard'

const PatientDashboardFooter = () => {
  return (
    <footer className="mt-xxxl flex w-full flex-col items-start justify-between gap-xl border-t border-outline-variant pt-xxl md:flex-row">
      <div className="flex flex-col gap-sm">
        <span className="font-headline-sm text-headline-sm font-bold text-primary">
          {patientDashboardCopy.footerBrand}
        </span>
        <p className="max-w-xs font-body-sm text-body-sm text-on-surface-variant">
          {patientDashboardCopy.footerDescription}
        </p>
      </div>
      <div className="flex flex-wrap gap-xl">
        {patientFooterLinks.map((group) => (
          <div className="flex flex-col gap-xs" key={group.title}>
            <p className="font-label-md text-label-md text-on-surface">{group.title}</p>
            {group.links.map((link) => (
              <a
                className="font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-primary"
                href="#footer"
                key={link}
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>
    </footer>
  )
}

export default PatientDashboardFooter
