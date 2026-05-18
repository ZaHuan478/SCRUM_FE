import { useCallback, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AdminInfoModal from '../components/Organisms/Admin/AdminInfoModal'
import DepartmentEditModal from '../components/Organisms/DepartmentDesign/DepartmentEditModal'
import DoctorEditModal from '../components/Organisms/DoctorManage/DoctorEditModal'
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
    closeUserModal,
    dashboard,
    departmentEditError,
    departmentSearchQuery,
    doctorEditError,
    doctorFields,
    doctorSearchQuery,
    editingDepartment,
    editingDoctor,
    editingUser,
    handleCreateDepartment,
    handleCreateUser,
    handleDeleteUser,
    handleDepartmentEditSubmit,
    handleDoctorEditSubmit,
    handleEditDepartment,
    handleEditDoctor,
    handleEditUser,
    handleUserSubmit,
    isDepartmentModalOpen,
    isSavingDepartment,
    isSavingDoctor,
    isSavingUser,
    isUserModalOpen,
    patientFields,
    patientSearchQuery,
    selectedDoctor,
    selectedPatient,
    selectedUser,
    setDepartmentSearchQuery,
    setDoctorSearchQuery,
    setPatientSearchQuery,
    setSelectedDoctor,
    setSelectedPatient,
    setSelectedUser,
    setUserSearchQuery,
    userSearchQuery,
    userEditError,
    userFields,
    visibleDepartments,
    visibleDoctors,
    visiblePatients,
    visibleUsers,
  } = adminDashboard

  return (
    <>
      <DashboardTemplate
        analyticsData={dashboard.analyticsData}
        analyticsStatus={dashboard.analyticsStatus}
        departments={visibleDepartments}
        departmentSearchQuery={departmentSearchQuery}
        departmentStatus={dashboard.departmentStatus}
        doctorSearchQuery={doctorSearchQuery}
        doctors={visibleDoctors}
        doctorStatus={dashboard.doctorStatus}
        onCreateDepartment={handleCreateDepartment}
        onCreateUser={handleCreateUser}
        onDeleteUser={handleDeleteUser}
        onEditDepartment={handleEditDepartment}
        onEditDoctor={handleEditDoctor}
        onEditUser={handleEditUser}
        onLogout={onLogout}
        onDepartmentSearchQueryChange={setDepartmentSearchQuery}
        onDoctorSearchQueryChange={setDoctorSearchQuery}
        onPatientSearchQueryChange={setPatientSearchQuery}
        onUserSearchQueryChange={setUserSearchQuery}
        onViewDoctor={setSelectedDoctor}
        onViewPatient={setSelectedPatient}
        onViewUser={setSelectedUser}
        patientStatus={dashboard.patientStatus}
        patientSearchQuery={patientSearchQuery}
        patients={visiblePatients}
        stats={dashboard.stats}
        statsStatus={dashboard.statsStatus}
        totalDepartments={dashboard.totalDepartments}
        totalDoctors={dashboard.totalDoctors}
        totalPatients={dashboard.totalPatients}
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
        key={editingDoctor?.id || 'doctor-edit-empty'}
        onClose={closeDoctorModal}
        onSubmit={handleDoctorEditSubmit}
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
