import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DepartmentFormValues } from '../components/Organisms/DepartmentDesign/DepartmentEditModal'
import type { DoctorEditFormValues } from '../components/Organisms/DoctorManage/DoctorEditModal'
import type { UserFormValues } from '../components/Organisms/UserManage/UserEditModal'
import type { DoctorManagementRowData } from '../components/Molecules/Management/DoctorManagementRow'
import type { PatientManagementRowData } from '../components/Molecules/Management/PatientManagementRow'
import { getAppointments } from '../services/appointment.service'
import { getAppointmentSlots } from '../services/appointmentSlot.service'
import type { User } from '../services/auth.service'
import { createDepartment, getDepartments, updateDepartment } from '../services/department.service'
import type { Department } from '../services/department.service'
import { createDoctorAssignment, getDoctorAssignments, updateDoctorAssignment } from '../services/doctorAssignment.service'
import { getDoctors, updateDoctor, uploadDoctorImage } from '../services/doctor.service'
import { getPatients } from '../services/patient.service'
import { changeUserStatus, createUser, deleteUser, getUsers, updateUser } from '../services/user.service'
import {
  buildAnalyticsData,
  buildDepartmentOptions,
  buildStats,
  dashboardErrorState,
  emptyDashboardState,
  getDoctorInfoFields,
  getFulfilledValue,
  getPatientInfoFields,
  getUserInfoFields,
  mapDoctors,
  mapPatients,
} from '../utils/adminDashboard'
import type { DashboardState } from '../utils/adminDashboard'

export const loadDashboardData = async (): Promise<DashboardState> => {
  const [
    doctorsResponse,
    activeDoctorsResponse,
    patientsResponse,
    departmentsResponse,
    usersResponse,
    assignmentsResponse,
    slotsResponse,
    availableSlotsResponse,
    appointmentsResponse,
  ] = await Promise.allSettled([
    getDoctors({ limit: 100 }),
    getDoctors({ limit: 1, status: 'ACTIVE' }),
    getPatients({ limit: 100 }),
    getDepartments({ limit: 100 }),
    getUsers(),
    getDoctorAssignments({ limit: 100, status: 'ACTIVE' }),
    getAppointmentSlots({ limit: 100 }),
    getAppointmentSlots({ limit: 1, status: 'AVAILABLE' }),
    getAppointments({ limit: 100 }),
  ])

  const doctors = getFulfilledValue(doctorsResponse)
  const activeDoctors = getFulfilledValue(activeDoctorsResponse)
  const patients = getFulfilledValue(patientsResponse)
  const departments = getFulfilledValue(departmentsResponse)
  const users = getFulfilledValue(usersResponse)
  const assignments = getFulfilledValue(assignmentsResponse)
  const slots = getFulfilledValue(slotsResponse)
  const availableSlots = getFulfilledValue(availableSlotsResponse)
  const appointments = getFulfilledValue(appointmentsResponse)
  const hasStatsData = Boolean(doctors || patients || departments || users || slots || availableSlots || appointments)

  return {
    analyticsData: buildAnalyticsData(appointments, slots),
    analyticsStatus: appointments || slots ? 'ready' : 'error',
    departments: departments?.departments || [],
    departmentStatus: departments ? 'ready' : 'error',
    doctors: mapDoctors(doctors, appointments, slots, assignments),
    doctorStatus: doctors ? 'ready' : 'error',
    patients: mapPatients(patients),
    patientStatus: patients ? 'ready' : 'error',
    users: users || [],
    userStatus: users ? 'ready' : 'error',
    departmentOptions: buildDepartmentOptions(departments),
    stats: buildStats({
      activeDoctors,
      appointments,
      availableSlots,
      departments,
      doctors,
      patients,
      slots,
    }),
    statsStatus: hasStatsData ? 'ready' : 'error',
    totalDepartments: departments?.pagination.total || 0,
    totalDoctors: doctors?.pagination.total || 0,
    totalPatients: patients?.pagination.total || 0,
  }
}

export const useAdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [dashboard, setDashboard] = useState<DashboardState>(emptyDashboardState)
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorManagementRowData | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<PatientManagementRowData | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [userEditError, setUserEditError] = useState('')
  const [isSavingUser, setIsSavingUser] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false)
  const [departmentEditError, setDepartmentEditError] = useState('')
  const [isSavingDepartment, setIsSavingDepartment] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<DoctorManagementRowData | null>(null)
  const [doctorEditError, setDoctorEditError] = useState('')
  const [isSavingDoctor, setIsSavingDoctor] = useState(false)

  const refreshDashboard = useCallback(async () => {
    const nextDashboard = await loadDashboardData()
    setDashboard(nextDashboard)
  }, [])

  useEffect(() => {
    let active = true

    loadDashboardData()
      .then((data) => {
        if (!active) return
        setDashboard(data)
      })
      .catch(() => {
        if (!active) return
        setDashboard(dashboardErrorState)
      })

    return () => {
      active = false
    }
  }, [])

  const visibleDoctors = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (!normalizedQuery) return dashboard.doctors

    return dashboard.doctors.filter((doctor) => (
      `${doctor.name} ${doctor.email || ''} ${doctor.specialty || ''} ${doctor.cccd || ''}`.toLowerCase().includes(normalizedQuery)
    ))
  }, [dashboard.doctors, searchQuery])

  const closeUserModal = useCallback(() => {
    setIsUserModalOpen(false)
    setEditingUser(null)
    setUserEditError('')
  }, [])

  const handleCreateUser = useCallback(() => {
    setUserEditError('')
    setEditingUser(null)
    setIsUserModalOpen(true)
  }, [])

  const handleEditUser = useCallback((user: User) => {
    setUserEditError('')
    setEditingUser(user)
    setIsUserModalOpen(true)
  }, [])

  const handleDeleteUser = useCallback(async (user: User) => {
    if (!window.confirm(`Xóa user ${user.email}?`)) return

    try {
      await deleteUser(user.id)
      await refreshDashboard()
    } catch (error) {
      setSelectedUser(user)
      setUserEditError(error instanceof Error ? error.message : 'Không thể xóa user.')
    }
  }, [refreshDashboard])

  const handleUserSubmit = useCallback(async (payload: UserFormValues) => {
    if (!payload.email) {
      setUserEditError('Email không được để trống.')
      return
    }

    if (!editingUser && !payload.password) {
      setUserEditError('Mật khẩu là bắt buộc khi tạo user.')
      return
    }

    setUserEditError('')
    setIsSavingUser(true)

    try {
      const nextPayload = {
        full_name: payload.fullName || null,
        email: payload.email,
        phone: payload.phone || null,
        date_of_birth: payload.dateOfBirth || null,
        cccd_number: payload.cccdNumber || null,
        cccd_front_image: payload.cccdFrontImage || null,
        cccd_back_image: payload.cccdBackImage || null,
        role: payload.role,
      }

      if (editingUser) {
        await updateUser(editingUser.id, nextPayload)
        if (payload.status !== editingUser.status) {
          await changeUserStatus(editingUser.id, payload.status)
        }
      } else {
        await createUser({
          ...nextPayload,
          password: payload.password,
          status: payload.status,
        })
      }

      await refreshDashboard()
      closeUserModal()
    } catch (error) {
      setUserEditError(error instanceof Error ? error.message : 'Không thể lưu user.')
    } finally {
      setIsSavingUser(false)
    }
  }, [closeUserModal, editingUser, refreshDashboard])

  const closeDepartmentModal = useCallback(() => {
    setIsDepartmentModalOpen(false)
    setEditingDepartment(null)
    setDepartmentEditError('')
  }, [])

  const handleCreateDepartment = useCallback(() => {
    setDepartmentEditError('')
    setEditingDepartment(null)
    setIsDepartmentModalOpen(true)
  }, [])

  const handleEditDepartment = useCallback((department: Department) => {
    setDepartmentEditError('')
    setEditingDepartment(department)
    setIsDepartmentModalOpen(true)
  }, [])

  const handleDepartmentEditSubmit = useCallback(async (payload: DepartmentFormValues) => {
    if (!payload.name) {
      setDepartmentEditError('Tên khoa không được để trống.')
      return
    }

    setDepartmentEditError('')
    setIsSavingDepartment(true)

    try {
      if (editingDepartment) {
        await updateDepartment(editingDepartment.id, {
          name: payload.name,
          description: payload.description,
          status: payload.status,
        })
      } else {
        await createDepartment({
          name: payload.name,
          description: payload.description,
          status: payload.status,
        })
      }

      await refreshDashboard()
      closeDepartmentModal()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể lưu khoa.'
      setDepartmentEditError(message)
    } finally {
      setIsSavingDepartment(false)
    }
  }, [closeDepartmentModal, editingDepartment, refreshDashboard])

  const closeDoctorModal = useCallback(() => {
    setEditingDoctor(null)
  }, [])

  const handleEditDoctor = useCallback((doctor: DoctorManagementRowData) => {
    setDoctorEditError('')
    setEditingDoctor(doctor)
  }, [])

  const handleDoctorEditSubmit = useCallback(async (payload: DoctorEditFormValues) => {
    if (!editingDoctor) return

    if (!editingDoctor.userId) {
      setDoctorEditError('Không tìm thấy user_id của bác sĩ.')
      return
    }

    const fullName = payload.fullName.trim()
    const licenseNumber = payload.licenseNumber.trim()
    const cccd = payload.cccd?.trim() || ''
    const departmentId = payload.departmentId

    if (!fullName) {
      setDoctorEditError('Tên bác sĩ không được để trống.')
      return
    }

    if (!licenseNumber) {
      setDoctorEditError('Mã giấy phép không được để trống.')
      return
    }

    if (cccd && !/^\d{12}$/.test(cccd)) {
      setDoctorEditError('CCCD phải gồm đúng 12 số.')
      return
    }

    setDoctorEditError('')
    setIsSavingDoctor(true)

    try {
      const uploadedDoctor = payload.imageData
        ? await uploadDoctorImage(editingDoctor.id, payload.imageData)
        : null

      await updateUser(editingDoctor.userId, { full_name: fullName })
      await updateDoctor(editingDoctor.id, {
        license_number: licenseNumber,
        cccd: cccd || null,
        experience_years: payload.experienceYears === '' || payload.experienceYears === undefined
          ? null
          : payload.experienceYears,
        consultation_fee: payload.consultationFee === '' || payload.consultationFee === undefined
          ? null
          : payload.consultationFee,
        description: payload.description?.trim() || null,
        status: payload.status,
        image_url: uploadedDoctor?.image_url || payload.imageUrl?.trim() || null,
      })

      if (departmentId && departmentId !== String(editingDoctor.departmentId || '')) {
        const existingAssignments = await getDoctorAssignments({
          doctor_id: editingDoctor.id,
          department_id: departmentId,
          limit: 1,
        })
        const existingAssignment = existingAssignments.doctor_assignments[0]
        const activatedAssignment = existingAssignment
          ? await updateDoctorAssignment(existingAssignment.id, { status: 'ACTIVE' })
          : await createDoctorAssignment({
            doctor_id: editingDoctor.id,
            department_id: departmentId,
            status: 'ACTIVE',
          })

        if (
          editingDoctor.activeAssignmentId
          && String(editingDoctor.activeAssignmentId) !== String(activatedAssignment.id)
        ) {
          await updateDoctorAssignment(editingDoctor.activeAssignmentId, { status: 'INACTIVE' })
        }
      }

      await refreshDashboard()
      closeDoctorModal()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể cập nhật bác sĩ.'
      setDoctorEditError(message)
    } finally {
      setIsSavingDoctor(false)
    }
  }, [closeDoctorModal, editingDoctor, refreshDashboard])

  const userFields = useMemo(() => getUserInfoFields(selectedUser), [selectedUser])
  const doctorFields = useMemo(() => getDoctorInfoFields(selectedDoctor), [selectedDoctor])
  const patientFields = useMemo(() => getPatientInfoFields(selectedPatient), [selectedPatient])

  return {
    closeDepartmentModal,
    closeDoctorModal,
    closeUserModal,
    dashboard,
    departmentEditError,
    doctorEditError,
    doctorFields,
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
    searchQuery,
    selectedDoctor,
    selectedPatient,
    selectedUser,
    setSearchQuery,
    setSelectedDoctor,
    setSelectedPatient,
    setSelectedUser,
    userEditError,
    userFields,
    visibleDoctors,
  }
}
