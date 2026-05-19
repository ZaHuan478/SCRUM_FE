import { useLocation } from 'react-router-dom'
import AppointmentAnalyticsSection from '../Organisms/Dashboard/AppointmentAnalyticsSection'
import DepartmentManagementTable from '../Organisms/DepartmentDesign/DepartmentManagementTable'
import DashboardSideNav from '../Organisms/Dashboard/DashboardSideNav'
import DashboardStatsGrid from '../Organisms/Dashboard/DashboardStatsGrid'
import DashboardTopBar from '../Organisms/Dashboard/DashboardTopBar'
import DoctorManagementTable from '../Organisms/DoctorManage/DoctorManagementTable'
import PatientManagementTable from '../Organisms/PatientManage/PatientManagementTable'
import UserManagementTable from '../Organisms/UserManage/UserManagementTable'
import type { AnalyticsPoint } from '../Organisms/Dashboard/AppointmentAnalyticsSection'
import type { DashboardStat } from '../Molecules/Dashboard/DashboardStatCard'
import type { DoctorManagementRowData } from '../Molecules/Management/DoctorManagementRow'
import type { PatientManagementRowData } from '../Molecules/Management/PatientManagementRow'
import type { User } from '../../services/auth.service'
import type { Department } from '../../services/department.service'
import type { DashboardPagination } from '../../utils/adminDashboard'

type DashboardSection = 'overview' | 'departments' | 'doctors' | 'patients' | 'users'

const getDashboardSection = (pathname: string): DashboardSection => {
  if (pathname.endsWith('/departments')) return 'departments'
  if (pathname.endsWith('/doctors')) return 'doctors'
  if (pathname.endsWith('/patients')) return 'patients'
  if (pathname.endsWith('/users')) return 'users'

  return 'overview'
}

type DashboardTemplateProps = {
  analyticsData: AnalyticsPoint[]
  analyticsStatus: 'loading' | 'ready' | 'error'
  departments: Department[]
  departmentPagination: DashboardPagination
  departmentStatus: 'loading' | 'ready' | 'error'
  doctors: DoctorManagementRowData[]
  doctorPagination: DashboardPagination
  doctorStatus: 'loading' | 'ready' | 'error'
  patients: PatientManagementRowData[]
  patientPagination: DashboardPagination
  patientStatus: 'loading' | 'ready' | 'error'
  users: User[]
  userPagination: DashboardPagination
  userStatus: 'loading' | 'ready' | 'error'
  departmentSearchQuery: string
  doctorSearchQuery: string
  patientSearchQuery: string
  userSearchQuery: string
  stats: DashboardStat[]
  statsStatus: 'loading' | 'ready' | 'error'
  totalDepartments: number
  totalDoctors: number
  totalPatients: number
  totalUsers: number
  onCreateDepartment: () => void
  onEditDepartment: (department: Department) => void
  onLogout: () => void
  onDepartmentPageChange: (page: number) => void
  onDepartmentSearchQueryChange: (query: string) => void
  onDoctorPageChange: (page: number) => void
  onDoctorSearchQueryChange: (query: string) => void
  onPatientPageChange: (page: number) => void
  onPatientSearchQueryChange: (query: string) => void
  onUserPageChange: (page: number) => void
  onUserSearchQueryChange: (query: string) => void
  onEditDoctor: (doctor: DoctorManagementRowData) => void
  onCreateUser: () => void
  onDeleteUser: (user: User) => void
  onEditUser: (user: User) => void
  onViewDoctor: (doctor: DoctorManagementRowData) => void
  onViewPatient: (patient: PatientManagementRowData) => void
  onViewUser: (user: User) => void
}

const DashboardTemplate = ({
  analyticsData,
  analyticsStatus,
  departments,
  departmentPagination,
  departmentStatus,
  doctors,
  doctorPagination,
  doctorStatus,
  patients,
  patientPagination,
  patientStatus,
  users,
  userPagination,
  userStatus,
  departmentSearchQuery,
  doctorSearchQuery,
  patientSearchQuery,
  userSearchQuery,
  stats,
  statsStatus,
  totalDepartments,
  totalDoctors,
  totalPatients,
  totalUsers,
  onCreateDepartment,
  onEditDepartment,
  onLogout,
  onDepartmentPageChange,
  onDepartmentSearchQueryChange,
  onDoctorPageChange,
  onDoctorSearchQueryChange,
  onPatientPageChange,
  onPatientSearchQueryChange,
  onUserPageChange,
  onUserSearchQueryChange,
  onEditDoctor,
  onCreateUser,
  onDeleteUser,
  onEditUser,
  onViewDoctor,
  onViewPatient,
  onViewUser,
}: DashboardTemplateProps) => {
  const location = useLocation()
  const activeSection = getDashboardSection(location.pathname)

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      <DashboardSideNav onLogout={onLogout} />
      <div className="flex min-w-0 flex-grow flex-col">
        <DashboardTopBar onLogout={onLogout} />
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col gap-xxl px-lg py-lg md:px-xxl md:py-xxl">
          {activeSection === 'overview' && (
            <>
              <DashboardStatsGrid stats={stats} status={statsStatus} />
              <AppointmentAnalyticsSection
                data={analyticsData}
                description="Nhịp đặt lịch và thăm khám trong 7 ngày gần nhất."
                status={analyticsStatus}
                title="Phân tích lịch hẹn"
              />
            </>
          )}
          {activeSection === 'departments' && (
            <DepartmentManagementTable
              departments={departments}
              onPageChange={onDepartmentPageChange}
              onCreateDepartment={onCreateDepartment}
              onEditDepartment={onEditDepartment}
              onSearchQueryChange={onDepartmentSearchQueryChange}
              pagination={departmentPagination}
              searchQuery={departmentSearchQuery}
              status={departmentStatus}
              totalDepartments={totalDepartments}
            />
          )}
          {activeSection === 'doctors' && (
            <DoctorManagementTable
              doctors={doctors}
              onEditDoctor={onEditDoctor}
              onPageChange={onDoctorPageChange}
              onSearchQueryChange={onDoctorSearchQueryChange}
              onViewDoctor={onViewDoctor}
              pagination={doctorPagination}
              searchQuery={doctorSearchQuery}
              status={doctorStatus}
              totalDoctors={totalDoctors}
            />
          )}
          {activeSection === 'patients' && (
            <PatientManagementTable
              onPageChange={onPatientPageChange}
              onSearchQueryChange={onPatientSearchQueryChange}
              onViewPatient={onViewPatient}
              pagination={patientPagination}
              patients={patients}
              searchQuery={patientSearchQuery}
              status={patientStatus}
              totalPatients={totalPatients}
            />
          )}
          {activeSection === 'users' && (
            <UserManagementTable
              onCreateUser={onCreateUser}
              onDeleteUser={onDeleteUser}
              onEditUser={onEditUser}
              onPageChange={onUserPageChange}
              onSearchQueryChange={onUserSearchQueryChange}
              onViewUser={onViewUser}
              pagination={userPagination}
              searchQuery={userSearchQuery}
              status={userStatus}
              totalUsers={totalUsers}
              users={users}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default DashboardTemplate
