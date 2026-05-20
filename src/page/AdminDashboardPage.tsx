import { useCallback, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AdminInfoModal from '../components/Organisms/Admin/AdminInfoModal'
import DepartmentEditModal from '../components/Organisms/DepartmentDesign/DepartmentEditModal'
import DoctorEditModal from '../components/Organisms/DoctorManage/DoctorEditModal'
import SymptomRuleEditModal from '../components/Organisms/SymptomRules/SymptomRuleEditModal'
import UserEditModal from '../components/Organisms/UserManage/UserEditModal'
import DashboardTemplate from '../components/Templates/DashboardTemplate'
import { useAdminDashboard } from '../hooks/useAdminDashboard'
import { clearAuthSession, getStoredUser } from '../services/auth.service'
import type { User } from '../services/auth.service'

type AdminDashboardContentProps = {
  onLogout: () => void
}

const AdminDashboardContent = ({ onLogout }: AdminDashboardContentProps) => {
  const adminDashboard = useAdminDashboard()
  const {
    closeDepartmentModal,
    closeDoctorModal,
    closeSymptomRuleModal,
    closeUserModal,
    dashboard,
    departmentEditError,
    departmentSearchQuery,
    doctorEditError,
    doctorFields,
    doctorSearchQuery,
    editingDepartment,
    editingDoctor,
    editingSymptomRule,
    editingUser,
    handleCreateDepartment,
    handleCreateDoctor,
    handleCreateSymptomRule,
    handleCreateUser,
    handleDeleteSymptomRule,
    handleDeleteUser,
    handleDepartmentEditSubmit,
    handleDepartmentPageChange,
    handleDepartmentSearchQueryChange,
    handleDoctorEditSubmit,
    handleDoctorPageChange,
    handleDoctorSearchQueryChange,
    handleEditDepartment,
    handleEditDoctor,
    handleEditSymptomRule,
    handleEditUser,
    handlePatientPageChange,
    handlePatientSearchQueryChange,
    handleSymptomRulePageChange,
    handleSymptomRuleSubmit,
    handleUserSubmit,
    handleUserPageChange,
    handleUserSearchQueryChange,
    isDepartmentModalOpen,
    isDoctorModalOpen,
    isSavingDepartment,
    isSavingDoctor,
    isSavingSymptomRule,
    isSavingUser,
    isSymptomRuleModalOpen,
    isUserModalOpen,
    patientFields,
    patientSearchQuery,
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
    visibleSymptomRules,
    visibleUsers,
  } = adminDashboard

  return (
    <>
      <DashboardTemplate
        analyticsData={dashboard.analyticsData}
        analyticsStatus={dashboard.analyticsStatus}
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
        onDeleteSymptomRule={handleDeleteSymptomRule}
        onDeleteUser={handleDeleteUser}
        onEditDepartment={handleEditDepartment}
        onEditDoctor={handleEditDoctor}
        onEditSymptomRule={handleEditSymptomRule}
        onEditUser={handleEditUser}
        onLogout={onLogout}
        onDepartmentPageChange={handleDepartmentPageChange}
        onDepartmentSearchQueryChange={handleDepartmentSearchQueryChange}
        onDoctorPageChange={handleDoctorPageChange}
        onDoctorSearchQueryChange={handleDoctorSearchQueryChange}
        onPatientPageChange={handlePatientPageChange}
        onPatientSearchQueryChange={handlePatientSearchQueryChange}
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
        stats={dashboard.stats}
        statsStatus={dashboard.statsStatus}
        totalDepartments={dashboard.totalDepartments}
        totalSymptomRules={dashboard.totalSymptomRules}
        totalDoctors={dashboard.totalDoctors}
        totalPatients={dashboard.totalPatients}
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
        title={selectedUser?.full_name || 'Thông tin user'}
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
  if (storedUser.role !== 'ADMIN') return <Navigate replace to="/" />

  return <AdminDashboardContent onLogout={handleLogout} />
}

export default AdminDashboardPage
