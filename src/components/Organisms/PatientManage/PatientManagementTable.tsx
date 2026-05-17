import Icon from '../../Atoms/Icon'
import PatientManagementRow from '../../Molecules/PatientManagementRow'
import type { PatientManagementRowData } from '../../Molecules/PatientManagementRow'

type PatientManagementTableProps = {
  patients: PatientManagementRowData[]
  status: 'loading' | 'ready' | 'error'
  totalPatients: number
  onViewPatient: (patient: PatientManagementRowData) => void
}

const PatientManagementTable = ({
  patients,
  status,
  totalPatients,
  onViewPatient,
}: PatientManagementTableProps) => {
  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(15,23,42,0.05)]" id="patient-management">
      <div className="flex items-center justify-between gap-lg border-b border-outline-variant/20 p-lg md:p-xl">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Quản lý bệnh nhân</h2>
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Danh sách hồ sơ bệnh nhân từ hệ thống.</p>
        </div>
        <Icon name="personal_injury" className="text-primary" />
      </div>

      {status === 'loading' && <div className="p-xl font-body-sm text-body-sm text-on-surface-variant">Đang tải danh sách bệnh nhân...</div>}
      {status === 'error' && (
        <div className="m-lg rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
          Chưa tải được danh sách bệnh nhân.
        </div>
      )}
      {status === 'ready' && patients.length === 0 && (
        <div className="p-xl text-center font-body-md text-body-md text-on-surface-variant">Chưa có hồ sơ bệnh nhân.</div>
      )}
      {patients.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant/20 bg-surface-container-low">
              <tr>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Bệnh nhân</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Số điện thoại</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Giới tính</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Bảo hiểm</th>
                <th className="px-xl py-md text-right font-label-md text-label-md text-on-surface-variant">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {patients.map((patient) => (
                <PatientManagementRow key={patient.id} onView={onViewPatient} patient={patient} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="border-t border-outline-variant/20 bg-surface-container-low p-lg">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Đang hiển thị {patients.length} trên {totalPatients} bệnh nhân
        </p>
      </div>
    </section>
  )
}

export default PatientManagementTable
