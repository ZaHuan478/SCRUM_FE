import { useLocation } from 'react-router-dom'
import AppointmentManagementTable from '../Organisms/AppointmentManage/AppointmentManagementTable'
import AppointmentAnalyticsSection from '../Organisms/Dashboard/AppointmentAnalyticsSection'
import DepartmentManagementTable from '../Organisms/DepartmentDesign/DepartmentManagementTable'
import DashboardSideNav from '../Organisms/Dashboard/DashboardSideNav'
import DashboardStatsGrid from '../Organisms/Dashboard/DashboardStatsGrid'
import DashboardTopBar from '../Organisms/Dashboard/DashboardTopBar'
import DoctorManagementTable from '../Organisms/DoctorManage/DoctorManagementTable'
import HospitalDocumentManager from '../Organisms/HospitalDocuments/HospitalDocumentManager'
import PatientManagementTable from '../Organisms/PatientManage/PatientManagementTable'
import SymptomRuleManagementTable from '../Organisms/SymptomRules/SymptomRuleManagementTable'
import UserManagementTable from '../Organisms/UserManage/UserManagementTable'
import type { AnalyticsPoint } from '../Organisms/Dashboard/AppointmentAnalyticsSection'
import type { DashboardStat } from '../Molecules/Dashboard/DashboardStatCard'
import type { DoctorManagementRowData } from '../Molecules/Management/DoctorManagementRow'
import type { PatientManagementRowData } from '../Molecules/Management/PatientManagementRow'
import type { User } from '../../services/auth.service'
import type { Appointment, AppointmentStatus } from '../../services/appointment.service'
import type { Department } from '../../services/department.service'
import type { DepartmentSymptomRule } from '../../services/departmentSymptomRule.service'
import type { DashboardPagination } from '../../utils/adminDashboard'

type DashboardSection = 'overview' | 'departments' | 'doctors' | 'appointments' | 'patients' | 'symptom-rules' | 'users' | 'hospital-documents'

const getDashboardSection = (pathname: string): DashboardSection => {
  if (pathname.endsWith('/departments')) return 'departments'
  if (pathname.endsWith('/doctors')) return 'doctors'
  if (pathname.endsWith('/appointments')) return 'appointments'
  if (pathname.endsWith('/patients')) return 'patients'
  if (pathname.endsWith('/symptom-rules')) return 'symptom-rules'
  if (pathname.endsWith('/users')) return 'users'
  if (pathname.endsWith('/hospital-documents')) return 'hospital-documents'

  return 'overview'
}

type DashboardTemplateProps = {
  analyticsData: AnalyticsPoint[]
  analyticsStatus: 'loading' | 'ready' | 'error'
  departments: Department[]
  departmentPagination: DashboardPagination
  departmentStatus: 'loading' | 'ready' | 'error'
  symptomRules: DepartmentSymptomRule[]
  symptomRulePagination: DashboardPagination
  symptomRuleStatus: 'loading' | 'ready' | 'error'
  doctors: DoctorManagementRowData[]
  doctorPagination: DashboardPagination
  doctorStatus: 'loading' | 'ready' | 'error'
  patients: PatientManagementRowData[]
  patientPagination: DashboardPagination
  patientStatus: 'loading' | 'ready' | 'error'
  appointments: Appointment[]
  appointmentPagination: DashboardPagination
  appointmentStatus: 'loading' | 'ready' | 'error'
  appointmentStatusFilter: AppointmentStatus | 'all'
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
  totalSymptomRules: number
  totalDoctors: number
  totalPatients: number
  totalAppointments: number
  totalUsers: number
  onCreateDoctor: () => void
  onCreateDepartment: () => void
  onCreateSymptomRule: () => void
  onDeleteSymptomRule: (rule: DepartmentSymptomRule) => void
  onEditDepartment: (department: Department) => void
  onLogout: () => void
  onDepartmentPageChange: (page: number) => void
  onDepartmentSearchQueryChange: (query: string) => void
  onDoctorPageChange: (page: number) => void
  onDoctorSearchQueryChange: (query: string) => void
  onPatientPageChange: (page: number) => void
  onPatientSearchQueryChange: (query: string) => void
  onAppointmentPageChange: (page: number) => void
  onAppointmentStatusFilterChange: (status: AppointmentStatus | 'all') => void
  onSymptomRulePageChange: (page: number) => void
  onUserPageChange: (page: number) => void
  onUserSearchQueryChange: (query: string) => void
  onEditDoctor: (doctor: DoctorManagementRowData) => void
  onEditSymptomRule: (rule: DepartmentSymptomRule) => void
  onCreateUser: () => void
  onDeleteUser: (user: User) => void
  onEditUser: (user: User) => void
  onCancelAppointment: (appointment: Appointment) => void
  onCompleteAppointment: (appointment: Appointment) => void
  onConfirmAppointment: (appointment: Appointment) => void
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
  symptomRules,
  symptomRulePagination,
  symptomRuleStatus,
  doctors,
  doctorPagination,
  doctorStatus,
  patients,
  patientPagination,
  patientStatus,
  appointments,
  appointmentPagination,
  appointmentStatus,
  appointmentStatusFilter,
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
  totalSymptomRules,
  totalDoctors,
  totalPatients,
  totalAppointments,
  totalUsers,
  onCreateDoctor,
  onCreateDepartment,
  onCreateSymptomRule,
  onDeleteSymptomRule,
  onEditDepartment,
  onLogout,
  onDepartmentPageChange,
  onDepartmentSearchQueryChange,
  onDoctorPageChange,
  onDoctorSearchQueryChange,
  onPatientPageChange,
  onPatientSearchQueryChange,
  onAppointmentPageChange,
  onAppointmentStatusFilterChange,
  onSymptomRulePageChange,
  onUserPageChange,
  onUserSearchQueryChange,
  onEditDoctor,
  onEditSymptomRule,
  onCreateUser,
  onDeleteUser,
  onEditUser,
  onCancelAppointment,
  onCompleteAppointment,
  onConfirmAppointment,
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
        <main className="mx-auto flex w-full max-w-[1366px] flex-grow flex-col gap-xxl px-lg py-lg md:px-xxl md:py-xxl">
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
              onCreateDoctor={onCreateDoctor}
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
          {activeSection === 'symptom-rules' && (
            <SymptomRuleManagementTable
              onCreateRule={onCreateSymptomRule}
              onDeleteRule={onDeleteSymptomRule}
              onEditRule={onEditSymptomRule}
              onPageChange={onSymptomRulePageChange}
              pagination={symptomRulePagination}
              rules={symptomRules}
              status={symptomRuleStatus}
              totalRules={totalSymptomRules}
            />
          )}
          {activeSection === 'appointments' && (
            <AppointmentManagementTable
              appointments={appointments}
              onCancelAppointment={onCancelAppointment}
              onCompleteAppointment={onCompleteAppointment}
              onConfirmAppointment={onConfirmAppointment}
              onPageChange={onAppointmentPageChange}
              onStatusFilterChange={onAppointmentStatusFilterChange}
              pagination={appointmentPagination}
              status={appointmentStatus}
              statusFilter={appointmentStatusFilter}
              totalAppointments={totalAppointments}
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
          {activeSection === 'hospital-documents' && <HospitalDocumentManager />}
        </main>
      </div>
    </div>
  )
}

export default DashboardTemplate
