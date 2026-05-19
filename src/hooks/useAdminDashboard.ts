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
  toDashboardPagination,
} from '../utils/adminDashboard'
import type { DashboardState } from '../utils/adminDashboard'

const ADMIN_PAGE_LIMIT = 8

type DashboardDataQuery = {
  departmentKeyword?: string
  departmentPage?: number
  doctorKeyword?: string
  doctorPage?: number
  patientKeyword?: string
  patientPage?: number
  userKeyword?: string
  userPage?: number
}

const getSearchKeyword = (value?: string) => value?.trim() || undefined

export const loadDashboardData = async ({
  departmentKeyword,
  departmentPage = 1,
  doctorKeyword,
  doctorPage = 1,
  patientKeyword,
  patientPage = 1,
  userKeyword,
  userPage = 1,
}: DashboardDataQuery = {}): Promise<DashboardState> => {
  const [
    doctorsResponse,
    activeDoctorsResponse,
    patientsResponse,
    departmentsResponse,
    departmentOptionsResponse,
    usersResponse,
    assignmentsResponse,
    slotsResponse,
    availableSlotsResponse,
    appointmentsResponse,
  ] = await Promise.allSettled([
    getDoctors({
      page: doctorPage,
      limit: ADMIN_PAGE_LIMIT,
      keyword: getSearchKeyword(doctorKeyword),
    }),
    getDoctors({ limit: 1, status: 'ACTIVE' }),
    getPatients({
      page: patientPage,
      limit: ADMIN_PAGE_LIMIT,
      keyword: getSearchKeyword(patientKeyword),
    }),
    getDepartments({
      page: departmentPage,
      limit: ADMIN_PAGE_LIMIT,
      keyword: getSearchKeyword(departmentKeyword),
    }),
    getDepartments({ limit: 100 }),
    getUsers({
      page: userPage,
      limit: ADMIN_PAGE_LIMIT,
      keyword: getSearchKeyword(userKeyword),
    }),
    getDoctorAssignments({ limit: 100, status: 'ACTIVE' }),
    getAppointmentSlots({ limit: 100 }),
    getAppointmentSlots({ limit: 1, status: 'AVAILABLE' }),
    getAppointments({ limit: 100 }),
  ])

  const doctors = getFulfilledValue(doctorsResponse)
  const activeDoctors = getFulfilledValue(activeDoctorsResponse)
  const patients = getFulfilledValue(patientsResponse)
  const departments = getFulfilledValue(departmentsResponse)
  const departmentOptions = getFulfilledValue(departmentOptionsResponse)
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
    departmentPagination: toDashboardPagination(departments?.pagination),
    departmentStatus: departments ? 'ready' : 'error',
    doctors: mapDoctors(doctors, appointments, slots, assignments),
    doctorPagination: toDashboardPagination(doctors?.pagination),
    doctorStatus: doctors ? 'ready' : 'error',
    patients: mapPatients(patients),
    patientPagination: toDashboardPagination(patients?.pagination),
    patientStatus: patients ? 'ready' : 'error',
    users: users?.users || [],
    userPagination: toDashboardPagination(users?.pagination),
    userStatus: users ? 'ready' : 'error',
    departmentOptions: buildDepartmentOptions(departmentOptions || departments),
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
    totalUsers: users?.pagination.total || 0,
  }
}

export const useAdminDashboard = () => {
  const [departmentSearchQuery, setDepartmentSearchQuery] = useState('')
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('')
  const [patientSearchQuery, setPatientSearchQuery] = useState('')
  const [userSearchQuery, setUserSearchQuery] = useState('')
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
    const nextDashboard = await loadDashboardData({
      departmentKeyword: departmentSearchQuery,
      departmentPage: dashboard.departmentPagination.page,
      doctorKeyword: doctorSearchQuery,
      doctorPage: dashboard.doctorPagination.page,
      patientKeyword: patientSearchQuery,
      patientPage: dashboard.patientPagination.page,
      userKeyword: userSearchQuery,
      userPage: dashboard.userPagination.page,
    })
    setDashboard(nextDashboard)
  }, [
    dashboard.departmentPagination.page,
    dashboard.doctorPagination.page,
    dashboard.patientPagination.page,
    dashboard.userPagination.page,
    departmentSearchQuery,
    doctorSearchQuery,
    patientSearchQuery,
    userSearchQuery,
  ])

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

  const fetchDepartmentsPage = useCallback(async (page: number, keyword = departmentSearchQuery) => {
    setDashboard((currentDashboard) => ({ ...currentDashboard, departmentStatus: 'loading' }))

    try {
      const departments = await getDepartments({
        page,
        limit: ADMIN_PAGE_LIMIT,
        keyword: keyword.trim() || undefined,
      })

      setDashboard((currentDashboard) => ({
        ...currentDashboard,
        departments: departments.departments,
        departmentPagination: toDashboardPagination(departments.pagination),
        departmentStatus: 'ready',
        totalDepartments: departments.pagination.total,
      }))
    } catch {
      setDashboard((currentDashboard) => ({ ...currentDashboard, departmentStatus: 'error' }))
    }
  }, [departmentSearchQuery])

  const fetchDoctorsPage = useCallback(async (page: number, keyword = doctorSearchQuery) => {
    setDashboard((currentDashboard) => ({ ...currentDashboard, doctorStatus: 'loading' }))

    try {
      const [doctors, assignments, slots, appointments] = await Promise.all([
        getDoctors({
          page,
          limit: ADMIN_PAGE_LIMIT,
          keyword: keyword.trim() || undefined,
        }),
        getDoctorAssignments({ limit: 100, status: 'ACTIVE' }),
        getAppointmentSlots({ limit: 100 }),
        getAppointments({ limit: 100 }),
      ])

      setDashboard((currentDashboard) => ({
        ...currentDashboard,
        doctors: mapDoctors(doctors, appointments, slots, assignments),
        doctorPagination: toDashboardPagination(doctors.pagination),
        doctorStatus: 'ready',
        totalDoctors: doctors.pagination.total,
      }))
    } catch {
      setDashboard((currentDashboard) => ({ ...currentDashboard, doctorStatus: 'error' }))
    }
  }, [doctorSearchQuery])

  const fetchPatientsPage = useCallback(async (page: number, keyword = patientSearchQuery) => {
    setDashboard((currentDashboard) => ({ ...currentDashboard, patientStatus: 'loading' }))

    try {
      const patients = await getPatients({
        page,
        limit: ADMIN_PAGE_LIMIT,
        keyword: keyword.trim() || undefined,
      })

      setDashboard((currentDashboard) => ({
        ...currentDashboard,
        patients: mapPatients(patients),
        patientPagination: toDashboardPagination(patients.pagination),
        patientStatus: 'ready',
        totalPatients: patients.pagination.total,
      }))
    } catch {
      setDashboard((currentDashboard) => ({ ...currentDashboard, patientStatus: 'error' }))
    }
  }, [patientSearchQuery])

  const fetchUsersPage = useCallback(async (page: number, keyword = userSearchQuery) => {
    setDashboard((currentDashboard) => ({ ...currentDashboard, userStatus: 'loading' }))

    try {
      const users = await getUsers({
        page,
        limit: ADMIN_PAGE_LIMIT,
        keyword: keyword.trim() || undefined,
      })

      setDashboard((currentDashboard) => ({
        ...currentDashboard,
        users: users.users,
        userPagination: toDashboardPagination(users.pagination),
        userStatus: 'ready',
        totalUsers: users.pagination.total,
      }))
    } catch {
      setDashboard((currentDashboard) => ({ ...currentDashboard, userStatus: 'error' }))
    }
  }, [userSearchQuery])

  const handleDepartmentPageChange = useCallback((page: number) => {
    void fetchDepartmentsPage(page)
  }, [fetchDepartmentsPage])

  const handleDoctorPageChange = useCallback((page: number) => {
    void fetchDoctorsPage(page)
  }, [fetchDoctorsPage])

  const handlePatientPageChange = useCallback((page: number) => {
    void fetchPatientsPage(page)
  }, [fetchPatientsPage])

  const handleUserPageChange = useCallback((page: number) => {
    void fetchUsersPage(page)
  }, [fetchUsersPage])

  const handleDepartmentSearchQueryChange = useCallback((query: string) => {
    setDepartmentSearchQuery(query)
    void fetchDepartmentsPage(1, query)
  }, [fetchDepartmentsPage])

  const handleDoctorSearchQueryChange = useCallback((query: string) => {
    setDoctorSearchQuery(query)
    void fetchDoctorsPage(1, query)
  }, [fetchDoctorsPage])

  const handlePatientSearchQueryChange = useCallback((query: string) => {
    setPatientSearchQuery(query)
    void fetchPatientsPage(1, query)
  }, [fetchPatientsPage])

  const handleUserSearchQueryChange = useCallback((query: string) => {
    setUserSearchQuery(query)
    void fetchUsersPage(1, query)
  }, [fetchUsersPage])

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
        prof_biography: payload.profBiography?.trim() || null,
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
    handleDepartmentPageChange,
    handleDepartmentSearchQueryChange,
    handleDoctorEditSubmit,
    handleDoctorPageChange,
    handleDoctorSearchQueryChange,
    handleEditDepartment,
    handleEditDoctor,
    handleEditUser,
    handlePatientPageChange,
    handlePatientSearchQueryChange,
    handleUserSubmit,
    handleUserPageChange,
    handleUserSearchQueryChange,
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
    setSelectedDoctor,
    setSelectedPatient,
    setSelectedUser,
    userSearchQuery,
    userEditError,
    userFields,
    visibleDepartments: dashboard.departments,
    visibleDoctors: dashboard.doctors,
    visiblePatients: dashboard.patients,
    visibleUsers: dashboard.users,
  }
}
