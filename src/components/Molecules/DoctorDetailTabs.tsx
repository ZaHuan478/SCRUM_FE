type DoctorDetailTabsProps = {
  tabs: string[]
  activeTab: string
  onSelect: (tab: string) => void
}

const DoctorDetailTabs = ({ tabs, activeTab, onSelect }: DoctorDetailTabsProps) => {
  return (
    <div className="flex gap-xl overflow-x-auto border-b border-outline-variant/50 pb-xs">
      {tabs.map((tab) => {
        const active = tab === activeTab

        return (
          <button
            className={`whitespace-nowrap border-b-2 px-sm pb-md font-label-md text-label-md transition-all ${
              active
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
            key={tab}
            onClick={() => onSelect(tab)}
            type="button"
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}

export default DoctorDetailTabs
