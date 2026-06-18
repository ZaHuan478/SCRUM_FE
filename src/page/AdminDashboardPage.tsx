import { useCallback, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AdminInfoModal from '../components/Organisms/Admin/AdminInfoModal'
import DepartmentEditModal from '../components/Organisms/DepartmentDesign/DepartmentEditModal'
import DoctorEditModal from '../components/Organisms/DoctorManage/DoctorEditModal'
import DoctorScheduleModal from '../components/Organisms/DoctorManage/DoctorScheduleModal'
import PatientEditModal from '../components/Organisms/PatientManage/PatientEditModal'
import SymptomRuleEditModal from '../components/Organisms/SymptomRules/SymptomRuleEditModal'
import UserEditModal from '../components/Organisms/UserManage/UserEditModal'
import DashboardTemplate from '../components/Templates/DashboardTemplate'
import { useAdminDashboard } from '../hooks/useAdminDashboard'
import { clearAuthSession, getStoredUser } from '../services/auth.service'
import type { User } from '../services/auth.service'

type AdminDashboardContentProps = {
  onLogout: () => void
  currentUser: User & { role: 'ADMIN' | 'SUPER_ADMIN' }
}

const AdminDashboardContent = ({ currentUser, onLogout }: AdminDashboardContentProps) => {
  const adminDashboard = useAdminDashboard()
  const {
    closeDepartmentModal,
    closeDoctorModal,
    closeDoctorScheduleModal,
    closePatientModal,
    closeSymptomRuleModal,
    closeUserModal,
    dashboard,
    departmentEditError,
    departmentSearchQuery,
    doctorEditError,
    doctorFields,
    doctorScheduleError,
    doctorSearchQuery,
    editingDepartment,
    editingDoctor,
    editingPatient,
    editingSymptomRule,
    editingUser,
    handleCreateDepartment,
    handleCreateDoctor,
    handleCreateSymptomRule,
    handleCreateUser,
    handleDeleteDepartment,
    handleDeleteSymptomRule,
    handleDeleteUser,
    handleDeleteDoctor,
    handleDeletePatient,
    handleDepartmentEditSubmit,
    handleDepartmentPageChange,
    handleDepartmentSearchQueryChange,
    handleDoctorEditSubmit,
    handleDoctorScheduleSubmit,
    handleDoctorPageChange,
    handleDoctorSearchQueryChange,
    handleEditDepartment,
    handleEditDoctor,
    handleEditPatient,
    handleEditSymptomRule,
    handleEditUser,
    handleAppointmentPageChange,
    handleAppointmentStatusFilterChange,
    handleCancelAppointment,
    handleCompleteAppointment,
    handleConfirmAppointment,
    handlePatientPageChange,
    handlePatientSearchQueryChange,
    handlePatientSubmit,
    handleScheduleDoctor,
    handleSymptomRulePageChange,
    handleSymptomRuleSubmit,
    handleUserSubmit,
    handleUserPageChange,
    handleUserSearchQueryChange,
    isDepartmentModalOpen,
    isDoctorModalOpen,
    isDoctorScheduleModalOpen,
    isPatientModalOpen,
    isSavingDepartment,
    isSavingDoctor,
    isSavingDoctorSchedule,
    isSavingPatient,
    isSavingSymptomRule,
    isSavingUser,
    isSymptomRuleModalOpen,
    isUserModalOpen,
    patientFields,
    patientEditError,
    patientSearchQuery,
    appointmentStatusFilter,
    schedulingDoctor,
    selectedDoctor,
    selectedPatient,
    selectedUser,
    setSelectedDoctor,
    setSelectedPatient,
    setSelectedUser,
    userSearchQuery,
    userEditError,
    userFields,
    symptomRuleEditError,
    visibleDepartments,
    visibleDoctors,
    visiblePatients,
    visibleAppointments,
    visibleSymptomRules,
    visibleUsers,
  } = adminDashboard

  return (
    <>
      <DashboardTemplate
        analyticsData={dashboard.analyticsData}
        analyticsStatus={dashboard.analyticsStatus}
        currentUserRole={currentUser.role}
        departments={visibleDepartments}
        departmentPagination={dashboard.departmentPagination}
        departmentSearchQuery={departmentSearchQuery}
        departmentStatus={dashboard.departmentStatus}
        symptomRules={visibleSymptomRules}
        symptomRulePagination={dashboard.symptomRulePagination}
        symptomRuleStatus={dashboard.symptomRuleStatus}
        doctorPagination={dashboard.doctorPagination}
        doctorSearchQuery={doctorSearchQuery}
        doctors={visibleDoctors}
        doctorStatus={dashboard.doctorStatus}
        onCreateDepartment={handleCreateDepartment}
        onCreateDoctor={handleCreateDoctor}
        onCreateSymptomRule={handleCreateSymptomRule}
        onCreateUser={handleCreateUser}
        onDeleteDepartment={handleDeleteDepartment}
        onDeleteSymptomRule={handleDeleteSymptomRule}
        onDeleteUser={handleDeleteUser}
        onDeleteDoctor={handleDeleteDoctor}
        onDeletePatient={handleDeletePatient}
        onEditDepartment={handleEditDepartment}
        onEditDoctor={handleEditDoctor}
        onEditPatient={handleEditPatient}
        onEditSymptomRule={handleEditSymptomRule}
        onEditUser={handleEditUser}
        onLogout={onLogout}
        onDepartmentPageChange={handleDepartmentPageChange}
        onDepartmentSearchQueryChange={handleDepartmentSearchQueryChange}
        onDoctorPageChange={handleDoctorPageChange}
        onDoctorSearchQueryChange={handleDoctorSearchQueryChange}
        onAppointmentPageChange={handleAppointmentPageChange}
        onAppointmentStatusFilterChange={handleAppointmentStatusFilterChange}
        onCancelAppointment={handleCancelAppointment}
        onCompleteAppointment={handleCompleteAppointment}
        onConfirmAppointment={handleConfirmAppointment}
        onPatientPageChange={handlePatientPageChange}
        onPatientSearchQueryChange={handlePatientSearchQueryChange}
        onScheduleDoctor={handleScheduleDoctor}
        onSymptomRulePageChange={handleSymptomRulePageChange}
        onUserPageChange={handleUserPageChange}
        onUserSearchQueryChange={handleUserSearchQueryChange}
        onViewDoctor={setSelectedDoctor}
        onViewPatient={setSelectedPatient}
        onViewUser={setSelectedUser}
        patientPagination={dashboard.patientPagination}
        patientStatus={dashboard.patientStatus}
        patientSearchQuery={patientSearchQuery}
        patients={visiblePatients}
        appointments={visibleAppointments}
        appointmentPagination={dashboard.appointmentPagination}
        appointmentStatus={dashboard.appointmentStatus}
        appointmentStatusFilter={appointmentStatusFilter}
        stats={dashboard.stats}
        statsStatus={dashboard.statsStatus}
        totalDepartments={dashboard.totalDepartments}
        totalSymptomRules={dashboard.totalSymptomRules}
        totalDoctors={dashboard.totalDoctors}
        totalPatients={dashboard.totalPatients}
        totalAppointments={dashboard.totalAppointments}
        totalUsers={dashboard.totalUsers}
        userPagination={dashboard.userPagination}
        userStatus={dashboard.userStatus}
        userSearchQuery={userSearchQuery}
        users={visibleUsers}
      />
      <AdminInfoModal
        fields={userFields}
        onClose={() => setSelectedUser(null)}
        open={Boolean(selectedUser)}
        subtitle={selectedUser?.email || undefined}
        title={selectedUser?.full_name || 'Thông tin người dùng'}
      />
      <AdminInfoModal
        fields={doctorFields}
        onClose={() => setSelectedDoctor(null)}
        open={Boolean(selectedDoctor)}
        subtitle={selectedDoctor?.email || undefined}
        title={selectedDoctor?.name || 'Thông tin bác sĩ'}
      />
      <AdminInfoModal
        fields={patientFields}
        onClose={() => setSelectedPatient(null)}
        open={Boolean(selectedPatient)}
        subtitle={selectedPatient?.email || undefined}
        title={selectedPatient?.name || 'Thông tin bệnh nhân'}
      />
      <DepartmentEditModal
        department={editingDepartment}
        error={departmentEditError}
        isSaving={isSavingDepartment}
        key={editingDepartment?.id || (isDepartmentModalOpen ? 'department-create-open' : 'department-create-closed')}
        onClose={closeDepartmentModal}
        onSubmit={handleDepartmentEditSubmit}
        open={isDepartmentModalOpen}
      />
      <UserEditModal
        error={userEditError}
        isSaving={isSavingUser}
        key={editingUser?.id || (isUserModalOpen ? 'user-create-open' : 'user-create-closed')}
        onClose={closeUserModal}
        onSubmit={handleUserSubmit}
        open={isUserModalOpen}
        canManageAdmins={currentUser.role === 'SUPER_ADMIN'}
        user={editingUser}
      />
      <DoctorEditModal
        departmentOptions={dashboard.departmentOptions}
        doctor={editingDoctor}
        error={doctorEditError}
        isSaving={isSavingDoctor}
        key={editingDoctor?.id || (isDoctorModalOpen ? 'doctor-create-open' : 'doctor-create-closed')}
        onClose={closeDoctorModal}
        open={isDoctorModalOpen}
        onSubmit={handleDoctorEditSubmit}
      />
      <DoctorScheduleModal
        doctor={schedulingDoctor}
        error={doctorScheduleError}
        isSaving={isSavingDoctorSchedule}
        onClose={closeDoctorScheduleModal}
        onSubmit={handleDoctorScheduleSubmit}
        open={isDoctorScheduleModalOpen}
      />
      <PatientEditModal
        error={patientEditError}
        isSaving={isSavingPatient}
        key={editingPatient?.id || (isPatientModalOpen ? 'patient-edit-open' : 'patient-edit-closed')}
        onClose={closePatientModal}
        onSubmit={handlePatientSubmit}
        open={isPatientModalOpen}
        patient={editingPatient}
      />
      <SymptomRuleEditModal
        departments={dashboard.departments}
        error={symptomRuleEditError}
        isSaving={isSavingSymptomRule}
        key={editingSymptomRule?.id || (isSymptomRuleModalOpen ? 'symptom-rule-create-open' : 'symptom-rule-create-closed')}
        onClose={closeSymptomRuleModal}
        onSubmit={handleSymptomRuleSubmit}
        open={isSymptomRuleModalOpen}
        rule={editingSymptomRule}
        symptoms={dashboard.symptomOptions}
      />
    </>
  )
}

const AdminDashboardPage = () => {
  const navigate = useNavigate()
  const [storedUser] = useState<User | null>(() => getStoredUser())

  const handleLogout = useCallback(() => {
    clearAuthSession()
    navigate('/login', { replace: true })
  }, [navigate])

  if (!storedUser) return <Navigate replace to="/login" />
  if (!['ADMIN', 'SUPER_ADMIN'].includes(storedUser.role)) return <Navigate replace to="/forbidden" />

  return <AdminDashboardContent currentUser={storedUser as User & { role: 'ADMIN' | 'SUPER_ADMIN' }} onLogout={handleLogout} />
}

export default AdminDashboardPage
