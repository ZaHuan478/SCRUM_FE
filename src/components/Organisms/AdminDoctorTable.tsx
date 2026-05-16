import AdminDoctorTableRow from '../Molecules/AdminDoctorTableRow'
import Card from '../Atoms/Card'
import Icon from '../Atoms/Icon'
import { adminDashboardCopy, adminDoctorRows } from '../../data/adminDashboard'

const tableHeaders = ['Bác sĩ', 'Chuyên khoa', 'Trạng thái', 'Lịch hẹn', 'Hành động']

const AdminDoctorTable = () => {
  return (
    <Card as="section" className="overflow-hidden" id="doctors">
      <div className="flex flex-col items-start justify-between gap-lg border-b border-outline-variant/20 p-lg md:flex-row md:items-center md:p-xl">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">{adminDashboardCopy.doctorsTitle}</h2>
        <div className="flex w-full items-center gap-md md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input
              className="w-full rounded-lg border border-outline-variant py-sm pl-xl pr-md font-body-sm text-body-sm focus:border-primary focus:ring-2 focus:ring-primary md:w-64"
              placeholder={adminDashboardCopy.doctorSearchPlaceholder}
              type="text"
            />
            <Icon name="search" className="absolute left-md top-1/2 -translate-y-1/2 text-sm text-outline" />
          </div>
          <button
            aria-label="Lọc danh sách bác sĩ"
            className="rounded-lg bg-surface-container-high p-sm transition-colors hover:bg-surface-variant"
            type="button"
          >
            <Icon name="filter_list" className="text-on-surface-variant" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-outline-variant/20 bg-surface-container-low">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  className={`px-xl py-md font-label-md text-label-md uppercase text-on-surface-variant ${
                    header === 'Hành động' ? 'text-right' : ''
                  }`}
                  key={header}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {adminDoctorRows.map((doctor) => (
              <AdminDoctorTableRow doctor={doctor} key={doctor.id} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-md border-t border-outline-variant/20 bg-surface-container-low p-lg">
        <p className="font-body-sm text-body-sm text-on-surface-variant">{adminDashboardCopy.showingDoctors}</p>
        <div className="flex gap-sm">
          <button
            className="rounded-lg border border-outline-variant px-md py-sm font-label-md text-label-md opacity-50"
            disabled
            type="button"
          >
            {adminDashboardCopy.previous}
          </button>
          <button
            className="rounded-lg border border-outline-variant px-md py-sm font-label-md text-label-md hover:bg-surface-container-high"
            type="button"
          >
            {adminDashboardCopy.next}
          </button>
        </div>
      </div>
    </Card>
  )
}

export default AdminDoctorTable
