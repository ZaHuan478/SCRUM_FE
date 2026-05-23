import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DepartmentFormValues } from '../components/Organisms/DepartmentDesign/DepartmentEditModal'
import type { DoctorEditFormValues } from '../components/Organisms/DoctorManage/DoctorEditModal'
import type { SymptomRuleFormValues } from '../components/Organisms/SymptomRules/SymptomRuleEditModal'
import type { UserFormValues } from '../components/Organisms/UserManage/UserEditModal'
import type { DoctorManagementRowData } from '../components/Molecules/Management/DoctorManagementRow'
import type { PatientManagementRowData } from '../components/Molecules/Management/PatientManagementRow'
import { getAppointments } from '../services/appointment.service'
import { getAppointmentSlots } from '../services/appointmentSlot.service'
import type { User } from '../services/auth.service'
import { createDepartment, getDepartments, updateDepartment } from '../services/department.service'
import type { Department } from '../services/department.service'
import {
  createDepartmentSymptomRule,
  deleteDepartmentSymptomRule,
  getDepartmentSymptomRules,
  updateDepartmentSymptomRule,
} from '../services/departmentSymptomRule.service'
import type { DepartmentSymptomRule } from '../services/departmentSymptomRule.service'
import { createDoctorAssignment, getDoctorAssignments, updateDoctorAssignment } from '../services/doctorAssignment.service'
import { getDoctorByUserId, getDoctors, updateDoctor, uploadDoctorImage } from '../services/doctor.service'
import { getPatients } from '../services/patient.service'
import { getSymptoms } from '../services/symptom.service'
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
import { useToast } from '../contexts/ToastContext'

const ADMIN_PAGE_LIMIT = 8

type DashboardDataQuery = {
  departmentKeyword?: string
  departmentPage?: number
  doctorKeyword?: string
  doctorPage?: number
  patientKeyword?: string
  patientPage?: number
  symptomRulePage?: number
  userKeyword?: string
  userPage?: number
}

const getSearchKeyword = (value?: string) => value?.trim() || undefined

const getRequestMessage = (error: unknown, fallback: string) => (
  error instanceof Error ? error.message : fallback
)

export const loadDashboardData = async ({
  departmentKeyword,
  departmentPage = 1,
  doctorKeyword,
  doctorPage = 1,
  patientKeyword,
  patientPage = 1,
  symptomRulePage = 1,
  userKeyword,
  userPage = 1,
}: DashboardDataQuery = {}): Promise<DashboardState> => {
  const [
    doctorsResponse,
    activeDoctorsResponse,
    patientsResponse,
    departmentsResponse,
    departmentOptionsResponse,
    symptomRulesResponse,
    symptomOptionsResponse,
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
    getDepartmentSymptomRules({
      page: symptomRulePage,
      limit: ADMIN_PAGE_LIMIT,
    }),
    getSymptoms({ limit: 100, status: 'ACTIVE' }),
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
  const symptomRules = getFulfilledValue(symptomRulesResponse)
  const symptomOptions = getFulfilledValue(symptomOptionsResponse)
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
    symptomRules: symptomRules?.department_symptom_rules || [],
    symptomRulePagination: toDashboardPagination(symptomRules?.pagination),
    symptomRuleStatus: symptomRules ? 'ready' : 'error',
    symptomOptions: symptomOptions?.symptoms || [],
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
    totalSymptomRules: symptomRules?.pagination.total || 0,
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
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false)
  const [doctorEditError, setDoctorEditError] = useState('')
  const [isSavingDoctor, setIsSavingDoctor] = useState(false)
  const [editingSymptomRule, setEditingSymptomRule] = useState<DepartmentSymptomRule | null>(null)
  const [isSymptomRuleModalOpen, setIsSymptomRuleModalOpen] = useState(false)
  const [symptomRuleEditError, setSymptomRuleEditError] = useState('')
  const [isSavingSymptomRule, setIsSavingSymptomRule] = useState(false)
  const { success: toastSuccess, error: toastError, warning: toastWarning } = useToast()

  const refreshDashboard = useCallback(async () => {
    const nextDashboard = await loadDashboardData({
      departmentKeyword: departmentSearchQuery,
      departmentPage: dashboard.departmentPagination.page,
      doctorKeyword: doctorSearchQuery,
      doctorPage: dashboard.doctorPagination.page,
      patientKeyword: patientSearchQuery,
      patientPage: dashboard.patientPagination.page,
      symptomRulePage: dashboard.symptomRulePagination.page,
      userKeyword: userSearchQuery,
      userPage: dashboard.userPagination.page,
    })
    setDashboard(nextDashboard)
  }, [
    dashboard.departmentPagination.page,
    dashboard.doctorPagination.page,
    dashboard.patientPagination.page,
    dashboard.symptomRulePagination.page,
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
        toastError('Không thể tải dữ liệu admin dashboard.')
      })

    return () => {
      active = false
    }
  }, [toastError])

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
      toastError('Không thể tải danh sách khoa.')
    }
  }, [departmentSearchQuery, toastError])

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
      toastError('Không thể tải danh sách bác sĩ.')
    }
  }, [doctorSearchQuery, toastError])

  const fetchSymptomRulesPage = useCallback(async (page: number) => {
    setDashboard((currentDashboard) => ({ ...currentDashboard, symptomRuleStatus: 'loading' }))

    try {
      const rules = await getDepartmentSymptomRules({
        page,
        limit: ADMIN_PAGE_LIMIT,
      })

      setDashboard((currentDashboard) => ({
        ...currentDashboard,
        symptomRules: rules.department_symptom_rules,
        symptomRulePagination: toDashboardPagination(rules.pagination),
        symptomRuleStatus: 'ready',
        totalSymptomRules: rules.pagination.total,
      }))
    } catch {
      setDashboard((currentDashboard) => ({ ...currentDashboard, symptomRuleStatus: 'error' }))
      toastError('Không thể tải danh sách ghi chú triệu chứng.')
    }
  }, [toastError])

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
      toastError('Không thể tải danh sách bệnh nhân.')
    }
  }, [patientSearchQuery, toastError])

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
      toastError('Không thể tải danh sách người dùng.')
    }
  }, [toastError, userSearchQuery])

  const handleDepartmentPageChange = useCallback((page: number) => {
    void fetchDepartmentsPage(page)
  }, [fetchDepartmentsPage])

  const handleDoctorPageChange = useCallback((page: number) => {
    void fetchDoctorsPage(page)
  }, [fetchDoctorsPage])

  const handlePatientPageChange = useCallback((page: number) => {
    void fetchPatientsPage(page)
  }, [fetchPatientsPage])

  const handleSymptomRulePageChange = useCallback((page: number) => {
    void fetchSymptomRulesPage(page)
  }, [fetchSymptomRulesPage])

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
    if (!window.confirm(`Xóa người dùng ${user.email}?`)) return

    try {
      await deleteUser(user.id)
      await refreshDashboard()
      toastSuccess('Người dùng đã được xóa.')
    } catch (error) {
      const message = getRequestMessage(error, 'Không thể xóa người dùng.')
      setSelectedUser(user)
      setUserEditError(message)
      toastError(message)
    }
  }, [refreshDashboard, toastError, toastSuccess])

  const handleUserSubmit = useCallback(async (payload: UserFormValues) => {
    if (!payload.email) {
      const message = 'Email không được để trống.'
      setUserEditError(message)
      toastWarning(message)
      return
    }

    if (!editingUser && !payload.password) {
      const message = 'Mật khẩu là bắt buộc khi tạo người dùng.'
      setUserEditError(message)
      toastWarning(message)
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
      toastSuccess(editingUser ? 'Người dùng đã được cập nhật.' : 'Người dùng đã được tạo.')
    } catch (error) {
      const message = getRequestMessage(error, 'Không thể lưu người dùng.')
      setUserEditError(message)
      toastError(message)
    } finally {
      setIsSavingUser(false)
    }
  }, [closeUserModal, editingUser, refreshDashboard, toastError, toastSuccess, toastWarning])

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
      const message = 'Tên khoa không được để trống.'
      setDepartmentEditError(message)
      toastWarning(message)
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
      toastSuccess(editingDepartment ? 'Khoa đã được cập nhật.' : 'Khoa đã được tạo.')
    } catch (error) {
      const message = getRequestMessage(error, 'Không thể lưu khoa.')
      setDepartmentEditError(message)
      toastError(message)
    } finally {
      setIsSavingDepartment(false)
    }
  }, [closeDepartmentModal, editingDepartment, refreshDashboard, toastError, toastSuccess, toastWarning])

  const closeSymptomRuleModal = useCallback(() => {
    setIsSymptomRuleModalOpen(false)
    setEditingSymptomRule(null)
    setSymptomRuleEditError('')
  }, [])

  const handleCreateSymptomRule = useCallback(() => {
    setSymptomRuleEditError('')
    setEditingSymptomRule(null)
    setIsSymptomRuleModalOpen(true)
  }, [])

  const handleEditSymptomRule = useCallback((rule: DepartmentSymptomRule) => {
    setSymptomRuleEditError('')
    setEditingSymptomRule(rule)
    setIsSymptomRuleModalOpen(true)
  }, [])

  const handleDeleteSymptomRule = useCallback(async (rule: DepartmentSymptomRule) => {
    const symptomName = rule.symptom?.name || `triệu chứng #${rule.symptom_id}`
    const departmentName = rule.department?.name || `khoa #${rule.department_id}`
    if (!window.confirm(`Xóa ghi chú ${symptomName} - ${departmentName}?`)) return

    try {
      await deleteDepartmentSymptomRule(rule.id)
      await fetchSymptomRulesPage(dashboard.symptomRulePagination.page)
      toastSuccess('Ghi chú triệu chứng đã được xóa.')
    } catch (error) {
      const message = getRequestMessage(error, 'Không thể xóa ghi chú triệu chứng.')
      setEditingSymptomRule(rule)
      setSymptomRuleEditError(message)
      setIsSymptomRuleModalOpen(true)
      toastError(message)
    }
  }, [dashboard.symptomRulePagination.page, fetchSymptomRulesPage, toastError, toastSuccess])

  const handleSymptomRuleSubmit = useCallback(async (payload: SymptomRuleFormValues) => {
    if (!payload.symptomId) {
      const message = 'Triệu chứng không được để trống.'
      setSymptomRuleEditError(message)
      toastWarning(message)
      return
    }

    if (!payload.departmentId) {
      const message = 'Khoa không được để trống.'
      setSymptomRuleEditError(message)
      toastWarning(message)
      return
    }

    const score = Number(payload.score)
    if (!Number.isInteger(score) || score < 1 || score > 10) {
      const message = 'Điểm ưu tiên phải từ 1 đến 10.'
      setSymptomRuleEditError(message)
      toastWarning(message)
      return
    }

    setSymptomRuleEditError('')
    setIsSavingSymptomRule(true)

    try {
      if (editingSymptomRule) {
        await updateDepartmentSymptomRule(editingSymptomRule.id, {
          pre_visit_note: payload.preVisitNote,
          score,
        })
      } else {
        await createDepartmentSymptomRule({
          department_id: payload.departmentId,
          pre_visit_note: payload.preVisitNote,
          score,
          symptom_id: payload.symptomId,
        })
      }

      await fetchSymptomRulesPage(dashboard.symptomRulePagination.page)
      closeSymptomRuleModal()
      toastSuccess(editingSymptomRule ? 'Ghi chú triệu chứng đã được cập nhật.' : 'Ghi chú triệu chứng đã được tạo.')
    } catch (error) {
      const message = getRequestMessage(error, 'Không thể lưu ghi chú triệu chứng.')
      setSymptomRuleEditError(message)
      toastError(message)
    } finally {
      setIsSavingSymptomRule(false)
    }
  }, [closeSymptomRuleModal, dashboard.symptomRulePagination.page, editingSymptomRule, fetchSymptomRulesPage, toastError, toastSuccess, toastWarning])

  const closeDoctorModal = useCallback(() => {
    setEditingDoctor(null)
    setIsDoctorModalOpen(false)
    setDoctorEditError('')
  }, [])

  const handleCreateDoctor = useCallback(() => {
    setDoctorEditError('')
    setEditingDoctor(null)
    setIsDoctorModalOpen(true)
  }, [])

  const handleEditDoctor = useCallback((doctor: DoctorManagementRowData) => {
    setDoctorEditError('')
    setEditingDoctor(doctor)
    setIsDoctorModalOpen(true)
  }, [])

  const handleDoctorEditSubmit = useCallback(async (payload: DoctorEditFormValues) => {
    const isCreatingDoctor = !editingDoctor

    if (!isCreatingDoctor && !editingDoctor?.userId) {
      const message = 'Không tìm thấy user_id của bác sĩ.'
      setDoctorEditError(message)
      toastError(message)
      return
    }

    const fullName = payload.fullName.trim()
    const licenseNumber = payload.licenseNumber.trim()
    const cccd = payload.cccd?.trim() || ''
    const departmentId = payload.departmentId

    if (!fullName) {
      const message = 'Tên bác sĩ không được để trống.'
      setDoctorEditError(message)
      toastWarning(message)
      return
    }

    if (!licenseNumber) {
      const message = 'Mã giấy phép không được để trống.'
      setDoctorEditError(message)
      toastWarning(message)
      return
    }

    if (cccd && !/^\d{12}$/.test(cccd)) {
      const message = 'CCCD phải gồm đúng 12 số.'
      setDoctorEditError(message)
      toastWarning(message)
      return
    }

    setDoctorEditError('')
    setIsSavingDoctor(true)

    try {
      if (isCreatingDoctor) {
        const email = payload.email?.trim() || ''

        if (!email) {
          const message = 'Email không được để trống.'
          setDoctorEditError(message)
          toastWarning(message)
          return
        }

        if (!payload.password) {
          const message = 'Mật khẩu là bắt buộc khi tạo bác sĩ.'
          setDoctorEditError(message)
          toastWarning(message)
          return
        }

        const createdUser = await createUser({
          full_name: fullName,
          email,
          password: payload.password,
          phone: payload.phone?.trim() || null,
          role: 'DOCTOR',
          status: 'ACTIVE',
          doctor_profile: {
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
            image_url: payload.imageUrl?.trim() || null,
          },
        })

        const createdDoctor = departmentId || payload.imageData
          ? await getDoctorByUserId(createdUser.id)
          : null

        if (createdDoctor && payload.imageData) {
          await uploadDoctorImage(createdDoctor.id, payload.imageData)
        }

        if (createdDoctor && departmentId) {
          await createDoctorAssignment({
            doctor_id: createdDoctor.id,
            department_id: departmentId,
            status: 'ACTIVE',
          })
        }

        await refreshDashboard()
        closeDoctorModal()
        toastSuccess('Bác sĩ đã được tạo.')
        return
      }

      if (!editingDoctor) return
      if (!editingDoctor.userId) {
        const message = 'Không tìm thấy user_id của bác sĩ.'
        setDoctorEditError(message)
        toastError(message)
        return
      }

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
      toastSuccess('Bác sĩ đã được cập nhật.')
    } catch (error) {
      const message = getRequestMessage(error, 'Không thể cập nhật bác sĩ.')
      setDoctorEditError(message)
      toastError(message)
    } finally {
      setIsSavingDoctor(false)
    }
  }, [closeDoctorModal, editingDoctor, refreshDashboard, toastError, toastSuccess, toastWarning])

  const userFields = useMemo(() => getUserInfoFields(selectedUser), [selectedUser])
  const doctorFields = useMemo(() => getDoctorInfoFields(selectedDoctor), [selectedDoctor])
  const patientFields = useMemo(() => getPatientInfoFields(selectedPatient), [selectedPatient])

  return {
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
    handleDeleteUser,
    handleDeleteSymptomRule,
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
    isSavingSymptomRule,
    isSavingDepartment,
    isSavingDoctor,
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
    visibleDepartments: dashboard.departments,
    visibleDoctors: dashboard.doctors,
    visiblePatients: dashboard.patients,
    visibleSymptomRules: dashboard.symptomRules,
    visibleUsers: dashboard.users,
  }
}
