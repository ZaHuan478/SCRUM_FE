import Icon from '../Atoms/Icon'
import type { MedicalRecord } from '../../data/patientDashboard'

type MedicalRecordItemProps = {
  record: MedicalRecord
}

const MedicalRecordItem = ({ record }: MedicalRecordItemProps) => {
  return (
    <article className="group flex flex-col gap-md rounded-lg border border-transparent p-md transition-colors hover:border-outline-variant/30 hover:bg-surface-container-low sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-md">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
          <Icon name={record.icon} />
        </div>
        <div>
          <h4 className="font-label-md text-label-md text-on-surface">{record.title}</h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{record.meta}</p>
        </div>
      </div>
      <div className="flex items-center gap-md self-start sm:self-center">
        <span className={`rounded px-sm py-xs text-[11px] font-bold uppercase ${record.statusClassName}`}>
          {record.status}
        </span>
        <button
          aria-label={`Tải xuống ${record.title}`}
          className="rounded-full p-xs text-on-surface-variant opacity-100 transition-opacity hover:bg-surface-container-high sm:opacity-0 sm:group-hover:opacity-100"
          type="button"
        >
          <Icon name="download" />
        </button>
      </div>
    </article>
  )
}

export default MedicalRecordItem
