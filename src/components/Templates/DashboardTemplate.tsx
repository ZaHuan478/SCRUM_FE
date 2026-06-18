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
import SystemLogsPanel from '../Organisms/SystemLogs/SystemLogsPanel'
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

type DashboardSection = 'overview' | 'departments' | 'doctors' | 'appointments' | 'patients' | 'symptom-rules' | 'users' | 'admins' | 'hospital-documents' | 'system-logs' | 'system-settings'

const getDashboardSection = (pathname: string): DashboardSection => {
  if (pathname.endsWith('/departments')) return 'departments'
  if (pathname.endsWith('/doctors')) return 'doctors'
  if (pathname.endsWith('/appointments')) return 'appointments'
  if (pathname.endsWith('/patients')) return 'patients'
  if (pathname.endsWith('/symptom-rules')) return 'symptom-rules'
  if (pathname.endsWith('/users')) return 'users'
  if (pathname.endsWith('/admins')) return 'admins'
  if (pathname.endsWith('/hospital-documents')) return 'hospital-documents'
  if (pathname.endsWith('/system-logs')) return 'system-logs'
  if (pathname.endsWith('/system-settings')) return 'system-settings'

  return 'overview'
}

type DashboardTemplateProps = {
  analyticsData: AnalyticsPoint[]
  analyticsStatus: 'loading' | 'ready' | 'error'
  currentUserRole: 'ADMIN' | 'SUPER_ADMIN'
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
  onDeleteDepartment: (department: Department) => void
  onDeleteDoctor: (doctor: DoctorManagementRowData) => void
  onDeletePatient: (patient: PatientManagementRowData) => void
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
  onEditPatient: (patient: PatientManagementRowData) => void
  onScheduleDoctor: (doctor: DoctorManagementRowData) => void
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
  currentUserRole,
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
  onDeleteDepartment,
  onDeleteDoctor,
  onDeletePatient,
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
  onEditPatient,
  onScheduleDoctor,
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
    <div className="scrum-dashboard-shell flex min-h-screen text-on-background">
      <DashboardSideNav currentUserRole={currentUserRole} onLogout={onLogout} />
      <div className="flex min-w-0 flex-grow flex-col">
        <DashboardTopBar currentUserRole={currentUserRole} onLogout={onLogout} />
        <main className="mx-auto flex w-full max-w-[1366px] flex-grow flex-col gap-xl px-lg py-lg md:px-xxl md:py-xxl">
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
              onDeleteDepartment={onDeleteDepartment}
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
              onDeleteDoctor={onDeleteDoctor}
              onCreateDoctor={onCreateDoctor}
              onEditDoctor={onEditDoctor}
              onPageChange={onDoctorPageChange}
              onScheduleDoctor={onScheduleDoctor}
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
              onDeletePatient={onDeletePatient}
              onEditPatient={onEditPatient}
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
              canManageSystemUsers={currentUserRole === 'SUPER_ADMIN'}
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
          {activeSection === 'admins' && (
            <UserManagementTable
              canManageSystemUsers={currentUserRole === 'SUPER_ADMIN'}
              onCreateUser={onCreateUser}
              onDeleteUser={onDeleteUser}
              onEditUser={onEditUser}
              onPageChange={onUserPageChange}
              onSearchQueryChange={onUserSearchQueryChange}
              onViewUser={onViewUser}
              pagination={userPagination}
              searchQuery={userSearchQuery}
              status={userStatus}
              totalUsers={users.filter((user) => user.role === 'ADMIN').length}
              users={users.filter((user) => user.role === 'ADMIN')}
            />
          )}
          {activeSection === 'hospital-documents' && <HospitalDocumentManager />}
          {activeSection === 'system-logs' && <SystemLogsPanel />}
          {activeSection === 'system-settings' && (
            <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">System Settings</h2>
              <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">System configuration can be connected here when backend settings are available.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default DashboardTemplate
